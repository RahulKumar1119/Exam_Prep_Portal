import React from 'react';
import TopicPageLayout from './TopicPageLayout';

const NiActPage: React.FC = () => {
  const relatedTopics = [
    { title: 'SARFAESI Act 2002 Explained', url: '/jaiib/ppb/sarfaesi-act' },
    { title: 'Banking Regulation Act 1949', url: '/jaiib/ppb/banking-regulation-act' },
    { title: 'KYC/AML Norms', url: '/jaiib/ppb/kyc-norms' },
    { title: 'NPA Classification & IRAC Norms', url: '/jaiib/ppb/npa-classification' },
    { title: 'UPI & Digital Payments', url: '/jaiib/ppb/upi-payments-system' },
  ];

  const content = (
    <div>
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
        Negotiable Instruments Act 1881 — Types, Endorsement, Crossing & Section 138
      </h1>

      <p className="text-lg text-gray-700 mb-6">
        The Negotiable Instruments Act, 1881 is one of the oldest and most important commercial
        laws in India and a high-weightage topic in the JAIIB PPB examination. This Act governs the use of promissory notes, bills of exchange, and cheques — collectively known as negotiable instruments. Understanding the provisions related to parties, endorsement, crossing, dishonour, and particularly Section 138 (cheque bouncing) is critical for every banking professional. This comprehensive guide covers all essential aspects of the NI Act for JAIIB preparation.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">What is a Negotiable Instrument? (Section 13)</h2>
      <p className="text-gray-700 mb-4">
        Section 13 of the NI Act defines a negotiable instrument as a promissory note, bill of exchange, or cheque payable either to order or to bearer. The key characteristics that make an instrument "negotiable" are: (1) it is freely transferable from one person to another by delivery or endorsement and delivery; (2) the transferee (holder in due course) gets a better title than the transferor; (3) it can be sued upon in the holder's own name; and (4) no notice of transfer needs to be given to the party liable.
      </p>
      <p className="text-gray-700 mb-4">
        The Act recognizes three types of negotiable instruments: (a) Promissory Note (Section 4) — an unconditional written promise by one person to pay a certain sum of money to another; (b) Bill of Exchange (Section 5) — an unconditional written order directing one person to pay money to another; (c) Cheque (Section 6) — a bill of exchange drawn on a specified banker and payable on demand.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Types of Negotiable Instruments — Comparison</h2>
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Feature</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Promissory Note</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Bill of Exchange</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Cheque</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">Section</td>
              <td className="px-4 py-3 text-sm text-gray-700">Section 4</td>
              <td className="px-4 py-3 text-sm text-gray-700">Section 5</td>
              <td className="px-4 py-3 text-sm text-gray-700">Section 6</td>
            </tr>
            <tr className="border-b bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">Nature</td>
              <td className="px-4 py-3 text-sm text-gray-700">Promise to pay</td>
              <td className="px-4 py-3 text-sm text-gray-700">Order to pay</td>
              <td className="px-4 py-3 text-sm text-gray-700">Order to pay (on banker)</td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">Parties</td>
              <td className="px-4 py-3 text-sm text-gray-700">Maker & Payee</td>
              <td className="px-4 py-3 text-sm text-gray-700">Drawer, Drawee & Payee</td>
              <td className="px-4 py-3 text-sm text-gray-700">Drawer, Drawee (bank) & Payee</td>
            </tr>
            <tr className="border-b bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">Payable</td>
              <td className="px-4 py-3 text-sm text-gray-700">On demand or after specified period</td>
              <td className="px-4 py-3 text-sm text-gray-700">On demand or after specified period</td>
              <td className="px-4 py-3 text-sm text-gray-700">Always on demand</td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">Acceptance</td>
              <td className="px-4 py-3 text-sm text-gray-700">Not required</td>
              <td className="px-4 py-3 text-sm text-gray-700">Required (by drawee)</td>
              <td className="px-4 py-3 text-sm text-gray-700">Not required</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">Drawn On</td>
              <td className="px-4 py-3 text-sm text-gray-700">Any person</td>
              <td className="px-4 py-3 text-sm text-gray-700">Any person</td>
              <td className="px-4 py-3 text-sm text-gray-700">Only on a banker</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Endorsement (Sections 15-16)</h2>
      <p className="text-gray-700 mb-4">
        Endorsement is the process of signing on the back (or face) of a negotiable instrument for the purpose of transferring ownership. The person who endorses is called the endorser, and the person to whom it is endorsed is the endorsee. Types of endorsement include: (a) Blank Endorsement — only the signature of the endorser, making the instrument payable to bearer; (b) Full/Special Endorsement — specifies the person to whom payment is to be made; (c) Restrictive Endorsement — restricts further negotiation (e.g., "Pay to A only"); (d) Conditional Endorsement — payment is subject to fulfillment of a condition; (e) Sans Recourse Endorsement — the endorser excludes his personal liability.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Crossing of Cheques (Sections 123-131)</h2>
      <p className="text-gray-700 mb-4">
        Crossing is a direction to the paying banker that the cheque should be paid only through a banker and not across the counter. A crossing consists of two parallel transverse lines drawn across the face of the cheque. Types: (a) General Crossing — two parallel lines with or without words "& Co." or "Not Negotiable"; the cheque is paid to any bank; (b) Special Crossing — the name of a specific bank is written between the lines; payment only through that bank; (c) Restrictive Crossing — "Account Payee Only" — the cheque is credited only to the account of the named payee and cannot be further endorsed.
      </p>
      <p className="text-gray-700 mb-4">
        The "Not Negotiable" crossing (Section 130) does not prevent transfer but removes the privilege of a holder in due course. A transferee gets no better title than the transferor. The "Account Payee" crossing makes the cheque non-transferable. If a banker collects such a cheque for a person other than the payee, the banker loses statutory protection under Section 131.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Section 138 — Dishonour of Cheques</h2>
      <p className="text-gray-700 mb-4">
        Section 138 deals with criminal liability for dishonour of cheques due to insufficient funds or exceeding arrangement. Key elements: (a) the cheque must be drawn for discharge of a legally enforceable debt or liability; (b) it must be presented within 3 months of date of issue (or validity period); (c) the payee must give written notice within 30 days of receiving "returned cheque" information; (d) the drawer has 15 days from receipt of notice to make payment; (e) if payment is not made, the payee can file a complaint within 1 month after the 15-day period expires.
      </p>
      <p className="text-gray-700 mb-4">
        Punishment under Section 138: imprisonment up to 2 years, or fine up to twice the cheque amount, or both. The complaint is filed before a Metropolitan Magistrate or Judicial Magistrate of First Class. Section 139 presumes that the cheque was issued for discharge of debt/liability unless proven otherwise by the drawer. Section 142 specifies the court jurisdiction — the complaint must be filed at the place where the cheque is dishonoured (i.e., where the bank branch that returns the cheque is located).
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Holder in Due Course (Section 9)</h2>
      <p className="text-gray-700 mb-4">
        A Holder in Due Course is a person who obtains a negotiable instrument: (a) for valuable consideration; (b) before maturity; (c) without notice of any defect in the title of the transferor. The holder in due course gets a clear title free from all defects. This is the most important privilege of negotiability — even if the transferor had no title or defective title, the holder in due course gets a good title (except in cases of forgery).
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Key Points for JAIIB Exam</h2>
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
        <ul className="space-y-2 text-amber-900 text-sm">
          <li>• NI Act has <strong>147 sections</strong> and was enacted in 1881</li>
          <li>• Section 138 applies only to cheques, not to promissory notes or bills</li>
          <li>• Cheque validity period: <strong>3 months</strong> from date of issue</li>
          <li>• Notice under Section 138 must be given within <strong>30 days</strong> of dishonour</li>
          <li>• Drawer gets <strong>15 days</strong> to make payment after receiving notice</li>
          <li>• "Account Payee" cheque is <strong>non-transferable</strong></li>
          <li>• Holder in Due Course gets title free from defects (except forgery)</li>
          <li>• A promissory note requires <strong>no acceptance</strong>; a bill of exchange does</li>
        </ul>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Sample MCQs for JAIIB PPB</h2>

      <div className="space-y-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <p className="font-semibold text-gray-900 mb-3">Q1. Under Section 138, the payee must give notice to the drawer within:</p>
          <ul className="space-y-1 text-gray-700 mb-3 text-sm">
            <li>(a) 15 days of dishonour</li>
            <li>(b) 30 days of receiving information of dishonour</li>
            <li>(c) 45 days of presenting the cheque</li>
            <li>(d) 60 days of issue of cheque</li>
          </ul>
          <div className="bg-green-50 border border-green-200 rounded p-3">
            <p className="text-green-900 text-sm"><strong>Answer: (b)</strong> — The payee/holder must send a written demand notice to the drawer within 30 days of receiving information about cheque dishonour from the bank.</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <p className="font-semibold text-gray-900 mb-3">Q2. A cheque is defined under which section of the NI Act?</p>
          <ul className="space-y-1 text-gray-700 mb-3 text-sm">
            <li>(a) Section 4</li>
            <li>(b) Section 5</li>
            <li>(c) Section 6</li>
            <li>(d) Section 13</li>
          </ul>
          <div className="bg-green-50 border border-green-200 rounded p-3">
            <p className="text-green-900 text-sm"><strong>Answer: (c)</strong> — Section 6 defines a cheque as a bill of exchange drawn on a specified banker and payable only on demand. Section 4 defines promissory note, Section 5 defines bill of exchange.</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <p className="font-semibold text-gray-900 mb-3">Q3. "Not Negotiable" crossing on a cheque means:</p>
          <ul className="space-y-1 text-gray-700 mb-3 text-sm">
            <li>(a) The cheque cannot be transferred at all</li>
            <li>(b) The transferee gets no better title than the transferor</li>
            <li>(c) Only the named payee can encash the cheque</li>
            <li>(d) The cheque is payable only in cash</li>
          </ul>
          <div className="bg-green-50 border border-green-200 rounded p-3">
            <p className="text-green-900 text-sm"><strong>Answer: (b)</strong> — "Not Negotiable" does NOT mean non-transferable. The cheque can still be transferred, but the transferee cannot get a better title than the transferor. "Account Payee" makes it non-transferable.</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <TopicPageLayout
      title="Negotiable Instruments Act 1881 — Types, Endorsement, Crossing, Section 138 | JAIIB PPB"
      description="Complete guide to Negotiable Instruments Act 1881 for JAIIB PPB. Learn about promissory notes, bills of exchange, cheques, endorsement types, crossing, Section 138 cheque dishonour, and MCQs."
      canonical="https://mockmaster.fun/jaiib/ppb/negotiable-instruments-act"
      keywords="Negotiable Instruments Act 1881, NI Act JAIIB, Section 138, cheque dishonour, endorsement types, crossing of cheques, holder in due course"
      breadcrumb={[
        { label: 'Home', url: '/' },
        { label: 'JAIIB', url: '/practice-tests' },
        { label: 'PPB', url: '/practice-tests/ppb' },
        { label: 'Negotiable Instruments Act' },
      ]}
      content={content}
      relatedTopics={relatedTopics}
      lastUpdated="June 2026"
    />
  );
};

export default NiActPage;
