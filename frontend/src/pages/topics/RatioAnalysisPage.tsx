import React from 'react';
import TopicPageLayout from './TopicPageLayout';

const RatioAnalysisPage: React.FC = () => {
  const relatedTopics = [
    { title: 'Break-Even Analysis', url: '/jaiib/afm/break-even-analysis' },
    { title: 'Depreciation Methods (SLM & WDV)', url: '/jaiib/afm/depreciation-methods' },
    { title: 'NPV & IRR — Capital Budgeting', url: '/jaiib/afm/npv-irr-explained' },
    { title: 'Basel III Norms & Capital Adequacy', url: '/jaiib/ppb/basel-norms' },
    { title: 'NPA Classification & IRAC Norms', url: '/jaiib/ppb/npa-classification' },
  ];

  const content = (
    <div>
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
        Ratio Analysis — Current, Quick, Debt-Equity, ROE & Turnover Ratios
      </h1>

      <p className="text-lg text-gray-700 mb-6">
        Ratio Analysis is one of the most important tools for financial statement analysis and
        a heavily tested topic in the JAIIB AFM paper. Bankers use ratio analysis extensively during credit appraisal to assess a borrower's liquidity, solvency, profitability, and operational efficiency. Understanding key ratios — their formulas, ideal values, and interpretation — is essential for every banking professional. This comprehensive guide covers all major ratios with formulas, interpretation, and relevance to banking decisions.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Categories of Financial Ratios</h2>
      <p className="text-gray-700 mb-4">
        Financial ratios are broadly classified into four categories: (1) Liquidity Ratios — measure ability to meet short-term obligations (Current Ratio, Quick Ratio); (2) Solvency/Leverage Ratios — measure long-term financial stability (Debt-Equity Ratio, Interest Coverage Ratio); (3) Profitability Ratios — measure earning capacity (ROE, Net Profit Margin, ROCE); (4) Activity/Turnover Ratios — measure operational efficiency (Inventory Turnover, Debtors Turnover, Fixed Asset Turnover).
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Key Ratios — Formulas & Interpretation</h2>
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Ratio</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Formula</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Ideal Value</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Interpretation</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">Current Ratio</td>
              <td className="px-4 py-3 text-sm text-gray-700">Current Assets / Current Liabilities</td>
              <td className="px-4 py-3 text-sm text-gray-700">1.33:1 to 2:1</td>
              <td className="px-4 py-3 text-sm text-gray-700">Short-term solvency</td>
            </tr>
            <tr className="border-b bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">Quick/Acid Test Ratio</td>
              <td className="px-4 py-3 text-sm text-gray-700">(CA - Inventory - Prepaid) / CL</td>
              <td className="px-4 py-3 text-sm text-gray-700">1:1</td>
              <td className="px-4 py-3 text-sm text-gray-700">Immediate liquidity</td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">Debt-Equity Ratio</td>
              <td className="px-4 py-3 text-sm text-gray-700">Total Debt / Shareholders' Equity</td>
              <td className="px-4 py-3 text-sm text-gray-700">2:1 or less</td>
              <td className="px-4 py-3 text-sm text-gray-700">Financial leverage</td>
            </tr>
            <tr className="border-b bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">Interest Coverage</td>
              <td className="px-4 py-3 text-sm text-gray-700">EBIT / Interest Expense</td>
              <td className="px-4 py-3 text-sm text-gray-700">&gt; 2 times</td>
              <td className="px-4 py-3 text-sm text-gray-700">Ability to service debt</td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">ROE (Return on Equity)</td>
              <td className="px-4 py-3 text-sm text-gray-700">Net Profit / Shareholders' Equity × 100</td>
              <td className="px-4 py-3 text-sm text-gray-700">&gt; 15%</td>
              <td className="px-4 py-3 text-sm text-gray-700">Return to shareholders</td>
            </tr>
            <tr className="border-b bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">Inventory Turnover</td>
              <td className="px-4 py-3 text-sm text-gray-700">COGS / Average Inventory</td>
              <td className="px-4 py-3 text-sm text-gray-700">Industry specific</td>
              <td className="px-4 py-3 text-sm text-gray-700">Inventory management efficiency</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">Debtors Turnover</td>
              <td className="px-4 py-3 text-sm text-gray-700">Net Credit Sales / Average Debtors</td>
              <td className="px-4 py-3 text-sm text-gray-700">Higher is better</td>
              <td className="px-4 py-3 text-sm text-gray-700">Collection efficiency</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Liquidity Ratios Explained</h2>
      <p className="text-gray-700 mb-4">
        The Current Ratio measures whether a company has enough current assets to cover its short-term liabilities. A ratio below 1 indicates potential difficulty in meeting obligations. For bank lending, a current ratio of 1.33:1 is generally considered the minimum benchmark. The Quick Ratio (Acid Test) is more stringent — it excludes inventory and prepaid expenses (which may not be quickly convertible to cash) from current assets. A quick ratio of 1:1 means the firm can meet all current liabilities from its most liquid assets alone.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Solvency & Leverage Ratios</h2>
      <p className="text-gray-700 mb-4">
        The Debt-Equity Ratio indicates the proportion of borrowed funds versus owners' funds. A higher ratio means more leverage and higher financial risk. Banks typically prefer D/E of 2:1 or lower for term loan sanction. The Debt Service Coverage Ratio (DSCR) is another crucial ratio: DSCR = (Net Profit + Depreciation + Interest on TL) / (Interest on TL + TL Instalment). Banks require a minimum DSCR of 1.5:1 to 2:1 for project viability.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Profitability Ratios</h2>
      <p className="text-gray-700 mb-4">
        ROE measures the return generated on shareholders' equity investment. A consistently high ROE indicates efficient use of equity capital. Net Profit Margin (Net Profit/Sales × 100) shows what percentage of sales translates into profit after all expenses. Gross Profit Margin (Gross Profit/Sales × 100) shows efficiency in production/trading operations. Return on Capital Employed (ROCE = EBIT / Capital Employed × 100) measures efficiency of total capital deployed irrespective of the financing mix.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Activity/Turnover Ratios</h2>
      <p className="text-gray-700 mb-4">
        Inventory Turnover Ratio indicates how many times inventory is sold and replaced during a period. A higher ratio means efficient inventory management. Inventory Holding Period = 365 / Inventory Turnover (days). Debtors Turnover Ratio measures how efficiently credit sales are collected. Average Collection Period = 365 / Debtors Turnover (days). For bankers, a high collection period is a red flag indicating potential cash flow issues or poor debtor quality.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">DuPont Analysis</h2>
      <p className="text-gray-700 mb-4">
        DuPont Analysis breaks ROE into three components to identify the drivers of return: ROE = Net Profit Margin × Asset Turnover × Equity Multiplier = (Net Profit/Sales) × (Sales/Total Assets) × (Total Assets/Equity). This decomposition helps bankers understand whether high ROE comes from operational efficiency, efficient asset use, or high leverage (which increases risk).
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Key Points for JAIIB Exam</h2>
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
        <ul className="space-y-2 text-amber-900 text-sm">
          <li>• Current Ratio benchmark for banks: <strong>1.33:1</strong></li>
          <li>• Quick Ratio excludes <strong>inventory and prepaid expenses</strong></li>
          <li>• Debt-Equity acceptable: <strong>2:1 or lower</strong></li>
          <li>• DSCR minimum for project loans: <strong>1.5:1 to 2:1</strong></li>
          <li>• Higher turnover ratios = <strong>better efficiency</strong></li>
          <li>• Operating Cycle = Inventory Period + Debtors Period - Creditors Period</li>
          <li>• DuPont: ROE = <strong>Margin × Turnover × Leverage</strong></li>
        </ul>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Sample MCQs for JAIIB AFM</h2>

      <div className="space-y-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <p className="font-semibold text-gray-900 mb-3">Q1. If Current Assets are ₹8 lakh and Current Liabilities are ₹5 lakh, the Current Ratio is:</p>
          <ul className="space-y-1 text-gray-700 mb-3 text-sm">
            <li>(a) 1.4:1</li>
            <li>(b) 1.6:1</li>
            <li>(c) 2:1</li>
            <li>(d) 0.625:1</li>
          </ul>
          <div className="bg-green-50 border border-green-200 rounded p-3">
            <p className="text-green-900 text-sm"><strong>Answer: (b)</strong> — Current Ratio = CA/CL = ₹8,00,000 / ₹5,00,000 = 1.6:1. This is above the minimum benchmark of 1.33:1.</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <p className="font-semibold text-gray-900 mb-3">Q2. Quick Ratio is also known as:</p>
          <ul className="space-y-1 text-gray-700 mb-3 text-sm">
            <li>(a) Cash Ratio</li>
            <li>(b) Acid Test Ratio</li>
            <li>(c) Absolute Liquidity Ratio</li>
            <li>(d) Super Quick Ratio</li>
          </ul>
          <div className="bg-green-50 border border-green-200 rounded p-3">
            <p className="text-green-900 text-sm"><strong>Answer: (b)</strong> — Quick Ratio is also called Acid Test Ratio. It measures immediate liquidity by excluding inventory and prepaid expenses from current assets.</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <p className="font-semibold text-gray-900 mb-3">Q3. A company has Net Profit of ₹10 lakh, Depreciation ₹3 lakh, Interest on TL ₹2 lakh, and TL instalment ₹5 lakh. DSCR is:</p>
          <ul className="space-y-1 text-gray-700 mb-3 text-sm">
            <li>(a) 1.5</li>
            <li>(b) 2.0</li>
            <li>(c) 2.14</li>
            <li>(d) 1.87</li>
          </ul>
          <div className="bg-green-50 border border-green-200 rounded p-3">
            <p className="text-green-900 text-sm"><strong>Answer: (c)</strong> — DSCR = (NP + Dep + Interest on TL) / (Interest on TL + Instalment) = (10+3+2)/(2+5) = 15/7 = 2.14. This is above the comfortable level of 2:1.</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <p className="font-semibold text-gray-900 mb-3">Q4. If Debtors Turnover is 12 times, the average collection period is:</p>
          <ul className="space-y-1 text-gray-700 mb-3 text-sm">
            <li>(a) 12 days</li>
            <li>(b) 24 days</li>
            <li>(c) 30 days</li>
            <li>(d) 36 days</li>
          </ul>
          <div className="bg-green-50 border border-green-200 rounded p-3">
            <p className="text-green-900 text-sm"><strong>Answer: (c)</strong> — Average Collection Period = 365 / Debtors Turnover = 365 / 12 ≈ 30 days. This means on average, the firm takes about 30 days to collect from debtors.</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <TopicPageLayout
      title="Ratio Analysis — Current, Quick, Debt-Equity, ROE, Turnover Ratios | JAIIB AFM 2026"
      description="Complete guide to Ratio Analysis for JAIIB AFM 2026. Learn Current Ratio, Quick Ratio, Debt-Equity, ROE, DSCR, Inventory & Debtors Turnover with formulas, interpretation, and MCQs."
      canonical="https://mockmaster.fun/jaiib/afm/ratio-analysis"
      keywords="ratio analysis JAIIB, current ratio, quick ratio, debt equity ratio, ROE, DSCR, inventory turnover, debtors turnover, JAIIB AFM"
      breadcrumb={[
        { label: 'Home', url: '/' },
        { label: 'JAIIB', url: '/practice-tests' },
        { label: 'AFM', url: '/practice-tests/afm' },
        { label: 'Ratio Analysis' },
      ]}
      content={content}
      relatedTopics={relatedTopics}
      lastUpdated="June 2026"
    />
  );
};

export default RatioAnalysisPage;
