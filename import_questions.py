"""
Import questions from .docx files into jaiib-question-bank DynamoDB table.
Handles multiple formats found in the provided docx files.
"""

import re
import uuid
import sys
import json
from datetime import datetime

try:
    from docx import Document
except ImportError:
    print("Run: pip install python-docx"); sys.exit(1)

try:
    import boto3
except ImportError:
    print("Run: pip install boto3"); sys.exit(1)


# ── Format detectors ──────────────────────────────────────────────────────────

OPT_PAT  = re.compile(r'^\s*[\(\[]?([A-Da-d])[\)\]\.\s:]\s*(.+)')
ANS_PAT  = re.compile(r'^\s*(?:answer|ans|solution|correct answer)\s*[:\-]?\s*[\(\[]?([A-Da-d])[\)\]]?', re.I)
Q_NUM    = re.compile(r'^\s*(?:Q\.?\s*)?(\d+)[\.:\)]\s*(.+)', re.I)


def extract_lines(path: str) -> list:
    doc = Document(path)
    return [p.text.strip() for p in doc.paragraphs if p.text.strip()]


def parse_afm_format(lines: list) -> list:
    """
    AFM format - handles multiple sub-formats found in AFM.docx:

    Format A (multi-line options with *):
        Question N: text *
        Options: *
        (a) opt *
        Solution: (c) explanation

    Format B (inline options on same line):
        Question N: text
        Options: (a) opt, (b) opt, (c) opt, (d) opt
        Answer: (c) explanation

    Format C (statements in question, no lettered options):
        Question N: Consider the following statements:
        I. statement one
        II. statement two
        Answer: text explanation

    Format D (no options, plain Answer):
        Question N: question text
        Answer: full answer text
    """
    questions = []
    i = 0
    q_pat      = re.compile(r'^Question\s+\d+\s*:\s*(.+?)[\s\*]*$', re.I)
    sol_pat    = re.compile(r'^(?:Solution|Answer)\s*:\s*[\(\[]?([A-Da-d])[\)\]]?', re.I)
    plain_ans  = re.compile(r'^(?:Solution|Answer)\s*:\s*(.+)', re.I)
    inline_opt = re.compile(r'[\(\[]([A-Da-d])[\)\]]\s*([^,\(\[]+)', re.I)
    opts_line_pat = re.compile(r'^options\s*[:\*]', re.I)
    roman_stmt = re.compile(r'^(?:[IVXivx]+\.|[IVXivx]+\)|\d+\.)\s+.+')  # I. II. III. or 1. 2.

    while i < len(lines):
        qm = q_pat.match(lines[i])
        if not qm:
            i += 1
            continue

        q_text = qm.group(1).strip().rstrip('* ').strip()
        i += 1

        # Collect continuation lines that are part of the question
        # (roman numeral statements like "I. ...", "II. ...", plain text before Options/Answer)
        while i < len(lines):
            line = lines[i]
            if opts_line_pat.match(line):
                break
            if sol_pat.match(line) or plain_ans.match(line):
                break
            if q_pat.match(line):
                break
            if OPT_PAT.match(line.rstrip('* ').strip()):
                break
            # Append statement lines and other continuation text to question
            q_text += '\n' + line.rstrip('* ').strip()
            i += 1

        options = {}

        # check for Options: line
        if i < len(lines) and opts_line_pat.match(lines[i]):
            opts_line = lines[i]
            i += 1
            # try inline parse: Options: (a) x, (b) y ...
            inline_matches = inline_opt.findall(opts_line)
            if inline_matches:
                for key, val in inline_matches:
                    options[key.upper()] = val.strip().rstrip(',').strip()

        # if no inline options found, try multi-line lettered options
        if not options:
            while i < len(lines):
                clean = lines[i].rstrip('* ').strip()
                om = OPT_PAT.match(clean)
                if om:
                    options[om.group(1).upper()] = om.group(2).strip()
                    i += 1
                else:
                    break

        # Remove placeholder options like '[Combinations]', '[...]', empty strings
        options = {k: v for k, v in options.items()
                   if v and not re.match(r'^\[.*\]$', v.strip())}

        # Pad to 4 options if some are missing (synthesise plausible distractors)
        DISTRACTOR_POOL = [
            'i only', 'ii only', 'iii only', 'iv only',
            'i and ii only', 'i and iii only', 'i and iv only',
            'ii and iv only', 'iii and iv only',
            'i, ii and iii only', 'i, ii and iv only',
            'All of the above', 'None of the above'
        ]
        existing_vals = {v.lower().strip() for v in options.values()}
        pool = [d for d in DISTRACTOR_POOL if d.lower() not in existing_vals]
        for letter in ['A', 'B', 'C', 'D']:
            if letter not in options and pool:
                options[letter] = pool.pop(0)

        # find solution/answer
        correct = None
        answer_text = None
        while i < len(lines):
            # Answer with a letter: Answer: (b) ...
            sm = sol_pat.match(lines[i])
            if sm:
                correct = sm.group(1).upper()
                i += 1
                break
            # Plain answer without a letter: Answer: full explanation
            pm = plain_ans.match(lines[i])
            if pm:
                answer_text = pm.group(1).strip()
                i += 1
                # grab multi-line answer continuation
                while i < len(lines) and not q_pat.match(lines[i]) and not sol_pat.match(lines[i]):
                    answer_text += ' ' + lines[i]
                    i += 1
                correct = 'A'
                break
            if q_pat.match(lines[i]):
                break
            i += 1

        if correct and len(options) >= 2 and correct in options:
            questions.append(make_q(q_text, options, correct))
        elif correct == 'A' and answer_text:
            # Build options from the answer text; embed full answer as option A
            options = {
                'A': answer_text[:300].strip(),
                'B': 'None of the above',
                'C': 'Cannot be determined',
                'D': 'All of the above',
            }
            questions.append(make_q(q_text, options, 'A'))
        elif correct and options and correct not in options:
            # correct letter exists but not in parsed options — use first available
            first_key = sorted(options.keys())[0]
            questions.append(make_q(q_text, options, first_key))
        else:
            print(f"  ⚠ Skipped (no valid answer): {q_text[:60]}")

    return questions


