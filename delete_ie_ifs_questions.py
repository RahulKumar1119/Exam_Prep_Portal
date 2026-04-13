#!/usr/bin/env python3
"""
Delete all questions from:
  - 'Indian Economy & Indian Financial System.docx'  → paper_name = 'IE & IFS'
  - 'Principles & Practices of Banking.docx'         → paper_name = 'PPB'
  - 'AFM.docx'                                       → paper_name = 'AFB'
"""

import boto3
from boto3.dynamodb.conditions import Attr

TABLE  = 'jaiib-question-bank'
REGION = 'ap-south-1'

PAPERS_TO_DELETE = ['IE & IFS', 'PPB', 'AFB']

dynamodb = boto3.resource('dynamodb', region_name=REGION)
table    = dynamodb.Table(TABLE)


def scan_by_paper(paper_name):
    """Scan all items for a given paper_name, handling pagination."""
    items = []
    kwargs = {'FilterExpression': Attr('paper_name').eq(paper_name)}

    while True:
        resp = table.scan(**kwargs)
        items.extend(resp.get('Items', []))
        last = resp.get('LastEvaluatedKey')
        if not last:
            break
        kwargs['ExclusiveStartKey'] = last

    return items


def delete_items(items, paper_name):
    """Batch-delete items using their PK (question_id) + SK (version)."""
    if not items:
        print(f"  No '{paper_name}' questions found — nothing to delete.")
        return

    print(f"  Found {len(items)} question(s). Deleting...")

    with table.batch_writer() as batch:
        for item in items:
            batch.delete_item(Key={
                'question_id': item['question_id'],
                'version':     item['version'],
            })

    print(f"  ✓ Deleted {len(items)} '{paper_name}' question(s).")


if __name__ == '__main__':
    for paper in PAPERS_TO_DELETE:
        print(f"\n[{paper}]")
        items = scan_by_paper(paper)
        delete_items(items, paper)

    # Verify
    print("\n--- Verification ---")
    for paper in PAPERS_TO_DELETE:
        resp = table.scan(FilterExpression=Attr('paper_name').eq(paper))
        print(f"  Remaining '{paper}' questions: {resp.get('Count', 0)}")
