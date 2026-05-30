import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SEO from '../components/SEO';

interface PaperDetail {
  slug: string;
  name: string;
  fullName: string;
  questions: string;
  rating: number;
  reviews: number;
  description: string;
  examPattern: { difficulty: string; count: number; marks: number; total: number }[];
  modules: { name: string; topics: string[] }[];
  sampleQuestions: { text: string; options: string[]; answer: string; explanation: string }[];
  features: string[];
  faqs: { q: string; a: string }[];
}

const PAPER_DETAILS: Record<string, PaperDetail> = {
  'ie-ifs': {
    slug: 'ie-ifs',
    name: 'IE & IFS',
    fullName: 'Indian Economy & Indian Financial System',
    questions: '698+',
    rating: 4.8,
    reviews: 142,
    description: 'Comprehensive practice questions covering the entire IE & IFS syllabus — from Indian economic architecture and RBI monetary policy to financial markets, SEBI regulations, and digital banking. Every question includes AI-generated explanations with specific RBI circular references.',
    examPattern: [
      { difficulty: 'Easy', count: 50, marks: 0.5, total: 25 },
      { difficulty: 'Medium', count: 25, marks: 1.0, total: 25 },
      { difficulty: 'Hard', count: 25, marks: 2.0, total: 50 },
    ],
    modules: [
      { name: 'Module A — Indian Economic Architecture', topics: ['Indian Economy overview', 'GDP and National Income', 'Economic planning', 'Agriculture sector', 'Industrial sector', 'Service sector', 'Inflation and price indices', 'Fiscal policy', 'Union Budget', 'International trade', 'Economic reforms'] },
      { name: 'Module B — Economic Concepts Related to Banking', topics: ['Money supply and monetary policy', 'RBI functions and role', 'Credit creation', 'Interest rates', 'Foreign exchange', 'Balance of payments', 'Capital account convertibility'] },
      { name: 'Module C — Indian Financial Architecture', topics: ['Banking Regulation Act 1949', 'RBI Act 1934', 'SEBI', 'IRDAI', 'PFRDA', 'Financial markets', 'Money market instruments', 'Capital market', 'Debt market', 'Forex market', 'NABARD', 'SIDBI'] },
      { name: 'Module D — Financial Products and Services', topics: ['Retail banking products', 'Corporate banking', 'Priority sector lending', 'Financial inclusion', 'Digital banking', 'Payment systems', 'NEFT RTGS IMPS UPI', 'Insurance products', 'Mutual funds', 'Pension funds', 'Derivatives', 'Credit rating agencies'] },
    ],
    sampleQuestions: [
      { text: 'Which of the following is NOT a function of the Reserve Bank of India under Section 21 of the RBI Act 1934?', options: ['Banker to the Government', 'Issuer of currency notes', 'Regulator of stock exchanges', 'Lender of last resort'], answer: 'C', explanation: 'SEBI regulates stock exchanges, not RBI. RBI\'s functions under the RBI Act include being banker to the government (Section 21), issuing currency (Section 22), and acting as lender of last resort.' },
      { text: 'The current CRR (Cash Reserve Ratio) maintained by scheduled commercial banks with RBI is:', options: ['3%', '4%', '4.5%', '5%'], answer: 'C', explanation: 'As per RBI\'s latest monetary policy circular, CRR stands at 4.5% of NDTL (Net Demand and Time Liabilities). This is a frequently tested question — always check the latest RBI policy rates.' },
    ],
    features: ['698+ practice questions across all 4 modules', 'AI explanations citing RBI Master Circulars', 'Mock test mode with real JAIIB exam weightage', 'Topic-wise performance tracking', 'Adaptive difficulty based on your performance', 'Updated for 2026 syllabus and latest RBI circulars', 'Unlimited practice attempts', 'Mobile-friendly interface'],
    faqs: [
      { q: 'How many questions are available for IE & IFS?', a: 'Currently 698+ questions covering all 4 modules. New questions are added regularly based on latest RBI circulars and exam patterns.' },
      { q: 'Are the questions updated for the 2026 exam?', a: 'Yes. Questions are aligned with the revised IIBF syllabus and include topics from recent RBI policy changes, Union Budget 2025-26, and latest financial regulations.' },
      { q: 'Do I get explanations for every question?', a: 'Yes. Every question has an AI-generated explanation that cites specific RBI Master Circulars, IIBF textbook chapters, and relevant Acts with section numbers.' },
      { q: 'Is there a mock test mode?', a: 'Yes. The mock test simulates the real JAIIB exam: 100 questions, 2-hour timer, with proper difficulty distribution (50 easy, 25 medium, 25 hard).' },
    ],
  },
  'ppb': {
    slug: 'ppb',
    name: 'PPB',
    fullName: 'Principles & Practices of Banking',
    questions: '536+',
    rating: 4.9,
    reviews: 128,
    description: 'Master the PPB paper with practice questions covering banking operations, KYC/AML norms, NPA classification, Negotiable Instruments Act, digital banking technology, and banking ethics. AI explanations reference specific RBI Master Directions and IIBF textbook sections.',
    examPattern: [
      { difficulty: 'Easy', count: 50, marks: 0.5, total: 25 },
      { difficulty: 'Medium', count: 25, marks: 1.0, total: 25 },
      { difficulty: 'Hard', count: 25, marks: 2.0, total: 50 },
    ],
    modules: [
      { name: 'Module A — General Banking Operations', topics: ['Types of bank accounts', 'KYC norms', 'Account opening', 'Nomination facility', 'Cheque and its types', 'Crossing of cheques', 'Negotiable Instruments Act 1881', 'Promissory note', 'Bill of exchange', 'Banker customer relationship'] },
      { name: 'Module B — Functions of Banks', topics: ['Loans and advances', 'Secured and unsecured loans', 'Mortgage', 'Pledge and hypothecation', 'Priority sector lending', 'MSME lending', 'Agricultural loans', 'NPA classification', 'SARFAESI Act', 'Recovery of debts', 'Credit appraisal'] },
      { name: 'Module C — Banking Technology', topics: ['Core banking solution', 'Internet banking', 'Mobile banking', 'ATM operations', 'RTGS NEFT IMPS', 'UPI', 'Cheque truncation system', 'Cyber security', 'IT Act 2000', 'Digital payments'] },
      { name: 'Module D — Ethics in Banking', topics: ['Banking codes and standards', 'Customer grievance redressal', 'Banking ombudsman', 'Fair practices code', 'Anti-money laundering', 'PMLA 2002', 'KYC AML CFT', 'Corporate governance', 'Whistle blower policy', 'Code of conduct'] },
    ],
    sampleQuestions: [
      { text: 'Under the Integrated Ombudsman Scheme 2021, what is the maximum compensation that can be awarded for deficiency in banking service?', options: ['₹10 lakh', '₹20 lakh', '₹50 lakh', '₹1 crore'], answer: 'B', explanation: 'Under the RBI Integrated Ombudsman Scheme 2021, the maximum compensation for deficiency in service is ₹20 lakh. The scheme provides a single-point resolution for all banking complaints.' },
      { text: 'An advance becomes NPA when interest/principal remains overdue for more than:', options: ['30 days', '60 days', '90 days', '180 days'], answer: 'C', explanation: 'As per RBI Master Circular on IRAC Norms (DOR.STR.REC.55/21.04.048/2023-24), an advance is classified as NPA when interest/principal remains overdue for more than 90 days.' },
    ],
    features: ['536+ practice questions across all 4 modules', 'AI explanations with RBI Master Direction references', 'Statement-based questions (I, II, III, IV format)', 'NPA classification & SARFAESI Act deep coverage', 'Latest KYC & Digital Lending guidelines', 'Updated for 2026 syllabus', 'Unlimited practice attempts', 'Performance analytics by topic'],
    faqs: [
      { q: 'How many questions are available for PPB?', a: 'Currently 536+ questions. PPB is the most practical paper and we focus heavily on scenario-based questions testing application of banking rules.' },
      { q: 'Does it cover the latest RBI circulars?', a: 'Yes. Questions include the latest KYC Master Direction, Digital Lending Guidelines, Integrated Ombudsman Scheme, and updated PSL norms.' },
      { q: 'Are statement-based (hard) questions included?', a: 'Yes. About 25% of questions follow the "Consider the following statements: I, II, III, IV — which are correct?" format, matching the real exam pattern.' },
      { q: 'Can I practice specific modules only?', a: 'The adaptive system automatically focuses on your weak modules. You can also see module-wise accuracy in your dashboard.' },
    ],
  },
  'afm': {
    slug: 'afm',
    name: 'AFM',
    fullName: 'Accounting & Financial Management for Bankers',
    questions: '535+',
    rating: 4.7,
    reviews: 96,
    description: 'Practice numerical and conceptual questions for AFM — covering accounting principles, financial statements, capital budgeting (NPV, IRR), ratio analysis, taxation, and costing. Includes calculation-based hard questions matching the real exam format.',
    examPattern: [
      { difficulty: 'Easy', count: 50, marks: 0.5, total: 25 },
      { difficulty: 'Medium', count: 25, marks: 1.0, total: 25 },
      { difficulty: 'Hard (Numerical)', count: 25, marks: 2.0, total: 50 },
    ],
    modules: [
      { name: 'Module A — Accounting Principles & Processes', topics: ['Accounting concepts and conventions', 'Double entry system', 'Journal and ledger', 'Trial balance', 'Depreciation methods', 'Provisions and reserves', 'Rectification of errors', 'Bank reconciliation statement'] },
      { name: 'Module B — Financial Statements & Core Banking', topics: ['Trading and P&L account', 'Balance sheet', 'Cash flow statement AS-3', 'Fund flow statement', 'Ratio analysis', 'Working capital management', 'NPBT calculation', 'Operating activities'] },
      { name: 'Module C — Financial Management', topics: ['Time value of money', 'Capital budgeting NPV IRR', 'Cost of capital', 'Capital structure', 'Leverage', 'Dividend policy', 'Working capital financing', 'Risk and return', 'CAPM'] },
      { name: 'Module D — Taxation & Costing', topics: ['Income tax basics', 'TDS provisions', 'GST overview', 'Cost accounting concepts', 'Marginal costing', 'Break even analysis', 'Standard costing', 'Budgetary control'] },
    ],
    sampleQuestions: [
      { text: 'A project requires an initial investment of ₹5,00,000 and generates cash flows of ₹1,50,000 per year for 5 years. At a discount rate of 10%, the NPV is approximately:', options: ['₹68,618', '₹-68,618', '₹1,18,618', '₹-31,382'], answer: 'A', explanation: 'NPV = -5,00,000 + 1,50,000 × PVIFA(10%, 5 years). PVIFA(10%, 5) = 3.7908. NPV = -5,00,000 + (1,50,000 × 3.7908) = -5,00,000 + 5,68,618 = ₹68,618. Since NPV > 0, the project is acceptable.' },
      { text: 'If Current Ratio is 2.5 and Quick Ratio is 1.5, and Current Liabilities are ₹2,00,000, what is the value of Inventory?', options: ['₹1,00,000', '₹2,00,000', '₹3,00,000', '₹5,00,000'], answer: 'B', explanation: 'Current Assets = 2.5 × 2,00,000 = ₹5,00,000. Quick Assets = 1.5 × 2,00,000 = ₹3,00,000. Inventory = Current Assets - Quick Assets = 5,00,000 - 3,00,000 = ₹2,00,000.' },
    ],
    features: ['535+ questions including numerical problems', 'Step-by-step calculation explanations', 'NPV, IRR, BEP, and ratio problems', 'Hard questions are calculation-based (real exam format)', 'Depreciation, TDS, and GST computations', 'Updated for 2026 syllabus', 'Unlimited practice attempts', 'Formula reference in explanations'],
    faqs: [
      { q: 'Are the hard questions numerical/calculation-based?', a: 'Yes. Unlike other papers where hard questions are statement-based, AFM hard questions (2 marks each) require actual calculations — NPV, IRR, ratios, depreciation, break-even, etc.' },
      { q: 'Do explanations show step-by-step calculations?', a: 'Yes. Every numerical question includes a detailed step-by-step solution showing the formula used, intermediate calculations, and final answer.' },
      { q: 'Is a calculator allowed in the real exam?', a: 'Yes, IIBF provides an on-screen calculator during the exam. Our practice interface simulates the same environment.' },
      { q: 'How many questions are available?', a: 'Currently 535+ questions covering all 4 modules with a mix of conceptual and numerical problems.' },
    ],
  },
  'rbwm': {
    slug: 'rbwm',
    name: 'RBWM',
    fullName: 'Retail Banking & Wealth Management',
    questions: '299+',
    rating: 4.8,
    reviews: 74,
    description: 'Practice questions for the newest JAIIB paper — covering retail banking products, loan recovery, marketing concepts, and wealth management. Includes questions on mutual funds, insurance, financial planning, and digital banking channels.',
    examPattern: [
      { difficulty: 'Easy', count: 50, marks: 0.5, total: 25 },
      { difficulty: 'Medium', count: 25, marks: 1.0, total: 25 },
      { difficulty: 'Hard', count: 25, marks: 2.0, total: 50 },
    ],
    modules: [
      { name: 'Module A — Retail Banking', topics: ['Retail banking overview', 'Home loans', 'Auto loans', 'Personal loans', 'Credit cards', 'Debit cards', 'Retail deposits', 'NRI banking', 'Priority banking'] },
      { name: 'Module B — Retail Products & Recovery', topics: ['Loan against property', 'Education loans', 'Gold loans', 'Microfinance', 'Self help groups', 'Recovery management', 'Lok adalat', 'DRT', 'SARFAESI in retail', 'One time settlement'] },
      { name: 'Module C — Marketing of Banking Services', topics: ['Marketing concepts', 'Market segmentation', 'CRM', 'Digital marketing', 'Cross selling', 'Customer lifecycle', 'Service quality', 'Brand management'] },
      { name: 'Module D — Wealth Management', topics: ['Financial planning', 'Investment products', 'Mutual funds types', 'Portfolio management', 'Risk profiling', 'Insurance planning', 'Retirement planning', 'Tax planning', 'Estate planning'] },
    ],
    sampleQuestions: [
      { text: 'Under PMAY (Pradhan Mantri Awas Yojana), the interest subsidy for EWS/LIG category on home loans up to ₹6 lakh is:', options: ['4%', '5%', '6.5%', '3%'], answer: 'C', explanation: 'Under PMAY-CLSS, EWS/LIG category gets 6.5% interest subsidy on home loans up to ₹6 lakh for a tenure of 20 years. This translates to approximately ₹2.67 lakh subsidy (NPV).' },
      { text: 'Which of the following is NOT a type of mutual fund based on structure?', options: ['Open-ended fund', 'Close-ended fund', 'Interval fund', 'Index fund'], answer: 'D', explanation: 'Based on structure, mutual funds are classified as Open-ended, Close-ended, and Interval funds. Index fund is a classification based on investment objective/strategy, not structure.' },
    ],
    features: ['299+ practice questions (growing weekly)', 'Covers the newest JAIIB paper comprehensively', 'Retail products & wealth management focus', 'PMAY, MUDRA, and financial inclusion schemes', 'Mutual funds, insurance & tax planning', 'Updated for 2026 syllabus', 'Unlimited practice attempts', 'Module-wise performance tracking'],
    faqs: [
      { q: 'RBWM is a new paper — are there enough questions?', a: 'We currently have 299+ questions and add new ones weekly. RBWM is the most practical paper with real-world banking scenarios.' },
      { q: 'Does it cover government schemes?', a: 'Yes. Questions cover PMAY, PMJDY, MUDRA, Stand-Up India, and other financial inclusion schemes that are frequently tested.' },
      { q: 'Are wealth management topics covered?', a: 'Yes. Module D covers mutual funds (types, NAV, SIP), insurance products, retirement planning, tax planning, and risk profiling — all tested in the exam.' },
      { q: 'Is this paper easier than others?', a: 'RBWM is considered the most scoring paper as it tests practical banking knowledge. Our questions help you cover all topics systematically.' },
    ],
  },
};

const PracticeTestDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();

  const paper = slug ? PAPER_DETAILS[slug] : null;

  if (!paper) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Paper Not Found</h1>
          <button onClick={() => navigate('/practice-tests')} className="text-blue-600 font-medium hover:underline">← Back to Practice Tests</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">JC</span>
            </div>
            <span className="text-xl font-bold text-gray-900">JAIIB-CAIIB Prep</span>
          </div>
          <div className="flex gap-4">
            <button onClick={() => navigate('/practice-tests')} className="px-6 py-2 text-gray-700 font-medium hover:text-gray-900 transition">All Papers</button>
            <button onClick={() => navigate('/register')} className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition">Start Free</button>
          </div>
        </div>
      </nav>

      <SEO
        title={`${paper.name} Practice Questions 2026 — Free JAIIB Mock Test`}
        description={paper.description}
        canonical={`https://mockmaster.fun/practice-tests/${paper.slug}`}
        keywords={`${paper.name} practice questions, ${paper.fullName} mock test, JAIIB ${paper.name} 2026`}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <button onClick={() => navigate('/practice-tests')} className="text-blue-200 text-sm mb-4 hover:text-white transition">← All Practice Tests</button>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">{paper.name} Practice Questions 2026</h1>
              <p className="text-xl text-blue-100">{paper.fullName}</p>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <span key={s} className={s <= Math.floor(paper.rating) ? 'text-yellow-300' : 'text-blue-300'}>★</span>
                  ))}
                  <span className="text-white font-medium ml-1">{paper.rating}</span>
                </div>
                <span className="text-blue-200">({paper.reviews} reviews)</span>
                <span className="text-blue-200">•</span>
                <span className="text-blue-200">{paper.questions} questions</span>
              </div>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur rounded-xl p-6 text-center min-w-[200px]">
              <p className="text-3xl font-bold text-white">Free</p>
              <p className="text-blue-200 text-sm mb-4">with signup</p>
              <button
                onClick={() => navigate('/register')}
                className="w-full px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition"
              >
                Start Practicing →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Description */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Practice Test</h2>
          <p className="text-gray-700 leading-relaxed text-lg">{paper.description}</p>
        </div>

        {/* Exam Pattern */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Exam Pattern & Marking Scheme</h2>
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-600 font-semibold border-b border-gray-200">
                  <th className="pb-3">Difficulty</th>
                  <th className="pb-3">Questions</th>
                  <th className="pb-3">Marks Each</th>
                  <th className="pb-3">Total Marks</th>
                </tr>
              </thead>
              <tbody className="text-gray-800">
                {paper.examPattern.map((row) => (
                  <tr key={row.difficulty} className="border-b border-gray-100">
                    <td className="py-3 font-medium">{row.difficulty}</td>
                    <td className="py-3">{row.count}</td>
                    <td className="py-3">{row.marks}</td>
                    <td className="py-3 font-semibold">{row.total}</td>
                  </tr>
                ))}
                <tr className="font-bold text-gray-900">
                  <td className="pt-3">Total</td>
                  <td className="pt-3">100</td>
                  <td className="pt-3">—</td>
                  <td className="pt-3">100</td>
                </tr>
              </tbody>
            </table>
            <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-200 text-sm text-gray-600">
              <span>⏱ Duration: 2 hours</span>
              <span>✅ Pass: 50 marks</span>
              <span>❌ No negative marking</span>
            </div>
          </div>
        </div>

        {/* Syllabus / Modules */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Complete Syllabus Covered</h2>
          <div className="space-y-4">
            {paper.modules.map((mod, idx) => (
              <details key={mod.name} className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden" open={idx === 0}>
                <summary className="px-6 py-4 cursor-pointer font-semibold text-gray-900 hover:bg-gray-100 transition">
                  {mod.name}
                </summary>
                <div className="px-6 pb-4">
                  <div className="flex flex-wrap gap-2">
                    {mod.topics.map((topic) => (
                      <span key={topic} className="text-sm bg-white border border-gray-200 text-gray-700 px-3 py-1 rounded-full">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* Sample Questions */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Sample Questions</h2>
          <div className="space-y-6">
            {paper.sampleQuestions.map((sq, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <p className="font-medium text-gray-900 mb-4">Q{idx + 1}. {sq.text}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                  {sq.options.map((opt, oi) => (
                    <div
                      key={oi}
                      className={`p-3 rounded-lg border text-sm ${
                        String.fromCharCode(65 + oi) === sq.answer
                          ? 'border-green-300 bg-green-50 text-green-800 font-medium'
                          : 'border-gray-200 bg-gray-50 text-gray-700'
                      }`}
                    >
                      <span className="font-semibold">{String.fromCharCode(65 + oi)}.</span> {opt}
                      {String.fromCharCode(65 + oi) === sq.answer && <span className="ml-2 text-green-600">✓</span>}
                    </div>
                  ))}
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800"><span className="font-semibold">Explanation:</span> {sq.explanation}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-4 text-center">Sign up to access all {paper.questions} questions with full AI explanations</p>
        </div>

        {/* Features */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What's Included</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {paper.features.map((f) => (
              <div key={f} className="flex items-start gap-2 p-3 bg-green-50 rounded-lg border border-green-100">
                <span className="text-green-500 mt-0.5">✓</span>
                <span className="text-sm text-gray-800">{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {paper.faqs.map((faq, idx) => (
              <details key={idx} className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                <summary className="px-6 py-4 cursor-pointer font-medium text-gray-900 hover:bg-gray-100 transition">
                  {faq.q}
                </summary>
                <div className="px-6 pb-4">
                  <p className="text-gray-700 text-sm">{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Ready to Start Practicing?</h2>
          <p className="text-blue-100 mb-6">Access all {paper.questions} questions with AI explanations — completely free</p>
          <button
            onClick={() => navigate('/register')}
            className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition"
          >
            Sign Up & Start Free →
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 px-4 sm:px-6 lg:px-8 mt-12">
        <div className="max-w-7xl mx-auto text-center text-sm">
          <p>&copy; 2024 MockMaster. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default PracticeTestDetailPage;
