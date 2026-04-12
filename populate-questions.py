#!/usr/bin/env python3
"""
Populate DynamoDB question bank with sample JAIIB-CAIIB questions
"""

import boto3
import uuid
from datetime import datetime

dynamodb = boto3.resource('dynamodb', region_name='ap-south-1')
table = dynamodb.Table('jaiib-question-bank')

# Sample questions for each paper
questions = [
    # IE & IFS Paper
    {
        'paper_name': 'IE & IFS',
        'question_text': 'What is the primary objective of the Reserve Bank of India?',
        'options': {
            'A': 'To maximize profits',
            'B': 'To regulate the monetary system and manage currency',
            'C': 'To provide retail banking services',
            'D': 'To collect taxes'
        },
        'correct_answer': 'B',
        'difficulty': 'easy',
        'topic': 'Central Banking'
    },
    {
        'paper_name': 'IE & IFS',
        'question_text': 'Which of the following is NOT a function of a commercial bank?',
        'options': {
            'A': 'Accepting deposits',
            'B': 'Granting loans',
            'C': 'Issuing currency notes',
            'D': 'Providing safe deposit lockers'
        },
        'correct_answer': 'C',
        'difficulty': 'medium',
        'topic': 'Commercial Banking'
    },
    {
        'paper_name': 'IE & IFS',
        'question_text': 'What is the current repo rate set by RBI?',
        'options': {
            'A': '4.0%',
            'B': '5.5%',
            'C': '6.5%',
            'D': '7.0%'
        },
        'correct_answer': 'B',
        'difficulty': 'hard',
        'topic': 'Monetary Policy'
    },
    {
        'paper_name': 'IE & IFS',
        'question_text': 'Which act governs banking regulation in India?',
        'options': {
            'A': 'Banking Regulation Act, 1949',
            'B': 'RBI Act, 1934',
            'C': 'Negotiable Instruments Act, 1881',
            'D': 'All of the above'
        },
        'correct_answer': 'D',
        'difficulty': 'medium',
        'topic': 'Banking Regulation'
    },
    {
        'paper_name': 'IE & IFS',
        'question_text': 'What is KYC in banking?',
        'options': {
            'A': 'Know Your Customer',
            'B': 'Keep Your Cash',
            'C': 'Key Yield Calculation',
            'D': 'Knowledge Year Cycle'
        },
        'correct_answer': 'A',
        'difficulty': 'easy',
        'topic': 'Compliance'
    },
    # PPB Paper
    {
        'paper_name': 'PPB',
        'question_text': 'What does PPB stand for?',
        'options': {
            'A': 'Principles of Personal Banking',
            'B': 'Principles of Payments and Banking',
            'C': 'Principles of Public Banking',
            'D': 'Principles of Private Banking'
        },
        'correct_answer': 'B',
        'difficulty': 'easy',
        'topic': 'Banking Basics'
    },
    {
        'paper_name': 'PPB',
        'question_text': 'Which of the following is a negotiable instrument?',
        'options': {
            'A': 'Cheque',
            'B': 'Promissory Note',
            'C': 'Bill of Exchange',
            'D': 'All of the above'
        },
        'correct_answer': 'D',
        'difficulty': 'medium',
        'topic': 'Negotiable Instruments'
    },
    {
        'paper_name': 'PPB',
        'question_text': 'What is the validity period of a cheque?',
        'options': {
            'A': '3 months',
            'B': '6 months',
            'C': '1 year',
            'D': '2 years'
        },
        'correct_answer': 'A',
        'difficulty': 'easy',
        'topic': 'Cheques'
    },
    {
        'paper_name': 'PPB',
        'question_text': 'What is NEFT?',
        'options': {
            'A': 'National Electronic Funds Transfer',
            'B': 'National Exchange Fund Transfer',
            'C': 'National Electronic Financial Transaction',
            'D': 'National Exchange Financial Transfer'
        },
        'correct_answer': 'A',
        'difficulty': 'medium',
        'topic': 'Payment Systems'
    },
    {
        'paper_name': 'PPB',
        'question_text': 'Which payment system is real-time?',
        'options': {
            'A': 'NEFT',
            'B': 'RTGS',
            'C': 'ECS',
            'D': 'ACH'
        },
        'correct_answer': 'B',
        'difficulty': 'medium',
        'topic': 'Payment Systems'
    },
    # AFB Paper
    {
        'paper_name': 'AFB',
        'question_text': 'What does AFB stand for?',
        'options': {
            'A': 'Advanced Financial Banking',
            'B': 'Advanced Funds and Banking',
            'C': 'Advanced Finance and Banking',
            'D': 'Advanced Financial Business'
        },
        'correct_answer': 'C',
        'difficulty': 'easy',
        'topic': 'Banking Basics'
    },
    {
        'paper_name': 'AFB',
        'question_text': 'What is the primary function of a credit rating agency?',
        'options': {
            'A': 'To lend money',
            'B': 'To assess creditworthiness',
            'C': 'To collect taxes',
            'D': 'To regulate banks'
        },
        'correct_answer': 'B',
        'difficulty': 'medium',
        'topic': 'Credit Analysis'
    },
    {
        'paper_name': 'AFB',
        'question_text': 'What is Basel III?',
        'options': {
            'A': 'A banking regulation framework',
            'B': 'A payment system',
            'C': 'A loan product',
            'D': 'A deposit scheme'
        },
        'correct_answer': 'A',
        'difficulty': 'hard',
        'topic': 'Banking Regulation'
    },
    {
        'paper_name': 'AFB',
        'question_text': 'What is the minimum capital adequacy ratio under Basel III?',
        'options': {
            'A': '8%',
            'B': '10.5%',
            'C': '12%',
            'D': '15%'
        },
        'correct_answer': 'B',
        'difficulty': 'hard',
        'topic': 'Capital Adequacy'
    },
    {
        'paper_name': 'AFB',
        'question_text': 'What is risk management in banking?',
        'options': {
            'A': 'Identifying and mitigating financial risks',
            'B': 'Maximizing profits',
            'C': 'Reducing customer base',
            'D': 'Increasing loan amounts'
        },
        'correct_answer': 'A',
        'difficulty': 'medium',
        'topic': 'Risk Management'
    },
    # RBWM Paper
    {
        'paper_name': 'RBWM',
        'question_text': 'What does RBWM stand for?',
        'options': {
            'A': 'Retail Banking and Wealth Management',
            'B': 'Regulatory Banking and Wealth Management',
            'C': 'Retail Business and Wealth Management',
            'D': 'Regulatory Business and Wealth Management'
        },
        'correct_answer': 'A',
        'difficulty': 'easy',
        'topic': 'Banking Basics'
    },
    {
        'paper_name': 'RBWM',
        'question_text': 'What is wealth management?',
        'options': {
            'A': 'Managing customer deposits',
            'B': 'Providing comprehensive financial services to high-net-worth individuals',
            'C': 'Collecting taxes',
            'D': 'Issuing loans'
        },
        'correct_answer': 'B',
        'difficulty': 'medium',
        'topic': 'Wealth Management'
    },
    {
        'paper_name': 'RBWM',
        'question_text': 'What is a mutual fund?',
        'options': {
            'A': 'A type of loan',
            'B': 'A pooled investment vehicle',
            'C': 'A savings account',
            'D': 'A credit card'
        },
        'correct_answer': 'B',
        'difficulty': 'easy',
        'topic': 'Investment Products'
    },
    {
        'paper_name': 'RBWM',
        'question_text': 'What is the primary advantage of diversification?',
        'options': {
            'A': 'To increase returns',
            'B': 'To reduce risk',
            'C': 'To maximize profits',
            'D': 'To avoid taxes'
        },
        'correct_answer': 'B',
        'difficulty': 'medium',
        'topic': 'Investment Strategy'
    },
    {
        'paper_name': 'RBWM',
        'question_text': 'What is customer service in retail banking?',
        'options': {
            'A': 'Providing financial products and services to customers',
            'B': 'Collecting deposits',
            'C': 'Issuing loans',
            'D': 'Managing investments'
        },
        'correct_answer': 'A',
        'difficulty': 'easy',
        'topic': 'Customer Service'
    }
]

# Insert questions into DynamoDB
print(f"Inserting {len(questions)} questions into DynamoDB...")

for i, q in enumerate(questions):
    question_id = str(uuid.uuid4())
    
    item = {
        'question_id': question_id,
        'version': '1',  # Version must be a string
        'paper_name': q['paper_name'],
        'question_text': q['question_text'],
        'options': q['options'],
        'correct_answer': q['correct_answer'],
        'difficulty': q['difficulty'],
        'topic': q['topic'],
        'created_at': datetime.utcnow().isoformat(),
        'updated_at': datetime.utcnow().isoformat()
    }
    
    try:
        table.put_item(Item=item)
        print(f"✓ Inserted question {i+1}/{len(questions)}: {q['paper_name']} - {q['topic']}")
    except Exception as e:
        print(f"✗ Failed to insert question {i+1}: {str(e)}")

print("\nDone! Questions have been populated in the question bank.")

# Verify
response = table.scan()
print(f"\nTotal questions in database: {response['Count']}")

# Count by paper
papers = {}
for item in response['Items']:
    paper = item['paper_name']
    papers[paper] = papers.get(paper, 0) + 1

print("\nQuestions by paper:")
for paper, count in sorted(papers.items()):
    print(f"  {paper}: {count} questions")
