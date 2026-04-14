"""
Practice Set Generator Lambda Function

Flow:
  1. POST /practice/generate  → stores session with status='generating',
                                 invokes THIS Lambda async to do Bedrock work,
                                 returns {session_id, status:'generating'} immediately (<1s)
  2. GET  /practice/status/{session_id} → returns {status, questions} once ready
  3. POST /practice/submit    → scores the session
"""

import json
import uuid
import random
import re
from datetime import datetime
from typing import List, Dict, Any, Optional

import boto3

# ── Constants ─────────────────────────────────────────────────────────────────
QUESTIONS_PER_SET = 50
BEDROCK_MODEL_ID  = 'arn:aws:bedrock:ap-south-1:438097524343:inference-profile/apac.anthropic.claude-sonnet-4-20250514-v1:0'
REGION            = 'ap-south-1'
LAMBDA_FUNC_NAME = 'jaiib-practice'   # self-invoke for async generation

# ── JAIIB syllabus ────────────────────────────────────────────────────────────
PAPER_SYLLABUS = {
    'IE & IFS': {
        'modules': {
            'Module A - Indian Economic Architecture': [
                'Indian Economy overview', 'GDP and National Income', 'Economic planning',
                'Agriculture sector', 'Industrial sector', 'Service sector',
                'Inflation and price indices', 'Fiscal policy', 'Union Budget'
            ],
            'Module B - Economic Concepts Related to Banking': [
                'Money supply and monetary policy', 'RBI functions and role',
                'Credit creation', 'Interest rates', 'Foreign exchange',
                'Balance of payments', 'Capital account convertibility'
            ],
            'Module C - Indian Financial Architecture': [
                'Banking Regulation Act 1949', 'RBI Act 1934', 'SEBI', 'IRDAI',
                'PFRDA', 'Financial markets', 'Money market instruments',
                'Capital market', 'Debt market', 'Forex market'
            ],
            'Module D - Financial Products and Services': [
                'Retail banking products', 'Corporate banking', 'Priority sector lending',
                'Financial inclusion', 'Digital banking', 'Payment systems',
                'NEFT RTGS IMPS UPI', 'Insurance products', 'Mutual funds'
            ]
        }
    },
    'PPB': {
        'modules': {
            'Module A - General Banking Operations': [
                'Types of bank accounts', 'KYC norms', 'Account opening',
                'Nomination facility', 'Cheque and its types', 'Crossing of cheques',
                'Negotiable Instruments Act 1881', 'Promissory note', 'Bill of exchange',
                'Banker customer relationship'
            ],
            'Module B - Functions of Banks': [
                'Loans and advances', 'Secured and unsecured loans', 'Mortgage',
                'Pledge and hypothecation', 'Priority sector lending', 'MSME lending',
                'Agricultural loans', 'NPA classification', 'SARFAESI Act',
                'Recovery of debts', 'Credit appraisal'
            ],
            'Module C - Banking Technology': [
                'Core banking solution', 'Internet banking', 'Mobile banking',
                'ATM operations', 'RTGS NEFT IMPS', 'UPI', 'Cheque truncation system',
                'Cyber security', 'IT Act 2000', 'Digital payments'
            ],
            'Module D - Ethics in Banking': [
                'Banking codes and standards', 'Customer grievance redressal',
                'Banking ombudsman', 'Fair practices code', 'Anti-money laundering',
                'PMLA 2002', 'KYC AML CFT', 'Corporate governance',
                'Whistle blower policy', 'Code of conduct'
            ]
        }
    },
    'AFB': {
        'modules': {
            'Module A - Accounting Principles and Processes': [
                'Accounting concepts and conventions', 'Double entry system',
                'Journal and ledger', 'Trial balance', 'Depreciation methods',
                'Provisions and reserves', 'Rectification of errors',
                'Bank reconciliation statement'
            ],
            'Module B - Financial Statements and Core Banking': [
                'Trading and P&L account', 'Balance sheet', 'Cash flow statement AS-3',
                'Fund flow statement', 'Ratio analysis', 'Working capital management',
                'NPBT calculation TIPP', 'Financing activities', 'Operating activities'
            ],
            'Module C - Financial Management': [
                'Time value of money', 'Capital budgeting NPV IRR', 'Cost of capital',
                'Capital structure', 'Leverage', 'Dividend policy',
                'Working capital financing', 'Risk and return', 'CAPM'
            ],
            'Module D - Taxation and Costing': [
                'Income tax basics', 'TDS provisions', 'GST overview',
                'Cost accounting concepts', 'Marginal costing', 'Break even analysis',
                'Standard costing', 'Budgetary control'
            ]
        }
    },
    'RBWM': {
        'modules': {
            'Module A - Retail Banking': [
                'Retail banking overview', 'Retail products', 'Home loans',
                'Auto loans', 'Personal loans', 'Credit cards', 'Debit cards',
                'Retail deposits', 'NRI banking', 'Priority banking'
            ],
            'Module B - Retail Products and Recovery': [
                'Loan against property', 'Education loans', 'Gold loans',
                'Microfinance', 'Self help groups', 'Recovery management',
                'Lok adalat', 'DRT', 'SARFAESI in retail', 'One time settlement'
            ],
            'Module C - Marketing of Banking Services': [
                'Marketing concepts', 'Market segmentation', 'CRM',
                'Digital marketing', 'Cross selling', 'Customer lifecycle',
                'Service quality', 'Brand management', 'Distribution channels'
            ],
            'Module D - Wealth Management': [
                'Wealth management overview', 'Financial planning', 'Investment products',
                'Mutual funds types', 'Portfolio management', 'Risk profiling',
                'Insurance planning', 'Retirement planning', 'Tax planning',
                'Estate planning', 'High net worth individuals'
            ]
        }
    }
}

