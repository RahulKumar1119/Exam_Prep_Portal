#!/usr/bin/env python3
"""
Microsoft Certification Exam Question Generator

Two modes:
  1. --mode parse  : Parse questions directly from exam-dump PDFs (Q1. A. B. C. D. Answer: B)
  2. --mode generate : Read PDF content, use Claude to generate proper exam questions from it

Usage:
  # Generate exam questions from a tutorial/documentation PDF (using Claude)
  python3 generate_microsoft_exam.py --pdf azure-ml-docs.pdf --exam AI-300 --count 50 --upload

  # Parse questions from an exam-dump PDF (no AI needed)
  python3 generate_microsoft_exam.py --pdf exam-dump.pdf --exam AI-300 --mode parse --upload

  # Generate from folder of PDFs
  python3 generate_microsoft_exam.py --pdf ./docs/ --exam AI-300 --count 50 --upload
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
TABLE_NAME = 'jaiib-question-bank'
BEDROCK_MODEL_ID = 'deepseek.v3.2'

# AWS clients
bedrock = boto3.client(
    'bedrock-runtime',
    region_name=REGION,
    config=BotoConfig(read_timeout=120, connect_timeout=30)
)
dynamodb = boto3.resource('dynamodb', region_name=REGION)


# ══════════════════════════════════════════════════════════════════════════════
# MODE 1: GENERATE — Use Claude to create questions from documentation PDF
# ══════════════════════════════════════════════════════════════════════════════

def extract_text_from_pdf(path: str, max_chars: int = 50000) -> str:
    """Extract text from PDF, limited to fit in Claude's context."""
    doc = fitz.open(path)
    text = ''
    for page in doc:
        text += page.get_text() + '\n'
        if len(text) >= max_chars:
            break
    return text[:max_chars]


