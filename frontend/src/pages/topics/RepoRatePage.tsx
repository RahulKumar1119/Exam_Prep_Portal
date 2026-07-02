import React from 'react';
import TopicPageLayout from './TopicPageLayout';

const RepoRatePage: React.FC = () => {
  const relatedTopics = [
    { title: 'CRR (Cash Reserve Ratio) Explained', url: '/jaiib/ppb/crr-explained' },
    { title: 'SLR (Statutory Liquidity Ratio)', url: '/jaiib/ppb/slr-explained' },
    { title: 'Money Supply — M0 to M3', url: '/jaiib/ie-ifs/money-supply' },
    { title: 'Basel III Norms & Capital Adequacy', url: '/jaiib/ppb/basel-norms' },
    { title: 'Home Loan Guide', url: '/jaiib/rbwm/home-loan-guide' },
  ];

  const content = (
    <div>
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
        Repo Rate Explained — LAF Corridor, MSF, SDF & Impact on EMI
      </h1>

      <p className="text-lg text-gray-700 mb-6">
        The Repo Rate is the most widely discussed monetary policy tool of the Reserve Bank of
        India (RBI) and a fundamental concept in the JAIIB PPB and IE&IFS syllabus. It is the rate at which the RBI lends short-term money to commercial banks against government securities. The repo rate sits at the center of the Liquidity Adjustment Facility (LAF) corridor and directly influences the interest rates that banks charge on loans, thereby affecting EMIs of borrowers. This comprehensive guide covers the repo mechanism, the LAF corridor framework including MSF and SDF, reverse repo, and the transmission to retail lending rates.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">What is Repo Rate?</h2>
      <p className="text-gray-700 mb-4">
        Repo stands for "Repurchase Agreement" or "Repurchase Option." It is the rate at which the RBI lends overnight funds to scheduled commercial banks against the collateral of eligible government securities. The bank sells securities to RBI with an agreement to repurchase them the next day (or within a short term) at a predetermined price that includes the interest at repo rate. This is essentially a short-term collateralized loan from the RBI to banks.
      </p>
      <p className="text-gray-700 mb-4">
        The repo rate is decided by the six-member Monetary Policy Committee (MPC) of the RBI, which meets six times a year (bi-monthly). The MPC targets Consumer Price Index (CPI) inflation within a band of 4% ± 2% (2-6%). When inflation rises above target, MPC raises repo rate to discourage borrowing and cool the economy. When growth slows, it cuts repo rate to stimulate lending and economic activity.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The LAF Corridor Framework</h2>
      <p className="text-gray-700 mb-4">
        The Liquidity Adjustment Facility (LAF) corridor is the operating framework for RBI's monetary policy. It consists of three key rates that form a corridor within which the overnight inter-bank call money rate typically moves:
      </p>
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Rate</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Description</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Position in Corridor</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Current Rate</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">MSF (Marginal Standing Facility)</td>
              <td className="px-4 py-3 text-sm text-gray-700">Emergency overnight borrowing from RBI (can dip into SLR)</td>
              <td className="px-4 py-3 text-sm text-gray-700">Ceiling (Repo + 25 bps)</td>
              <td className="px-4 py-3 text-sm text-gray-700">6.75%</td>
            </tr>
            <tr className="border-b bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">Repo Rate</td>
              <td className="px-4 py-3 text-sm text-gray-700">Rate at which RBI lends to banks against G-Secs</td>
              <td className="px-4 py-3 text-sm text-gray-700">Policy Rate (Centre)</td>
              <td className="px-4 py-3 text-sm text-gray-700">6.50%</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">SDF (Standing Deposit Facility)</td>
              <td className="px-4 py-3 text-sm text-gray-700">Rate at which RBI absorbs liquidity without collateral</td>
              <td className="px-4 py-3 text-sm text-gray-700">Floor (Repo - 25 bps)</td>
              <td className="px-4 py-3 text-sm text-gray-700">6.25%</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Standing Deposit Facility (SDF)</h2>
      <p className="text-gray-700 mb-4">
        Introduced in April 2022, the SDF replaced the reverse repo rate as the floor of the LAF corridor. Under SDF, banks can park their surplus funds with the RBI at the SDF rate (currently repo minus 25 basis points) WITHOUT providing any collateral. This gives RBI an uncollateralized tool to absorb excess liquidity. The key advantage of SDF over reverse repo is that RBI doesn't need government securities to conduct the operation, giving it greater flexibility during periods of excess liquidity.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Marginal Standing Facility (MSF)</h2>
      <p className="text-gray-700 mb-4">
        MSF is the emergency lending window available to scheduled commercial banks. Banks can borrow overnight from RBI at MSF rate (repo + 25 bps) when they have exhausted their regular LAF borrowing limits. Under MSF, banks can dip into their SLR securities by up to 2% of NDTL. This facility was introduced in 2011 and acts as the ceiling of the LAF corridor. MSF is available on all days (including Saturdays) for amounts in multiples of ₹1 crore.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">How Repo Rate Affects Your EMI</h2>
      <p className="text-gray-700 mb-4">
        The transmission mechanism works as follows: When RBI changes the repo rate, banks' cost of borrowing changes. Under the External Benchmark Lending Rate (EBLR) system mandated by RBI since October 2019, retail loans (home loans, personal loans, MSME loans) must be linked to an external benchmark — most banks use the repo rate. This means a repo rate cut directly and immediately reduces the interest rate on these loans, lowering EMIs.
      </p>
      <p className="text-gray-700 mb-4">
        For example, if a borrower has a ₹50 lakh home loan at repo + 2.5% (i.e., 9.0% currently) for 20 years, a 25 bps repo rate cut would reduce the rate to 8.75%, reducing the EMI from approximately ₹44,986 to ₹44,236 — a saving of ₹750 per month. Over the full loan tenure, this translates to savings of ₹1.80 lakh. Banks must reset the EBLR-linked rates at least once every 3 months.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Repo Rate vs Other Key Rates</h2>
      <p className="text-gray-700 mb-4">
        The Bank Rate (Section 49 of RBI Act) is the rate at which RBI is willing to buy or rediscount bills of exchange or other commercial paper. It is typically higher than repo rate and is used as a reference for penalty calculations. The call money rate is the rate at which banks borrow from each other in the overnight inter-bank market — it typically moves within the LAF corridor (between SDF and MSF rates). The MCLR (Marginal Cost of funds-based Lending Rate) is an internal benchmark calculated by each bank based on its own cost of funds.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Key Points for JAIIB Exam</h2>
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
        <ul className="space-y-2 text-amber-900 text-sm">
          <li>• Repo Rate is decided by the <strong>6-member Monetary Policy Committee (MPC)</strong></li>
          <li>• LAF corridor: <strong>SDF (floor) → Repo (centre) → MSF (ceiling)</strong></li>
          <li>• Corridor width: <strong>50 bps</strong> (25 bps on each side of repo)</li>
          <li>• SDF replaced <strong>Reverse Repo</strong> as the floor in April 2022</li>
          <li>• MSF: banks can dip into SLR by <strong>2% of NDTL</strong></li>
          <li>• EBLR reset frequency: at least <strong>once every 3 months</strong></li>
          <li>• MPC meets <strong>6 times a year</strong> (bi-monthly)</li>
          <li>• Inflation target: CPI <strong>4% ± 2%</strong></li>
          <li>• Repo is collateralized; SDF is <strong>uncollateralized</strong></li>
        </ul>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Sample MCQs for JAIIB PPB</h2>

      <div className="space-y-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <p className="font-semibold text-gray-900 mb-3">Q1. The floor of the LAF corridor is currently set by:</p>
          <ul className="space-y-1 text-gray-700 mb-3 text-sm">
            <li>(a) Reverse Repo Rate</li>
            <li>(b) Standing Deposit Facility (SDF) Rate</li>
            <li>(c) Bank Rate</li>
            <li>(d) MSF Rate</li>
          </ul>
          <div className="bg-green-50 border border-green-200 rounded p-3">
            <p className="text-green-900 text-sm"><strong>Answer: (b)</strong> — Since April 2022, the SDF rate has replaced the reverse repo rate as the floor of the LAF corridor. SDF is an uncollateralized absorption facility.</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <p className="font-semibold text-gray-900 mb-3">Q2. MSF rate is typically set at:</p>
          <ul className="space-y-1 text-gray-700 mb-3 text-sm">
            <li>(a) 50 bps above repo rate</li>
            <li>(b) 25 bps above repo rate</li>
            <li>(c) 100 bps above repo rate</li>
            <li>(d) Equal to repo rate</li>
          </ul>
          <div className="bg-green-50 border border-green-200 rounded p-3">
            <p className="text-green-900 text-sm"><strong>Answer: (b)</strong> — MSF rate is set 25 basis points above the repo rate. It forms the ceiling of the LAF corridor. Currently at 6.75% (repo 6.50% + 0.25%).</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <p className="font-semibold text-gray-900 mb-3">Q3. Under the EBLR system, banks must reset linked lending rates at least:</p>
          <ul className="space-y-1 text-gray-700 mb-3 text-sm">
            <li>(a) Every month</li>
            <li>(b) Every 3 months</li>
            <li>(c) Every 6 months</li>
            <li>(d) Every year</li>
          </ul>
          <div className="bg-green-50 border border-green-200 rounded p-3">
            <p className="text-green-900 text-sm"><strong>Answer: (b)</strong> — Banks must reset their EBLR-linked lending rates at least once every 3 months (quarterly). This ensures faster transmission of repo rate changes to borrowers.</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <TopicPageLayout
      title="Repo Rate Explained — LAF Corridor, MSF, SDF, Impact on EMI | JAIIB PPB 2026"
      description="Complete guide to Repo Rate for JAIIB PPB 2026. Learn the LAF corridor framework, MSF, SDF, reverse repo, how repo rate affects EMI, EBLR system, and practice MCQs."
      canonical="https://mockmaster.fun/jaiib/ppb/repo-rate-explained"
      keywords="repo rate explained, LAF corridor, MSF rate, SDF rate, reverse repo, EBLR lending rate, repo rate EMI impact, JAIIB PPB"
      breadcrumb={[
        { label: 'Home', url: '/' },
        { label: 'JAIIB', url: '/practice-tests' },
        { label: 'PPB', url: '/practice-tests/ppb' },
        { label: 'Repo Rate Explained' },
      ]}
      content={content}
      relatedTopics={relatedTopics}
      lastUpdated="June 2026"
    />
  );
};

export default RepoRatePage;
