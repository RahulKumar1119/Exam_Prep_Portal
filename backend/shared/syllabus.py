"""
Shared syllabus module for JAIIB Exam Prep Portal.

Provides the canonical PAPER_SYLLABUS structure, topic normalization,
and coverage gap analysis used by both practice and dashboard lambdas.
"""

# Paper display names mapped to their short codes
# These are NOT valid granular topics and should be filtered out
PAPER_DISPLAY_NAMES = {
    'Indian Economy & Financial System': 'IE & IFS',
    'Indian Economy and Indian Financial System': 'IE & IFS',
    'IE & IFS': 'IE & IFS',
    'Principles & Practices of Banking': 'PPB',
    'Principles and Practices of Banking': 'PPB',
    'PPB': 'PPB',
    'Accounting & Finance for Bankers': 'AFB',
    'Accounting and Finance for Bankers': 'AFB',
    'AFB': 'AFB',
    'Accounting & Financial Management': 'AFM',
    'Accounting and Financial Management': 'AFM',
    'AFM': 'AFM',
    'Retail Banking & Wealth Management': 'RBWM',
    'Retail Banking and Wealth Management': 'RBWM',
    'RBWM': 'RBWM',
}

PAPER_SYLLABUS = {
    'IE & IFS': {
        'modules': {
            'Module A - Indian Economic Architecture': [
                'Indian Economy overview', 'GDP and National Income', 'Economic planning',
                'Agriculture sector', 'Industrial sector', 'Service sector',
                'Inflation and price indices', 'Fiscal policy', 'Union Budget',
                'International trade', 'Economic reforms'
            ],
            'Module B - Economic Concepts Related to Banking': [
                'Money supply and monetary policy', 'RBI functions and role',
                'Credit creation', 'Interest rates', 'Foreign exchange',
                'Balance of payments', 'Capital account convertibility'
            ],
            'Module C - Indian Financial Architecture': [
                'Banking Regulation Act 1949', 'RBI Act 1934', 'SEBI', 'IRDAI',
                'PFRDA', 'Financial markets', 'Money market instruments',
                'Capital market', 'Debt market', 'Forex market',
                'NABARD', 'SIDBI'
            ],
            'Module D - Financial Products and Services': [
                'Retail banking products', 'Corporate banking', 'Priority sector lending',
                'Financial inclusion', 'Digital banking', 'Payment systems',
                'NEFT RTGS IMPS UPI', 'Insurance products', 'Mutual funds',
                'Pension funds', 'Derivatives', 'Securitization', 'Factoring',
                'Venture capital', 'Leasing and hire purchase', 'Credit rating agencies'
            ]
        }
    },
    'PPB': {
        'modules': {
            'Module A - General Banking Operations': [
                'Types of bank accounts', 'KYC norms', 'Account opening',
                'Nomination facility', 'Cheque and its types', 'Crossing of cheques',
                'Negotiable Instruments Act 1881', 'Promissory note', 'Bill of exchange',
                'Banker customer relationship'
            ],
            'Module B - Functions of Banks': [
                'Loans and advances', 'Secured and unsecured loans', 'Mortgage',
                'Pledge and hypothecation', 'Priority sector lending', 'MSME lending',
                'Agricultural loans', 'NPA classification', 'SARFAESI Act',
                'Recovery of debts', 'Credit appraisal'
            ],
            'Module C - Banking Technology': [
                'Core banking solution', 'Internet banking', 'Mobile banking',
                'ATM operations', 'RTGS NEFT IMPS', 'UPI', 'Cheque truncation system',
                'Cyber security', 'IT Act 2000', 'Digital payments'
            ],
            'Module D - Ethics in Banking': [
                'Banking codes and standards', 'Customer grievance redressal',
                'Banking ombudsman', 'Fair practices code', 'Anti-money laundering',
                'PMLA 2002', 'KYC AML CFT', 'Corporate governance',
                'Whistle blower policy', 'Code of conduct'
            ]
        }
    },
    'AFB': {
        'modules': {
            'Module A - Accounting Principles and Processes': [
                'Accounting concepts and conventions', 'Double entry system',
                'Journal and ledger', 'Trial balance', 'Depreciation methods',
                'Provisions and reserves', 'Rectification of errors',
                'Bank reconciliation statement'
            ],
            'Module B - Financial Statements and Core Banking': [
                'Trading and P&L account', 'Balance sheet', 'Cash flow statement AS-3',
                'Fund flow statement', 'Ratio analysis', 'Working capital management',
                'NPBT calculation TIPP', 'Financing activities', 'Operating activities'
            ],
            'Module C - Financial Management': [
                'Time value of money', 'Capital budgeting NPV IRR', 'Cost of capital',
                'Capital structure', 'Leverage', 'Dividend policy',
                'Working capital financing', 'Risk and return', 'CAPM'
            ],
            'Module D - Taxation and Costing': [
                'Income tax basics', 'TDS provisions', 'GST overview',
                'Cost accounting concepts', 'Marginal costing', 'Break even analysis',
                'Standard costing', 'Budgetary control'
            ]
        }
    },
    'RBWM': {
        'modules': {
            'Module A - Retail Banking': [
                'Retail banking overview', 'Retail products', 'Home loans',
                'Auto loans', 'Personal loans', 'Credit cards', 'Debit cards',
                'Retail deposits', 'NRI banking', 'Priority banking'
            ],
            'Module B - Retail Products and Recovery': [
                'Loan against property', 'Education loans', 'Gold loans',
                'Microfinance', 'Self help groups', 'Recovery management',
                'Lok adalat', 'DRT', 'SARFAESI in retail', 'One time settlement'
            ],
            'Module C - Marketing of Banking Services': [
                'Marketing concepts', 'Market segmentation', 'CRM',
                'Digital marketing', 'Cross selling', 'Customer lifecycle',
                'Service quality', 'Brand management', 'Distribution channels'
            ],
            'Module D - Wealth Management': [
                'Wealth management overview', 'Financial planning', 'Investment products',
                'Mutual funds types', 'Portfolio management', 'Risk profiling',
                'Insurance planning', 'Retirement planning', 'Tax planning',
                'Estate planning', 'High net worth individuals'
            ]
        }
    }
}


