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
from decimal import Decimal
from typing import List, Dict, Any, Optional

import boto3


class DecimalEncoder(json.JSONEncoder):
    """Custom JSON encoder that handles Decimal types from DynamoDB."""
    def default(self, obj):
        if isinstance(obj, Decimal):
            if obj % 1 == 0:
                return int(obj)
            return float(obj)
        return super().default(obj)

# ── Constants ─────────────────────────────────────────────────────────────────
QUESTIONS_PER_SET = 100
BEDROCK_MODEL_ID  = 'arn:aws:bedrock:ap-south-1:438097524343:inference-profile/apac.anthropic.claude-sonnet-4-20250514-v1:0'
REGION            = 'ap-south-1'
LAMBDA_FUNC_NAME = 'jaiib-practice'   # self-invoke for async generation

# Mock Test weightage as per real JAIIB exam
MOCK_TEST_CONFIG = {
    'easy':   {'count': 50, 'marks': '0.5'},   # 50 × 0.5 = 25 marks
    'medium': {'count': 25, 'marks': '1.0'},   # 25 × 1.0 = 25 marks
    'hard':   {'count': 25, 'marks': '2.0'},   # 25 × 2.0 = 50 marks
}
MOCK_TEST_MARKS = {'easy': 0.5, 'medium': 1.0, 'hard': 2.0}  # For scoring calculations
MOCK_TEST_TOTAL_MARKS = 100  # 25 + 25 + 50
MOCK_TEST_PASS_MARKS = 50    # 50% of 100 = 50 marks
MOCK_TEST_DURATION = 120     # 120 minutes

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
    return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps(data, cls=DecimalEncoder)}

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
            "40 HARD questions (2 marks): MUST be numerical calculation-based "
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
            "40 HARD questions (2 marks): Present 3-4 statements (labelled I, II, III, IV) "
            "and ask which are correct/incorrect. "
            "Format: 'Consider the following statements:\\nI. ...\\nII. ...\\nIII. ...\\n"
            "Which of the above statements is/are correct?' "
            "Options: combinations like 'Only I', 'I and II', 'II and III', 'All of the above'. "
            "Statements must test deep knowledge — include tricky/misleading statements."
        )
        source_instruction = "Base questions on the JAIIB syllabus topics listed below."

    return f"""You are a senior JAIIB exam question setter for IIBF with 15 years of experience.

{source_instruction}

Generate exactly 100 challenging multiple-choice questions for JAIIB paper: {paper_name}

STRICT distribution:
- 20 EASY questions (0.5 mark): basic definitions and acts only — keep these minimal
- 40 MEDIUM questions (1 mark): application of concepts, exceptions, comparisons, regulatory limits,
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

Return ONLY a valid JSON array of exactly 100 objects. No markdown, no explanation.
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


def _db_fallback(questions_table, paper_name: str, count: int, difficulty: Optional[str] = None) -> List[Dict]:
    """Fetch questions from DynamoDB, optionally filtered by difficulty."""
    try:
        resp = questions_table.query(
            IndexName='paper-topic-index',
            KeyConditionExpression='paper_name = :p',
            ExpressionAttributeValues={':p': paper_name}
        )
        items = resp.get('Items', [])
        
        # Filter by difficulty if specified
        if difficulty:
            items = [q for q in items if q.get('difficulty', 'medium') == difficulty]
        
        return random.sample(items, min(count, len(items)))
    except Exception as e:
        print(f"DB fallback error: {e}")
        return []


def _db_fetch_by_difficulty(questions_table, paper_name: str) -> Dict[str, List[Dict]]:
    """Fetch all questions for a paper, grouped by difficulty."""
    try:
        # Handle pagination for large result sets
        items = []
        kwargs = {
            'IndexName': 'paper-topic-index',
            'KeyConditionExpression': 'paper_name = :p',
            'ExpressionAttributeValues': {':p': paper_name}
        }
        
        while True:
            resp = questions_table.query(**kwargs)
            items.extend(resp.get('Items', []))
            if 'LastEvaluatedKey' not in resp:
                break
            kwargs['ExclusiveStartKey'] = resp['LastEvaluatedKey']
        
        grouped = {'easy': [], 'medium': [], 'hard': []}
        for q in items:
            diff = q.get('difficulty', 'medium')
            if diff in grouped:
                grouped[diff].append(q)
            else:
                grouped['medium'].append(q)
        
        return grouped
    except Exception as e:
        print(f"DB fetch by difficulty error: {e}")
        return {'easy': [], 'medium': [], 'hard': []}


# ── Async worker (invoked by itself) ─────────────────────────────────────────
def _do_generate(session_id: str, paper_name: str, sessions_table, questions_table, mode: str = 'practice'):
    """Called asynchronously — generates questions and updates the session."""

    if mode == 'mock_test':
        questions = _generate_mock_test(paper_name, questions_table)
    else:
        # Original practice mode — pull from DB first, fallback to Bedrock
        DB_PAPERS = ('AFB', 'AFM', 'IE & IFS', 'PPB', 'RBWM')
        if paper_name in DB_PAPERS:
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

    update_expr = 'SET #st = :s, questions = :q'
    expr_values = {':s': status, ':q': formatted}
    
    # For mock test, store the mode and marks config
    if mode == 'mock_test':
        update_expr += ', #mode = :m, marks_config = :mc, total_marks = :tm, pass_marks = :pm, duration_minutes = :dm'
        expr_values[':m'] = 'mock_test'
        expr_values[':mc'] = MOCK_TEST_CONFIG
        expr_values[':tm'] = MOCK_TEST_TOTAL_MARKS
        expr_values[':pm'] = MOCK_TEST_PASS_MARKS
        expr_values[':dm'] = MOCK_TEST_DURATION

    sessions_table.update_item(
        Key={'session_id': session_id},
        UpdateExpression=update_expr,
        ExpressionAttributeNames={'#st': 'status', **(
            {'#mode': 'mode'} if mode == 'mock_test' else {}
        )},
        ExpressionAttributeValues=expr_values
    )
    print(f"Session {session_id} [{mode}] updated to {status} with {len(formatted)} questions")


def _generate_mock_test(paper_name: str, questions_table) -> List[Dict]:
    """
    Generate a mock test with proper JAIIB exam weightage:
    - 50 easy questions (0.5 marks each = 25 marks)
    - 25 medium questions (1 mark each = 25 marks)
    - 25 hard questions (2 marks each = 50 marks)
    Total: 100 questions, 100 marks
    
    Strategy: Try DB first for each difficulty, fill gaps with Bedrock.
    """
    needed = {
        'easy': MOCK_TEST_CONFIG['easy']['count'],    # 50
        'medium': MOCK_TEST_CONFIG['medium']['count'], # 25
        'hard': MOCK_TEST_CONFIG['hard']['count'],     # 25
    }
    
    # Try to fetch from DB grouped by difficulty
    db_grouped = _db_fetch_by_difficulty(questions_table, paper_name)
    
    selected = {'easy': [], 'medium': [], 'hard': []}
    
    for diff in ['easy', 'medium', 'hard']:
        available = db_grouped.get(diff, [])
        count_needed = needed[diff]
        if len(available) >= count_needed:
            selected[diff] = random.sample(available, count_needed)
        else:
            selected[diff] = available  # take all available
    
    # Check what's missing
    missing_easy = needed['easy'] - len(selected['easy'])
    missing_medium = needed['medium'] - len(selected['medium'])
    missing_hard = needed['hard'] - len(selected['hard'])
    
    total_missing = missing_easy + missing_medium + missing_hard
    
    if total_missing > 0:
        # Generate missing questions via Bedrock
        print(f"Mock test: need {missing_easy} easy, {missing_medium} medium, {missing_hard} hard from Bedrock")
        bedrock_questions = _call_bedrock(paper_name)
        
        # Sort Bedrock questions by difficulty
        bedrock_grouped = {'easy': [], 'medium': [], 'hard': []}
        for q in bedrock_questions:
            diff = q.get('difficulty', 'medium')
            if diff in bedrock_grouped:
                bedrock_grouped[diff].append(q)
        
        # Fill gaps
        if missing_easy > 0:
            selected['easy'] += bedrock_grouped['easy'][:missing_easy]
        if missing_medium > 0:
            selected['medium'] += bedrock_grouped['medium'][:missing_medium]
        if missing_hard > 0:
            selected['hard'] += bedrock_grouped['hard'][:missing_hard]
        
        # If still short on any difficulty, redistribute from medium (most available)
        # This handles the case where DB has all medium but no easy/hard
        still_missing_easy = needed['easy'] - len(selected['easy'])
        still_missing_hard = needed['hard'] - len(selected['hard'])
        
        if still_missing_easy > 0 or still_missing_hard > 0:
            # Use remaining medium questions as easy (they're close enough for now)
            remaining_medium = [q for q in db_grouped.get('medium', []) 
                              if q not in selected['medium']]
            
            if still_missing_easy > 0 and remaining_medium:
                fill = remaining_medium[:still_missing_easy]
                for q in fill:
                    q_copy = dict(q)
                    q_copy['difficulty'] = 'easy'
                    selected['easy'].append(q_copy)
                remaining_medium = remaining_medium[still_missing_easy:]
            
            if still_missing_hard > 0 and remaining_medium:
                fill = remaining_medium[:still_missing_hard]
                for q in fill:
                    q_copy = dict(q)
                    q_copy['difficulty'] = 'hard'
                    selected['hard'].append(q_copy)
    
    # Combine all questions in order: easy first, then medium, then hard
    all_questions = selected['easy'] + selected['medium'] + selected['hard']
    
    # Shuffle within each section for variety but keep sections together
    # so the student experiences increasing difficulty
    random.shuffle(selected['easy'])
    random.shuffle(selected['medium'])
    random.shuffle(selected['hard'])
    
    return selected['easy'] + selected['medium'] + selected['hard']


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
                questions_table,
                mode=event.get('mode', 'practice')
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
        mode       = body.get('mode', 'practice')  # 'practice' or 'mock_test'

        # ── GET /practice/status/{session_id} ─────────────────────────────────
        if method == 'GET' and '/status/' in path:
            sid = path.split('/status/')[-1].strip('/')
            resp = sessions_table.get_item(Key={'session_id': sid})
            session = resp.get('Item')
            if not session:
                return err(404, 'Session not found')
            status = session.get('status', 'generating')
            if status == 'ready':
                response_data = {
                    'status': 'ready',
                    'session_id': sid,
                    'paper_name': session.get('paper_name'),
                    'questions': session.get('questions', []),
                    'total_questions': len(session.get('questions', [])),
                    'created_at': session.get('created_at')
                }
                # Include mock test metadata
                if session.get('mode') == 'mock_test':
                    response_data['mode'] = 'mock_test'
                    response_data['duration_minutes'] = session.get('duration_minutes', MOCK_TEST_DURATION)
                    response_data['total_marks'] = session.get('total_marks', MOCK_TEST_TOTAL_MARKS)
                    response_data['pass_marks'] = session.get('pass_marks', MOCK_TEST_PASS_MARKS)
                    response_data['marks_config'] = session.get('marks_config', MOCK_TEST_CONFIG)
                return ok(response_data)
            return ok({'status': status, 'session_id': sid})

        if not user_id:
            return err(400, 'user_id is required')

        # ── POST generate ─────────────────────────────────────────────────────
        if action == 'generate':
            if not paper_name:
                return err(400, 'paper_name is required')
            valid = ['IE & IFS', 'PPB', 'AFM', 'RBWM']
            if paper_name not in valid:
                return err(400, f"paper_name must be one of: {', '.join(valid)}")

            session_id = str(uuid.uuid4())
            now = datetime.utcnow().isoformat()

            # Store placeholder session immediately
            session_item = {
                'session_id': session_id,
                'user_id':    user_id,
                'paper_name': paper_name,
                'status':     'generating',
                'questions':  [],
                'created_at': now,
                'ttl':        int(datetime.utcnow().timestamp()) + 86400
            }
            
            if mode == 'mock_test':
                session_item['mode'] = 'mock_test'
                session_item['duration_minutes'] = MOCK_TEST_DURATION
            
            sessions_table.put_item(Item=session_item)

            # Fire-and-forget async Lambda self-invoke
            _lambda().invoke(
                FunctionName=LAMBDA_FUNC_NAME,
                InvocationType='Event',          # async — returns immediately
                Payload=json.dumps({
                    'async_action': 'generate',
                    'session_id':   session_id,
                    'paper_name':   paper_name,
                    'mode':         mode
                })
            )

            return ok({
                'session_id': session_id,
                'status':     'generating',
                'mode':       mode,
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
            session_mode = session.get('mode', 'practice')
            correct_count = 0
            results = []
            
            # Weighted scoring for mock test
            total_marks_earned = 0
            total_marks_possible = 0

            for q in questions:
                qid          = q['question_id']
                user_ans     = answers.get(qid)
                correct_ans  = q.get('correct_answer')
                is_correct   = user_ans == correct_ans
                difficulty   = q.get('difficulty', 'medium')
                
                # Calculate marks based on difficulty
                if session_mode == 'mock_test':
                    marks_for_q = MOCK_TEST_MARKS.get(difficulty, 1.0)
                else:
                    marks_for_q = 1.0
                
                total_marks_possible += marks_for_q
                
                if is_correct:
                    correct_count += 1
                    total_marks_earned += marks_for_q
                    
                results.append({
                    'question_id':    qid,
                    'question_text':  q.get('question_text', ''),
                    'options':        q.get('options', {}),
                    'correct':        is_correct,
                    'user_answer':    user_ans or '',
                    'correct_answer': correct_ans,
                    'difficulty':     difficulty,
                    'marks':          marks_for_q if is_correct else 0,
                    'max_marks':      marks_for_q
                })

            total = len(questions)
            
            if session_mode == 'mock_test':
                # Weighted score based on marks
                score = round((total_marks_earned / total_marks_possible * 100), 1) if total_marks_possible else 0
                passed = total_marks_earned >= MOCK_TEST_PASS_MARKS
            else:
                # Simple percentage for practice mode
                score = int(correct_count / total * 100) if total else 0
                passed = score >= 60
                
            submitted = datetime.utcnow().isoformat()

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
                    ':s': 'completed', ':sc': Decimal(str(score)),
                    ':p': passed, ':sa': submitted, ':tt': time_taken
                }
            )

            response_data = {
                'session_id':  session_id,
                'user_id':     user_id,
                'score':       score,
                'results':     results,
                'time_taken':  time_taken,
                'passed':      passed,
                'submitted_at': submitted
            }
            
            # Add mock test specific data
            if session_mode == 'mock_test':
                response_data['mode'] = 'mock_test'
                response_data['marks_earned'] = total_marks_earned
                response_data['total_marks'] = total_marks_possible
                response_data['pass_marks'] = MOCK_TEST_PASS_MARKS
                response_data['correct_count'] = correct_count
                response_data['total_questions'] = total
                response_data['breakdown'] = {
                    'easy': {
                        'total': sum(1 for q in questions if q.get('difficulty') == 'easy'),
                        'correct': sum(1 for r in results if r['correct'] and r['difficulty'] == 'easy'),
                        'marks_per_q': 0.5
                    },
                    'medium': {
                        'total': sum(1 for q in questions if q.get('difficulty') == 'medium'),
                        'correct': sum(1 for r in results if r['correct'] and r['difficulty'] == 'medium'),
                        'marks_per_q': 1.0
                    },
                    'hard': {
                        'total': sum(1 for q in questions if q.get('difficulty') == 'hard'),
                        'correct': sum(1 for r in results if r['correct'] and r['difficulty'] == 'hard'),
                        'marks_per_q': 2.0
                    }
                }

            return ok(response_data)

        return err(400, f"Unknown action: {action}")

    except Exception as e:
        print(f"Handler error: {e}")
        return err(500, 'Internal server error')
