#!/usr/bin/env python3
"""
CAPM Certification Exam Question Generator

Same shape as generate_microsoft_exam.py, retargeted to PMI CAPM.

Two modes:
  1. --mode parse  : Parse questions directly from exam-dump PDFs (Q1. A. B. C. D. Answer: B)
  2. --mode generate : Read PDF content, use Bedrock to generate proper exam questions from it

Usage:
  # Generate exam questions from a PMBOK/tutorial PDF (using Bedrock)
  python3 generate_capm_exam.py --pdf pmbok-guide.pdf --exam CAPM --count 50 --upload

  # Parse questions from an exam-dump PDF (no AI needed)
  python3 generate_capm_exam.py --pdf exam-dump.pdf --exam CAPM --mode parse --upload

  # Generate from folder of PDFs
  python3 generate_capm_exam.py --pdf ./docs/ --exam CAPM --count 50 --upload

  # Realistic CAPM mix (single/multi/yes-no/drag-drop/ordering + case studies)
  python3 generate_capm_exam.py --pdf pmbok-guide.pdf --exam CAPM --count 50 --types mixed --upload
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
TABLE_NAME = 'jaiib-capm-question-bank'
BEDROCK_MODEL_ID = 'zai.glm-5'

# AWS clients
bedrock = boto3.client(
    'bedrock-runtime',
    region_name=REGION,
    config=BotoConfig(read_timeout=120, connect_timeout=30)
)
dynamodb = boto3.resource('dynamodb', region_name=REGION)

# CAPM ECO domains (must match backend/shared/syllabus.py PAPER_SYLLABUS['CAPM'])
CAPM_DOMAINS = [
    'Domain 1 - Project Management Fundamentals and Core Concepts (36%)',
    'Domain 2 - Predictive, Plan-Based Methodologies (17%)',
    'Domain 3 - Agile Frameworks/Methodologies (20%)',
    'Domain 4 - Business Analysis Frameworks (27%)',
]


def _build_invoke_body(model_id: str, prompt: str, max_tokens: int = 12000) -> Dict[str, Any]:
    """Build the InvokeModel request body for the model's provider schema.

    Different Bedrock model families expect different request shapes:
      - Anthropic (Claude): requires "anthropic_version" and a messages array.
      - OpenAI-style Chat Completions (ZhipuAI GLM 'zai.*', DeepSeek, GPT-OSS):
        a plain {"messages": [...], "max_tokens": ...} body, NO anthropic_version.
    Sending the Anthropic schema to a non-Anthropic model fails, so pick by id.
    """
    mid = (model_id or '').lower()
    # Strip any region/inference-profile prefix like 'apac.anthropic....'
    provider = mid.split('.')[-2] if mid.count('.') >= 2 else mid.split('.')[0]

    if 'anthropic' in mid or 'claude' in mid:
        return {
            "anthropic_version": "bedrock-2023-05-31",
            "max_tokens": max_tokens,
            "messages": [{"role": "user", "content": prompt}],
        }
    # GLM (zai.*), DeepSeek, and other OpenAI-style chat models
    return {
        "messages": [{"role": "user", "content": prompt}],
        "max_tokens": max_tokens,
        "temperature": 0.7,
    }


# ══════════════════════════════════════════════════════════════════════════════
# MODE 1: GENERATE — Use Bedrock to create questions from documentation PDF
# ══════════════════════════════════════════════════════════════════════════════

def extract_text_from_pdf(path: str, max_chars: int = 50000) -> str:
    """Extract text from PDF, limited to fit in the model's context."""
    doc = fitz.open(path)
    text = ''
    for page in doc:
        text += page.get_text() + '\n'
        if len(text) >= max_chars:
            break
    return text[:max_chars]


def generate_questions_from_pdf(pdf_path: str, exam: str, count: int, mixed_types: bool = False) -> List[Dict]:
    """Use Bedrock to generate exam questions from PDF documentation content.

    When mixed_types is True, the model is instructed to produce a realistic
    CAPM-style mix: single_choice, multi_select, yes_no, drag_drop and
    build_list questions. Otherwise only single_choice is produced.
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
        print(f"  🤖 Generating {batch} {'mixed-type ' if mixed_types else ''}questions via Bedrock...")

        if mixed_types:
            type_instructions = """

