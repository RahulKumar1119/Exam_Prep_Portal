import React from 'react';
import TopicPageLayout from './TopicPageLayout';

const MutualFundsPage: React.FC = () => {
  const relatedTopics = [
    { title: 'Home Loan Guide', url: '/jaiib/rbwm/home-loan-guide' },
    { title: 'Financial Inclusion Schemes', url: '/jaiib/rbwm/financial-inclusion' },
    { title: 'Ratio Analysis for Banking', url: '/jaiib/afm/ratio-analysis' },
    { title: 'NPV & IRR — Capital Budgeting', url: '/jaiib/afm/npv-irr-explained' },
    { title: 'Deposit Insurance (DICGC)', url: '/jaiib/ppb/deposit-insurance-dicgc' },
  ];

  const content = (
    <div>
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
        Mutual Funds Guide — Types, NAV, SIP, SEBI Categories & Tax Implications
      </h1>

      <p className="text-lg text-gray-700 mb-6">
        Mutual Funds are one of the most important investment products covered in the JAIIB RBWM
        (Retail Banking & Wealth Management) paper. As bank professionals increasingly advise customers on investment options, understanding mutual fund types, Net Asset Value (NAV) calculation, Systematic Investment Plans (SIP), SEBI categorization norms, risk-return profiles, and tax implications is essential. This comprehensive guide covers all aspects of mutual funds relevant for JAIIB preparation.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">What is a Mutual Fund?</h2>
      <p className="text-gray-700 mb-4">
        A mutual fund is a pooled investment vehicle that collects money from multiple investors and invests it in a diversified portfolio of securities (stocks, bonds, money market instruments) managed by a professional fund manager. The mutual fund structure in India is a three-tier structure: (1) Sponsor — the entity that establishes the fund (meets SEBI's net worth requirements); (2) Trustee — holds the fund assets in trust for investors; (3) Asset Management Company (AMC) — manages the investments and day-to-day operations. SEBI (Mutual Fund) Regulations, 1996 govern the industry.
      </p>
      <p className="text-gray-700 mb-4">
        AMFI (Association of Mutual Funds in India) is the industry body representing all AMCs. It establishes best practices, conducts investor awareness campaigns ("Mutual Funds Sahi Hai"), and maintains the AMFI Registration Number (ARN) system for mutual fund distributors.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Types of Mutual Funds</h2>
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Category</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Sub-Types</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Risk Level</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Suitable For</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">Equity Funds</td>
              <td className="px-4 py-3 text-sm text-gray-700">Large Cap, Mid Cap, Small Cap, Multi Cap, ELSS</td>
              <td className="px-4 py-3 text-sm text-gray-700">High</td>
              <td className="px-4 py-3 text-sm text-gray-700">Long-term wealth creation (5+ years)</td>
            </tr>
            <tr className="border-b bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">Debt Funds</td>
              <td className="px-4 py-3 text-sm text-gray-700">Liquid, Short Duration, Corporate Bond, Gilt</td>
              <td className="px-4 py-3 text-sm text-gray-700">Low to Medium</td>
              <td className="px-4 py-3 text-sm text-gray-700">Capital preservation, regular income</td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">Hybrid Funds</td>
              <td className="px-4 py-3 text-sm text-gray-700">Balanced Advantage, Aggressive Hybrid, Conservative</td>
              <td className="px-4 py-3 text-sm text-gray-700">Medium</td>
              <td className="px-4 py-3 text-sm text-gray-700">Moderate risk, balanced approach</td>
            </tr>
            <tr className="border-b bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">Solution-Oriented</td>
              <td className="px-4 py-3 text-sm text-gray-700">Retirement Fund, Children's Fund</td>
              <td className="px-4 py-3 text-sm text-gray-700">Varies</td>
              <td className="px-4 py-3 text-sm text-gray-700">Goal-based investing</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">Index Funds/ETFs</td>
              <td className="px-4 py-3 text-sm text-gray-700">Nifty 50, Sensex, Sectoral</td>
              <td className="px-4 py-3 text-sm text-gray-700">Medium to High</td>
              <td className="px-4 py-3 text-sm text-gray-700">Passive, low-cost investing</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">NAV (Net Asset Value)</h2>
      <p className="text-gray-700 mb-4">
        NAV is the per-unit market value of a mutual fund scheme. It is calculated at the end of each business day as:
      </p>
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 font-mono text-center">
        <p className="text-lg font-semibold text-gray-900">NAV = (Total Assets - Total Liabilities) / Total Outstanding Units</p>
      </div>
      <p className="text-gray-700 mb-4">
        Total Assets include the market value of all securities held plus accrued income plus receivables. Total Liabilities include expenses payable plus other liabilities. NAV is declared at the end of every business day by all mutual fund schemes. When you invest in a mutual fund, units are allotted based on the applicable NAV (T+1 for equity, same day for liquid funds if invested before cut-off time).
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">SIP (Systematic Investment Plan)</h2>
      <p className="text-gray-700 mb-4">
        SIP allows investors to invest a fixed amount at regular intervals (weekly, monthly, quarterly) rather than a lump sum. Key advantages: (a) Rupee Cost Averaging — buying more units when NAV is low and fewer when high, reducing average cost over time; (b) Power of Compounding — small regular investments grow significantly over long periods; (c) Discipline — automates investment without timing decisions. A ₹5,000 monthly SIP in an equity fund returning 12% p.a. would grow to approximately ₹50 lakh in 20 years.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">SEBI Categorization Norms (2017)</h2>
      <p className="text-gray-700 mb-4">
        In 2017, SEBI issued categorization and rationalization guidelines requiring each AMC to have only one scheme per category (with exceptions for index funds and ETFs). Key equity categorizations: Large Cap Fund (minimum 80% in top 100 stocks by market cap), Mid Cap Fund (minimum 65% in 101-250th stocks), Small Cap Fund (minimum 65% in 251+ stocks), Flexi Cap Fund (minimum 65% in equity with no market cap restriction). For debt: Overnight Fund (1-day maturity), Liquid Fund (up to 91 days), Money Market Fund (up to 1 year).
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Tax Implications</h2>
      <p className="text-gray-700 mb-4">
        Taxation depends on the holding period and fund category: For equity funds — holding over 1 year is Long Term Capital Gains (LTCG), taxed at 12.5% above ₹1.25 lakh exemption. Holding up to 1 year is Short Term Capital Gains (STCG), taxed at 20%. For debt funds — all gains are taxed at the investor's slab rate regardless of holding period (post-2023 amendment removing indexation benefit). ELSS (Equity Linked Savings Scheme) provides Section 80C deduction up to ₹1.5 lakh with a 3-year lock-in period.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Key Points for JAIIB Exam</h2>
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
        <ul className="space-y-2 text-amber-900 text-sm">
          <li>• Mutual fund structure: <strong>Sponsor → Trustee → AMC</strong></li>
          <li>• NAV calculated <strong>daily</strong> at end of business day</li>
          <li>• ELSS lock-in: <strong>3 years</strong> (shortest among 80C investments)</li>
          <li>• Equity LTCG: <strong>12.5% above ₹1.25 lakh</strong> (holding &gt; 1 year)</li>
          <li>• Debt funds: taxed at <strong>slab rate</strong> regardless of holding period</li>
          <li>• SIP benefit: <strong>Rupee Cost Averaging</strong></li>
          <li>• SEBI regulation: <strong>One scheme per category per AMC</strong></li>
          <li>• Large Cap definition: <strong>Top 100 companies</strong> by market capitalization</li>
          <li>• KYC mandatory for investments above <strong>₹50,000</strong></li>
        </ul>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Sample MCQs for JAIIB RBWM</h2>

      <div className="space-y-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <p className="font-semibold text-gray-900 mb-3">Q1. NAV of a mutual fund is calculated as:</p>
          <ul className="space-y-1 text-gray-700 mb-3 text-sm">
            <li>(a) Total Assets / Total Units</li>
            <li>(b) (Total Assets - Total Liabilities) / Total Units</li>
            <li>(c) Market Value of Securities / NAV</li>
            <li>(d) Total Units × Market Price</li>
          </ul>
          <div className="bg-green-50 border border-green-200 rounded p-3">
            <p className="text-green-900 text-sm"><strong>Answer: (b)</strong> — NAV = (Total Assets - Total Liabilities) / Total Outstanding Units. It represents the per-unit value of the fund after deducting all expenses and liabilities.</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <p className="font-semibold text-gray-900 mb-3">Q2. The lock-in period for ELSS (Equity Linked Savings Scheme) is:</p>
          <ul className="space-y-1 text-gray-700 mb-3 text-sm">
            <li>(a) 1 year</li>
            <li>(b) 3 years</li>
            <li>(c) 5 years</li>
            <li>(d) No lock-in</li>
          </ul>
          <div className="bg-green-50 border border-green-200 rounded p-3">
            <p className="text-green-900 text-sm"><strong>Answer: (b)</strong> — ELSS has a 3-year lock-in period, making it the shortest lock-in among all Section 80C investment options (PPF is 15 years, NSC is 5 years).</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <p className="font-semibold text-gray-900 mb-3">Q3. As per SEBI categorization, a Large Cap Fund must invest at least what percentage in large cap stocks?</p>
          <ul className="space-y-1 text-gray-700 mb-3 text-sm">
            <li>(a) 65%</li>
            <li>(b) 70%</li>
            <li>(c) 80%</li>
            <li>(d) 90%</li>
          </ul>
          <div className="bg-green-50 border border-green-200 rounded p-3">
            <p className="text-green-900 text-sm"><strong>Answer: (c)</strong> — SEBI requires Large Cap Funds to invest minimum 80% of total assets in equity of top 100 companies by full market capitalization.</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <p className="font-semibold text-gray-900 mb-3">Q4. Which body regulates mutual funds in India?</p>
          <ul className="space-y-1 text-gray-700 mb-3 text-sm">
            <li>(a) RBI</li>
            <li>(b) SEBI</li>
            <li>(c) AMFI</li>
            <li>(d) IRDA</li>
          </ul>
          <div className="bg-green-50 border border-green-200 rounded p-3">
            <p className="text-green-900 text-sm"><strong>Answer: (b)</strong> — SEBI (Securities and Exchange Board of India) regulates mutual funds under SEBI (Mutual Fund) Regulations, 1996. AMFI is the industry association, not the regulator.</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <TopicPageLayout
      title="Mutual Funds — Types, NAV, SIP, SEBI Categories & Tax | JAIIB RBWM 2026"
      description="Complete guide to Mutual Funds for JAIIB RBWM 2026. Learn mutual fund types, NAV calculation, SIP benefits, SEBI categorization, risk-return profiles, tax implications, and practice MCQs."
      canonical="https://mockmaster.fun/jaiib/rbwm/mutual-funds-guide"
      keywords="mutual funds JAIIB, NAV calculation, SIP explained, SEBI categorization, ELSS tax benefit, equity debt hybrid funds, JAIIB RBWM"
      breadcrumb={[
        { label: 'Home', url: '/' },
        { label: 'JAIIB', url: '/practice-tests' },
        { label: 'RBWM', url: '/practice-tests/rbwm' },
        { label: 'Mutual Funds Guide' },
      ]}
      content={content}
      relatedTopics={relatedTopics}
      lastUpdated="June 2026"
    />
  );
};

export default MutualFundsPage;
