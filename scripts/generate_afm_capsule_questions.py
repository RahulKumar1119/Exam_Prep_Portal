#!/usr/bin/env python3
"""
Generate challenging JAIIB AFM MCQs from the Ambitious Baba AFM capsule PDF
using Bedrock `zai.glm-5`, verify every answer key with an independent solve,
and (optionally) upload to the jaiib-question-bank table.

Pipeline:
  1. Download the capsule from S3 and extract per-page text (PyMuPDF).
  2. Split each module's pages into chunks; ask GLM-5 for tricky, application-
     oriented questions (numerical, case-based, multi-statement, conceptual).
  3. Structural validation (4 distinct options, statements present, no
     "all/none of the above", English only, self-contained).
  4. Independent verification: GLM-5 re-solves each question without the key
     (temperature 0); keep only questions it answers identically and does not
     flag as ambiguous.
  5. De-duplicate against the live AFM bank and within the batch.
  6. Select TARGET questions balanced across modules; write a JSON file.

Usage:
  python3 scripts/generate_afm_capsule_questions.py                 # generate -> JSON (dry run)
  python3 scripts/generate_afm_capsule_questions.py --upload FILE   # upload a reviewed JSON
"""
import argparse
import json
import random
import re
import sys
import time
import uuid
from collections import Counter, defaultdict
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime

import boto3
import fitz  # PyMuPDF
from botocore.config import Config

REGION = 'ap-south-1'
MODEL_ID = 'zai.glm-5'
S3_BUCKET = 'courses007'
S3_KEY = 'JAIIB-Capsule-PDF-Paper-3-AFM-by-Ambitious-Baba.pdf'
TABLE = 'jaiib-question-bank'
PAPER = 'AFM'
SOURCE = 'capsule_ambitiousbaba_glm5'
OUT_FILE = '/tmp/afmcap/afm_capsule_questions.json'
REPORT_FILE = '/tmp/afmcap/afm_capsule_report.json'

TARGET = 250
OVERGEN = 1.8             # generate ~80% extra to absorb validation/verification/dedup losses
PAGES_PER_CHUNK = 10
WORKERS = 4

# Module page ranges (1-based, inclusive) from the capsule's table of contents.
MODULES = {
    'A': (2, 77),
    'B': (78, 137),
    'C': (138, 162),
    'D': (163, 275),
}
# Final share per module (sums to TARGET). C is short but numerical-heavy.
MODULE_TARGET = {'A': 65, 'B': 60, 'C': 60, 'D': 65}
MODULE_TOPICS = {
    'A': 'Module A - Accounting Principles and Processes',
    'B': 'Module B - Financial Statements and Core Banking',
    'C': 'Module C - Financial Management',
    'D': 'Module D - Taxation and Costing',
}

bedrock = boto3.client('bedrock-runtime', region_name=REGION,
                       config=Config(read_timeout=300, connect_timeout=20,
                                     retries={'max_attempts': 4, 'mode': 'adaptive'}))

GEN_PROMPT = """You are a senior IIBF paper-setter for JAIIB Paper 3, "Accounting & Financial Management for Bankers" (AFM), {module_name}.

Using the study material below as the factual basis, write exactly {n} NEW, CHALLENGING multiple-choice questions in ENGLISH.

Question mix (vary across the set):
- Numerical problems (at least {n_num}): multi-step calculations (e.g. depreciation SLM/WDV and change of method, BRS adjustments, rectification effects, ratios, working capital, time value of money / NPV / IRR / annuities, capital budgeting, leverage, cost of capital, marginal costing / break-even / margin of safety, standard costing variances, income tax / TDS / GST computations) as applicable to this material. Use realistic Indian figures (Rs. / lakh / crore). Wrong options must be the results of common mistakes (wrong formula, missed step, wrong sign, simple vs compound, etc.).
- Application / case-based: a short banking or business scenario requiring the correct accounting treatment, standard or decision.
- Multi-statement: 3-4 numbered statements written out IN FULL inside question_text (one per line), options like "1 and 2 only"; include subtle, plausible-but-wrong statements.
- Analytical "which is NOT / most appropriate / effect on profit" questions testing in-depth conceptual understanding.

Hard rules:
- Difficulty: about 60% "hard", 40% "medium". No trivial definition questions.
- Every question AND explanation must be fully self-contained, as in a real exam paper: include all data needed and state concepts/formulas directly. NEVER mention the source: no "the text", "the passage", "the PDF", "the study material", "as per the material", "as provided", "according to the text" or page numbers.
- Every piece of data in a numerical question must be either needed or a deliberate, clearly relevant distractor; the intended method must be unambiguous to a well-prepared candidate.
- Exactly 4 options keyed A, B, C, D; exactly ONE correct; options must be distinct. Do NOT use "All of the above", "None of the above" or "Both A and B".
- Compute numerical answers carefully and double-check them; the correct option must exactly match the computation.
- Facts must be consistent with the material and current Indian standards/law as presented in it.
- "explanation": 2-6 sentences with the working/reasoning, ending with "Hence, option X is correct." where X is the correct key.
- "subtopic": the specific concept tested (e.g. "WDV depreciation", "Bank Reconciliation Statement", "NPV", "Break-even analysis", "TDS u/s 194A").
- "qtype": one of "numerical", "case", "statements", "conceptual".

Return ONLY a JSON array, no markdown fences, no commentary:
[{{"question_text": "...", "options": {{"A": "...", "B": "...", "C": "...", "D": "..."}}, "correct_answer": "A", "difficulty": "hard", "qtype": "numerical", "subtopic": "...", "explanation": "..."}}]

STUDY MATERIAL ({module_name}, pages {p1}-{p2}):
<<<
{text}
>>>"""

