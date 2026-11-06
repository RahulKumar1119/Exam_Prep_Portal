#!/usr/bin/env python3
"""
Import JAIIB AFM previous-year (memory-based) questions into DynamoDB.

The PYQ PDFs (one per exam cycle, all 4 papers) share a layout for each paper:
  - Section I questions  : grouped under "Module A".."Module D", numbered Q1..Qn
  - Answer key           : a Question/Answer table
  - Answers+explanations : "Qn. Answer: X  Explanation: ... Difficulty Level: ..."

Usage:
  python3 import_afm_pyq.py --edition nov2025            # dry run
  python3 import_afm_pyq.py --edition nov2025 --upload   # write to jaiib-question-bank
"""
import re
import sys
import uuid
import argparse
from collections import Counter
from datetime import datetime

import fitz  # PyMuPDF
import boto3

PAPER = 'AFM'
TABLE = 'jaiib-question-bank'
REGION = 'ap-south-1'
DUMPS = '/home/rahul/Downloads/JAIIB_Exam_dumps'

# Page ranges are 1-based and inclusive.
EDITIONS = {
    'may2026': {
        'pdf': f'{DUMPS}/JAIIB_May_2026_PYQs.pdf',
        'label': 'JAIIB May 2026',
        'source': 'pyq_may_2026',
        'q_pages': (180, 213),
        'key_pages': (215, 216),
        'expl_pages': (216, 277),
        # Q112: the PDF's own working gives A better EPS (4.45 vs 3.13) and B better
        # OPR (60% vs 50%) = option C, but the PDF labels it D/A.
        'answer_overrides': {112: 'C'},
    },
    'nov2025': {
        'pdf': f'{DUMPS}/JAIIB_Nov_2025.pdf',
        'label': 'JAIIB Nov 2025',
        'source': 'pyq_nov_2025',
        'q_pages': (180, 198),
        'key_pages': (200, 200),
        'expl_pages': (201, 242),
        # Verified against the PDF's own working (header/key are wrong):
        #  Q51: FV annuity 2,00,000 x [(1.09^10-1)/0.09] = 30,38,586 -> B (PDF key: C)
        #  Q60: BEP = 1,60,000 / (200-120) = 2,000 units -> B (PDF key: A)
        #  Q63: direct cost = directly traceable, no apportionment -> B (PDF key: C)
        'answer_overrides': {51: 'B', 60: 'B', 63: 'B'},
    },
}

MODULE_TOPICS = {
    'A': 'Module A - Accounting Principles and Processes',
    'B': 'Module B - Financial Statements and Core Banking',
    'C': 'Module C - Financial Management',
    'D': 'Module D - Taxation and Costing',
}
DIFFICULTY = {'easy': 'easy', 'moderate': 'medium', 'medium': 'medium',
              'difficult': 'hard', 'hard': 'hard', 'tough': 'hard'}

NOISE = re.compile(
    r'^(\d{1,3}|Recollected Questions|JAIIB \w+ 20\d\d Exam of AFM.*|'
    r'Note- This section.*|us\. They have been presented.*|carefully preserving.*|'
    r'Answer Key.*|Explanations?)$', re.I)
SELECT = re.compile(r'\(\s*Select the most appropriate answer from the options given below\s*\)', re.I)
HENCE = re.compile(r'Hence,?\s*(?:the\s+)?option\s*\(?\s*[A-Da-d]\s*\)?\s*is the correct answer\.?', re.I)
# "Q1. ...", "Q71, ...", and "Q33 Which ..." (no separator) all start a question.
Q_START = re.compile(r'^Q\s*(\d{1,3})(?:\s*[.,:]\s*|\s+)(.*)')


def pages(rng):
    return range(rng[0], rng[1] + 1)


def page_lines(doc, rng, drop_modules=False):
    lines = []
    for pn in pages(rng):
        for ln in doc[pn - 1].get_text().splitlines():
            # PDFs use \x03 (and zero-width spaces) as glyph separators after option
            # letters / bullets: "A.\x03 Deferred..." — normalise to plain spaces.
            ln = re.sub(r'[\x00-\x08\x0b-\x1f\u200b\u00a0]', ' ', ln).strip()
            if not ln or NOISE.match(ln):
                continue
            if drop_modules and re.match(r'^Module\s+[A-D]\s*$', ln):
                continue
            lines.append(ln)
    return lines


