#!/usr/bin/env python3
"""
Quantitative Aptitude Question Generator (paper: QUANT)

Two modes (mirrors generate_microsoft_exam.py):
  1. --mode generate : Read a quant textbook/tutorial PDF, use Bedrock to
                       create single-choice MCQs from it, upload to
                       jaiib-quant-question-bank.
  2. --mode parse    : Parse questions directly from a quant exam-dump PDF
                       (Q1. A. B. C. D. Answer: B). No AI needed.

Usage:
  # Generate 50 quant questions from a textbook PDF (dry run first)
  python3 generate_quant_exam.py --pdf quant-book.pdf --count 50

  # Upload to DynamoDB
  python3 generate_quant_exam.py --pdf quant-book.pdf --count 50 --upload

  # Parse questions from an exam-dump PDF
  python3 generate_quant_exam.py --pdf quant-dump.pdf --mode parse --upload

  # Generate from a folder of PDFs
  python3 generate_quant_exam.py --pdf ./docs/ --count 100 --upload

NOTE: generate mode produces single_choice only. The scoring engine
(backend/practice/scoring_service.py) compares one correct letter, so
multi_select/yes_no/drag_drop types would mis-score — don't use them here.
"""

import re
import os
import uuid
import json
import argparse
from datetime import datetime
from typing import List, Dict, Any, Optional, Tuple

try:
    import fitz  # PyMuPDF
except ImportError:
    import sys
    print("Run: pip3 install pymupdf")
    sys.exit(1)

import boto3
from botocore.config import Config as BotoConfig

# Config
REGION = 'ap-south-1'
TABLE_NAME = 'jaiib-quant-question-bank'
BEDROCK_MODEL_ID = 'zai.glm-5'

# AWS clients
bedrock = boto3.client(
    'bedrock-runtime',
    region_name=REGION,
    config=BotoConfig(read_timeout=120, connect_timeout=30)
)
dynamodb = boto3.resource('dynamodb', region_name=REGION)

# Quant syllabus — must match PAPER_SYLLABUS['QUANT'] in backend/shared/syllabus.py
QUANT_TOPICS = [
    'Number Systems',
    'Simplification',
    'Decimal Fractions & Bodmas',
    'Square Roots & Cube Roots',
    'HCF & LCM',
    'Percentage',
    'Average',
    'Age Problems',
    "Banker's Discount",
    'Races and Games',
    'Chain Rule – Unitary Methods',
    'Clocks',
    'Calendar',
    'Interest – Simple & Compound',
    'Ratios & Proportions',
    'Mixture & Alligations',
    'Profit & Loss',
    'Partnerships',
    'Time & Work',
    'Pipes & Cisterns',
    'Stocks & Shares',
    'Time, Speed & Distance',
    'Trains',
    'Surds & Indices',
    'Series',
    'Data Interpretation',
    'Areas & Volumes',
    'Permutations & Combinations',
    'Sequences & Functions',
    'Probability',
    'Height and Distance',
    'Data Sufficiency',
]


def _build_invoke_body(model_id: str, prompt: str, max_tokens: int = 12000) -> Dict[str, Any]:
    """Request body for the model's provider schema (Anthropic vs OpenAI-style)."""
    mid = (model_id or '').lower()
    if 'anthropic' in mid or 'claude' in mid:
        return {
            "anthropic_version": "bedrock-2023-05-31",
            "max_tokens": max_tokens,
            "messages": [{"role": "user", "content": prompt}],
        }
    return {
        "messages": [{"role": "user", "content": prompt}],
        "max_tokens": max_tokens,
        "temperature": 0.7,
    }


# ══════════════════════════════════════════════════════════════════════
# MODE 1: GENERATE — Bedrock creates single-choice MCQs from a quant PDF
# ══════════════════════════════════════════════════════════════════════

def extract_text_from_pdf(path: str, max_chars: int = 50000) -> str:
    """Extract text from PDF, limited to fit in the model's context."""
    doc = fitz.open(path)
    text = ''
    for page in doc:
        text += page.get_text() + '\n'
        if len(text) >= max_chars:
            break
    return text[:max_chars]


