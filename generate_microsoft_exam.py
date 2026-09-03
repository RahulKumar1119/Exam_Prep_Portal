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
BEDROCK_MODEL_ID = 'zai.glm-5'

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


def generate_questions_from_pdf(pdf_path: str, exam: str, count: int, mixed_types: bool = False) -> List[Dict]:
    """Use Claude to generate exam questions from PDF documentation content.

    When mixed_types is True, the model is instructed to produce a realistic
    Microsoft-style mix: single_choice, multi_select, yes_no, drag_drop and
    build_list questions (issue #51). Otherwise only single_choice is produced.
    """
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
        print(f"  🤖 Generating {batch} {'mixed-type ' if mixed_types else ''}questions via Claude...")

        if mixed_types:
            type_instructions = """

QUESTION TYPE MIX (issue #51) — produce a realistic Microsoft exam distribution across this batch:
- ~45% "single_choice": one correct option A-D (as described above).
- ~18% "multi_select": 5 options A-E, 2 or 3 correct. Set "question_type":"multi_select", keep "correct_answer" as a comma string like "A,C", and ALSO add "correct_answers": ["A","C"]. End the question text with "(Select all that apply.)".
- ~10% "yes_no": present 3 related statements the candidate must judge. Set "question_type":"yes_no", OMIT "options", add "statements": ["stmt 1","stmt 2","stmt 3"] and "correct_answers": ["Yes","No","Yes"] (one Yes/No per statement, same order).
- ~8% "drag_drop": match items to zones. Set "question_type":"drag_drop", OMIT "options", add "drag_items": [{{"id":"i1","label":"..."}}, ...], "drop_zones": [{{"id":"z1","label":"..."}}, ...], and "correct_mapping": {{"z1":"i1","z2":"i2"}} mapping each zone id to the correct item id.
- ~7% "build_list": order steps correctly. Set "question_type":"build_list", OMIT "options", add "correct_order": ["First step","Second step","Third step","Fourth step"] in the correct sequence.
- CASE STUDY (~12%, i.e. ONE cluster of 3-4 linked questions per batch): write a detailed 6-10 sentence enterprise scenario, then 3-4 questions that all reference it. Each such question is a normal ANSWERABLE question (use "question_type":"single_choice" or "multi_select" with real options + correct_answer), and MUST ALSO carry these THREE identical fields on every question in the cluster: "case_study_id" (e.g. "CS-CONTOSO-1"), "scenario" (the full shared scenario text), and "exhibits" (an array like [{{"title":"Network","content":"..."}}, {{"title":"Budget","content":"..."}}]). Different clusters use different case_study_id values. Questions NOT part of a case study MUST NOT include case_study_id/scenario/exhibits.
For every question ALWAYS include "question_type", "topic" and "difficulty". Only choice types use "options"."""
        else:
            type_instructions = ""

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
3. Difficulty: 0% easy, 30% medium, 70% hard — THIS IS AN EXPERT-LEVEL EXAM
4. Microsoft passing score is 700/1000 — these questions should STUMP people who only read docs without hands-on experience
5. All options must be plausible — real Azure services, commands, or configurations
6. EVERY question text MUST be 4-8 sentences long with a detailed enterprise scenario
7. Include specific constraints: team size, data volumes (TB), latency requirements (ms), budget ($), compliance (HIPAA/SOC2), regions, SLAs
8. Options MUST be 2-3 sentences each — not just short phrases. Include specific SKUs, CLI flags, YAML properties, SDK class names
9. At least 50% of questions should require knowing MULTIPLE Azure services and how they interact

GENERATE THESE MICROSOFT EXAM QUESTION STYLES (mix them):

STYLE 1 — Complex Multi-Constraint Scenario (50% of questions):
Start with a 5-8 sentence enterprise scenario with at least 4 specific constraints (cost, latency, compliance, data size, team expertise, existing infrastructure). The candidate must evaluate ALL constraints together to find the single correct answer. Example: "You are a senior MLOps engineer at Contoso Financial. Your team of 3 data scientists has trained a credit scoring model using 50TB of historical transaction data. The model must serve predictions with P99 latency under 100ms for 5,000 concurrent users. Your company requires SOC2 compliance and all data must stay within the EU region. The infrastructure budget is $2,000/month. The model uses a custom PyTorch framework with 8GB model weights. Currently, your team uses GitHub for source control and has no Kubernetes expertise. Which deployment approach meets ALL requirements?"

STYLE 2 — Multi-Step Architecture (25% of questions):
"Your organization is implementing [complex goal]. The solution must [requirement 1], [requirement 2], and [requirement 3]. The current infrastructure includes [existing services]. Which combination of steps, executed in the correct order, achieves this goal while meeting all requirements?"
Options should be 4 different multi-step approaches (each 2-3 sentences describing a sequence of actions).