QUESTION TYPE MIX — produce a realistic CAPM exam distribution across this batch:
- ~45% "single_choice": one correct option A-D (as described above).
- ~18% "multi_select": 5 options A-E, 2 or 3 correct. Set "question_type":"multi_select", keep "correct_answer" as a comma string like "A,C", and ALSO add "correct_answers": ["A","C"]. End the question text with "(Select all that apply.)".
- ~10% "yes_no": present 3 related statements the candidate must judge. Set "question_type":"yes_no", OMIT "options", add "statements": ["stmt 1","stmt 2","stmt 3"] and "correct_answers": ["Yes","No","Yes"] (one Yes/No per statement, same order).
- ~8% "drag_drop": match items to zones (CAPM matching style). Set "question_type":"drag_drop", OMIT "options", add "drag_items": [{{"id":"i1","label":"..."}}, ...], "drop_zones": [{{"id":"z1","label":"..."}}, ...], and "correct_mapping": {{"z1":"i1","z2":"i2"}} mapping each zone id to the correct item id.
- ~7% "build_list": order steps correctly. Set "question_type":"build_list", OMIT "options", add "correct_order": ["First step","Second step","Third step","Fourth step"] in the correct sequence.
- CASE STUDY (~12%, i.e. ONE cluster of 3-4 linked questions per batch): write a detailed 6-10 sentence project scenario, then 3-4 questions that all reference it. Each such question is a normal ANSWERABLE question (use "question_type":"single_choice" or "multi_select" with real options + correct_answer), and MUST ALSO carry these THREE identical fields on every question in the cluster: "case_study_id" (e.g. "CS-ACME-1"), "scenario" (the full shared scenario text), and "exhibits" (an array like [{{"title":"Risk Register","content":"..."}}, {{"title":"Stakeholder Register","content":"..."}}]). Different clusters use different case_study_id values. Questions NOT part of a case study MUST NOT include case_study_id/scenario/exhibits.
For every question ALWAYS include "question_type", "domain" (one of the 4 CAPM domains below), "topic" and "difficulty". Only choice types use "options"."""
        else:
            type_instructions = '\nFor every question ALWAYS include "domain" (one of the 4 CAPM domains below), "topic" and "difficulty".'

        prompt = f"""You are a senior PMI CAPM certification exam writer.

Based on the following project management content, create {batch} HIGH-QUALITY CAPM exam questions.

SOURCE CONTENT:
---
{pdf_text[:40000]}
---

CAPM OFFICIAL ECO (generate questions covering ALL domains at these weights):

Domain 1 - Project Management Fundamentals and Core Concepts (36%):
   - How projects create value; project vs program vs portfolio; project vs operations
   - Predictive vs adaptive approaches; organizational structures; PMO roles
   - Project manager and team responsibilities; leadership vs management
   - Project life cycle phases; common artifacts and documents
   - Risk vs issue vs assumption vs constraint; risk and stakeholder registers

Domain 2 - Predictive, Plan-Based Methodologies (17%):
   - When predictive is appropriate; WBS and work packages; scope decomposition
   - Critical path basics; schedule dependencies
   - Schedule/cost variance interpretation; project baselines; controls artifacts

Domain 3 - Agile Frameworks/Methodologies (20%):
   - Agile mindset and values; when adaptive delivery fits
   - Scrum roles, events, artifacts; sprint planning, daily scrum, review, retrospective
   - Kanban boards and WIP limits; backlog prioritization
   - Success criteria and acceptance criteria; iterative delivery and feedback

Domain 4 - Business Analysis Frameworks (27%):
   - Requirements elicitation and documentation
   - Stakeholder identification and analysis
   - Requirements traceability (RTM); validation against business needs
   - Acceptance criteria logic; "what should you do next?" scenarios

REQUIREMENTS:
1. Each single_choice question MUST have exactly 4 options (A, B, C, D) with ONE correct answer
2. NO pure definitions, NO "what does X stand for" — questions must be scenario-based:
   "what should the team member do?", "what should the PM prioritize?", "which tool fits best?"