def generate_questions_from_pdf(pdf_path: str, count: int) -> List[Dict]:
    """Use Bedrock to generate quant MCQs from PDF textbook content."""
    print(f"  📄 Reading: {pdf_path}")
    pdf_text = extract_text_from_pdf(pdf_path)
    print(f"  Extracted {len(pdf_text)} chars")

    if len(pdf_text) < 200:
        print("  ⚠ Too little text in PDF")
        return []

    # Generate in batches of 15 for quality
    all_questions = []
    remaining = count

    while remaining > 0:
        batch = min(15, remaining)
        print(f"  🤖 Generating {batch} questions via Bedrock...")

        prompt = f"""You are an expert quantitative aptitude question setter for Indian competitive exams (IBPS, SSC, JAIIB, CAT foundation level).

Based on the following textbook/tutorial content, create {batch} HIGH-QUALITY single-choice (A/B/C/D) multiple-choice questions.

SOURCE CONTENT:
---
{pdf_text[:40000]}
---

COVER THESE TOPICS (use exactly these topic names — spread each batch across
different topics so repeated runs cover the full list):
{chr(10).join('- ' + t for t in QUANT_TOPICS)}

REQUIREMENTS:
1. Each question MUST have exactly 4 options (A, B, C, D) with ONE correct answer.
2. Questions must be SHORT word problems (1-3 sentences) with clean numbers that work out exactly — verify every calculation before answering.
3. Every correct_answer MUST be one of A/B/C/D and MUST match the worked solution.
4. Difficulty mix: 30% easy (direct formula), 50% medium (2-step), 20% hard (twists, successive change, averages traps).
5. Vary which option letter is correct — do NOT make every answer B.
6. Use ₹ for currency where relevant. Keep numbers exam-realistic (no absurd precision).
7. NO definitions, NO "which is true" — only solvable numericals.

CRITICAL OUTPUT RULES:
- Return ONLY a valid JSON array, no markdown fences, no text before/after.
- Do NOT use unescaped double quotes inside string values.
- EVERY object MUST have exactly these keys: question_text, options (A-D), correct_answer, topic, difficulty.

[
  {{
    "question_text": "A sum amounts to ₹11,023 in 3 years at 5% p.a. compound interest. The principal is closest to:",
    "options": {{"A": "₹9,000", "B": "₹9,500", "C": "₹10,000", "D": "₹10,500"}},
    "correct_answer": "B",
    "topic": "Simple and Compound Interest",
    "difficulty": "medium"
  }}
]"""

        try:
            body = _build_invoke_body(BEDROCK_MODEL_ID, prompt, max_tokens=12000)
            resp = bedrock.invoke_model(modelId=BEDROCK_MODEL_ID, body=json.dumps(body))
            result = json.loads(resp['body'].read())

            if 'choices' in result:
                text = result['choices'][0]['message']['content'].strip()
            elif 'content' in result and isinstance(result['content'], list):
                text = result['content'][0]['text'].strip()
            elif 'content' in result and isinstance(result['content'], str):
                text = result['content'].strip()
            elif 'output' in result:
                text = result['output'].strip()
            else:
                text = json.dumps(result)

            text = re.sub(r'^```(?:json)?\s*', '', text)
            text = re.sub(r'\s*```$', '', text)
            text = re.sub(r',\s*}', '}', text)
            text = re.sub(r',\s*\]', ']', text)

            m = re.search(r'\[.*\]', text, re.DOTALL)
            questions = None
            if m:
                try:
                    questions = json.loads(m.group())
                except json.JSONDecodeError as e2:
                    print(f"    ⚠ Error: {e2}")
                    with open('/tmp/bedrock_raw_output.txt', 'w') as df:
                        df.write(text)
                    print("    Raw output saved to /tmp/bedrock_raw_output.txt")

            if questions and isinstance(questions, list):
                all_questions.extend(questions)
                print(f"    ✓ Got {len(questions)} questions")
            elif not questions:
                print("    ⚠ No JSON array in response")

        except Exception as e:
            print(f"    ⚠ Error: {e}")

        remaining -= batch

    return all_questions