STYLE 3 — Troubleshooting & Debugging (25% of questions):
"A production ML pipeline at [company] has been failing intermittently for 3 days. The pipeline trains a [model type] using [compute]. Error logs show [specific error message or symptom]. The pipeline was working correctly before [recent change]. Monitoring shows [specific metric pattern]. What is the most likely root cause and the correct remediation?"
Options should describe different root causes + their fixes (each 2 sentences).
{type_instructions}
CRITICAL OUTPUT RULES:
- Return ONLY a valid JSON array
- No markdown fences, no text before or after the JSON
- Do NOT use unescaped double quotes inside string values
- Use backticks (`) for code references inside strings
- EVERY object MUST have "question_type" (default "single_choice")

[
  {{
    "question_type": "single_choice",
    "question_text": "You are a senior MLOps engineer at Contoso Financial Services. Your team has trained a real-time fraud detection model using PyTorch that processes credit card transactions. The model requires GPU inference with P99 latency under 50ms to meet SLA requirements. Your company processes 25,000 transactions per second during peak hours (Black Friday) but only 2,000 TPS during normal periods. The security team mandates that all inference must occur within a private virtual network with no public internet exposure. Your infrastructure budget is capped at $3,500/month and the team has no Kubernetes experience. The model artifact is 4.2GB and requires CUDA 11.8. Which deployment architecture satisfies all constraints?",
    "options": {{
      "A": "Deploy to a managed online endpoint with Standard_NC6s_v3 GPU instances, configure auto-scaling from 1 to 8 instances based on request latency, and enable private endpoint connectivity by attaching the workspace to your VNet with a private link",
      "B": "Deploy to Azure Kubernetes Service with GPU node pools using Standard_NC6s_v3 VMs, configure horizontal pod autoscaler with custom metrics, and restrict access using an internal load balancer within your VNet",
      "C": "Deploy to a batch endpoint with Standard_NC6s_v3 compute cluster, configure the scoring script to process micro-batches of 100 transactions, and use a private endpoint for the storage account",
      "D": "Deploy to Azure Container Instances with GPU support, configure 8 container groups behind Azure Front Door, and use service endpoints to restrict traffic to your VNet"
    }},
    "correct_answer": "A",
    "topic": "Deployment Infrastructure",
    "difficulty": "hard"
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

CHOICE_TYPES = ('single_choice', 'multi_select')
VALID_TYPES = ('single_choice', 'multi_select', 'yes_no', 'drag_drop', 'build_list', 'ordering', 'case_study', 'hot_area')
TYPED_FIELDS = ('correct_answers', 'statements', 'case_study_id', 'scenario', 'exhibits',
                'drag_items', 'drop_zones', 'correct_mapping', 'correct_order',
                'image_url', 'hot_areas', 'correct_area')


def normalize_question(q: Dict, default_topic: str) -> Optional[Dict]:
    """Validate + clean a generated question by its type.

    Returns a DynamoDB-ready item dict, or None if the question is malformed
    for its declared type (so it gets skipped rather than stored broken).
    """
    text = (q.get('question_text') or '').strip()
    if len(text) < 15:
        return None

    qtype = q.get('question_type') or 'single_choice'
    if qtype not in VALID_TYPES:
        qtype = 'single_choice'

    item: Dict[str, Any] = {
        'question_type': qtype,
        'question_text': text,
        'topic': q.get('topic', default_topic) or default_topic,
        'difficulty': q.get('difficulty', 'medium') or 'medium',
        'correct_answer': q.get('correct_answer', '') or '',
    }

    # Case-study grouping fields ride along on ANY answerable question so a
    # cluster of questions can share one scenario (issue #51). These are not a
    # separate question_type — each child keeps its real answerable type.
    if q.get('case_study_id'):
        item['case_study_id'] = q['case_study_id']
    if q.get('scenario'):
        item['scenario'] = q['scenario']
    if q.get('exhibits'):
        item['exhibits'] = q['exhibits']

    if qtype in CHOICE_TYPES:
        options = {k: v for k, v in (q.get('options') or {}).items() if k and v}
        if len(options) < 2:
            return None
        item['options'] = options
        if qtype == 'multi_select':
            answers = q.get('correct_answers')
            if not answers and q.get('correct_answer'):
                answers = [a.strip() for a in q['correct_answer'].split(',') if a.strip()]
            answers = [a for a in (answers or []) if a in options]
            if len(answers) < 2:
                return None
            item['correct_answers'] = answers
            item['correct_answer'] = ','.join(answers)
        else:  # single_choice
            if item['correct_answer'] not in options:
                return None
    elif qtype == 'yes_no':
        stmts = q.get('statements') or []
        answers = q.get('correct_answers') or []
        if len(stmts) < 2 or len(stmts) != len(answers):
            return None
        if any(a not in ('Yes', 'No') for a in answers):
            return None
        item['options'] = {}
        item['statements'] = stmts
        item['correct_answers'] = answers
    elif qtype == 'drag_drop':
        items = q.get('drag_items') or []
        zones = q.get('drop_zones') or []
        mapping = q.get('correct_mapping') or {}
        if len(items) < 2 or len(zones) < 2 or not mapping:
            return None
        item['options'] = {}
        item['drag_items'] = items
        item['drop_zones'] = zones
        item['correct_mapping'] = mapping
    elif qtype in ('build_list', 'ordering'):
        order = q.get('correct_order') or []
        if len(order) < 2:
            return None
        item['options'] = {}
        item['correct_order'] = order
    else:
        # case_study / hot_area need media/authoring — skip if incomplete
        options = {k: v for k, v in (q.get('options') or {}).items() if k and v}
        if len(options) < 2:
            return None
        item['options'] = options

    return item


def upload_to_dynamodb(questions: List[Dict], exam: str, topic: str = 'General'):
    """Upload questions to DynamoDB (type-aware)."""
    table = dynamodb.Table(TABLE_NAME)
    now = datetime.utcnow().isoformat()
    uploaded = 0
    skipped = 0
    by_type: Dict[str, int] = {}
    case_study_ids: set = set()

    with table.batch_writer() as batch:
        for q in questions:
            norm = normalize_question(q, topic)
            if norm is None:
                skipped += 1
                continue

            item = {
                'question_id': str(uuid.uuid4()),
                'version': '1',
                'paper_name': exam,
                'created_at': now,
                'updated_at': now,
                **norm,
            }
            # Carry through any remaining extended-type fields already validated
            for f in TYPED_FIELDS:
                if norm.get(f) is not None:
                    item[f] = norm[f]

            batch.put_item(Item=item)
            uploaded += 1
            by_type[norm['question_type']] = by_type.get(norm['question_type'], 0) + 1
            if norm.get('case_study_id'):
                case_study_ids.add(norm['case_study_id'])

    dist = ', '.join(f"{k}:{v}" for k, v in sorted(by_type.items()))
    print(f"  ✓ {uploaded} uploaded to DynamoDB (paper: {exam}) — {dist}")
    if case_study_ids:
        print(f"  📎 {len(case_study_ids)} case study cluster(s): {', '.join(sorted(case_study_ids))}")
    if skipped:
        print(f"  ⚠ {skipped} skipped (malformed for their type)")


def preview(questions: List[Dict], limit: int = 5):
    """Preview questions (type-aware)."""
    print(f"\n{'─'*60}")
    for i, q in enumerate(questions[:limit]):
        qtype = q.get('question_type', 'single_choice')
        cs = f" {{case_study: {q['case_study_id']}}}" if q.get('case_study_id') else ''
        print(f"\n  Q{i+1} [{qtype}]{cs} ({q.get('difficulty','?')}) — {q.get('topic','?')}")
        if q.get('scenario'):
            print(f"  scenario: {q['scenario'][:100]}...")
        print(f"  {q['question_text'][:150]}")
        if qtype in ('single_choice', 'multi_select'):
            correct = set(q.get('correct_answers') or [q.get('correct_answer')])
            for k, v in q.get('options', {}).items():
                mark = ' ✓' if k in correct else ''
                print(f"    {k}. {str(v)[:80]}{mark}")
        elif qtype == 'yes_no':
            for s, a in zip(q.get('statements', []), q.get('correct_answers', [])):
                print(f"    - {str(s)[:70]} → {a}")
        elif qtype == 'drag_drop':
            print(f"    items: {[it.get('label') for it in q.get('drag_items', [])]}")
            print(f"    mapping: {q.get('correct_mapping')}")
        elif qtype in ('build_list', 'ordering'):
            for n, step in enumerate(q.get('correct_order', []), 1):
                print(f"    {n}. {str(step)[:80]}")
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
    parser.add_argument('--types', default='single', choices=['single', 'mixed'],
                        help="single = single_choice only; mixed = multi_select/yes_no/drag_drop/build_list mix (issue #51)")
    parser.add_argument('--upload', action='store_true', help='Upload to DynamoDB')

    args = parser.parse_args()

    print(f"\n{'═'*60}")
    print(f"  Microsoft Exam Question Generator")
    print(f"  Mode: {args.mode.upper()} | Types: {args.types}")
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
            qs = generate_questions_from_pdf(pdf_path, args.exam, args.count, mixed_types=(args.types == 'mixed'))
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
