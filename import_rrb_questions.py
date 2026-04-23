"""
Import RRB Group D questions into jaiib-question-bank DynamoDB table.

Usage:
    python import_rrb_questions.py

    # Dry run (print without uploading):
    python import_rrb_questions.py --dry-run

    # Upload only a specific subject:
    python import_rrb_questions.py --subject RRB-Mathematics

Subjects / paper_name values:
    RRB-Mathematics
    RRB-Reasoning
    RRB-Science
    RRB-GK

Add your own questions to the QUESTIONS dict below following the same format.
Each question needs: question_text, options (A/B/C/D), correct_answer, topic, difficulty.
"""

import uuid
import sys
import argparse
from datetime import datetime

try:
    import boto3
except ImportError:
    print("Run: pip install boto3")
    sys.exit(1)

TABLE  = "jaiib-question-bank"
REGION = "ap-south-1"

# ---------------------------------------------------------------------------
# Question bank — add more questions here following the same structure
# ---------------------------------------------------------------------------

QUESTIONS = {  # type: dict

    "RRB-Mathematics": [
        {
            "question_text": "The LCM of 12, 18 and 24 is:",
            "options": {"A": "36", "B": "48", "C": "72", "D": "96"},
            "correct_answer": "C",
            "topic": "LCM & HCF",
            "difficulty": "easy",
        },
        {
            "question_text": "A train 150 m long passes a pole in 15 seconds. What is the speed of the train in km/h?",
            "options": {"A": "36", "B": "54", "C": "72", "D": "90"},
            "correct_answer": "A",
            "topic": "Time, Speed & Distance",
            "difficulty": "medium",
        },
        {
            "question_text": "If 20% of a number is 80, what is 35% of that number?",
            "options": {"A": "120", "B": "140", "C": "160", "D": "180"},
            "correct_answer": "B",
            "topic": "Percentage",
            "difficulty": "easy",
        },
        {
            "question_text": "The simple interest on Rs 5000 at 8% per annum for 3 years is:",
            "options": {"A": "Rs 1000", "B": "Rs 1200", "C": "Rs 1500", "D": "Rs 1800"},
            "correct_answer": "B",
            "topic": "Simple Interest",
            "difficulty": "easy",
        },
    ],

    "RRB-Reasoning": [
        {
            "question_text": "If MANGO is coded as OCPIQ, how is APPLE coded?",
            "options": {"A": "CRRNG", "B": "CRRNH", "C": "BQQMF", "D": "CRRMG"},
            "correct_answer": "A",
            "topic": "Coding-Decoding",
            "difficulty": "medium",
        },
        {
            "question_text": "Find the odd one out: 2, 5, 10, 17, 26, 37, 50, 64",
            "options": {"A": "37", "B": "50", "C": "64", "D": "26"},
            "correct_answer": "C",
            "topic": "Number Series",
            "difficulty": "medium",
        },
        {
            "question_text": "All cats are animals. Some animals are dogs. Which conclusion follows?\n1. Some cats are dogs.\n2. Some dogs are animals.",
            "options": {"A": "Only 1", "B": "Only 2", "C": "Both 1 and 2", "D": "Neither 1 nor 2"},
            "correct_answer": "B",
            "topic": "Syllogism",
            "difficulty": "medium",
        },
        {
            "question_text": "A is the father of B. B is the sister of C. C is the son of D. How is A related to D?",
            "options": {"A": "Son-in-law", "B": "Father-in-law", "C": "Brother-in-law", "D": "Cannot be determined"},
            "correct_answer": "D",
            "topic": "Blood Relations",
            "difficulty": "hard",
        },
    ],

    "RRB-Science": [
        {
            "question_text": "Which of the following is NOT a conductor of electricity?",
            "options": {"A": "Copper", "B": "Aluminium", "C": "Rubber", "D": "Silver"},
            "correct_answer": "C",
            "topic": "Physics - Electricity",
            "difficulty": "easy",
        },
        {
            "question_text": "The chemical formula of common salt is:",
            "options": {"A": "NaOH", "B": "NaCl", "C": "Na2CO3", "D": "NaHCO3"},
            "correct_answer": "B",
            "topic": "Chemistry - Compounds",
            "difficulty": "easy",
        },
        {
            "question_text": "Which organelle is known as the powerhouse of the cell?",
            "options": {"A": "Nucleus", "B": "Ribosome", "C": "Mitochondria", "D": "Golgi apparatus"},
            "correct_answer": "C",
            "topic": "Biology - Cell",
            "difficulty": "easy",
        },
        {
            "question_text": "Newton's second law of motion states that force equals:",
            "options": {"A": "mass × velocity", "B": "mass × acceleration", "C": "mass / acceleration", "D": "velocity / time"},
            "correct_answer": "B",
            "topic": "Physics - Laws of Motion",
            "difficulty": "easy",
        },
    ],

    "RRB-GK": [
        {
            "question_text": "Which is the longest railway platform in India?",
            "options": {"A": "Gorakhpur", "B": "Kharagpur", "C": "Kollam", "D": "Sonepur"},
            "correct_answer": "A",
            "topic": "Indian Railways",
            "difficulty": "medium",
        },
        {
            "question_text": "The headquarters of Indian Railways is located in:",
            "options": {"A": "Mumbai", "B": "Kolkata", "C": "New Delhi", "D": "Chennai"},
            "correct_answer": "C",
            "topic": "Indian Railways",
            "difficulty": "easy",
        },
        {
            "question_text": "Who is known as the 'Father of the Indian Constitution'?",
            "options": {"A": "Jawaharlal Nehru", "B": "Mahatma Gandhi", "C": "B.R. Ambedkar", "D": "Sardar Patel"},
            "correct_answer": "C",
            "topic": "Indian Polity",
            "difficulty": "easy",
        },
        {
            "question_text": "Which river is known as the 'Sorrow of Bihar'?",
            "options": {"A": "Ganga", "B": "Kosi", "C": "Son", "D": "Gandak"},
            "correct_answer": "B",
            "topic": "Indian Geography",
            "difficulty": "medium",
        },
    ],
}


