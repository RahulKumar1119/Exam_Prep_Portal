#!/usr/bin/env python3
"""
AWS Certified CloudOps Engineer - Associate (SOA-C03) Question Generator

Paper: CloudOps | Table: jaiib-cloudops-question-bank

Same shape as generate_capm_exam.py, retargeted to AWS SOA-C03
(official exam guide v1.1: 65 questions, 50 scored, 130 min, pass 720/1000).

Two modes:
  1. --mode parse    : Parse questions directly from exam-dump PDFs (Q1. A. B. C. D. Answer: B)
  2. --mode generate : Read PDF content, use Bedrock to generate proper exam questions from it

Usage:
  # Generate exam questions from AWS docs/tutorial PDF (using Bedrock)
  python3 generate_cloudops_exam.py --pdf sysops-docs.pdf --exam CloudOps --count 50 --upload

  # Parse questions from an exam-dump PDF (no AI needed)
  python3 generate_cloudops_exam.py --pdf exam-dump.pdf --exam CloudOps --mode parse --upload

  # Generate from folder of PDFs
  python3 generate_cloudops_exam.py --pdf ./docs/ --exam CloudOps --count 50 --upload

  # Realistic SOA-C03 mix (single/multi/yes-no/drag-drop/ordering + case studies)
  python3 generate_cloudops_exam.py --pdf sysops-docs.pdf --exam CloudOps --count 50 --types mixed --upload
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
TABLE_NAME = 'jaiib-cloudops-question-bank'
BEDROCK_MODEL_ID = 'zai.glm-5'

# AWS clients
bedrock = boto3.client(
    'bedrock-runtime',
    region_name=REGION,
    config=BotoConfig(read_timeout=120, connect_timeout=30)
)
dynamodb = boto3.resource('dynamodb', region_name=REGION)

# SOA-C03 domains (must match backend/shared/syllabus.py PAPER_SYLLABUS['CloudOps'])
CLOUDOPS_DOMAINS = [
    'Domain 1 - Monitoring, Logging, Analysis, Remediation, and Performance Optimization (22%)',
    'Domain 2 - Reliability and Business Continuity (22%)',
    'Domain 3 - Deployment, Provisioning, and Automation (22%)',
    'Domain 4 - Security and Compliance (16%)',
    'Domain 5 - Networking and Content Delivery (18%)',
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
    SOA-C03-style mix: single_choice, multi_select, yes_no, drag_drop and
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

QUESTION TYPE MIX — produce a realistic SOA-C03 exam distribution across this batch:
- ~55% "single_choice": one correct option A-D (as described above).
- ~20% "multi_select": 5 options A-E, 2 or 3 correct. Set "question_type":"multi_select", keep "correct_answer" as a comma string like "A,C", and ALSO add "correct_answers": ["A","C"]. End the question text with "(Select TWO.)" or "(Select all that apply.)".
- ~10% "yes_no": present 3 related operational statements the candidate must judge. Set "question_type":"yes_no", OMIT "options", add "statements": ["stmt 1","stmt 2","stmt 3"] and "correct_answers": ["Yes","No","Yes"] (one Yes/No per statement, same order).
- ~8% "drag_drop": match AWS services/features to operational goals (CloudOps matching style). Set "question_type":"drag_drop", OMIT "options", add "drag_items": [{"id":"i1","label":"..."}, ...], "drop_zones": [{"id":"z1","label":"..."}, ...], and "correct_mapping": {"z1":"i1","z2":"i2"} mapping each zone id to the correct item id.
- ~7% "build_list": order operational/remediation steps correctly. Set "question_type":"build_list", OMIT "options", add "correct_order": ["First step","Second step","Third step","Fourth step"] in the correct sequence.
For every question ALWAYS include "question_type", "domain" (one of the 5 SOA-C03 domains below), "topic" and "difficulty". Only choice types use "options"."""
        else:
            type_instructions = '\nFor every question ALWAYS include "domain" (one of the 5 SOA-C03 domains below), "topic" and "difficulty".'

        prompt = f"""You are a senior AWS Certified CloudOps Engineer - Associate (SOA-C03) exam writer.

Based on the following AWS documentation/tutorial content, create {batch} HIGH-QUALITY SOA-C03 exam questions.

SOURCE CONTENT:
---
{pdf_text[:40000]}
---

SOA-C03 OFFICIAL DOMAINS (generate questions covering ALL domains at these weights):

Domain 1 - Monitoring, Logging, Analysis, Remediation, and Performance Optimization (22%):
   - CloudWatch metrics, alarms (incl. composite), dashboards across accounts/Regions; CloudTrail logging
   - CloudWatch agent on EC2/ECS/EKS; Managed Service for Prometheus and Managed Grafana
   - SNS alarm notifications; EventBridge routing/enrichment and rule troubleshooting
   - Systems Manager Automation runbooks; EBS volume troubleshooting and type optimization
   - S3 performance (Transfer Acceleration, multipart, lifecycle, DataSync); EFS/FSx selection and lifecycle policies
   - RDS Performance Insights, RDS Proxy, config tuning; EC2 placement groups, storage and networking

Domain 2 - Reliability and Business Continuity (22%):
   - Auto Scaling compute; ElastiCache/CloudFront caching for scalability; RDS/DynamoDB scaling
   - ELB configuration and Route 53 health checks; Multi-AZ fault tolerance
   - AWS Backup snapshots (EC2, RDS, EBS, S3, DynamoDB); point-in-time restore vs RTO/RPO/cost
   - S3/FSx versioning; disaster recovery procedures

Domain 3 - Deployment, Provisioning, and Automation (22%):
   - AMIs, container images, EC2 Image Builder; CloudFormation and CDK stacks
   - Deployment troubleshooting (subnet sizing, CloudFormation errors, permissions)
   - RAM and StackSets multi-account/multi-Region sharing
   - Deployment strategies (blue-green, canary, rolling, linear); Terraform/Git automation
   - Systems Manager operational automation; Lambda event-driven automation and S3 Event Notifications

Domain 4 - Security and Compliance (16%):
   - IAM password policies, MFA, roles, federation, resource policies, policy conditions
   - CloudTrail, IAM Access Analyzer, policy simulator audits; multi-account (Organizations, SCPs, Control Tower)
   - Trusted Advisor security remediation; Region/service compliance enforcement
   - KMS encryption at rest; ACM encryption in transit; Secrets Manager; Security Hub/GuardDuty/Config/Inspector findings

Domain 5 - Networking and Content Delivery (18%):
   - VPC subnets, route tables, NACLs, security groups, NAT/IGW/egress-only IGW
   - PrivateLink, VPC endpoints, peering, Transit Gateway, Site-to-Site VPN, Client VPN
   - WAF, Shield, Network Firewall, Route 53 Resolver DNS Firewall auditing
   - Route 53 Resolver, routing policies, query logging; CloudFront and Global Accelerator
   - VPC troubleshooting; VPC flow logs, ELB/WAF/CloudFront log analysis; Reachability Analyzer
   - CloudFront caching issues; hybrid connectivity; CloudWatch network monitoring

REQUIREMENTS:
1. Each single_choice question MUST have exactly 4 options (A, B, C, D) with ONE correct answer
2. NO pure definitions, NO "what does X stand for" — questions must be scenario-based operations tasks:
   "which alarm/remediation SHOULD you configure?", "what is the MOST operationally efficient fix?", "which combination meets RTO/RPO?"
3. Difficulty: ~20% easy, ~45% medium, ~35% hard — THIS IS AN ASSOCIATE-LEVEL OPERATIONS EXAM (1 yr hands-on assumed)
4. SOA-C03 is 65 questions in 130 minutes (50 scored, pass 720/1000) — questions should test console/CLI/IaC judgment, not trivia
5. All options must be plausible — real AWS services, CLI flags, CloudFormation/CDK constructs, console steps
6. EVERY question text MUST be 3-6 sentences with a mini operations scenario (workload, metric/log clue, constraint)
7. At least 40% of questions should name specific services/controls (e.g. composite alarms, Automation runbook, RDS Proxy, SCP, NACL vs security group, flow logs)
8. Set "domain" to the PRIMARY tested domain (exact string from the domain list above)

GENERATE THESE SOA-C03 QUESTION STYLES (mix them):

STYLE 1 — Operations "Best Next Step" (50% of questions):
Start with a 3-6 sentence ops story (workload, monitoring/log clue, constraint such as RTO/RPO, cost, compliance, multi-account). Ask what the CloudOps engineer should do next. Example: "You operate a three-tier app on EC2 behind an ALB in two AZs. CloudWatch shows CPU steady but TargetResponseTime p99 spiking after a deployment, and the ALB access logs show 502s from one AZ. AWS Config flags the Auto Scaling group with min=max=2. The runbook requires no downtime. What should you do next?"

STYLE 2 — Metrics/Log Interpretation (25% of questions):
Present a small metric/alarm/log excerpt (CloudWatch alarm state, flow log rejects, CloudTrail error, Performance Insights wait events) and ask which conclusion or remediation it supports.

STYLE 3 — HA/DR/Security Tradeoff (25% of questions):
RTO/RPO, Multi-AZ vs backup restore, KMS/ACM/IAM policy choices, or VPC/routing fixes. Give all required constraints in the question. Options must be 4 different remediation architectures or values.
{type_instructions}
CRITICAL OUTPUT RULES:
- Return ONLY a valid JSON array
- No markdown fences, no text before or after the JSON
- Do NOT use unescaped double quotes inside string values
- Use backticks (`) for code/CLI references inside strings
- EVERY object MUST have "question_type", "domain", "topic" (a specific syllabus topic, NOT the domain name), "difficulty"
- "aws_reference" SHOULD name the source (e.g. "CloudWatch User Guide, Alarms" or "SOA-C03 Exam Guide, Domain 1")

[
  {{
    "question_type": "single_choice",
    "domain": "Domain 1 - Monitoring, Logging, Analysis, Remediation, and Performance Optimization (22%)",
    "question_text": "You operate an ECS service behind an ALB that serves checkout traffic. CloudWatch shows `RequestCount` steady but `TargetResponseTime` p99 tripled after a task-definition rollout, and ECS events show tasks steady-state flapping. The CloudWatch agent on the container instances reports memory pressure, and the SNS alarm topic pages your team on business-hours only. The runbook requires rollback without dropping in-flight requests. What should you do next?",
    "options": {{
      "A": "Create a composite alarm on p99 latency plus unhealthy-task count that notifies the SNS topic, then roll back the service with minimum-healthy-percent above 100 so replacements start before deregistrations",
      "B": "Delete the CloudWatch alarms so paging stops, then force a new deployment with minimum-healthy-percent 0 to replace all tasks at once",
      "C": "Disable the ALB health checks so flapping tasks stay in service while you investigate memory on one instance",
      "D": "Move the service to a single AZ to reduce cross-AZ latency and skip the rollback until off-hours"
    }},
    "correct_answer": "A",
    "topic": "CloudWatch metrics alarms and dashboards",
    "difficulty": "medium",
    "aws_reference": "CloudWatch User Guide, Composite alarms"
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
                    try:
                        import ast
                        questions = ast.literal_eval(json_str)
                    except:
                        try:
                            json_str = json_str.replace('\u201c', '\\"').replace('\u201d', '\\"')
                            json_str = json_str.replace('\u2018', "\\'").replace('\u2019', "\\'")
                            questions = json.loads(json_str)
                        except json.JSONDecodeError as e2:
                            print(f"    ⚠ Error: {e2}")
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
NOISE_PAT = re.compile(r'www\.|aws\.amazon|page\s+\d|^\d+\s*$|copyright|^\s*$', re.I)


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
                'domain': CLOUDOPS_DOMAINS[0],
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
    """Normalize a domain string to its canonical SOA-C03 entry."""
    if not domain:
        return CLOUDOPS_DOMAINS[0]
    d = domain.strip()
    for canonical in CLOUDOPS_DOMAINS:
        if d.lower() == canonical.lower():
            return canonical
    dl = d.lower()
    if dl.startswith('domain 1') or 'monitor' in dl or 'performance optimization' in dl:
        return CLOUDOPS_DOMAINS[0]
    if dl.startswith('domain 2') or 'reliability' in dl or 'business continuity' in dl:
        return CLOUDOPS_DOMAINS[1]
    if dl.startswith('domain 3') or 'deploy' in dl or 'provision' in dl or 'automation' in dl:
        return CLOUDOPS_DOMAINS[2]
    if dl.startswith('domain 4') or 'security' in dl or 'compliance' in dl:
        return CLOUDOPS_DOMAINS[3]
    if dl.startswith('domain 5') or 'network' in dl or 'content delivery' in dl:
        return CLOUDOPS_DOMAINS[4]
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
        'aws_reference': q.get('aws_reference', '') or q.get('pmi_reference', '') or 'SOA-C03 Exam Guide',
    }

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
        options = {k: v for k, v in (q.get('options') or {}).items() if k and v}
        if len(options) < 2:
            return None
        item['options'] = options

    return item


def upload_to_dynamodb(questions: List[Dict], exam: str, topic: str = 'General', domain: str = ''):
    """Upload questions to the CloudOps DynamoDB table (type-aware)."""
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
                'status': 'active',
                'source': 'MockMaster',
                'created_at': now,
                'updated_at': now,
                **norm,
            }
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
        [by_domain.get(d, 0) for d in CLOUDOPS_DOMAINS]))
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
    parser = argparse.ArgumentParser(description='CloudOps (SOA-C03) exam question generator from PDF')
    parser.add_argument('--pdf', required=True, help='PDF file or folder')
    parser.add_argument('--exam', default='CloudOps', help='Exam code (default: CloudOps)')
    parser.add_argument('--count', type=int, default=50, help='Questions to generate (default: 50)')
    parser.add_argument('--topic', default='General', help='Topic override')
    parser.add_argument('--domain', default='', help='Domain override (default: model assigns per SOA-C03 weights)')
    parser.add_argument('--mode', default='generate', choices=['generate', 'parse'],
                        help='generate = Bedrock creates questions from docs; parse = extract from exam-dump PDF')
    parser.add_argument('--types', default='single', choices=['single', 'mixed'],
                        help="single = single_choice only; mixed = multi_select/yes_no/drag_drop/build_list mix")
    parser.add_argument('--upload', action='store_true', help='Upload to DynamoDB')

    args = parser.parse_args()

    print(f"\n{'═'*60}")
    print(f"  CloudOps (SOA-C03) Exam Question Generator")
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
