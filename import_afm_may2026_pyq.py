#!/usr/bin/env python3
"""
Import JAIIB May 2026 AFM previous-year (memory-based) questions into DynamoDB.

Source: JAIIB_May_2026_PYQs.pdf (all 4 papers). AFM layout:
  - Section I questions  : pages 180-213, grouped under "Module A".."Module D"
  - Answer key           : page 215
  - Answers+explanations : pages 216-277 ("Qn. Answer: X  Explanation: ... Difficulty Level: ...")

Usage:
  python3 import_afm_may2026_pyq.py            # dry run: parse, validate, dedupe, preview
  python3 import_afm_may2026_pyq.py --upload   # write new questions to jaiib-question-bank
"""
import re
import sys
import uuid
import argparse
from datetime import datetime

import fitz  # PyMuPDF
import boto3

PDF = '/home/rahul/Downloads/JAIIB_Exam_dumps/JAIIB_May_2026_PYQs.pdf'
PAPER = 'AFM'
TABLE = 'jaiib-question-bank'
REGION = 'ap-south-1'
SOURCE = 'pyq_may_2026'

Q_PAGES = range(180, 214)      # 1-based, inclusive 180..213
EXPL_PAGES = range(216, 278)   # 1-based, inclusive 216..277

MODULE_TOPICS = {
    'A': 'Module A - Accounting Principles and Processes',
    'B': 'Module B - Financial Statements and Core Banking',
    'C': 'Module C - Financial Management',
    'D': 'Module D - Taxation and Costing',
}
DIFFICULTY = {'easy': 'easy', 'moderate': 'medium', 'medium': 'medium',
              'difficult': 'hard', 'hard': 'hard', 'tough': 'hard'}

NOISE = re.compile(
    r'^(\d{1,3}|Recollected Questions|JAIIB May 2026 Exam of AFM.*|'
    r'Note- This section.*|us\. They have been presented.*|carefully preserving.*|'
    r'Answer Key.*|Explanations?)$', re.I)
SELECT = re.compile(r'\(\s*Select the most appropriate answer from the options given below\s*\)', re.I)


def page_lines(doc, pages):
    lines = []
    for pn in pages:
        for ln in doc[pn - 1].get_text().splitlines():
            ln = ln.strip().replace('\u200b', '')
            if ln and not NOISE.match(ln):
                lines.append(ln)
    return lines


def clean(text):
    text = SELECT.sub('', text)
    text = re.sub(r'[ \t]+', ' ', text)
    text = re.sub(r'\s*\n\s*', '\n', text)
    return text.strip()


def parse_questions(doc):
    lines = page_lines(doc, Q_PAGES)
    blocks, module, cur = [], None, None
    for ln in lines:
        m_mod = re.match(r'^Module\s+([A-D])\b', ln)
        if m_mod:
            module = m_mod.group(1)
            continue
        m_q = re.match(r'^Q(\d{1,3})\.\s*(.*)', ln)
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
        text = '\n'.join(b['lines'])
        # Options: lines starting with "A. ", "B. ", ... ; continuation lines join the open option
        stem_lines, options, key = [], {}, None
        for ln in b['lines']:
            m_o = re.match(r'^([A-D])\.\s*(.*)', ln)
            if m_o and (m_o.group(1) == 'A' or key):
                key = m_o.group(1)
                options[key] = m_o.group(2)
            elif key:
                options[key] += ' ' + ln
            else:
                stem_lines.append(ln)
        out.append({
            'num': b['num'],
            'module': b['module'],
            'question_text': clean('\n'.join(stem_lines)),
            'options': {k: clean(v) for k, v in options.items()},
        })
    return out


def parse_explanations(doc):
    text = '\n'.join(page_lines(doc, EXPL_PAGES))
    res = {}
    # Handles "Q5. Answer: B", "Q5. Answer: Option B", "Q118. Answer: [C]", "Q36 Answer: A"
    parts = re.split(r'\n?Q(\d{1,3})\.?\s*Answer\s*:\s*(?:Option\s*)?\[?\s*([A-D])\s*\]?', text)
    # parts: [pre, num, ans, body, num, ans, body, ...]
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


def parse_answer_key(doc):
    """Answer key table on pages 215-216: tokens alternate question-number / letter."""
    toks = []
    for pn in (215, 216):
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


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--upload', action='store_true')
    args = ap.parse_args()

    doc = fitz.open(PDF)
    qs = parse_questions(doc)
    ex = parse_explanations(doc)
    key = parse_answer_key(doc)
    print(f'Parsed {len(qs)} questions, {len(ex)} answers/explanations, {len(key)} answer-key entries')
    mismatches = [(n, ex[n]['answer'], key[n]) for n in ex if n in key and ex[n]['answer'] != key[n]]
    if mismatches:
        print('Answer key vs explanation MISMATCH (q, explanation, key):', mismatches)

    # Q112: the PDF's own working gives A better EPS (4.45 vs 3.13) and B better
    # OPR (60% vs 50%) = option C, but the PDF labels it D/A. Store the correct one.
    if 112 in ex:
        ex[112]['answer'] = 'C'
    # Some explanations end with a typo'd "Hence, option X" (Q21, Q48, Q81, Q114) that
    # contradicts the answer key and their own reasoning. Make the closing line agree.
    for e in ex.values():
        e['explanation'] = re.sub(r'Hence,?\s*option\s*\(?[A-D]\)?\s*is the correct answer\.?',
                                  f"Hence, option {e['answer']} is the correct answer.", e['explanation'])

    valid, rejected = [], []
    for q in qs:
        e = ex.get(q['num'])
        reasons = []
        if len(q['question_text']) < 15:
            reasons.append('short/empty stem')
        if sorted(q['options']) != ['A', 'B', 'C', 'D'] or any(len(v) < 1 for v in q['options'].values()):
            reasons.append(f"options {sorted(q['options'])}")
        if not e:
            reasons.append('no answer')
        elif e['answer'] not in q['options']:
            reasons.append('answer not in options')
        if not q['module']:
            reasons.append('no module')
        if reasons:
            rejected.append((q['num'], reasons))
        else:
            valid.append({**q, **e})

    existing = existing_afm_keys()
    seen, new, dupes = set(), [], []
    for q in valid:
        k = norm(q['question_text'])
        if k in existing or k in seen:
            dupes.append(q['num'])
        else:
            seen.add(k)
            new.append(q)

    from collections import Counter
    print(f'Valid: {len(valid)} | Rejected: {len(rejected)} | Already in bank/duplicate: {len(dupes)} | NEW: {len(new)}')
    print('By module:', dict(Counter(q['module'] for q in new)))
    print('By difficulty:', dict(Counter(q['difficulty'] for q in new)))
    print('Answer dist:', dict(Counter(q['answer'] for q in new)))
    if rejected:
        print('Rejected:', rejected)
    if dupes:
        print('Duplicates (skipped):', dupes)
    for q in new[:3] + new[-1:]:
        print(f"\n--- Q{q['num']} [Module {q['module']}, {q['difficulty']}] ans={q['answer']}")
        print(q['question_text'][:300])
        for k, v in q['options'].items():
            print(f'   {k}. {v[:100]}')
        print('   expl:', q['explanation'][:160].replace('\n', ' '))

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
                'source': SOURCE,
                'reference': f"JAIIB May 2026 AFM PYQ Q{q['num']}",
                'status': 'active',
                'created_at': now,
                'updated_at': now,
            })
    print(f'\nUploaded {len(new)} AFM questions (source={SOURCE}).')


if __name__ == '__main__':
    main()
