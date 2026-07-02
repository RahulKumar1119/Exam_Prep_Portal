import React from 'react';
import TopicPageLayout from './TopicPageLayout';

const DepositInsurancePage: React.FC = () => {
  const relatedTopics = [
    { title: 'Banking Regulation Act 1949', url: '/jaiib/ppb/banking-regulation-act' },
    { title: 'SLR (Statutory Liquidity Ratio)', url: '/jaiib/ppb/slr-explained' },
    { title: 'KYC/AML Norms', url: '/jaiib/ppb/kyc-norms' },
    { title: 'Financial Inclusion Schemes', url: '/jaiib/rbwm/financial-inclusion' },
    { title: 'NPA Classification & IRAC Norms', url: '/jaiib/ppb/npa-classification' },
  ];

  const content = (
    <div>
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
        Deposit Insurance & DICGC — ₹5 Lakh Coverage, Premium & Claim Process
      </h1>

      <p className="text-lg text-gray-700 mb-6">
        Deposit Insurance is a crucial safety net for bank depositors in India, provided by the
        Deposit Insurance and Credit Guarantee Corporation (DICGC), a wholly-owned subsidiary of the Reserve Bank of India. Following the amendment in 2021, the coverage limit was enhanced to ₹5 lakh per depositor per bank, and a time-bound mechanism for claim settlement was introduced. This topic is frequently tested in JAIIB PPB and understanding DICGC's role, coverage limits, premium structure, eligible deposits, and claim process is essential for all banking professionals.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">What is DICGC?</h2>
      <p className="text-gray-700 mb-4">
        The Deposit Insurance and Credit Guarantee Corporation (DICGC) was established in 1978 by merging the Deposit Insurance Corporation (established 1962) and the Credit Guarantee Corporation of India. It operates under the DICGC Act, 1961. DICGC is a wholly-owned subsidiary of the RBI with an authorized capital of ₹50 crore. Its primary function is to provide insurance to depositors of insured banks against the loss of their deposits in case of bank failure, liquidation, or reconstruction.
      </p>
      <p className="text-gray-700 mb-4">
        The DICGC insures deposits of all commercial banks including regional rural banks, local area banks, foreign banks with branches in India, cooperative banks, and small finance banks. Payment banks are also covered. However, deposits of State/Central Governments, inter-bank deposits, and deposits received outside India are not insured.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Coverage Limit — ₹5 Lakh</h2>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-blue-900 font-semibold text-lg">Maximum Coverage: ₹5,00,000 per depositor per bank</p>
        <p className="text-blue-700 text-sm mt-1">This covers both principal and interest. If a depositor has multiple accounts (savings, FD, current) in the same bank, the aggregate is capped at ₹5 lakh. Deposits in different banks are separately insured.</p>
      </div>
      <p className="text-gray-700 mb-4">
        The ₹5 lakh limit was enhanced from the earlier ₹1 lakh following the 2020 amendment (DICGC Amendment Act, 2021). The coverage includes all deposit accounts — savings, fixed deposit, current account, and recurring deposits. Joint accounts are treated separately from individual accounts of the same depositor. For example, if a person has an individual FD of ₹3 lakh and a joint FD of ₹4 lakh in the same bank, the individual account is fully covered (₹3 lakh), and the joint account is also separately covered up to ₹5 lakh.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Premium Structure</h2>
      <p className="text-gray-700 mb-4">
        The insurance premium is paid by the insured bank (not by depositors). The current premium rate is 12 paise per ₹100 of assessable deposits per annum (i.e., 0.12% per annum). The premium is paid in two half-yearly instalments. Assessable deposits include all deposits except those specifically excluded (government deposits, inter-bank deposits, etc.). Banks cannot recover this premium from their customers.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Eligible vs Non-Eligible Deposits</h2>
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Eligible (Insured)</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Not Eligible (Excluded)</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="px-4 py-3 text-sm text-gray-700">Savings Bank deposits</td>
              <td className="px-4 py-3 text-sm text-gray-700">Deposits of Central/State Governments</td>
            </tr>
            <tr className="border-b bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-700">Fixed Deposits</td>
              <td className="px-4 py-3 text-sm text-gray-700">Inter-bank deposits</td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 text-sm text-gray-700">Current Account deposits</td>
              <td className="px-4 py-3 text-sm text-gray-700">Deposits received outside India</td>
            </tr>
            <tr className="border-b bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-700">Recurring Deposits</td>
              <td className="px-4 py-3 text-sm text-gray-700">Deposits of foreign governments</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm text-gray-700">Deposits in all branches of an insured bank</td>
              <td className="px-4 py-3 text-sm text-gray-700">Any amount due on account of any deposit received outside India</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Claim Process & Timeline (Post-2021 Amendment)</h2>
      <p className="text-gray-700 mb-4">
        The DICGC Amendment Act, 2021 introduced a time-bound settlement mechanism. When a bank is placed under moratorium, restriction, or directed to be wound up, the following timeline applies: (a) Within 45 days of the RBI imposing restrictions, the insured bank must provide DICGC with the list of depositors and amounts due; (b) DICGC must pay the insured amount within 90 days from the date of imposition of restrictions. This ensures depositors don't face prolonged uncertainty during bank stress events.
      </p>
      <p className="text-gray-700 mb-4">
        Prior to this amendment, depositors often had to wait years during bank liquidation proceedings to receive their insured amounts. The 90-day timeline is a landmark reform ensuring prompt access to insured deposits. The DICGC can also seek interim payment from the RBI's Deposit Insurance Fund if needed to meet the timeline.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Key Points for JAIIB Exam</h2>
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
        <ul className="space-y-2 text-amber-900 text-sm">
          <li>• DICGC is a <strong>wholly-owned subsidiary of RBI</strong></li>
          <li>• Coverage limit: <strong>₹5 lakh per depositor per bank</strong> (principal + interest)</li>
          <li>• Premium: <strong>12 paise per ₹100</strong> of assessable deposits per annum</li>
          <li>• Premium paid by <strong>bank</strong>, not depositor</li>
          <li>• Joint accounts are <strong>separately insured</strong> from individual accounts</li>
          <li>• Government deposits and inter-bank deposits are <strong>NOT insured</strong></li>
          <li>• Claim must be settled within <strong>90 days</strong> of restriction (post-2021 amendment)</li>
          <li>• DICGC covers deposits in <strong>all currencies</strong> received in India</li>
          <li>• Different banks = <strong>separate insurance</strong> (₹5 lakh each)</li>
        </ul>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Sample MCQs for JAIIB PPB</h2>

      <div className="space-y-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <p className="font-semibold text-gray-900 mb-3">Q1. The maximum deposit insurance coverage under DICGC is:</p>
          <ul className="space-y-1 text-gray-700 mb-3 text-sm">
            <li>(a) ₹1 lakh per depositor per bank</li>
            <li>(b) ₹2 lakh per depositor per bank</li>
            <li>(c) ₹5 lakh per depositor per bank</li>
            <li>(d) ₹10 lakh per depositor per bank</li>
          </ul>
          <div className="bg-green-50 border border-green-200 rounded p-3">
            <p className="text-green-900 text-sm"><strong>Answer: (c)</strong> — DICGC provides insurance coverage of ₹5 lakh per depositor per bank, covering both principal and interest. This was enhanced from ₹1 lakh in 2020.</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <p className="font-semibold text-gray-900 mb-3">Q2. The premium for deposit insurance is paid by:</p>
          <ul className="space-y-1 text-gray-700 mb-3 text-sm">
            <li>(a) The depositor</li>
            <li>(b) The insured bank</li>
            <li>(c) Shared equally between bank and depositor</li>
            <li>(d) The Reserve Bank of India</li>
          </ul>
          <div className="bg-green-50 border border-green-200 rounded p-3">
            <p className="text-green-900 text-sm"><strong>Answer: (b)</strong> — The insurance premium is paid entirely by the insured bank at the rate of 12 paise per ₹100 of assessable deposits. Banks cannot recover this from depositors.</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <p className="font-semibold text-gray-900 mb-3">Q3. Which of the following deposits is NOT covered under DICGC insurance?</p>
          <ul className="space-y-1 text-gray-700 mb-3 text-sm">
            <li>(a) Savings bank deposit</li>
            <li>(b) Fixed deposit of an individual</li>
            <li>(c) Inter-bank deposit</li>
            <li>(d) Recurring deposit</li>
          </ul>
          <div className="bg-green-50 border border-green-200 rounded p-3">
            <p className="text-green-900 text-sm"><strong>Answer: (c)</strong> — Inter-bank deposits, government deposits, and deposits received outside India are not insured by DICGC.</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <p className="font-semibold text-gray-900 mb-3">Q4. Under the 2021 DICGC Amendment, insured deposits must be paid within:</p>
          <ul className="space-y-1 text-gray-700 mb-3 text-sm">
            <li>(a) 30 days of bank closure</li>
            <li>(b) 90 days of imposition of restrictions</li>
            <li>(c) 180 days of liquidation order</li>
            <li>(d) 1 year of moratorium</li>
          </ul>
          <div className="bg-green-50 border border-green-200 rounded p-3">
            <p className="text-green-900 text-sm"><strong>Answer: (b)</strong> — The 2021 amendment mandates DICGC to pay insured deposits within 90 days from the date of imposition of restrictions by RBI on the bank.</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <TopicPageLayout
      title="Deposit Insurance & DICGC — ₹5 Lakh Coverage, Premium, Claim Process | JAIIB PPB"
      description="Complete guide to DICGC deposit insurance for JAIIB PPB 2026. Learn ₹5 lakh coverage limit, premium rate, eligible deposits, 90-day claim process, and practice MCQs."
      canonical="https://mockmaster.fun/jaiib/ppb/deposit-insurance-dicgc"
      keywords="DICGC deposit insurance, ₹5 lakh coverage, deposit insurance premium, DICGC claim process, eligible deposits DICGC, JAIIB PPB"
      breadcrumb={[
        { label: 'Home', url: '/' },
        { label: 'JAIIB', url: '/practice-tests' },
        { label: 'PPB', url: '/practice-tests/ppb' },
        { label: 'Deposit Insurance (DICGC)' },
      ]}
      content={content}
      relatedTopics={relatedTopics}
      lastUpdated="June 2026"
    />
  );
};

export default DepositInsurancePage;
