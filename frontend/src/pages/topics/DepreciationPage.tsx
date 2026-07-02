import React from 'react';
import TopicPageLayout from './TopicPageLayout';

const DepreciationPage: React.FC = () => {
  const relatedTopics = [
    { title: 'Break-Even Analysis', url: '/jaiib/afm/break-even-analysis' },
    { title: 'NPV & IRR — Capital Budgeting', url: '/jaiib/afm/npv-irr-explained' },
    { title: 'Ratio Analysis for Banking', url: '/jaiib/afm/ratio-analysis' },
    { title: 'NPA Classification & IRAC Norms', url: '/jaiib/ppb/npa-classification' },
    { title: 'Basel III Norms', url: '/jaiib/ppb/basel-norms' },
  ];

  const content = (
    <div>
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
        Depreciation Methods — SLM vs WDV, Formulas, Solved Examples & Accounting
      </h1>

      <p className="text-lg text-gray-700 mb-6">
        Depreciation is a fundamental accounting concept tested extensively in the JAIIB AFM
        (Accounting & Financial Management for Bankers) paper. It represents the systematic allocation of the cost of a tangible fixed asset over its useful life. Banks need to understand depreciation for credit appraisal (assessing a borrower's profitability and cash flows), preparation of financial statements, and calculating the book value of collateral assets. This guide covers the two primary methods — Straight Line Method (SLM) and Written Down Value (WDV) method — with formulas, solved examples, and accounting entries.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">What is Depreciation?</h2>
      <p className="text-gray-700 mb-4">
        Depreciation is the reduction in the value of a fixed asset due to wear and tear, passage of time, obsolescence, or any other cause. As per AS-6 (Revised) / Ind AS 16, depreciation is the systematic allocation of the depreciable amount of an asset over its useful life. The depreciable amount is the cost of an asset minus its residual (scrap) value. Depreciation is a non-cash expense — meaning it reduces profit but does not involve actual cash outflow. This makes it important for cash flow analysis.
      </p>
      <p className="text-gray-700 mb-4">
        Key terms: (a) Cost of Asset — purchase price plus all costs to bring the asset to its intended use location and condition (installation, freight, etc.); (b) Useful Life — period over which the asset is expected to be usable; (c) Residual/Scrap Value — estimated disposal value at end of useful life; (d) Depreciable Amount — Cost minus Residual Value.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Straight Line Method (SLM)</h2>
      <p className="text-gray-700 mb-4">
        Under SLM (also called Fixed Instalment Method), an equal amount of depreciation is charged every year throughout the useful life of the asset. The depreciation charge remains constant year after year.
      </p>
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 font-mono text-center space-y-2">
        <p className="text-lg font-semibold text-gray-900">Annual Depreciation = (Cost - Residual Value) / Useful Life</p>
        <p className="text-lg font-semibold text-gray-900">Rate of Depreciation (SLM) = (Annual Depreciation / Cost) × 100</p>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Written Down Value Method (WDV)</h2>
      <p className="text-gray-700 mb-4">
        Under WDV (also called Diminishing Balance Method), depreciation is calculated as a fixed percentage of the book value (written down value) at the beginning of each year. Since the book value decreases each year, the depreciation amount also decreases progressively.
      </p>
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 font-mono text-center space-y-2">
        <p className="text-lg font-semibold text-gray-900">Depreciation for Year n = WDV at beginning of year × Rate%</p>
        <p className="text-lg font-semibold text-gray-900">Rate (WDV) = 1 - (Residual Value / Cost)^(1/n) × 100</p>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">SLM vs WDV — Detailed Comparison</h2>
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Parameter</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">SLM (Straight Line)</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">WDV (Written Down Value)</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">Depreciation Amount</td>
              <td className="px-4 py-3 text-sm text-gray-700">Equal every year</td>
              <td className="px-4 py-3 text-sm text-gray-700">Higher in initial years, decreases over time</td>
            </tr>
            <tr className="border-b bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">Calculated On</td>
              <td className="px-4 py-3 text-sm text-gray-700">Original cost</td>
              <td className="px-4 py-3 text-sm text-gray-700">Book value (WDV) at start of year</td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">Book Value</td>
              <td className="px-4 py-3 text-sm text-gray-700">Reduces to zero/scrap value</td>
              <td className="px-4 py-3 text-sm text-gray-700">Never reaches zero (approaches residual)</td>
            </tr>
            <tr className="border-b bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">Total Depreciation</td>
              <td className="px-4 py-3 text-sm text-gray-700">Same as WDV over life</td>
              <td className="px-4 py-3 text-sm text-gray-700">Same as SLM over life</td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">Tax Benefit</td>
              <td className="px-4 py-3 text-sm text-gray-700">Spread evenly</td>
              <td className="px-4 py-3 text-sm text-gray-700">Higher in early years (tax advantage)</td>
            </tr>
            <tr className="border-b bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">Used When</td>
              <td className="px-4 py-3 text-sm text-gray-700">Uniform wear and tear (buildings, furniture)</td>
              <td className="px-4 py-3 text-sm text-gray-700">Rapid obsolescence (IT equipment, vehicles)</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">Income Tax Act</td>
              <td className="px-4 py-3 text-sm text-gray-700">Not allowed</td>
              <td className="px-4 py-3 text-sm text-gray-700">Mandated for tax purposes</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Solved Example — SLM</h2>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-gray-900 mb-2"><strong>Given:</strong> Machine cost = ₹5,00,000, Residual value = ₹50,000, Useful life = 10 years</p>
        <p className="text-gray-900 mb-2"><strong>Solution:</strong></p>
        <ul className="text-gray-700 text-sm space-y-1">
          <li>Annual Depreciation = (₹5,00,000 - ₹50,000) / 10 = ₹45,000 per year</li>
          <li>Rate of Depreciation = (₹45,000 / ₹5,00,000) × 100 = 9%</li>
          <li>Book Value after Year 3 = ₹5,00,000 - (3 × ₹45,000) = ₹3,65,000</li>
        </ul>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Solved Example — WDV</h2>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-gray-900 mb-2"><strong>Given:</strong> Machine cost = ₹5,00,000, WDV depreciation rate = 20%</p>
        <p className="text-gray-900 mb-2"><strong>Solution:</strong></p>
        <ul className="text-gray-700 text-sm space-y-1">
          <li>Year 1: Depreciation = ₹5,00,000 × 20% = ₹1,00,000. WDV = ₹4,00,000</li>
          <li>Year 2: Depreciation = ₹4,00,000 × 20% = ₹80,000. WDV = ₹3,20,000</li>
          <li>Year 3: Depreciation = ₹3,20,000 × 20% = ₹64,000. WDV = ₹2,56,000</li>
        </ul>
        <p className="text-gray-900 mt-2"><strong>Note:</strong> Depreciation decreases each year under WDV, providing higher tax benefit in initial years.</p>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Accounting Entries</h2>
      <p className="text-gray-700 mb-4">
        The journal entry for recording depreciation is: <strong>Debit: Depreciation Account (Expense) | Credit: Asset Account</strong> (or Credit: Accumulated Depreciation Account under the provision method). At year-end, depreciation is transferred to Profit & Loss account: Debit: P&L Account | Credit: Depreciation Account. The accumulated depreciation appears on the Balance Sheet as a deduction from the gross value of the asset.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Key Points for JAIIB Exam</h2>
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
        <ul className="space-y-2 text-amber-900 text-sm">
          <li>• SLM: <strong>Equal depreciation each year</strong>, based on original cost</li>
          <li>• WDV: <strong>Decreasing depreciation</strong>, based on written-down value</li>
          <li>• Income Tax Act allows only <strong>WDV method</strong> (except power generating companies)</li>
          <li>• Companies Act / Ind AS allows <strong>both SLM and WDV</strong></li>
          <li>• Depreciation is a <strong>non-cash expense</strong> — add back in cash flow statement</li>
          <li>• Under WDV, book value <strong>never reaches zero</strong></li>
          <li>• Schedule II of Companies Act 2013 specifies useful life of assets</li>
        </ul>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Sample MCQs for JAIIB AFM</h2>

      <div className="space-y-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <p className="font-semibold text-gray-900 mb-3">Q1. An asset costs ₹2,00,000 with a residual value of ₹20,000 and useful life of 9 years. Annual depreciation under SLM is:</p>
          <ul className="space-y-1 text-gray-700 mb-3 text-sm">
            <li>(a) ₹20,000</li>
            <li>(b) ₹22,222</li>
            <li>(c) ₹18,000</li>
            <li>(d) ₹25,000</li>
          </ul>
          <div className="bg-green-50 border border-green-200 rounded p-3">
            <p className="text-green-900 text-sm"><strong>Answer: (a)</strong> — Depreciation = (₹2,00,000 - ₹20,000) / 9 = ₹1,80,000 / 9 = ₹20,000 per year.</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <p className="font-semibold text-gray-900 mb-3">Q2. Under WDV method at 25% rate, if opening WDV is ₹4,00,000, depreciation for the year is:</p>
          <ul className="space-y-1 text-gray-700 mb-3 text-sm">
            <li>(a) ₹80,000</li>
            <li>(b) ₹1,00,000</li>
            <li>(c) ₹1,25,000</li>
            <li>(d) ₹75,000</li>
          </ul>
          <div className="bg-green-50 border border-green-200 rounded p-3">
            <p className="text-green-900 text-sm"><strong>Answer: (b)</strong> — WDV depreciation = ₹4,00,000 × 25% = ₹1,00,000. New WDV = ₹4,00,000 - ₹1,00,000 = ₹3,00,000.</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <p className="font-semibold text-gray-900 mb-3">Q3. Which method of depreciation is mandated under the Income Tax Act?</p>
          <ul className="space-y-1 text-gray-700 mb-3 text-sm">
            <li>(a) Straight Line Method</li>
            <li>(b) Written Down Value Method</li>
            <li>(c) Units of Production Method</li>
            <li>(d) Sum of Years Digits Method</li>
          </ul>
          <div className="bg-green-50 border border-green-200 rounded p-3">
            <p className="text-green-900 text-sm"><strong>Answer: (b)</strong> — The Income Tax Act mandates WDV method for calculating depreciation for tax purposes (except for power generating undertakings which can use SLM).</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <TopicPageLayout
      title="Depreciation Methods — SLM vs WDV, Formulas & Solved Examples | JAIIB AFM 2026"
      description="Complete guide to depreciation methods for JAIIB AFM 2026. Learn SLM vs WDV method, formulas, solved examples, accounting entries, when to use which method, and practice MCQs."
      canonical="https://mockmaster.fun/jaiib/afm/depreciation-methods"
      keywords="depreciation SLM WDV, straight line method, written down value, depreciation formula, JAIIB AFM depreciation, accounting entries depreciation"
      breadcrumb={[
        { label: 'Home', url: '/' },
        { label: 'JAIIB', url: '/practice-tests' },
        { label: 'AFM', url: '/practice-tests/afm' },
        { label: 'Depreciation Methods' },
      ]}
      content={content}
      relatedTopics={relatedTopics}
      lastUpdated="June 2026"
    />
  );
};

export default DepreciationPage;