VERIFY_PROMPT = """You are an expert examiner for JAIIB AFM. Solve each multiple-choice question below independently and carefully (do the full calculation for numerical ones). Do not assume any option is correct.

For each question return:
- "id": the question id
- "answer": the single best option key (A, B, C or D)
- "ambiguous": true if more than one option is defensibly correct, no option is correct, the data is insufficient or contradictory, the intended method is unclear to a well-prepared candidate, or the question is factually wrong under Indian accounting/tax practice; otherwise false

Return ONLY a JSON array, no markdown, no commentary:
[{{"id": 0, "answer": "B", "ambiguous": false}}]

QUESTIONS:
{questions}"""


# ── Helpers ───────────────────────────────────────────────────────────────────

NOISE = re.compile(r'(Ambitiousbaba\.com|Paid Course|Best Study Materials|course\.ambitiousbaba\.com)', re.I)


def clean_page(text):
    lines = [l.rstrip() for l in text.splitlines() if l.strip() and not NOISE.search(l)]
    return '\n'.join(lines)


def norm(s):
    return re.sub(r'[^a-z0-9]', '', (s or '').lower())[:120]


def tokens(s):
    return set(re.findall(r'[a-z0-9]+', (s or '').lower()))


def parse_json_array(text):
    text = (text or '').strip()
    text = re.sub(r'^```(?:json)?\s*', '', text)
    text = re.sub(r'\s*```$', '', text)
    start, end = text.find('['), text.rfind(']')
    if start == -1 or end == -1:
        raise ValueError('no JSON array in response')
    return json.loads(text[start:end + 1])


def converse(prompt, max_tokens, temperature):
    for attempt in range(5):
        try:
            r = bedrock.converse(
                modelId=MODEL_ID,
                messages=[{'role': 'user', 'content': [{'text': prompt}]}],
                inferenceConfig={'maxTokens': max_tokens, 'temperature': temperature},
            )
            parts = [b['text'] for b in r['output']['message']['content'] if 'text' in b]
            return parts[-1] if parts else '', r.get('stopReason')
        except Exception as e:  # throttling / transient
            wait = 5 * (attempt + 1)
            print(f'   ! bedrock error ({e.__class__.__name__}: {str(e)[:120]}), retry in {wait}s', flush=True)
            time.sleep(wait)
    return '', 'error'


BANNED_OPT = re.compile(r'\b(all|none) of the (above|these)\b|\bboth\s+[a-d]\s+and\s+[a-d]\b', re.I)
SOURCE_REF = re.compile(
    r'\b(the|this|above|given|provided)\s+(passage|text|pdf|material|study material|document|capsule|notes)\b'
    r'|\b(as per|according to|in|from)\s+the\s+(text|passage|material|study material|pdf|notes)\b'
    r'|\bstudy material\b|\bpages?\s+\d+', re.I)
THINKING = re.compile(r"self-correct|let me|let's re|re-evaluat|re-check|recalculat|\bwait\b|\bhmm\b|i think|actually,|on second thought", re.I)
STATEMENT_Q = re.compile(r'\b(following|these|above)\s+statements?\b', re.I)


