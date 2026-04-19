"""
Bulk AI Explanation Generator
Scans all questions from Question_Bank and generates AI explanations
for any question that doesn't already have one in jaiib-ai-explanations.
"""

import boto3
import json
import time
import uuid
import threading
import logging
from datetime import datetime
from typing import Optional, Tuple

# ── Config ────────────────────────────────────────────────────────────────────
REGION = 'ap-south-1'
QUESTION_TABLE = 'jaiib-question-bank'
EXPLANATION_TABLE = 'jaiib-ai-explanations'
MODEL_ID = 'google.gemma-3-27b-it'
EXPLANATION_TIMEOUT = 45   # seconds per question
DELAY_BETWEEN_CALLS = 1.0  # seconds – avoids Bedrock throttling

logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s %(message)s')
log = logging.getLogger(__name__)

# ── AWS clients ───────────────────────────────────────────────────────────────
dynamodb   = boto3.resource('dynamodb', region_name=REGION)
bedrock    = boto3.client('bedrock-runtime', region_name=REGION)
q_table    = dynamodb.Table(QUESTION_TABLE)
exp_table  = dynamodb.Table(EXPLANATION_TABLE)


# ── Helpers ───────────────────────────────────────────────────────────────────

def already_explained(question_id: str) -> bool:
    """Return True if a non-fallback explanation already exists for this question."""
    try:
        resp = exp_table.query(
            IndexName='question_id-index',
            KeyConditionExpression='question_id = :qid',
            ExpressionAttributeValues={':qid': question_id},
            Limit=5
        )
        items = resp.get('Items', [])
        return any(not item.get('is_fallback', False) for item in items)
    except Exception as e:
        log.warning(f"Cache check failed for {question_id}: {e}")
        return False


def build_prompt(q: dict) -> str:
    opts = q.get('options', [])
    # options can be a list ['A text','B text',...] or dict {'A':...,'B':...}
    if isinstance(opts, list):
        opt_map = {chr(65 + i): v for i, v in enumerate(opts)}
    else:
        opt_map = opts

    return f"""You are an expert JAIIB/CAIIB exam tutor. Explain this question clearly.

Question: {q.get('question_text', '')}

Options:
A. {opt_map.get('A', '')}
B. {opt_map.get('B', '')}
C. {opt_map.get('C', '')}
D. {opt_map.get('D', '')}

Correct Answer: {q.get('correct_answer', '')}

Your explanation must include:
1. Why {q.get('correct_answer', '')} is correct
2. Why the other options are wrong
3. The key banking/financial concept
4. Any relevant RBI/SEBI/IIBF regulatory reference
5. 2 detailed practical real-world examples with specific numbers and step-by-step scenarios

Keep it clear and well-structured, 250-300 words."""


def call_bedrock(prompt: str, timeout: int) -> Tuple[Optional[str], bool]:
    """Call Bedrock with a thread-based timeout. Returns (text, is_timeout)."""
    result = {'text': None, 'error': None}

    def _invoke():
        try:
            resp = bedrock.invoke_model(
                modelId=MODEL_ID,
                contentType='application/json',
                accept='application/json',
                body=json.dumps({
                    'anthropic_version': 'bedrock-2023-05-31',
                    'max_tokens': 900,
                    'messages': [{'role': 'user', 'content': prompt}]
                })
            )
            parsed = json.loads(resp['body'].read())
            # Gemma uses OpenAI-compatible format
            result['text'] = parsed['choices'][0]['message']['content'].strip()
        except Exception as e:
            result['error'] = str(e)

    t = threading.Thread(target=_invoke, daemon=True)
    t.start()
    t.join(timeout)

    if t.is_alive():
        return None, True
    if result['error'] or not result['text']:
        log.error(f"Bedrock error: {result['error']}")
        return None, False
    return result['text'], False


def save(question_id: str, explanation: str, citations: list, gen_time: float):
    exp_table.put_item(Item={
        'explanation_id': str(uuid.uuid4()),
        'question_id': question_id,
        'user_id': 'system-bulk',
        'explanation': explanation,
        'citations': citations,
        'word_count': len(explanation.split()),
        'generation_time': str(round(gen_time, 2)),
        'is_fallback': False,
        'created_at': datetime.utcnow().isoformat(),
        'ttl': int(time.time()) + (365 * 24 * 60 * 60)  # 1 year TTL
    })


def scan_all_questions() -> list:
    """Full table scan – handles pagination."""
    items, last_key = [], None
    while True:
        kwargs = {}
        if last_key:
            kwargs['ExclusiveStartKey'] = last_key
        resp = q_table.scan(**kwargs)
        items.extend(resp.get('Items', []))
        last_key = resp.get('LastEvaluatedKey')
        if not last_key:
            break
    return items


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    log.info("Scanning Question_Bank …")
    questions = scan_all_questions()

    # Keep only questions that have the required fields
    active = [q for q in questions if q.get('question_text') and q.get('correct_answer')]
    log.info(f"Total active questions: {len(active)}")

    done = skipped = failed = 0

    for idx, q in enumerate(active, 1):
        qid = q.get('question_id', '')
        if not qid or not q.get('question_text'):
            log.warning(f"[{idx}/{len(active)}] Skipping – missing question_id or text")
            skipped += 1
            continue

        if already_explained(qid):
            log.info(f"[{idx}/{len(active)}] {qid} – already has explanation, skipping")
            skipped += 1
            continue

        log.info(f"[{idx}/{len(active)}] Generating explanation for {qid} …")
        prompt = build_prompt(q)
        t0 = time.time()
        text, is_timeout = call_bedrock(prompt, EXPLANATION_TIMEOUT)
        elapsed = time.time() - t0

        if not text:
            reason = "timeout" if is_timeout else "error"
            log.warning(f"  ✗ Failed ({reason}) – skipping")
            failed += 1
        else:
            save(qid, text, [], elapsed)
            log.info(f"  ✓ Saved ({len(text.split())} words, {elapsed:.1f}s)")
            done += 1

        time.sleep(DELAY_BETWEEN_CALLS)

    log.info("─" * 60)
    log.info(f"Done.  Generated: {done}  |  Skipped: {skipped}  |  Failed: {failed}")


if __name__ == '__main__':
    main()
