#!/usr/bin/env python3
"""
Parse IE.pdf (Edutap format) and upload all MCQs to jaiib-question-bank DynamoDB.
"""

import re
import uuid
import sys
from datetime import datetime

try:
    import fitz
except ImportError:
    print("Run: pip3 install pymupdf"); sys.exit(1)

try:
    import boto3
except ImportError:
    print("Run: pip3 install boto3"); sys.exit(1)

TABLE  = 'jaiib-question-bank'
REGION = 'ap-south-1'
PAPER  = 'IE & IFS'
TOPIC  = 'Indian Economy & Financial System'

Q_PAT   = re.compile(r'^Q(\d+)\.\s*(.+)', re.I)
OPT_PAT = re.compile(r'^\(([a-d])\)\s+(.+)', re.I)
ANS_PAT = re.compile(r'^S(\d+)\.\s*Ans\.\(([a-d])\)', re.I)
HEADER  = re.compile(
    r'www\.|teachersadda|sscadda|bankersadda|adda247|^\d{1,3}$',
    re.I
)


def extract_lines(path: str) -> list:
    doc = fitz.open(path)
    lines = []
    for page in doc:
        for line in page.get_text().splitlines():
            line = line.strip()
            if line and not HEADER.search(line):
                lines.append(line)
    return lines


def parse(lines: list) -> list:
    # Pass 1: collect answer key from "Solutions" section
    answer_key = {}
    for line in lines:
        am = ANS_PAT.match(line)
        if am:
            answer_key[int(am.group(1))] = am.group(2).upper()

    # Pass 2: parse questions and options
    questions = []
    i = 0
    n = len(lines)

    while i < n:
        qm = Q_PAT.match(lines[i])
        if not qm:
            i += 1
            continue

        q_num = int(qm.group(1))
        q_lines = [qm.group(2).strip()]
        i += 1

        # Collect continuation lines until first option or next question
        while i < n and not OPT_PAT.match(lines[i]) and not Q_PAT.match(lines[i]):
            q_lines.append(lines[i])
            i += 1

        q_text = ' '.join(q_lines).strip()

        # Collect options (a-d), merging wrapped lines
        options = {}
        while i < n:
            om = OPT_PAT.match(lines[i])
            if not om:
                break
            key = om.group(1).upper()
            val = om.group(2).strip()
            i += 1
            while i < n and not OPT_PAT.match(lines[i]) and not Q_PAT.match(lines[i]):
                val += ' ' + lines[i].strip()
                i += 1
            options[key] = val.strip()

        correct = answer_key.get(q_num)
        if correct and len(options) >= 2 and correct in options and len(q_text) >= 10:
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
    path = '/home/rahul/Downloads/IE.pdf'
    print(f"Extracting lines from {path}...")
    lines = extract_lines(path)
    print(f"  {len(lines)} lines extracted")

    print("Parsing questions...")
    qs = parse(lines)
    print(f"  {len(qs)} questions parsed")

    if not qs:
        print("No questions found — check PDF format")
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
