import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SEO from '../components/SEO';

interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  category: string;
  coverImage: string;
  content: React.ReactNode;
}

const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'how-to-clear-ie-ifs-first-attempt',
    title: 'How to Clear IE & IFS in the First Attempt — Complete Strategy Guide (2026)',
    description: 'A proven study plan covering all 4 modules of Indian Economy & Indian Financial System with topic-wise weightage, recommended books, and last-minute revision tips for JAIIB 2026.',
    date: '2026-05-15',
    readTime: '12 min read',
    category: 'Study Strategy',
    coverImage: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=400&fit=crop',
    content: (
      <div className="prose prose-lg max-w-none">
        <p className="lead text-xl text-gray-700 mb-8">
          IE & IFS (Indian Economy & Indian Financial System) is often considered the toughest JAIIB paper due to its vast syllabus spanning macroeconomics, monetary policy, and the entire Indian financial architecture. Here's a structured approach to clear it in your first attempt.
        </p>

        <h2>Understanding the Exam Pattern</h2>

        {/* Visual Exam Pattern Card */}
        <div className="not-prose bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 my-6">
          <h3 className="text-lg font-bold text-blue-900 mb-4">📝 IE & IFS Exam at a Glance</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <p className="text-2xl font-bold text-blue-600">100</p>
              <p className="text-xs text-gray-600">Questions</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <p className="text-2xl font-bold text-indigo-600">2 hrs</p>
              <p className="text-xs text-gray-600">Duration</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <p className="text-2xl font-bold text-green-600">50/100</p>
              <p className="text-xs text-gray-600">Pass Marks</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <p className="text-2xl font-bold text-purple-600">Zero</p>
              <p className="text-xs text-gray-600">Negative Marking</p>
            </div>
          </div>
        </div>

        <ul>
          <li><strong>Marking Scheme:</strong> 0.5 marks (Easy), 1 mark (Medium), 2 marks (Hard/Statement-based)</li>
        </ul>

        <h2>Module-Wise Weightage & Strategy</h2>

        {/* Visual Weightage Bars */}
        <div className="not-prose bg-white rounded-xl border border-gray-200 p-6 my-6 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">Module Weightage in Exam</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1"><span className="font-medium">Module A — Indian Economic Architecture</span><span className="text-blue-600 font-bold">25-30%</span></div>
              <div className="h-3 bg-gray-200 rounded-full"><div className="h-3 bg-blue-500 rounded-full" style={{width: '28%'}}></div></div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1"><span className="font-medium">Module B — Economic Concepts</span><span className="text-indigo-600 font-bold">20-25%</span></div>
              <div className="h-3 bg-gray-200 rounded-full"><div className="h-3 bg-indigo-500 rounded-full" style={{width: '22%'}}></div></div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1"><span className="font-medium">Module C — Financial Architecture</span><span className="text-purple-600 font-bold">25-30%</span></div>
              <div className="h-3 bg-gray-200 rounded-full"><div className="h-3 bg-purple-500 rounded-full" style={{width: '28%'}}></div></div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1"><span className="font-medium">Module D — Financial Products</span><span className="text-pink-600 font-bold">20-25%</span></div>
              <div className="h-3 bg-gray-200 rounded-full"><div className="h-3 bg-pink-500 rounded-full" style={{width: '22%'}}></div></div>
            </div>
          </div>
        </div>

        <h3>Module A — Indian Economic Architecture (25-30%)</h3>
        <p>
          This module covers GDP, national income, economic planning, and sectoral analysis. Focus on current data points — GDP growth rate, sectoral contribution percentages, and recent budget highlights.
        </p>
        <p><strong>Key Topics:</strong> GDP calculation methods, Five Year Plans evolution, Agriculture's share in GDP, Make in India impact, Union Budget 2025-26 highlights, inflation indices (CPI vs WPI).</p>
        <p><strong>Pro Tip:</strong> IIBF loves asking about specific percentages and thresholds. Memorize the latest Economic Survey data.</p>

        <h3>Module B — Economic Concepts Related to Banking (20-25%)</h3>
        <p>
          RBI's monetary policy tools are heavily tested. Understand the difference between CRR, SLR, Repo Rate, and how they affect money supply.
        </p>
        <p><strong>Key Topics:</strong> Money multiplier, credit creation process, RBI's functions (Section 21, 22 of RBI Act), LAF/MSF/SDF rates, forex reserves management, BoP components.</p>
        <p><strong>Pro Tip:</strong> Know the current rates — Repo, Reverse Repo, CRR, SLR, MSF, Bank Rate. These are guaranteed questions.</p>

        {/* Visual Rate Card */}
        <div className="not-prose bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200 my-6">
          <h4 className="text-sm font-bold text-green-800 mb-3">📌 Current RBI Policy Rates (Memorize These!)</h4>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            <div className="bg-white rounded-lg p-3 text-center shadow-sm border border-green-100">
              <p className="text-lg font-bold text-green-700">6.5%</p>
              <p className="text-xs text-gray-600">Repo Rate</p>
            </div>
            <div className="bg-white rounded-lg p-3 text-center shadow-sm border border-green-100">
              <p className="text-lg font-bold text-green-700">3.35%</p>
              <p className="text-xs text-gray-600">Rev. Repo</p>
            </div>
            <div className="bg-white rounded-lg p-3 text-center shadow-sm border border-green-100">
              <p className="text-lg font-bold text-green-700">4.5%</p>
              <p className="text-xs text-gray-600">CRR</p>
            </div>
            <div className="bg-white rounded-lg p-3 text-center shadow-sm border border-green-100">
              <p className="text-lg font-bold text-green-700">18%</p>
              <p className="text-xs text-gray-600">SLR</p>
            </div>
            <div className="bg-white rounded-lg p-3 text-center shadow-sm border border-green-100">
              <p className="text-lg font-bold text-green-700">6.75%</p>
              <p className="text-xs text-gray-600">MSF</p>
            </div>
            <div className="bg-white rounded-lg p-3 text-center shadow-sm border border-green-100">
              <p className="text-lg font-bold text-green-700">6.75%</p>
              <p className="text-xs text-gray-600">Bank Rate</p>
            </div>
          </div>
          <p className="text-xs text-green-700 mt-3 italic">* Rates as of latest RBI Monetary Policy Committee meeting. Verify before exam.</p>
        </div>

        <h3>Module C — Indian Financial Architecture (25-30%)</h3>
        <p>
          This is the most scoring module if you know the Acts well. Banking Regulation Act 1949 and RBI Act 1934 are the backbone.
        </p>
        <p><strong>Key Topics:</strong> BR Act sections (5, 6, 10, 11, 12, 21, 22, 35A, 36), SEBI regulations, IRDAI structure, PFRDA and NPS, money market instruments (T-Bills, CP, CD, Repo).</p>
        <p><strong>Pro Tip:</strong> Make a table of all regulators and their jurisdiction — SEBI (securities), IRDAI (insurance), PFRDA (pensions), NABARD (rural), SIDBI (MSME).</p>

        <h3>Module D — Financial Products and Services (20-25%)</h3>
        <p>
          Practical banking knowledge — retail products, digital payments, and financial inclusion schemes.
        </p>
        <p><strong>Key Topics:</strong> PMJDY, PMSBY, PMJJBY, APY, UPI architecture, NEFT/RTGS settlement times, priority sector lending norms (40% target), credit rating agencies (CRISIL, ICRA, CARE).</p>
        <p><strong>Pro Tip:</strong> Digital banking questions are increasing every year. Know UPI transaction limits, NEFT timings (24x7 since Dec 2019), and recent RBI digital lending guidelines.</p>

        <h2>Recommended Study Resources</h2>
        <ol>
          <li><strong>IIBF Official Textbook</strong> — "Indian Economy & Indian Financial System" (Macmillan, latest edition)</li>
          <li><strong>RBI Annual Report 2024-25</strong> — For latest data and policy changes</li>
          <li><strong>Economic Survey 2025-26</strong> — Chapter summaries for Module A</li>
          <li><strong>RBI Master Circulars</strong> — Especially on monetary policy and payment systems</li>
        </ol>

        <h2>30-Day Study Plan</h2>

        {/* Visual Study Plan */}
        <div className="not-prose my-6">
          <div className="space-y-4">
            <div className="flex items-start gap-4 bg-blue-50 rounded-xl p-5 border border-blue-200">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">W1</span>
              </div>
              <div>
                <h4 className="font-bold text-blue-900">Week 1 — Foundation</h4>
                <p className="text-sm text-blue-800">Module A + Module B (Theory) • 2-3 hours/day</p>
                <p className="text-xs text-blue-600 mt-1">Focus: GDP concepts, monetary policy basics, RBI functions</p>
              </div>
            </div>
            <div className="flex items-start gap-4 bg-indigo-50 rounded-xl p-5 border border-indigo-200">
              <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">W2</span>
              </div>
              <div>
                <h4 className="font-bold text-indigo-900">Week 2 — Acts & Regulators</h4>
                <p className="text-sm text-indigo-800">Module C (Acts & Regulators) • 2-3 hours/day</p>
                <p className="text-xs text-indigo-600 mt-1">Focus: BR Act sections, SEBI, IRDAI, financial markets</p>
              </div>
            </div>
            <div className="flex items-start gap-4 bg-purple-50 rounded-xl p-5 border border-purple-200">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">W3</span>
              </div>
              <div>
                <h4 className="font-bold text-purple-900">Week 3 — Products & Practice</h4>
                <p className="text-sm text-purple-800">Module D + Practice Questions • 3 hours/day</p>
                <p className="text-xs text-purple-600 mt-1">Focus: Digital banking, UPI, insurance, mutual funds + MCQ practice</p>
              </div>
            </div>
            <div className="flex items-start gap-4 bg-green-50 rounded-xl p-5 border border-green-200">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">W4</span>
              </div>
              <div>
                <h4 className="font-bold text-green-900">Week 4 — Mock Tests & Revision</h4>
                <p className="text-sm text-green-800">Full Mock Tests + Revision • 3-4 hours/day</p>
                <p className="text-xs text-green-600 mt-1">Focus: 2-3 full mock tests, revise weak areas, memorize rates & thresholds</p>
              </div>
            </div>
          </div>
        </div>

        <h2>Common Mistakes to Avoid</h2>
        <ol>
          <li><strong>Ignoring current affairs:</strong> 15-20% questions are based on recent RBI circulars and budget announcements</li>
          <li><strong>Skipping Module D:</strong> It's the easiest to score — don't leave marks on the table</li>
          <li><strong>Not practicing MCQs:</strong> Reading alone won't help — you need to practice statement-based questions</li>
          <li><strong>Confusing similar concepts:</strong> CRR vs SLR, Repo vs Reverse Repo, Capital Account vs Current Account</li>
        </ol>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
          <h3 className="text-blue-900 mt-0">Start Practicing Now</h3>
          <p className="text-blue-800 mb-0">
            Our AI-powered platform has 250+ IE & IFS questions with detailed explanations citing specific RBI circulars and IIBF textbook references. Track your module-wise performance and focus on weak areas.
          </p>
        </div>
      </div>
    ),
  },
  {
    slug: 'important-rbi-circulars-ppb-2026',
    title: 'Important RBI Circulars for PPB 2026 — Must-Know Updates for JAIIB',
    description: 'Complete list of RBI Master Circulars and Directions relevant to Principles & Practices of Banking (PPB) paper for JAIIB 2026 exam, with key provisions explained.',
    date: '2026-05-10',
    readTime: '10 min read',
    category: 'RBI Updates',
    coverImage: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&h=400&fit=crop',
    content: (
      <div className="prose prose-lg max-w-none">
        <p className="lead text-xl text-gray-700 mb-8">
          IIBF regularly tests candidates on the latest RBI circulars in the PPB paper. Here are the most important Master Circulars and Directions you must know for JAIIB 2026.
        </p>

        <h2>1. KYC Master Direction (Updated 2025)</h2>
        <p><strong>Circular:</strong> RBI/DoR/AML-KYC/2025-26/01</p>
        <ul>
          <li>Video-based Customer Identification Process (V-CIP) norms</li>
          <li>Aadhaar-based e-KYC for accounts up to ₹1 lakh balance</li>
          <li>Periodic KYC update timelines: High risk (2 years), Medium (8 years), Low (10 years)</li>
          <li>Central KYC Registry (CKYC) mandatory for all new accounts</li>
          <li>Beneficial ownership threshold: 10% for companies, 15% for partnerships</li>
        </ul>

        <h2>2. Digital Lending Guidelines (Sep 2022, Updated 2024)</h2>
        <p><strong>Circular:</strong> RBI/2022-23/111 DOR.CRE.REC.66/21.07.001/2022-23</p>
        <ul>
          <li>All loan disbursals and repayments directly to/from borrower's bank account</li>
          <li>Lending Service Providers (LSPs) cannot access borrower's mobile data</li>
          <li>Cooling-off period mandatory for all digital loans</li>
          <li>Key Fact Statement (KFS) must be provided before loan agreement</li>
          <li>Annual Percentage Rate (APR) disclosure mandatory</li>
        </ul>

        <h2>3. Customer Service & Grievance Redressal</h2>
        <p><strong>Circular:</strong> RBI Integrated Ombudsman Scheme 2021 (Updated 2024)</p>
        <ul>
          <li>Single point of reference for all banking complaints</li>
          <li>Complaint must be filed within 1 year of the cause of action</li>
          <li>Bank must resolve within 30 days, else escalate to Ombudsman</li>
          <li>Compensation up to ₹20 lakh for deficiency in service</li>
          <li>No cost to the complainant — completely free process</li>
        </ul>

        <h2>4. Priority Sector Lending (PSL) Norms</h2>
        <p><strong>Circular:</strong> RBI Master Direction on PSL (Updated April 2025)</p>
        <ul>
          <li>Overall PSL target: 40% of ANBC (Adjusted Net Bank Credit)</li>
          <li>Agriculture: 18% (of which 10% to Small & Marginal Farmers)</li>
          <li>Micro Enterprises: 7.5% of ANBC</li>
          <li>Weaker Sections: 12% of ANBC</li>
          <li>Housing loans up to ₹35 lakh (metro) / ₹25 lakh (non-metro) qualify</li>
          <li>Education loans up to ₹20 lakh qualify as PSL</li>
        </ul>

        <h2>5. NEFT/RTGS/UPI Updates</h2>
        <p><strong>Key Changes for 2025-26:</strong></p>
        <ul>
          <li>NEFT: 24x7x365 availability, no charges for savings account holders</li>
          <li>RTGS: Minimum ₹2 lakh, available 24x7 since Dec 2020</li>
          <li>UPI: Transaction limit ₹1 lakh (₹2 lakh for verified merchants, ₹5 lakh for capital markets)</li>
          <li>UPI Lite: Offline payments up to ₹500 per transaction, ₹2,000 wallet limit</li>
          <li>e-Rupee (CBDC): Retail pilot expanded to all major banks</li>
        </ul>

        <h2>6. NPA Classification & IRAC Norms</h2>
        <p><strong>Circular:</strong> Master Circular on IRAC Norms (DOR.STR.REC.55/21.04.048/2023-24)</p>
        <ul>
          <li>SMA-0: Principal/interest overdue 1-30 days</li>
          <li>SMA-1: Overdue 31-60 days</li>
          <li>SMA-2: Overdue 61-90 days</li>
          <li>NPA: Overdue &gt; 90 days</li>
          <li>Doubtful: NPA for &gt; 12 months</li>
          <li>Loss: Identified by bank/auditor/RBI as unrecoverable</li>
        </ul>

        <h2>7. Anti-Money Laundering (PMLA 2002)</h2>
        <p><strong>Key Provisions for PPB:</strong></p>
        <ul>
          <li>Cash Transaction Report (CTR): All cash transactions &gt; ₹10 lakh in a month</li>
          <li>Suspicious Transaction Report (STR): Within 7 days of detection</li>
          <li>Record keeping: Minimum 5 years after account closure</li>
          <li>Principal Officer appointment mandatory for all banks</li>
          <li>Wire transfer rules: Originator info mandatory for transfers &gt; ₹50,000</li>
        </ul>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
          <h3 className="text-blue-900 mt-0">Practice PPB Questions with RBI References</h3>
          <p className="text-blue-800 mb-0">
            Our AI explains every PPB answer with specific circular numbers and section references. Practice 250+ questions and see exactly which RBI Master Direction each answer comes from.
          </p>
        </div>
      </div>
    ),
  },
  {
    slug: 'jaiib-updated-syllabus-passing-criteria-2026',
    title: 'JAIIB 2026 Updated Syllabus & Passing Criteria — Complete Guide',
    description: 'Everything you need to know about the revised JAIIB syllabus effective 2025-26, including paper-wise topics, passing marks, exam pattern, and important changes from the previous format.',
    date: '2026-05-05',
    readTime: '8 min read',
    category: 'Exam Info',
    coverImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=400&fit=crop',
    content: (
      <div className="prose prose-lg max-w-none">
        <p className="lead text-xl text-gray-700 mb-8">
          IIBF revised the JAIIB syllabus in 2023 with significant changes to paper names and content. Here's the complete updated guide for candidates appearing in 2026.
        </p>

        <h2>JAIIB 2026 — Exam Overview</h2>
        <table className="w-full">
          <tbody>
            <tr><td><strong>Conducting Body</strong></td><td>Indian Institute of Banking & Finance (IIBF)</td></tr>
            <tr><td><strong>Full Form</strong></td><td>Junior Associate of Indian Institute of Bankers</td></tr>
            <tr><td><strong>Number of Papers</strong></td><td>4 (all compulsory)</td></tr>
            <tr><td><strong>Exam Mode</strong></td><td>Online (Computer-based)</td></tr>
            <tr><td><strong>Exam Frequency</strong></td><td>Twice a year (May/June & Nov/Dec)</td></tr>
            <tr><td><strong>Validity</strong></td><td>Must pass all 4 papers within 2 years of registration</td></tr>
            <tr><td><strong>Eligibility</strong></td><td>Bank employees who are IIBF members</td></tr>
          </tbody>
        </table>

        <h2>Updated Paper Structure (2025-26)</h2>

        <h3>Paper 1: Indian Economy & Indian Financial System (IE & IFS)</h3>
        <ul>
          <li>Module A: Indian Economic Architecture (Indian Economy, GDP, Planning, Sectors)</li>
          <li>Module B: Economic Concepts Related to Banking (Monetary Policy, RBI, Forex)</li>
          <li>Module C: Indian Financial Architecture (BR Act, SEBI, IRDAI, Financial Markets)</li>
          <li>Module D: Financial Products & Services (Retail Banking, Digital Payments, Insurance)</li>
        </ul>

        <h3>Paper 2: Principles & Practices of Banking (PPB)</h3>
        <ul>
          <li>Module A: General Banking Operations (Accounts, KYC, NI Act, Cheques)</li>
          <li>Module B: Functions of Banks (Loans, NPA, SARFAESI, Credit Appraisal)</li>
          <li>Module C: Banking Technology (CBS, Internet Banking, UPI, Cyber Security)</li>
          <li>Module D: Ethics in Banking (Ombudsman, AML, Corporate Governance)</li>
        </ul>

        <h3>Paper 3: Accounting & Financial Management for Bankers (AFM)</h3>
        <p className="text-sm text-gray-600 italic">Note: Previously called AFB (Accounting & Finance for Bankers). Renamed under revised syllabus.</p>
        <ul>
          <li>Module A: Accounting Principles & Processes (Double Entry, Depreciation, BRS)</li>
          <li>Module B: Financial Statements & Core Banking (P&L, Balance Sheet, Ratios)</li>
          <li>Module C: Financial Management (TVM, NPV, IRR, Capital Budgeting, CAPM)</li>
          <li>Module D: Taxation & Costing (Income Tax, GST, Marginal Costing, BEP)</li>
        </ul>

        <h3>Paper 4: Retail Banking & Wealth Management (RBWM)</h3>
        <ul>
          <li>Module A: Retail Banking (Home Loans, Auto Loans, Credit Cards, NRI Banking)</li>
          <li>Module B: Retail Products & Recovery (Education Loans, Gold Loans, DRT, SARFAESI)</li>
          <li>Module C: Marketing of Banking Services (CRM, Segmentation, Digital Marketing)</li>
          <li>Module D: Wealth Management (Financial Planning, Mutual Funds, Insurance, Tax Planning)</li>
        </ul>

        <h2>Passing Criteria</h2>
        <table className="w-full">
          <thead>
            <tr><th>Criteria</th><th>Requirement</th></tr>
          </thead>
          <tbody>
            <tr><td>Minimum per paper</td><td>45 out of 100</td></tr>
            <tr><td>Aggregate (all 4 papers)</td><td>50% (200 out of 400)</td></tr>
            <tr><td>Negative marking</td><td>None</td></tr>
            <tr><td>Grace marks</td><td>Not applicable</td></tr>
          </tbody>
        </table>

        <h2>Exam Pattern & Marking Scheme</h2>
        <table className="w-full">
          <thead>
            <tr><th>Difficulty</th><th>Marks</th><th>Approx. Questions</th><th>Question Style</th></tr>
          </thead>
          <tbody>
            <tr><td>Easy</td><td>0.5 marks</td><td>~20</td><td>Direct definitions, basic facts</td></tr>
            <tr><td>Medium</td><td>1 mark</td><td>~40</td><td>Application, comparisons, scenarios</td></tr>
            <tr><td>Hard</td><td>2 marks</td><td>~40</td><td>Statement-based (I, II, III, IV format)</td></tr>
          </tbody>
        </table>
        <p><strong>Total:</strong> 100 questions = 100 marks | <strong>Duration:</strong> 2 hours per paper</p>

        <h2>Key Changes from Previous Syllabus</h2>
        <ol>
          <li><strong>Paper 3 renamed:</strong> AFB → AFM (Accounting & Financial Management for Bankers)</li>
          <li><strong>Paper 4 added:</strong> RBWM is a new compulsory paper (previously only 3 papers)</li>
          <li><strong>More practical focus:</strong> Digital banking, UPI, fintech topics added across papers</li>
          <li><strong>Statement-based questions:</strong> 40% of marks now come from hard questions requiring analysis of multiple statements</li>
          <li><strong>Current affairs integration:</strong> Recent RBI circulars and policy changes are tested</li>
        </ol>

        <h2>Important Dates for 2026</h2>
        <table className="w-full">
          <thead>
            <tr><th>Event</th><th>Tentative Date</th></tr>
          </thead>
          <tbody>
            <tr><td>Registration Opens</td><td>January 2026</td></tr>
            <tr><td>Exam Window 1</td><td>May-June 2026</td></tr>
            <tr><td>Exam Window 2</td><td>November-December 2026</td></tr>
            <tr><td>Results</td><td>4-6 weeks after exam</td></tr>
          </tbody>
        </table>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
          <h3 className="text-blue-900 mt-0">Start Your JAIIB Preparation</h3>
          <p className="text-blue-800 mb-0">
            Practice with 1000+ questions aligned to the 2026 syllabus. Our AI tracks your module-wise performance and recommends exactly which topics to focus on next.
          </p>
        </div>
      </div>
    ),
  },
];