def clean(text):
    text = SELECT.sub('', text)
    text = re.sub(r'[ \t]+', ' ', text)
    text = re.sub(r'\s*\n\s*', '\n', text)
    return text.strip()


def split_options(lines):
    """Options are the LAST run of lines starting A., B., C., D. — earlier "A." lines
    (e.g. Column B items in match-the-column questions) stay in the stem."""
    starts = [i for i, ln in enumerate(lines) if re.match(r'^A\.\s', ln)]
    if not starts:
        return lines, {}
    first = starts[-1]
    stem, options, key = lines[:first], {}, None
    for ln in lines[first:]:
        m = re.match(r'^([A-D])\.\s*(.*)', ln)
        if m and (m.group(1) == 'A' or key):
            key = m.group(1)
            options[key] = m.group(2)
        elif key:
            options[key] += ' ' + ln
    return stem, options


def parse_questions(doc, cfg):
    blocks, module, cur = [], None, None
    for ln in page_lines(doc, cfg['q_pages']):
        m_mod = re.match(r'^Module\s+([A-D])\b', ln)
        if m_mod:
            module = m_mod.group(1)
            continue
        m_q = Q_START.match(ln)
        if m_q:
            if cur:
                blocks.append(cur)
            cur = {'num': int(m_q.group(1)), 'module': module, 'lines': [m_q.group(2)]}
            continue
        if cur:
            cur['lines'].append(ln)
    if cur:
        blocks.append(cur)

    out = []
    for b in blocks:
        stem, options = split_options(b['lines'])
        out.append({
            'num': b['num'],
            'module': b['module'],
            'question_text': clean('\n'.join(stem)),
            'options': {k: clean(v) for k, v in options.items()},
        })
    return out


def parse_explanations(doc, cfg):
    text = '\n'.join(page_lines(doc, cfg['expl_pages'], drop_modules=True))
    # "Q5. Answer: B", "Q5. Answer: Option B", "Q118. Answer: [C]", "Q36 Answer: A"
    parts = re.split(r'\n?Q\s*(\d{1,3})\s*[.,]?\s*Answer\s*:\s*(?:Option\s*)?\[?\(?\s*([A-D])\s*\)?\]?', text)
    res = {}
    for i in range(1, len(parts) - 2, 3):
        num, ans, body = int(parts[i]), parts[i + 1], parts[i + 2]
        diff = None
        m_d = re.search(r'Difficulty Level\s*:\s*([A-Za-z]+)', body)
        if m_d:
            diff = DIFFICULTY.get(m_d.group(1).lower(), 'medium')
            body = body[:m_d.start()]
        body = re.sub(r'^\s*Explanation\s*:\s*', '', body.strip(), flags=re.I)
        res[num] = {'answer': ans, 'explanation': clean(body), 'difficulty': diff or 'medium'}
    return res


def parse_answer_key(doc, cfg):
    toks = []
    for pn in pages(cfg['key_pages']):
        toks += [t.strip() for t in doc[pn - 1].get_text().splitlines() if t.strip()]
    key = {}
    for a, b in zip(toks, toks[1:]):
        if a.isdigit() and re.fullmatch(r'[A-D]', b) and 1 <= int(a) <= 200:
            key[int(a)] = b
    return key


def norm(s):
    return re.sub(r'[^a-z0-9]', '', (s or '').lower())[:120]


def existing_afm_keys():
    t = boto3.resource('dynamodb', region_name=REGION).Table(TABLE)
    kw = {'IndexName': 'paper-topic-index',
          'KeyConditionExpression': 'paper_name = :p',
          'ExpressionAttributeValues': {':p': PAPER},
          'ProjectionExpression': 'question_text'}
    keys = set()
    while True:
        r = t.query(**kw)
        keys.update(norm(i.get('question_text')) for i in r.get('Items', []))
        if 'LastEvaluatedKey' not in r:
            return keys
        kw['ExclusiveStartKey'] = r['LastEvaluatedKey']


