"""
CAIIB Question Generator from PDF Textbooks
Uses Amazon Nova 2 Lite on Bedrock to generate statement-based MCQs
and stores them in DynamoDB question bank.

Supports all CAIIB papers:
    - ABM (Advanced Bank Management)
    - BFM (Bank Financial Management)
    - ABF (Advanced Business & Financial Management)
    - BRBL (Banking Regulations & Business Laws)

Usage:
    # Edit S3_KEY and PAPER_NAME below, then run:
    python3 scripts/generate_caiib_questions_from_pdf.py

    # Or override via environment variables:
    S3_KEY=caiib/ABM-Module-A.pdf PAPER_NAME=ABM python3 scripts/generate_caiib_questions_from_pdf.py

Configuration:
    - S3_BUCKET: S3 bucket containing PDF files
    - S3_KEY: Path to the PDF file in S3
    - PAPER_NAME: Paper name (ABM, BFM, ABF, BRBL)
    - PAGES_PER_CHUNK: Number of pages to process per API call
    - QUESTIONS_PER_CHUNK: Number of questions to generate per chunk
"""

import os
import boto3
import json
import uuid
import re
import time
import fitz  # PyMuPDF

# ── Configuration ─────────────────────────────────────────────────────────────
S3_BUCKET = os.environ.get('S3_BUCKET', 'courses007')
S3_KEY = os.environ.get('S3_KEY', 'CAIIB-Paper-1-Capsule-PDF-Advance-Bank-Management-New-Syllabus-by-Ambitious-Baba.pdf')
PAPER_NAME = os.environ.get('PAPER_NAME', 'ABM')
REGION = 'ap-south-1'
MODEL_ID = 'zai.glm-5'
DYNAMODB_TABLE = 'jaiib-question-bank'
PAGES_PER_CHUNK = 25
QUESTIONS_PER_CHUNK = 35
MAX_RETRIES = 2