CORS_HEADERS = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS,PATCH',
    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'
}


# ── AWS clients ───────────────────────────────────────────────────────────────
def _dynamodb():
    r = boto3.resource('dynamodb', region_name=REGION)
    return r.Table('jaiib-question-bank'), r.Table('jaiib-practice-sessions')

def _bedrock():
    return boto3.client('bedrock-runtime', region_name=REGION)

def _lambda():
    return boto3.client('lambda', region_name=REGION)


# ── Response helpers ──────────────────────────────────────────────────────────
def ok(data):
    return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps(data)}

def err(code, msg):
    return {'statusCode': code, 'headers': CORS_HEADERS, 'body': json.dumps({'error': msg})}


# ── Bedrock question generation ───────────────────────────────────────────────
def _build_prompt(paper_name: str) -> str:
    syllabus = PAPER_SYLLABUS.get(paper_name, {})
    modules_text = ''
    for module, topics in syllabus.get('modules', {}).items():
        modules_text += f"\n{module}:\n" + '\n'.join(f'  - {t}' for t in topics)

    if paper_name == 'AFB':
        hard_style = (
            "20 HARD questions (2 marks): MUST be numerical calculation-based "
            "(e.g. compute NPV, IRR, depreciation, ratio, cash flow, NPBT, break-even, "
            "capital budgeting, working capital, leverage ratios). "
            "Give all required figures in the question. Options must be 4 different numeric values."
        )
        source_instruction = (
            "Base ALL questions strictly on the content of the provided AFM textbook PDF. "
            "Use actual examples, figures, concepts, and terminology from the book. "
            "Questions must reflect the depth and style of the IIBF Macmillan AFM textbook."
        )
    else:
        hard_style = (
            "20 HARD questions (2 marks): Present 3-4 statements (labelled I, II, III, IV) "
            "and ask which are correct/incorrect. "
            "Format: 'Consider the following statements:\\nI. ...\\nII. ...\\nIII. ...\\n"
            "Which of the above statements is/are correct?' "
            "Options: combinations like 'Only I', 'I and II', 'II and III', 'All of the above'. "
            "Statements must test deep knowledge — include tricky/misleading statements."
        )
        source_instruction = "Base questions on the JAIIB syllabus topics listed below."

    return f"""You are a senior JAIIB exam question setter for IIBF with 15 years of experience.

{source_instruction}

Generate exactly 50 challenging multiple-choice questions for JAIIB paper: {paper_name}

STRICT distribution:
- 10 EASY questions (0.5 mark): basic definitions and acts only — keep these minimal
- 20 MEDIUM questions (1 mark): application of concepts, exceptions, comparisons, regulatory limits,
  specific provisions of acts, case-based scenarios. NOT simple definitions.
- {hard_style}

Syllabus (cover ALL modules evenly):
{modules_text}

QUALITY RULES — strictly follow:
1. NO trivial questions like "What does KYC stand for?" or "What is a cheque?"
2. Medium questions must test specific knowledge: exact thresholds, regulatory limits,
   exceptions to rules, differences between similar concepts, practical application
3. Options must be plausible — all 4 options should look correct to someone who hasn't studied deeply
4. Avoid questions with obvious answers — a well-prepared student should find these challenging
5. Each question has exactly 4 options A, B, C, D — only one correct
6. All facts must be accurate and current for Indian banking
7. No repeated questions — cover diverse topics across all modules
8. For medium questions, prefer: "Which of the following is CORRECT/INCORRECT?",
   "As per [Act/RBI guideline], which...", "In case of [scenario], what..."

Return ONLY a valid JSON array of exactly 50 objects. No markdown, no explanation.
[
  {{
    "question_text": "...",
    "options": {{"A": "...", "B": "...", "C": "...", "D": "..."}},
    "correct_answer": "A",
    "topic": "...",
    "difficulty": "easy|medium|hard"
  }}
]"""