def build(cfg):
    """Parse + reconcile. Returns (questions, report dict)."""
    doc = fitz.open(cfg['pdf'])
    qs = parse_questions(doc, cfg)
    ex = parse_explanations(doc, cfg)
    key = parse_answer_key(doc, cfg)
    report = {
        'parsed': len(qs), 'explained': len(ex), 'key': len(key),
        'key_mismatch': [(n, ex[n]['answer'], key[n]) for n in ex if n in key and ex[n]['answer'] != key[n]],
        'missing_from_expl_filled_by_key': [],
    }
    for n, a in key.items():
        if n not in ex:
            ex[n] = {'answer': a, 'explanation': '', 'difficulty': 'medium'}
            report['missing_from_expl_filled_by_key'].append(n)
    for n, a in cfg['answer_overrides'].items():
        if n in ex:
            ex[n]['answer'] = a
    # Closing "Hence, option X" must agree with the stored answer.
    report['hence_fixed'] = []
    for n, e in ex.items():
        h = re.findall(r'Hence,?\s*(?:the\s+)?option\s*\(?\s*([A-Da-d])', e['explanation'], re.I)
        if h and h[-1].upper() != e['answer']:
            report['hence_fixed'].append((n, h[-1].upper(), e['answer']))
        e['explanation'] = HENCE.sub(f"Hence, option {e['answer']} is the correct answer.", e['explanation'])

    valid, rejected = [], []
    for q in qs:
        e = ex.get(q['num'])
        reasons = []
        if len(q['question_text']) < 15:
            reasons.append('short/empty stem')
        if sorted(q['options']) != ['A', 'B', 'C', 'D'] or any(not v for v in q['options'].values()):
            reasons.append(f"options {sorted(q['options'])}")
        if not e:
            reasons.append('no answer')
        elif e['answer'] not in q['options']:
            reasons.append('answer not in options')
        if not q['module']:
            reasons.append('no module')
        (rejected.append((q['num'], reasons)) if reasons else valid.append({**q, **e}))
    report['rejected'] = rejected
    return valid, report


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--edition', required=True, choices=sorted(EDITIONS))
    ap.add_argument('--upload', action='store_true')
    args = ap.parse_args()
    cfg = EDITIONS[args.edition]

    valid, rep = build(cfg)
    print(f"{cfg['label']}: parsed {rep['parsed']} questions, {rep['explained']} explanations, {rep['key']} key entries")
    if rep['key_mismatch']:
        print('Answer key vs explanation header mismatch (q, expl, key):', rep['key_mismatch'])
    if rep['missing_from_expl_filled_by_key']:
        print('No explanation block, answer taken from key:', rep['missing_from_expl_filled_by_key'])
    if cfg['answer_overrides']:
        print('Answer overrides applied:', cfg['answer_overrides'])
    if rep['hence_fixed']:
        print("'Hence, option X' aligned to answer (q, was, now):", rep['hence_fixed'])

    existing = existing_afm_keys()
    seen, new, dupes = set(), [], []
    for q in valid:
        k = norm(q['question_text'])
        if k in existing or k in seen:
            dupes.append(q['num'])
        else:
            seen.add(k)
            new.append(q)

    print(f"Valid: {len(valid)} | Rejected: {len(rep['rejected'])} | Already in bank/duplicate: {len(dupes)} | NEW: {len(new)}")
    print('By module:', dict(Counter(q['module'] for q in new)))
    print('By difficulty:', dict(Counter(q['difficulty'] for q in new)))
    print('Answer dist:', dict(Counter(q['answer'] for q in new)))
    if rep['rejected']:
        print('Rejected:', rep['rejected'])
    if dupes:
        print('Duplicates (skipped):', dupes)
    for q in new[:2] + new[-1:]:
        print(f"\n--- Q{q['num']} [Module {q['module']}, {q['difficulty']}] ans={q['answer']}")
        print(q['question_text'][:400])
        for k, v in q['options'].items():
            print(f'   {k}. {v[:100]}')
        print('   expl:', q['explanation'][:140].replace('\n', ' '))

    if not args.upload:
        print('\nDry run — re-run with --upload to write to DynamoDB.')
        return

    t = boto3.resource('dynamodb', region_name=REGION).Table(TABLE)
    now = datetime.utcnow().isoformat()
    with t.batch_writer() as bw:
        for q in new:
            bw.put_item(Item={
                'question_id': str(uuid.uuid4()),
                'version': '1',
                'paper_name': PAPER,
                'topic': MODULE_TOPICS[q['module']],
                'difficulty': q['difficulty'],
                'question_type': 'single_choice',
                'question_text': q['question_text'],
                'options': q['options'],
                'correct_answer': q['answer'],
                'explanation': q['explanation'],
                'source': cfg['source'],
                'reference': f"{cfg['label']} AFM PYQ Q{q['num']}",
                'status': 'active',
                'created_at': now,
                'updated_at': now,
            })
    print(f"\nUploaded {len(new)} AFM questions (source={cfg['source']}).")


if __name__ == '__main__':
    main()