# ── CAIIB Syllabus Topics (Official IIBF 2026) ───────────────────────────────
CAIIB_TOPICS = {
    'ABM': {
        'Module A - Statistics': [
            'Sampling techniques', 'Measures of central tendency and dispersion',
            'Correlation and regression', 'Time series analysis',
            'Theory of probability', 'Binomial and Poisson distribution',
            'Normal distribution', 'Estimation and confidence intervals',
            'Linear programming', 'Simulation', 'Value at Risk',
        ],
        'Module B - Human Resource Management': [
            'Strategic HRM', 'Talent management and succession planning',
            'Motivation theories', 'Performance management and appraisal',
            'Competency mapping', 'Conflict management and negotiation',
            'HR analytics', 'Knowledge management', 'e-HRM',
        ],
        'Module C - Credit Management': [
            'Analysis of financial statements', 'Working capital finance',
            'Term loans and project appraisal', 'Credit delivery and documentation',
            'Credit control and monitoring', 'Credit risk and credit rating',
            'Restructuring and rehabilitation', 'IBC 2016 resolution process',
            'NPA management', 'Consortium and syndication lending',
        ],
        'Module D - Compliance and Corporate Governance': [
            'Compliance function in banks', 'Compliance audit',
            'Compliance governance structure', 'Compliance risk identification',
            'GRC framework', 'Whistle-blower policy',
            'Fraud and vigilance in banks', 'NBFC compliance framework',
        ],
    },
    'BFM': {
        'Module A - International Banking': [
            'Foreign exchange markets', 'Exchange rate determination',
            'Forex risk management', 'Trade finance (LC, BG, DA, DP)',
            'Correspondent banking', 'FEMA regulations',
            'External commercial borrowings', 'NRI deposits and remittances',
        ],
        'Module B - Risk Management': [
            'Risk management framework', 'Credit risk measurement',
            'Market risk and VaR', 'Operational risk',
            'Basel III capital adequacy', 'ICAAP and stress testing',
            'Liquidity risk', 'Interest rate risk in banking book',
        ],
        'Module C - Treasury Management': [
            'Treasury organization and functions', 'Money market instruments',
            'Government securities market', 'Bond valuation and pricing',
            'Duration and convexity', 'Yield curve analysis',
            'Derivatives (futures, options, swaps)', 'ALM and transfer pricing',
        ],
        'Module D - Balance Sheet Management': [
            'Balance sheet structure of banks', 'Capital planning',
            'Profit planning', 'NPA provisioning',
            'Investment portfolio management', 'Fund transfer pricing',
            'RAROC and economic capital', 'Basel III leverage ratio',
        ],
    },
    'ABF': {
        'Module A - Management Process': [
            'Strategic management', 'Business environment analysis',
            'SWOT and PESTEL analysis', 'Corporate planning',
            'Balanced scorecard', 'Business process reengineering',
        ],
        'Module B - Advanced Financial Management': [
            'Capital structure theories', 'Dividend policy',
            'Working capital management advanced', 'Lease vs buy decisions',
            'Cost of capital (WACC)', 'Capital budgeting under risk',
            'Real options', 'Financial modeling',
        ],
        'Module C - Valuation Mergers and Acquisitions': [
            'Business valuation methods', 'DCF valuation',
            'Relative valuation (P/E, EV/EBITDA)', 'Mergers and acquisitions',
            'Takeover regulations (SEBI)', 'Corporate restructuring',
            'Demergers and spin-offs', 'Due diligence',
        ],
        'Module D - Emerging Business Solutions': [
            'Fintech and digital banking', 'Blockchain in banking',
            'AI and ML in financial services', 'Open banking and APIs',
            'RegTech and SupTech', 'Cloud computing for banks',
            'Cybersecurity framework', 'Digital lending',
        ],
    },
    'BRBL': {
        'Module A - Regulations and Compliance': [
            'Banking Regulation Act 1949 (key sections)',
            'RBI Act 1934', 'KYC and AML guidelines',
            'PMLA 2002', 'Deposit insurance (DICGC)',
            'Banking ombudsman scheme', 'Customer protection framework',
        ],
        'Module B - Legal Aspects Part 1': [
            'Indian Contract Act 1872', 'Sale of Goods Act 1930',
            'Negotiable Instruments Act 1881 (sections 138-142)',
            'Transfer of Property Act 1882', 'SARFAESI Act 2002',
            'DRT Act 1993', 'Securitization law',
        ],
        'Module C - Legal Aspects Part 2': [
            'Companies Act 2013', 'Partnership Act 1932',
            'LLP Act 2008', 'Consumer Protection Act 2019',
            'Limitation Act 1963', 'Stamp Act', 'Registration Act',
        ],
        'Module D - Commercial Laws': [
            'FEMA 1999 and FDI regulations', 'Competition Act 2002',
            'Insolvency and Bankruptcy Code 2016', 'Arbitration Act 1996',
            'Information Technology Act 2000', 'Cyber laws',
            'Right to Information Act 2005', 'GST implications for banking',
        ],
    },
}

# ── AWS Clients ───────────────────────────────────────────────────────────────
s3 = boto3.client('s3', region_name=REGION)
bedrock = boto3.client('bedrock-runtime', region_name=REGION)
dynamodb = boto3.resource('dynamodb', region_name=REGION)
table = dynamodb.Table(DYNAMODB_TABLE)


