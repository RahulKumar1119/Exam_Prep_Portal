"""
JAIIB Question Generator from PDF Textbooks
Uses Amazon Nova 2 Lite on Bedrock to generate statement-based MCQs
and stores them in DynamoDB question bank.

Usage:
    python3 scripts/generate_questions_from_pdf.py

Configuration:
    - S3_BUCKET: S3 bucket containing PDF files
    - S3_KEY: Path to the PDF file in S3
    - PAPER_NAME: Paper name to store in DynamoDB (e.g., "IE & IFS")
    - PAGES_PER_CHUNK: Number of pages to process per API call
    - QUESTIONS_PER_CHUNK: Number of questions to generate per chunk
"""

import boto3
import json
import base64
import uuid
import re
import time
import fitz  # PyMuPDF

# ── Configuration ─────────────────────────────────────────────────────────────
S3_BUCKET = 'courses007'
S3_KEY = 'JAIIB-AFM-Module-B-Financial-Statements-and-Core-Banking-Systems.pdf'
PAPER_NAME = 'AFM'
REGION = 'ap-south-1'
MODEL_ID = 'global.amazon.nova-2-lite-v1:0'
DYNAMODB_TABLE = 'jaiib-question-bank'
PAGES_PER_CHUNK = 25
QUESTIONS_PER_CHUNK = 35  # questions per chunk (25 pages)
MAX_RETRIES = 2

# ── AWS Clients ───────────────────────────────────────────────────────────────
s3 = boto3.client('s3', region_name=REGION)
bedrock = boto3.client('bedrock-runtime', region_name=REGION)
dynamodb = boto3.resource('dynamodb', region_name=REGION)
table = dynamodb.Table(DYNAMODB_TABLE)


# ── Prompt Template ───────────────────────────────────────────────────────────
PROMPT = """Based on this PDF textbook for JAIIB paper "{paper_name}", generate exactly {num_questions} HARD statement-based MCQ questions in the exact IIBF exam format.

STRICT FORMAT RULES:
- Each question MUST present 3-4 numbered statements (1, 2, 3, 4)
- Question asks "Which of the following statements is/are correct?" or "Which of the following correctly describes..."
- Options MUST be combinations: "1 and 2 only", "1, 2 and 3 only", "2 and 4 only", "1, 2, 3 and 4"
- Include 1-2 INCORRECT/misleading statements that look plausible but are factually wrong
- Questions must be based on ACTUAL content from this PDF — use specific numbers, percentages, Act names, section numbers
- Each question must test DEEP knowledge — not basic definitions

TOPIC RULES:
- "topic" must be a specific syllabus topic like: "Priority Sector Lending", "FDI Policy", "MSME Classification", "GDP and National Income", "Fiscal policy", "Banking Regulation Act 1949", "RBI functions and role", "Money supply and monetary policy", "SEBI", "Financial markets"
- Do NOT use the paper name as topic

DISTRIBUTION:
- 3 EASY questions (basic facts, single correct statement identification)
- 4 MEDIUM questions (application of concepts, specific provisions)
- 3 HARD questions (tricky statements with subtle errors, requires deep knowledge)

Return ONLY a valid JSON array. No markdown, no explanation, no ```json wrapper.
[
  {{
    "question_text": "Which of the following statements correctly describe...\\n1. Statement one.\\n2. Statement two.\\n3. Statement three.\\n4. Statement four.",
    "options": {{"A": "1 and 2 only", "B": "1, 2 and 3 only", "C": "2 and 4 only", "D": "1, 2, 3 and 4"}},
    "correct_answer": "A",
    "topic": "specific topic name",
    "difficulty": "easy|medium|hard",
    "reference": "Page X"
  }}
]"""


def download_pdf():
    """Download PDF from S3."""
    print(f"📥 Downloading PDF from s3://{S3_BUCKET}/{S3_KEY}...")
    obj = s3.get_object(Bucket=S3_BUCKET, Key=S3_KEY)
    pdf_bytes = obj['Body'].read()
    print(f"   Size: {len(pdf_bytes) / 1024 / 1024:.2f} MB")
    return pdf_bytes


def split_pdf_into_chunks(pdf_bytes):
    """Split PDF into chunks of PAGES_PER_CHUNK pages."""
    doc = fitz.open(stream=pdf_bytes, filetype='pdf')
    total_pages = doc.page_count
    print(f"📄 Total pages: {total_pages}")

    chunks = []
    for start in range(0, total_pages, PAGES_PER_CHUNK):
        end = min(start + PAGES_PER_CHUNK - 1, total_pages - 1)
        chunk = fitz.open()
        chunk.insert_pdf(doc, from_page=start, to_page=end)
        chunk_bytes = chunk.tobytes()
        chunk.close()
        chunks.append({
            'bytes': chunk_bytes,
            'start_page': start + 1,
            'end_page': end + 1,
            'size_kb': len(chunk_bytes) / 1024,
        })

    doc.close()
    print(f"📦 Split into {len(chunks)} chunks of ~{PAGES_PER_CHUNK} pages each")
    return chunks