def generate_questions_from_pdf(pdf_path: str, exam: str, count: int) -> List[Dict]:
    """Use Claude to generate exam questions from PDF documentation content."""
    print(f"  📄 Reading: {pdf_path}")
    pdf_text = extract_text_from_pdf(pdf_path)
    print(f"  Extracted {len(pdf_text)} chars")

    if len(pdf_text) < 200:
        print("  ⚠ Too little text in PDF")
        return []

    # Generate in batches of 15 for quality
    all_questions = []
    remaining = count
    chunk_size = min(15, remaining)

    while remaining > 0:
        batch = min(chunk_size, remaining)
        print(f"  🤖 Generating {batch} questions via Claude...")

        prompt = f"""You are a senior Microsoft certification exam writer for the {exam} exam.

Based on the following Azure documentation/tutorial content, create {batch} HIGH-QUALITY multiple-choice exam questions.

SOURCE CONTENT:
---
{pdf_text[:40000]}
---

REQUIREMENTS:
1. Each question must have exactly 4 options (A, B, C, D) with ONE correct answer
2. EVERY question MUST start with a scenario: "Your company...", "A data engineer at Contoso...", "You are migrating..."
3. NEVER ask "What is...", "Which of the following defines...", or simple recall questions
4. Questions must require REASONING — the candidate must evaluate trade-offs, constraints, or multi-step decisions
5. All 4 options must be real Azure services/features/commands that could plausibly be correct
6. Include specific details: SKU names (Standard_DS3_v2), CLI commands (az ml endpoint create), SDK classes (ManagedOnlineEndpoint), YAML properties
7. At least 40% of questions should involve choosing between 2-3 services that BOTH partially solve the problem — only one is optimal given the constraints
8. Difficulty: 10% easy, 50% medium, 40% hard
9. Microsoft passing score is 700/1000 — these questions should challenge someone who has read the docs but not practiced
10. NO definitions, NO "what does X stand for", NO "which is true about X"

QUESTION TYPES TO MIX:
- "Which service/feature should you use?" (architectural decision)
- "What command should you run?" (operational knowledge)  
- "Which configuration is correct?" (detailed settings)
- "What happens when...?" (behavior understanding)
- "Which is the MOST cost-effective/secure/scalable approach?" (best practice)

Return ONLY a valid JSON array — no markdown fences, no text before/after.
CRITICAL: Do NOT use double quotes inside string values. Use single quotes or backticks for any quoted text within answers.
[
  {{
    "question_text": "Your team needs to deploy a model that serves predictions with sub-100ms latency. The model receives 500 requests per second during peak hours. Which deployment approach should you use?",
    "options": {{
      "A": "Deploy to a batch endpoint with a Standard_DS3_v2 compute cluster",
      "B": "Deploy to a managed online endpoint with auto-scaling enabled",
      "C": "Deploy to an Azure Container Instance with 2 CPU cores",
      "D": "Deploy to Azure Functions with a Consumption plan"
    }},
    "correct_answer": "B",
    "topic": "Model Deployment",
    "difficulty": "medium"
  }}
]"""

        try:
            body = {
                "anthropic_version": "bedrock-2023-05-31",
                "max_tokens": 12000,
                "messages": [{"role": "user", "content": prompt}]
            }
            resp = bedrock.invoke_model(modelId=BEDROCK_MODEL_ID, body=json.dumps(body))
            result = json.loads(resp['body'].read())

            # Handle different response formats
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

            # Clean markdown
            text = re.sub(r'^```(?:json)?\s*', '', text)
            text = re.sub(r'\s*```$', '', text)

            # Fix common JSON issues from LLMs
            text = re.sub(r',\s*}', '}', text)  # trailing comma before }
            text = re.sub(r',\s*\]', ']', text)  # trailing comma before ]

            m = re.search(r'\[.*\]', text, re.DOTALL)
            if m:
                json_str = m.group()
                try:
                    questions = json.loads(json_str)
                except json.JSONDecodeError:
                    # Try fixing unescaped quotes inside strings
                    # Replace problematic patterns like "text "quoted" more" 
                    # by using a lenient parser
                    try:
                        import ast
                        questions = ast.literal_eval(json_str)
                    except:
                        # Last resort: fix line by line
                        try:
                            # Remove non-ASCII quotes and retry
                            json_str = json_str.replace('\u201c', '\\"').replace('\u201d', '\\"')
                            json_str = json_str.replace('\u2018', "\\'").replace('\u2019', "\\'")
                            questions = json.loads(json_str)
                        except json.JSONDecodeError as e2:
                            print(f"    ⚠ Error: {e2}")
                            # Save raw for debugging
                            with open('/tmp/bedrock_raw_output.txt', 'w') as df:
                                df.write(text)
                            print(f"    Raw output saved to /tmp/bedrock_raw_output.txt")
                            questions = None

                if questions and isinstance(questions, list):
                    all_questions.extend(questions)
                    print(f"    ✓ Got {len(questions)} questions")
                elif questions is None:
                    pass  # already printed error
                else:
                    print(f"    ⚠ Response was not a list")
            else:
                print(f"    ⚠ No JSON array in response")
                with open('/tmp/bedrock_raw_output.txt', 'w') as df:
                    df.write(text)

        except Exception as e:
            print(f"    ⚠ Error: {e}")

        remaining -= batch

    return all_questions


# ══════════════════════════════════════════════════════════════════════════════
# MODE 2: PARSE — Extract questions from exam-dump PDFs directly
# ══════════════════════════════════════════════════════════════════════════════

Q_START = re.compile(r'^(?:Q(?:uestion)?\.?\s*)?(\d+)\s*[.):]\s*(.*)', re.I)
OPT_PAT = re.compile(r'^(?:([A-Fa-f])\.\s+(.+)|([A-Fa-f])\)\s+(.+)|\(([A-Fa-f])\)\s+(.+))')
ANS_PAT = re.compile(r'^(?:Correct\s+)?(?:Answer|Ans)[:\s\-]+\(?([A-Fa-f](?:\s*[,;&and\s]+[A-Fa-f])*)\)?', re.I)
LETTER_PAT = re.compile(r'[A-Fa-f]')
NOISE_PAT = re.compile(r'www\.|microsoft\.com|page\s+\d|^\d+\s*$|copyright|^\s*$', re.I)


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

        q_num = int(qm.group(1))
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


