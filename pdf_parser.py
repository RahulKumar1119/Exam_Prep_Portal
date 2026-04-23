#!/usr/bin/env python3
"""
Universal MCQ PDF parser for JAIIB question bank.

Handles all known formats:
  - Q1. / Q2. question numbering
  - 1. / 2. plain number questions (with lookahead to avoid sub-items)
  - A. / B. / C. / D. options
  - (a) / (b) / (c) / (d) options
  - a) / b) / c) / d) options
  - A:- / B:- / C:- / D:- options
  - Answer: X / Correct Answer: X / Ans - X / Ans: (a)
  - Zero-width spaces, bullet ● separators, inline options
  - Roman numeral sub-items (i), (ii), etc.
"""

import re
import uuid
from datetime import datetime

try:
    import fitz
except ImportError:
    import sys
    print("Run: pip3 install pymupdf"); sys.exit(1)

# ── Patterns ──────────────────────────────────────────────────────────────────

# Question start: "Q1." or "Q1)" or "Q1 " prefix
Q_PREFIX = re.compile(r'^Q(\d+)[.\)\s]\s*(.*)', re.I)
# Question start: plain "1. text" (used with lookahead validation)
Q_PLAIN  = re.compile(r'^(\d+)\.\s+(.+)')

# Options: A. / (a) / a) / A:-
OPT_PAT = re.compile(
    r'^(?:([A-D])\.\s*(.+)'        # A. text
    r'|([A-D]):-\s*(.+)'           # A:- text
    r'|\(([a-d])\)\s+(.+)'         # (a) text
    r'|([a-d])\)\s+(.+))'          # a) text
)

# Answer line
ANS_PAT = re.compile(
    r'^(?:Correct\s+)?(?:Answer|Ans)\s*[-–:.]?\s*\(?([A-Da-d])\)?', re.I
)

# Roman numeral sub-items — NOT options
ROMAN_PAT = re.compile(r'^\((i{1,3}|iv|vi{0,3}|ix|xi{0,3})\)\s+')

# Common header/footer noise
DEFAULT_HEADER = re.compile(
    r'www\.|teachersadda|sscadda|bankersadda|adda247'
    r'|edutap|hello@edutap|81462'
    r'|facebook|murugan|admin@|09994|jaiibcaiib|bankpromotion|onlyforbankers'
    r'|JAIIB CAIIB STUDY|BANK PROMOTION|ONLY FOR BANKERS'
    r'|P\s*a\s*g\s*e|^\d{1,3}\s*\|\s*P'
    r'|^\d{1,3}$'
    r'|^[…\.]{10,}$',
    re.I
)


# ── Helpers ───────────────────────────────────────────────────────────────────

def opt_match(line):
    """Match an option line. Returns (key, value) or None.
    Skips roman numeral sub-items like (i), (ii)."""
    if ROMAN_PAT.match(line):
        return None
    om = OPT_PAT.match(line)
    if not om:
        return None
    for g in range(1, 9, 2):
        if om.group(g):
            return om.group(g).upper(), om.group(g + 1).strip()
    return None


def has_options_ahead(lines, start, limit=25):
    """Check if at least 2 option lines appear within the next `limit` lines."""
    found = set()
    for j in range(start, min(start + limit, len(lines))):
        m = opt_match(lines[j])
        if m:
            found.add(m[0])
            if len(found) >= 2:
                return True
    return False


def is_question_start(line, idx, lines, mode='auto'):
    """Detect a question start line.
    mode='q_prefix' — only match Q1. Q2. etc.
    mode='plain'    — only match 1. 2. etc. (with lookahead)
    mode='auto'     — try Q-prefix first, then plain with lookahead
    """
    if mode in ('q_prefix', 'auto'):
        m = Q_PREFIX.match(line)
        if m:
            return m
    if mode in ('plain', 'auto'):
        m = Q_PLAIN.match(line)
        if m and has_options_ahead(lines, idx + 1):
            return m
    return None


# ── Extraction ────────────────────────────────────────────────────────────────

