import React from 'react';
import TopicPageLayout from './TopicPageLayout';

const CrrExplainedPage: React.FC = () => {
  const relatedTopics = [
    { title: 'NPA Classification & IRAC Norms', url: '/jaiib/ppb/npa-classification' },
    { title: 'Priority Sector Lending (PSL) Norms', url: '/jaiib/ppb/priority-sector-lending' },
    { title: 'NPV & IRR — Capital Budgeting', url: '/jaiib/afm/npv-irr-explained' },
    { title: 'SARFAESI Act 2002 Explained', url: '/jaiib/ppb/sarfaesi-act' },
  ];

  const content = (
    <div>
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
        CRR (Cash Reserve Ratio) Explained — Definition, Current Rate & Formula
      </h1>

      <p className="text-lg text-gray-700 mb-6">
        Cash Reserve Ratio (CRR) is one of the most fundamental concepts in Indian banking and a high-weightage topic in the JAIIB PPB (Principles & Practices of Banking) examination. Understanding CRR is essential for every banking professional because it directly impacts a bank's lending capacity and the money supply in the economy. In this comprehensive guide, we explain CRR from the ground up — its definition, the legal framework, current rate, formula for calculation, its impact on monetary policy, and how it differs from SLR.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">What is CRR (Cash Reserve Ratio)?</h2>
      <p className="text-gray-700 mb-4">
        CRR stands for Cash Reserve Ratio. It is the percentage of a bank's total Net Demand and Time Liabilities (NDTL) that must be maintained as cash deposits with the Reserve Bank of India (RBI). Banks cannot use this money for lending or investment purposes — it must remain parked with the RBI at all times.
      </p>
      <p className="text-gray-700 mb-4">
        The primary purpose of CRR is to ensure that banks always have a minimum amount of reserves available to meet withdrawal demands from depositors. Additionally, CRR serves as a powerful monetary policy tool that the RBI uses to control liquidity in the banking system. When the RBI increases CRR, banks have less money available to lend, which tightens liquidity. Conversely, when CRR is reduced, more funds become available for lending, boosting liquidity.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Legal Framework — Section 42 of the RBI Act, 1934</h2>
      <p className="text-gray-700 mb-4">
        CRR is governed by Section 42 of the Reserve Bank of India Act, 1934. Under this section, every scheduled bank is required to maintain with the RBI a minimum cash balance. The RBI has the power to prescribe the CRR percentage, which can range between 3% and 15% of total NDTL, though in practice it has mostly been between 3% and 9% in recent decades.
      </p>
      <p className="text-gray-700 mb-4">
        Key legal provisions include: (a) The RBI can change CRR without prior notice to banks; (b) Non-compliance attracts penal interest at the Bank Rate plus 3% for the first default and Bank Rate plus 5% for subsequent defaults; (c) CRR maintenance is calculated on a fortnightly basis based on the reporting Friday data.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Current CRR Rate (2026)</h2>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-blue-900 font-semibold text-lg">Current CRR Rate: 4.0% of NDTL</p>
        <p className="text-blue-700 text-sm mt-1">Effective from the latest RBI monetary policy review. Banks earn no interest on CRR balances maintained with the RBI.</p>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">CRR Formula & Calculation</h2>
      <p className="text-gray-700 mb-4">
        The formula for calculating the CRR amount that a bank must maintain is straightforward:
      </p>
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 font-mono text-center">
        <p className="text-lg font-semibold text-gray-900">CRR Amount = NDTL × (CRR% / 100)</p>
      </div>
      <p className="text-gray-700 mb-4">
        For example, if a bank has total NDTL of ₹10,00,000 crore and the CRR rate is 4%, the bank must maintain ₹40,000 crore as cash balance with the RBI. This is computed on a fortnightly average basis — meaning the bank must maintain the required CRR balance on average over the reporting fortnight, though on any given day it cannot fall below 90% of the required level.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Understanding NDTL (Net Demand and Time Liabilities)</h2>
      <p className="text-gray-700 mb-4">
        NDTL is the total of a bank's demand liabilities (savings account balances, current account balances) and time liabilities (fixed deposits, recurring deposits) net of inter-bank deposits. This is the base figure on which CRR (and SLR) are calculated. Banks report their NDTL to the RBI every fortnight using the Section 42 return.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">How CRR Affects Money Supply</h2>
      <p className="text-gray-700 mb-4">
        CRR is inversely related to the credit creation capacity of banks through the money multiplier effect. The theoretical money multiplier is calculated as:
      </p>
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 font-mono text-center">
        <p className="text-lg font-semibold text-gray-900">Money Multiplier = 1 / CRR (in decimal)</p>
      </div>
      <p className="text-gray-700 mb-4">
        At a CRR of 4%, the theoretical money multiplier is 1/0.04 = 25. This means every ₹1 of deposit can theoretically generate up to ₹25 of money supply through repeated lending and re-depositing. In practice, the actual multiplier is lower due to SLR requirements, excess reserves held by banks, and currency leakage from the banking system.
      </p>
      <p className="text-gray-700 mb-4">
        When the RBI increases CRR by even 0.5%, it can suck out tens of thousands of crores from the banking system overnight. For example, with total banking system NDTL of approximately ₹200 lakh crore, a 0.5% CRR hike withdraws ₹1 lakh crore from the system. This makes CRR a blunt but effective tool for managing systemic liquidity.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">CRR vs SLR — Key Differences</h2>
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Parameter</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">CRR</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">SLR</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">Full Form</td>
              <td className="px-4 py-3 text-sm text-gray-700">Cash Reserve Ratio</td>
              <td className="px-4 py-3 text-sm text-gray-700">Statutory Liquidity Ratio</td>
            </tr>
            <tr className="border-b bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">Governing Section</td>
              <td className="px-4 py-3 text-sm text-gray-700">Section 42, RBI Act 1934</td>
              <td className="px-4 py-3 text-sm text-gray-700">Section 24, Banking Regulation Act 1949</td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">Current Rate</td>
              <td className="px-4 py-3 text-sm text-gray-700">4.0%</td>
              <td className="px-4 py-3 text-sm text-gray-700">18.0%</td>
            </tr>
            <tr className="border-b bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">Maintained As</td>
              <td className="px-4 py-3 text-sm text-gray-700">Cash with RBI</td>
              <td className="px-4 py-3 text-sm text-gray-700">Gold, cash, or approved government securities</td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">Interest Earned</td>
              <td className="px-4 py-3 text-sm text-gray-700">No interest</td>
              <td className="px-4 py-3 text-sm text-gray-700">Yes (on government securities)</td>
            </tr>
            <tr className="border-b bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">Purpose</td>
              <td className="px-4 py-3 text-sm text-gray-700">Control money supply & ensure liquidity</td>
              <td className="px-4 py-3 text-sm text-gray-700">Ensure solvency & fund govt borrowing</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">Applicable To</td>
              <td className="px-4 py-3 text-sm text-gray-700">Scheduled commercial banks</td>
              <td className="px-4 py-3 text-sm text-gray-700">All banks (scheduled & non-scheduled)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Historical CRR Rates in India</h2>
      <p className="text-gray-700 mb-4">
        CRR in India has varied significantly over the decades. In the early 1990s, CRR was as high as 15% as the RBI attempted to control inflation and manage liquidity during economic liberalization. Post-reforms, CRR was gradually reduced. In 2020, during the COVID-19 pandemic, the RBI cut CRR to 3% — the lowest in over 50 years — to infuse massive liquidity into the banking system. It was subsequently normalized back to 4.5% and has been at 4.0% as of the latest monetary policy review.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Key Points for JAIIB Exam</h2>
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
        <ul className="space-y-2 text-amber-900 text-sm">
          <li>• CRR is maintained as <strong>cash only</strong> with RBI — not gold, not securities</li>
          <li>• Banks earn <strong>zero interest</strong> on CRR balances (changed in 2007 — earlier RBI paid interest)</li>
          <li>• CRR is computed on a <strong>fortnightly average basis</strong>, not daily</li>
          <li>• Minimum daily requirement is <strong>90%</strong> of required CRR (daily minimum)</li>
          <li>• CRR applies only to <strong>scheduled commercial banks</strong> (Section 42)</li>
          <li>• RBI can set CRR between <strong>3% to 15%</strong> of NDTL</li>
          <li>• CRR changes affect the <strong>money multiplier</strong> and credit creation capacity</li>
          <li>• Penalty for shortfall: Bank Rate + 3% (first default), Bank Rate + 5% (subsequent)</li>
        </ul>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Sample MCQs for JAIIB PPB</h2>

      <div className="space-y-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <p className="font-semibold text-gray-900 mb-3">Q1. CRR is governed by which section of which Act?</p>
          <ul className="space-y-1 text-gray-700 mb-3 text-sm">
            <li>(a) Section 24, Banking Regulation Act 1949</li>
            <li>(b) Section 42, RBI Act 1934</li>
            <li>(c) Section 18, Banking Regulation Act 1949</li>
            <li>(d) Section 35, RBI Act 1934</li>
          </ul>
          <div className="bg-green-50 border border-green-200 rounded p-3">
            <p className="text-green-900 text-sm"><strong>Answer: (b)</strong> — Section 42 of the RBI Act 1934 empowers the RBI to prescribe the CRR that scheduled banks must maintain. Section 24 of the BR Act deals with SLR.</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <p className="font-semibold text-gray-900 mb-3">Q2. A bank has NDTL of ₹5,00,000 crore. At the current CRR of 4%, how much must it maintain with RBI?</p>
          <ul className="space-y-1 text-gray-700 mb-3 text-sm">
            <li>(a) ₹10,000 crore</li>
            <li>(b) ₹20,000 crore</li>
            <li>(c) ₹25,000 crore</li>
            <li>(d) ₹40,000 crore</li>
          </ul>
          <div className="bg-green-50 border border-green-200 rounded p-3">
            <p className="text-green-900 text-sm"><strong>Answer: (b)</strong> — CRR amount = ₹5,00,000 crore × 4/100 = ₹20,000 crore. The entire amount is held as cash with the RBI with no interest earned.</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <p className="font-semibold text-gray-900 mb-3">Q3. Which of the following statements about CRR is INCORRECT?</p>
          <ul className="space-y-1 text-gray-700 mb-3 text-sm">
            <li>(a) CRR can be maintained in the form of cash and gold</li>
            <li>(b) Banks earn no interest on CRR balances</li>
            <li>(c) CRR is calculated on NDTL</li>
            <li>(d) A CRR increase reduces the credit creation capacity of banks</li>
          </ul>
          <div className="bg-green-50 border border-green-200 rounded p-3">
            <p className="text-green-900 text-sm"><strong>Answer: (a)</strong> — CRR must be maintained ONLY as cash with RBI. Gold is allowed for SLR maintenance but not for CRR. This is a common trick question in JAIIB exams.</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <p className="font-semibold text-gray-900 mb-3">Q4. The minimum daily CRR balance that a bank must maintain is:</p>
          <ul className="space-y-1 text-gray-700 mb-3 text-sm">
            <li>(a) 70% of required CRR</li>
            <li>(b) 80% of required CRR</li>
            <li>(c) 90% of required CRR</li>
            <li>(d) 100% of required CRR every day</li>
          </ul>
          <div className="bg-green-50 border border-green-200 rounded p-3">
            <p className="text-green-900 text-sm"><strong>Answer: (c)</strong> — While CRR is computed on a fortnightly average basis, banks must maintain at least 90% of the required CRR on each day of the fortnight. This allows slight flexibility for daily fluctuations.</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <TopicPageLayout
      title="CRR (Cash Reserve Ratio) Explained — Definition, Current Rate, Formula | JAIIB PPB"
      description="Complete guide to CRR for JAIIB PPB 2026. Learn the Cash Reserve Ratio definition, current rate (4.0%), formula, Section 42 of RBI Act, CRR vs SLR comparison, and practice MCQs."
      canonical="https://mockmaster.fun/jaiib/ppb/crr-explained"
      keywords="CRR full form, cash reserve ratio, CRR current rate 2026, CRR explained for JAIIB, CRR vs SLR, NDTL"
      breadcrumb={[
        { label: 'Home', url: '/' },
        { label: 'JAIIB', url: '/practice-tests' },
        { label: 'PPB', url: '/practice-tests/ppb' },
        { label: 'CRR Explained' },
      ]}
      content={content}
      relatedTopics={relatedTopics}
      lastUpdated="June 2026"
    />
  );
};

export default CrrExplainedPage;
