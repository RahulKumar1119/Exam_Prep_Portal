import React from 'react';
import TopicPageLayout from './TopicPageLayout';

const UpiPaymentsPage: React.FC = () => {
  const relatedTopics = [
    { title: 'KYC/AML Norms', url: '/jaiib/ppb/kyc-norms' },
    { title: 'Financial Inclusion Schemes', url: '/jaiib/rbwm/financial-inclusion' },
    { title: 'Repo Rate & LAF Corridor', url: '/jaiib/ppb/repo-rate-explained' },
    { title: 'Banking Regulation Act 1949', url: '/jaiib/ppb/banking-regulation-act' },
    { title: 'Money Supply — M0 to M3', url: '/jaiib/ie-ifs/money-supply' },
  ];

  const content = (
    <div>
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
        UPI Payments System — Architecture, NPCI, Limits, UPI Lite & NEFT vs RTGS
      </h1>

      <p className="text-lg text-gray-700 mb-6">
        Unified Payments Interface (UPI) has revolutionized digital payments in India and is a
        critical topic in the JAIIB PPB examination. Developed by the National Payments Corporation of India (NPCI), UPI enables instant real-time payment transfers between bank accounts through mobile phones. With over 14 billion transactions per month, UPI is the world's largest real-time payment system. This guide covers UPI architecture, transaction limits, UPI Lite, Central Bank Digital Currency (CBDC/e₹), and a comprehensive comparison of NEFT, RTGS, IMPS, and UPI.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">What is UPI?</h2>
      <p className="text-gray-700 mb-4">
        UPI (Unified Payments Interface) is an instant real-time payment system developed by NPCI that facilitates inter-bank peer-to-peer and person-to-merchant transactions. Launched in April 2016, UPI operates on the Immediate Payment Service (IMPS) infrastructure and allows transfers using a Virtual Payment Address (VPA) like name@bankname, eliminating the need to share bank account details. UPI works 24/7, 365 days, including bank holidays.
      </p>
      <p className="text-gray-700 mb-4">
        Key features include: single-click two-factor authentication, push (pay) and pull (collect) payment options, scheduled/recurring payments, and interoperability across all UPI-enabled banks and third-party apps (PhonePe, Google Pay, Paytm, etc.). UPI supports both P2P (person-to-person) and P2M (person-to-merchant) transactions.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">NPCI — National Payments Corporation of India</h2>
      <p className="text-gray-700 mb-4">
        NPCI is the umbrella organization for retail payment systems in India. Established in 2008 as a Section 8 company (not-for-profit) under the provisions of the Payment and Settlement Systems Act, 2007, NPCI operates multiple payment systems: UPI, IMPS, NACH (National Automated Clearing House), RuPay cards, BBPS (Bharat Bill Payment System), AePS (Aadhaar-enabled Payment System), and FASTag. NPCI is promoted by a consortium of banks with RBI's guidance and oversight.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">UPI Transaction Limits</h2>
      <p className="text-gray-700 mb-4">
        The standard UPI per-transaction limit is ₹1 lakh. However, enhanced limits apply for specific categories: ₹2 lakh for capital markets, insurance, foreign inward remittances; ₹5 lakh for IPO subscriptions, tax payments, and hospital/educational institution payments. The number of UPI transactions is limited to 20 per day per bank for certain apps. UPI Lite has a separate limit structure.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">UPI Lite & UPI 123PAY</h2>
      <p className="text-gray-700 mb-4">
        UPI Lite is an on-device wallet for small-value transactions (up to ₹500 per transaction, wallet balance up to ₹2,000). It enables near-offline processing without connecting to the bank's core system for each transaction, reducing the failure rate and server load. UPI Lite transactions work without a UPI PIN for amounts up to ₹500, making payments even faster.
      </p>
      <p className="text-gray-700 mb-4">
        UPI 123PAY enables UPI payments on feature phones (non-smartphones) through IVR (Interactive Voice Response), missed call, app functionality on feature phones, or proximity sound-based payments. This extends UPI's reach to the 40+ crore feature phone users in India.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">CBDC — Digital Rupee (e₹)</h2>
      <p className="text-gray-700 mb-4">
        The Central Bank Digital Currency (CBDC), branded as the Digital Rupee (e₹), is a digital form of currency issued by the RBI. It is legal tender like physical currency. RBI launched the e₹-Retail pilot in December 2022. The e₹ is distributed through banks and can be stored in digital wallets on mobile phones. Key difference from UPI: e₹ is a direct claim on the RBI (like cash), while UPI transfers are claims on commercial banks. The e₹ supports both person-to-person and person-to-merchant payments.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">NEFT vs RTGS vs UPI vs IMPS — Comparison</h2>
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Feature</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">NEFT</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">RTGS</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">UPI</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">IMPS</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">Settlement</td>
              <td className="px-4 py-3 text-sm text-gray-700">Half-hourly batches</td>
              <td className="px-4 py-3 text-sm text-gray-700">Real-time gross</td>
              <td className="px-4 py-3 text-sm text-gray-700">Instant</td>
              <td className="px-4 py-3 text-sm text-gray-700">Instant</td>
            </tr>
            <tr className="border-b bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">Minimum Amount</td>
              <td className="px-4 py-3 text-sm text-gray-700">₹1</td>
              <td className="px-4 py-3 text-sm text-gray-700">₹2 lakh</td>
              <td className="px-4 py-3 text-sm text-gray-700">₹1</td>
              <td className="px-4 py-3 text-sm text-gray-700">₹1</td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">Maximum Amount</td>
              <td className="px-4 py-3 text-sm text-gray-700">No upper limit</td>
              <td className="px-4 py-3 text-sm text-gray-700">No upper limit</td>
              <td className="px-4 py-3 text-sm text-gray-700">₹1 lakh (standard)</td>
              <td className="px-4 py-3 text-sm text-gray-700">₹5 lakh</td>
            </tr>
            <tr className="border-b bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">Availability</td>
              <td className="px-4 py-3 text-sm text-gray-700">24×7</td>
              <td className="px-4 py-3 text-sm text-gray-700">24×7</td>
              <td className="px-4 py-3 text-sm text-gray-700">24×7</td>
              <td className="px-4 py-3 text-sm text-gray-700">24×7</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">Charges</td>
              <td className="px-4 py-3 text-sm text-gray-700">Free (online)</td>
              <td className="px-4 py-3 text-sm text-gray-700">Free (online)</td>
              <td className="px-4 py-3 text-sm text-gray-700">Free</td>
              <td className="px-4 py-3 text-sm text-gray-700">Nominal charges</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Key Points for JAIIB Exam</h2>
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
        <ul className="space-y-2 text-amber-900 text-sm">
          <li>• UPI developed by <strong>NPCI</strong>, launched April 2016</li>
          <li>• Standard UPI limit: <strong>₹1 lakh per transaction</strong></li>
          <li>• UPI Lite: up to <strong>₹500 per transaction, ₹2,000 wallet balance</strong></li>
          <li>• RTGS minimum: <strong>₹2 lakh</strong> (meant for high-value transactions)</li>
          <li>• NEFT settlement: <strong>half-hourly batches, 24×7</strong></li>
          <li>• e₹ (Digital Rupee) is a <strong>direct claim on RBI</strong> like physical cash</li>
          <li>• NPCI is a <strong>Section 8 company</strong> (not-for-profit)</li>
          <li>• UPI uses <strong>VPA (Virtual Payment Address)</strong> for identification</li>
          <li>• UPI 123PAY: for <strong>feature phone</strong> users</li>
        </ul>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Sample MCQs for JAIIB PPB</h2>

      <div className="space-y-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <p className="font-semibold text-gray-900 mb-3">Q1. UPI was developed by which organization?</p>
          <ul className="space-y-1 text-gray-700 mb-3 text-sm">
            <li>(a) Reserve Bank of India</li>
            <li>(b) National Payments Corporation of India (NPCI)</li>
            <li>(c) SEBI</li>
            <li>(d) Ministry of Finance</li>
          </ul>
          <div className="bg-green-50 border border-green-200 rounded p-3">
            <p className="text-green-900 text-sm"><strong>Answer: (b)</strong> — UPI was developed by NPCI (National Payments Corporation of India), which operates under the guidance of RBI and IBA.</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <p className="font-semibold text-gray-900 mb-3">Q2. The minimum amount for RTGS transfer is:</p>
          <ul className="space-y-1 text-gray-700 mb-3 text-sm">
            <li>(a) ₹50,000</li>
            <li>(b) ₹1 lakh</li>
            <li>(c) ₹2 lakh</li>
            <li>(d) ₹5 lakh</li>
          </ul>
          <div className="bg-green-50 border border-green-200 rounded p-3">
            <p className="text-green-900 text-sm"><strong>Answer: (c)</strong> — RTGS (Real Time Gross Settlement) is meant for high-value transactions with a minimum of ₹2 lakh. There is no upper limit for RTGS.</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <p className="font-semibold text-gray-900 mb-3">Q3. UPI Lite allows transactions up to:</p>
          <ul className="space-y-1 text-gray-700 mb-3 text-sm">
            <li>(a) ₹200 per transaction</li>
            <li>(b) ₹500 per transaction</li>
            <li>(c) ₹1,000 per transaction</li>
            <li>(d) ₹2,000 per transaction</li>
          </ul>
          <div className="bg-green-50 border border-green-200 rounded p-3">
            <p className="text-green-900 text-sm"><strong>Answer: (b)</strong> — UPI Lite allows transactions up to ₹500 per transaction without UPI PIN, with an overall wallet balance limit of ₹2,000.</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <TopicPageLayout
      title="UPI Payments System — Architecture, NPCI, Limits, NEFT vs RTGS | JAIIB PPB 2026"
      description="Complete guide to UPI payments for JAIIB PPB 2026. Learn UPI architecture, NPCI, transaction limits, UPI Lite, CBDC, NEFT vs RTGS vs UPI comparison, and practice MCQs."
      canonical="https://mockmaster.fun/jaiib/ppb/upi-payments-system"
      keywords="UPI payments system, NPCI, UPI transaction limit, UPI Lite, NEFT RTGS UPI comparison, CBDC digital rupee, JAIIB PPB"
      breadcrumb={[
        { label: 'Home', url: '/' },
        { label: 'JAIIB', url: '/practice-tests' },
        { label: 'PPB', url: '/practice-tests/ppb' },
        { label: 'UPI Payments System' },
      ]}
      content={content}
      relatedTopics={relatedTopics}
      lastUpdated="June 2026"
    />
  );
};

export default UpiPaymentsPage;