# ══════════════════════════════════════════════════════════════════════
# MODE 2: PARSE — Extract questions from exam-dump PDFs directly
# ══════════════════════════════════════════════════════════════════════

Q_START = re.compile(r'^(?:Q(?:uestion)?\.?\s*)?(\d+)\s*[.):]\s*(.*)', re.I)
OPT_PAT = re.compile(r'^(?:([A-Fa-f])\.\s+(.+)|([A-Fa-f])\)\s+(.+)|\(([A-Fa-f])\)\s+(.+))')
ANS_PAT = re.compile(r'^(?:Correct\s+)?(?:Answer|Ans)[:\s\-]+\(?([A-Fa-f](?:\s*[,;&and\s]+[A-Fa-f])*)\)?', re.I)
LETTER_PAT = re.compile(r'[A-Fa-f]')
NOISE_PAT = re.compile(r'www\.|page\s+\d|^\d+\s*$|copyright|^\s*$', re.I)


def match_option(line: str) -> Optional[Tuple[str, str]]:
    m = OPT_PAT.match(line.strip())
    if not m:
        return None
    for g in range(1, 7, 2):
        if m.group(g):
            return m.group(g).upper(), m.group(g + 1).strip()
    return None


def parse_questions_from_pdf(pdf_path: str) -> List[Dict]:
    """Parse questions from an exam-dump PDF."""
    print(f"  📄 Parsing: {pdf_path}")
    doc = fitz.open(pdf_path)
    lines = []
    for page in doc:
        for line in page.get_text().splitlines():
            line = line.strip().replace('\u200b', '')
            if line and not NOISE_PAT.search(line):
                lines.append(line)

    print(f"  Lines: {len(lines)}")
    questions = []
    i, n = 0, len(lines)

    while i < n:
        qm = Q_START.match(lines[i])
        if not qm:
            i += 1
            continue

        q_parts = [qm.group(2).strip()] if qm.group(2).strip() else []
        i += 1

        while i < n and not match_option(lines[i]) and not Q_START.match(lines[i]):
            q_parts.append(lines[i])
            i += 1

        question_text = ' '.join(q_parts).strip()
        options = {}

        while i < n:
            om = match_option(lines[i])
            if not om:
                break
            key, val = om
            i += 1
            while i < n and not match_option(lines[i]) and not ANS_PAT.match(lines[i]) and not Q_START.match(lines[i]):
                val += ' ' + lines[i].strip()
                i += 1
            options[key] = val.strip()

        correct = ''
        for scan in range(i, min(i + 10, n)):
            if Q_START.match(lines[scan]):
                break
            am = ANS_PAT.match(lines[scan])
            if am:
                letters = [l.upper() for l in LETTER_PAT.findall(am.group(1))]
                correct = letters[0] if letters else ''
                i = scan + 1
                break

        while i < n and not Q_START.match(lines[i]):
            i += 1

        if len(options) >= 4 and len(question_text) >= 15:
            questions.append({
                'question_text': question_text,
                'options': options,
                'correct_answer': correct,
                'topic': 'General',
                'difficulty': 'medium',
            })

    print(f"  Parsed: {len(questions)} questions (with 4+ options)")
    return questions


# ══════════════════════════════════════════════════════════════════════
# COMMON: Upload & Preview
# ══════════════════════════════════════════════════════════════════════

def normalize_question(q: Dict, default_topic: str) -> Optional[Dict]:
    """Validate + clean a question. Returns DynamoDB-ready item or None."""
    text = (q.get('question_text') or '').strip()
    if len(text) < 15:
        return None

    options = {k: v for k, v in (q.get('options') or {}).items() if k and v}
    if len(options) < 4:
        return None
    correct = (q.get('correct_answer') or '').strip().upper()
    if correct not in options:
        return None

    return {
        'question_type': 'single_choice',
        'question_text': text,
        'options': options,
        'correct_answer': correct,
        'topic': q.get('topic', default_topic) or default_topic,
        'difficulty': q.get('difficulty', 'medium') or 'medium',
    }