3. Difficulty: ~25% easy, ~45% medium, ~30% hard — THIS IS AN ENTRY/ASSOCIATE-LEVEL EXAM
4. CAPM is 150 questions in 180 minutes (135 scored) — questions should test applied judgment, not trivia
5. All options must be plausible — real PM artifacts, registers, and techniques
6. EVERY question text MUST be 3-6 sentences with a mini project scenario (team, constraint, artifact)
7. At least 40% of questions should span two domains (e.g. agile scenario inside Fundamentals, predictive tool inside a BA task)
8. Set "domain" to the PRIMARY tested domain (exact string from the ECO list above)

GENERATE THESE CAPM QUESTION STYLES (mix them):

STYLE 1 — Scenario "Best Next Step" (50% of questions):
Start with a 3-6 sentence project story (role, lifecycle stage, register/artifact clue, constraint). Ask what the associate-level team member should do next. Example: "You are a project team member on a software upgrade project in the executing phase. The risk register lists a vendor delay as a high-probability risk, and the issue log shows two open defects blocking testing. The sponsor asks for a status update focused on delivery confidence. The stakeholder register shows the operations manager as high-influence, low-interest. What should you do next?"

STYLE 2 — Artifact Interpretation (25% of questions):
Present a small register/traceability excerpt (risk, stakeholder, RTM, backlog) and ask which conclusion or action it supports.

