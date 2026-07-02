import React from 'react';
import TopicPageLayout from './TopicPageLayout';

const SlrExplainedPage: React.FC = () => {
  const relatedTopics = [
    { title: 'CRR (Cash Reserve Ratio) Explained', url: '/jaiib/ppb/crr-explained' },
    { title: 'NPA Classification & IRAC Norms', url: '/jaiib/ppb/npa-classification' },
    { title: 'Priority Sector Lending (PSL) Norms', url: '/jaiib/ppb/priority-sector-lending' },
    { title: 'Repo Rate Explained', url: '/jaiib/ppb/repo-rate-explained' },
    { title: 'Basel Norms Explained', url: '/jaiib/ppb/basel-norms' },
  ];

  const content = (
    <div>
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
        SLR (Statutory Liquidity Ratio) Explained — Section 24, Current Rate & Liquid Assets
      </h1>

      <p className="text-lg text-gray-700 mb-6">
        Statutory Liquidity Ratio (SLR) is a critical regulatory requirement that every banking professional must understand thoroughly, and it remains one of the most frequently tested topics in the JAIIB PPB (Principles & Practices of Banking) examination. SLR ensures that banks maintain a minimum proportion of their deposits in the form of liquid assets, thereby safeguarding depositor interests and providing a captive market for government securities. This comprehensive guide covers everything you need to know about SLR — from its legal foundation under Section 24 of the Banking Regulation Act 1949, to the current rate, eligible liquid assets, its impact on credit creation, and how it compares with CRR.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">What is SLR (Statutory Liquidity Ratio)?</h2>
      <p className="text-gray-700 mb-4">
        SLR stands for Statutory Liquidity Ratio. It is the minimum percentage of a bank's Net Demand and Time Liabilities (NDTL) that must be maintained in the form of liquid assets such as cash, gold, and unencumbered approved government securities before the bank extends any credit. Unlike CRR, which requires banks to park cash with the RBI, SLR assets are held by the banks themselves — giving them the dual benefit of meeting regulatory requirements while earning returns on government securities investments.
      </p>
      <p className="text-gray-700 mb-4">
        The primary objectives of SLR are threefold: first, to ensure the solvency of banks by requiring them to hold high-quality liquid assets; second, to control the expansion of bank credit by limiting the resources available for lending; and third, to create a steady demand for government securities, which helps the government finance its fiscal deficit at reasonable interest rates. SLR thus serves both prudential regulation and fiscal management purposes simultaneously.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Legal Framework — Section 24 of the Banking Regulation Act, 1949</h2>
      <p className="text-gray-700 mb-4">
        SLR is governed by Section 24 of the Banking Regulation Act (BR Act), 1949. This section mandates that every banking company shall maintain in India assets as prescribed by the RBI, the value of which shall not at any time be less than a specified percentage of its total NDTL. The RBI has the statutory power to set the SLR rate anywhere between 0% and 40% of NDTL. This wide range gives the RBI significant flexibility to adjust SLR based on prevailing economic conditions.
      </p>
      <p className="text-gray-700 mb-4">
        Key legal provisions include: (a) Section 24 applies to all banking companies, both scheduled and non-scheduled, unlike CRR which applies only to scheduled banks; (b) Non-compliance attracts a penalty of 3% per annum above the Bank Rate on the shortfall amount for the first default, and 5% above the Bank Rate for continued defaults; (c) The RBI can change SLR through a notification in the Official Gazette; (d) Banks are required to report their SLR position to the RBI on a fortnightly basis.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Current SLR Rate (2026)</h2>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-blue-900 font-semibold text-lg">Current SLR Rate: 18.0% of NDTL</p>
        <p className="text-blue-700 text-sm mt-1">The SLR was reduced from 18.25% to 18.0% as part of the gradual normalization process. Unlike CRR, banks earn interest on government securities held for SLR compliance.</p>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">What Counts as Liquid Assets for SLR?</h2>
      <p className="text-gray-700 mb-4">
        Under Section 24 of the BR Act, the following assets qualify as liquid assets for SLR maintenance:
      </p>
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
        <ul className="space-y-2 text-gray-700 text-sm">
          <li><strong>1. Cash:</strong> Cash held in hand by the bank (vault cash) in India. This includes both notes and coins.</li>
          <li><strong>2. Gold:</strong> Gold held by the bank, valued at a price not exceeding the current market price. The gold must be held in India.</li>
          <li><strong>3. Unencumbered Approved Government Securities (G-Secs):</strong> These include Central Government securities, State Development Loans (SDLs), Treasury Bills, and other securities notified by the RBI. The securities must be unencumbered — meaning they are not pledged or hypothecated to any other party.</li>
        </ul>
      </div>
      <p className="text-gray-700 mb-4">
        It is important to note that corporate bonds, bank deposits with other banks, and shares/debentures do NOT qualify as SLR-eligible assets. Only the three categories above — cash, gold, and government securities — are accepted. In practice, the overwhelming majority of SLR compliance (over 95%) is achieved through holdings of government securities, as they provide regular interest income while meeting the regulatory requirement.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">SLR Range — 0% to 40%</h2>
      <p className="text-gray-700 mb-4">
        The Banking Regulation (Amendment) Act, 2007 widened the SLR range to 0% to 40% of NDTL (earlier it was 25% to 40%). This amendment gave the RBI greater flexibility to reduce SLR below 25% if economic conditions warranted it. The current rate of 18% is well within this range, and the RBI has been gradually reducing SLR over the years to free up more resources for bank lending and to align with the Liquidity Coverage Ratio (LCR) framework under Basel III.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Impact of SLR on Credit Creation</h2>
      <p className="text-gray-700 mb-4">
        SLR directly impacts a bank's ability to create credit. When combined with CRR, these two ratios determine what portion of deposits is actually available for lending. With CRR at 4% and SLR at 18%, a total of 22% of every deposit rupee is locked up in reserves, leaving only 78% available for credit creation. If the RBI increases SLR, the lendable resources shrink further, leading to a tighter credit environment and potentially higher lending rates.
      </p>
      <p className="text-gray-700 mb-4">
        The effective lending capacity of the banking system can be expressed as: Lendable Resources = NDTL × (1 - CRR% - SLR%). This means that for every ₹100 deposited, only ₹78 can be deployed as loans. However, since SLR investments in government securities earn interest (unlike CRR), the opportunity cost of SLR is lower than that of CRR. Banks typically earn 6-7% on government securities, which partially offsets the impact of locked-up funds.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">CRR vs SLR — Comprehensive Comparison</h2>
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
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">Governing Law</td>
              <td className="px-4 py-3 text-sm text-gray-700">Section 42, RBI Act 1934</td>
              <td className="px-4 py-3 text-sm text-gray-700">Section 24, BR Act 1949</td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">Current Rate</td>
              <td className="px-4 py-3 text-sm text-gray-700">4.0%</td>
              <td className="px-4 py-3 text-sm text-gray-700">18.0%</td>
            </tr>
            <tr className="border-b bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">Statutory Range</td>
              <td className="px-4 py-3 text-sm text-gray-700">3% to 15%</td>
              <td className="px-4 py-3 text-sm text-gray-700">0% to 40%</td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">Maintained As</td>
              <td className="px-4 py-3 text-sm text-gray-700">Cash only with RBI</td>
              <td className="px-4 py-3 text-sm text-gray-700">Cash, gold, or G-Secs (held by bank)</td>
            </tr>
            <tr className="border-b bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">Interest Earned</td>
              <td className="px-4 py-3 text-sm text-gray-700">No interest</td>
              <td className="px-4 py-3 text-sm text-gray-700">Yes (on G-Secs)</td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">Where Maintained</td>
              <td className="px-4 py-3 text-sm text-gray-700">With the RBI</td>
              <td className="px-4 py-3 text-sm text-gray-700">With the bank itself</td>
            </tr>
            <tr className="border-b bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">Applicability</td>
              <td className="px-4 py-3 text-sm text-gray-700">Scheduled banks only</td>
              <td className="px-4 py-3 text-sm text-gray-700">All banking companies</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">Primary Purpose</td>
              <td className="px-4 py-3 text-sm text-gray-700">Control money supply</td>
              <td className="px-4 py-3 text-sm text-gray-700">Ensure solvency & fund govt borrowing</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Historical SLR Changes</h2>
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Period</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">SLR Rate</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Remarks</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="px-4 py-3 text-sm text-gray-700">Pre-1990</td>
              <td className="px-4 py-3 text-sm text-gray-700">38.5%</td>
              <td className="px-4 py-3 text-sm text-gray-700">Peak level — limited bank lending capacity</td>
            </tr>
            <tr className="border-b bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-700">1997</td>
              <td className="px-4 py-3 text-sm text-gray-700">25.0%</td>
              <td className="px-4 py-3 text-sm text-gray-700">Post-Narasimham Committee reforms</td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 text-sm text-gray-700">2012</td>
              <td className="px-4 py-3 text-sm text-gray-700">23.0%</td>
              <td className="px-4 py-3 text-sm text-gray-700">Gradual reduction phase</td>
            </tr>
            <tr className="border-b bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-700">2017</td>
              <td className="px-4 py-3 text-sm text-gray-700">19.5%</td>
              <td className="px-4 py-3 text-sm text-gray-700">Alignment with Basel III LCR norms</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm text-gray-700">2024-2026</td>
              <td className="px-4 py-3 text-sm text-gray-700">18.0%</td>
              <td className="px-4 py-3 text-sm text-gray-700">Current rate — lowest in decades</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Key Points for JAIIB Exam</h2>
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
        <ul className="space-y-2 text-amber-900 text-sm">
          <li>• SLR is governed by <strong>Section 24 of the Banking Regulation Act, 1949</strong></li>
          <li>• Liquid assets = <strong>Cash + Gold + Unencumbered Government Securities</strong></li>
          <li>• Current SLR rate is <strong>18%</strong> of NDTL</li>
          <li>• SLR range is <strong>0% to 40%</strong> (amended in 2007)</li>
          <li>• SLR applies to <strong>all banking companies</strong> (both scheduled and non-scheduled)</li>
          <li>• Banks <strong>earn interest</strong> on government securities held for SLR</li>
          <li>• Corporate bonds and shares are <strong>NOT</strong> eligible for SLR</li>
          <li>• Penalty: Bank Rate + 3% (first default), Bank Rate + 5% (continued default)</li>
        </ul>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Sample MCQs for JAIIB PPB</h2>

      <div className="space-y-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <p className="font-semibold text-gray-900 mb-3">Q1. SLR is governed by which section of which Act?</p>
          <ul className="space-y-1 text-gray-700 mb-3 text-sm">
            <li>(a) Section 42, RBI Act 1934</li>
            <li>(b) Section 24, Banking Regulation Act 1949</li>
            <li>(c) Section 18, RBI Act 1934</li>
            <li>(d) Section 36, Banking Regulation Act 1949</li>
          </ul>
          <div className="bg-green-50 border border-green-200 rounded p-3">
            <p className="text-green-900 text-sm"><strong>Answer: (b)</strong> — Section 24 of the Banking Regulation Act 1949 mandates every banking company to maintain SLR. Section 42 of RBI Act deals with CRR for scheduled banks.</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <p className="font-semibold text-gray-900 mb-3">Q2. Which of the following is NOT a liquid asset eligible for SLR maintenance?</p>
          <ul className="space-y-1 text-gray-700 mb-3 text-sm">
            <li>(a) Gold held by the bank</li>
            <li>(b) Central Government securities</li>
            <li>(c) Corporate bonds rated AAA</li>
            <li>(d) State Development Loans</li>
          </ul>
          <div className="bg-green-50 border border-green-200 rounded p-3">
            <p className="text-green-900 text-sm"><strong>Answer: (c)</strong> — Corporate bonds, regardless of their credit rating, do NOT qualify as liquid assets for SLR. Only cash, gold, and unencumbered approved government securities (including SDLs) are eligible.</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <p className="font-semibold text-gray-900 mb-3">Q3. The RBI can prescribe SLR within the range of:</p>
          <ul className="space-y-1 text-gray-700 mb-3 text-sm">
            <li>(a) 3% to 15% of NDTL</li>
            <li>(b) 25% to 40% of NDTL</li>
            <li>(c) 0% to 40% of NDTL</li>
            <li>(d) 0% to 25% of NDTL</li>
          </ul>
          <div className="bg-green-50 border border-green-200 rounded p-3">
            <p className="text-green-900 text-sm"><strong>Answer: (c)</strong> — After the 2007 amendment to Section 24 of the BR Act, the RBI can prescribe SLR anywhere between 0% and 40% of NDTL. The earlier range was 25% to 40%.</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <TopicPageLayout
      title="SLR (Statutory Liquidity Ratio) Explained — Section 24, Current Rate 18% | JAIIB PPB"
      description="Complete guide to SLR for JAIIB PPB 2026. Learn Statutory Liquidity Ratio definition, Section 24 BR Act, current rate 18%, liquid assets (cash/gold/G-Secs), CRR vs SLR table, and practice MCQs."
      canonical="https://mockmaster.fun/jaiib/ppb/slr-explained"
      keywords="SLR full form, statutory liquidity ratio, SLR current rate 2026, Section 24 BR Act, SLR liquid assets, CRR vs SLR, JAIIB PPB"
      breadcrumb={[
        { label: 'Home', url: '/' },
        { label: 'JAIIB', url: '/practice-tests' },
        { label: 'PPB', url: '/practice-tests/ppb' },
        { label: 'SLR Explained' },
      ]}
      content={content}
      relatedTopics={relatedTopics}
      lastUpdated="June 2026"
    />
  );
};

export default SlrExplainedPage;
