import React from 'react';
import TopicPageLayout from './TopicPageLayout';

const BaselNormsPage: React.FC = () => {
  const relatedTopics = [
    { title: 'NPA Classification & IRAC Norms', url: '/jaiib/ppb/npa-classification' },
    { title: 'CRR (Cash Reserve Ratio) Explained', url: '/jaiib/ppb/crr-explained' },
    { title: 'Priority Sector Lending (PSL) Norms', url: '/jaiib/ppb/priority-sector-lending' },
    { title: 'SLR Explained', url: '/jaiib/ppb/slr-explained' },
    { title: 'Repo Rate Explained', url: '/jaiib/ppb/repo-rate-explained' },
  ];

  const content = (
    <div>
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
        Basel Norms Explained — Basel I, II & III, Capital Adequacy (CRAR) & Risk Framework
      </h1>

      <p className="text-lg text-gray-700 mb-6">
        The Basel Norms are international banking regulations developed by the Basel Committee on Banking Supervision (BCBS) to strengthen the regulation, supervision, and risk management of banks worldwide. For the JAIIB PPB examination, Basel Norms constitute one of the most complex yet high-scoring topics. Understanding the evolution from Basel I through Basel III, the concept of Capital Adequacy (CRAR), Tier 1 and Tier 2 capital, risk-weighted assets, and India's implementation is crucial for banking professionals. This guide provides a comprehensive breakdown of all three Basel accords with tables, formulas, and exam-focused MCQs.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Evolution of Basel Norms</h2>
      <p className="text-gray-700 mb-4">
        The Basel Committee on Banking Supervision was established in 1974 by the central bank governors of the G-10 countries and is headquartered in Basel, Switzerland (housed at the Bank for International Settlements — BIS). The Committee does not have legal authority to enforce its recommendations; instead, it formulates standards that member countries adopt through their respective regulatory frameworks. India implemented Basel norms through RBI circulars, and Indian banks are currently operating under the Basel III framework.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Basel I (1988)</h2>
      <p className="text-gray-700 mb-4">
        Basel I, introduced in 1988, was the first international standard for bank capital adequacy. Its primary focus was credit risk — the risk that a borrower may default on a loan. Basel I established the minimum capital requirement of 8% of Risk-Weighted Assets (RWA). It introduced a simple risk-weighting system where assets were classified into broad categories (0%, 20%, 50%, 100%) based on the counterparty type. For example, government bonds received 0% risk weight, claims on banks received 20%, residential mortgages received 50%, and corporate loans received 100%.
      </p>
      <p className="text-gray-700 mb-4">
        While Basel I was groundbreaking as the first harmonized capital standard, it had significant limitations: it did not account for operational risk or market risk; the risk weights were too broad and did not differentiate between high-quality and low-quality corporate borrowers; and it incentivized regulatory arbitrage where banks restructured exposures to minimize capital requirements without actually reducing risk.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Basel II (2004) — Three Pillars</h2>
      <p className="text-gray-700 mb-4">
        Basel II was released in 2004 and represented a more sophisticated approach to bank regulation. It introduced the famous "Three Pillars" framework:
      </p>
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Pillar</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Name</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Focus Area</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">Pillar 1</td>
              <td className="px-4 py-3 text-sm text-gray-700">Minimum Capital Requirements</td>
              <td className="px-4 py-3 text-sm text-gray-700">Credit Risk + Market Risk + Operational Risk. Multiple approaches available for each risk type (Standardized, IRB for credit; BIA, TSA, AMA for operational)</td>
            </tr>
            <tr className="border-b bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">Pillar 2</td>
              <td className="px-4 py-3 text-sm text-gray-700">Supervisory Review Process (SRP)</td>
              <td className="px-4 py-3 text-sm text-gray-700">ICAAP (Internal Capital Adequacy Assessment Process) by banks + SREP (Supervisory Review and Evaluation Process) by regulator</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">Pillar 3</td>
              <td className="px-4 py-3 text-sm text-gray-700">Market Discipline</td>
              <td className="px-4 py-3 text-sm text-gray-700">Disclosure requirements — banks must publicly disclose capital structure, risk exposures, risk assessment processes, and capital adequacy</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-gray-700 mb-4">
        Basel II's key improvement was the inclusion of operational risk (risk of loss from inadequate internal processes, people, systems, or external events) and more granular risk weights for credit risk. However, the 2008 Global Financial Crisis exposed critical weaknesses — Basel II did not adequately address liquidity risk, leverage, and the procyclicality of capital requirements.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Basel III (2010 onwards) — Post-Crisis Reforms</h2>
      <p className="text-gray-700 mb-4">
        Basel III was developed in response to the 2008 financial crisis and introduced in phases from 2013 onwards. It retained the three-pillar structure of Basel II but significantly enhanced capital quality, introduced liquidity standards, and added a leverage ratio. Key additions under Basel III include:
      </p>
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Basel III Component</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Requirement</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Purpose</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">LCR (Liquidity Coverage Ratio)</td>
              <td className="px-4 py-3 text-sm text-gray-700">≥ 100% (HQLA / Net cash outflows over 30 days)</td>
              <td className="px-4 py-3 text-sm text-gray-700">Ensure banks survive a 30-day liquidity stress</td>
            </tr>
            <tr className="border-b bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">NSFR (Net Stable Funding Ratio)</td>
              <td className="px-4 py-3 text-sm text-gray-700">≥ 100% (Available stable funding / Required stable funding)</td>
              <td className="px-4 py-3 text-sm text-gray-700">Ensure structural long-term liquidity balance</td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">Leverage Ratio</td>
              <td className="px-4 py-3 text-sm text-gray-700">≥ 3.5% (Tier 1 Capital / Total Exposure)</td>
              <td className="px-4 py-3 text-sm text-gray-700">Limit excessive balance sheet leverage</td>
            </tr>
            <tr className="border-b bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">CCB (Capital Conservation Buffer)</td>
              <td className="px-4 py-3 text-sm text-gray-700">2.5% of RWA (in CET1)</td>
              <td className="px-4 py-3 text-sm text-gray-700">Absorb losses during periods of stress</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">CCyB (Countercyclical Buffer)</td>
              <td className="px-4 py-3 text-sm text-gray-700">0% to 2.5% (set by RBI based on credit cycle)</td>
              <td className="px-4 py-3 text-sm text-gray-700">Counter procyclicality in credit growth</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Capital Adequacy — CRAR (9% in India)</h2>
      <p className="text-gray-700 mb-4">
        Capital to Risk-Weighted Assets Ratio (CRAR), also known as Capital Adequacy Ratio (CAR), is the core metric of the Basel framework. While the international Basel standard requires 8%, India's RBI mandates a higher minimum of 9% CRAR for all scheduled commercial banks. The formula is:
      </p>
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 font-mono text-center">
        <p className="text-lg font-semibold text-gray-900">CRAR = (Tier 1 Capital + Tier 2 Capital) / Risk-Weighted Assets × 100</p>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Capital Structure — Tier 1 & Tier 2</h2>
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Capital Tier</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Components</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Minimum (India)</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">CET1 (Common Equity Tier 1)</td>
              <td className="px-4 py-3 text-sm text-gray-700">Equity share capital, retained earnings, statutory reserves, free reserves (minus deductions)</td>
              <td className="px-4 py-3 text-sm text-gray-700">5.5% of RWA</td>
            </tr>
            <tr className="border-b bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">AT1 (Additional Tier 1)</td>
              <td className="px-4 py-3 text-sm text-gray-700">Perpetual non-cumulative preference shares, perpetual bonds (AT1 bonds with loss absorption features)</td>
              <td className="px-4 py-3 text-sm text-gray-700">1.5% of RWA</td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">Total Tier 1</td>
              <td className="px-4 py-3 text-sm text-gray-700">CET1 + AT1</td>
              <td className="px-4 py-3 text-sm text-gray-700">7.0% of RWA</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">Tier 2</td>
              <td className="px-4 py-3 text-sm text-gray-700">Subordinated debt (maturity ≥ 5 years), revaluation reserves (at a discount), general provisions/loss reserves (up to 1.25% of RWA)</td>
              <td className="px-4 py-3 text-sm text-gray-700">2.0% of RWA</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-gray-700 mb-4">
        With the Capital Conservation Buffer (CCB) of 2.5%, the effective minimum CRAR for Indian banks becomes 11.5% (9% minimum + 2.5% CCB). Systemically Important Banks (D-SIBs) like SBI, ICICI Bank, and HDFC Bank are required to maintain an additional capital surcharge of 0.2% to 0.8% depending on their systemic importance score.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Risk Weights — Common Examples</h2>
      <p className="text-gray-700 mb-4">
        Under the Standardized Approach for credit risk, different asset classes carry different risk weights:
      </p>
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Asset Category</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Risk Weight</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="px-4 py-3 text-sm text-gray-700">Central Government claims (in domestic currency)</td>
              <td className="px-4 py-3 text-sm text-gray-700">0%</td>
            </tr>
            <tr className="border-b bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-700">Claims on State Governments (guaranteed by Centre)</td>
              <td className="px-4 py-3 text-sm text-gray-700">0%</td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 text-sm text-gray-700">Claims on scheduled banks</td>
              <td className="px-4 py-3 text-sm text-gray-700">20%</td>
            </tr>
            <tr className="border-b bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-700">Residential mortgage (LTV ≤ 80%)</td>
              <td className="px-4 py-3 text-sm text-gray-700">35%</td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 text-sm text-gray-700">Commercial real estate</td>
              <td className="px-4 py-3 text-sm text-gray-700">100%</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm text-gray-700">Consumer credit / Personal loans</td>
              <td className="px-4 py-3 text-sm text-gray-700">100%–125%</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">India's Implementation of Basel III</h2>
      <p className="text-gray-700 mb-4">
        India adopted Basel III norms from April 1, 2013, with a phased implementation schedule. The RBI set a higher minimum CRAR of 9% (versus the global 8%) as an additional buffer for the Indian banking system. The full implementation of Basel III capital requirements in India was completed by March 2019, while the LCR requirement became fully effective from January 2019 (minimum 100%). The NSFR requirement of 100% has also been implemented. Indian banks, particularly public sector banks, have faced challenges in meeting Basel III norms due to high NPA levels, requiring government capital infusions through recapitalization bonds.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Key Points for JAIIB Exam</h2>
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
        <ul className="space-y-2 text-amber-900 text-sm">
          <li>• India's minimum CRAR is <strong>9%</strong> (higher than Basel's 8%)</li>
          <li>• CET1 minimum in India: <strong>5.5%</strong> of RWA</li>
          <li>• Total Tier 1 minimum: <strong>7%</strong> of RWA</li>
          <li>• Capital Conservation Buffer (CCB): <strong>2.5%</strong> of RWA</li>
          <li>• Effective minimum with CCB: <strong>11.5%</strong></li>
          <li>• Basel II has <strong>3 Pillars</strong>: Capital, Supervision, Market Discipline</li>
          <li>• Basel III introduced <strong>LCR, NSFR, and Leverage Ratio</strong></li>
          <li>• LCR ensures survival for <strong>30 days</strong> of liquidity stress</li>
          <li>• Leverage Ratio minimum: <strong>3.5%</strong> (Tier 1/Total Exposure)</li>
          <li>• Risk weight on Central Govt claims: <strong>0%</strong></li>
        </ul>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Sample MCQs for JAIIB PPB</h2>

      <div className="space-y-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <p className="font-semibold text-gray-900 mb-3">Q1. The minimum Capital to Risk-Weighted Assets Ratio (CRAR) prescribed by RBI for Indian banks is:</p>
          <ul className="space-y-1 text-gray-700 mb-3 text-sm">
            <li>(a) 8%</li>
            <li>(b) 9%</li>
            <li>(c) 10%</li>
            <li>(d) 11.5%</li>
          </ul>
          <div className="bg-green-50 border border-green-200 rounded p-3">
            <p className="text-green-900 text-sm"><strong>Answer: (b)</strong> — RBI mandates a minimum CRAR of 9% for all scheduled commercial banks in India, which is 1% higher than the Basel Committee's international standard of 8%. With the CCB of 2.5%, the effective minimum becomes 11.5%.</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <p className="font-semibold text-gray-900 mb-3">Q2. Which of the following was NOT a component of Basel II's Three Pillars?</p>
          <ul className="space-y-1 text-gray-700 mb-3 text-sm">
            <li>(a) Minimum Capital Requirements</li>
            <li>(b) Supervisory Review Process</li>
            <li>(c) Liquidity Coverage Ratio</li>
            <li>(d) Market Discipline</li>
          </ul>
          <div className="bg-green-50 border border-green-200 rounded p-3">
            <p className="text-green-900 text-sm"><strong>Answer: (c)</strong> — The Liquidity Coverage Ratio (LCR) was introduced under Basel III, not Basel II. Basel II's three pillars are: Pillar 1 — Minimum Capital Requirements, Pillar 2 — Supervisory Review Process, and Pillar 3 — Market Discipline.</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <p className="font-semibold text-gray-900 mb-3">Q3. Under Basel III, the Capital Conservation Buffer (CCB) requirement is:</p>
          <ul className="space-y-1 text-gray-700 mb-3 text-sm">
            <li>(a) 1.5% of RWA maintained in Tier 2 capital</li>
            <li>(b) 2.5% of RWA maintained in CET1 capital</li>
            <li>(c) 3.5% of total exposure in Tier 1 capital</li>
            <li>(d) 2.0% of RWA maintained in AT1 capital</li>
          </ul>
          <div className="bg-green-50 border border-green-200 rounded p-3">
            <p className="text-green-900 text-sm"><strong>Answer: (b)</strong> — The Capital Conservation Buffer is 2.5% of Risk-Weighted Assets and must be maintained entirely in Common Equity Tier 1 (CET1) capital. It is designed to ensure banks build up capital during normal times that can be drawn down during stress periods.</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <TopicPageLayout
      title="Basel Norms Explained — Basel I, II, III, CRAR 9%, Capital Adequacy | JAIIB PPB"
      description="Complete guide to Basel Norms for JAIIB PPB 2026. Learn Basel I/II/III evolution, CRAR 9%, Tier 1 & Tier 2 capital, three pillars, LCR, NSFR, leverage ratio, risk weights, and practice MCQs."
      canonical="https://mockmaster.fun/jaiib/ppb/basel-norms"
      keywords="Basel norms, Basel III, CRAR, capital adequacy ratio, Tier 1 capital, CET1, LCR NSFR, risk weighted assets, JAIIB PPB"
      breadcrumb={[
        { label: 'Home', url: '/' },
        { label: 'JAIIB', url: '/practice-tests' },
        { label: 'PPB', url: '/practice-tests/ppb' },
        { label: 'Basel Norms' },
      ]}
      content={content}
      relatedTopics={relatedTopics}
      lastUpdated="June 2026"
    />
  );
};

export default BaselNormsPage;