def validate(q):
    """Return None if OK, else a short rejection reason."""
    for f in ('question_text', 'options', 'correct_answer', 'difficulty', 'explanation'):
        if not q.get(f):
            return f'missing {f}'
    qt = str(q['question_text']).strip()
    opts = q['options']
    if not isinstance(opts, dict) or sorted(opts) != ['A', 'B', 'C', 'D']:
        return 'options not A-D'
    vals = [str(v).strip() for v in opts.values()]
    if any(len(v) < 1 for v in vals):
        return 'empty option'
    if len({v.lower() for v in vals}) != 4:
        return 'duplicate options'
    if any(BANNED_OPT.search(v) for v in vals):
        return 'all/none of the above'
    if q['correct_answer'] not in ('A', 'B', 'C', 'D'):
        return 'bad key'
    if q['difficulty'] not in ('easy', 'medium', 'hard'):
        return 'bad difficulty'
    if len(qt) < 40:
        return 'too short'
    if SOURCE_REF.search(qt) or any(SOURCE_REF.search(v) for v in vals):
        return 'refers to source'
    if SOURCE_REF.search(q['explanation']):
        return 'explanation refers to source'
    if THINKING.search(q['explanation']) or THINKING.search(qt):
        return 'model reasoning leaked'
    # Multi-statement questions must actually contain the numbered statements.
    if STATEMENT_Q.search(qt) or any(re.search(r'\b[1-4]\s*(,|and)\s*[1-4]\b', v) for v in vals):
        nums = re.findall(r'(?m)^\s*\(?([1-4])[\.\)]\s+\S', qt)
        if len(set(nums)) < 2:
            return 'statements missing'
    # English only (allow Rs./₹ and common symbols)
    if re.search(r'[\u0900-\u097F\u4e00-\u9fff]', qt + ''.join(vals)):
        return 'non-English text'
    # Explanation should agree with the key when it names an option.
    h = re.findall(r'option\s*\(?([A-D])\)?\s*is\s*(?:the\s*)?correct', q['explanation'], re.I)
    if h and h[-1].upper() != q['correct_answer']:
        return 'explanation contradicts key'
    return None


# ── Stages ────────────────────────────────────────────────────────────────────

def load_pages():
    s3 = boto3.client('s3', region_name=REGION)
    data = s3.get_object(Bucket=S3_BUCKET, Key=S3_KEY)['Body'].read()
    doc = fitz.open(stream=data, filetype='pdf')
    pages = {i + 1: clean_page(doc[i].get_text()) for i in range(doc.page_count)}
    print(f'Loaded {doc.page_count} pages from s3://{S3_BUCKET}/{S3_KEY}')
    return pages