STYLE 3 — Predictive Mechanics (25% of questions):
WBS decomposition choices, critical-path logic, or basic variance/baseline reasoning. Give all required figures in the question. Options must be 4 different conclusions or values.
{type_instructions}
CRITICAL OUTPUT RULES:
- Return ONLY a valid JSON array
- No markdown fences, no text before or after the JSON
- Do NOT use unescaped double quotes inside string values
- Use backticks (`) for code references inside strings
- EVERY object MUST have "question_type", "domain", "topic" (a specific syllabus topic, NOT the domain name), "difficulty"
- "pmi_reference" SHOULD name the source (e.g. "PMBOK Guide 7th ed., Ch. Planning" or "Agile Practice Guide, Ch. 3")

[
  {{
    "question_type": "single_choice",
    "domain": "Domain 1 - Project Management Fundamentals and Core Concepts (36%)",
    "question_text": "You are a project team member on a warehouse automation project in the planning phase. The project uses a predictive approach because requirements are stable and regulatory approvals demand upfront documentation. The WBS dictionary is drafted but the risk register has only two entries and no owner assigned. The sponsor asks whether the team is ready for the phase gate review. What should you do next?",
    "options": {{
      "A": "Update the risk register with identified risks, assign owners, and confirm the phase gate entry criteria are met before proceeding",
      "B": "Proceed to execution since the WBS is drafted and add risks to the issue log only if they materialize",
      "C": "Switch the project to an adaptive approach so planning artifacts can be skipped and delivery can start immediately",
      "D": "Ask the sponsor to waive the phase gate review because the schedule is tight and planning can continue in parallel"
    }},
    "correct_answer": "A",
    "topic": "Risk register interpretation",
    "difficulty": "medium",
    "pmi_reference": "PMBOK Guide 7th ed., Ch. Planning"
  }}
]"""

        try:
            body = _build_invoke_body(BEDROCK_MODEL_ID, prompt, max_tokens=12000)
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
NOISE_PAT = re.compile(r'www\.|pmi\.org|page\s+\d|^\d+\s*$|copyright|^\s*$', re.I)


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
                'domain': CAPM_DOMAINS[0],
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


def normalize_domain(domain: str) -> str:
    """Normalize a domain string to its canonical CAPM ECO entry."""
    if not domain:
        return CAPM_DOMAINS[0]
    d = domain.strip()
    for canonical in CAPM_DOMAINS:
        if d.lower() == canonical.lower():
            return canonical
    # Accept short forms like "Domain 1", "Fundamentals", "Agile", "Predictive", "Business Analysis"
    dl = d.lower()
    if dl.startswith('domain 1') or 'fundamental' in dl:
        return CAPM_DOMAINS[0]
    if dl.startswith('domain 2') or 'predictive' in dl:
        return CAPM_DOMAINS[1]
    if dl.startswith('domain 3') or 'agile' in dl:
        return CAPM_DOMAINS[2]
    if dl.startswith('domain 4') or 'business analysis' in dl or dl == 'ba':
        return CAPM_DOMAINS[3]
    return d  # keep as-is; still queryable via scan


def normalize_question(q: Dict, default_topic: str, default_domain: str = '') -> Optional[Dict]:
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

    domain = normalize_domain(q.get('domain') or default_domain)

    item: Dict[str, Any] = {
        'question_type': qtype,
        'domain': domain,
        'question_text': text,
        'topic': q.get('topic', default_topic) or default_topic,
        'difficulty': q.get('difficulty', 'medium') or 'medium',
        'correct_answer': q.get('correct_answer', '') or '',
        'pmi_reference': q.get('pmi_reference', '') or 'PMBOK Guide - Seventh Edition',
    }

    # Case-study grouping fields ride along on ANY answerable question so a
    # cluster of questions can share one scenario. These are not a
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


def upload_to_dynamodb(questions: List[Dict], exam: str, topic: str = 'General', domain: str = ''):
    """Upload questions to the CAPM DynamoDB table (type-aware)."""
    table = dynamodb.Table(TABLE_NAME)
    now = datetime.utcnow().isoformat()
    uploaded = 0
    skipped = 0
    by_type: Dict[str, int] = {}
    by_domain: Dict[str, int] = {}
    case_study_ids: set = set()

    with table.batch_writer() as batch:
        for q in questions:
            norm = normalize_question(q, topic, domain)
            if norm is None:
                skipped += 1
                continue

            item = {
                'question_id': str(uuid.uuid4()),
                'version': 'v1.0',
                'paper': exam,
                'paper_name': exam,  # compat: old code paths filter on paper_name
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
            by_domain[norm['domain']] = by_domain.get(norm['domain'], 0) + 1
            if norm.get('case_study_id'):
                case_study_ids.add(norm['case_study_id'])

    dist = ', '.join(f"{k}:{v}" for k, v in sorted(by_type.items()))
    ddist = ', '.join(f"D{i+1}:{v}" for i, v in enumerate(
        [by_domain.get(d, 0) for d in CAPM_DOMAINS]))
    print(f"  ✓ {uploaded} uploaded to DynamoDB (table: {TABLE_NAME}, paper: {exam}) — {dist}")
    print(f"  📊 domains — {ddist}")
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
        print(f"\n  Q{i+1} [{qtype}]{cs} ({q.get('difficulty','?')}) — {q.get('domain','?')} / {q.get('topic','?')}")
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
    parser = argparse.ArgumentParser(description='CAPM exam question generator from PDF')
    parser.add_argument('--pdf', required=True, help='PDF file or folder')
    parser.add_argument('--exam', default='CAPM', help='Exam code (default: CAPM)')
    parser.add_argument('--count', type=int, default=50, help='Questions to generate (default: 50)')
    parser.add_argument('--topic', default='General', help='Topic override')
    parser.add_argument('--domain', default='', help='Domain override (default: model assigns per ECO weights)')
    parser.add_argument('--mode', default='generate', choices=['generate', 'parse'],
                        help='generate = Bedrock creates questions from docs; parse = extract from exam-dump PDF')
    parser.add_argument('--types', default='single', choices=['single', 'mixed'],
                        help="single = single_choice only; mixed = multi_select/yes_no/drag_drop/build_list mix")
    parser.add_argument('--upload', action='store_true', help='Upload to DynamoDB')

    args = parser.parse_args()

    print(f"\n{'═'*60}")
    print(f"  CAPM Exam Question Generator")
    print(f"  Mode: {args.mode.upper()} | Types: {args.types}")
    print(f"  Exam: {args.exam} | Count: {args.count} | Table: {TABLE_NAME}")
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
        upload_to_dynamodb(all_questions, args.exam, args.topic, args.domain)
    elif not args.upload:
        print("\n  Dry run — add --upload to save")

    # Save JSON
    out = f"{args.exam.lower()}_{args.mode}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    with open(out, 'w') as f:
        json.dump(all_questions, f, indent=2, ensure_ascii=False)
    print(f"  💾 {out}\n")


if __name__ == '__main__':
    main()