def _call_bedrock(paper_name: str) -> List[Dict]:
    """Call Bedrock Claude with a text-only prompt."""
    try:
        client = _bedrock()
        body = {
            "anthropic_version": "bedrock-2023-05-31",
            "max_tokens": 16000,
            "messages": [{"role": "user", "content": _build_prompt(paper_name)}]
        }
        resp = client.invoke_model(modelId=BEDROCK_MODEL_ID, body=json.dumps(body))
        text = json.loads(resp['body'].read())['content'][0]['text'].strip()

        text = re.sub(r'^```(?:json)?\s*', '', text)
        text = re.sub(r'\s*```$', '', text)

        m = re.search(r'\[.*\]', text, re.DOTALL)
        if not m:
            print("No JSON array in Bedrock response")
            return []
        qs = json.loads(m.group())
        return qs if isinstance(qs, list) else []
    except Exception as e:
        print(f"Bedrock error: {e}")
        return []


def _db_fallback(questions_table, paper_name: str, count: int) -> List[Dict]:
    try:
        resp = questions_table.query(
            IndexName='paper-topic-index',
            KeyConditionExpression='paper_name = :p',
            ExpressionAttributeValues={':p': paper_name}
        )
        items = resp.get('Items', [])
        return random.sample(items, min(count, len(items)))
    except Exception as e:
        print(f"DB fallback error: {e}")
        return []


# ── Async worker (invoked by itself) ─────────────────────────────────────────
def _do_generate(session_id: str, paper_name: str, sessions_table, questions_table):
    """Called asynchronously — generates questions and updates the session."""

    # AFB and IE & IFS: pull from DynamoDB (questions imported from docx/pdf)
    # Other papers: generate via Bedrock
    if paper_name in ('AFB', 'IE & IFS'):
        questions = _db_fallback(questions_table, paper_name, QUESTIONS_PER_SET)
        if not questions:
            questions = _call_bedrock(paper_name)
    else:
        questions = _call_bedrock(paper_name)
        if len(questions) < QUESTIONS_PER_SET:
            needed = QUESTIONS_PER_SET - len(questions)
            questions += _db_fallback(questions_table, paper_name, needed)

    questions = questions[:QUESTIONS_PER_SET]

    formatted = [
        {
            'question_id':   q.get('question_id', str(uuid.uuid4())),
            'question_text': q['question_text'],
            'options':       q['options'],
            'difficulty':    q.get('difficulty', 'medium'),
            'topic':         q.get('topic', 'General'),
            'correct_answer': q.get('correct_answer')
        }
        for q in questions
    ]

    status = 'ready' if formatted else 'failed'

    sessions_table.update_item(
        Key={'session_id': session_id},
        UpdateExpression='SET #st = :s, questions = :q',
        ExpressionAttributeNames={'#st': 'status'},
        ExpressionAttributeValues={':s': status, ':q': formatted}
    )
    print(f"Session {session_id} updated to {status} with {len(formatted)} questions")