// Blog listing page
const BlogListPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="JAIIB & CAIIB Preparation Blog — Study Tips, RBI Updates, Syllabus Guide"
        description="Expert JAIIB preparation tips, RBI circular summaries, syllabus updates, and study strategies. Free guides to help you clear banking exams in first attempt."
        canonical="https://mockmaster.fun/blog"
        keywords="JAIIB preparation tips, JAIIB study strategy, RBI circulars for JAIIB, JAIIB syllabus 2026, how to clear JAIIB"
      />
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">JC</span>
            </div>
            <span className="text-xl font-bold text-gray-900">JAIIB-CAIIB Prep</span>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-2 text-gray-700 font-medium hover:text-gray-900 transition"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/register')}
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
            >
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      {/* Blog Header */}
      <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            JAIIB & CAIIB Preparation Blog
          </h1>
          <p className="text-xl text-gray-600">
            Expert study strategies, syllabus updates, and RBI circular summaries to help you clear your banking exams
          </p>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            {BLOG_POSTS.map((post) => (
              <article
                key={post.slug}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition cursor-pointer group"
                onClick={() => navigate(`/blog/${post.slug}`)}
              >
                {/* Cover Image */}
                <div className="h-48 overflow-hidden">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                      {post.category}
                    </span>
                    <span className="text-sm text-gray-500">{post.date}</span>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-500">{post.readTime}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 leading-relaxed">{post.description}</p>
                  <span className="inline-block mt-4 text-blue-600 font-medium text-sm group-hover:translate-x-1 transition-transform">
                    Read more →
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Practicing?</h2>
          <p className="text-blue-100 mb-8">
            Put these strategies into action with 1000+ AI-powered practice questions
          </p>
          <button
            onClick={() => navigate('/register')}
            className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition"
          >
            Start Free Trial
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center text-sm">
          <p>&copy; 2024 JAIIB-CAIIB Prep. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

// Individual blog post page
const BlogPostPage: React.FC = () => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();

  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Post Not Found</h1>
          <button
            onClick={() => navigate('/blog')}
            className="text-blue-600 font-medium hover:underline"
          >
            ← Back to Blog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title={post.title}
        description={post.description}
        canonical={`https://mockmaster.fun/blog/${post.slug}`}
        type="article"
        keywords={`JAIIB 2026, ${post.category}, ${post.title.split(' ').slice(0, 5).join(' ')}`}
      />
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">JC</span>
            </div>
            <span className="text-xl font-bold text-gray-900">JAIIB-CAIIB Prep</span>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/blog')}
              className="px-6 py-2 text-gray-700 font-medium hover:text-gray-900 transition"
            >
              Blog
            </button>
            <button
              onClick={() => navigate('/register')}
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
            >
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      {/* Article */}
      <article className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => navigate('/blog')}
            className="text-blue-600 font-medium text-sm mb-6 hover:underline inline-block"
          >
            ← Back to Blog
          </button>

          {/* Cover Image */}
          <div className="rounded-xl overflow-hidden mb-8 shadow-lg">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-64 object-cover"
            />
          </div>

          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
              {post.category}
            </span>
            <span className="text-sm text-gray-500">{post.date}</span>
            <span className="text-sm text-gray-500">•</span>
            <span className="text-sm text-gray-500">{post.readTime}</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>

          <p className="text-lg text-gray-600 mb-8 border-l-4 border-blue-500 pl-4">
            {post.description}
          </p>

          {post.content}

          {/* Author & CTA */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Start Practicing Today</h3>
              <p className="text-gray-700 mb-4">
                Turn this knowledge into exam-ready confidence. Practice with AI-powered questions that cite specific RBI circulars and IIBF textbook references.
              </p>
              <button
                onClick={() => navigate('/register')}
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
              >
                Start Free Trial →
              </button>
            </div>
          </div>
        </div>
      </article>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center text-sm">
          <p>&copy; 2024 JAIIB-CAIIB Prep. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

// Router component that handles both /blog and /blog/:slug
const BlogPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  if (slug) {
    return <BlogPostPage />;
  }
  return <BlogListPage />;
};

export default BlogPage;