def _get_all_topics_for_paper(paper_name):
    """Get a flat list of all topics for a given paper."""
    paper_data = PAPER_SYLLABUS.get(paper_name)
    if not paper_data:
        return []
    topics = []
    for module_topics in paper_data['modules'].values():
        topics.extend(module_topics)
    return topics


def _get_all_topics():
    """Get a flat list of all topics across all papers."""
    topics = []
    for paper_data in PAPER_SYLLABUS.values():
        for module_topics in paper_data['modules'].values():
            topics.extend(module_topics)
    return topics


def normalize_topic(topic_str, paper_name=None):
    """
    Normalize a free-form topic string to its canonical syllabus entry.

    Matching strategy:
    0. If topic_str is a paper display name (not a granular topic), return None
       to signal the caller to skip this entry
    1. Exact match (case-insensitive) against topics in the paper's syllabus
    2. Substring match (topic_str is substring of syllabus entry or vice versa)
    3. Return original string if no match found

    Args:
        topic_str: The topic string to normalize
        paper_name: Optional paper name to restrict search scope.
                    If None or not in PAPER_SYLLABUS, searches all papers.

    Returns:
        The canonical syllabus entry if a match is found,
        None if the topic is actually a paper display name (should be skipped),
        or the original string if no match found.
    """
    if not topic_str:
        return topic_str

    # Phase 0: Check if this is a paper display name (not a granular topic)
    topic_stripped = topic_str.strip()
    if topic_stripped in PAPER_DISPLAY_NAMES:
        return None
    # Also check case-insensitive
    topic_lower = topic_stripped.lower()
    for display_name in PAPER_DISPLAY_NAMES:
        if display_name.lower() == topic_lower:
            return None

    # Determine which topics to search against
    if paper_name and paper_name in PAPER_SYLLABUS:
        syllabus_topics = _get_all_topics_for_paper(paper_name)
    else:
        syllabus_topics = _get_all_topics()

    # Phase 1: Exact match (case-insensitive)
    for canonical in syllabus_topics:
        if canonical.lower() == topic_lower:
            return canonical

    # Phase 2: Substring match
    # Check if topic_str is a substring of a syllabus entry
    for canonical in syllabus_topics:
        canonical_lower = canonical.lower()
        if topic_lower in canonical_lower or canonical_lower in topic_lower:
            return canonical

    # No match found - return original string
    return topic_str


def get_coverage_gaps(attempted_topics, paper_name):
    """
    Identify syllabus topics that have not been attempted.

    Args:
        attempted_topics: List of topic strings the user has attempted
                         (will be normalized before comparison)
        paper_name: The paper to check coverage for

    Returns:
        List of canonical syllabus topics not yet attempted.
        Returns empty list if paper_name is not in PAPER_SYLLABUS.
    """
    if paper_name not in PAPER_SYLLABUS:
        return []

    all_topics = _get_all_topics_for_paper(paper_name)

    # Normalize attempted topics for comparison
    normalized_attempted = set()
    for topic in attempted_topics:
        normalized = normalize_topic(topic, paper_name)
        if normalized is not None:
            normalized_attempted.add(normalized.lower())

    # Find topics not yet attempted
    gaps = []
    for topic in all_topics:
        if topic.lower() not in normalized_attempted:
            gaps.append(topic)

    return gaps
