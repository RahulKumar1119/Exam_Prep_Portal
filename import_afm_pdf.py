#!/usr/bin/env python3
"""
Parse AFM.pdf and upload all MCQs to jaiib-question-bank DynamoDB.

PDF format:
  Question text (may span multiple lines)
  (optional roman numeral statements)
  a. option text
  b. option text
  c. option text
  d. option text
  Ans - x  (or Ans – x  or Ans: x)
  .....  (separator)
"""

import re
import uuid
import sys
from datetime import datetime

try:
    import fitz  # PyMuPDF
except ImportError:
    print("Run: pip3 install pymupdf"); sys.exit(1)

try:
    import boto3
except ImportError:
    print("Run: pip3 install boto3"); sys.exit(1)

TABLE  = 'jaiib-question-bank'
REGION = 'ap-south-1'
PAPER  = 'AFM'
TOPIC  = 'Accounting & Financial Management'

# ── Patterns ──────────────────────────────────────────────────────────────────
OPT_PAT = re.compile(r'^([a-dA-D])[.\)]\s+(.+)')
ANS_PAT = re.compile(r'^Ans\s*[-–:]\s*([a-dA-D])', re.I)
SEP_PAT = re.compile(r'^[.\s]{5,}$')          # dotted separator line
HEADER  = re.compile(                          # page header/footer noise
    r'www\.|facebook|murugan|admin@|09994|jaiibcaiib|bankpromotion|onlyforbankers'
    r'|JAIIB CAIIB STUDY|BANK PROMOTION|ONLY FOR BANKERS'
    r'|^\d{1,3}$'                              # lone page numbers
    r'|^[…\.]{10,}$',                          # long dot lines
    re.I
)

LETTER_MAP = {'a': 'A', 'b': 'B', 'c': 'C', 'd': 'D'}


def extract_lines(path: str) -> list:
    doc = fitz.open(path)
    lines = []
    for page in doc:
        if page.number < 12:   # skip cover/index pages
            continue
        for line in page.get_text().splitlines():
            line = line.strip()
            if not line:
                continue
            if HEADER.search(line):
                continue
            lines.append(line)
    return lines


def parse(lines: list) -> list:
    questions = []
    i = 0
    n = len(lines)

    while i < n:
        if SEP_PAT.match(lines[i]) or ANS_PAT.match(lines[i]):
            i += 1
            continue

        if OPT_PAT.match(lines[i]):
            i += 1
            continue

        q_lines = []
        while i < n and not OPT_PAT.match(lines[i]) and not ANS_PAT.match(lines[i]):
            if SEP_PAT.match(lines[i]):
                i += 1
                break
            q_lines.append(lines[i])
            i += 1

        q_text = ' '.join(q_lines).strip()
        q_text = re.sub(
            r'^(Accounting\s*&\s*Financial\s*Management|'
            r'Important Sample Questions|Recollected Questions.*?)\s*',
            '', q_text, flags=re.I
        ).strip()
        if not q_text or len(q_text) < 10:
            continue

        options = {}
        while i < n:
            om = OPT_PAT.match(lines[i])
            if om:
                key = LETTER_MAP.get(om.group(1).lower(), om.group(1).upper())
                val = om.group(2).strip()
                i += 1
                while i < n and not OPT_PAT.match(lines[i]) and not ANS_PAT.match(lines[i]) and not SEP_PAT.match(lines[i]):
                    options[key] = options.get(key, val) + ' ' + lines[i].strip()
                    i += 1
                    val = options[key]
                options[key] = val.strip()
            else:
                break

        correct = None
        while i < n:
            am = ANS_PAT.match(lines[i])
            if am:
                correct = LETTER_MAP.get(am.group(1).lower(), am.group(1).upper())
                i += 1
                break
            if SEP_PAT.match(lines[i]):
                i += 1
                break
            if OPT_PAT.match(lines[i]):
                break
            i += 1

        if correct and len(options) >= 2 and correct in options:
            questions.append({
                'question_id':    str(uuid.uuid4()),
                'version':        '1',
                'paper_name':     PAPER,
                'topic':          TOPIC,
                'difficulty':     'medium',
                'question_text':  q_text,
                'options':        options,
                'correct_answer': correct,
                'created_at':     datetime.utcnow().isoformat(),
                'updated_at':     datetime.utcnow().isoformat(),
            })

    return questions


def upload(questions: list):
    dynamodb = boto3.resource('dynamodb', region_name=REGION)
    table = dynamodb.Table(TABLE)
    with table.batch_writer() as batch:
        for q in questions:
            batch.put_item(Item=q)
    print(f"  ✓ {len(questions)} questions uploaded")


if __name__ == '__main__':
    path = '/home/rahul/Downloads/AFM.pdf'
    print(f"Extracting lines from {path}...")
    lines = extract_lines(path)
    print(f"  {len(lines)} lines extracted")

    print("Parsing questions...")
    qs = parse(lines)
    print(f"  {len(qs)} questions parsed")

    if not qs:
        print("No questions found — check PDF format or page skip offset")
        sys.exit(1)

    print("\nSample (first 3 questions):")
    for q in qs[:3]:
        print(f"  Q: {q['question_text'][:80]}")
        for k, v in q['options'].items():
            print(f"    {k}: {v[:60]}")
        print(f"  ANS: {q['correct_answer']}\n")

    print("Uploading to DynamoDB...")
    upload(qs)
    print("\nDone.")
