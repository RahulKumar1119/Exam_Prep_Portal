"""
Delete Reported Questions from Database

Scans jaiib-question-reports for pending reports, shows the reported questions,
and lets you delete them from jaiib-question-bank + mark reports as resolved.

Usage:
  python delete_reported_questions.py          # interactive — review each before deleting
  python delete_reported_questions.py --auto   # auto-delete all pending reported questions
"""

import sys
import boto3

REGION = 'ap-south-1'
REPORTS_TABLE = 'jaiib-question-reports'
QUESTION_BANK_TABLE = 'jaiib-question-bank'

dynamodb = boto3.resource('dynamodb', region_name=REGION)
reports_table = dynamodb.Table(REPORTS_TABLE)
questions_table = dynamodb.Table(QUESTION_BANK_TABLE)


def get_pending_reports():
    """Fetch all pending reports."""
    response = reports_table.scan(
        FilterExpression='#s = :pending',
        ExpressionAttributeNames={'#s': 'status'},
        ExpressionAttributeValues={':pending': 'pending'}
    )
    return response.get('Items', [])


def get_question(question_id):
    """Fetch all versions of a question from the question bank."""
    response = questions_table.query(
        KeyConditionExpression='question_id = :qid',
        ExpressionAttributeValues={':qid': question_id}
    )
    return response.get('Items', [])


def delete_question(question_id, version):
    """Delete a question from the question bank."""
    questions_table.delete_item(
        Key={'question_id': question_id, 'version': version}
    )


def resolve_report(report_id):
    """Mark a report as resolved."""
    reports_table.update_item(
        Key={'report_id': report_id},
        UpdateExpression='SET #s = :resolved',
        ExpressionAttributeNames={'#s': 'status'},
        ExpressionAttributeValues={':resolved': 'resolved'}
    )


def main():
    auto_mode = '--auto' in sys.argv

    reports = get_pending_reports()
    if not reports:
        print('No pending reports found.')
        return

    print(f'\nFound {len(reports)} pending report(s):\n')

    deleted = 0
    skipped = 0

    for i, report in enumerate(reports, 1):
        report_id = report['report_id']
        question_id = report['question_id']
        reason = report.get('reason', 'N/A')
        comment = report.get('comment', '')
        user_id = report.get('user_id', 'anonymous')
        created_at = report.get('created_at', 'N/A')

        print(f'--- Report {i}/{len(reports)} ---')
        print(f'  Report ID:   {report_id}')
        print(f'  Question ID: {question_id}')
        print(f'  Reason:      {reason}')
        print(f'  Comment:     {comment or "(none)"}')
        print(f'  Reported by: {user_id}')
        print(f'  Reported at: {created_at}')

        # Fetch the question
        versions = get_question(question_id)
        if not versions:
            print(f'  Question not found in question bank (already deleted?).')
            print(f'  Marking report as resolved.\n')
            resolve_report(report_id)
            continue

        for v in versions:
            print(f'\n  Question text: {v.get("question_text", "N/A")[:200]}')
            print(f'  Paper: {v.get("paper_name", v.get("paper", "N/A"))}')
            print(f'  Topic: {v.get("topic", "N/A")}')
            print(f'  Difficulty: {v.get("difficulty", "N/A")}')
            print(f'  Version: {v.get("version", "N/A")}')

        if auto_mode:
            confirm = 'y'
        else:
            confirm = input('\n  Delete this question and resolve report? (y/n/q): ').strip().lower()

        if confirm == 'q':
            print('\nAborted.')
            return
        elif confirm == 'y':
            for v in versions:
                delete_question(question_id, v['version'])
                print(f'  Deleted version {v["version"]}')
            resolve_report(report_id)
            print(f'  Report marked as resolved.')
            deleted += 1
        else:
            print(f'  Skipped.')
            skipped += 1

        print()

    print(f'Done. Deleted: {deleted}, Skipped: {skipped}')


if __name__ == '__main__':
    main()