def generate_questions_from_chunk(chunk_bytes, chunk_info):
    """Call Bedrock Nova 2 Lite to generate questions from a PDF chunk."""
    pdf_base64 = base64.b64encode(chunk_bytes).decode('utf-8')

    prompt_text = PROMPT.format(
        paper_name=PAPER_NAME,
        num_questions=QUESTIONS_PER_CHUNK,
    )

    body = {
        'messages': [
            {
                'role': 'user',
                'content': [
                    {
                        'document': {
                            'format': 'pdf',
                            'name': f'chunk-p{chunk_info["start_page"]}-{chunk_info["end_page"]}',
                            'source': {
                                'bytes': pdf_base64
                            }
                        }
                    },
                    {
                        'text': prompt_text
                    }
                ]
            }
        ],
        'inferenceConfig': {
            'maxTokens': 8000,
            'temperature': 0.7
        }
    }

    for attempt in range(MAX_RETRIES + 1):
        try:
            response = bedrock.invoke_model(
                modelId=MODEL_ID,
                body=json.dumps(body),
                contentType='application/json'
            )
            result = json.loads(response['body'].read())
            text = result['output']['message']['content'][0]['text']

            # Clean up response — remove markdown wrappers if present
            text = text.strip()
            text = re.sub(r'^```(?:json)?\s*', '', text)
            text = re.sub(r'\s*```$', '', text)

            questions = json.loads(text)

            if not isinstance(questions, list):
                raise ValueError("Response is not a JSON array")

            return questions

        except (json.JSONDecodeError, ValueError, KeyError) as e:
            print(f"   ⚠️  Parse error (attempt {attempt+1}): {e}")
            if attempt < MAX_RETRIES:
                time.sleep(2)
            else:
                print(f"   ❌ Failed to parse after {MAX_RETRIES+1} attempts")
                return []

        except Exception as e:
            error_msg = str(e)
            if 'ThrottlingException' in error_msg:
                wait = (attempt + 1) * 10
                print(f"   ⏳ Throttled, waiting {wait}s...")
                time.sleep(wait)
            else:
                print(f"   ❌ API error: {e}")
                if attempt < MAX_RETRIES:
                    time.sleep(5)
                else:
                    return []

    return []


def validate_question(q):
    """Validate a generated question has required fields."""
    required = ['question_text', 'options', 'correct_answer', 'topic', 'difficulty']
    for field in required:
        if field not in q:
            return False
    if not isinstance(q['options'], dict) or len(q['options']) != 4:
        return False
    if q['correct_answer'] not in ('A', 'B', 'C', 'D'):
        return False
    if q['topic'] == PAPER_NAME or not q['topic']:
        return False
    return True


def store_questions(questions):
    """Store validated questions in DynamoDB."""
    stored = 0
    with table.batch_writer() as batch:
        for q in questions:
            if not validate_question(q):
                continue
            batch.put_item(Item={
                'question_id': str(uuid.uuid4()),
                'version': 'v1.0',
                'paper_name': PAPER_NAME,
                'question_text': q['question_text'],
                'options': q['options'],
                'correct_answer': q['correct_answer'],
                'topic': q['topic'],
                'difficulty': q.get('difficulty', 'medium'),
                'source': 'pdf_textbook',
                'reference': q.get('reference', ''),
            })
            stored += 1
    return stored


def main():
    print("=" * 60)
    print(f"🎓 JAIIB Question Generator — {PAPER_NAME}")
    print(f"   Model: {MODEL_ID}")
    print(f"   Source: s3://{S3_BUCKET}/{S3_KEY}")
    print(f"   Target: DynamoDB table '{DYNAMODB_TABLE}'")
    print("=" * 60)
    print()

    # Step 1: Download PDF
    pdf_bytes = download_pdf()

    # Step 2: Split into chunks
    chunks = split_pdf_into_chunks(pdf_bytes)

    # Step 3: Process each chunk
    total_generated = 0
    total_stored = 0
    all_questions = []

    for i, chunk in enumerate(chunks):
        print(f"\n🔄 Processing chunk {i+1}/{len(chunks)} "
              f"(pages {chunk['start_page']}-{chunk['end_page']}, "
              f"{chunk['size_kb']:.0f} KB)...")

        questions = generate_questions_from_chunk(chunk['bytes'], chunk)

        if questions:
            valid = [q for q in questions if validate_question(q)]
            print(f"   ✅ Generated {len(questions)} questions, {len(valid)} valid")

            # Store in DynamoDB
            stored = store_questions(valid)
            total_stored += stored
            total_generated += len(valid)
            all_questions.extend(valid)

            print(f"   💾 Stored {stored} questions in DynamoDB")
        else:
            print(f"   ❌ No questions generated for this chunk")

        # Rate limiting — wait between chunks
        if i < len(chunks) - 1:
            print("   ⏳ Waiting 3s before next chunk...")
            time.sleep(3)

    # Summary
    print("\n" + "=" * 60)
    print(f"✅ COMPLETE!")
    print(f"   Total chunks processed: {len(chunks)}")
    print(f"   Total questions generated: {total_generated}")
    print(f"   Total questions stored: {total_stored}")
    print(f"   Paper: {PAPER_NAME}")
    print(f"   DynamoDB table: {DYNAMODB_TABLE}")
    print("=" * 60)

    # Show sample questions
    if all_questions:
        print("\n📝 Sample questions generated:")
        for i, q in enumerate(all_questions[:3]):
            print(f"\n--- Q{i+1} ({q['difficulty']}) ---")
            print(f"Topic: {q['topic']}")
            print(f"{q['question_text']}")
            for key, val in q['options'].items():
                marker = " ✅" if key == q['correct_answer'] else ""
                print(f"  {key}. {val}{marker}")
            print(f"Reference: {q.get('reference', 'N/A')}")


if __name__ == '__main__':
    main()
