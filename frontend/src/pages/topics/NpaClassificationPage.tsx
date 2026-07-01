import React from 'react';
import TopicPageLayout from './TopicPageLayout';

const NpaClassificationPage: React.FC = () => {
  const relatedTopics = [
    { title: 'CRR (Cash Reserve Ratio) Explained', url: '/jaiib/ppb/crr-explained' },
    { title: 'Priority Sector Lending (PSL) Norms', url: '/jaiib/ppb/priority-sector-lending' },
    { title: 'NPV & IRR — Capital Budgeting', url: '/jaiib/afm/npv-irr-explained' },
    { title: 'SARFAESI Act 2002 Explained', url: '/jaiib/ppb/sarfaesi-act' },
  ];

  const content = (
    <div>
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
        NPA Classification & IRAC Norms — Complete Guide for JAIIB PPB 2026
      </h1>

      <p className="text-lg text-gray-700 mb-6">
        Non-Performing Assets (NPAs) represent one of the most critical challenges in Indian banking and form a cornerstone topic in the JAIIB PPB examination. The Income Recognition and Asset Classification (IRAC) norms, prescribed by the RBI, provide the framework for identifying, classifying, and provisioning for NPAs. Every banker must understand these norms thoroughly, not just for exam success but for day-to-day banking operations. This guide covers the complete NPA classification framework including SMA categories, asset classification norms, provisioning requirements, and special rules for agricultural advances.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">What is a Non-Performing Asset (NPA)?</h2>
      <p className="text-gray-700 mb-4">
        A Non-Performing Asset is a loan or advance where interest or principal payment remains overdue for more than 90 days. For agricultural loans, the overdue period varies depending on the crop season. Once an asset is classified as NPA, the bank must stop recognizing income (interest) on that asset on an accrual basis — income can only be recognized when actually received. This is the core principle of income recognition under IRAC norms.
      </p>
      <p className="text-gray-700 mb-4">
        The 90-day norm applies uniformly to all commercial banks including scheduled commercial banks, small finance banks, and foreign banks operating in India. The classification is done at the borrower-account level (not borrower level for most cases), though in certain circumstances, accounts of the same borrower may be treated separately.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">SMA (Special Mention Account) Classification</h2>
      <p className="text-gray-700 mb-4">
        Before an account turns NPA, the RBI requires banks to identify and report stressed accounts through the Special Mention Account (SMA) framework. SMA classification serves as an early warning system, enabling banks to take corrective action before the account fully deteriorates. The SMA categories are:
      </p>
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Category</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Overdue Period</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Significance</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">SMA-0</td>
              <td className="px-4 py-3 text-sm text-gray-700">1–30 days</td>
              <td className="px-4 py-3 text-sm text-gray-700">Early stress signal; internal monitoring begins</td>
            </tr>
            <tr className="border-b bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">SMA-1</td>
              <td className="px-4 py-3 text-sm text-gray-700">31–60 days</td>
              <td className="px-4 py-3 text-sm text-gray-700">Moderate stress; reported to CRILC (₹5 cr+ loans)</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">SMA-2</td>
              <td className="px-4 py-3 text-sm text-gray-700">61–90 days</td>
              <td className="px-4 py-3 text-sm text-gray-700">Severe stress; triggers ICA/resolution planning</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-gray-700 mb-4">
        Banks are required to report SMA-1 and SMA-2 accounts of ₹5 crore and above to CRILC (Central Repository of Information on Large Credits) on a weekly basis. This data is used for the RBI's early warning framework and the resolution mechanism under the June 7, 2019 circular.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">NPA Classification Categories</h2>
      <p className="text-gray-700 mb-4">
        Once an account is classified as NPA (overdue beyond 90 days), it is further sub-classified into three categories based on the period for which it has remained non-performing and the likelihood of recovery:
      </p>

      <h3 className="text-xl font-bold text-gray-800 mt-6 mb-3">1. Sub-Standard Assets</h3>
      <p className="text-gray-700 mb-4">
        An asset that has remained NPA for a period of 12 months or less is classified as sub-standard. In such cases, there is a real possibility of the bank sustaining some loss if deficiencies in the account are not corrected. The current erosion in value may not be significant, but there is a defined credit weakness that jeopardizes the liquidation of the debt.
      </p>

      <h3 className="text-xl font-bold text-gray-800 mt-6 mb-3">2. Doubtful Assets</h3>
      <p className="text-gray-700 mb-4">
        An asset that has remained in the sub-standard category for 12 months is upgraded to the doubtful category. Doubtful assets are further divided into three sub-categories based on the period for which the asset has remained doubtful:
      </p>
      <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-1">
        <li><strong>Doubtful-1 (D1):</strong> Remained doubtful for up to 1 year</li>
        <li><strong>Doubtful-2 (D2):</strong> Remained doubtful for 1 to 3 years</li>
        <li><strong>Doubtful-3 (D3):</strong> Remained doubtful for more than 3 years</li>
      </ul>

      <h3 className="text-xl font-bold text-gray-800 mt-6 mb-3">3. Loss Assets</h3>
      <p className="text-gray-700 mb-4">
        An asset is classified as a loss asset when it is considered uncollectable and of such little value that its continuance as a bankable asset is not warranted, although there may be some salvage or recovery value. Loss assets are identified by the bank's internal audit, RBI inspection, or external auditors. Even if the amount has not been fully written off, the bank must provide 100% provisioning.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Provisioning Norms</h2>
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Asset Category</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Provisioning Requirement</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">Standard Assets</td>
              <td className="px-4 py-3 text-sm text-gray-700">0.40% (agriculture & SME: 0.25%)</td>
            </tr>
            <tr className="border-b bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">Sub-Standard (Secured)</td>
              <td className="px-4 py-3 text-sm text-gray-700">15% of outstanding</td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">Sub-Standard (Unsecured)</td>
              <td className="px-4 py-3 text-sm text-gray-700">25% of outstanding</td>
            </tr>
            <tr className="border-b bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">Doubtful-1 (Secured portion)</td>
              <td className="px-4 py-3 text-sm text-gray-700">25% of secured portion</td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">Doubtful-2 (Secured portion)</td>
              <td className="px-4 py-3 text-sm text-gray-700">40% of secured portion</td>
            </tr>
            <tr className="border-b bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">Doubtful-3 (Secured portion)</td>
              <td className="px-4 py-3 text-sm text-gray-700">100% of secured portion</td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">Doubtful (Unsecured portion)</td>
              <td className="px-4 py-3 text-sm text-gray-700">100% of unsecured portion</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">Loss Assets</td>
              <td className="px-4 py-3 text-sm text-gray-700">100% (full write-off or provision)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Agricultural NPA — Special Rules</h2>
      <p className="text-gray-700 mb-4">
        Agricultural advances have different NPA recognition timelines depending on the type of crop. For short-duration crops (crop season up to one year), an agricultural loan is classified as NPA if interest/installment remains overdue for two crop seasons. For long-duration crops (crop season longer than one year), the loan becomes NPA if overdue for one crop season. This relaxation recognizes the seasonal and cyclical nature of agricultural income.
      </p>
      <p className="text-gray-700 mb-4">
        For example, if a Kharif crop loan has a due date of January 31 and is not repaid, it will be classified as NPA only after the due date of the next Kharif season's installment passes without payment — effectively giving the farmer two harvest seasons to repay.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">NPA Upgradation</h2>
      <p className="text-gray-700 mb-4">
        An NPA account can be upgraded to standard category if the borrower pays all overdue amounts (arrears of interest and principal). The upgradation is based on the record of recovery performance and not merely on the basis of security value or restructuring exercise. The account should demonstrate satisfactory performance over a specified period before being upgraded.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Write-off vs Technical Write-off</h2>
      <p className="text-gray-700 mb-4">
        A write-off means the bank removes the NPA from its books entirely after making 100% provisioning. However, the borrower's legal liability to repay continues. In a technical write-off, the bank shifts the NPA to a memorandum account while continuing recovery efforts. Technical write-offs reduce reported gross NPA figures but the bank continues pursuing recovery through legal means including SARFAESI, DRT, and Lok Adalat.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Key Points for JAIIB Exam</h2>
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
        <ul className="space-y-2 text-amber-900 text-sm">
          <li>• The <strong>90-day norm</strong> is the universal standard for NPA classification</li>
          <li>• SMA reporting to CRILC is for accounts of <strong>₹5 crore and above</strong></li>
          <li>• Sub-Standard → after <strong>12 months</strong> → Doubtful</li>
          <li>• Unsecured portion of doubtful assets requires <strong>100% provisioning</strong></li>
          <li>• Agricultural NPAs use <strong>crop-season based</strong> classification, not 90 days</li>
          <li>• Income recognition stops on <strong>accrual basis</strong> once account is NPA</li>
          <li>• NPA is classified at <strong>account level</strong>, not borrower level (generally)</li>
        </ul>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Sample MCQs for JAIIB PPB</h2>

      <div className="space-y-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <p className="font-semibold text-gray-900 mb-3">Q1. An advance where interest/principal is overdue for 75 days is classified as:</p>
          <ul className="space-y-1 text-gray-700 mb-3 text-sm">
            <li>(a) NPA — Sub-Standard</li>
            <li>(b) SMA-2</li>
            <li>(c) NPA — Doubtful</li>
            <li>(d) Standard Asset</li>
          </ul>
          <div className="bg-green-50 border border-green-200 rounded p-3">
            <p className="text-green-900 text-sm"><strong>Answer: (b)</strong> — 61-90 days overdue falls under SMA-2 category. The account becomes NPA only after 90 days overdue. At 75 days, it is still technically a standard asset but classified as SMA-2 for monitoring purposes.</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <p className="font-semibold text-gray-900 mb-3">Q2. The provisioning requirement for a secured sub-standard asset is:</p>
          <ul className="space-y-1 text-gray-700 mb-3 text-sm">
            <li>(a) 10%</li>
            <li>(b) 15%</li>
            <li>(c) 20%</li>
            <li>(d) 25%</li>
          </ul>
          <div className="bg-green-50 border border-green-200 rounded p-3">
            <p className="text-green-900 text-sm"><strong>Answer: (b)</strong> — Secured sub-standard assets require 15% provisioning. Unsecured sub-standard assets require 25% provisioning. This is a frequently tested distinction in JAIIB examinations.</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <p className="font-semibold text-gray-900 mb-3">Q3. A sub-standard asset transitions to doubtful category after remaining NPA for:</p>
          <ul className="space-y-1 text-gray-700 mb-3 text-sm">
            <li>(a) 6 months</li>
            <li>(b) 12 months</li>
            <li>(c) 18 months</li>
            <li>(d) 24 months</li>
          </ul>
          <div className="bg-green-50 border border-green-200 rounded p-3">
            <p className="text-green-900 text-sm"><strong>Answer: (b)</strong> — An asset classified as sub-standard moves to doubtful category after remaining in the sub-standard category for a period of 12 months. The total NPA period at this stage is therefore 12 months + 90 days.</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <p className="font-semibold text-gray-900 mb-3">Q4. For short-duration agricultural crops, a loan becomes NPA when overdue for:</p>
          <ul className="space-y-1 text-gray-700 mb-3 text-sm">
            <li>(a) 90 days</li>
            <li>(b) One crop season</li>
            <li>(c) Two crop seasons</li>
            <li>(d) 180 days</li>
          </ul>
          <div className="bg-green-50 border border-green-200 rounded p-3">
            <p className="text-green-900 text-sm"><strong>Answer: (c)</strong> — For short-duration crops (season up to one year), a loan is classified as NPA if installment/interest remains overdue for two crop seasons. For long-duration crops, it is one crop season beyond the due date.</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <TopicPageLayout
      title="NPA Classification & IRAC Norms — Complete Guide for JAIIB PPB 2026"
      description="Learn NPA classification, IRAC norms, SMA categories, provisioning requirements, and agricultural NPA rules for JAIIB PPB 2026. Includes comparison tables and practice MCQs."
      canonical="https://mockmaster.fun/jaiib/ppb/npa-classification"
      keywords="NPA classification, IRAC norms, NPA full form, SMA categories banking, NPA provisioning norms, sub-standard doubtful loss assets"
      breadcrumb={[
        { label: 'Home', url: '/' },
        { label: 'JAIIB', url: '/practice-tests' },
        { label: 'PPB', url: '/practice-tests/ppb' },
        { label: 'NPA Classification' },
      ]}
      content={content}
      relatedTopics={relatedTopics}
      lastUpdated="June 2026"
    />
  );
};

export default NpaClassificationPage;
