#!/usr/bin/env python3
"""
Deduplicate jaiib-question-bank DynamoDB table.
Keeps one copy per unique (paper_name, question_text) pair, deletes the rest.
"""

import boto3
from collections import defaultdict

TABLE  = 'jaiib-question-bank'
REGION = 'ap-south-1'

dynamodb = boto3.resource('dynamodb', region_name=REGION)
table = dynamodb.Table(TABLE)

# Step 1: Scan all items
print("Scanning table...")
items = []
params = {}
while True:
    resp = table.scan(**params)
    items.extend(resp['Items'])
    if 'LastEvaluatedKey' not in resp:
        break
    params['ExclusiveStartKey'] = resp['LastEvaluatedKey']

print(f"  {len(items)} total items found")

# Step 2: Group by (paper_name, question_text) — keep the newest one
groups = defaultdict(list)
for item in items:
    key = (item.get('paper_name', ''), item.get('question_text', ''))
    groups[key].append(item)

to_delete = []
for key, dupes in groups.items():
    if len(dupes) > 1:
        # Sort by updated_at descending, keep first (newest)
        dupes.sort(key=lambda x: x.get('updated_at', ''), reverse=True)
        to_delete.extend(dupes[1:])

print(f"  {len(groups)} unique questions")
print(f"  {len(to_delete)} duplicates to remove")

if not to_delete:
    print("No duplicates found.")
    exit(0)

# Step 3: Delete duplicates
print(f"\nDeleting {len(to_delete)} duplicates...")
with table.batch_writer() as batch:
    for item in to_delete:
        batch.delete_item(Key={
            'question_id': item['question_id'],
            'version': item['version'],
        })

print("Done. Verifying...")

# Step 4: Verify
from collections import Counter
counts = Counter()
params = {}
while True:
    resp = table.scan(**params, ProjectionExpression='paper_name')
    for item in resp['Items']:
        counts[item.get('paper_name', 'unknown')] += 1
    if 'LastEvaluatedKey' not in resp:
        break
    params['ExclusiveStartKey'] = resp['LastEvaluatedKey']

total = 0
for paper, count in sorted(counts.items()):
    print(f"  {paper}: {count}")
    total += count
print(f"  TOTAL: {total}")