# ---------------------------------------------------------------------------
# Upload helpers
# ---------------------------------------------------------------------------

def make_item(paper: str, q: dict) -> dict:
    now = datetime.utcnow().isoformat()
    return {
        "question_id":    str(uuid.uuid4()),
        "version":        "1",
        "paper_name":     paper,
        "topic":          q["topic"],
        "difficulty":     q["difficulty"],
        "question_text":  q["question_text"],
        "options":        q["options"],
        "correct_answer": q["correct_answer"],
        "status":         "active",
        "created_at":     now,
        "updated_at":     now,
        "created_by":     "import_rrb_questions.py",
    }


def upload(items: list, dry_run: bool) -> None:
    if dry_run:
        for item in items:
            print(f"  [DRY RUN] {item['paper_name']} | {item['topic']} | {item['question_text'][:60]}...")
        return

    dynamodb = boto3.resource("dynamodb", region_name=REGION)
    table = dynamodb.Table(TABLE)
    with table.batch_writer() as batch:
        for item in items:
            batch.put_item(Item=item)


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main() -> None:
    parser = argparse.ArgumentParser(description="Import RRB Group D questions into DynamoDB")
    parser.add_argument("--dry-run", action="store_true", help="Print questions without uploading")
    parser.add_argument("--subject", help="Upload only this subject (e.g. RRB-Mathematics)")
    args = parser.parse_args()

    subjects = [args.subject] if args.subject else list(QUESTIONS.keys())

    total = 0
    for subject in subjects:
        if subject not in QUESTIONS:
            print(f"Unknown subject: {subject}. Valid: {list(QUESTIONS.keys())}")
            continue

        items = [make_item(subject, q) for q in QUESTIONS[subject]]
        label = "DRY RUN" if args.dry_run else "uploading"
        print(f"\n{subject} — {len(items)} questions ({label})")
        upload(items, args.dry_run)
        if not args.dry_run:
            print(f"  ✓ {len(items)} uploaded")
        total += len(items)

    print(f"\nDone. Total: {total} questions.")


if __name__ == "__main__":
    main()