def parse_ppb_format(lines: list) -> list:
    """
    PPB format:
        1. Question text
        Answer: X.
        Explanation: ...

    Also handles Q1: format with Answer: line.
    """
    questions = []
    i = 0

    while i < len(lines):
        qm = Q_NUM.match(lines[i])
        if not qm:
            i += 1
            continue

        q_text = qm.group(2).strip()
        i += 1

        # multi-line question
        while i < len(lines) and not ANS_PAT.match(lines[i]) and not Q_NUM.match(lines[i]) and not OPT_PAT.match(lines[i]):
            q_text += ' ' + lines[i]
            i += 1

        # collect options if present
        options = {}
        while i < len(lines):
            om = OPT_PAT.match(lines[i])
            if om:
                options[om.group(1).upper()] = om.group(2).strip()
                i += 1
            else:
                break

        # find answer
        correct = None
        answer_text = None
        while i < len(lines):
            am = ANS_PAT.match(lines[i])
            if am:
                correct = am.group(1).upper()
                rest = re.sub(r'^.*?[A-Da-d][\)\]]?\s*[:\-]?\s*', '', lines[i], flags=re.I).strip()
                answer_text = rest if rest else None
                i += 1
                break
            # Answer without a letter — grab full text
            plain_ans = re.match(r'^(?:Answer|Ans)\s*:\s*(.+)', lines[i], re.I)
            if plain_ans:
                answer_text = plain_ans.group(1).strip()
                correct = 'A'
                i += 1
                break
            if Q_NUM.match(lines[i]):
                break
            i += 1

        # If no options, build synthetic ones from answer text
        if not options and answer_text:
            options = {
                'A': answer_text[:200].strip(),
                'B': 'None of the above',
                'C': 'Cannot be determined',
                'D': 'All of the above',
            }
            correct = 'A'

        if correct and len(options) >= 2 and correct in options:
            questions.append(make_q(q_text.strip(), options, correct))
        else:
            print(f"  ⚠ Skipped: {q_text[:60]}")

    return questions


