import React from 'react';
import TopicPageLayout from './TopicPageLayout';

const HomeLoanPage: React.FC = () => {
  const relatedTopics = [
    { title: 'Mutual Funds Guide', url: '/jaiib/rbwm/mutual-funds-guide' },
    { title: 'Financial Inclusion Schemes', url: '/jaiib/rbwm/financial-inclusion' },
    { title: 'Repo Rate & LAF Corridor', url: '/jaiib/ppb/repo-rate-explained' },
    { title: 'NPA Classification & IRAC Norms', url: '/jaiib/ppb/npa-classification' },
    { title: 'SARFAESI Act 2002', url: '/jaiib/ppb/sarfaesi-act' },
  ];

  const content = (
    <div>
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
        Home Loan Guide — LTV Ratio, PMAY Subsidy, EMI Calculation & Documentation
      </h1>

      <p className="text-lg text-gray-700 mb-6">
        Home Loans are one of the most significant retail banking products and a key topic in
        the JAIIB RBWM (Retail Banking & Wealth Management) paper. Understanding the home loan process — from application to disbursement — including Loan-to-Value (LTV) ratio, Pradhan Mantri Awas Yojana (PMAY) subsidy, EMI calculation methodology, NPA norms in housing finance, and documentation requirements is essential for banking professionals. This guide covers all aspects of home loans relevant for JAIIB preparation.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Home Loan Process Overview</h2>
      <p className="text-gray-700 mb-4">
        The home loan process involves several stages: (1) Application and documentation submission; (2) Credit appraisal — income verification, CIBIL score check (minimum 700+ preferred), existing obligations; (3) Property valuation — technical and legal verification of the property; (4) Sanction — loan amount approved based on repayment capacity and LTV norms; (5) Disbursement — may be full (for ready property) or in stages (for under-construction); (6) Repayment through EMI over the loan tenure.
      </p>
      <p className="text-gray-700 mb-4">
        Banks evaluate the borrower's repayment capacity using the Fixed Obligation to Income Ratio (FOIR). Typically, total EMI obligations should not exceed 50-60% of net monthly income. The loan tenure can extend up to 30 years, with maximum age at maturity typically being 65-70 years for salaried individuals.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">LTV (Loan-to-Value) Ratio</h2>
      <p className="text-gray-700 mb-4">
        LTV ratio determines the maximum loan amount a bank can provide relative to the property's value. RBI has prescribed differential LTV norms based on loan amount:
      </p>
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Loan Amount</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Maximum LTV</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Minimum Down Payment</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Risk Weight</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">Up to ₹30 lakh</td>
              <td className="px-4 py-3 text-sm text-gray-700">90%</td>
              <td className="px-4 py-3 text-sm text-gray-700">10%</td>
              <td className="px-4 py-3 text-sm text-gray-700">35%</td>
            </tr>
            <tr className="border-b bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">₹30 lakh to ₹75 lakh</td>
              <td className="px-4 py-3 text-sm text-gray-700">80%</td>
              <td className="px-4 py-3 text-sm text-gray-700">20%</td>
              <td className="px-4 py-3 text-sm text-gray-700">35%</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">Above ₹75 lakh</td>
              <td className="px-4 py-3 text-sm text-gray-700">75%</td>
              <td className="px-4 py-3 text-sm text-gray-700">25%</td>
              <td className="px-4 py-3 text-sm text-gray-700">50%</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">PMAY (Pradhan Mantri Awas Yojana) — Credit Linked Subsidy</h2>
      <p className="text-gray-700 mb-4">
        PMAY provides interest subsidy on home loans for eligible beneficiaries under the Credit Linked Subsidy Scheme (CLSS). The subsidy is calculated at the specified rate on a maximum loan amount for a tenure of 20 years (or actual tenure, whichever is lower). The Net Present Value (NPV) of the subsidy is credited upfront to the borrower's loan account, reducing the outstanding principal and hence EMI burden.
      </p>
      <p className="text-gray-700 mb-4">
        Eligibility is determined by household annual income: EWS (up to ₹3 lakh) — 6.5% subsidy on loan up to ₹6 lakh; LIG (₹3-6 lakh) — 6.5% subsidy on loan up to ₹6 lakh; MIG-I (₹6-12 lakh) — 4% subsidy on loan up to ₹9 lakh; MIG-II (₹12-18 lakh) — 3% subsidy on loan up to ₹12 lakh. The property should be the first house of the beneficiary family, and women ownership/co-ownership is mandatory for EWS/LIG categories.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">EMI Calculation</h2>
      <p className="text-gray-700 mb-4">
        EMI (Equated Monthly Instalment) is calculated using the reducing balance method:
      </p>
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 font-mono text-center">
        <p className="text-lg font-semibold text-gray-900">EMI = P × r × (1+r)^n / [(1+r)^n - 1]</p>
        <p className="text-sm text-gray-600 mt-2">Where P = Principal, r = monthly interest rate (annual rate/12), n = total months</p>
      </div>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-gray-900 mb-2"><strong>Example:</strong> Loan = ₹50 lakh, Rate = 8.5% p.a., Tenure = 20 years</p>
        <ul className="text-gray-700 text-sm space-y-1">
          <li>Monthly rate (r) = 8.5% / 12 = 0.7083% = 0.007083</li>
          <li>Number of months (n) = 20 × 12 = 240</li>
          <li>EMI = 50,00,000 × 0.007083 × (1.007083)^240 / [(1.007083)^240 - 1]</li>
          <li>EMI ≈ ₹43,391 per month</li>
          <li>Total interest paid over 20 years = (₹43,391 × 240) - ₹50,00,000 = ₹54,13,840</li>
        </ul>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">NPA Norms in Housing Loans</h2>
      <p className="text-gray-700 mb-4">
        A home loan account is classified as NPA if the EMI/interest remains overdue for more than 90 days. Under IRAC norms: Substandard (NPA for up to 12 months — 15% provision); Doubtful 1 (12-24 months — 25% provision on unsecured portion); Doubtful 2 (24-48 months — 40% provision); Doubtful 3 (more than 48 months — 100% provision); Loss (irrecoverable — 100% provision). Banks can exercise SARFAESI Act powers to recover outstanding amounts from defaulters.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Documentation Required</h2>
      <p className="text-gray-700 mb-4">
        Key documents include: (a) KYC documents (Aadhaar, PAN, address proof); (b) Income proof (salary slips for 3-6 months, Form 16, ITR for self-employed); (c) Bank statements (6-12 months); (d) Property documents (sale deed, title deed, approved building plan, encumbrance certificate, NOC from society); (e) Processing fee payment; (f) Property valuation report. For under-construction properties, banks also require builder's RERA registration and construction progress certificates.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Key Points for JAIIB Exam</h2>
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
        <ul className="space-y-2 text-amber-900 text-sm">
          <li>• Maximum LTV: <strong>90% for loans up to ₹30 lakh</strong></li>
          <li>• Home loan NPA: overdue for <strong>more than 90 days</strong></li>
          <li>• PMAY subsidy: <strong>6.5% for EWS/LIG</strong> (on max ₹6 lakh loan for 20 years)</li>
          <li>• EMI method: <strong>Reducing balance</strong> (not flat rate)</li>
          <li>• FOIR benchmark: EMIs should not exceed <strong>50-60% of net income</strong></li>
          <li>• Tenure max: <strong>30 years</strong> for salaried individuals</li>
          <li>• Tax benefit: Section 24(b) — interest up to <strong>₹2 lakh</strong> deduction</li>
          <li>• Section 80C — principal repayment up to <strong>₹1.5 lakh</strong> deduction</li>
          <li>• EBLR linked: home loan rate resets <strong>every 3 months</strong></li>
        </ul>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Sample MCQs for JAIIB RBWM</h2>

      <div className="space-y-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <p className="font-semibold text-gray-900 mb-3">Q1. The maximum LTV ratio for a home loan of ₹50 lakh as per RBI norms is:</p>
          <ul className="space-y-1 text-gray-700 mb-3 text-sm">
            <li>(a) 90%</li>
            <li>(b) 85%</li>
            <li>(c) 80%</li>
            <li>(d) 75%</li>
          </ul>
          <div className="bg-green-50 border border-green-200 rounded p-3">
            <p className="text-green-900 text-sm"><strong>Answer: (c)</strong> — For home loans between ₹30 lakh and ₹75 lakh, the maximum LTV is 80%. The borrower must pay at least 20% as down payment.</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <p className="font-semibold text-gray-900 mb-3">Q2. Under PMAY CLSS, the interest subsidy rate for LIG category is:</p>
          <ul className="space-y-1 text-gray-700 mb-3 text-sm">
            <li>(a) 3%</li>
            <li>(b) 4%</li>
            <li>(c) 6.5%</li>
            <li>(d) 8%</li>
          </ul>
          <div className="bg-green-50 border border-green-200 rounded p-3">
            <p className="text-green-900 text-sm"><strong>Answer: (c)</strong> — Both EWS and LIG categories receive 6.5% interest subsidy under PMAY CLSS on a loan amount of up to ₹6 lakh for a maximum period of 20 years.</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <p className="font-semibold text-gray-900 mb-3">Q3. A home loan becomes NPA when EMI is overdue for more than:</p>
          <ul className="space-y-1 text-gray-700 mb-3 text-sm">
            <li>(a) 30 days</li>
            <li>(b) 60 days</li>
            <li>(c) 90 days</li>
            <li>(d) 180 days</li>
          </ul>
          <div className="bg-green-50 border border-green-200 rounded p-3">
            <p className="text-green-900 text-sm"><strong>Answer: (c)</strong> — As per IRAC norms, a home loan account is classified as NPA if EMI/interest remains overdue for more than 90 days.</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <TopicPageLayout
      title="Home Loan Guide — LTV Ratio, PMAY, EMI Calculation, NPA | JAIIB RBWM 2026"
      description="Complete guide to Home Loans for JAIIB RBWM 2026. Learn LTV ratio, PMAY subsidy, EMI calculation formula, NPA in housing, documentation requirements, and practice MCQs."
      canonical="https://mockmaster.fun/jaiib/rbwm/home-loan-guide"
      keywords="home loan LTV ratio, PMAY subsidy, EMI calculation formula, housing loan NPA, home loan documentation, JAIIB RBWM"
      breadcrumb={[
        { label: 'Home', url: '/' },
        { label: 'JAIIB', url: '/practice-tests' },
        { label: 'RBWM', url: '/practice-tests/rbwm' },
        { label: 'Home Loan Guide' },
      ]}
      content={content}
      relatedTopics={relatedTopics}
      lastUpdated="June 2026"
    />
  );
};

export default HomeLoanPage;
