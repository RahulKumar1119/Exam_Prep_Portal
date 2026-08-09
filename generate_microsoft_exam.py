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

AI-300 OFFICIAL SYLLABUS (generate questions covering ALL these areas evenly):

1. Design and implement an MLOps infrastructure (15-20%):
   - Create/manage Machine Learning workspace, datastores, compute targets
   - Configure identity and access management for workspaces
   - Create/manage data assets, environments, components, registries
   - Configure GitHub integration with Machine Learning
   - Deploy ML workspaces using Bicep and Azure CLI
   - Automate resource provisioning with GitHub Actions workflows
   - Restrict network access to ML workspaces

2. Implement machine learning model lifecycle and operations (25-30%):
   - Configure experiment tracking with MLflow
   - Use Automated ML to explore optimal models
   - Automate hyperparameter tuning
   - Manage distributed training for large/deep learning models
   - Implement training pipelines, compare model performance across jobs
   - Package feature retrieval specification with model artifact
   - Register an MLflow model, evaluate with responsible AI principles
   - Deploy models as real-time or batch endpoints with managed inference
   - Implement progressive rollout and safe rollback strategies
   - Detect/analyze data drift, monitor production model performance
   - Configure retraining triggers when thresholds exceeded

3. Design and implement a GenAIOps infrastructure (20-25%):
   - Create/configure Foundry resources and project environments
   - Configure RBAC and managed identities
   - Implement network security and private networking
   - Deploy infrastructure using Bicep and Azure CLI
   - Deploy foundation models via serverless API or managed compute
   - Select models for specific use cases
   - Configure provisioned throughput units for high-volume workloads
   - Design/develop prompts, create prompt variants
   - Implement version control for prompts using Git

4. Implement generative AI quality assurance and observability (10-15%):
   - Create test datasets for model evaluation
   - Implement AI quality metrics: groundedness, relevance, coherence, fluency
   - Configure risk/safety evaluations for harmful content
   - Set up automated evaluation workflows
   - Monitor performance: latency, throughput, response times
   - Track token consumption and resource cost
   - Configure logging, tracing, debugging for production

5. Optimize generative AI systems and model performance (10-15%):
   - Optimize RAG: similarity thresholds, chunk sizes, retrieval strategies
   - Select/fine-tune embedding models for domain-specific use cases
   - Implement hybrid search (semantic + keyword)
   - Evaluate RAG with relevance metrics and A/B testing
   - Design advanced fine-tuning methods
   - Create/manage synthetic data for fine-tuning
   - Manage fine-tuned model from dev through production

REQUIREMENTS:
1. Each question MUST have exactly 4 options (A, B, C, D) with ONE correct answer
2. NO definitions, NO "what does X stand for", NO "which is true about X"
3. Difficulty: 10% easy, 50% medium, 40% hard
4. Microsoft passing score is 700/1000 — calibrate difficulty accordingly
5. All options must be plausible — real Azure services, commands, or configurations

GENERATE THESE MICROSOFT EXAM QUESTION STYLES (mix them):

STYLE 1 — Scenario + Decision (40% of questions):
Start with: "You are a ML engineer at [company]. [scenario with constraints]... What should you do?"
The scenario MUST include constraints that eliminate 2-3 options (cost, latency, compliance, region, etc.)

STYLE 2 — Yes/No Statement Sets (20% of questions):
"For each statement, determine if it is true or false regarding [topic]:
Statement: [technical claim about Azure ML]"
Options: A. Yes  B. No  C. Yes, but only if...  D. No, because...

STYLE 3 — Correct Order / Steps (20% of questions):
"You need to [goal]. Which sequence of steps should you follow?"
Options are different orderings of 3-4 steps. Only one order is correct.

STYLE 4 — Code/Command Selection (20% of questions):
"Which Azure CLI command / Python SDK code / YAML configuration achieves [goal]?"
Options are 4 different commands or code snippets — only one is syntactically and semantically correct.

CRITICAL OUTPUT RULES:
- Return ONLY a valid JSON array
- No markdown fences, no text before or after the JSON
- Do NOT use unescaped double quotes inside string values
- Use backticks (`) for code references inside strings

[
  {{
    "question_text": "You are a ML engineer at Fabrikam Inc. Your team trained a fraud detection model that must process 10,000 transactions per second with less than 50ms latency. The model is 2GB in size. Budget is limited to $500/month. Which deployment should you use?",
    "options": {{
      "A": "Managed online endpoint with Standard_DS3_v2 and 3 instances",
      "B": "Batch endpoint with Standard_NC6 GPU cluster",
      "C": "Managed online endpoint with Standard_F4s_v2 and auto-scaling from 2 to 10 instances",
      "D": "Azure Container Instance with 4 vCPUs and 16GB RAM"
    }},
    "correct_answer": "C",
    "topic": "Deployment Infrastructure",
    "difficulty": "hard"
  }},
  {{
    "question_text": "Statement: When you configure a managed online endpoint with `mirror_traffic` set to 10, exactly 10% of production requests are duplicated to the mirror deployment and responses from the mirror are returned to the client.",
    "options": {{
      "A": "Yes — mirror traffic returns responses from both deployments",
      "B": "No — mirror traffic duplicates requests but discards mirror responses; only the production deployment responds to the client",
      "C": "Yes — but only if the mirror deployment has the same instance count",
      "D": "No — mirror_traffic is not a valid endpoint property"
    }},
    "correct_answer": "B",
    "topic": "Model Deployment",
    "difficulty": "hard"
  }},
  {{
    "question_text": "You need to set up a training pipeline that versions datasets, tracks experiments, and automatically registers the best model. Which sequence of steps is correct?",
    "options": {{
      "A": "Create data asset -> Create compute cluster -> Submit pipeline job -> Register model from best run",
      "B": "Register model -> Create data asset -> Submit pipeline job -> Create compute cluster",
      "C": "Create compute cluster -> Register model -> Create data asset -> Submit pipeline job",
      "D": "Submit pipeline job -> Create data asset -> Create compute cluster -> Register model from best run"
    }},
    "correct_answer": "A",
    "topic": "Model Training",
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
    uploaded = 0

    with table.batch_writer() as batch:
        for q in questions:
            # Skip questions with empty fields
            if not q.get('question_text') or not q.get('options'):
                continue
            # Remove empty keys from options
            options = {k: v for k, v in q.get('options', {}).items() if k and v}
            if len(options) < 2:
                continue

            batch.put_item(Item={
                'question_id': str(uuid.uuid4()),
                'version': '1',
                'paper_name': exam,
                'topic': q.get('topic', topic) or topic,
                'difficulty': q.get('difficulty', 'medium') or 'medium',
                'question_type': 'multiple_choice',
                'question_text': q['question_text'],
                'options': options,
                'correct_answer': q.get('correct_answer', '') or '',
                'created_at': now,
                'updated_at': now,
            })
            uploaded += 1

    print(f"  ✓ {uploaded} questions uploaded to DynamoDB (paper: {exam})")


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