def parse_ie_format(lines: list) -> list:
    """
    IE & IFS format:
        Q1: question text
        Answer: full answer text (no options — we synthesise them)
        Added Detail: ...
    """
    questions = []
    i = 0
    q_pat = re.compile(r'^Q\d+\s*:\s*(.+)', re.I)
    ans_pat = re.compile(r'^Answer\s*:\s*(.+)', re.I)

    while i < len(lines):
        qm = q_pat.match(lines[i])
        if not qm:
            i += 1
            continue

        q_text = qm.group(1).strip()
        i += 1

        # multi-line question
        while i < len(lines) and not ans_pat.match(lines[i]) and not q_pat.match(lines[i]):
            q_text += ' ' + lines[i]
            i += 1

        # get answer
        answer_text = None
        if i < len(lines):
            am = ans_pat.match(lines[i])
            if am:
                answer_text = am.group(1).strip()
                i += 1
                # grab continuation lines
                while i < len(lines) and not q_pat.match(lines[i]) and not re.match(r'^Added Detail', lines[i], re.I):
                    answer_text += ' ' + lines[i]
                    i += 1

        # skip Added Detail lines
        while i < len(lines) and re.match(r'^Added Detail', lines[i], re.I):
            i += 1
            while i < len(lines) and not q_pat.match(lines[i]) and not re.match(r'^Part \d+', lines[i], re.I):
                i += 1

        if answer_text:
            # Synthesise 4 options: A = correct answer, B/C/D = distractors
            options = {
                'A': answer_text[:200].strip(),
                'B': 'None of the above',
                'C': 'Cannot be determined from the given information',
                'D': 'All of the above statements are correct',
            }
            questions.append(make_q(q_text.strip(), options, 'A'))
        else:
            print(f"  ⚠ Skipped (no answer): {q_text[:60]}")

    return questions


def make_q(q_text: str, options: dict, correct: str) -> dict:
    return {
        'question_id':    str(uuid.uuid4()),
        'question_text':  q_text,
        'options':        options,
        'correct_answer': correct,
        'version':        '1',
        'created_at':     datetime.utcnow().isoformat(),
        'updated_at':     datetime.utcnow().isoformat(),
    }


def upload(questions: list, table_name: str, region: str):
    dynamodb = boto3.resource('dynamodb', region_name=region)
    table = dynamodb.Table(table_name)
    with table.batch_writer() as batch:
        for q in questions:
            batch.put_item(Item=q)
    print(f"  ✓ {len(questions)} questions uploaded")


# ── Main ──────────────────────────────────────────────────────────────────────

FILES = [
    {
        'path':   'AFM.docx',
        'paper':  'AFB',
        'topic':  'Accounting & Finance for Bankers',
        'parser': 'afm',
    },
]

TABLE  = 'jaiib-question-bank'
REGION = 'ap-south-1'

for cfg in FILES:
    print(f"\n{'='*60}")
    print(f"Processing: {cfg['path'].split('/')[-1]}")
    lines = extract_lines(cfg['path'])
    print(f"  {len(lines)} lines extracted")

    if cfg['parser'] == 'ie':
        qs = parse_ie_format(lines)
    elif cfg['parser'] == 'ppb':
        qs = parse_ppb_format(lines)
    else:
        qs = parse_afm_format(lines)

    # Tag with paper/topic/difficulty
    for q in qs:
        q['paper_name'] = cfg['paper']
        q['topic']      = cfg['topic']
        q['difficulty'] = 'medium'

    print(f"  {len(qs)} questions parsed")

    if qs:
        upload(qs, TABLE, REGION)
    else:
        print("  ⚠ No questions found — check format")

print("\nDone.")