# ── Main handler ──────────────────────────────────────────────────────────────
def handler(event, context):
    try:
        # CORS preflight
        if event.get('httpMethod') == 'OPTIONS':
            return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': '{}'}

        questions_table, sessions_table = _dynamodb()

        # ── Internal async worker call (no httpMethod) ────────────────────────
        if 'async_action' in event:
            _do_generate(
                event['session_id'],
                event['paper_name'],
                sessions_table,
                questions_table
            )
            return {'statusCode': 200}

        # ── Parse HTTP request ────────────────────────────────────────────────
        method = event.get('httpMethod', 'POST')
        path   = event.get('path', '')

        body_raw = event.get('body', '{}')
        body = json.loads(body_raw) if isinstance(body_raw, str) and body_raw else (body_raw or {})

        user_id    = body.get('user_id')
        paper_name = body.get('paper_name')
        action     = body.get('action', 'generate')
        session_id = body.get('session_id')
        answers    = body.get('answers', {})

        # ── GET /practice/status/{session_id} ─────────────────────────────────
        if method == 'GET' and '/status/' in path:
            sid = path.split('/status/')[-1].strip('/')
            resp = sessions_table.get_item(Key={'session_id': sid})
            session = resp.get('Item')
            if not session:
                return err(404, 'Session not found')
            status = session.get('status', 'generating')
            if status == 'ready':
                return ok({
                    'status': 'ready',
                    'session_id': sid,
                    'paper_name': session.get('paper_name'),
                    'questions': session.get('questions', []),
                    'total_questions': len(session.get('questions', [])),
                    'created_at': session.get('created_at')
                })
            return ok({'status': status, 'session_id': sid})

        if not user_id:
            return err(400, 'user_id is required')

        # ── POST generate ─────────────────────────────────────────────────────
        if action == 'generate':
            if not paper_name:
                return err(400, 'paper_name is required')
            valid = ['IE & IFS', 'PPB', 'AFB', 'RBWM']
            if paper_name not in valid:
                return err(400, f"paper_name must be one of: {', '.join(valid)}")

            session_id = str(uuid.uuid4())
            now = datetime.utcnow().isoformat()

            # Store placeholder session immediately
            sessions_table.put_item(Item={
                'session_id': session_id,
                'user_id':    user_id,
                'paper_name': paper_name,
                'status':     'generating',
                'questions':  [],
                'created_at': now,
                'ttl':        int(datetime.utcnow().timestamp()) + 86400
            })

            # Fire-and-forget async Lambda self-invoke
            _lambda().invoke(
                FunctionName=LAMBDA_FUNC_NAME,
                InvocationType='Event',          # async — returns immediately
                Payload=json.dumps({
                    'async_action': 'generate',
                    'session_id':   session_id,
                    'paper_name':   paper_name
                })
            )

            return ok({
                'session_id': session_id,
                'status':     'generating',
                'message':    'Practice set is being generated. Poll /practice/status/{session_id} to check progress.'
            })

        # ── POST submit ───────────────────────────────────────────────────────
        elif action == 'submit':
            if not session_id:
                return err(400, 'session_id is required')
            if not answers:
                return err(400, 'answers are required')

            resp = sessions_table.get_item(Key={'session_id': session_id})
            session = resp.get('Item')
            if not session:
                return err(404, 'Session not found')

            questions = session.get('questions', [])
            correct_count = 0
            results = []

            for q in questions:
                qid          = q['question_id']
                user_ans     = answers.get(qid)
                correct_ans  = q.get('correct_answer')
                is_correct   = user_ans == correct_ans
                if is_correct:
                    correct_count += 1
                results.append({
                    'question_id':    qid,
                    'question_text':  q.get('question_text', ''),
                    'options':        q.get('options', {}),
                    'correct':        is_correct,
                    'user_answer':    user_ans or '',
                    'correct_answer': correct_ans
                })

            total      = len(questions)
            score      = int(correct_count / total * 100) if total else 0
            passed     = score >= 60
            submitted  = datetime.utcnow().isoformat()

            try:
                created_dt  = datetime.fromisoformat(session.get('created_at', submitted))
                time_taken  = int((datetime.fromisoformat(submitted) - created_dt).total_seconds())
            except Exception:
                time_taken = 0

            sessions_table.update_item(
                Key={'session_id': session_id},
                UpdateExpression='SET #s = :s, score = :sc, passed = :p, submitted_at = :sa, time_taken = :tt',
                ExpressionAttributeNames={'#s': 'status'},
                ExpressionAttributeValues={
                    ':s': 'completed', ':sc': score,
                    ':p': passed, ':sa': submitted, ':tt': time_taken
                }
            )

            return ok({
                'session_id':  session_id,
                'user_id':     user_id,
                'score':       score,
                'results':     results,
                'time_taken':  time_taken,
                'passed':      passed,
                'submitted_at': submitted
            })

        return err(400, f"Unknown action: {action}")

    except Exception as e:
        print(f"Handler error: {e}")
        return err(500, 'Internal server error')
