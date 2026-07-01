import React from 'react';
import TopicPageLayout from './TopicPageLayout';

const SarfaesiActPage: React.FC = () => {
  const relatedTopics = [
    { title: 'CRR (Cash Reserve Ratio) Explained', url: '/jaiib/ppb/crr-explained' },
    { title: 'NPA Classification & IRAC Norms', url: '/jaiib/ppb/npa-classification' },
    { title: 'Priority Sector Lending (PSL) Norms', url: '/jaiib/ppb/priority-sector-lending' },
    { title: 'NPV & IRR — Capital Budgeting', url: '/jaiib/afm/npv-irr-explained' },
  ];

  const content = (
    <div>
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
        SARFAESI Act 2002 Explained — NPA Recovery for JAIIB PPB 2026
      </h1>

      <p className="text-lg text-gray-700 mb-6">
        The Securitisation and Reconstruction of Financial Assets and Enforcement of Security Interest Act, 2002 (SARFAESI Act) is one of the most powerful NPA recovery mechanisms available to banks and financial institutions in India. This Act allows secured creditors to enforce their security interest without court intervention, significantly speeding up the recovery process. For the JAIIB PPB examination, SARFAESI is a critical topic that covers legislative provisions, procedural requirements, borrower rights, and practical application. This guide provides a complete understanding of the Act including its key sections, recovery mechanisms, comparisons with other recovery channels, and recent amendments.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Full Form and Objective</h2>
      <p className="text-gray-700 mb-4">
        SARFAESI stands for <strong>Securitisation and Reconstruction of Financial Assets and Enforcement of Security Interest</strong>. The Act was enacted in 2002 with three primary objectives: (1) to enable securitisation of financial assets by banks and financial institutions, (2) to facilitate reconstruction of non-performing assets through Asset Reconstruction Companies (ARCs), and (3) to allow enforcement of security interest by secured creditors without requiring court intervention — which is the most commonly used provision.
      </p>
      <p className="text-gray-700 mb-4">
        Before SARFAESI, banks had to approach courts or Debt Recovery Tribunals (DRTs) for NPA recovery, which was extremely time-consuming due to judicial delays. SARFAESI empowered banks to take direct action against defaulting borrowers, dramatically reducing recovery timelines from years to months.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Applicability — When SARFAESI Can Be Used</h2>
      <p className="text-gray-700 mb-4">
        The SARFAESI Act applies when the following conditions are met:
      </p>
      <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
        <li><strong>NPA threshold:</strong> The outstanding amount must be ₹1 lakh or more (reduced from ₹10 lakh by amendment)</li>
        <li><strong>Security requirement:</strong> The loan must be a secured loan with tangible security (immovable or movable property)</li>
        <li><strong>Secured creditor:</strong> Only banks, financial institutions, and NBFCs with asset size of ₹500 crore or more (or notified by RBI) can invoke SARFAESI</li>
        <li><strong>NPA classification:</strong> The account must be classified as NPA as per RBI norms</li>
      </ul>

      <h3 className="text-xl font-bold text-gray-800 mt-6 mb-3">Where SARFAESI Does NOT Apply</h3>
      <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
        <li>When security interest is a pledge (movable property under possession of creditor)</li>
        <li>Liens on goods, money, or securities</li>
        <li>Any conditional sale, hire-purchase, or lease where property is owned by the secured creditor</li>
        <li>Security interest created in aircraft (governed by separate legislation)</li>
        <li>Unpledged or unsecured loans (no security to enforce)</li>
        <li>Agricultural land — cannot be enforced against agricultural land</li>
        <li>When debt is less than ₹1 lakh</li>
        <li>Where the secured asset is less than 20% of the outstanding amount (secured debt ≥ 20% of outstanding)</li>
      </ul>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Section 13(2) Notice — The 60-Day Demand Notice</h2>
      <p className="text-gray-700 mb-4">
        Section 13(2) is the starting point of SARFAESI proceedings. After classifying an account as NPA, the secured creditor (bank) issues a written notice to the borrower and guarantor demanding repayment of the outstanding dues within 60 days from the date of the notice. This notice must contain:
      </p>
      <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
        <li>Details of the outstanding amount (principal + interest + other charges)</li>
        <li>A statement that the account has been classified as NPA</li>
        <li>The secured assets proposed to be enforced</li>
        <li>A clear demand for payment within 60 days</li>
        <li>A warning that upon failure to pay, the bank will exercise rights under Section 13(4)</li>
      </ul>
      <p className="text-gray-700 mb-4">
        The borrower has the right to make representations or raise objections within 60 days. The bank must consider these representations and communicate its decision in writing. If the bank rejects the representation, the borrower can approach the DRT under Section 17 within 45 days of receiving the rejection.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Section 13(4) — Measures After 60 Days</h2>
      <p className="text-gray-700 mb-4">
        If the borrower fails to repay within 60 days or the representation is rejected, the secured creditor can take one or more of the following measures under Section 13(4):
      </p>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <ul className="space-y-3 text-blue-900 text-sm">
          <li><strong>(a) Take possession</strong> of the secured assets of the borrower including transfer by way of lease, assignment, or sale for realizing the secured asset</li>
          <li><strong>(b) Take over management</strong> of the business of the borrower including the right to transfer by way of lease, assignment, or sale for realizing the secured asset</li>
          <li><strong>(c) Appoint a person</strong> (the "manager") to manage the secured assets whose possession has been taken over by the secured creditor</li>
          <li><strong>(d) Require any person</strong> who has acquired the secured asset from the borrower and from whom money is due to the borrower to pay such money directly to the secured creditor</li>
        </ul>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Three Functions Under SARFAESI Act</h2>
      <p className="text-gray-700 mb-4">
        The SARFAESI Act provides for three distinct mechanisms for dealing with NPAs:
      </p>

      <h3 className="text-xl font-bold text-gray-800 mt-6 mb-3">1. Securitisation (Chapter II)</h3>
      <p className="text-gray-700 mb-4">
        Banks can securitise their financial assets (including NPAs) by issuing security receipts to qualified institutional buyers. This allows banks to convert illiquid assets into tradable securities, improving their balance sheet. The process involves transferring financial assets to a Special Purpose Vehicle (SPV) which issues securities backed by those assets.
      </p>

      <h3 className="text-xl font-bold text-gray-800 mt-6 mb-3">2. Asset Reconstruction (Chapter III)</h3>
      <p className="text-gray-700 mb-4">
        Banks can sell their NPAs to Asset Reconstruction Companies (ARCs) registered with the RBI. The ARC acquires the financial assets, issues security receipts to the selling bank, and then undertakes recovery using various means including restructuring, enforcement, settlement, or sale. ARCs must be registered with the RBI and have a minimum net-owned fund of ₹100 crore (revised from ₹2 crore).
      </p>

      <h3 className="text-xl font-bold text-gray-800 mt-6 mb-3">3. Enforcement of Security Interest (Chapter IV)</h3>
      <p className="text-gray-700 mb-4">
        This is the most widely used provision. It allows secured creditors to directly enforce their security interest (take possession and sell secured assets) without approaching any court. The entire Section 13 procedure — from notice to possession to sale — operates outside the court system, though borrowers can challenge actions before the DRT.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">DRT vs SARFAESI — Comparison</h2>
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Parameter</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">DRT</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">SARFAESI</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">Governing Act</td>
              <td className="px-4 py-3 text-sm text-gray-700">RDDBFI Act, 1993</td>
              <td className="px-4 py-3 text-sm text-gray-700">SARFAESI Act, 2002</td>
            </tr>
            <tr className="border-b bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">Minimum Amount</td>
              <td className="px-4 py-3 text-sm text-gray-700">₹20 lakh</td>
              <td className="px-4 py-3 text-sm text-gray-700">₹1 lakh</td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">Nature</td>
              <td className="px-4 py-3 text-sm text-gray-700">Judicial (tribunal adjudication)</td>
              <td className="px-4 py-3 text-sm text-gray-700">Non-judicial (self-help mechanism)</td>
            </tr>
            <tr className="border-b bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">Secured/Unsecured</td>
              <td className="px-4 py-3 text-sm text-gray-700">Both secured and unsecured debts</td>
              <td className="px-4 py-3 text-sm text-gray-700">Only secured debts</td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">Timeline</td>
              <td className="px-4 py-3 text-sm text-gray-700">Months to years (judicial process)</td>
              <td className="px-4 py-3 text-sm text-gray-700">60 days notice + possession</td>
            </tr>
            <tr className="border-b bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">Appeal</td>
              <td className="px-4 py-3 text-sm text-gray-700">DRAT (within 30 days)</td>
              <td className="px-4 py-3 text-sm text-gray-700">DRT under Sec 17 (within 45 days)</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">Agricultural Land</td>
              <td className="px-4 py-3 text-sm text-gray-700">Can adjudicate</td>
              <td className="px-4 py-3 text-sm text-gray-700">Cannot enforce against agricultural land</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Key Sections of SARFAESI Act</h2>
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Section</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Provision</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">Section 5</td>
              <td className="px-4 py-3 text-sm text-gray-700">Acquisition of financial assets by ARC</td>
            </tr>
            <tr className="border-b bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">Section 9</td>
              <td className="px-4 py-3 text-sm text-gray-700">Measures for asset reconstruction</td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">Section 13(2)</td>
              <td className="px-4 py-3 text-sm text-gray-700">Demand notice to borrower (60 days)</td>
            </tr>
            <tr className="border-b bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">Section 13(3A)</td>
              <td className="px-4 py-3 text-sm text-gray-700">Bank must consider borrower's representation</td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">Section 13(4)</td>
              <td className="px-4 py-3 text-sm text-gray-700">Measures available after 60-day period expires</td>
            </tr>
            <tr className="border-b bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">Section 14</td>
              <td className="px-4 py-3 text-sm text-gray-700">Assistance of Chief Metropolitan Magistrate/DM for possession</td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">Section 17</td>
              <td className="px-4 py-3 text-sm text-gray-700">Borrower's right to appeal to DRT (within 45 days)</td>
            </tr>
            <tr className="border-b bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">Section 18</td>
              <td className="px-4 py-3 text-sm text-gray-700">Appeal to DRAT against DRT order (within 30 days)</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">Section 31</td>
              <td className="px-4 py-3 text-sm text-gray-700">Overriding effect over other laws</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Important Amendments</h2>
      <p className="text-gray-700 mb-4">
        The SARFAESI Act has been amended several times to strengthen the recovery framework. Key amendments include: The 2016 Amendment reduced the threshold for NBFCs to invoke SARFAESI (asset size ₹500 crore+), introduced registration of security interests with CERSAI (Central Registry), and made it mandatory for secured creditors to register the satisfaction of charge within 30 days. The Enforcement of Security Interest and Recovery of Debts Laws and Miscellaneous Provisions (Amendment) Act, 2016 also provided for priority of secured creditors over government dues (except workmen dues for 12 months preceding the liquidation) and reduced the minimum NPA threshold from ₹10 lakh to ₹1 lakh.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Key Points for JAIIB Exam</h2>
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
        <ul className="space-y-2 text-amber-900 text-sm">
          <li>• SARFAESI applies to secured debts of <strong>₹1 lakh and above</strong></li>
          <li>• Section 13(2) notice gives <strong>60 days</strong> to the borrower for repayment</li>
          <li>• SARFAESI is a <strong>non-judicial</strong> mechanism (no court needed initially)</li>
          <li>• <strong>Agricultural land</strong> is excluded from enforcement under SARFAESI</li>
          <li>• Borrower can appeal to <strong>DRT within 45 days</strong> under Section 17</li>
          <li>• Section 14 assistance from <strong>CMM/DM</strong> for physical possession</li>
          <li>• Three functions: <strong>Securitisation, Reconstruction, Enforcement</strong></li>
          <li>• Minimum NBFC asset size for SARFAESI: <strong>₹500 crore</strong></li>
          <li>• Security interest must be registered with <strong>CERSAI</strong></li>
        </ul>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Sample MCQs for JAIIB PPB</h2>

      <div className="space-y-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <p className="font-semibold text-gray-900 mb-3">Q1. The notice period under Section 13(2) of SARFAESI Act is:</p>
          <ul className="space-y-1 text-gray-700 mb-3 text-sm">
            <li>(a) 30 days</li>
            <li>(b) 45 days</li>
            <li>(c) 60 days</li>
            <li>(d) 90 days</li>
          </ul>
          <div className="bg-green-50 border border-green-200 rounded p-3">
            <p className="text-green-900 text-sm"><strong>Answer: (c)</strong> — Under Section 13(2), the secured creditor issues a demand notice requiring repayment within 60 days. If the borrower fails to pay within this period, the bank can proceed with enforcement measures under Section 13(4).</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <p className="font-semibold text-gray-900 mb-3">Q2. SARFAESI Act cannot be invoked against which of the following?</p>
          <ul className="space-y-1 text-gray-700 mb-3 text-sm">
            <li>(a) Residential property</li>
            <li>(b) Commercial property</li>
            <li>(c) Agricultural land</li>
            <li>(d) Industrial machinery</li>
          </ul>
          <div className="bg-green-50 border border-green-200 rounded p-3">
            <p className="text-green-900 text-sm"><strong>Answer: (c)</strong> — Agricultural land is specifically excluded from the purview of SARFAESI enforcement. Banks cannot take possession of or sell agricultural land under SARFAESI. For recovery involving agricultural land, banks must use other mechanisms like civil courts or Lok Adalat.</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <p className="font-semibold text-gray-900 mb-3">Q3. A borrower can file an appeal against SARFAESI action to:</p>
          <ul className="space-y-1 text-gray-700 mb-3 text-sm">
            <li>(a) Civil Court within 30 days</li>
            <li>(b) High Court within 45 days</li>
            <li>(c) DRT within 45 days under Section 17</li>
            <li>(d) DRAT within 60 days</li>
          </ul>
          <div className="bg-green-50 border border-green-200 rounded p-3">
            <p className="text-green-900 text-sm"><strong>Answer: (c)</strong> — Under Section 17 of SARFAESI Act, the borrower can file an appeal before the Debt Recovery Tribunal (DRT) within 45 days of the secured creditor's action. Further appeal lies to DRAT within 30 days under Section 18. Civil courts have no jurisdiction over SARFAESI matters.</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <p className="font-semibold text-gray-900 mb-3">Q4. The minimum outstanding amount for invoking SARFAESI Act is:</p>
          <ul className="space-y-1 text-gray-700 mb-3 text-sm">
            <li>(a) ₹50,000</li>
            <li>(b) ₹1 lakh</li>
            <li>(c) ₹10 lakh</li>
            <li>(d) ₹20 lakh</li>
          </ul>
          <div className="bg-green-50 border border-green-200 rounded p-3">
            <p className="text-green-900 text-sm"><strong>Answer: (b)</strong> — After the 2016 amendment, the minimum threshold for invoking SARFAESI was reduced from ₹10 lakh to ₹1 lakh. This made the Act accessible for recovery of even relatively smaller secured loans.</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <TopicPageLayout
      title="SARFAESI Act 2002 Explained — NPA Recovery for JAIIB PPB 2026"
      description="Complete guide to SARFAESI Act for JAIIB PPB 2026. Learn Section 13(2) notice, 60-day procedure, securitisation, asset reconstruction, enforcement of security interest, DRT vs SARFAESI comparison, and practice MCQs."
      canonical="https://mockmaster.fun/jaiib/ppb/sarfaesi-act"
      keywords="SARFAESI Act, SARFAESI full form, NPA recovery, Section 13(2), SARFAESI notice period, DRT vs SARFAESI, enforcement of security interest"
      breadcrumb={[
        { label: 'Home', url: '/' },
        { label: 'JAIIB', url: '/practice-tests' },
        { label: 'PPB', url: '/practice-tests/ppb' },
        { label: 'SARFAESI Act' },
      ]}
      content={content}
      relatedTopics={relatedTopics}
      lastUpdated="June 2026"
    />
  );
};

export default SarfaesiActPage;
