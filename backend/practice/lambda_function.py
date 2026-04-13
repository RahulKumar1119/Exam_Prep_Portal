"""
Practice Set Generator Lambda Function
Handles practice set generation (AI-powered via Bedrock) and submission.
"""

import json
import uuid
import random
import re
from datetime import datetime
from typing import List, Dict, Any, Optional

import boto3

# Constants
QUESTIONS_PER_SET = 50
BEDROCK_MODEL_ID = 'arn:aws:bedrock:ap-south-1:438097524343:inference-profile/apac.anthropic.claude-sonnet-4-20250514-v1:0'
REGION = 'ap-south-1'

# JAIIB syllabus topics per paper (based on IIBF / EduTap strategy)
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

# JAIIB marking scheme: 25 easy (0.5 mark) + 15 medium (1 mark) + 10 hard (2 mark) = 50 questions


def get_dynamodb_tables():
    dynamodb = boto3.resource('dynamodb', region_name=REGION)
    return dynamodb.Table('jaiib-question-bank'), dynamodb.Table('jaiib-practice-sessions')


def get_bedrock_client():
    return boto3.client('bedrock-runtime', region_name=REGION)


def success_response(data: Dict[str, Any]) -> Dict[str, Any]:
    return {
        'statusCode': 200,
        'body': json.dumps(data),
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS,PATCH',
            'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'
        }
    }


def error_response(status_code: int, message: str) -> Dict[str, Any]:
    return {
        'statusCode': status_code,
        'body': json.dumps({'error': message}),
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS,PATCH',
            'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'
        }
    }


def build_question_prompt(paper_name: str, syllabus: dict) -> str:
    """Build a single prompt to generate all 50 JAIIB MCQs in one Bedrock call."""
    modules_text = ''
    for module, topics in syllabus.get('modules', {}).items():
        modules_text += f"\n{module}:\n" + '\n'.join(f'  - {t}' for t in topics)

    return f"""You are an expert JAIIB exam question setter for the Institute of Indian Banking & Finance (IIBF).

Generate exactly 50 multiple-choice questions for the JAIIB paper: {paper_name}

JAIIB marking scheme — generate this exact distribution:
- 25 EASY questions (0.5 mark each): test recall of facts, definitions, acts, and regulations
- 15 MEDIUM questions (1 mark each): test understanding and application of concepts
- 10 HARD questions (2 marks each): involve calculations, case-based reasoning, or multi-step application

Syllabus topics to draw from (spread questions across all modules):
{modules_text}

STRICT RULES:
1. Each question must have exactly 4 options: A, B, C, D
2. Only one option is correct
3. All questions must be factually accurate and relevant to Indian banking
4. Hard questions must involve numerical calculations or scenario-based application
5. Do NOT repeat questions or topics
6. Cover all modules — do not focus on just one area

Return ONLY a valid JSON array with exactly 50 items. No explanation, no markdown fences, no extra text.
Format:
[
  {{
    "question_text": "...",
    "options": {{"A": "...", "B": "...", "C": "...", "D": "..."}},
    "correct_answer": "A",
    "topic": "...",
    "difficulty": "easy"
  }}
]"""


def invoke_bedrock_for_questions(prompt: str) -> Optional[List[Dict]]:
    """Call Bedrock Claude and parse the JSON response."""
    try:
        client = get_bedrock_client()
        body = {
            "anthropic_version": "bedrock-2023-05-31",
            "max_tokens": 16000,
            "messages": [{"role": "user", "content": prompt}]
        }
        response = client.invoke_model(
            modelId=BEDROCK_MODEL_ID,
            body=json.dumps(body)
        )
        text = json.loads(response['body'].read())['content'][0]['text'].strip()

        # Strip markdown fences if present
        text = re.sub(r'^```(?:json)?\s*', '', text)
        text = re.sub(r'\s*```$', '', text)

        match = re.search(r'\[.*\]', text, re.DOTALL)
        if not match:
            print(f"No JSON array found in Bedrock response: {text[:200]}")
            return None

        questions = json.loads(match.group())
        return questions if isinstance(questions, list) else None

    except Exception as e:
        print(f"Bedrock invocation error: {str(e)}")
        return None


def generate_questions_via_bedrock(paper_name: str) -> List[Dict[str, Any]]:
    """Generate 50 JAIIB questions using a single Bedrock call."""
    syllabus = PAPER_SYLLABUS.get(paper_name, {})
    prompt = build_question_prompt(paper_name, syllabus)
    questions = invoke_bedrock_for_questions(prompt)

    if not questions:
        return []

    for q in questions:
        q['question_id'] = str(uuid.uuid4())
        q['version'] = '1'
        q['paper_name'] = paper_name
        q.setdefault('topic', paper_name)
        q.setdefault('difficulty', 'medium')

    return questions


def get_questions_by_paper(questions_table, paper_name: str, count: int) -> List[Dict[str, Any]]:
    """Get random questions from DynamoDB for a specific paper."""
    try:
        response = questions_table.query(
            IndexName='paper-topic-index',
            KeyConditionExpression='paper_name = :paper',
            ExpressionAttributeValues={':paper': paper_name}
        )
        questions = response.get('Items', [])
        if len(questions) < count:
            return questions
        return random.sample(questions, count)
    except Exception as e:
        print(f"Error getting questions from DB: {str(e)}")
        return []