def extract_lines(path, header_pat=None, skip_pages=0):
    """Extract and clean lines from a PDF.
    - Strips zero-width spaces
    - Filters header/footer noise
    - Splits on ● bullets and A:- inline options
    - Normalizes '50.Text' -> '50. Text'
    """
    header = header_pat or DEFAULT_HEADER
    inline_split = re.compile(r'(?=\s[A-D]:-)')

    doc = fitz.open(path)
    lines = []
    for page in doc:
        if page.number < skip_pages:
            continue
        for line in page.get_text().splitlines():
            line = line.strip().replace('\u200b', '')
            # Normalize missing space: "50.Text" -> "50. Text"
            line = re.sub(r'^(\d+)\.([A-Z])', r'\1. \2', line)
            if not line:
                continue
            if header.search(line):
                continue
            # Split on ● bullets
            if '●' in line:
                parts = [p.strip() for p in line.split('●') if p.strip()]
            else:
                parts = [line]
            # Split on inline A:- B:- patterns
            expanded = []
            for part in parts:
                splits = inline_split.split(part)
                expanded.extend(s.strip() for s in splits if s.strip())
            lines.extend(expanded)
    return lines


# ── Parser ────────────────────────────────────────────────────────────────────

def parse(lines, mode='auto'):
    """Parse extracted lines into question dicts.
    mode: 'q_prefix' for Q1./Q2., 'plain' for 1./2., 'auto' for both.
    Returns list of dicts with keys: q_num, question_text, options, correct_answer.
    """
    questions = []
    i = 0
    n = len(lines)

    while i < n:
        qm = is_question_start(lines[i], i, lines, mode)
        if not qm:
            i += 1
            continue

        q_num = int(qm.group(1))
        q_text_start = qm.group(2).strip() if qm.group(2) else ''
        q_lines = [q_text_start] if q_text_start else []
        i += 1

        # Collect question continuation
        while i < n:
            if opt_match(lines[i]):
                break
            if is_question_start(lines[i], i, lines, mode):
                break
            if ANS_PAT.match(lines[i]):
                break
            q_lines.append(lines[i])
            i += 1

        q_text = ' '.join(q_lines).strip()

        # Collect options
        options = {}
        while i < n:
            om = opt_match(lines[i])
            if not om:
                break
            key, val = om
            i += 1
            while i < n and not opt_match(lines[i]) and not ANS_PAT.match(lines[i]) and not is_question_start(lines[i], i, lines, mode):
                val += ' ' + lines[i].strip()
                i += 1
            options[key] = val.strip()

        # Find answer
        correct = None
        if i < n:
            am = ANS_PAT.match(lines[i])
            if am:
                correct = am.group(1).upper()
                i += 1

        # If no answer found yet, scan forward (skip explanations)
        if not correct:
            scan = i
            while scan < n:
                if is_question_start(lines[scan], scan, lines, mode):
                    break
                am = ANS_PAT.match(lines[scan])
                if am:
                    correct = am.group(1).upper()
                    i = scan + 1
                    break
                scan += 1

        # Skip remaining lines until next question
        while i < n and not is_question_start(lines[i], i, lines, mode):
            i += 1

        if len(options) >= 2 and len(q_text) >= 10:
            questions.append({
                'q_num':          q_num,
                'question_text':  q_text,
                'options':        options,
                'correct_answer': correct or '',
            })

    return questions


# ── DynamoDB upload ───────────────────────────────────────────────────────────

def upload(questions, paper, topic, table_name='jaiib-question-bank', region='ap-south-1'):
    """Upload parsed questions to DynamoDB."""
    import boto3
    dynamodb = boto3.resource('dynamodb', region_name=region)
    table = dynamodb.Table(table_name)
    now = datetime.utcnow().isoformat()
    with table.batch_writer() as batch:
        for q in questions:
            batch.put_item(Item={
                'question_id':    str(uuid.uuid4()),
                'version':        '1',
                'paper_name':     paper,
                'topic':          topic,
                'difficulty':     'medium',
                'question_text':  q['question_text'],
                'options':        q['options'],
                'correct_answer': q['correct_answer'],
                'created_at':     now,
                'updated_at':     now,
            })
    print(f"  ✓ {len(questions)} questions uploaded")


# ── CLI helper ────────────────────────────────────────────────────────────────

def run(path, paper, topic, mode='auto'):
    """Full pipeline: extract → parse → preview → upload."""
    print(f"Extracting lines from {path}...")
    lines = extract_lines(path)
    print(f"  {len(lines)} lines extracted")

    print("Parsing questions...")
    qs = parse(lines, mode=mode)
    print(f"  {len(qs)} questions parsed")

    if not qs:
        print("No questions found — check PDF format")
        import sys; sys.exit(1)

    print(f"\nSample (first 3 questions):")
    for q in qs[:3]:
        print(f"  Q{q['q_num']}: {q['question_text'][:80]}")
        for k, v in q['options'].items():
            print(f"    {k}: {v[:60]}")
        print(f"  ANS: {q['correct_answer']}\n")

    print("Uploading to DynamoDB...")
    upload(qs, paper, topic)
    print("\nDone.")