# ── Prompt Template ───────────────────────────────────────────────────────────
PROMPT = """Based on this PDF textbook for CAIIB paper "{paper_name}", generate exactly {num_questions} HARD MCQ questions in the exact IIBF exam format.

This is CAIIB (Certified Associate of Indian Institute of Bankers) — an ADVANCED level exam. Questions must be significantly harder than JAIIB.

IIBF QUESTION TYPES (generate a MIX of all these):

TYPE 1 — Knowledge Testing (15%):
Specific facts, thresholds, section numbers, RBI circular references. NOT definitions.
Example: "Under Section 35A of BR Act 1949, RBI can issue directions to banks when..."

TYPE 2 — Conceptual Grasp (15%):
Test deep understanding of concepts — WHY something works, not just WHAT it is.
Example: "If CRR is increased by 50 bps, which of the following effects on money supply is most accurate?"

TYPE 3 — Analytical/Logical Exposition (15%):
Present data/scenario and ask candidate to analyze, interpret, or draw conclusions.
Example: "A bank's NPA ratio moved from 4.2% to 5.8% while gross advances grew 12%. Which interpretation is correct?"

TYPE 4 — Problem Solving / Numerical (20%):
Calculations: ratios, VaR, bond pricing, capital adequacy, probability, regression, BEP.
Example: "A bond with face value ₹1000, coupon 8%, maturity 5 years is trading at ₹950. Calculate YTM (approximate)."

TYPE 5 — Case Analysis (20%):
Present a 3-4 sentence case scenario about a bank/company, then ask what action/decision is correct.
Example: "XYZ Bank has Capital Adequacy Ratio of 9.5%, Tier-1 at 6.2%. As per Basel III norms for Indian banks..."

TYPE 6 — Statement-Based (15%):
Present 3-4 numbered statements, ask which are correct/incorrect. Include 1-2 tricky wrong statements.
Example: "Consider the following statements regarding ICAAP: 1. ... 2. ... 3. ... 4. ... Which are correct?"

STRICT RULES:
- Each question MUST have exactly 4 options (A, B, C, D) with ONE correct answer
- NO basic definitions — assume candidate has passed JAIIB
- Include specific numbers: percentages, ₹ amounts, time limits, section numbers
- For numerical questions, show the calculation setup in the question
- All 4 options must be plausible — real values that could result from different calculation approaches
- Difficulty: 20% medium, 80% hard

TOPIC RULES:
- "topic" must be a specific syllabus topic from: {topics}
- Do NOT use the paper name as topic

Return ONLY a valid JSON array. No markdown, no explanation, no ```json wrapper.
[
  {{
    "question_text": "question here",
    "options": {{"A": "option A", "B": "option B", "C": "option C", "D": "option D"}},
    "correct_answer": "B",
    "topic": "specific topic name",
    "difficulty": "medium|hard",
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
    """Call Bedrock to generate questions from a PDF chunk (text extraction approach)."""
    # Extract text from PDF chunk since model doesn't support document format
    doc = fitz.open(stream=chunk_bytes, filetype='pdf')
    chunk_text = ''
    for page in doc:
        chunk_text += page.get_text() + '\n'
    doc.close()

    # Limit text to avoid token overflow
    chunk_text = chunk_text[:30000]

    topics_data = CAIIB_TOPICS.get(PAPER_NAME, {})
    all_topics = []
    for module, topic_list in topics_data.items():
        all_topics.extend(topic_list)
    topics = ', '.join(all_topics[:15])
    prompt_text = PROMPT.format(
        paper_name=PAPER_NAME,
        num_questions=QUESTIONS_PER_CHUNK,
        topics=topics,
    )

    body = {
        'messages': [
            {
                'role': 'user',
                'content': f"TEXTBOOK CONTENT:\n---\n{chunk_text}\n---\n\n{prompt_text}"
            }
        ],
        'max_tokens': 8000,
        'temperature': 0.7
    }

    for attempt in range(MAX_RETRIES + 1):
        try:
            response = bedrock.invoke_model(
                modelId=MODEL_ID,
                body=json.dumps(body),
                contentType='application/json'
            )
            result = json.loads(response['body'].read())
            
            # Handle different model response formats
            if 'output' in result:
                text = result['output']['message']['content'][0]['text']
            elif 'choices' in result:
                text = result['choices'][0]['message']['content']
            elif 'content' in result and isinstance(result['content'], list):
                text = result['content'][0]['text']
            elif 'content' in result and isinstance(result['content'], str):
                text = result['content']
            else:
                text = json.dumps(result)

            # Clean up response
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
    print(f"🎓 CAIIB Question Generator — {PAPER_NAME}")
    print(f"   Model: {MODEL_ID}")
    print(f"   Source: s3://{S3_BUCKET}/{S3_KEY}")
    print(f"   Target: DynamoDB table '{DYNAMODB_TABLE}'")
    topics_preview = list(CAIIB_TOPICS.get(PAPER_NAME, {}).keys())[:4]
    print(f"   Topics: {', '.join(topics_preview)}...")
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

            stored = store_questions(valid)
            total_stored += stored
            total_generated += len(valid)
            all_questions.extend(valid)

            print(f"   💾 Stored {stored} questions in DynamoDB")
        else:
            print(f"   ❌ No questions generated for this chunk")

        # Rate limiting
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

    # Sample
    if all_questions:
        print("\n📝 Sample questions:")
        for i, q in enumerate(all_questions[:3]):
            print(f"\n--- Q{i+1} ({q['difficulty']}) ---")
            print(f"Topic: {q['topic']}")
            print(f"{q['question_text'][:150]}...")
            for key, val in q['options'].items():
                marker = " ✅" if key == q['correct_answer'] else ""
                print(f"  {key}. {val}{marker}")


if __name__ == '__main__':
    main()
