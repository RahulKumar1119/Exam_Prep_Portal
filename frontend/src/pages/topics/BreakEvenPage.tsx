import React from 'react';
import TopicPageLayout from './TopicPageLayout';

const BreakEvenPage: React.FC = () => {
  const relatedTopics = [
    { title: 'NPV & IRR — Capital Budgeting', url: '/jaiib/afm/npv-irr-explained' },
    { title: 'Depreciation Methods (SLM & WDV)', url: '/jaiib/afm/depreciation-methods' },
    { title: 'Ratio Analysis for Banking', url: '/jaiib/afm/ratio-analysis' },
    { title: 'Mutual Funds Guide', url: '/jaiib/rbwm/mutual-funds-guide' },
    { title: 'Home Loan Guide', url: '/jaiib/rbwm/home-loan-guide' },
  ];

  const content = (
    <div>
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
        Break-Even Analysis — BEP Formula, Contribution Margin, P/V Ratio & Solved Examples
      </h1>

      <p className="text-lg text-gray-700 mb-6">
        Break-Even Analysis is a fundamental concept in the JAIIB AFM (Accounting & Financial
        Management for Bankers) paper. It helps determine the point at which total revenue equals total costs — meaning neither profit nor loss. Understanding the Break-Even Point (BEP), contribution margin, Profit/Volume (P/V) ratio, and margin of safety is essential for credit appraisal, project evaluation, and financial analysis. This comprehensive guide covers all formulas, concepts, and solved examples for JAIIB preparation.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">What is Break-Even Analysis?</h2>
      <p className="text-gray-700 mb-4">
        Break-Even Analysis is a cost-volume-profit (CVP) technique used to determine the level of sales at which a business covers all its costs without making a profit or loss. At the Break-Even Point (BEP), Total Revenue = Total Costs (Fixed Costs + Variable Costs). Any sales above BEP generate profit, and any sales below BEP result in a loss. This analysis is crucial for banks when evaluating loan proposals — it helps assess the minimum viable production/sales level for a business to sustain operations.
      </p>
      <p className="text-gray-700 mb-4">
        The key cost categories are: (a) Fixed Costs — costs that remain constant regardless of production volume (rent, salary, insurance, depreciation); (b) Variable Costs — costs that vary directly with production volume (raw materials, direct labor, packaging); (c) Semi-Variable Costs — costs that have both fixed and variable components (electricity, maintenance).
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Key Formulas</h2>
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 space-y-3">
        <p className="font-mono text-gray-900"><strong>Contribution = Sales - Variable Costs</strong></p>
        <p className="font-mono text-gray-900"><strong>Contribution per unit = Selling Price per unit - Variable Cost per unit</strong></p>
        <p className="font-mono text-gray-900"><strong>P/V Ratio = (Contribution / Sales) × 100</strong></p>
        <p className="font-mono text-gray-900"><strong>BEP (units) = Fixed Costs / Contribution per unit</strong></p>
        <p className="font-mono text-gray-900"><strong>BEP (₹ sales) = Fixed Costs / P/V Ratio</strong></p>
        <p className="font-mono text-gray-900"><strong>Margin of Safety = Actual Sales - BEP Sales</strong></p>
        <p className="font-mono text-gray-900"><strong>Margin of Safety Ratio = (Margin of Safety / Actual Sales) × 100</strong></p>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Contribution Margin & P/V Ratio</h2>
      <p className="text-gray-700 mb-4">
        Contribution is the amount available to cover fixed costs and generate profit after deducting variable costs from sales. The P/V Ratio (Profit-Volume Ratio) expresses contribution as a percentage of sales. A higher P/V ratio indicates greater profitability per rupee of sales and a lower break-even point. For example, if a product sells for ₹100 with variable cost of ₹60, the contribution is ₹40 and P/V ratio is 40%. This means for every ₹100 of sales, ₹40 is available to cover fixed costs and profit.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Solved Example 1 — Basic BEP Calculation</h2>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-gray-900 mb-2"><strong>Given:</strong> Selling price = ₹200/unit, Variable cost = ₹120/unit, Fixed costs = ₹4,00,000/year</p>
        <p className="text-gray-900 mb-2"><strong>Solution:</strong></p>
        <ul className="text-gray-700 text-sm space-y-1">
          <li>Contribution per unit = ₹200 - ₹120 = ₹80</li>
          <li>P/V Ratio = (80/200) × 100 = 40%</li>
          <li>BEP (units) = ₹4,00,000 / ₹80 = 5,000 units</li>
          <li>BEP (sales) = ₹4,00,000 / 0.40 = ₹10,00,000</li>
        </ul>
        <p className="text-gray-900 mt-2"><strong>Interpretation:</strong> The business must sell at least 5,000 units (worth ₹10 lakh) to cover all costs.</p>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Solved Example 2 — Margin of Safety</h2>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-gray-900 mb-2"><strong>Given:</strong> Actual sales = ₹15,00,000, BEP sales = ₹10,00,000</p>
        <p className="text-gray-900 mb-2"><strong>Solution:</strong></p>
        <ul className="text-gray-700 text-sm space-y-1">
          <li>Margin of Safety = ₹15,00,000 - ₹10,00,000 = ₹5,00,000</li>
          <li>Margin of Safety Ratio = (5,00,000 / 15,00,000) × 100 = 33.33%</li>
          <li>Profit = Margin of Safety × P/V Ratio = ₹5,00,000 × 0.40 = ₹2,00,000</li>
        </ul>
        <p className="text-gray-900 mt-2"><strong>Interpretation:</strong> Sales can drop by 33.33% before the business starts incurring losses.</p>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Key Relationships — Summary Table</h2>
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Concept</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Formula</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Significance</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">BEP (units)</td>
              <td className="px-4 py-3 text-sm text-gray-700">Fixed Costs ÷ Contribution per unit</td>
              <td className="px-4 py-3 text-sm text-gray-700">Minimum units to sell to avoid loss</td>
            </tr>
            <tr className="border-b bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">BEP (₹)</td>
              <td className="px-4 py-3 text-sm text-gray-700">Fixed Costs ÷ P/V Ratio</td>
              <td className="px-4 py-3 text-sm text-gray-700">Minimum revenue to cover all costs</td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">P/V Ratio</td>
              <td className="px-4 py-3 text-sm text-gray-700">Contribution ÷ Sales × 100</td>
              <td className="px-4 py-3 text-sm text-gray-700">Profitability per rupee of sales</td>
            </tr>
            <tr className="border-b bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">Margin of Safety</td>
              <td className="px-4 py-3 text-sm text-gray-700">Actual Sales - BEP Sales</td>
              <td className="px-4 py-3 text-sm text-gray-700">Buffer before loss begins</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">Target Profit Sales</td>
              <td className="px-4 py-3 text-sm text-gray-700">(Fixed Costs + Target Profit) ÷ P/V Ratio</td>
              <td className="px-4 py-3 text-sm text-gray-700">Sales needed for desired profit</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Relevance in Banking (Credit Appraisal)</h2>
      <p className="text-gray-700 mb-4">
        For bankers, break-even analysis is a critical tool during credit appraisal of manufacturing and trading businesses. A bank evaluates: (a) How quickly does the borrower reach break-even? A lower BEP relative to installed capacity indicates lower risk; (b) What is the margin of safety? Higher margin means the business can withstand revenue declines; (c) What is the P/V ratio? Higher P/V ratio means better ability to service debt from operations. Banks typically prefer lending to businesses operating well above their BEP with a margin of safety of at least 25-30%.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Key Points for JAIIB Exam</h2>
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
        <ul className="space-y-2 text-amber-900 text-sm">
          <li>• At BEP: <strong>Profit = 0, Contribution = Fixed Costs</strong></li>
          <li>• Higher fixed costs → <strong>higher BEP</strong></li>
          <li>• Higher P/V ratio → <strong>lower BEP</strong></li>
          <li>• Margin of Safety = <strong>Profit / P/V Ratio</strong> (alternative formula)</li>
          <li>• BEP assumes selling price, variable cost, and fixed costs remain constant</li>
          <li>• Angle of Incidence: angle between sales line and total cost line at BEP</li>
          <li>• Larger angle of incidence = <strong>higher profit rate</strong> above BEP</li>
        </ul>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Sample MCQs for JAIIB AFM</h2>

      <div className="space-y-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <p className="font-semibold text-gray-900 mb-3">Q1. If fixed costs are ₹3,00,000 and P/V ratio is 30%, the BEP in sales value is:</p>
          <ul className="space-y-1 text-gray-700 mb-3 text-sm">
            <li>(a) ₹9,00,000</li>
            <li>(b) ₹10,00,000</li>
            <li>(c) ₹12,00,000</li>
            <li>(d) ₹15,00,000</li>
          </ul>
          <div className="bg-green-50 border border-green-200 rounded p-3">
            <p className="text-green-900 text-sm"><strong>Answer: (b)</strong> — BEP (sales) = Fixed Costs / P/V Ratio = ₹3,00,000 / 0.30 = ₹10,00,000.</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <p className="font-semibold text-gray-900 mb-3">Q2. A product has selling price ₹500, variable cost ₹300. The P/V ratio is:</p>
          <ul className="space-y-1 text-gray-700 mb-3 text-sm">
            <li>(a) 60%</li>
            <li>(b) 40%</li>
            <li>(c) 50%</li>
            <li>(d) 30%</li>
          </ul>
          <div className="bg-green-50 border border-green-200 rounded p-3">
            <p className="text-green-900 text-sm"><strong>Answer: (b)</strong> — P/V Ratio = Contribution/Sales × 100 = (500-300)/500 × 100 = 200/500 × 100 = 40%.</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <p className="font-semibold text-gray-900 mb-3">Q3. If actual sales are ₹20 lakh and BEP is ₹15 lakh, the margin of safety ratio is:</p>
          <ul className="space-y-1 text-gray-700 mb-3 text-sm">
            <li>(a) 20%</li>
            <li>(b) 25%</li>
            <li>(c) 30%</li>
            <li>(d) 75%</li>
          </ul>
          <div className="bg-green-50 border border-green-200 rounded p-3">
            <p className="text-green-900 text-sm"><strong>Answer: (b)</strong> — Margin of Safety = ₹20L - ₹15L = ₹5L. MoS Ratio = (5/20) × 100 = 25%. Sales can drop 25% before losses begin.</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <p className="font-semibold text-gray-900 mb-3">Q4. At the Break-Even Point, which statement is TRUE?</p>
          <ul className="space-y-1 text-gray-700 mb-3 text-sm">
            <li>(a) Total contribution = Total variable costs</li>
            <li>(b) Total contribution = Total fixed costs</li>
            <li>(c) Total revenue = Total variable costs</li>
            <li>(d) Fixed costs = Variable costs</li>
          </ul>
          <div className="bg-green-50 border border-green-200 rounded p-3">
            <p className="text-green-900 text-sm"><strong>Answer: (b)</strong> — At BEP, Total Contribution exactly equals Total Fixed Costs, resulting in zero profit. Beyond BEP, contribution exceeds fixed costs, generating profit.</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <TopicPageLayout
      title="Break-Even Analysis — BEP Formula, P/V Ratio, Margin of Safety | JAIIB AFM 2026"
      description="Complete guide to Break-Even Analysis for JAIIB AFM 2026. Learn BEP formula, contribution margin, P/V ratio, margin of safety with solved examples and practice MCQs."
      canonical="https://mockmaster.fun/jaiib/afm/break-even-analysis"
      keywords="break even analysis JAIIB, BEP formula, contribution margin, P/V ratio, margin of safety, cost volume profit analysis, JAIIB AFM"
      breadcrumb={[
        { label: 'Home', url: '/' },
        { label: 'JAIIB', url: '/practice-tests' },
        { label: 'AFM', url: '/practice-tests/afm' },
        { label: 'Break-Even Analysis' },
      ]}
      content={content}
      relatedTopics={relatedTopics}
      lastUpdated="June 2026"
    />
  );
};

export default BreakEvenPage;
