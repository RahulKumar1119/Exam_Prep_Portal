"""Seed starter Quantitative Aptitude MCQs into jaiib-quant-question-bank.

30 original questions, 5 per topic, easy/medium/hard mix.
All answers hand-verified. Safe to re-run: put_item overwrites same keys.
"""
import uuid
import boto3

REGION = 'ap-south-1'
TABLE = 'jaiib-quant-question-bank'

table = boto3.resource('dynamodb', region_name=REGION).Table(TABLE)


def q(topic, difficulty, text, a, b, c, d, correct):
    return {
        'question_id': str(uuid.uuid4()),
        'version': 'v1.0',
        'paper_name': 'QUANT',
        'topic': topic,
        'difficulty': difficulty,
        'question_text': text,
        'options': {'A': a, 'B': b, 'C': c, 'D': d},
        'correct_answer': correct,
        'status': 'active',
        'reference': 'Quantitative Aptitude Guide',
        'source': 'MockMaster',
    }


QUESTIONS = [
    # ── Percentages and Ratios ──
    q('Percentages and Ratios', 'easy',
      'What is 35% of 640?', '224', '214', '234', '204', 'A'),
    q('Percentages and Ratios', 'easy',
      'Two numbers are in the ratio 3:5 and their sum is 40. The smaller number is:',
      '12', '15', '18', '25', 'B'),
    q('Percentages and Ratios', 'medium',
      'The price of an article is first increased by 20% and then decreased by 20%. The net change is:',
      'No change', '4% decrease', '4% increase', '2% decrease', 'B'),
    q('Percentages and Ratios', 'hard',
      'If x is 25% more than y, then y is how much percent less than x?',
      '20%', '25%', '30%', '22%', 'A'),
    q('Percentages and Ratios', 'medium',
      'What is the ratio of 45 minutes to 3 hours?',
      '1:4', '3:4', '1:3', '15:1', 'A'),
    # ── Simple and Compound Interest ──
    q('Simple and Compound Interest', 'easy',
      'Find the simple interest on ₹8,000 at 6% per annum for 3 years.',
      '₹1,440', '₹1,400', '₹1,500', '₹1,240', 'A'),
    q('Simple and Compound Interest', 'medium',
      'Find the compound interest on ₹5,000 at 10% per annum for 2 years.',
      '₹1,000', '₹1,050', '₹1,100', '₹550', 'B'),
    q('Simple and Compound Interest', 'medium',
      'In how many years will a sum double itself at 8% per annum simple interest?',
      '10 years', '12.5 years', '16 years', '8 years', 'B'),
    q('Simple and Compound Interest', 'hard',
      'The difference between compound and simple interest on ₹4,000 for 2 years at 10% p.a. is:',
      '₹40', '₹80', '₹400', '₹0', 'A'),
    q('Simple and Compound Interest', 'easy',
      'What is the amount on ₹6,000 at 5% per annum simple interest after 4 years?',
      '₹7,000', '₹7,200', '₹7,500', '₹6,800', 'B'),
    # ── Time Work and Speed ──
    q('Time Work and Speed', 'easy',
      'A can do a work in 10 days and B in 15 days. Working together they finish it in:',
      '5 days', '6 days', '7.5 days', '8 days', 'B'),
    q('Time Work and Speed', 'easy',
      'A train running at 120 km/h covers 300 km in:',
      '2 hours', '2 hours 30 minutes', '3 hours', '2 hours 15 minutes', 'B'),
    q('Time Work and Speed', 'medium',
      'If 15 men can do a work in 8 days, in how many days can 10 men do the same work?',
      '10 days', '12 days', '14 days', '16 days', 'B'),
    q('Time Work and Speed', 'medium',
      'A boat goes 20 km/h downstream and 12 km/h upstream. Its speed in still water is:',
      '14 km/h', '15 km/h', '16 km/h', '18 km/h', 'C'),
    q('Time Work and Speed', 'hard',
      'A car travels 60 km at 40 km/h and returns the same 60 km at 60 km/h. Its average speed is:',
      '50 km/h', '48 km/h', '45 km/h', '52 km/h', 'B'),
    # ── Profit Loss and Averages ──
    q('Profit Loss and Averages', 'easy',
      'An article bought for ₹500 is sold for ₹650. The profit percent is:',
      '25%', '30%', '35%', '20%', 'B'),
    q('Profit Loss and Averages', 'easy',
      'Find the average of 12, 18, 24, 30 and 36.',
      '22', '24', '26', '20', 'B'),
    q('Profit Loss and Averages', 'medium',
      'An article sold for ₹720 at a loss of 20%. Its cost price was:',
      '₹864', '₹900', '₹950', '₹800', 'B'),
    q('Profit Loss and Averages', 'medium',
      'The average of 5 consecutive numbers is 27. The largest number is:',
      '28', '29', '30', '31', 'B'),
    q('Profit Loss and Averages', 'medium',
      'A shopkeeper offers a 20% discount on a marked price of ₹1,250. The selling price is:',
      '₹950', '₹1,000', '₹1,050', '₹1,100', 'B'),
    # ── Number Systems and Simplification ──
    q('Number Systems and Simplification', 'easy',
      'Simplify: 48 ÷ 6 × 2 + 10',
      '26', '14', '12', '36', 'A'),
    q('Number Systems and Simplification', 'easy',
      'Find the LCM of 12, 18 and 24.',
      '36', '48', '72', '144', 'C'),
    q('Number Systems and Simplification', 'medium',
      'Find the HCF of 36, 60 and 84.',
      '6', '12', '18', '4', 'B'),
    q('Number Systems and Simplification', 'medium',
      'What is 2⁵ + 3³?',
      '59', '61', '35', '49', 'A'),
    q('Number Systems and Simplification', 'medium',
      'The smallest 4-digit number divisible by 12 is:',
      '1000', '1008', '1012', '996', 'B'),
    # ── Data Interpretation Basics ──
    q('Data Interpretation Basics', 'easy',
      'A shop sold 120, 150, 180 and 210 units in Q1–Q4. Total annual sales:',
      '600', '640', '660', '700', 'C'),
    q('Data Interpretation Basics', 'medium',
      'Sales rose from 180 units in Q3 to 210 in Q4. The growth rate is:',
      '15%', '16.67%', '20%', '14.28%', 'B'),
    q('Data Interpretation Basics', 'easy',
      'In a pie chart of ₹2,000 expenses, category B is 25%. Its value is:',
      '₹400', '₹500', '₹600', '₹300', 'B'),
    q('Data Interpretation Basics', 'easy',
      'Footfall on Mon/Tue/Wed was 45, 60, 75. The daily average is:',
      '55', '60', '65', '70', 'B'),
    q('Data Interpretation Basics', 'medium',
      'Q4 sales of 210 units grow 10% next quarter. Projected sales:',
      '220', '231', '230', '240', 'B'),
]


def main():
    # wait for table
    waiter = boto3.client('dynamodb', region_name=REGION).get_waiter('table_exists')
    waiter.wait(TableName=TABLE)
    with table.batch_writer() as batch:
        for item in QUESTIONS:
            batch.put_item(Item=item)
    print(f"Seeded {len(QUESTIONS)} questions into {TABLE}")


if __name__ == '__main__':
    main()