# ══════════════════════════════════════════════════════════════════════════════
# COMMON: Upload & Preview
# ══════════════════════════════════════════════════════════════════════════════

def upload_to_dynamodb(questions: List[Dict], exam: str, topic: str = 'General'):
    """Upload questions to DynamoDB."""
    table = dynamodb.Table(TABLE_NAME)
    now = datetime.utcnow().isoformat()

    with table.batch_writer() as batch:
        for q in questions:
            batch.put_item(Item={
                'question_id': str(uuid.uuid4()),
                'version': '1',
                'paper_name': exam,
                'topic': q.get('topic', topic),
                'difficulty': q.get('difficulty', 'medium'),
                'question_type': 'multiple_choice',
                'question_text': q['question_text'],
                'options': q['options'],
                'correct_answer': q.get('correct_answer', ''),
                'created_at': now,
                'updated_at': now,
            })

    print(f"  ✓ {len(questions)} questions uploaded to DynamoDB (paper: {exam})")


def preview(questions: List[Dict], limit: int = 3):
    """Preview questions."""
    print(f"\n{'─'*60}")
    for i, q in enumerate(questions[:limit]):
        print(f"\n  Q{i+1} ({q.get('difficulty','?')}) — {q.get('topic','?')}")
        print(f"  {q['question_text'][:150]}")
        for k, v in q.get('options', {}).items():
            mark = ' ✓' if k == q.get('correct_answer') else ''
            print(f"    {k}. {v[:80]}{mark}")
        if q.get('explanation'):
            print(f"  💡 {q['explanation'][:100]}...")
    print(f"{'─'*60}")


# ══════════════════════════════════════════════════════════════════════════════
# MAIN
# ══════════════════════════════════════════════════════════════════════════════

def main():
    parser = argparse.ArgumentParser(description='Microsoft exam question generator from PDF')
    parser.add_argument('--pdf', required=True, help='PDF file or folder')
    parser.add_argument('--exam', default='AI-300', help='Exam code (default: AI-300)')
    parser.add_argument('--count', type=int, default=50, help='Questions to generate (default: 50)')
    parser.add_argument('--topic', default='General', help='Topic override')
    parser.add_argument('--mode', default='generate', choices=['generate', 'parse'],
                        help='generate = Claude creates questions from docs; parse = extract from exam-dump PDF')
    parser.add_argument('--upload', action='store_true', help='Upload to DynamoDB')

    args = parser.parse_args()

    print(f"\n{'═'*60}")
    print(f"  Microsoft Exam Question Generator")
    print(f"  Mode: {args.mode.upper()}")
    print(f"  Exam: {args.exam} | Count: {args.count}")
    print(f"  Upload: {'Yes' if args.upload else 'Dry run'}")
    print(f"{'═'*60}")

    all_questions = []

    # Collect PDF files
    if os.path.isdir(args.pdf):
        pdfs = sorted([os.path.join(args.pdf, f) for f in os.listdir(args.pdf) if f.lower().endswith('.pdf')])
    else:
        pdfs = [args.pdf]

    print(f"  PDFs: {len(pdfs)}")

    for pdf_path in pdfs:
        if args.mode == 'generate':
            qs = generate_questions_from_pdf(pdf_path, args.exam, args.count)
        else:
            qs = parse_questions_from_pdf(pdf_path)
        all_questions.extend(qs)

    # Apply count limit
    if args.count > 0 and len(all_questions) > args.count:
        all_questions = all_questions[:args.count]

    print(f"\n  Total: {len(all_questions)} questions")
    preview(all_questions)

    if args.upload and all_questions:
        upload_to_dynamodb(all_questions, args.exam, args.topic)
    elif not args.upload:
        print("\n  Dry run — add --upload to save")

    # Save JSON
    out = f"{args.exam.lower()}_{args.mode}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    with open(out, 'w') as f:
        json.dump(all_questions, f, indent=2, ensure_ascii=False)
    print(f"  💾 {out}\n")


if __name__ == '__main__':
    main()