def upload_to_dynamodb(questions: List[Dict], topic: str = 'General'):
    """Upload questions to jaiib-quant-question-bank (paper: QUANT)."""
    table = dynamodb.Table(TABLE_NAME)
    uploaded, skipped = 0, 0

    with table.batch_writer() as batch:
        for q in questions:
            norm = normalize_question(q, topic)
            if norm is None:
                skipped += 1
                continue
            batch.put_item(Item={
                'question_id': str(uuid.uuid4()),
                'version': 'v1.0',
                'paper_name': 'QUANT',
                'status': 'active',
                'reference': 'Quantitative Aptitude Guide',
                'source': 'MockMaster',
                **norm,
            })
            uploaded += 1

    print(f"  ✓ {uploaded} uploaded to {TABLE_NAME}")
    if skipped:
        print(f"  ⚠ {skipped} skipped (malformed: <4 options or bad answer key)")


def preview(questions: List[Dict], limit: int = 5):
    """Preview questions."""
    print(f"\n{'─'*60}")
    for i, q in enumerate(questions[:limit]):
        print(f"\n  Q{i+1} ({q.get('difficulty','?')}) — {q.get('topic','?')}")
        print(f"  {q.get('question_text','')[:150]}")
        correct = q.get('correct_answer')
        for k, v in (q.get('options') or {}).items():
            print(f"    {k}. {str(v)[:80]}{' ✓' if k == correct else ''}")
    print(f"{'─'*60}")


# ══════════════════════════════════════════════════════════════════════
# MAIN
# ══════════════════════════════════════════════════════════════════════

def main():
    parser = argparse.ArgumentParser(description='Quant aptitude question generator from PDF')
    parser.add_argument('--pdf', required=True, help='PDF file or folder')
    parser.add_argument('--count', type=int, default=50, help='Questions to generate (default: 50)')
    parser.add_argument('--topic', default='General', help='Topic override for parsed questions')
    parser.add_argument('--mode', default='generate', choices=['generate', 'parse'],
                        help='generate = Bedrock creates questions from docs; parse = extract from exam-dump PDF')

    parser.add_argument('--upload', action='store_true', help='Upload to DynamoDB')
    args = parser.parse_args()

    print(f"\n{'═'*60}")
    print("  Quant Aptitude Question Generator")
    print(f"  Mode: {args.mode.upper()} | Table: {TABLE_NAME}")
    print(f"  Count: {args.count}")
    print(f"  Upload: {'Yes' if args.upload else 'Dry run'}")
    print(f"{'═'*60}")

    if os.path.isdir(args.pdf):
        pdfs = sorted([os.path.join(args.pdf, f) for f in os.listdir(args.pdf) if f.lower().endswith('.pdf')])
    else:
        pdfs = [args.pdf]
    print(f"  PDFs: {len(pdfs)}")

    all_questions = []
    for pdf_path in pdfs:
        if args.mode == 'generate':
            all_questions.extend(generate_questions_from_pdf(pdf_path, args.count))
        else:
            all_questions.extend(parse_questions_from_pdf(pdf_path))

    if args.count > 0 and len(all_questions) > args.count:
        all_questions = all_questions[:args.count]

    print(f"\n  Total: {len(all_questions)} questions")
    preview(all_questions)

    if args.upload and all_questions:
        upload_to_dynamodb(all_questions, args.topic)
    elif not args.upload:
        print("\n  Dry run — add --upload to save")

    out = f"quant_{args.mode}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    with open(out, 'w') as f:
        json.dump(all_questions, f, indent=2, ensure_ascii=False)
    print(f"  💾 {out}\n")


if __name__ == '__main__':
    main()
