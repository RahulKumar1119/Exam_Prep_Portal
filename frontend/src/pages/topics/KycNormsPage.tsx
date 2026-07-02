import React from 'react';
import TopicPageLayout from './TopicPageLayout';

const KycNormsPage: React.FC = () => {
  const relatedTopics = [
    { title: 'NPA Classification & IRAC Norms', url: '/jaiib/ppb/npa-classification' },
    { title: 'SARFAESI Act 2002 Explained', url: '/jaiib/ppb/sarfaesi-act' },
    { title: 'Basel Norms Explained', url: '/jaiib/ppb/basel-norms' },
    { title: 'Negotiable Instruments Act 1881', url: '/jaiib/ppb/negotiable-instruments-act' },
    { title: 'SLR Explained', url: '/jaiib/ppb/slr-explained' },
  ];

  const content = (
    <div>
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
        KYC Norms Explained — V-CIP, CKYC, PMLA 2002 & AML Compliance
      </h1>

      <p className="text-lg text-gray-700 mb-6">
        Know Your Customer (KYC) norms form the backbone of Anti-Money Laundering (AML) and Counter-Financing of Terrorism (CFT) frameworks in Indian banking. For the JAIIB PPB examination, KYC is a high-weightage topic that appears in multiple question formats — from the legal framework under PMLA 2002 to the practical aspects of V-CIP (Video-based Customer Identification Process) and periodic updates. This comprehensive guide covers the complete KYC ecosystem including customer due diligence, CKYC registry, suspicious transaction reporting, beneficial ownership identification, and the latest regulatory requirements that every banking professional must master.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">What is KYC? Full Form & Definition</h2>
      <p className="text-gray-700 mb-4">
        KYC stands for "Know Your Customer" (also referred to as "Know Your Client"). It is a set of guidelines and procedures mandated by the RBI under the Prevention of Money Laundering Act (PMLA), 2002 and RBI Master Direction on KYC (2016, updated periodically). KYC requires financial institutions to verify the identity and address of all customers at the time of account opening and periodically thereafter. The KYC framework has four key pillars: Customer Acceptance Policy (CAP), Customer Identification Procedures (CIP), Monitoring of Transactions, and Risk Management.
      </p>
      <p className="text-gray-700 mb-4">
        The fundamental objective of KYC norms is to prevent banks from being used — intentionally or unintentionally — for money laundering, terrorist financing, or other financial crimes. KYC enables banks to understand their customers better, assess risk profiles, and detect unusual or suspicious activities early. Non-compliance with KYC norms can attract severe penalties including monetary fines, restrictions on business operations, and even cancellation of banking licenses in extreme cases.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Legal Framework — PMLA 2002</h2>
      <p className="text-gray-700 mb-4">
        The Prevention of Money Laundering Act (PMLA) was enacted in 2002 and came into effect on July 1, 2005. It is the primary legislation governing anti-money laundering compliance in India. Under PMLA, the RBI issues KYC directions that all Regulated Entities (REs) — including banks, NBFCs, payment banks, and cooperative banks — must follow. The Act was significantly amended in 2009, 2012, and 2019 to align with the Financial Action Task Force (FATF) recommendations.
      </p>
      <p className="text-gray-700 mb-4">
        Key provisions of PMLA relevant to KYC include: Section 12 mandates reporting entities to maintain records of transactions and verify customer identity; Section 12A requires reporting of cash transactions and suspicious transactions to the Financial Intelligence Unit (FIU-IND); Section 13 empowers the Director of FIU to call for records and impose penalties; and Section 4 prescribes punishment for money laundering with rigorous imprisonment of 3 to 7 years (extendable to 10 years in certain cases).
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">V-CIP (Video-based Customer Identification Process)</h2>
      <p className="text-gray-700 mb-4">
        V-CIP was introduced by the RBI in January 2020 to enable remote, paperless, and consent-based KYC verification through video interaction. This was a landmark reform that allowed banks to onboard customers digitally without requiring physical presence. V-CIP involves a real-time video interaction between the bank's trained official and the customer, during which the official verifies the customer's identity documents (Aadhaar, PAN, etc.) through a live video call.
      </p>
      <p className="text-gray-700 mb-4">
        Key features of V-CIP include: (a) The process must be seamless, secure, and end-to-end encrypted; (b) The customer's live photograph is captured during the video call along with the Aadhaar XML or Digilocker verification; (c) Geo-tagging and IP address logging are mandatory; (d) The entire video interaction must be recorded and stored for audit purposes; (e) The bank official conducting V-CIP must be specifically trained and authorized; (f) V-CIP can be used for both individual and proprietary firm accounts but NOT for trusts, companies, or partnership firms.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Periodic KYC Update Requirements</h2>
      <p className="text-gray-700 mb-4">
        The RBI mandates that banks must periodically update the KYC records of all existing customers based on their risk categorization. The frequency of periodic updates is determined by the customer's risk profile:
      </p>
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Risk Category</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Update Frequency</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Examples</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">High Risk</td>
              <td className="px-4 py-3 text-sm text-gray-700">Every 2 years</td>
              <td className="px-4 py-3 text-sm text-gray-700">PEPs, non-face-to-face customers, high-value accounts, customers from high-risk jurisdictions</td>
            </tr>
            <tr className="border-b bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">Medium Risk</td>
              <td className="px-4 py-3 text-sm text-gray-700">Every 8 years</td>
              <td className="px-4 py-3 text-sm text-gray-700">Standard salaried individuals, regular business accounts</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">Low Risk</td>
              <td className="px-4 py-3 text-sm text-gray-700">Every 10 years</td>
              <td className="px-4 py-3 text-sm text-gray-700">Pensioners, government employees, small accounts under PMJDY</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-gray-700 mb-4">
        Banks cannot restrict account operations solely on the grounds of KYC non-updation without giving adequate notice (at least 30 days). The RBI has also clarified that periodic KYC updates can be done through digital channels including net banking, mobile banking, and V-CIP, without requiring the customer to visit the branch physically.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">CKYC (Central KYC) Registry</h2>
      <p className="text-gray-700 mb-4">
        Central KYC (CKYC) is a centralized repository of KYC records maintained by the Central Registry of Securitisation Asset Reconstruction and Security Interest of India (CERSAI). The CKYC system was introduced to eliminate the need for customers to undergo KYC verification repeatedly with different financial institutions. Once a customer's KYC is done by one financial institution and uploaded to the CKYC registry, other institutions can download and use the same KYC records, thereby reducing duplication and customer inconvenience.
      </p>
      <p className="text-gray-700 mb-4">
        Every financial institution must generate a 14-digit CKYC Identifier (KIN — KYC Identification Number) for each customer and upload the KYC data to the CERSAI registry within 10 days of completing KYC. The CKYC number is linked to the customer's identity proof and remains valid across all financial institutions — banks, insurance companies, mutual funds, and intermediaries registered with SEBI.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Transaction Reporting — CTR & STR</h2>
      <p className="text-gray-700 mb-4">
        Under PMLA and RBI's KYC directions, banks must file certain reports with the Financial Intelligence Unit-India (FIU-IND):
      </p>
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Report Type</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Threshold / Trigger</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Filing Timeline</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">CTR (Cash Transaction Report)</td>
              <td className="px-4 py-3 text-sm text-gray-700">Cash transactions ≥ ₹10 lakh (single or aggregate in a month)</td>
              <td className="px-4 py-3 text-sm text-gray-700">By 15th of the succeeding month</td>
            </tr>
            <tr className="border-b bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">STR (Suspicious Transaction Report)</td>
              <td className="px-4 py-3 text-sm text-gray-700">Any transaction that appears suspicious regardless of amount</td>
              <td className="px-4 py-3 text-sm text-gray-700">Within 7 days of suspicion being confirmed</td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">CCT (Counterfeit Currency Report)</td>
              <td className="px-4 py-3 text-sm text-gray-700">All counterfeit notes detected</td>
              <td className="px-4 py-3 text-sm text-gray-700">By 15th of the succeeding month</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">NTR (Non-Profit Transaction Report)</td>
              <td className="px-4 py-3 text-sm text-gray-700">Transactions of non-profit organizations ≥ ₹10 lakh</td>
              <td className="px-4 py-3 text-sm text-gray-700">By 15th of the succeeding month</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-gray-700 mb-4">
        Banks must maintain records of all transactions (including CTRs and STRs) for a minimum period of 5 years from the date of the transaction. The STR filing is particularly important — banks must not tip off the customer that an STR has been filed, and the 7-day filing timeline starts from the date when the transaction is confirmed as suspicious by the Principal Officer of the bank.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Beneficial Ownership</h2>
      <p className="text-gray-700 mb-4">
        Under the RBI's KYC framework, banks must identify the beneficial owners of all non-individual accounts (companies, trusts, partnerships). A beneficial owner is the natural person who ultimately owns or controls a customer or on whose behalf a transaction is being conducted. The identification thresholds are:
      </p>
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
        <ul className="space-y-2 text-gray-700 text-sm">
          <li><strong>Companies:</strong> Any natural person holding more than 25% of shares or voting rights, or exercising control through other means</li>
          <li><strong>Partnership Firms:</strong> Any natural person with more than 15% of capital or profits</li>
          <li><strong>Trusts:</strong> The author/settlor, trustee, and beneficiaries with more than 15% interest</li>
          <li><strong>Unincorporated Associations:</strong> Persons with more than 15% of the property or capital</li>
        </ul>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Key Points for JAIIB Exam</h2>
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
        <ul className="space-y-2 text-amber-900 text-sm">
          <li>• KYC is mandated under <strong>PMLA 2002</strong> and RBI Master Direction on KYC</li>
          <li>• CTR threshold: cash transactions of <strong>₹10 lakh or more</strong> in a month</li>
          <li>• STR must be filed within <strong>7 days</strong> of confirming suspicion</li>
          <li>• Periodic KYC update: High risk — <strong>2 years</strong>, Medium — <strong>8 years</strong>, Low — <strong>10 years</strong></li>
          <li>• V-CIP enables <strong>video-based remote KYC</strong> without physical presence</li>
          <li>• CKYC number is a <strong>14-digit</strong> identifier maintained by CERSAI</li>
          <li>• Records must be maintained for <strong>5 years</strong> after transaction/account closure</li>
          <li>• Beneficial owner threshold for companies: <strong>25%</strong> shareholding or voting rights</li>
          <li>• Banks must <strong>NOT</strong> tip off customers about STR filing</li>
        </ul>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Sample MCQs for JAIIB PPB</h2>

      <div className="space-y-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <p className="font-semibold text-gray-900 mb-3">Q1. As per RBI's KYC norms, periodic KYC update for high-risk customers must be done every:</p>
          <ul className="space-y-1 text-gray-700 mb-3 text-sm">
            <li>(a) 1 year</li>
            <li>(b) 2 years</li>
            <li>(c) 5 years</li>
            <li>(d) 10 years</li>
          </ul>
          <div className="bg-green-50 border border-green-200 rounded p-3">
            <p className="text-green-900 text-sm"><strong>Answer: (b)</strong> — High-risk customers require KYC update every 2 years. Medium-risk customers need updates every 8 years, and low-risk customers every 10 years.</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <p className="font-semibold text-gray-900 mb-3">Q2. A Suspicious Transaction Report (STR) must be filed with FIU-IND within:</p>
          <ul className="space-y-1 text-gray-700 mb-3 text-sm">
            <li>(a) 3 days of the transaction</li>
            <li>(b) 7 days of confirming the suspicion</li>
            <li>(c) 15 days of the transaction</li>
            <li>(d) 30 days of the transaction</li>
          </ul>
          <div className="bg-green-50 border border-green-200 rounded p-3">
            <p className="text-green-900 text-sm"><strong>Answer: (b)</strong> — STR must be filed within 7 days of the date when the transaction is confirmed as suspicious by the Principal Officer. The bank must not alert or tip off the customer about the STR filing.</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <p className="font-semibold text-gray-900 mb-3">Q3. The threshold for filing a Cash Transaction Report (CTR) with FIU-IND is:</p>
          <ul className="space-y-1 text-gray-700 mb-3 text-sm">
            <li>(a) ₹5 lakh in a month</li>
            <li>(b) ₹10 lakh in a month</li>
            <li>(c) ₹50 lakh in a month</li>
            <li>(d) ₹1 crore in a month</li>
          </ul>
          <div className="bg-green-50 border border-green-200 rounded p-3">
            <p className="text-green-900 text-sm"><strong>Answer: (b)</strong> — CTR must be filed for all cash transactions of ₹10 lakh and above (single or aggregate across all accounts in a month). The report must be filed with FIU-IND by the 15th of the succeeding month.</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <TopicPageLayout
      title="KYC Norms Explained — V-CIP, CKYC, PMLA 2002 & CTR/STR | JAIIB PPB"
      description="Complete guide to KYC norms for JAIIB PPB 2026. Learn KYC compliance, V-CIP process, CKYC registry, periodic update rules, CTR/STR reporting, PMLA 2002, beneficial ownership, and practice MCQs."
      canonical="https://mockmaster.fun/jaiib/ppb/kyc-norms"
      keywords="KYC full form, KYC norms RBI, V-CIP, CKYC, CTR STR, PMLA 2002, beneficial ownership, JAIIB PPB KYC"
      breadcrumb={[
        { label: 'Home', url: '/' },
        { label: 'JAIIB', url: '/practice-tests' },
        { label: 'PPB', url: '/practice-tests/ppb' },
        { label: 'KYC Norms' },
      ]}
      content={content}
      relatedTopics={relatedTopics}
      lastUpdated="June 2026"
    />
  );
};

export default KycNormsPage;
