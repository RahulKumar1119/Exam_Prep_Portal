import React from 'react';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="JAIIB Exam 2026: Complete Guide, Syllabus, Strategy & Free Mock Tests"
        description="Everything you need to pass JAIIB 2026 — exam structure, latest syllabus for IE&IFS, PPB, AFM, RBWM, passing criteria, preparation strategy, study timetable, and free practice questions."
        canonical="https://mockmaster.fun/"
        keywords="JAIIB exam 2026, JAIIB syllabus 2026, JAIIB preparation strategy, JAIIB passing marks, JAIIB study plan, IIBF JAIIB, JAIIB mock test free"
      />
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm sm:text-lg">JC</span>
            </div>
            <span className="text-base sm:text-xl font-bold text-gray-900 hidden sm:block">JAIIB-CAIIB Prep</span>
            <span className="text-base font-bold text-gray-900 sm:hidden">MockMaster</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-4">
            <button onClick={() => navigate('/practice-tests')} className="px-2 sm:px-6 py-2 text-xs sm:text-sm text-gray-700 font-medium hover:text-gray-900 transition hidden sm:block">Practice Tests</button>
            <button onClick={() => navigate('/study-topics')} className="px-2 sm:px-6 py-2 text-xs sm:text-sm text-gray-700 font-medium hover:text-gray-900 transition hidden sm:block">Study Topics</button>
            <button onClick={() => navigate('/blog')} className="px-2 sm:px-6 py-2 text-xs sm:text-sm text-gray-700 font-medium hover:text-gray-900 transition hidden md:block">Blog</button>
            <button onClick={() => navigate('/login')} className="px-3 sm:px-6 py-2 text-xs sm:text-sm text-gray-700 font-medium hover:text-gray-900 transition">Login</button>
            <button onClick={() => navigate('/register')} className="px-3 sm:px-6 py-2 text-xs sm:text-sm bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition">Sign Up</button>
          </div>
        </div>
      </nav>

      {/* Hero Section — Educational Focus */}
      <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-10 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
            JAIIB Exam 2026: Complete Guide to Passing in Your First Attempt
          </h1>
          <p className="text-base sm:text-lg text-gray-700 mb-6 leading-relaxed max-w-3xl mx-auto">
            The Junior Associate of the Indian Institute of Bankers (JAIIB) is a flagship certification conducted by IIBF for bank employees across India. This page covers everything you need — exam structure, updated 2026 syllabus, passing criteria, common mistakes candidates make, and a proven preparation strategy with a week-by-week study timetable.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => navigate('/register')} className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition text-sm sm:text-base">
              Start Free Practice
            </button>
            <a href="#jaiib-structure" className="px-6 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition text-sm sm:text-base">
              Read the Full Guide
            </a>
          </div>
        </div>
      </section>

      {/* Section 1: How JAIIB is Structured */}
      <section id="jaiib-structure" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto prose prose-lg prose-gray">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">How the JAIIB Exam is Structured</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            JAIIB (Junior Associate of the Indian Institute of Bankers) is a professional certification exam conducted by the Indian Institute of Banking and Finance (IIBF). It is mandatory for confirmed bank employees who wish to get increments and career growth in public and private sector banks. The exam is held twice a year — typically in May/June and November/December.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            The exam consists of <strong>4 compulsory papers</strong>, each tested as a separate online exam. You must pass all four papers within a span of <strong>2 consecutive attempts</strong> (i.e., within one year). Each paper has 100 multiple-choice questions (MCQs) to be answered in 120 minutes.
          </p>

          <div className="overflow-x-auto my-8">
            <table className="min-w-full border border-gray-200 rounded-lg text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900 border-b">Paper</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900 border-b">Full Name</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-900 border-b">Questions</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-900 border-b">Duration</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-900 border-b">Total Marks</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="px-4 py-3 font-medium text-blue-700">IE & IFS</td>
                  <td className="px-4 py-3 text-gray-700">Indian Economy & Indian Financial System</td>
                  <td className="px-4 py-3 text-center text-gray-700">100</td>
                  <td className="px-4 py-3 text-center text-gray-700">120 min</td>
                  <td className="px-4 py-3 text-center text-gray-700">100</td>
                </tr>
                <tr className="border-b bg-gray-50">
                  <td className="px-4 py-3 font-medium text-blue-700">PPB</td>
                  <td className="px-4 py-3 text-gray-700">Principles & Practices of Banking</td>
                  <td className="px-4 py-3 text-center text-gray-700">100</td>
                  <td className="px-4 py-3 text-center text-gray-700">120 min</td>
                  <td className="px-4 py-3 text-center text-gray-700">100</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-3 font-medium text-blue-700">AFM</td>
                  <td className="px-4 py-3 text-gray-700">Accounting & Financial Management for Bankers</td>
                  <td className="px-4 py-3 text-center text-gray-700">100</td>
                  <td className="px-4 py-3 text-center text-gray-700">120 min</td>
                  <td className="px-4 py-3 text-center text-gray-700">100</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-blue-700">RBWM</td>
                  <td className="px-4 py-3 text-gray-700">Retail Banking & Wealth Management</td>
                  <td className="px-4 py-3 text-center text-gray-700">100</td>
                  <td className="px-4 py-3 text-center text-gray-700">120 min</td>
                  <td className="px-4 py-3 text-center text-gray-700">100</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-gray-700 leading-relaxed mb-4">
            The marking scheme follows a <strong>weighted pattern</strong>: approximately 50 easy questions carry 0.5 marks each (25 marks), 25 medium questions carry 1 mark each (25 marks), and 25 hard questions carry 2 marks each (50 marks) — totalling 100 marks. There is <strong>no negative marking</strong> in JAIIB, so you should attempt every question.
          </p>
        </div>
      </section>

      {/* Section 2: Latest Syllabus 2026 */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">JAIIB Syllabus 2026 (Latest IIBF Update)</h2>
          <p className="text-gray-700 leading-relaxed mb-8">
            IIBF updated the JAIIB syllabus in 2023 when it moved from 3 papers to 4 papers. The 2026 syllabus remains the same structure. Each paper has 4 modules covering specific banking and financial topics. Here is the complete module-wise breakdown:
          </p>

          {/* IE & IFS */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
            <h3 className="text-xl font-bold text-blue-800 mb-3">Paper 1: Indian Economy & Indian Financial System (IE & IFS)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
              <div>
                <p className="font-semibold text-gray-900 mb-2">Module A — Indian Economic Architecture</p>
                <p>GDP & National Income, Economic Planning, Agriculture/Industrial/Service sectors, Inflation & Price Indices, Fiscal Policy & Union Budget, International Trade, Economic Reforms since 1991.</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-2">Module B — Economic Concepts for Banking</p>
                <p>Money Supply & Monetary Policy, RBI Functions, Credit Creation, Interest Rate Determination, Foreign Exchange, Balance of Payments, Capital Account Convertibility.</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-2">Module C — Indian Financial Architecture</p>
                <p>Banking Regulation Act 1949, RBI Act 1934, SEBI, IRDAI, PFRDA, Financial Markets (Money/Capital/Forex/Debt), NABARD, SIDBI.</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-2">Module D — Financial Products & Services</p>
                <p>Retail & Corporate Banking, Priority Sector Lending, Digital Banking & Payment Systems (NEFT/RTGS/UPI), Insurance, Mutual Funds, Derivatives, Securitization, Credit Rating Agencies.</p>
              </div>
            </div>
          </div>

          {/* PPB */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
            <h3 className="text-xl font-bold text-indigo-800 mb-3">Paper 2: Principles & Practices of Banking (PPB)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
              <div>
                <p className="font-semibold text-gray-900 mb-2">Module A — General Banking Operations</p>
                <p>Types of Accounts, KYC Norms, Nomination Facility, Negotiable Instruments Act 1881, Cheque Types & Crossing, Banker-Customer Relationship.</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-2">Module B — Functions of Banks</p>
                <p>Loans & Advances, Mortgage/Pledge/Hypothecation, Priority Sector & MSME Lending, NPA Classification, SARFAESI Act, Credit Appraisal.</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-2">Module C — Banking Technology</p>
                <p>Core Banking Solutions, Internet & Mobile Banking, RTGS/NEFT/IMPS/UPI, Cheque Truncation, Cyber Security, IT Act 2000.</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-2">Module D — Ethics in Banking</p>
                <p>Banking Codes & Standards, Customer Grievance Redressal, Banking Ombudsman, Anti-Money Laundering (PMLA 2002), KYC/AML/CFT, Corporate Governance.</p>
              </div>
            </div>
          </div>

          {/* AFM */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
            <h3 className="text-xl font-bold text-purple-800 mb-3">Paper 3: Accounting & Financial Management (AFM)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
              <div>
                <p className="font-semibold text-gray-900 mb-2">Module A — Accounting Principles</p>
                <p>Double Entry System, Journal & Ledger, Trial Balance, Depreciation Methods, Provisions & Reserves, Bank Reconciliation Statement.</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-2">Module B — Financial Statements</p>
                <p>Trading & P&L Account, Balance Sheet, Cash Flow Statement (AS-3), Fund Flow, Ratio Analysis, Working Capital Management.</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-2">Module C — Financial Management</p>
                <p>Time Value of Money, Capital Budgeting (NPV/IRR), Cost of Capital, Capital Structure & Leverage, Dividend Policy, CAPM.</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-2">Module D — Taxation & Costing</p>
                <p>Income Tax Basics, TDS Provisions, GST Overview, Cost Accounting, Marginal Costing, Break-Even Analysis, Standard Costing.</p>
              </div>
            </div>
          </div>

          {/* RBWM */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-xl font-bold text-pink-800 mb-3">Paper 4: Retail Banking & Wealth Management (RBWM)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
              <div>
                <p className="font-semibold text-gray-900 mb-2">Module A — Retail Banking</p>
                <p>Retail Products, Home/Auto/Personal Loans, Credit & Debit Cards, Retail Deposits, NRI Banking, Priority Banking.</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-2">Module B — Retail Products & Recovery</p>
                <p>Loan Against Property, Education/Gold Loans, Microfinance, SHGs, Recovery Management, SARFAESI in Retail, DRT, Lok Adalat.</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-2">Module C — Marketing of Banking Services</p>
                <p>Market Segmentation, CRM, Digital Marketing, Cross-selling, Service Quality, Brand Management, Distribution Channels.</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-2">Module D — Wealth Management</p>
                <p>Financial Planning, Mutual Fund Types, Portfolio Management, Risk Profiling, Insurance & Retirement Planning, Tax Planning, Estate Planning.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Passing Criteria */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">JAIIB Passing Criteria & Marking Scheme</h2>
          <div className="prose prose-lg text-gray-700 leading-relaxed space-y-4">
            <p>
              To pass JAIIB, you need to meet <strong>both</strong> of the following conditions:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Individual paper pass mark:</strong> Minimum 50 out of 100 marks in each paper.</li>
              <li><strong>Aggregate condition:</strong> A combined total of at least 200 marks across all 4 papers (i.e., an average of 50 per paper).</li>
            </ul>
            <p>
              You get a maximum of <strong>2 consecutive attempts</strong> to clear all 4 papers. If you pass some papers in the first attempt, you only need to re-appear for the remaining papers in the next attempt. However, if you fail to clear all papers within 2 attempts, you must re-register and start over.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 my-6">
              <h4 className="font-bold text-blue-900 mb-2">Key Facts About JAIIB Scoring</h4>
              <ul className="list-disc pl-5 space-y-1 text-blue-800 text-sm">
                <li>No negative marking — attempt every question, even if guessing</li>
                <li>Weighted marks: Easy (0.5), Medium (1.0), Hard (2.0) — hard questions carry the most weight</li>
                <li>Online exam with randomised question order — no two candidates get the same paper</li>
                <li>Results are typically announced 4-6 weeks after the exam</li>
                <li>Certificate is issued by IIBF and carries one increment in most PSU banks</li>
              </ul>
            </div>

            <p>
              <strong>Practical implication:</strong> Since hard questions (2 marks each) constitute 50% of total marks, you cannot pass by only preparing easy topics. A strong grasp of conceptual and application-based questions is essential.
            </p>
          </div>
        </div>
      </section>

      {/* Section 4: Common Mistakes */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">7 Common Mistakes JAIIB Candidates Make</h2>
          <div className="space-y-5 text-gray-700">
            <div className="bg-white rounded-lg p-5 border border-gray-200">
              <h4 className="font-bold text-gray-900 mb-1">1. Ignoring the IIBF Macmillan textbooks</h4>
              <p className="text-sm">Most questions are sourced directly from IIBF's official textbooks. Third-party guides are useful for revision, but they cannot replace the primary source material.</p>
            </div>
            <div className="bg-white rounded-lg p-5 border border-gray-200">
              <h4 className="font-bold text-gray-900 mb-1">2. Skipping numerical questions in AFM</h4>
              <p className="text-sm">AFM Paper 3 has 25 hard questions that are almost entirely calculation-based (NPV, IRR, depreciation, ratios). These carry 2 marks each — a total of 50 marks. Skipping numericals means losing half the paper.</p>
            </div>
            <div className="bg-white rounded-lg p-5 border border-gray-200">
              <h4 className="font-bold text-gray-900 mb-1">3. Preparing only definitions and full forms</h4>
              <p className="text-sm">Easy questions (definitions) only carry 0.5 marks each. You cannot pass with just definitions. Medium and hard questions test application, exceptions, regulatory limits, and case-based reasoning.</p>
            </div>
            <div className="bg-white rounded-lg p-5 border border-gray-200">
              <h4 className="font-bold text-gray-900 mb-1">4. Not practicing under timed conditions</h4>
              <p className="text-sm">100 questions in 120 minutes means just 72 seconds per question. Without timed practice, many candidates run out of time and leave 15-20 questions unattempted.</p>
            </div>
            <div className="bg-white rounded-lg p-5 border border-gray-200">
              <h4 className="font-bold text-gray-900 mb-1">5. Studying all papers simultaneously</h4>
              <p className="text-sm">Spreading focus across all 4 papers leads to shallow understanding. It is better to master one paper at a time, then move to the next, allowing concepts to consolidate.</p>
            </div>
            <div className="bg-white rounded-lg p-5 border border-gray-200">
              <h4 className="font-bold text-gray-900 mb-1">6. Ignoring recent RBI circulars and amendments</h4>
              <p className="text-sm">IIBF regularly includes questions from the latest RBI Master Directions, PMLA amendments, and regulatory updates. Check RBI's website for circulars issued in the 6 months before your exam.</p>
            </div>
            <div className="bg-white rounded-lg p-5 border border-gray-200">
              <h4 className="font-bold text-gray-900 mb-1">7. Not attempting all questions</h4>
              <p className="text-sm">There is zero negative marking. Even an educated guess has a 25% chance of being correct. Leaving any question blank is a guaranteed loss of potential marks.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Preparation Strategy */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Proven Preparation Strategy for JAIIB 2026</h2>
          <div className="prose prose-lg text-gray-700 leading-relaxed space-y-4">
            <p>
              Most successful candidates spend <strong>8-12 weeks</strong> preparing for JAIIB while working full-time at their bank. The key is consistency — 1.5 to 2 hours daily is more effective than weekend cramming sessions.
            </p>

            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-3">Phase 1: Foundation (Weeks 1-4)</h3>
            <p>
              Focus on reading the IIBF Macmillan textbooks cover-to-cover for your first two papers (recommended order: PPB first, then IE & IFS). Take notes on key Acts, thresholds, and regulatory limits. At this stage, understanding is more important than memorisation.
            </p>

            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-3">Phase 2: Deep Dive (Weeks 5-8)</h3>
            <p>
              Complete the remaining two papers (AFM and RBWM). For AFM, spend extra time on numerical problems — practice at least 5 NPV/IRR calculations, 5 ratio analysis problems, and 5 depreciation problems daily. Use formula sheets and practice until you can solve them quickly.
            </p>

            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-3">Phase 3: Practice & Revision (Weeks 9-12)</h3>
            <p>
              This is where mock tests become critical. Attempt at least 2-3 full-length mock tests per paper under timed conditions. Analyse your results to identify weak topics. Revisit the textbook sections for topics where you score below 60%. In the final week, focus on:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Recent RBI circulars (last 6 months)</li>
              <li>Specific thresholds and limits (e.g., DICGC cover amount, priority sector targets, NPA classification timelines)</li>
              <li>Statement-based questions (I, II, III, IV — which are correct?)</li>
              <li>AFM formulas and shortcuts</li>
            </ul>

            <div className="bg-green-50 border border-green-200 rounded-lg p-5 my-6">
              <h4 className="font-bold text-green-900 mb-2">The 50-50-100 Rule</h4>
              <p className="text-green-800 text-sm">
                Experienced trainers recommend this distribution of study time: 50% on reading textbooks, 50% on solving MCQs and mock tests. Of your practice time, dedicate at least 30% specifically to hard (2-mark) questions — these decide whether you pass or fail.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: Study Timetable */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">12-Week JAIIB Study Timetable</h2>
          <p className="text-gray-700 mb-8">
            This timetable assumes 1.5-2 hours of daily study on weekdays and 3-4 hours on weekends. Adjust based on your pace — some candidates with banking experience may finish faster.
          </p>

          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900 border-b">Week</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900 border-b">Focus Area</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900 border-b">Daily Activity</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                <tr className="border-b"><td className="px-4 py-3 font-medium">1-2</td><td className="px-4 py-3">PPB — Modules A & B</td><td className="px-4 py-3">Read textbook + make notes on Acts & limits</td></tr>
                <tr className="border-b bg-gray-50"><td className="px-4 py-3 font-medium">3-4</td><td className="px-4 py-3">PPB — Modules C & D + IE&IFS Module A</td><td className="px-4 py-3">Read + attempt 20 MCQs daily on PPB</td></tr>
                <tr className="border-b"><td className="px-4 py-3 font-medium">5-6</td><td className="px-4 py-3">IE&IFS — Modules B, C, D</td><td className="px-4 py-3">Read textbook + practice conceptual MCQs</td></tr>
                <tr className="border-b bg-gray-50"><td className="px-4 py-3 font-medium">7-8</td><td className="px-4 py-3">AFM — All modules (focus on numericals)</td><td className="px-4 py-3">Formulas + 10 numerical problems daily</td></tr>
                <tr className="border-b"><td className="px-4 py-3 font-medium">9-10</td><td className="px-4 py-3">RBWM — All modules</td><td className="px-4 py-3">Read textbook + cross-reference with PPB topics</td></tr>
                <tr className="border-b bg-gray-50"><td className="px-4 py-3 font-medium">11</td><td className="px-4 py-3">Full mock tests (all 4 papers)</td><td className="px-4 py-3">1 mock test daily + analyse weak areas</td></tr>
                <tr><td className="px-4 py-3 font-medium">12</td><td className="px-4 py-3">Revision + RBI circulars</td><td className="px-4 py-3">Revise weak topics + recent amendments + formulas</td></tr>
              </tbody>
            </table>
          </div>

          <p className="text-gray-600 text-sm mt-4">
            <strong>Tip:</strong> If you only have 6 weeks, double the daily study time and combine Phases 1 and 2. The practice phase (mock tests) should never be shortened — it is the most impactful phase.
          </p>
        </div>
      </section>

      {/* Section 7: Practice with Us (subtle CTA) */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Practice JAIIB Questions Online</h2>
          <p className="text-gray-700 mb-8 max-w-2xl mx-auto">
            We offer free practice sets for all 4 JAIIB papers with 50 questions per set, instant answer checking, and AI-generated explanations that cite RBI circulars and IIBF textbook references. No time limit on practice sets — learn at your own pace.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <p className="text-2xl font-bold text-blue-700">1068</p>
              <p className="text-xs text-blue-600">IE&IFS Questions</p>
            </div>
            <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
              <p className="text-2xl font-bold text-indigo-700">760</p>
              <p className="text-xs text-indigo-600">PPB Questions</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <p className="text-2xl font-bold text-purple-700">1195</p>
              <p className="text-xs text-purple-600">AFM Questions</p>
            </div>
            <div className="bg-pink-50 rounded-lg p-4 border border-pink-200">
              <p className="text-2xl font-bold text-pink-700">635</p>
              <p className="text-xs text-pink-600">RBWM Questions</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => navigate('/register')} className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
              Start Practicing Free
            </button>
            <button onClick={() => navigate('/practice-tests')} className="px-8 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-gray-400 transition">
              Browse All Practice Tests
            </button>
          </div>
        </div>
      </section>

      {/* Section 8: FAQ */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Frequently Asked Questions About JAIIB</h2>
          <div className="space-y-4">
            <details className="bg-white rounded-lg border border-gray-200 p-5 group">
              <summary className="font-semibold text-gray-900 cursor-pointer">Who is eligible to take JAIIB?</summary>
              <p className="mt-3 text-gray-700 text-sm">Any confirmed employee of a bank (public sector, private sector, cooperative, or regional rural bank) that is a member institution of IIBF is eligible. Probationary officers and clerks can appear once they are confirmed in service.</p>
            </details>
            <details className="bg-white rounded-lg border border-gray-200 p-5 group">
              <summary className="font-semibold text-gray-900 cursor-pointer">How many attempts are allowed for JAIIB?</summary>
              <p className="mt-3 text-gray-700 text-sm">You get 2 consecutive attempts. The exam is held twice a year, so you effectively have one year to clear all 4 papers. If you fail, you must re-register and the fee is non-refundable.</p>
            </details>
            <details className="bg-white rounded-lg border border-gray-200 p-5 group">
              <summary className="font-semibold text-gray-900 cursor-pointer">What is the exam fee for JAIIB 2026?</summary>
              <p className="mt-3 text-gray-700 text-sm">The registration fee is approximately Rs. 3,540 (including GST) for all 4 papers. Individual paper re-examination fees apply if you need to re-appear for specific papers.</p>
            </details>
            <details className="bg-white rounded-lg border border-gray-200 p-5 group">
              <summary className="font-semibold text-gray-900 cursor-pointer">Is JAIIB mandatory for promotion?</summary>
              <p className="mt-3 text-gray-700 text-sm">In most public sector banks, JAIIB is mandatory for promotion from Clerk to Officer or for the first promotion as an Officer. It also carries one increment in scale. In private banks, it is encouraged but policies vary.</p>
            </details>
            <details className="bg-white rounded-lg border border-gray-200 p-5 group">
              <summary className="font-semibold text-gray-900 cursor-pointer">What is the difference between JAIIB and CAIIB?</summary>
              <p className="mt-3 text-gray-700 text-sm">JAIIB is the junior-level certification (entry level). CAIIB (Certified Associate) is the senior-level certification that can only be attempted after passing JAIIB. CAIIB has 2 compulsory papers + 1 elective and carries 2 increments in most PSU banks.</p>
            </details>
            <details className="bg-white rounded-lg border border-gray-200 p-5 group">
              <summary className="font-semibold text-gray-900 cursor-pointer">Can I pass JAIIB without coaching classes?</summary>
              <p className="mt-3 text-gray-700 text-sm">Absolutely. Most successful candidates are self-study. The IIBF textbooks + practice MCQs + mock tests are sufficient. Coaching is helpful for AFM numericals if you are weak in accounting, but not mandatory.</p>
            </details>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="text-white font-bold mb-4">About</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/about" className="hover:text-white transition">About Us</a></li>
                <li><a href="/faq" className="hover:text-white transition">FAQ</a></li>
                <li><a href="/blog" className="hover:text-white transition">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Practice</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/practice-tests" className="hover:text-white transition">Practice Tests</a></li>
                <li><a href="/practice-tests/ie-ifs" className="hover:text-white transition">IE & IFS</a></li>
                <li><a href="/practice-tests/ppb" className="hover:text-white transition">PPB</a></li>
                <li><a href="/practice-tests/afm" className="hover:text-white transition">AFM</a></li>
                <li><a href="/practice-tests/rbwm" className="hover:text-white transition">RBWM</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/privacy-policy" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="/terms-of-service" className="hover:text-white transition">Terms of Service</a></li>
                <li><a href="/disclaimer" className="hover:text-white transition">Disclaimer</a></li>
                <li><a href="/contact" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2026 MockMaster. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