def build_chunks(pages):
    chunks = []
    for mod, (p1, p2) in MODULES.items():
        ranges = [(s, min(s + PAGES_PER_CHUNK - 1, p2)) for s in range(p1, p2 + 1, PAGES_PER_CHUNK)]
        want = round(MODULE_TARGET[mod] * OVERGEN)
        per = [want // len(ranges) + (1 if i < want % len(ranges) else 0) for i in range(len(ranges))]
        for (a, b), n in zip(ranges, per):
            text = '\n'.join(pages.get(p, '') for p in range(a, b + 1)).strip()
            if len(text) < 400 or n == 0:
                continue
            chunks.append({'module': mod, 'p1': a, 'p2': b, 'n': n, 'text': text[:60000]})
    return chunks


def generate_chunk(ch):
    prompt = GEN_PROMPT.format(module_name=MODULE_TOPICS[ch['module']], n=ch['n'],
                               n_num=max(1, round(ch['n'] * 0.35)),
                               p1=ch['p1'], p2=ch['p2'], text=ch['text'])
    for attempt in range(3):
        text, stop = converse(prompt, max_tokens=16000, temperature=0.6)
        try:
            items = parse_json_array(text)
            out = []
            for q in items:
                if isinstance(q, dict):
                    q['module'] = ch['module']
                    q['pages'] = f"{ch['p1']}-{ch['p2']}"
                    q['correct_answer'] = str(q.get('correct_answer', '')).strip().upper()[:1]
                    q['difficulty'] = str(q.get('difficulty', 'medium')).strip().lower()
                    if isinstance(q.get('options'), dict):
                        q['options'] = {k.strip().upper(): str(v).strip() for k, v in q['options'].items()}
                    out.append(q)
            return out
        except Exception as e:
            print(f"   ! parse error module {ch['module']} p{ch['p1']}-{ch['p2']} (stop={stop}): {e}", flush=True)
    return []


def verify_batch(batch):
    payload = [{'id': i, 'question': q['question_text'], 'options': q['options']} for i, q in enumerate(batch)]
    prompt = VERIFY_PROMPT.format(questions=json.dumps(payload, ensure_ascii=False, indent=1))
    for attempt in range(3):
        text, stop = converse(prompt, max_tokens=8000, temperature=0)
        try:
            res = {int(r['id']): r for r in parse_json_array(text) if isinstance(r, dict) and 'id' in r}
            return [res.get(i) for i in range(len(batch))]
        except Exception as e:
            print(f'   ! verify parse error (stop={stop}): {e}', flush=True)
    return [None] * len(batch)


def existing_afm_keys():
    t = boto3.resource('dynamodb', region_name=REGION).Table(TABLE)
    kw = {'IndexName': 'paper-topic-index', 'KeyConditionExpression': 'paper_name = :p',
          'ExpressionAttributeValues': {':p': PAPER}, 'ProjectionExpression': 'question_text'}
    keys, toks = set(), []
    while True:
        r = t.query(**kw)
        for i in r.get('Items', []):
            keys.add(norm(i.get('question_text')))
            toks.append(tokens(i.get('question_text')))
        if 'LastEvaluatedKey' not in r:
            return keys, toks
        kw['ExclusiveStartKey'] = r['LastEvaluatedKey']


def jaccard(a, b):
    return len(a & b) / len(a | b) if a and b else 0.0


def run_generate():
    report = {'rejected': Counter(), 'generated': 0}
    pages = load_pages()
    chunks = build_chunks(pages)
    print(f'{len(chunks)} chunks, requesting {sum(c["n"] for c in chunks)} questions with {MODEL_ID}')

    generated = []
    with ThreadPoolExecutor(WORKERS) as ex:
        futs = {ex.submit(generate_chunk, c): c for c in chunks}
        for f in as_completed(futs):
            c = futs[f]
            items = f.result()
            generated.extend(items)
            print(f"  gen module {c['module']} p{c['p1']}-{c['p2']}: {len(items)}/{c['n']}", flush=True)
    report['generated'] = len(generated)

    valid = []
    for q in generated:
        why = validate(q)
        if why:
            report['rejected'][why] += 1
        else:
            valid.append(q)
    print(f'Structural validation: {len(valid)}/{len(generated)} passed')

    # Independent verification in batches of 8.
    batches = [valid[i:i + 8] for i in range(0, len(valid), 8)]
    verified = []
    with ThreadPoolExecutor(WORKERS) as ex:
        futs = {ex.submit(verify_batch, b): b for b in batches}
        for f in as_completed(futs):
            b = futs[f]
            for q, v in zip(b, f.result()):
                if not v:
                    report['rejected']['verify: no result'] += 1
                elif v.get('ambiguous'):
                    report['rejected']['verify: ambiguous'] += 1
                elif str(v.get('answer', '')).strip().upper()[:1] != q['correct_answer']:
                    report['rejected']['verify: answer mismatch'] += 1
                else:
                    verified.append(q)
    print(f'Verification: {len(verified)}/{len(valid)} confirmed')

    # Dedup vs live bank and within batch.
    live_keys, live_toks = existing_afm_keys()
    kept, kept_toks, seen = [], [], set()
    for q in verified:
        k, tk = norm(q['question_text']), tokens(q['question_text'])
        if k in live_keys or any(jaccard(tk, t) >= 0.85 for t in live_toks):
            report['rejected']['duplicate of live bank'] += 1
            continue
        if k in seen or any(jaccard(tk, t) >= 0.8 for t in kept_toks):
            report['rejected']['duplicate within batch'] += 1
            continue
        seen.add(k)
        kept_toks.append(tk)
        kept.append(q)

    # Balanced selection per module, preferring hard and numerical questions.
    random.seed(87)
    by_mod = defaultdict(list)
    for q in kept:
        by_mod[q['module']].append(q)
    final, short = [], 0
    for mod, want in MODULE_TARGET.items():
        pool = by_mod[mod]
        random.shuffle(pool)
        pool.sort(key=lambda q: (q['difficulty'] != 'hard', q.get('qtype') != 'numerical'))
        final.extend(pool[:want])
        short += max(0, want - len(pool))
    if short:  # top up from modules with surplus
        used = {id(q) for q in final}
        extra = [q for q in kept if id(q) not in used]
        final.extend(extra[:short])

    report['rejected'] = dict(report['rejected'])
    report.update({
        'structurally_valid': len(valid), 'verified': len(verified), 'unique': len(kept),
        'final': len(final),
        'by_module': dict(Counter(q['module'] for q in final)),
        'by_difficulty': dict(Counter(q['difficulty'] for q in final)),
        'by_qtype': dict(Counter(q.get('qtype', '?') for q in final)),
        'by_key': dict(Counter(q['correct_answer'] for q in final)),
    })
    json.dump(final, open(OUT_FILE, 'w'), ensure_ascii=False, indent=1)
    json.dump(report, open(REPORT_FILE, 'w'), indent=1)
    print(json.dumps(report, indent=1))
    print(f'\nWrote {len(final)} questions to {OUT_FILE}')


CRITIC_PROMPT = """You are the chief moderator reviewing JAIIB AFM (Accounting & Financial Management for Bankers) exam questions before publication. Be strict: a flawed question is worse than no question.

For EACH question, decide "pass" only if ALL hold:
1. The premise, data and terminology are factually and technically correct under Indian accounting standards (AS / Ind AS), RBI banking practice, Indian income-tax / GST law and standard financial-management theory.
2. Exactly one option is correct, and the keyed option is that option (check calculations yourself).
3. The question is unambiguous: a well-prepared candidate would arrive at the same answer without guessing the setter's intent; no statement is "debatable" or conditional.
4. The explanation is correct and consistent with the key.

Return ONLY a JSON array, no markdown:
[{{"id": 0, "verdict": "pass", "reason": "short reason"}}]

QUESTIONS:
{questions}"""


def critic_batch(batch):
    payload = [{'id': i, 'question': q['question_text'], 'options': q['options'],
                'key': q['correct_answer'], 'explanation': q['explanation']} for i, q in enumerate(batch)]
    prompt = CRITIC_PROMPT.format(questions=json.dumps(payload, ensure_ascii=False, indent=1))
    for attempt in range(3):
        text, stop = converse(prompt, max_tokens=8000, temperature=0)
        try:
            res = {int(r['id']): r for r in parse_json_array(text) if isinstance(r, dict) and 'id' in r}
            return [res.get(i) for i in range(len(batch))]
        except Exception as e:
            print(f'   ! critic parse error (stop={stop}): {e}', flush=True)
    return [None] * len(batch)


def critic_filter(qs):
    """Keep questions the strict moderator passes. Returns (kept, rejected_with_reason)."""
    batches = [qs[i:i + 6] for i in range(0, len(qs), 6)]
    kept, rejected = [], []
    with ThreadPoolExecutor(WORKERS) as ex:
        for b, res in zip(batches, ex.map(critic_batch, batches)):
            for q, v in zip(b, res):
                if v and str(v.get('verdict', '')).lower() == 'pass':
                    kept.append(q)
                else:
                    rejected.append((q, (v or {}).get('reason', 'no result')))
    return kept, rejected


def _swap_letters_in_text(text, a, b):
    """Swap option-letter references (option A / options A and B / (A)) between a and b."""
    def flip(letter):
        return b if letter == a else a if letter == b else letter

    # "option A", "options A, B and D", "option (C)"
    lists = re.compile(r'\b([Oo]ptions?\s+)(\(?[A-D]\)?(?:(?:\s*,\s*|\s+and\s+|\s+or\s+)\(?[A-D]\)?)*)(?![A-Za-z])')
    # bare "(A)" references are handled in the same single pass (no double flip)
    combined = re.compile(lists.pattern + r'|\(([A-D])\)')

    def sub(m):
        if m.group(1) is not None:
            return m.group(1) + re.sub(r'[A-D]', lambda x: flip(x.group(0)), m.group(2))
        return f'({flip(m.group(3))})'
    return combined.sub(sub, text)


def rebalance_keys(qs, seed=87):
    """Move each correct option to a balanced A/B/C/D position (swap with the occupant)."""
    rnd = random.Random(seed)
    targets = [('ABCD'[i % 4]) for i in range(len(qs))]
    rnd.shuffle(targets)
    for q, tgt in zip(qs, targets):
        cur = q['correct_answer']
        if cur == tgt:
            continue
        o = q['options']
        o[cur], o[tgt] = o[tgt], o[cur]
        q['options'] = {k: o[k] for k in 'ABCD'}
        q['correct_answer'] = tgt
        q['explanation'] = _swap_letters_in_text(q['explanation'], cur, tgt)
    return qs


def run_finalize(path):
    """Rebalance answer positions, then re-verify every question from scratch."""
    qs = json.load(open(path))
    rebalance_keys(qs)
    batches = [qs[i:i + 8] for i in range(0, len(qs), 8)]
    keep, dropped = [], Counter()
    with ThreadPoolExecutor(WORKERS) as ex:
        futs = {ex.submit(verify_batch, b): b for b in batches}
        for f in as_completed(futs):
            for q, v in zip(futs[f], f.result()):
                if not v:
                    dropped['no result'] += 1
                elif v.get('ambiguous'):
                    dropped['ambiguous'] += 1
                elif str(v.get('answer', '')).strip().upper()[:1] != q['correct_answer']:
                    dropped['answer mismatch'] += 1
                elif validate(q):
                    dropped[validate(q)] += 1
                else:
                    keep.append(q)
    out = path.replace('.json', '_final.json')
    json.dump(keep, open(out, 'w'), ensure_ascii=False, indent=1)
    print(json.dumps({'kept': len(keep), 'dropped': dict(dropped),
                      'by_key': dict(Counter(q['correct_answer'] for q in keep)),
                      'by_module': dict(Counter(q['module'] for q in keep)),
                      'by_difficulty': dict(Counter(q['difficulty'] for q in keep))}, indent=1))
    print(f'Wrote {out}')


REPAIR_PROMPT = """Rewrite ONLY the explanation of this JAIIB AFM exam question so it reads like an official answer key: self-contained, 2-6 sentences, keeping all reasoning and calculations. Remove every mention of a source ("the text", "the material", "as per the study material", "as provided", page numbers). Do not change the answer. End with "Hence, option {key} is correct."

Question: {question}
Options: {options}
Correct option: {key}
Current explanation: {explanation}

Return ONLY the new explanation text."""


def repair_explanation(q):
    prompt = REPAIR_PROMPT.format(question=q['question_text'], options=json.dumps(q['options'], ensure_ascii=False),
                                  key=q['correct_answer'], explanation=q['explanation'])
    text, _ = converse(prompt, max_tokens=1500, temperature=0)
    text = re.sub(r'^```\w*\s*|\s*```$', '', (text or '').strip()).strip().strip('"')
    return text or None


TOPUP_RULES = """
Additional strict rules (from editorial review):
- NO one-step or definition-recall questions; every question needs at least two reasoning or calculation steps.
- For numerical questions, state any rounding convention (e.g. "nearest rupee", "two decimals") and make the correct option EXACTLY equal to the result. Use only the data given; never contradict it.
- Add a field "calc": a single plain arithmetic expression (digits, + - * / ** and parentheses only, no commas or units) whose value is the main number in the correct option. Use "" for non-numerical questions.
- For matching questions label the items P, Q, R, S (never A-D) so they cannot be confused with option keys.
- Never refer to other questions ("previous question", "Q7"). Do not state facts that are disputed, outdated, or depend on the latest amendments.
- AVOID these already well-covered topics: performance budgeting, Rule of 72, simple-interest maturity amounts, future value of a Rs. 10,000 annuity, target-profit sales volume, lessor initial direct costs, current yield of a bond, Section 206CCA, absorption vs marginal costing profit difference, lessor finance-lease receivable, share forfeiture/reissue, insolvent debtor paying paise in the rupee, SLM depreciation for part year.
- The correct option for question k (1-based) MUST be the letter at position k of this sequence: {letters}
"""

import ast
import operator as _op

_OPS = {ast.Add: _op.add, ast.Sub: _op.sub, ast.Mult: _op.mul, ast.Div: _op.truediv,
        ast.Pow: _op.pow, ast.USub: _op.neg, ast.UAdd: _op.pos}


def safe_eval(expr):
    """Evaluate a plain arithmetic expression without exec/eval."""
    def ev(n):
        if isinstance(n, ast.Expression):
            return ev(n.body)
        if isinstance(n, ast.Constant) and isinstance(n.value, (int, float)):
            return n.value
        if isinstance(n, ast.BinOp) and type(n.op) in _OPS:
            if isinstance(n.op, ast.Pow) and abs(ev(n.right)) > 50:
                raise ValueError('exponent too large')
            return _OPS[type(n.op)](ev(n.left), ev(n.right))
        if isinstance(n, ast.UnaryOp) and type(n.op) in _OPS:
            return _OPS[type(n.op)](ev(n.operand))
        raise ValueError('disallowed expression')
    return ev(ast.parse(str(expr).replace(',', ''), mode='eval'))


def first_number(text):
    m = re.search(r'-?\d[\d,]*\.?\d*', str(text).replace('Rs.', '').replace('₹', ''))
    return float(m.group(0).replace(',', '')) if m else None


def calc_check(q):
    """None if OK/not applicable; else a reason. Numerical questions must carry a matching calc."""
    if q.get('qtype') != 'numerical':
        return None
    expr = str(q.get('calc') or '').strip()
    if not expr:
        return 'calc missing'
    try:
        val = safe_eval(expr)
    except Exception:
        return 'calc invalid'
    key_text = str(q['options'].get(q['correct_answer'], '')).replace('Rs.', '').replace('₹', '')
    m = re.search(r'-?\d[\d,]*(\.(\d+))?', key_text)
    if not m:
        return 'no number in key'
    want = float(m.group(0).replace(',', ''))
    decimals = len(m.group(2) or '')
    # The keyed value must equal the computed value rounded to the precision shown.
    if abs(val - want) > 0.5 * 10 ** (-decimals) + 1e-9:
        return f'calc mismatch ({val:.6g} vs {want:.6g})'
    return None


def run_topup(base_path, need_by_module, factor=2.2):
    """Generate extra questions for specific modules with balanced prescribed keys."""
    base = json.load(open(base_path))
    counts = Counter(q['correct_answer'] for q in base)
    pages = load_pages()
    chunks = [c for c in build_chunks(pages) if need_by_module.get(c['module'])]
    plan = []
    for mod, need in need_by_module.items():
        cs = [c for c in chunks if c['module'] == mod]
        want = round(need * factor)
        for i, c in enumerate(cs):
            n = want // len(cs) + (1 if i < want % len(cs) else 0)
            if n:
                plan.append(dict(c, n=n))
    # Prescribe answer letters so the final set stays balanced (no post-hoc swapping).
    total = sum(c['n'] for c in plan)
    target = (len(base) + total) / 4
    pool = []
    for letter in 'ABCD':
        pool += [letter] * max(0, round(target - counts[letter]))
    while len(pool) < total:
        pool += list('ABCD')
    random.Random(287).shuffle(pool)
    for c in plan:
        c['letters'], pool = pool[:c['n']], pool[c['n']:]

    def gen(c):
        prompt = GEN_PROMPT.format(module_name=MODULE_TOPICS[c['module']], n=c['n'],
                                   n_num=max(1, round(c['n'] * 0.4)), p1=c['p1'], p2=c['p2'],
                                   text=c['text'])
        prompt = prompt.replace('STUDY MATERIAL (', TOPUP_RULES.format(letters=', '.join(c['letters'])) + '\nSTUDY MATERIAL (', 1)
        for attempt in range(3):
            text, stop = converse(prompt, max_tokens=16000, temperature=0.6)
            try:
                out = []
                for q in parse_json_array(text):
                    if isinstance(q, dict) and isinstance(q.get('options'), dict):
                        q['module'], q['pages'] = c['module'], f"{c['p1']}-{c['p2']}"
                        q['correct_answer'] = str(q.get('correct_answer', '')).strip().upper()[:1]
                        q['difficulty'] = str(q.get('difficulty', 'medium')).strip().lower()
                        q['options'] = {k.strip().upper(): str(v).strip() for k, v in q['options'].items()}
                        q['_prescribed'] = c['letters'][len(out)] if len(out) < len(c['letters']) else ''
                        out.append(q)
                return out
            except Exception as e:
                print(f"   ! parse error {c['module']} p{c['p1']}: {e}", flush=True)
        return []

    print(f'top-up: {len(plan)} chunks, requesting {total}')
    with ThreadPoolExecutor(WORKERS) as ex:
        generated = [q for r in ex.map(gen, plan) for q in r]
    rej = Counter()
    # Repair pass: explanations that only cite "the text/material" get rewritten (explanation only).
    to_fix = [q for q in generated if validate(q) == 'explanation refers to source']
    if to_fix:
        with ThreadPoolExecutor(WORKERS) as ex:
            for q, new in zip(to_fix, ex.map(repair_explanation, to_fix)):
                if new:
                    q['explanation'] = new
                    q['repaired'] = True
    valid = []
    for q in generated:
        why = validate(q) or calc_check(q)
        q['_reject'] = why
        if why:
            rej[why.split(' (')[0]] += 1
        else:
            valid.append(q)
    json.dump(generated, open(base_path.replace('.json', '_topup_debug.json'), 'w'), ensure_ascii=False, indent=1)
    print('prescribed-key compliance:', sum(1 for q in generated if q.get('_prescribed') == q['correct_answer']), '/', len(generated))

    def verify(qs):
        out = []
        batches = [qs[i:i + 8] for i in range(0, len(qs), 8)]
        with ThreadPoolExecutor(WORKERS) as ex:
            for b, res in zip(batches, ex.map(verify_batch, batches)):
                for q, v in zip(b, res):
                    if v and not v.get('ambiguous') and str(v.get('answer', '')).strip().upper()[:1] == q['correct_answer']:
                        out.append(q)
                    else:
                        rej['verify'] += 1
        return out

    verified = verify(verify(valid))  # two independent solves must both agree
    live_keys, live_toks = existing_afm_keys()
    kept_toks = [tokens(q['question_text']) for q in base]
    kept_keys = {norm(q['question_text']) for q in base}
    uniq = []
    for q in verified:
        k, tk = norm(q['question_text']), tokens(q['question_text'])
        if (k in live_keys or k in kept_keys or any(jaccard(tk, t) >= 0.85 for t in live_toks)
                or any(jaccard(tk, t) >= 0.7 for t in kept_toks)):
            rej['duplicate'] += 1
            continue
        kept_keys.add(k)
        kept_toks.append(tk)
        uniq.append(q)
    out = base_path.replace('.json', '_topup_candidates.json')
    json.dump(uniq, open(out, 'w'), ensure_ascii=False, indent=1)
    print(json.dumps({'generated': len(generated), 'valid': len(valid), 'verified': len(verified),
                      'unique': len(uniq), 'rejected': dict(rej),
                      'by_module': dict(Counter(q['module'] for q in uniq)),
                      'by_key': dict(Counter(q['correct_answer'] for q in uniq)),
                      'key_followed': sum(1 for q in generated if q['correct_answer'] in 'ABCD')}, indent=1))
    print(f'Wrote {out}')


def run_upload(path):
    qs = json.load(open(path))
    for q in qs:
        why = validate(q)
        if why:
            sys.exit(f'Refusing upload: invalid question ({why}): {q["question_text"][:80]}')
    t = boto3.resource('dynamodb', region_name=REGION).Table(TABLE)
    now = datetime.utcnow().isoformat()
    with t.batch_writer() as bw:
        for q in qs:
            bw.put_item(Item={
                'question_id': str(uuid.uuid4()),
                'version': '1',
                'paper_name': PAPER,
                'topic': MODULE_TOPICS[q['module']],
                'subtopic': q.get('subtopic', ''),
                'difficulty': q['difficulty'],
                'question_type': 'single_choice',
                'question_text': q['question_text'].strip(),
                'options': q['options'],
                'correct_answer': q['correct_answer'],
                'explanation': q['explanation'].strip(),
                'source': SOURCE,
                'reference': f"AFM Capsule (Ambitious Baba) pp. {q['pages']}",
                'status': 'active',
                'created_at': now,
                'updated_at': now,
            })
    print(f'Uploaded {len(qs)} AFM questions (source={SOURCE}).')


if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('--upload', metavar='JSON', help='upload a reviewed JSON file instead of generating')
    ap.add_argument('--finalize', metavar='JSON', help='rebalance answer keys and re-verify a generated JSON')
    ap.add_argument('--topup', metavar='JSON', help='generate verified top-up candidates for a reviewed JSON')
    ap.add_argument('--need', default='A=8,B=18,C=18,D=25', help='per-module shortfall for --topup')
    ap.add_argument('--factor', type=float, default=2.2, help='over-generation factor for --topup')
    args = ap.parse_args()
    if args.topup:
        need = {k: int(v) for k, v in (p.split('=') for p in args.need.split(','))}
        run_topup(args.topup, need, factor=args.factor)
    elif args.finalize:
        run_finalize(args.finalize)
    elif args.upload:
        run_upload(args.upload)
    else:
        run_generate()