def handler(event, context):
    """Lambda handler for practice set generation."""
    try:
        http_method = event.get('httpMethod', 'POST')
        if http_method == 'OPTIONS':
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS,PATCH',
                    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'
                },
                'body': json.dumps({})
            }

        body_str = event.get('body', '{}')
        body = json.loads(body_str) if isinstance(body_str, str) and body_str else (body_str or {})

        user_id    = body.get('user_id')
        paper_name = body.get('paper_name')
        action     = body.get('action', 'generate')
        session_id = body.get('session_id')
        answers    = body.get('answers', {})

        if not user_id:
            return error_response(400, "user_id is required")

        questions_table, sessions_table = get_dynamodb_tables()

        # ── GENERATE ──────────────────────────────────────────────────────────
        if action == 'generate':
            if not paper_name:
                return error_response(400, "paper_name is required")

            valid_papers = ['IE & IFS', 'PPB', 'AFB', 'RBWM']
            if paper_name not in valid_papers:
                return error_response(400, f"Invalid paper_name. Must be one of: {', '.join(valid_papers)}")

            # Try AI generation first; fall back to DB if Bedrock fails
            questions = generate_questions_via_bedrock(paper_name)

            if not questions or len(questions) < QUESTIONS_PER_SET:
                print(f"Bedrock returned {len(questions)} questions, falling back to DB")
                db_questions = get_questions_by_paper(questions_table, paper_name, QUESTIONS_PER_SET)
                # Merge: fill remaining slots from DB
                needed = QUESTIONS_PER_SET - len(questions)
                questions.extend(db_questions[:needed])

            if not questions:
                return error_response(500, "Unable to generate questions. Please try again.")

            # Trim to exactly 50
            questions = questions[:QUESTIONS_PER_SET]

            session_id = str(uuid.uuid4())
            formatted_questions = [
                {
                    'question_id': q.get('question_id', str(uuid.uuid4())),
                    'question_text': q['question_text'],
                    'options': q['options'],
                    'difficulty': q.get('difficulty', 'medium'),
                    'topic': q.get('topic', 'General'),
                    'correct_answer': q.get('correct_answer')
                }
                for q in questions
            ]

            try:
                sessions_table.put_item(Item={
                    'session_id': session_id,
                    'user_id': user_id,
                    'paper_name': paper_name,
                    'questions': formatted_questions,
                    'created_at': datetime.utcnow().isoformat(),
                    'ttl': int(datetime.utcnow().timestamp()) + 86400
                })
            except Exception as e:
                print(f"Error storing session: {str(e)}")

            return success_response({
                'session_id': session_id,
                'user_id': user_id,
                'paper_name': paper_name,
                'questions': formatted_questions,
                'total_questions': len(formatted_questions),
                'created_at': datetime.utcnow().isoformat()
            })

        # ── SUBMIT ────────────────────────────────────────────────────────────
        elif action == 'submit':
            if not session_id:
                return error_response(400, "session_id is required")
            if not answers:
                return error_response(400, "answers are required")

            try:
                response = sessions_table.get_item(Key={'session_id': session_id})
                session = response.get('Item')
                if not session:
                    return error_response(404, "Session not found")

                questions = session.get('questions', [])
                results = []
                correct_count = 0

                for question in questions:
                    question_id  = question['question_id']
                    user_answer  = answers.get(question_id)
                    correct_answer = question.get('correct_answer')
                    is_correct   = user_answer == correct_answer
                    if is_correct:
                        correct_count += 1
                    results.append({
                        'question_id':    question_id,
                        'question_text':  question.get('question_text', ''),
                        'options':        question.get('options', {}),
                        'correct':        is_correct,
                        'user_answer':    user_answer or '',
                        'correct_answer': correct_answer
                    })

                total_questions = len(questions)
                score = int((correct_count / total_questions * 100)) if total_questions > 0 else 0
                passed = score >= 60
                submitted_at = datetime.utcnow().isoformat()

                try:
                    created_dt   = datetime.fromisoformat(session.get('created_at', submitted_at))
                    submitted_dt = datetime.fromisoformat(submitted_at)
                    time_taken   = int((submitted_dt - created_dt).total_seconds())
                except Exception:
                    time_taken = 0

                try:
                    sessions_table.update_item(
                        Key={'session_id': session_id},
                        UpdateExpression='SET #s = :status, score = :score, passed = :passed, submitted_at = :submitted_at, time_taken = :time_taken',
                        ExpressionAttributeNames={'#s': 'status'},
                        ExpressionAttributeValues={
                            ':status':       'completed',
                            ':score':        score,
                            ':passed':       passed,
                            ':submitted_at': submitted_at,
                            ':time_taken':   time_taken,
                        }
                    )
                except Exception as e:
                    print(f"Warning: failed to update session: {e}")

                return success_response({
                    'session_id':  session_id,
                    'user_id':     user_id,
                    'score':       score,
                    'results':     results,
                    'time_taken':  time_taken,
                    'passed':      passed,
                    'submitted_at': submitted_at
                })

            except Exception as e:
                print(f"Error processing submission: {str(e)}")
                return error_response(500, f"Error processing submission: {str(e)}")

        else:
            return error_response(400, f"Unknown action: {action}")

    except Exception as e:
        print(f"Error: {str(e)}")
        return error_response(500, "Internal server error")
