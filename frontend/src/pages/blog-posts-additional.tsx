import React from 'react';

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

const ADDITIONAL_BLOG_POSTS: BlogPost[] = [
  {
    slug: 'jaiib-rbwm-preparation-guide-2026',
    title: 'JAIIB RBWM Paper Preparation Guide 2026 — Retail Banking & Wealth Management',
    description: 'Complete preparation guide for JAIIB Paper 4 (RBWM) covering retail products, recovery mechanisms, marketing concepts, and wealth management with topic-wise strategy.',
    date: '2026-06-01',
    readTime: '12 min read',
    category: 'Study Strategy',
    coverImage: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&h=400&fit=crop',
    content: (
      <div className="prose prose-lg max-w-none">
        <p className="lead text-xl text-gray-700 mb-8">
          RBWM (Retail Banking & Wealth Management) is the newest JAIIB paper, introduced when IIBF moved from 3 to 4 papers in 2023. Many candidates underestimate it because the topics seem &quot;easy&quot; — but the exam tests specific regulatory limits, product features, and recovery procedures that require focused preparation.
        </p>

        <h2>Why RBWM is Different from Other Papers</h2>
        <p>
          Unlike IE&IFS (theory-heavy) or AFM (calculation-heavy), RBWM is a practical paper. It tests your knowledge of products you encounter daily at the branch — home loans, credit cards, mutual funds, insurance. The challenge is that IIBF tests <strong>specific regulatory details</strong> rather than general awareness. For example, knowing that &quot;home loans exist&quot; won&apos;t help — you need to know the exact LTV ratios, PMAY subsidy percentages, and NHB guidelines.
        </p>

        <h2>Module A — Retail Banking (25-30%)</h2>
        <p>This module covers the entire spectrum of retail banking products offered by commercial banks to individual customers.</p>

        <h3>Key Topics to Master</h3>
        <ul>
          <li><strong>Home Loans:</strong> LTV ratios (75-90% based on loan amount), PMAY subsidy (6.5% for EWS/LIG, 4% for MIG-I, 3% for MIG-II), NHB refinance, fixed vs floating rates, teaser rates controversy</li>
          <li><strong>Auto Loans:</strong> Maximum tenure (7 years), margin requirements, hypothecation vs pledge, RC book endorsement</li>
          <li><strong>Personal Loans:</strong> Unsecured lending norms, FOIR (Fixed Obligation to Income Ratio) calculation, prepayment penalty rules (RBI: no penalty on floating rate loans)</li>
          <li><strong>Credit Cards:</strong> Billing cycle, minimum due (5% of outstanding), interest-free period (20-50 days), RBI guidelines on unsolicited cards, credit card settlement norms</li>
          <li><strong>NRI Banking:</strong> NRE account (repatriable, tax-free interest), NRO account (non-repatriable, taxable), FCNR deposits (foreign currency, repatriable), LRS limit ($250,000 per year)</li>
          <li><strong>Debit Cards:</strong> Daily transaction limits, liability shift rules for fraudulent transactions, RBI zero-liability policy (report within 3 days)</li>
        </ul>

        <h3>Common Exam Questions from Module A</h3>
        <p>IIBF frequently asks statement-based questions like: &quot;Which of the following statements about home loans are correct? (I) Maximum LTV for loans above ₹75 lakh is 75% (II) PMAY subsidy is available for all income groups (III) Prepayment penalty cannot be charged on floating rate loans (IV) Home loan interest is deductible under Section 24(b)&quot;</p>

        <h2>Module B — Retail Products & Recovery (25-30%)</h2>
        <p>This module covers specialized retail products and the entire recovery mechanism framework.</p>

        <h3>Recovery Mechanisms (Heavily Tested)</h3>
        <ul>
          <li><strong>SARFAESI Act 2002 (in retail context):</strong> Applicable for secured loans above ₹1 lakh, 60-day notice under Section 13(2), not applicable to agricultural land, security interest must be registered with CERSAI</li>
          <li><strong>DRT (Debts Recovery Tribunal):</strong> For debts above ₹20 lakh, appeal to DRAT within 45 days, presiding officer is a judicial member</li>
          <li><strong>Lok Adalat:</strong> For NPA up to ₹20 lakh, no court fee, decision is binding and non-appealable, both parties must consent</li>
          <li><strong>One-Time Settlement (OTS):</strong> Bank&apos;s internal policy, typically 60-80% of outstanding, time-bound (usually 90 days to pay), no legal compulsion on bank to offer</li>
        </ul>

        <h3>Other Key Products</h3>
        <ul>
          <li><strong>Education Loans:</strong> No collateral up to ₹7.5 lakh, moratorium period (course + 1 year), interest subsidy for economically weaker (Central Scheme), Vidyalakshmi portal</li>
          <li><strong>Gold Loans:</strong> LTV maximum 75% (as per RBI), tenure typically 12 months, auction after default notice, NBFC gold loan rules vs bank rules</li>
          <li><strong>MUDRA Loans:</strong> Shishu (up to ₹50,000), Kishore (₹50,000-₹5 lakh), Tarun (₹5-₹10 lakh), no collateral required, available at all PSU bank branches</li>
          <li><strong>Microfinance:</strong> Maximum household income ₹3 lakh, loan limit 50% of household income, no collateral, maximum 2 MFI lenders per borrower</li>
        </ul>

        <h2>Module C — Marketing of Banking Services (20%)</h2>
        <p>This is often the lowest-weightage module but still contributes 15-20 questions. The content is more conceptual and easier to score.</p>

        <h3>Key Concepts</h3>
        <ul>
          <li><strong>7Ps of Services Marketing:</strong> Product, Price, Place, Promotion, People, Process, Physical Evidence — know how each applies to banking</li>
          <li><strong>CRM (Customer Relationship Management):</strong> Acquisition cost vs retention cost (5:1 ratio), customer lifetime value, cross-selling and up-selling strategies</li>
          <li><strong>Market Segmentation:</strong> Geographic, demographic, psychographic, behavioral segmentation in banking context</li>
          <li><strong>Digital Marketing in Banking:</strong> Social media guidelines for banks (RBI restrictions), SEO for bank products, mobile-first approach, chatbots and AI in customer service</li>
          <li><strong>Service Quality Models:</strong> SERVQUAL model (5 gaps), service recovery paradox, complaint handling as marketing opportunity</li>
        </ul>

        <h2>Module D — Wealth Management (20-25%)</h2>
        <p>Wealth management topics are increasingly important as banks push fee-based income. This module overlaps with some IE&IFS Module D content.</p>

        <h3>Must-Know Topics</h3>
        <ul>
          <li><strong>Mutual Funds:</strong> Open-ended vs closed-ended, equity/debt/hybrid categories, NAV calculation, entry/exit loads, SEBI categorization norms (2017), SIP vs lump sum</li>
          <li><strong>Insurance:</strong> Term vs whole life vs endowment, ULIP, health insurance (Section 80D), IRDAI MFTP guidelines, bancassurance model, claims settlement ratio</li>
          <li><strong>Financial Planning Process:</strong> Goal setting → data gathering → analysis → recommendation → implementation → review (6 steps)</li>
          <li><strong>Risk Profiling:</strong> Conservative/moderate/aggressive profiles, age-based asset allocation rule (100 - age = equity %), suitability assessment requirement</li>
          <li><strong>Tax Planning:</strong> Section 80C (₹1.5 lakh), Section 80D (₹25K/₹50K), Section 24(b) (₹2 lakh housing), NPS extra deduction (50K under 80CCD(1B))</li>
          <li><strong>Estate Planning:</strong> Will vs nomination, succession laws (Hindu/Muslim/Christian), power of attorney, trust structures for HNIs</li>
        </ul>

        <h2>Recommended Study Order</h2>
        <ol>
          <li><strong>Module B first</strong> — Recovery mechanisms (SARFAESI, DRT, Lok Adalat) are high-weightage and fact-based. Memorize thresholds and timelines.</li>
          <li><strong>Module A next</strong> — Retail products are practical. Focus on RBI regulatory limits (LTV, prepayment, NRI account rules).</li>
          <li><strong>Module D</strong> — Mutual funds and insurance are tested frequently. Know SEBI categorization and tax sections.</li>
          <li><strong>Module C last</strong> — Marketing concepts are conceptual and easier. Can be covered quickly in 2-3 days.</li>
        </ol>

        <h2>Pro Tips for RBWM Paper</h2>
        <ul>
          <li><strong>Overlap with PPB:</strong> About 20% of RBWM content overlaps with PPB Module B (loans, NPA, SARFAESI). If you study PPB well, RBWM becomes significantly easier.</li>
          <li><strong>Current RBI guidelines matter:</strong> Digital lending guidelines, credit card rules, and gold loan LTV norms are frequently updated. Check RBI website for latest Master Directions.</li>
          <li><strong>Real branch experience helps:</strong> If you work in retail branch, you already know most of Module A practically. Focus on the specific numbers and regulatory limits you might not have memorized.</li>
        </ul>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
          <h3 className="text-blue-900 mt-0">Practice RBWM Questions</h3>
          <p className="text-blue-800 mb-0">
            Our platform has 635+ RBWM questions covering all 4 modules. Each explanation cites specific RBI guidelines and IIBF textbook references so you learn the exact regulatory details tested in the exam.
          </p>
        </div>
      </div>
    ),
  },
  {
    slug: 'jaiib-exam-day-tips-dos-donts',
    title: 'JAIIB Exam Day Tips — 15 Dos and Don\'ts for the Online Test (2026)',
    description: 'Practical exam day advice for JAIIB 2026: what to carry, time management strategy during the test, how to handle statement-based questions, and common mistakes that cost marks.',
    date: '2026-06-05',
    readTime: '9 min read',
    category: 'Exam Tips',
    coverImage: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=800&h=400&fit=crop',
    content: (
      <div className="prose prose-lg max-w-none">
        <p className="lead text-xl text-gray-700 mb-8">
          You have studied for weeks, completed mock tests, and revised your notes. Now the exam is tomorrow. What you do in the 120 minutes of the actual test can make a 10-15 mark difference. Here are battle-tested exam day strategies from candidates who scored 70+ in all four papers.
        </p>

        <h2>Before the Exam (Morning of)</h2>

        <h3>What to Carry</h3>
        <ul>
          <li><strong>Admit card</strong> — printed copy (colour or black-and-white both accepted)</li>
          <li><strong>Photo ID</strong> — Aadhaar, PAN, Passport, Voter ID, or Bank ID card (must match name on admit card)</li>
          <li><strong>Nothing else</strong> — no phone, no calculator (on-screen calculator is provided), no notes, no watch (clock is on screen)</li>
        </ul>

        <h3>What NOT to Do in the Morning</h3>
        <ul>
          <li><strong>Do not study new topics</strong> — it creates confusion and anxiety. Only revise your formula sheet or rate card.</li>
          <li><strong>Do not panic about topics you haven&apos;t covered</strong> — focus on what you know. You need 50, not 100.</li>
          <li><strong>Eat a proper meal</strong> — the exam is 2 hours. Low blood sugar affects concentration.</li>
          <li><strong>Reach the centre 30 minutes early</strong> — biometric verification and seat allocation take time.</li>
        </ul>

        <h2>During the Exam — Time Management</h2>

        <p>100 questions in 120 minutes = 72 seconds per question on average. But not all questions deserve equal time.</p>

        <h3>The 40-30-30 Strategy</h3>
        <ul>
          <li><strong>First 40 minutes:</strong> Attempt the first 40 questions. These typically start easy. Don&apos;t spend more than 1 minute on any question. If unsure, mark it and move on.</li>
          <li><strong>Next 50 minutes:</strong> Questions 41-80. These are medium/hard. Allow up to 90 seconds each. For statement-based questions (I, II, III, IV format), read each statement carefully.</li>
          <li><strong>Last 30 minutes:</strong> Questions 81-100 + review marked questions. Use remaining time to revisit flagged questions.</li>
        </ul>

        <h3>How to Handle Statement-Based Questions</h3>
        <p>These carry 2 marks each and make up 40-50% of the paper. The format is: &quot;Consider the following statements: (I)... (II)... (III)... Which of the above is/are correct?&quot;</p>
        <ul>
          <li><strong>Read each statement independently</strong> — evaluate it as true/false on its own before looking at options</li>
          <li><strong>Look for absolutes</strong> — words like &quot;always&quot;, &quot;never&quot;, &quot;only&quot; are often indicators of incorrect statements</li>
          <li><strong>Check for subtle errors</strong> — IIBF often changes one number or one word to make a statement incorrect (e.g., &quot;CRR is maintained under Section 24&quot; — wrong, it is Section 42)</li>
          <li><strong>When in doubt, prefer &quot;I and III only&quot; type options</strong> — rarely are ALL statements correct or ALL incorrect</li>
        </ul>

        <h2>The 8 Dos for JAIIB Exam Day</h2>
        <ol>
          <li><strong>DO attempt every question</strong> — zero negative marking means leaving a question blank is throwing away marks. Even a random guess gives you 25% probability.</li>
          <li><strong>DO use the on-screen calculator for AFM</strong> — don&apos;t waste time doing mental math for NPV, EMI, or ratio calculations. The calculator is basic but functional.</li>
          <li><strong>DO flag difficult questions and return later</strong> — the exam interface allows you to mark questions for review. Use it aggressively.</li>
          <li><strong>DO read the question stem completely</strong> — many questions ask &quot;which is INCORRECT&quot; and candidates select the correct option by mistake.</li>
          <li><strong>DO check the progress bar</strong> — at the 60-minute mark, you should have attempted at least 50 questions. If not, speed up.</li>
          <li><strong>DO trust your first instinct</strong> — research shows that changing answers usually reduces your score. Only change if you are absolutely certain.</li>
          <li><strong>DO use elimination strategy</strong> — even eliminating 1 wrong option improves your odds from 25% to 33%.</li>
          <li><strong>DO review your answers in the last 10 minutes</strong> — specifically check: did you miss any question? Did you accidentally select the wrong option on any?</li>
        </ol>

        <h2>The 7 Don&apos;ts for JAIIB Exam Day</h2>
        <ol>
          <li><strong>DON&apos;T spend more than 2 minutes on any single question</strong> — if you can&apos;t solve it in 2 minutes, flag it and move on. 2 marks is not worth 5 minutes.</li>
          <li><strong>DON&apos;T leave numerical questions for last</strong> — AFM calculations are time-consuming. If you push them to the end, you will rush and make errors.</li>
          <li><strong>DON&apos;T second-guess yourself repeatedly</strong> — pick an answer, move on. Indecision wastes more time than wrong answers.</li>
          <li><strong>DON&apos;T panic if you don&apos;t know a question</strong> — even toppers get 10-15 questions they&apos;ve never seen. Guess and move on.</li>
          <li><strong>DON&apos;T change your answer unless you have a clear reason</strong> — studies show first answers are correct more often than changed answers.</li>
          <li><strong>DON&apos;T look at other candidates</strong> — each person gets a different randomised set. Their pace is irrelevant to yours.</li>
          <li><strong>DON&apos;T skip the last 5-10 questions due to time pressure</strong> — even if time is short, quickly select the most probable answer for each remaining question. Never submit with blanks.</li>
        </ol>

        <h2>Paper-Specific Tips</h2>

        <h3>IE & IFS</h3>
        <p>Current affairs questions appear in the first 20-30 questions. If you know the latest GDP data, RBI rates, and recent policy changes, these are quick marks. Module C (Acts and regulators) questions require precise section numbers.</p>

        <h3>PPB</h3>
        <p>KYC and NPA questions are almost guaranteed. Know the exact SMA timeline (1-30, 31-60, 61-90 days), SARFAESI threshold (₹1 lakh), and Banking Ombudsman compensation limit (₹20 lakh). Payment system limits (UPI, NEFT, RTGS) appear every time.</p>

        <h3>AFM</h3>
        <p>Start with ratio and BEP questions — they are fastest to solve. NPV/IRR calculations take longer, so do them in the middle 40-minute window. Don&apos;t waste time deriving formulas — either you know it or you guess and move on.</p>

        <h3>RBWM</h3>
        <p>Home loan LTV ratios, MUDRA categories (Shishu/Kishore/Tarun), and mutual fund types are tested heavily. Recovery mechanism questions (SARFAESI timeline, DRT threshold, Lok Adalat limit) overlap with PPB — score on these twice.</p>

        <h2>After the Exam</h2>
        <ul>
          <li>Results come in 4-6 weeks. Do not stress during this period.</li>
          <li>If you passed, start CAIIB preparation within 3 months while JAIIB knowledge is fresh.</li>
          <li>If one paper is borderline, don&apos;t assume the worst — IIBF sometimes gives 1-2 grace marks in close cases.</li>
        </ul>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
          <h3 className="text-blue-900 mt-0">Take a Full Mock Test Now</h3>
          <p className="text-blue-800 mb-0">
            Simulate the real exam experience with our 100-question, 120-minute mock tests. Practice time management and build confidence for exam day. Instant scoring with AI explanations.
          </p>
        </div>
      </div>
    ),
  },
  {
    slug: 'npa-classification-sarfaesi-act-explained',
    title: 'NPA Classification & SARFAESI Act Explained for JAIIB — Complete Guide with Examples',
    description: 'Detailed explanation of NPA classification (SMA-0 to Loss assets), SARFAESI Act 2002 provisions, DRT procedure, and Lok Adalat — with practical examples and exam-oriented comparison tables.',
    date: '2026-06-08',
    readTime: '14 min read',
    category: 'Deep Dive',
    coverImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6e?w=800&h=400&fit=crop',
    content: (
      <div className="prose prose-lg max-w-none">
        <p className="lead text-xl text-gray-700 mb-8">
          NPA (Non-Performing Asset) classification and the SARFAESI Act together account for 8-12 questions across PPB and RBWM papers. This is one of the highest-yielding topics in JAIIB — master it and you are almost guaranteed 15+ marks across both papers.
        </p>

        <h2>What is a Non-Performing Asset (NPA)?</h2>
        <p>
          An asset (loan/advance) becomes non-performing when it ceases to generate income for the bank. Specifically, a loan account is classified as NPA when the interest or instalment of principal remains overdue for more than 90 days. For agricultural loans, the timeline is different — it is linked to crop seasons.
        </p>
        <p>
          <strong>Key Point:</strong> &quot;Overdue&quot; means the amount is not paid on the due date fixed by the bank. If your EMI is due on the 5th of every month and you don&apos;t pay on the 5th, it becomes &quot;overdue&quot; from the 6th.
        </p>

        <h2>Pre-NPA Classification: Special Mention Accounts (SMA)</h2>
        <p>Before an account becomes NPA, RBI requires banks to classify it under the SMA (Special Mention Account) framework for early warning:</p>

        <div className="not-prose my-6 overflow-x-auto">
          <table className="w-full text-sm border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-3 text-left">Category</th>
                <th className="border border-gray-300 p-3 text-left">Days Overdue</th>
                <th className="border border-gray-300 p-3 text-left">Action Required</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="border border-gray-300 p-3 font-bold text-blue-700">SMA-0</td><td className="border border-gray-300 p-3">1-30 days</td><td className="border border-gray-300 p-3">Internal monitoring, contact borrower</td></tr>
              <tr className="bg-gray-50"><td className="border border-gray-300 p-3 font-bold text-orange-700">SMA-1</td><td className="border border-gray-300 p-3">31-60 days</td><td className="border border-gray-300 p-3">Report to CRILC (₹5 crore+), restructuring discussions</td></tr>
              <tr><td className="border border-gray-300 p-3 font-bold text-red-700">SMA-2</td><td className="border border-gray-300 p-3">61-90 days</td><td className="border border-gray-300 p-3">Mandatory CRILC reporting, resolution plan preparation</td></tr>
              <tr className="bg-red-50"><td className="border border-gray-300 p-3 font-bold text-red-900">NPA</td><td className="border border-gray-300 p-3">90+ days</td><td className="border border-gray-300 p-3">Classify as Sub-standard, begin provisioning</td></tr>
            </tbody>
          </table>
        </div>

        <p><strong>CRILC</strong> = Central Repository of Information on Large Credits. Banks must report weekly data for borrowers with aggregate exposure of ₹5 crore and above.</p>

        <h2>NPA Sub-Categories (Asset Classification)</h2>
        <p>Once classified as NPA, the account further deteriorates through these stages:</p>

        <div className="not-prose my-6 overflow-x-auto">
          <table className="w-full text-sm border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-3 text-left">Category</th>
                <th className="border border-gray-300 p-3 text-left">Duration as NPA</th>
                <th className="border border-gray-300 p-3 text-left">Provisioning Required</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="border border-gray-300 p-3 font-bold">Sub-Standard</td><td className="border border-gray-300 p-3">Up to 12 months as NPA</td><td className="border border-gray-300 p-3">15% (secured), 25% (unsecured)</td></tr>
              <tr className="bg-gray-50"><td className="border border-gray-300 p-3 font-bold">Doubtful-1</td><td className="border border-gray-300 p-3">12-24 months as NPA</td><td className="border border-gray-300 p-3">25% of secured portion + 100% of unsecured</td></tr>
              <tr><td className="border border-gray-300 p-3 font-bold">Doubtful-2</td><td className="border border-gray-300 p-3">24-36 months as NPA</td><td className="border border-gray-300 p-3">40% of secured + 100% of unsecured</td></tr>
              <tr className="bg-gray-50"><td className="border border-gray-300 p-3 font-bold">Doubtful-3</td><td className="border border-gray-300 p-3">Beyond 36 months</td><td className="border border-gray-300 p-3">100% of entire outstanding</td></tr>
              <tr className="bg-red-50"><td className="border border-gray-300 p-3 font-bold text-red-700">Loss Asset</td><td className="border border-gray-300 p-3">Identified as unrecoverable by bank/auditor/RBI</td><td className="border border-gray-300 p-3">100% write-off</td></tr>
            </tbody>
          </table>
        </div>

        <h3>Special Case: Agricultural Loans</h3>
        <p>For short-duration crops (up to one crop season for short crops), the account is classified as NPA if the instalment of principal or interest remains overdue for <strong>2 crop seasons</strong>. For long-duration crops, it is <strong>1 crop season</strong> from the due date. This is different from the standard 90-day rule.</p>

        <h2>SARFAESI Act 2002 — The Bank&apos;s Recovery Weapon</h2>
        <p>
          SARFAESI (Securitisation and Reconstruction of Financial Assets and Enforcement of Security Interest Act) gives banks the power to recover NPAs <strong>without going to court</strong>. It is the most powerful recovery tool available to secured creditors.
        </p>

        <h3>When Can SARFAESI Be Used?</h3>
        <ul>
          <li>Loan amount must be above <strong>₹1 lakh</strong></li>
          <li>Account must be classified as <strong>NPA</strong></li>
          <li>The bank must have a valid <strong>security interest</strong> (collateral)</li>
          <li><strong>NOT applicable</strong> to: agricultural land, loans below ₹1 lakh, security interest in aircraft/ships/vessels, unpledged assets</li>
        </ul>

        <h3>SARFAESI Process (Step by Step)</h3>
        <ol>
          <li><strong>Section 13(2) Notice:</strong> Bank serves a 60-day demand notice to the borrower to repay the outstanding amount</li>
          <li><strong>Borrower&apos;s Response:</strong> Borrower has 60 days to either pay or make representations to the bank</li>
          <li><strong>Section 13(4) Actions (if not paid):</strong> After 60 days, bank can:
            <ul>
              <li>Take possession of the secured asset</li>
              <li>Sell/lease/assign the secured asset</li>
              <li>Appoint a manager to manage the secured asset</li>
              <li>Require any person who has acquired the secured asset to pay remaining debt to the bank</li>
            </ul>
          </li>
          <li><strong>Borrower&apos;s Appeal:</strong> Borrower can file application to DRT under Section 17 within 45 days of the bank&apos;s action</li>
        </ol>

        <h3>Key SARFAESI Facts for Exam</h3>
        <ul>
          <li>Multiple banks holding security in same asset: bank with 60%+ share can initiate SARFAESI</li>
          <li>Personal guarantee holders can also be proceeded against under SARFAESI</li>
          <li>The Authorized Officer (bank employee) must be of DGM rank or above for taking possession</li>
          <li>After possession, sale must be conducted within 30 days (extendable by 2 months)</li>
          <li>Reserve price must not be below 80% of market value (earlier was valuation by approved valuer)</li>
        </ul>

        <h2>DRT (Debts Recovery Tribunal)</h2>
        <p>For debts of <strong>₹20 lakh and above</strong>, banks can approach the DRT. Key facts:</p>
        <ul>
          <li>Established under the Recovery of Debts and Bankruptcy Act (RDDBFI Act) 1993</li>
          <li>Presiding Officer is equivalent to a District Judge</li>
          <li>Must dispose of applications within 180 days from the date of receipt</li>
          <li>Appeal lies to DRAT (Debts Recovery Appellate Tribunal) within 45 days</li>
          <li>Borrower must deposit 50% of the debt before filing appeal to DRAT (this can be reduced to 25% by DRAT)</li>
        </ul>

        <h2>Lok Adalat for NPA Recovery</h2>
        <p>For NPAs up to <strong>₹20 lakh</strong>, Lok Adalat is the preferred forum. Key facts:</p>
        <ul>
          <li>No court fees payable</li>
          <li>Decision is final and binding — no appeal possible (under Section 21 of Legal Services Authorities Act)</li>
          <li>Both parties must consent to Lok Adalat proceedings</li>
          <li>Decree of Lok Adalat is deemed a decree of civil court</li>
          <li>Suitable for compromise/settlement cases where both parties agree</li>
        </ul>

        <h2>Comparison Table: SARFAESI vs DRT vs Lok Adalat</h2>
        <div className="not-prose my-6 overflow-x-auto">
          <table className="w-full text-sm border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-3 text-left">Feature</th>
                <th className="border border-gray-300 p-3 text-left">SARFAESI</th>
                <th className="border border-gray-300 p-3 text-left">DRT</th>
                <th className="border border-gray-300 p-3 text-left">Lok Adalat</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="border border-gray-300 p-3">Threshold</td><td className="border border-gray-300 p-3">Above ₹1 lakh</td><td className="border border-gray-300 p-3">Above ₹20 lakh</td><td className="border border-gray-300 p-3">Up to ₹20 lakh</td></tr>
              <tr className="bg-gray-50"><td className="border border-gray-300 p-3">Court involvement</td><td className="border border-gray-300 p-3">No (extrajudicial)</td><td className="border border-gray-300 p-3">Yes (tribunal)</td><td className="border border-gray-300 p-3">Yes (judicial)</td></tr>
              <tr><td className="border border-gray-300 p-3">Security required</td><td className="border border-gray-300 p-3">Yes (secured loans only)</td><td className="border border-gray-300 p-3">No (secured + unsecured)</td><td className="border border-gray-300 p-3">No</td></tr>
              <tr className="bg-gray-50"><td className="border border-gray-300 p-3">Notice period</td><td className="border border-gray-300 p-3">60 days</td><td className="border border-gray-300 p-3">N/A (application filed)</td><td className="border border-gray-300 p-3">N/A (mutual consent)</td></tr>
              <tr><td className="border border-gray-300 p-3">Appeal</td><td className="border border-gray-300 p-3">DRT (45 days)</td><td className="border border-gray-300 p-3">DRAT (45 days)</td><td className="border border-gray-300 p-3">No appeal possible</td></tr>
              <tr className="bg-gray-50"><td className="border border-gray-300 p-3">Agri land</td><td className="border border-gray-300 p-3">Not applicable</td><td className="border border-gray-300 p-3">Applicable</td><td className="border border-gray-300 p-3">Applicable</td></tr>
            </tbody>
          </table>
        </div>

        <h2>Upgradation of NPA to Standard</h2>
        <p>An NPA can be upgraded back to &quot;Standard&quot; asset if:</p>
        <ul>
          <li><strong>All arrears of interest and principal</strong> are paid by the borrower (not just current instalment)</li>
          <li>For restructured accounts: account performs satisfactorily for 1 year from the first payment due date after restructuring</li>
          <li>Upgradation is not permitted merely because the account has been rescheduled/renegotiated</li>
        </ul>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
          <h3 className="text-blue-900 mt-0">Practice NPA & Recovery Questions</h3>
          <p className="text-blue-800 mb-0">
            Our PPB and RBWM question banks have 100+ questions specifically on NPA classification, SARFAESI procedures, and recovery mechanisms. Each explanation cites the exact RBI Master Circular provision.
          </p>
        </div>
      </div>
    ),
  },
  {
    slug: 'time-value-of-money-solved-examples-jaiib',
    title: 'Time Value of Money — 10 Solved Examples for JAIIB AFM (2026)',
    description: 'Step-by-step solutions to the most common TVM problems in JAIIB AFM: compound interest, present value, EMI calculation, Rule of 72, annuity, and NPV with exam-style questions.',
    date: '2026-06-12',
    readTime: '13 min read',
    category: 'Solved Examples',
    coverImage: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=400&fit=crop',
    content: (
      <div className="prose prose-lg max-w-none">
        <p className="lead text-xl text-gray-700 mb-8">
          Time Value of Money (TVM) is the foundation of JAIIB AFM Module C. Every exam has 5-8 questions on TVM concepts — compound interest, present value, EMI, and NPV. Here are 10 solved examples in the exact format you will see in the exam.
        </p>

        <h2>Core Concept: Why ₹100 Today ≠ ₹100 Tomorrow</h2>
        <p>
          Money has time value because it can earn interest. ₹100 today is worth more than ₹100 received after 1 year because you could invest today&apos;s ₹100 and have more than ₹100 after a year. This simple concept drives all TVM calculations.
        </p>

        <h2>Example 1: Simple Interest</h2>
        <p><strong>Question:</strong> A bank offers a Fixed Deposit at 7% p.a. simple interest. If you deposit ₹50,000 for 3 years, what is the maturity amount?</p>
        <div className="not-prose bg-green-50 border border-green-200 rounded-lg p-5 my-4">
          <p className="font-bold text-green-900 text-sm">Solution:</p>
          <p className="text-green-800 text-sm">SI = P × R × T / 100</p>
          <p className="text-green-800 text-sm">SI = 50,000 × 7 × 3 / 100 = ₹10,500</p>
          <p className="text-green-800 text-sm">Maturity Amount = 50,000 + 10,500 = <strong>₹60,500</strong></p>
        </div>

        <h2>Example 2: Compound Interest</h2>
        <p><strong>Question:</strong> ₹1,00,000 is invested at 10% p.a. compounded annually for 3 years. Find the compound interest.</p>
        <div className="not-prose bg-green-50 border border-green-200 rounded-lg p-5 my-4">
          <p className="font-bold text-green-900 text-sm">Solution:</p>
          <p className="text-green-800 text-sm">FV = PV × (1 + r)ⁿ</p>
          <p className="text-green-800 text-sm">FV = 1,00,000 × (1.10)³</p>
          <p className="text-green-800 text-sm">FV = 1,00,000 × 1.331 = ₹1,33,100</p>
          <p className="text-green-800 text-sm">Compound Interest = 1,33,100 - 1,00,000 = <strong>₹33,100</strong></p>
          <p className="text-green-700 text-xs mt-2">Note: If this were simple interest, it would be ₹30,000. The extra ₹3,100 is the &quot;interest on interest&quot; effect.</p>
        </div>

        <h2>Example 3: Present Value (Discounting)</h2>
        <p><strong>Question:</strong> You need ₹5,00,000 after 5 years. If the discount rate is 8% p.a., how much should you invest today?</p>
        <div className="not-prose bg-green-50 border border-green-200 rounded-lg p-5 my-4">
          <p className="font-bold text-green-900 text-sm">Solution:</p>
          <p className="text-green-800 text-sm">PV = FV / (1 + r)ⁿ</p>
          <p className="text-green-800 text-sm">PV = 5,00,000 / (1.08)⁵</p>
          <p className="text-green-800 text-sm">PV = 5,00,000 / 1.4693</p>
          <p className="text-green-800 text-sm">PV = <strong>₹3,40,290</strong> (approximately)</p>
          <p className="text-green-700 text-xs mt-2">Interpretation: Invest ₹3.40 lakh today at 8% and it will grow to ₹5 lakh in 5 years.</p>
        </div>

        <h2>Example 4: Rule of 72 (Quick Doubling Time)</h2>
        <p><strong>Question:</strong> At what rate of interest will money double in 6 years (approximately)?</p>
        <div className="not-prose bg-green-50 border border-green-200 rounded-lg p-5 my-4">
          <p className="font-bold text-green-900 text-sm">Solution:</p>
          <p className="text-green-800 text-sm">Rule of 72: Doubling Time = 72 / Rate%</p>
          <p className="text-green-800 text-sm">6 = 72 / Rate</p>
          <p className="text-green-800 text-sm">Rate = 72 / 6 = <strong>12% p.a.</strong></p>
          <p className="text-green-700 text-xs mt-2">Exam tip: If the question says &quot;approximately&quot; or &quot;quick estimate&quot;, use Rule of 72. Exact answer would need logarithms.</p>
        </div>

        <h2>Example 5: EMI Calculation</h2>
        <p><strong>Question:</strong> A home loan of ₹30,00,000 at 9% p.a. for 20 years. Calculate the monthly EMI.</p>
        <div className="not-prose bg-green-50 border border-green-200 rounded-lg p-5 my-4">
          <p className="font-bold text-green-900 text-sm">Solution:</p>
          <p className="text-green-800 text-sm">EMI = P × r × (1+r)ⁿ / [(1+r)ⁿ - 1]</p>
          <p className="text-green-800 text-sm">P = 30,00,000; r = 9%/12 = 0.75% = 0.0075; n = 20×12 = 240 months</p>
          <p className="text-green-800 text-sm">(1.0075)²⁴⁰ = 6.009 (approx)</p>
          <p className="text-green-800 text-sm">EMI = 30,00,000 × 0.0075 × 6.009 / (6.009 - 1)</p>
          <p className="text-green-800 text-sm">EMI = 30,00,000 × 0.04507 / 5.009</p>
          <p className="text-green-800 text-sm">EMI = 1,35,210 / 5.009 = <strong>₹26,992</strong> (approximately ₹27,000)</p>
          <p className="text-green-700 text-xs mt-2">In the exam, options will be rounded. If you get ₹26,992, look for the closest option (₹26,992 or ₹27,000).</p>
        </div>

        <h2>Example 6: Net Present Value (NPV)</h2>
        <p><strong>Question:</strong> A project requires an investment of ₹10,00,000 and generates cash flows of ₹4,00,000 per year for 4 years. Cost of capital is 10%. Should the project be accepted?</p>
        <div className="not-prose bg-green-50 border border-green-200 rounded-lg p-5 my-4">
          <p className="font-bold text-green-900 text-sm">Solution:</p>
          <p className="text-green-800 text-sm">NPV = Sum of [CF/(1+r)^t] - Initial Investment</p>
          <p className="text-green-800 text-sm">Year 1: 4,00,000 / 1.10 = 3,63,636</p>
          <p className="text-green-800 text-sm">Year 2: 4,00,000 / 1.21 = 3,30,579</p>
          <p className="text-green-800 text-sm">Year 3: 4,00,000 / 1.331 = 3,00,526</p>
          <p className="text-green-800 text-sm">Year 4: 4,00,000 / 1.4641 = 2,73,205</p>
          <p className="text-green-800 text-sm">Total PV of inflows = 12,67,946</p>
          <p className="text-green-800 text-sm">NPV = 12,67,946 - 10,00,000 = <strong>+₹2,67,946</strong></p>
          <p className="text-green-800 text-sm font-bold">Decision: ACCEPT (NPV is positive)</p>
          <p className="text-green-700 text-xs mt-2">Rule: NPV &gt; 0 → Accept; NPV &lt; 0 → Reject; NPV = 0 → Indifferent</p>
        </div>

        <h2>Example 7: Payback Period</h2>
        <p><strong>Question:</strong> Using the same project as Example 6 (₹10 lakh investment, ₹4 lakh annual cash flow), what is the payback period?</p>
        <div className="not-prose bg-green-50 border border-green-200 rounded-lg p-5 my-4">
          <p className="font-bold text-green-900 text-sm">Solution:</p>
          <p className="text-green-800 text-sm">Payback Period = Initial Investment / Annual Cash Flow</p>
          <p className="text-green-800 text-sm">= 10,00,000 / 4,00,000</p>
          <p className="text-green-800 text-sm">= <strong>2.5 years</strong></p>
          <p className="text-green-700 text-xs mt-2">Note: This is the simple payback period (ignores time value). Discounted payback period would be longer.</p>
        </div>

        <h2>Example 8: Future Value of Annuity (SIP Calculation)</h2>
        <p><strong>Question:</strong> If you invest ₹10,000 per month in a mutual fund SIP earning 12% p.a. for 10 years, what will be the corpus?</p>
        <div className="not-prose bg-green-50 border border-green-200 rounded-lg p-5 my-4">
          <p className="font-bold text-green-900 text-sm">Solution:</p>
          <p className="text-green-800 text-sm">FV of Annuity = PMT × [(1+r)ⁿ - 1] / r</p>
          <p className="text-green-800 text-sm">PMT = 10,000; r = 12%/12 = 1% = 0.01; n = 10×12 = 120 months</p>
          <p className="text-green-800 text-sm">(1.01)¹²⁰ = 3.30 (approx)</p>
          <p className="text-green-800 text-sm">FV = 10,000 × [3.30 - 1] / 0.01</p>
          <p className="text-green-800 text-sm">FV = 10,000 × 230 = <strong>₹23,00,000</strong> (approximately ₹23.23 lakh)</p>
          <p className="text-green-700 text-xs mt-2">Total invested: ₹12 lakh (₹10K × 120 months). Returns: ₹11+ lakh. This is the power of compounding.</p>
        </div>

        <h2>Example 9: Effective Rate of Interest</h2>
        <p><strong>Question:</strong> A bank offers 8% p.a. compounded quarterly. What is the effective annual rate?</p>
        <div className="not-prose bg-green-50 border border-green-200 rounded-lg p-5 my-4">
          <p className="font-bold text-green-900 text-sm">Solution:</p>
          <p className="text-green-800 text-sm">Effective Rate = (1 + r/n)ⁿ - 1</p>
          <p className="text-green-800 text-sm">= (1 + 0.08/4)⁴ - 1</p>
          <p className="text-green-800 text-sm">= (1.02)⁴ - 1</p>
          <p className="text-green-800 text-sm">= 1.0824 - 1 = 0.0824</p>
          <p className="text-green-800 text-sm">= <strong>8.24% per annum</strong></p>
          <p className="text-green-700 text-xs mt-2">The effective rate is always higher than nominal rate when compounding is more frequent than annually.</p>
        </div>

        <h2>Example 10: Profitability Index</h2>
        <p><strong>Question:</strong> A project costs ₹5,00,000. PV of future cash flows is ₹6,50,000. Calculate Profitability Index and decide.</p>
        <div className="not-prose bg-green-50 border border-green-200 rounded-lg p-5 my-4">
          <p className="font-bold text-green-900 text-sm">Solution:</p>
          <p className="text-green-800 text-sm">PI = PV of future cash flows / Initial Investment</p>
          <p className="text-green-800 text-sm">PI = 6,50,000 / 5,00,000 = <strong>1.30</strong></p>
          <p className="text-green-800 text-sm font-bold">Decision: ACCEPT (PI &gt; 1)</p>
          <p className="text-green-700 text-xs mt-2">Rule: PI &gt; 1 → Accept; PI &lt; 1 → Reject; PI = 1 → Indifferent. PI of 1.30 means every ₹1 invested generates ₹1.30 in present value terms.</p>
        </div>

        <h2>Quick Reference: Decision Rules</h2>
        <div className="not-prose my-6 overflow-x-auto">
          <table className="w-full text-sm border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-3 text-left">Method</th>
                <th className="border border-gray-300 p-3 text-left">Accept If</th>
                <th className="border border-gray-300 p-3 text-left">Reject If</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="border border-gray-300 p-3">NPV</td><td className="border border-gray-300 p-3">NPV &gt; 0</td><td className="border border-gray-300 p-3">NPV &lt; 0</td></tr>
              <tr className="bg-gray-50"><td className="border border-gray-300 p-3">IRR</td><td className="border border-gray-300 p-3">IRR &gt; Cost of Capital</td><td className="border border-gray-300 p-3">IRR &lt; Cost of Capital</td></tr>
              <tr><td className="border border-gray-300 p-3">PI</td><td className="border border-gray-300 p-3">PI &gt; 1</td><td className="border border-gray-300 p-3">PI &lt; 1</td></tr>
              <tr className="bg-gray-50"><td className="border border-gray-300 p-3">Payback</td><td className="border border-gray-300 p-3">Payback &lt; Cutoff period</td><td className="border border-gray-300 p-3">Payback &gt; Cutoff period</td></tr>
            </tbody>
          </table>
        </div>

        <h2>Exam Tips for TVM Questions</h2>
        <ol>
          <li><strong>Memorize (1.1)² = 1.21 and (1.1)³ = 1.331</strong> — these appear in almost every NPV question with 10% discount rate</li>
          <li><strong>Use Rule of 72 for approximations</strong> — saves 30 seconds on doubling/tripling time questions</li>
          <li><strong>Convert annual rate to monthly for EMI</strong> — divide by 12 (not by 365)</li>
          <li><strong>NPV is the most reliable method</strong> — if NPV and IRR conflict, NPV decision prevails (per theory)</li>
          <li><strong>In the exam, use the on-screen calculator</strong> — don&apos;t waste time on mental math for powers</li>
        </ol>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
          <h3 className="text-blue-900 mt-0">Practice More AFM Numericals</h3>
          <p className="text-blue-800 mb-0">
            Our AFM question bank has 1195+ questions including 400+ numerical problems with step-by-step solutions. Practice until NPV, EMI, and BEP calculations become second nature.
          </p>
        </div>
      </div>
    ),
  },
  {
    slug: 'jaiib-registration-process-fees-2026',
    title: 'JAIIB 2026 Registration Process — Step-by-Step Guide, Fees & Important Dates',
    description: 'Complete walkthrough of the JAIIB registration process on IIBF website: eligibility check, fee payment, admit card download, exam centre selection, and what to do if registration fails.',
    date: '2026-06-15',
    readTime: '8 min read',
    category: 'Exam Info',
    coverImage: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=400&fit=crop',
    content: (
      <div className="prose prose-lg max-w-none">
        <p className="lead text-xl text-gray-700 mb-8">
          The JAIIB registration process can be confusing — especially if your bank&apos;s nodal officer is not responsive. Here is a complete step-by-step walkthrough with screenshots-equivalent descriptions, common issues, and solutions.
        </p>

        <h2>Eligibility Check (Before You Register)</h2>
        <p>Before starting registration, confirm you meet all criteria:</p>
        <ul>
          <li><strong>Employment:</strong> You must be a confirmed employee of a bank that is a member of IIBF. Probationers and contractual staff are typically not eligible.</li>
          <li><strong>IIBF Membership:</strong> Your bank must have enrolled you as an IIBF member. Most banks do this automatically at the time of joining. If unsure, ask your HR department or check the IIBF portal.</li>
          <li><strong>Membership Number:</strong> You need your IIBF membership number (format varies by bank — usually your employee ID or a specific IIBF registration number).</li>
          <li><strong>No concurrent attempt:</strong> You cannot register for JAIIB if you already have a JAIIB registration active (within the 2-year validity window).</li>
        </ul>

        <h2>Step-by-Step Registration Process</h2>

        <h3>Step 1: Access the IIBF Portal</h3>
        <p>Visit <strong>www.iibf.org.in</strong> → Click on &quot;Online Exam&quot; → &quot;Exam Registration&quot; or directly visit the examination registration page. The registration link is typically active 2-3 months before the exam window.</p>

        <h3>Step 2: Login / Create Account</h3>
        <ul>
          <li>If you have an existing IIBF account (from previous IIBF exams or membership), login with your credentials</li>
          <li>If new, register using your bank&apos;s employee code, IIBF membership number, and email address</li>
          <li>Your registered mobile number will receive an OTP for verification</li>
        </ul>

        <h3>Step 3: Select Examination</h3>
        <ul>
          <li>Choose &quot;JAIIB&quot; from the list of available examinations</li>
          <li>Select the exam window (May-June 2026 or November-December 2026)</li>
          <li>You register for all 4 papers together — you cannot register for individual papers in first attempt</li>
        </ul>

        <h3>Step 4: Fill Personal Details</h3>
        <ul>
          <li>Full name (must match your bank records and ID proof exactly)</li>
          <li>Date of birth</li>
          <li>Bank name and branch</li>
          <li>Employee code / staff number</li>
          <li>Contact details (email + mobile — admit card sent here)</li>
          <li>Upload photograph (recent passport size, white background, 20-50 KB, JPEG format)</li>
          <li>Upload signature (on white paper, 10-20 KB, JPEG format)</li>
        </ul>

        <h3>Step 5: Select Exam Centre</h3>
        <ul>
          <li>Choose your preferred city from the dropdown (IIBF has centres in 400+ cities across India)</li>
          <li>Select 3 preferences in order — you are usually allotted your first or second choice</li>
          <li>The exact centre address (school/college name) is mentioned on the admit card, not during registration</li>
          <li><strong>Tip:</strong> Choose a centre close to your home/office. JAIIB is conducted across multiple days — you may have 4 different exam dates for 4 papers.</li>
        </ul>

        <h3>Step 6: Fee Payment</h3>
        <p>Pay the registration fee online:</p>
        <ul>
          <li><strong>Fee for all 4 papers:</strong> ₹3,540 (including GST) — as of 2025-26</li>
          <li><strong>Re-examination fee (per paper):</strong> ₹1,180 (including GST) for papers not cleared in first attempt</li>
          <li><strong>Payment modes:</strong> Credit Card, Debit Card, Net Banking, UPI</li>
          <li><strong>Important:</strong> Fee is non-refundable even if you don&apos;t appear for the exam</li>
          <li><strong>Bank reimbursement:</strong> Most banks reimburse the exam fee upon passing. Check your bank&apos;s policy — some reimburse even if you fail.</li>
        </ul>

        <h3>Step 7: Confirmation & Admit Card</h3>
        <ul>
          <li>After payment, you receive a registration confirmation email with your registration number</li>
          <li>Admit card is available for download 15-20 days before the exam date</li>
          <li>Admit card contains: exam date, time, centre address, your photo, and important instructions</li>
          <li><strong>Print the admit card</strong> — you must carry it to the exam centre</li>
        </ul>

        <h2>Important Dates for JAIIB 2026</h2>
        <div className="not-prose my-6 overflow-x-auto">
          <table className="w-full text-sm border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-3 text-left">Event</th>
                <th className="border border-gray-300 p-3 text-left">May-June 2026 Window</th>
                <th className="border border-gray-300 p-3 text-left">Nov-Dec 2026 Window</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="border border-gray-300 p-3">Registration Opens</td><td className="border border-gray-300 p-3">January 2026</td><td className="border border-gray-300 p-3">July 2026</td></tr>
              <tr className="bg-gray-50"><td className="border border-gray-300 p-3">Registration Closes</td><td className="border border-gray-300 p-3">March 2026</td><td className="border border-gray-300 p-3">September 2026</td></tr>
              <tr><td className="border border-gray-300 p-3">Admit Card Available</td><td className="border border-gray-300 p-3">April 2026</td><td className="border border-gray-300 p-3">October 2026</td></tr>
              <tr className="bg-gray-50"><td className="border border-gray-300 p-3">Exam Dates</td><td className="border border-gray-300 p-3">May-June 2026</td><td className="border border-gray-300 p-3">November-December 2026</td></tr>
              <tr><td className="border border-gray-300 p-3">Results</td><td className="border border-gray-300 p-3">July-August 2026</td><td className="border border-gray-300 p-3">January-February 2027</td></tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm text-gray-500 italic">* Dates are tentative based on past patterns. Check iibf.org.in for official notifications.</p>

        <h2>Common Registration Issues & Solutions</h2>

        <h3>Issue 1: &quot;Membership number not found&quot;</h3>
        <p><strong>Solution:</strong> Contact your bank&apos;s IIBF nodal officer (usually in the Staff Training College or HR department). They need to upload your membership details to IIBF. This takes 3-5 working days.</p>

        <h3>Issue 2: Payment failed but amount debited</h3>
        <p><strong>Solution:</strong> Wait 48-72 hours — the amount usually auto-refunds. If not, contact IIBF helpline with your transaction ID and bank statement screenshot. Do NOT attempt a second payment without confirming the first one failed.</p>

        <h3>Issue 3: Photo/signature upload rejected</h3>
        <p><strong>Solution:</strong> Ensure photo is exactly passport-size face (80% face coverage), white background, JPEG format, 20-50 KB. Signature must be on plain white paper, clear and within the border, 10-20 KB JPEG.</p>

        <h3>Issue 4: &quot;Already registered for this exam&quot;</h3>
        <p><strong>Solution:</strong> This means you have an existing active registration. If you passed some papers in the previous attempt, you can register for only the remaining papers using the &quot;Re-examination&quot; option.</p>

        <h3>Issue 5: Name mismatch between bank records and ID proof</h3>
        <p><strong>Solution:</strong> The name must match exactly. If your bank records say &quot;RAJESH KUMAR&quot; but your Aadhaar says &quot;RAJESH KUMAR SINGH&quot;, get either one updated. Alternatively, use a different ID proof that matches.</p>

        <h2>After Registration: What Next?</h2>
        <ol>
          <li><strong>Start studying immediately</strong> — don&apos;t wait for the admit card. The syllabus is fixed and available on IIBF website.</li>
          <li><strong>Order the IIBF textbooks</strong> — buy from IIBF website directly or Amazon. Ensure you get the latest edition (check the year printed on the cover).</li>
          <li><strong>Create a study plan</strong> — allocate 8-12 weeks for complete preparation (see our 12-week study timetable blog post).</li>
          <li><strong>Join a study group</strong> — find colleagues at your branch who are also appearing. Peer discussion helps retention.</li>
          <li><strong>Start mock tests early</strong> — don&apos;t save mock tests for the last week. Start attempting them from Week 3-4 of your preparation.</li>
        </ol>

        <h2>Fee Comparison with Other Banking Exams</h2>
        <div className="not-prose my-6 overflow-x-auto">
          <table className="w-full text-sm border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-3 text-left">Exam</th>
                <th className="border border-gray-300 p-3 text-left">Papers</th>
                <th className="border border-gray-300 p-3 text-left">Fee (incl. GST)</th>
                <th className="border border-gray-300 p-3 text-left">Validity</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="border border-gray-300 p-3 font-bold">JAIIB</td><td className="border border-gray-300 p-3">4</td><td className="border border-gray-300 p-3">₹3,540</td><td className="border border-gray-300 p-3">2 years</td></tr>
              <tr className="bg-gray-50"><td className="border border-gray-300 p-3 font-bold">CAIIB</td><td className="border border-gray-300 p-3">4+1 elective</td><td className="border border-gray-300 p-3">₹4,720</td><td className="border border-gray-300 p-3">2 years</td></tr>
              <tr><td className="border border-gray-300 p-3">Diploma in Banking</td><td className="border border-gray-300 p-3">5</td><td className="border border-gray-300 p-3">₹5,900</td><td className="border border-gray-300 p-3">3 years</td></tr>
            </tbody>
          </table>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
          <h3 className="text-blue-900 mt-0">Start Preparing While You Wait</h3>
          <p className="text-blue-800 mb-0">
            Don&apos;t wait for the admit card to start preparation. Begin practicing with our 3000+ questions aligned to the latest 2026 syllabus. Track your progress across all 4 papers and identify weak areas early.
          </p>
        </div>
      </div>
    ),
  },
];

export default ADDITIONAL_BLOG_POSTS;
