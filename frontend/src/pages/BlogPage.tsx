import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SEO from '../components/SEO';
import ADDITIONAL_BLOG_POSTS from './blog-posts-additional';

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
  {
    slug: 'jaiib-afm-formulas-list-2026',
    title: 'JAIIB AFM All Formulas List 2026 — Must-Know for Exam Day',
    description: 'Complete list of important AFM formulas for JAIIB 2026: NPV, IRR, EMI, depreciation, ratios, break-even, TVM, and more. Organized module-wise for quick revision.',
    date: '2026-05-20',
    readTime: '15 min read',
    category: 'Quick Revision',
    coverImage: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=800&h=400&fit=crop',
    content: (
      <div className="prose prose-lg max-w-none">
        <p className="lead text-xl text-gray-700 mb-8">
          AFM (Accounting & Financial Management for Bankers) is the most formula-heavy JAIIB paper. Around 30-40% of questions involve calculations. Here's every formula you need, organized by module.
        </p>

        <h2>Module A — Accounting Principles</h2>

        <div className="not-prose bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 my-6">
          <h3 className="text-lg font-bold text-blue-900 mb-4">📐 Depreciation Formulas</h3>
          <div className="space-y-4 text-sm">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="font-bold text-gray-900">Straight Line Method (SLM)</p>
              <p className="text-gray-700 mt-1">Depreciation = (Cost - Residual Value) ÷ Useful Life</p>
              <p className="text-gray-500 text-xs mt-1">Rate = (1 ÷ Useful Life) × 100</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="font-bold text-gray-900">Written Down Value (WDV)</p>
              <p className="text-gray-700 mt-1">Depreciation = Book Value at beginning × Rate%</p>
              <p className="text-gray-500 text-xs mt-1">Rate = 1 - (Residual Value / Cost)^(1/n) × 100</p>
            </div>
          </div>
        </div>

        <div className="not-prose bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200 my-6">
          <h3 className="text-lg font-bold text-green-900 mb-4">📊 Bank Reconciliation Statement (BRS)</h3>
          <div className="bg-white rounded-lg p-4 shadow-sm text-sm">
            <p className="font-bold text-gray-900">Adjusted Bank Balance</p>
            <p className="text-gray-700 mt-1">= Balance as per Bank Statement</p>
            <p className="text-gray-700">+ Cheques issued but not yet presented</p>
            <p className="text-gray-700">- Cheques deposited but not yet cleared</p>
            <p className="text-gray-700">± Direct credits/debits by bank</p>
          </div>
        </div>

        <h2>Module B — Financial Statements & Ratios</h2>

        <div className="not-prose bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200 my-6">
          <h3 className="text-lg font-bold text-purple-900 mb-4">📈 Key Ratios (Most Tested)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <p className="font-semibold text-gray-900">Current Ratio</p>
              <p className="text-gray-600">= Current Assets ÷ Current Liabilities</p>
              <p className="text-green-700 text-xs mt-1">Ideal: 2:1</p>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <p className="font-semibold text-gray-900">Quick/Acid Test Ratio</p>
              <p className="text-gray-600">= (CA - Inventory - Prepaid) ÷ CL</p>
              <p className="text-green-700 text-xs mt-1">Ideal: 1:1</p>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <p className="font-semibold text-gray-900">Debt-Equity Ratio</p>
              <p className="text-gray-600">= Total Debt ÷ Shareholders' Equity</p>
              <p className="text-green-700 text-xs mt-1">Ideal: 2:1 or lower</p>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <p className="font-semibold text-gray-900">Return on Equity (ROE)</p>
              <p className="text-gray-600">= Net Profit ÷ Shareholders' Equity × 100</p>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <p className="font-semibold text-gray-900">Net Profit Margin</p>
              <p className="text-gray-600">= Net Profit ÷ Revenue × 100</p>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <p className="font-semibold text-gray-900">Gross Profit Margin</p>
              <p className="text-gray-600">= (Revenue - COGS) ÷ Revenue × 100</p>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <p className="font-semibold text-gray-900">Inventory Turnover</p>
              <p className="text-gray-600">= COGS ÷ Average Inventory</p>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <p className="font-semibold text-gray-900">Debtors Turnover</p>
              <p className="text-gray-600">= Credit Sales ÷ Average Debtors</p>
            </div>
          </div>
        </div>

        <h2>Module C — Financial Management (TVM & Capital Budgeting)</h2>

        <div className="not-prose bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-200 my-6">
          <h3 className="text-lg font-bold text-orange-900 mb-4">⏰ Time Value of Money</h3>
          <div className="space-y-3 text-sm">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="font-bold text-gray-900">Future Value (Compound Interest)</p>
              <p className="text-gray-700 mt-1">FV = PV × (1 + r)ⁿ</p>
              <p className="text-gray-500 text-xs mt-1">PV = Present Value, r = rate per period, n = number of periods</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="font-bold text-gray-900">Present Value</p>
              <p className="text-gray-700 mt-1">PV = FV ÷ (1 + r)ⁿ</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="font-bold text-gray-900">EMI Formula</p>
              <p className="text-gray-700 mt-1">EMI = P × r × (1+r)ⁿ ÷ [(1+r)ⁿ - 1]</p>
              <p className="text-gray-500 text-xs mt-1">P = Principal, r = monthly rate, n = total months</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="font-bold text-gray-900">Rule of 72 (Quick Doubling Time)</p>
              <p className="text-gray-700 mt-1">Doubling Time ≈ 72 ÷ Interest Rate%</p>
              <p className="text-gray-500 text-xs mt-1">Example: At 8% → money doubles in ~9 years</p>
            </div>
          </div>
        </div>

        <div className="not-prose bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-200 my-6">
          <h3 className="text-lg font-bold text-indigo-900 mb-4">💰 Capital Budgeting</h3>
          <div className="space-y-3 text-sm">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="font-bold text-gray-900">Net Present Value (NPV)</p>
              <p className="text-gray-700 mt-1">NPV = Σ [Cash Flow_t ÷ (1+r)^t] - Initial Investment</p>
              <p className="text-green-700 text-xs mt-1">Accept if NPV &gt; 0</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="font-bold text-gray-900">Internal Rate of Return (IRR)</p>
              <p className="text-gray-700 mt-1">Rate at which NPV = 0</p>
              <p className="text-green-700 text-xs mt-1">Accept if IRR &gt; Cost of Capital</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="font-bold text-gray-900">Payback Period</p>
              <p className="text-gray-700 mt-1">= Initial Investment ÷ Annual Cash Inflow</p>
              <p className="text-gray-500 text-xs mt-1">(For uneven flows: cumulative method)</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="font-bold text-gray-900">Profitability Index (PI)</p>
              <p className="text-gray-700 mt-1">PI = PV of future cash flows ÷ Initial Investment</p>
              <p className="text-green-700 text-xs mt-1">Accept if PI &gt; 1</p>
            </div>
          </div>
        </div>

        <h2>Module D — Taxation & Costing</h2>

        <div className="not-prose bg-gradient-to-r from-red-50 to-rose-50 rounded-xl p-6 border border-red-200 my-6">
          <h3 className="text-lg font-bold text-red-900 mb-4">🧮 Break-Even & Costing</h3>
          <div className="space-y-3 text-sm">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="font-bold text-gray-900">Break-Even Point (Units)</p>
              <p className="text-gray-700 mt-1">BEP = Fixed Costs ÷ (Selling Price - Variable Cost per unit)</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="font-bold text-gray-900">Break-Even Point (Sales ₹)</p>
              <p className="text-gray-700 mt-1">BEP = Fixed Costs ÷ Contribution Margin Ratio</p>
              <p className="text-gray-500 text-xs mt-1">CM Ratio = (SP - VC) ÷ SP</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="font-bold text-gray-900">Margin of Safety</p>
              <p className="text-gray-700 mt-1">= Actual Sales - Break-Even Sales</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="font-bold text-gray-900">P/V Ratio (Profit Volume Ratio)</p>
              <p className="text-gray-700 mt-1">= Contribution ÷ Sales × 100</p>
            </div>
          </div>
        </div>

        <h2>Exam Tips for AFM Calculations</h2>
        <ol>
          <li><strong>Learn the formula + one solved example</strong> — IIBF tests application, not just memorization</li>
          <li><strong>Focus on NPV & ratio questions</strong> — they appear in every exam (5-8 questions guaranteed)</li>
          <li><strong>Use the Rule of 72</strong> for quick approximations on TVM questions</li>
          <li><strong>BEP questions are scoring</strong> — straightforward calculations if you know the formula</li>
          <li><strong>Practice on calculator</strong> — the exam allows a basic on-screen calculator</li>
        </ol>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
          <h3 className="text-blue-900 mt-0">Practice AFM Calculations</h3>
          <p className="text-blue-800 mb-0">
            Our platform has 1195+ AFM questions including numerical problems. Each wrong answer gets a step-by-step AI explanation showing the exact formula and calculation.
          </p>
        </div>
      </div>
    ),
  },
  {
    slug: 'jaiib-vs-caiib-difference-salary-benefits',
    title: 'JAIIB vs CAIIB — Key Differences, Salary Increment & Career Benefits (2026)',
    description: 'Complete comparison of JAIIB and CAIIB certifications: eligibility, syllabus, difficulty, salary increments, promotion benefits, and which one to attempt first.',
    date: '2026-05-18',
    readTime: '10 min read',
    category: 'Career Guide',
    coverImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&h=400&fit=crop',
    content: (
      <div className="prose prose-lg max-w-none">
        <p className="lead text-xl text-gray-700 mb-8">
          Every bank officer asks: should I do JAIIB first or jump to CAIIB? What's the actual salary benefit? Here's a comprehensive comparison to help you plan your certification path.
        </p>

        <h2>Quick Comparison Table</h2>

        <div className="not-prose my-6 overflow-x-auto">
          <table className="w-full text-sm border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <th className="border border-gray-300 p-3 text-left">Parameter</th>
                <th className="border border-gray-300 p-3 text-left">JAIIB</th>
                <th className="border border-gray-300 p-3 text-left">CAIIB</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white"><td className="border border-gray-300 p-3 font-medium">Full Form</td><td className="border border-gray-300 p-3">Junior Associate of Indian Institute of Bankers</td><td className="border border-gray-300 p-3">Certified Associate of Indian Institute of Bankers</td></tr>
              <tr className="bg-gray-50"><td className="border border-gray-300 p-3 font-medium">Papers</td><td className="border border-gray-300 p-3">4 compulsory</td><td className="border border-gray-300 p-3">4 compulsory + 1 elective</td></tr>
              <tr className="bg-white"><td className="border border-gray-300 p-3 font-medium">Prerequisite</td><td className="border border-gray-300 p-3">None (bank employee + IIBF member)</td><td className="border border-gray-300 p-3">Must clear JAIIB first</td></tr>
              <tr className="bg-gray-50"><td className="border border-gray-300 p-3 font-medium">Difficulty</td><td className="border border-gray-300 p-3">Moderate</td><td className="border border-gray-300 p-3">Advanced</td></tr>
              <tr className="bg-white"><td className="border border-gray-300 p-3 font-medium">Salary Increment</td><td className="border border-gray-300 p-3">1 increment (~₹1,500-2,500/month)</td><td className="border border-gray-300 p-3">1 additional increment (~₹1,500-2,500/month)</td></tr>
              <tr className="bg-gray-50"><td className="border border-gray-300 p-3 font-medium">Pass Rate</td><td className="border border-gray-300 p-3">~30-40%</td><td className="border border-gray-300 p-3">~20-30%</td></tr>
              <tr className="bg-white"><td className="border border-gray-300 p-3 font-medium">Validity</td><td className="border border-gray-300 p-3">2 years to pass all papers</td><td className="border border-gray-300 p-3">2 years to pass all papers</td></tr>
              <tr className="bg-gray-50"><td className="border border-gray-300 p-3 font-medium">Promotion Impact</td><td className="border border-gray-300 p-3">Helpful for Scale I → II</td><td className="border border-gray-300 p-3">Essential for Scale II → III+</td></tr>
            </tbody>
          </table>
        </div>

        <h2>Salary Increment Details</h2>

        <div className="not-prose bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200 my-6">
          <h3 className="text-lg font-bold text-green-900 mb-4">💰 Financial Benefits</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-5 shadow-sm border border-green-100">
              <p className="text-sm text-green-600 font-semibold uppercase">After JAIIB</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">1 Increment</p>
              <p className="text-gray-600 text-sm mt-2">Approx. ₹1,500 - ₹2,500/month depending on bank and scale</p>
              <p className="text-green-700 text-sm mt-1 font-medium">= ₹18,000 - ₹30,000/year extra</p>
            </div>
            <div className="bg-white rounded-lg p-5 shadow-sm border border-green-100">
              <p className="text-sm text-green-600 font-semibold uppercase">After CAIIB (additional)</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">1 More Increment</p>
              <p className="text-gray-600 text-sm mt-2">Cumulative benefit of JAIIB + CAIIB = 2 increments</p>
              <p className="text-green-700 text-sm mt-1 font-medium">= ₹36,000 - ₹60,000/year extra (combined)</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-4 italic">Note: Exact increment value varies by bank (SBI, PNB, BOB, etc.) and officer scale. The increment is permanent and compounds over your career.</p>
        </div>

        <h2>Career & Promotion Benefits</h2>
        <ul>
          <li><strong>JAIIB holders:</strong> Get preference in promotion interviews from Scale I to Scale II</li>
          <li><strong>CAIIB holders:</strong> Almost mandatory for promotion beyond Scale III in most PSU banks</li>
          <li><strong>Seniority advantage:</strong> JAIIB/CAIIB passers often get posted to specialized departments (forex, treasury, credit) which have better career trajectories</li>
          <li><strong>Knowledge edge:</strong> The content directly helps in daily banking operations, especially NPA management, credit appraisal, and regulatory compliance</li>
        </ul>

        <h2>Which One Should You Do First?</h2>
        <p><strong>You must do JAIIB first</strong> — it's a prerequisite for CAIIB. There's no shortcut here. The recommended path:</p>
        <ol>
          <li><strong>Year 1:</strong> Clear JAIIB (all 4 papers within 2 years of registration)</li>
          <li><strong>Year 2:</strong> Attempt CAIIB immediately after JAIIB — the foundational knowledge carries over</li>
          <li><strong>Don't wait:</strong> The longer you delay, the harder it gets. Your JAIIB knowledge fades and banking becomes routine</li>
        </ol>

        <h2>Difficulty Comparison</h2>
        <p>JAIIB covers fundamentals — banking operations, basic accounting, economy. CAIIB goes deep into advanced topics:</p>
        <ul>
          <li><strong>JAIIB AFM</strong> has basic ratios & TVM → <strong>CAIIB BFM</strong> covers derivatives, hedging, treasury management</li>
          <li><strong>JAIIB PPB</strong> covers KYC & loans → <strong>CAIIB ABM</strong> covers advanced credit risk models & Basel norms</li>
          <li><strong>JAIIB IE&IFS</strong> covers banking regulation → <strong>CAIIB BRBL</strong> goes into specific Act sections and case laws</li>
        </ul>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
          <h3 className="text-blue-900 mt-0">Start Your JAIIB Preparation Today</h3>
          <p className="text-blue-800 mb-0">
            Our AI-powered platform covers all 4 JAIIB papers with 3000+ questions. Clear JAIIB first, then use the same platform for CAIIB preparation (coming soon).
          </p>
        </div>
      </div>
    ),
  },
  {
    slug: 'how-to-pass-jaiib-in-15-days',
    title: 'How to Pass JAIIB in 15 Days — Last-Minute Crash Course Strategy (2026)',
    description: 'A realistic 15-day study plan for JAIIB with daily schedules, high-weightage topics to focus on, mock test strategy, and minimum preparation needed to score 50+.',
    date: '2026-05-25',
    readTime: '11 min read',
    category: 'Study Strategy',
    coverImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=400&fit=crop',
    content: (
      <div className="prose prose-lg max-w-none">
        <p className="lead text-xl text-gray-700 mb-8">
          Only 15 days left for your JAIIB exam? Don't panic. With the right strategy, you can absolutely pass. The key is ruthless prioritization — focus on high-weightage, easy-to-score topics and ignore the rest.
        </p>

        <div className="not-prose bg-red-50 border border-red-200 rounded-xl p-5 my-6">
          <h3 className="text-red-900 font-bold text-lg mb-2">⚠️ Honest Disclaimer</h3>
          <p className="text-red-800 text-sm">This plan targets the passing mark (50%). If you want 70%+, you need at least 30-45 days. This is a survival strategy for last-minute preparation.</p>
        </div>

        <h2>The Math: What You Actually Need</h2>
        <ul>
          <li><strong>Pass mark per paper:</strong> 45 out of 100</li>
          <li><strong>Aggregate required:</strong> 200 out of 400 (50%)</li>
          <li><strong>No negative marking:</strong> Attempt every single question</li>
          <li><strong>Strategy:</strong> Score 50-55 in 3 papers, 45+ in the toughest one = PASS</li>
        </ul>

        <h2>15-Day Plan: Day-by-Day Schedule</h2>

        <div className="not-prose my-6">
          <div className="space-y-3">
            <div className="flex items-start gap-4 bg-blue-50 rounded-xl p-4 border border-blue-200">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-xs">D1-3</span>
              </div>
              <div>
                <h4 className="font-bold text-blue-900">Days 1-3: PPB (Easiest to Score)</h4>
                <p className="text-sm text-blue-800">Focus: KYC norms, NPA classification (SMA-0/1/2), NI Act basics, Banking Ombudsman, SARFAESI Act thresholds</p>
                <p className="text-xs text-blue-600 mt-1">Why first? PPB has the most fact-based questions — memorize and score.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 bg-indigo-50 rounded-xl p-4 border border-indigo-200">
              <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-xs">D4-6</span>
              </div>
              <div>
                <h4 className="font-bold text-indigo-900">Days 4-6: IE & IFS (High Weightage Topics)</h4>
                <p className="text-sm text-indigo-800">Focus: RBI rates (Repo, CRR, SLR), Banking Regulation Act key sections, SEBI/IRDAI roles, UPI/NEFT/RTGS limits, Priority Sector Lending %</p>
                <p className="text-xs text-indigo-600 mt-1">Skip: GDP calculation details, deep economic theory. Focus on banking-related facts.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 bg-purple-50 rounded-xl p-4 border border-purple-200">
              <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-xs">D7-9</span>
              </div>
              <div>
                <h4 className="font-bold text-purple-900">Days 7-9: AFM (Formulas + Basics)</h4>
                <p className="text-sm text-purple-800">Focus: Current Ratio, Debt-Equity, BEP formula, NPV concept (positive = accept), TDS sections (192, 194A), GST rates</p>
                <p className="text-xs text-purple-600 mt-1">Skip: Complex IRR calculations, advanced costing. Focus on conceptual MCQs.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 bg-pink-50 rounded-xl p-4 border border-pink-200">
              <div className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-xs">D10-12</span>
              </div>
              <div>
                <h4 className="font-bold text-pink-900">Days 10-12: RBWM (Practical Topics)</h4>
                <p className="text-sm text-pink-800">Focus: Home loan basics (PMAY, LTV ratio), Mutual fund types, UPI limits, Credit card rules, MUDRA categories, Insurance basics</p>
                <p className="text-xs text-pink-600 mt-1">RBWM is practical and relatable — you already know much of this from daily banking.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 bg-green-50 rounded-xl p-4 border border-green-200">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-xs">D13-15</span>
              </div>
              <div>
                <h4 className="font-bold text-green-900">Days 13-15: Mock Tests + Revision</h4>
                <p className="text-sm text-green-800">Day 13: Full mock test for weakest paper. Day 14: Full mock test for 2nd weakest. Day 15: Quick revision of all rates, thresholds, and Act sections.</p>
                <p className="text-xs text-green-600 mt-1">DO NOT study new topics on the last day. Only revise what you already know.</p>
              </div>
            </div>
          </div>
        </div>

        <h2>High-Yield Topics to Memorize (Guaranteed Questions)</h2>
        <ol>
          <li>Current RBI policy rates (Repo 6.5%, CRR 4.5%, SLR 18%, MSF 6.75%)</li>
          <li>NPA classification timeline (SMA-0: 1-30 days, SMA-1: 31-60, SMA-2: 61-90, NPA: 90+)</li>
          <li>Priority Sector: 40% ANBC, Agriculture 18%, Micro 7.5%, Weaker 12%</li>
          <li>SARFAESI: Applicable above ₹1 lakh, 60-day notice period</li>
          <li>KYC update: High risk 2 years, Medium 8 years, Low 10 years</li>
          <li>UPI limits: P2P ₹1 lakh, Merchant ₹2 lakh, Capital markets ₹5 lakh</li>
          <li>NEFT: 24x7, no charges for savings. RTGS: Min ₹2 lakh, 24x7</li>
          <li>Deposit insurance (DICGC): ₹5 lakh per depositor per bank</li>
          <li>Banking Ombudsman: Complaint within 1 year, resolve in 30 days</li>
          <li>PMAY subsidy: EWS/LIG 6.5%, MIG-I 4%, MIG-II 3%</li>
        </ol>

        <h2>Exam Day Tips</h2>
        <ul>
          <li><strong>Attempt ALL questions</strong> — zero negative marking means never leave a question blank</li>
          <li><strong>Statement-based questions:</strong> If 3 out of 4 statements seem correct, answer "All of the above" or "I, II, and III"</li>
          <li><strong>Eliminate obviously wrong options</strong> — even a 50/50 guess improves your odds significantly</li>
          <li><strong>Time management:</strong> 100 questions in 120 minutes = 72 seconds per question. Don't spend more than 2 min on any question.</li>
        </ul>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
          <h3 className="text-blue-900 mt-0">Practice Mock Tests Now</h3>
          <p className="text-blue-800 mb-0">
            Take mock tests under timed conditions to build exam-day confidence. Our 50-question practice sets simulate the real exam with instant feedback and AI explanations.
          </p>
        </div>
      </div>
    ),
  },
  {
    slug: 'rbi-crr-slr-repo-rate-current-2026',
    title: 'RBI CRR, SLR, Repo Rate 2026 — Current Rates & How They Work',
    description: 'Latest RBI monetary policy rates for June 2026: Repo Rate, Reverse Repo, CRR, SLR, MSF, Bank Rate. Explanation of each rate with exam-oriented comparison table.',
    date: '2026-05-28',
    readTime: '8 min read',
    category: 'RBI Updates',
    coverImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop',
    content: (
      <div className="prose prose-lg max-w-none">
        <p className="lead text-xl text-gray-700 mb-8">
          RBI policy rates are guaranteed questions in every JAIIB paper — IE&IFS and PPB both test them heavily. Here are the latest rates as of the most recent MPC meeting, along with clear explanations of what each rate does.
        </p>

        <div className="not-prose bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200 my-6">
          <h3 className="text-lg font-bold text-green-900 mb-4">📌 Current RBI Policy Rates (June 2026)</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 text-center shadow-sm border border-green-100">
              <p className="text-2xl font-bold text-green-700">6.25%</p>
              <p className="text-sm text-gray-600 font-medium">Repo Rate</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow-sm border border-green-100">
              <p className="text-2xl font-bold text-green-700">3.35%</p>
              <p className="text-sm text-gray-600 font-medium">Reverse Repo</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow-sm border border-green-100">
              <p className="text-2xl font-bold text-green-700">4.0%</p>
              <p className="text-sm text-gray-600 font-medium">CRR</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow-sm border border-green-100">
              <p className="text-2xl font-bold text-green-700">18%</p>
              <p className="text-sm text-gray-600 font-medium">SLR</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow-sm border border-green-100">
              <p className="text-2xl font-bold text-green-700">6.50%</p>
              <p className="text-sm text-gray-600 font-medium">MSF Rate</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow-sm border border-green-100">
              <p className="text-2xl font-bold text-green-700">6.50%</p>
              <p className="text-sm text-gray-600 font-medium">Bank Rate</p>
            </div>
          </div>
          <p className="text-xs text-green-700 mt-4 italic">* Last updated after RBI MPC meeting April 2025. Verify current rates on rbi.org.in before your exam.</p>
        </div>

        <h2>What Each Rate Means (Simple Explanation)</h2>

        <h3>Repo Rate (6.25%)</h3>
        <p><strong>What:</strong> The rate at which RBI lends short-term money to commercial banks against government securities.</p>
        <p><strong>Impact:</strong> When Repo Rate goes down → banks can borrow cheaper → loan EMIs decrease.</p>
        <p><strong>Remember:</strong> Repo = Repurchase Agreement. Banks sell securities to RBI and buy them back (repurchase) later.</p>

        <h3>Reverse Repo Rate (3.35%)</h3>
        <p><strong>What:</strong> The rate at which RBI borrows money from commercial banks (banks park excess funds with RBI).</p>
        <p><strong>Impact:</strong> Higher reverse repo → banks prefer parking money with RBI → less lending → reduces money supply.</p>
        <p><strong>Remember:</strong> Always lower than Repo Rate. The gap is the LAF (Liquidity Adjustment Facility) corridor.</p>

        <h3>CRR — Cash Reserve Ratio (4.0%)</h3>
        <p><strong>What:</strong> Percentage of NDTL (Net Demand and Time Liabilities) that banks must keep as cash with RBI. No interest earned on CRR.</p>
        <p><strong>Impact:</strong> Higher CRR → less money available for lending → contracts money supply.</p>
        <p><strong>Key fact:</strong> CRR is maintained under Section 42 of the RBI Act 1934. Range: 3% to 15%.</p>

        <h3>SLR — Statutory Liquidity Ratio (18%)</h3>
        <p><strong>What:</strong> Percentage of NDTL that banks must maintain in liquid assets (cash, gold, government securities).</p>
        <p><strong>Impact:</strong> Higher SLR → banks invest more in government securities → less credit to private sector.</p>
        <p><strong>Key fact:</strong> SLR is maintained under Section 24 of the Banking Regulation Act 1949. Range: 0% to 40%.</p>

        <h3>MSF — Marginal Standing Facility (6.50%)</h3>
        <p><strong>What:</strong> Emergency borrowing window where banks can borrow from RBI above the repo rate (even by dipping into SLR).</p>
        <p><strong>Remember:</strong> MSF = Repo Rate + 0.25% (typically). It's the ceiling of the LAF corridor.</p>

        <h3>Bank Rate (6.50%)</h3>
        <p><strong>What:</strong> Rate at which RBI lends long-term funds to banks without any collateral.</p>
        <p><strong>Note:</strong> Since 2012, Bank Rate is aligned with MSF Rate. Used mainly for penal interest calculations.</p>

        <h2>Common Exam Questions on Rates</h2>

        <div className="not-prose bg-amber-50 border border-amber-200 rounded-xl p-5 my-6">
          <h3 className="text-amber-900 font-bold text-base mb-3">🎯 Frequently Asked in JAIIB</h3>
          <ul className="space-y-2 text-sm text-amber-800">
            <li>• "Under which Act/Section is CRR maintained?" → Section 42, RBI Act 1934</li>
            <li>• "Under which Act/Section is SLR maintained?" → Section 24, BR Act 1949</li>
            <li>• "Which rate forms the floor of LAF corridor?" → Reverse Repo (or SDF now)</li>
            <li>• "Which rate forms the ceiling of LAF corridor?" → MSF Rate</li>
            <li>• "CRR earns interest — True or False?" → FALSE (no interest on CRR)</li>
            <li>• "SLR can be maintained in which forms?" → Cash, Gold, Government Securities</li>
            <li>• "Who decides Repo Rate?" → RBI Monetary Policy Committee (MPC), 6 members</li>
          </ul>
        </div>

        <h2>CRR vs SLR — Key Differences</h2>
        <div className="not-prose my-6 overflow-x-auto">
          <table className="w-full text-sm border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-3 text-left">Feature</th>
                <th className="border border-gray-300 p-3 text-left">CRR</th>
                <th className="border border-gray-300 p-3 text-left">SLR</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="border border-gray-300 p-3">Maintained in</td><td className="border border-gray-300 p-3">Cash only (with RBI)</td><td className="border border-gray-300 p-3">Cash + Gold + G-Secs (with bank itself)</td></tr>
              <tr className="bg-gray-50"><td className="border border-gray-300 p-3">Interest earned</td><td className="border border-gray-300 p-3">No</td><td className="border border-gray-300 p-3">Yes (on G-Secs)</td></tr>
              <tr><td className="border border-gray-300 p-3">Act/Section</td><td className="border border-gray-300 p-3">RBI Act, Section 42</td><td className="border border-gray-300 p-3">BR Act 1949, Section 24</td></tr>
              <tr className="bg-gray-50"><td className="border border-gray-300 p-3">Range</td><td className="border border-gray-300 p-3">3% to 15%</td><td className="border border-gray-300 p-3">0% to 40%</td></tr>
              <tr><td className="border border-gray-300 p-3">Purpose</td><td className="border border-gray-300 p-3">Control money supply</td><td className="border border-gray-300 p-3">Ensure bank solvency + fund govt</td></tr>
            </tbody>
          </table>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
          <h3 className="text-blue-900 mt-0">Practice Rate-Based Questions</h3>
          <p className="text-blue-800 mb-0">
            Our IE&IFS question bank has 200+ questions on RBI monetary policy, CRR/SLR, and financial architecture. Get AI explanations citing specific RBI circulars for every question.
          </p>
        </div>
      </div>
    ),
  },
  {
    slug: 'ppb-important-topics-module-wise-2026',
    title: 'PPB Important Topics Module-Wise for JAIIB 2026 — What to Study First',
    description: 'Module-wise breakdown of Principles & Practices of Banking (PPB) with topic weightage, must-study topics, and recommended preparation order for JAIIB 2026.',
    date: '2026-05-22',
    readTime: '9 min read',
    category: 'Study Strategy',
    coverImage: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=400&fit=crop',
    content: (
      <div className="prose prose-lg max-w-none">
        <p className="lead text-xl text-gray-700 mb-8">
          PPB is often called the most scoring JAIIB paper because it tests practical banking knowledge. Most topics are things you deal with daily at the branch. Here's what to prioritize in each module.
        </p>

        <h2>Module A — General Banking Operations (25-30%)</h2>

        <div className="not-prose bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 my-6">
          <h3 className="text-sm font-bold text-blue-800 uppercase mb-3">Must-Study Topics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="font-bold text-gray-900 text-sm">KYC & AML Norms ⭐⭐⭐</p>
              <p className="text-xs text-gray-600 mt-1">V-CIP, periodic update timelines, CTR (₹10 lakh), STR, beneficial ownership</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="font-bold text-gray-900 text-sm">Negotiable Instruments Act ⭐⭐⭐</p>
              <p className="text-xs text-gray-600 mt-1">Section 13 (definition), types of crossing, dishonour of cheque (Section 138), holder in due course</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="font-bold text-gray-900 text-sm">Types of Accounts ⭐⭐</p>
              <p className="text-xs text-gray-600 mt-1">Savings, Current, FD, RD. Minor accounts, joint accounts, NRI accounts (NRE/NRO/FCNR)</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="font-bold text-gray-900 text-sm">Nomination & Succession ⭐⭐</p>
              <p className="text-xs text-gray-600 mt-1">Section 45ZA-ZF of BR Act, nomination rules, succession certificate requirements</p>
            </div>
          </div>
        </div>

        <h2>Module B — Functions of Banks (25-30%)</h2>

        <div className="not-prose bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200 my-6">
          <h3 className="text-sm font-bold text-indigo-800 uppercase mb-3">Must-Study Topics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="font-bold text-gray-900 text-sm">NPA Classification (IRAC) ⭐⭐⭐</p>
              <p className="text-xs text-gray-600 mt-1">SMA-0/1/2 timeline, NPA → Doubtful → Loss, provisioning norms, agricultural NPA (2 crop seasons)</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="font-bold text-gray-900 text-sm">SARFAESI Act 2002 ⭐⭐⭐</p>
              <p className="text-xs text-gray-600 mt-1">₹1 lakh threshold, 60-day notice, Section 13(2) notice, DRT vs SARFAESI, secured creditor rights</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="font-bold text-gray-900 text-sm">Priority Sector Lending ⭐⭐⭐</p>
              <p className="text-xs text-gray-600 mt-1">40% ANBC target, sub-targets (agriculture 18%, micro 7.5%, weaker 12%), PSL certificates (PSLC)</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="font-bold text-gray-900 text-sm">Credit Appraisal ⭐⭐</p>
              <p className="text-xs text-gray-600 mt-1">5 Cs of credit, MPBF (Tandon Committee), turnover method, credit rating</p>
            </div>
          </div>
        </div>

        <h2>Module C — Banking Technology (20-25%)</h2>

        <div className="not-prose bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200 my-6">
          <h3 className="text-sm font-bold text-purple-800 uppercase mb-3">Must-Study Topics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="font-bold text-gray-900 text-sm">Payment Systems ⭐⭐⭐</p>
              <p className="text-xs text-gray-600 mt-1">NEFT (24x7), RTGS (min ₹2L, 24x7), UPI (limits by category), IMPS, CTS, e-RUPI, CBDC</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="font-bold text-gray-900 text-sm">Digital Lending Guidelines ⭐⭐⭐</p>
              <p className="text-xs text-gray-600 mt-1">LSP rules, Key Fact Statement, cooling-off period, APR disclosure, data privacy</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="font-bold text-gray-900 text-sm">Cyber Security ⭐⭐</p>
              <p className="text-xs text-gray-600 mt-1">Phishing, vishing, ransomware, zero-liability policy, RBI cyber security framework for banks</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="font-bold text-gray-900 text-sm">CBS & Internet Banking ⭐⭐</p>
              <p className="text-xs text-gray-600 mt-1">Core Banking Solution features, SWIFT, SFMS, digital signature, two-factor authentication</p>
            </div>
          </div>
        </div>

        <h2>Module D — Ethics in Banking (15-20%)</h2>

        <div className="not-prose bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-6 border border-green-200 my-6">
          <h3 className="text-sm font-bold text-green-800 uppercase mb-3">Must-Study Topics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="font-bold text-gray-900 text-sm">Integrated Ombudsman Scheme ⭐⭐⭐</p>
              <p className="text-xs text-gray-600 mt-1">Replaced 3 schemes in 2021, complaint within 1 year, 30-day resolution, compensation up to ₹20 lakh</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="font-bold text-gray-900 text-sm">Banking Codes & BCSBI ⭐⭐</p>
              <p className="text-xs text-gray-600 mt-1">Code of Bank's Commitment to Customers, Fair Practice Code for lenders, grievance redressal mechanism</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="font-bold text-gray-900 text-sm">Corporate Governance ⭐⭐</p>
              <p className="text-xs text-gray-600 mt-1">Board composition, role of audit committee, compliance officer duties, whistle-blower policy</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="font-bold text-gray-900 text-sm">PMLA & Anti-Money Laundering ⭐⭐</p>
              <p className="text-xs text-gray-600 mt-1">CTR (₹10L/month), STR (7 days), record keeping (5 years), Principal Officer, wire transfer rules</p>
            </div>
          </div>
        </div>

        <h2>Recommended Study Order for PPB</h2>
        <ol>
          <li><strong>Module B first</strong> — NPA, SARFAESI, PSL are the highest-weightage topics (and most predictable)</li>
          <li><strong>Module A next</strong> — KYC and NI Act are fact-heavy but very scoring once memorized</li>
          <li><strong>Module C</strong> — Payment systems questions are increasing every year. Know UPI limits cold.</li>
          <li><strong>Module D last</strong> — Lowest weightage, but Ombudsman scheme is almost guaranteed</li>
        </ol>

        <h2>Pro Tips for PPB</h2>
        <ul>
          <li><strong>Statement-based questions dominate:</strong> "Which of the following statements are correct? I, II, III, IV" — know exact thresholds and timelines</li>
          <li><strong>Recent circulars matter:</strong> Digital Lending Guidelines (2022/2024) and KYC updates are heavily tested</li>
          <li><strong>Section numbers are asked:</strong> Know at minimum — NI Act Section 13, 138; BR Act Section 5, 6, 21, 35A; SARFAESI Section 13(2)</li>
        </ul>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
          <h3 className="text-blue-900 mt-0">Practice PPB Topic-Wise</h3>
          <p className="text-blue-800 mb-0">
            Our platform has 760+ PPB questions organized by module and topic. Track your accuracy on each topic and focus on areas below 70%. AI explanations cite specific RBI circular numbers.
          </p>
        </div>
      </div>
    ),
  },
  ...ADDITIONAL_BLOG_POSTS,
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
