import React from 'react';
import TopicPageLayout from './TopicPageLayout';

const PriorityLendingPage: React.FC = () => {
  const relatedTopics = [
    { title: 'CRR (Cash Reserve Ratio) Explained', url: '/jaiib/ppb/crr-explained' },
    { title: 'NPA Classification & IRAC Norms', url: '/jaiib/ppb/npa-classification' },
    { title: 'NPV & IRR — Capital Budgeting', url: '/jaiib/afm/npv-irr-explained' },
    { title: 'SARFAESI Act 2002 Explained', url: '/jaiib/ppb/sarfaesi-act' },
  ];

  const content = (
    <div>
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
        Priority Sector Lending (PSL) Norms 2026 — Targets, Sub-limits & PSLC
      </h1>

      <p className="text-lg text-gray-700 mb-6">
        Priority Sector Lending (PSL) is a mandated framework by the Reserve Bank of India that requires banks to allocate a specified portion of their lending to sectors critical for economic development and social welfare. The PSL guidelines ensure that bank credit flows adequately to agriculture, micro and small enterprises, education, housing, and other underserved sectors. This topic is heavily tested in the JAIIB PPB paper, and understanding PSL targets, sub-limits, eligible categories, and the Priority Sector Lending Certificate (PSLC) mechanism is essential for exam success.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">What is Priority Sector Lending?</h2>
      <p className="text-gray-700 mb-4">
        Priority Sector Lending refers to lending by banks to those sectors of the economy which, though viable and creditworthy, may not receive timely and adequate credit in the absence of special dispensation. The RBI directs banks to ensure that a minimum percentage of their Adjusted Net Bank Credit (ANBC) or Credit Equivalent Amount of Off-Balance Sheet Exposures (CEOBE), whichever is higher, is directed to priority sectors. The overall PSL target is 40% of ANBC for domestic scheduled commercial banks and foreign banks with 20 or more branches.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">PSL Targets and Sub-Targets</h2>
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Category</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Target (% of ANBC)</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Details</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">Total Priority Sector</td>
              <td className="px-4 py-3 text-sm text-gray-700">40%</td>
              <td className="px-4 py-3 text-sm text-gray-700">Of ANBC or CEOBE, whichever is higher</td>
            </tr>
            <tr className="border-b bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">Agriculture</td>
              <td className="px-4 py-3 text-sm text-gray-700">18%</td>
              <td className="px-4 py-3 text-sm text-gray-700">Of which 10% must be Small & Marginal Farmers</td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">Micro Enterprises</td>
              <td className="px-4 py-3 text-sm text-gray-700">7.5%</td>
              <td className="px-4 py-3 text-sm text-gray-700">Micro enterprises as defined under MSMED Act</td>
            </tr>
            <tr className="border-b bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">Weaker Sections</td>
              <td className="px-4 py-3 text-sm text-gray-700">12%</td>
              <td className="px-4 py-3 text-sm text-gray-700">Includes SCs, STs, women, minorities, etc.</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">Small & Marginal Farmers</td>
              <td className="px-4 py-3 text-sm text-gray-700">10%</td>
              <td className="px-4 py-3 text-sm text-gray-700">Sub-target within agriculture (landholding ≤ 2 hectares)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Eligible Categories under Priority Sector</h2>
      <p className="text-gray-700 mb-4">
        The RBI has defined eight categories that qualify as priority sector lending. Each category has specific eligibility criteria and loan limits:
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-2">1. Agriculture</h4>
          <p className="text-sm text-blue-800">Farm credit, crop loans, agri-infrastructure, ancillary activities. Individual farmer limit: ₹2 crore for infrastructure.</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-2">2. Micro, Small & Medium Enterprises</h4>
          <p className="text-sm text-blue-800">Manufacturing and service enterprises as per MSMED Act 2006. Revised limits apply from July 2020.</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-2">3. Education</h4>
          <p className="text-sm text-blue-800">Loans up to ₹20 lakh for studies in India and abroad, granted to individuals by banks.</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-2">4. Housing</h4>
          <p className="text-sm text-blue-800">Loans up to ₹35 lakh (metro) / ₹25 lakh (non-metro) for dwelling units costing up to ₹45 lakh / ₹30 lakh.</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <h4 className="font-semibold text-green-900 mb-2">5. Export Credit</h4>
          <p className="text-sm text-green-800">Incremental export credit over corresponding date of the preceding year, up to 2% of ANBC.</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <h4 className="font-semibold text-green-900 mb-2">6. Social Infrastructure</h4>
          <p className="text-sm text-green-800">Loans up to ₹5 crore for schools, health care facilities, drinking water, sanitation.</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <h4 className="font-semibold text-green-900 mb-2">7. Renewable Energy</h4>
          <p className="text-sm text-green-800">Loans up to ₹30 crore for solar, biomass, wind mills, micro-hydel plants, and non-conventional energy.</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <h4 className="font-semibold text-green-900 mb-2">8. Others</h4>
          <p className="text-sm text-green-800">Personal loans to weaker sections, distressed persons, and state-sponsored organizations.</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Weaker Sections — Who Qualifies?</h2>
      <p className="text-gray-700 mb-4">
        The weaker sections category (12% of ANBC) includes: Small and Marginal Farmers (landholding ≤ 2 hectares), artisans, village and cottage industries with individual credit limits up to ₹1 lakh, beneficiaries under various government schemes (NRLM, NULM, PMEGP), Scheduled Castes and Scheduled Tribes, Beneficiaries of Differential Rate of Interest (DRI) scheme, Self Help Groups (SHGs), distressed farmers indebted to non-institutional lenders, persons with disabilities, overdraft limits under PMJDY accounts, and minorities as notified by the government.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">PSLC (Priority Sector Lending Certificate) Mechanism</h2>
      <p className="text-gray-700 mb-4">
        The RBI introduced the Priority Sector Lending Certificate (PSLC) mechanism in April 2016 to enable banks to achieve their PSL targets and sub-targets through a market-based mechanism. Banks that have surplus in any PSL category can sell PSLCs to banks that face a shortfall. Key features of the PSLC mechanism include:
      </p>
      <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
        <li><strong>Trading Platform:</strong> PSLCs are traded on the e-Kuber platform of the RBI</li>
        <li><strong>Four Types:</strong> PSLC-Agriculture, PSLC-Small & Marginal Farmers, PSLC-Micro Enterprises, PSLC-General</li>
        <li><strong>No Loan Transfer:</strong> Only the PSL classification benefit is transferred; the underlying loan remains with the selling bank</li>
        <li><strong>Validity:</strong> PSLCs are valid from April 1 to March 31 of a financial year</li>
        <li><strong>Participants:</strong> All scheduled commercial banks, Regional Rural Banks (RRBs), small finance banks, and local area banks</li>
        <li><strong>Price Discovery:</strong> Market-determined through bidding on e-Kuber; no cap on fee</li>
      </ul>
      <p className="text-gray-700 mb-4">
        The PSLC mechanism has been a game-changer for smaller banks and RRBs that traditionally have surplus PSL credit due to their rural focus. These banks can now earn fee income by selling PSLCs to large commercial banks or foreign banks that may find it difficult to meet sub-targets organically.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Foreign Bank PSL Targets</h2>
      <p className="text-gray-700 mb-4">
        The PSL framework treats foreign banks differently based on their branch count in India:
      </p>
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Bank Type</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Total PSL Target</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Sub-targets</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">Foreign banks (20+ branches)</td>
              <td className="px-4 py-3 text-sm text-gray-700">40%</td>
              <td className="px-4 py-3 text-sm text-gray-700">Same as domestic banks (all sub-targets apply)</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">Foreign banks (&lt;20 branches)</td>
              <td className="px-4 py-3 text-sm text-gray-700">40%</td>
              <td className="px-4 py-3 text-sm text-gray-700">No sub-targets; flexible allocation within 40%</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Non-Achievement of PSL Targets</h2>
      <p className="text-gray-700 mb-4">
        Banks that fail to meet their PSL targets are required to deposit the shortfall amount into specific funds managed by NABARD and SIDBI. These include: the Rural Infrastructure Development Fund (RIDF) maintained by NABARD, the Micro Enterprises Development Fund (MEDF) maintained by SIDBI, and other funds as prescribed. The interest earned on these deposits is lower than market rates, effectively penalizing the bank for non-compliance. Currently, the interest rate on RIDF deposits is the Bank Rate minus 3 percentage points, making it significantly below what banks could earn by lending.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Recent Changes and Updates</h2>
      <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
        <li>Revised housing loan limits for PSL classification effective from 2024</li>
        <li>Enhanced focus on renewable energy lending with higher individual limits</li>
        <li>Start-ups now eligible under micro enterprise or small enterprise categories if they meet MSMED criteria</li>
        <li>Bank lending to registered NBFCs (other than MFIs) for on-lending to agriculture, MSEs, and housing is classified under PSL subject to conditions</li>
        <li>Loans to farmers through Farmer Producer Organizations (FPOs) are eligible under agriculture PSL</li>
      </ul>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Key Points for JAIIB Exam</h2>
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
        <ul className="space-y-2 text-amber-900 text-sm">
          <li>• Total PSL target: <strong>40% of ANBC</strong> (or CEOBE, whichever is higher)</li>
          <li>• Agriculture sub-target: <strong>18%</strong> (of which 10% to Small & Marginal Farmers)</li>
          <li>• Micro Enterprises sub-target: <strong>7.5%</strong></li>
          <li>• Weaker Sections sub-target: <strong>12%</strong></li>
          <li>• PSLCs are traded on <strong>e-Kuber platform</strong> of RBI</li>
          <li>• Shortfall is deposited in <strong>RIDF (NABARD)</strong> and MEDF (SIDBI)</li>
          <li>• Education loans up to <strong>₹20 lakh</strong> qualify as PSL</li>
          <li>• Export credit counts up to <strong>2% of ANBC</strong> as PSL</li>
        </ul>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Sample MCQs for JAIIB PPB</h2>

      <div className="space-y-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <p className="font-semibold text-gray-900 mb-3">Q1. The overall Priority Sector Lending target for domestic scheduled commercial banks is:</p>
          <ul className="space-y-1 text-gray-700 mb-3 text-sm">
            <li>(a) 30% of ANBC</li>
            <li>(b) 35% of ANBC</li>
            <li>(c) 40% of ANBC</li>
            <li>(d) 45% of ANBC</li>
          </ul>
          <div className="bg-green-50 border border-green-200 rounded p-3">
            <p className="text-green-900 text-sm"><strong>Answer: (c)</strong> — The overall PSL target for domestic scheduled commercial banks and foreign banks with 20 or more branches is 40% of ANBC or Credit Equivalent of Off-Balance Sheet Exposures, whichever is higher.</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <p className="font-semibold text-gray-900 mb-3">Q2. The sub-target for lending to Weaker Sections under PSL is:</p>
          <ul className="space-y-1 text-gray-700 mb-3 text-sm">
            <li>(a) 8%</li>
            <li>(b) 10%</li>
            <li>(c) 12%</li>
            <li>(d) 15%</li>
          </ul>
          <div className="bg-green-50 border border-green-200 rounded p-3">
            <p className="text-green-900 text-sm"><strong>Answer: (c)</strong> — Banks must lend at least 12% of ANBC to Weaker Sections, which include Small & Marginal Farmers, SCs, STs, women, minorities, SHGs, persons with disabilities, and beneficiaries under government schemes.</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <p className="font-semibold text-gray-900 mb-3">Q3. Priority Sector Lending Certificates (PSLCs) are traded on:</p>
          <ul className="space-y-1 text-gray-700 mb-3 text-sm">
            <li>(a) NSE platform</li>
            <li>(b) CCIL platform</li>
            <li>(c) RBI's e-Kuber platform</li>
            <li>(d) NABARD portal</li>
          </ul>
          <div className="bg-green-50 border border-green-200 rounded p-3">
            <p className="text-green-900 text-sm"><strong>Answer: (c)</strong> — PSLCs are traded on the RBI's e-Kuber platform. Banks with surplus PSL credit sell certificates to banks with shortfalls. The underlying loan remains with the selling bank; only the classification benefit is transferred.</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <p className="font-semibold text-gray-900 mb-3">Q4. Banks failing to achieve PSL targets must deposit the shortfall amount in:</p>
          <ul className="space-y-1 text-gray-700 mb-3 text-sm">
            <li>(a) Government Treasury</li>
            <li>(b) RIDF with NABARD / MEDF with SIDBI</li>
            <li>(c) RBI's General Account</li>
            <li>(d) Priority Sector Reserve Fund</li>
          </ul>
          <div className="bg-green-50 border border-green-200 rounded p-3">
            <p className="text-green-900 text-sm"><strong>Answer: (b)</strong> — Banks not meeting PSL targets deposit the shortfall in RIDF (Rural Infrastructure Development Fund) maintained by NABARD and MEDF (Micro Enterprises Development Fund) maintained by SIDBI. These deposits earn below-market interest rates.</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <TopicPageLayout
      title="Priority Sector Lending (PSL) Norms 2026 — Targets, Sub-limits & PSLC | JAIIB"
      description="Complete guide to Priority Sector Lending norms for JAIIB PPB 2026. Learn PSL targets (40% ANBC), sub-limits for agriculture, micro enterprises, weaker sections, PSLC mechanism, and practice MCQs."
      canonical="https://mockmaster.fun/jaiib/ppb/priority-sector-lending"
      keywords="priority sector lending, PSL norms RBI, PSL target percentage, PSLC, priority sector lending categories, ANBC, weaker sections lending"
      breadcrumb={[
        { label: 'Home', url: '/' },
        { label: 'JAIIB', url: '/practice-tests' },
        { label: 'PPB', url: '/practice-tests/ppb' },
        { label: 'Priority Sector Lending' },
      ]}
      content={content}
      relatedTopics={relatedTopics}
      lastUpdated="June 2026"
    />
  );
};

export default PriorityLendingPage;
