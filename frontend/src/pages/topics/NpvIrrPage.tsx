import React from 'react';
import TopicPageLayout from './TopicPageLayout';

const NpvIrrPage: React.FC = () => {
  const relatedTopics = [
    { title: 'CRR (Cash Reserve Ratio) Explained', url: '/jaiib/ppb/crr-explained' },
    { title: 'NPA Classification & IRAC Norms', url: '/jaiib/ppb/npa-classification' },
    { title: 'Priority Sector Lending (PSL) Norms', url: '/jaiib/ppb/priority-sector-lending' },
    { title: 'SARFAESI Act 2002 Explained', url: '/jaiib/ppb/sarfaesi-act' },
  ];

  const content = (
    <div>
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
        NPV & IRR Explained — Capital Budgeting Formulas for JAIIB AFM 2026
      </h1>

      <p className="text-lg text-gray-700 mb-6">
        Net Present Value (NPV) and Internal Rate of Return (IRR) are the two most important capital budgeting techniques tested in the JAIIB AFM (Accounting & Financial Management for Bankers) paper. These methods help bankers evaluate the financial viability of projects, assess loan proposals for corporate clients, and make informed investment decisions. In this guide, we cover both concepts from fundamentals to advanced application, including formulas, solved examples, decision rules, and a detailed comparison of NPV vs IRR to help you ace the exam.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">What is Net Present Value (NPV)?</h2>
      <p className="text-gray-700 mb-4">
        Net Present Value is the difference between the present value of future cash inflows and the present value of cash outflows over a project's lifetime. It accounts for the time value of money — the principle that a rupee received today is worth more than a rupee received in the future. NPV converts all future cash flows into today's value using a discount rate (usually the cost of capital or required rate of return).
      </p>
      <p className="text-gray-700 mb-4">
        The fundamental idea behind NPV is straightforward: if the total present value of all expected cash inflows exceeds the initial investment (and any subsequent outflows), the project adds value to the firm and should be accepted. If NPV is negative, the project destroys value and should be rejected.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">NPV Formula</h2>
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
        <p className="font-mono text-center text-lg font-semibold text-gray-900 mb-2">
          NPV = Σ [CFₜ / (1 + r)ᵗ] − C₀
        </p>
        <p className="text-sm text-gray-600 text-center">
          Where: CFₜ = Cash flow at time t | r = Discount rate (cost of capital) | t = Time period | C₀ = Initial investment
        </p>
      </div>
      <p className="text-gray-700 mb-4">
        Alternatively, for uniform annual cash flows (annuity), the formula simplifies to: NPV = Annual Cash Flow × PVIFA(r, n) − Initial Investment, where PVIFA is the Present Value Interest Factor of Annuity.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">NPV Decision Rule</h2>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <ul className="space-y-2 text-blue-900 text-sm">
          <li>• <strong>NPV &gt; 0:</strong> Accept the project (it adds value to the firm)</li>
          <li>• <strong>NPV = 0:</strong> Indifferent (project earns exactly the required return)</li>
          <li>• <strong>NPV &lt; 0:</strong> Reject the project (it destroys value)</li>
          <li>• When comparing mutually exclusive projects, choose the one with the <strong>highest positive NPV</strong></li>
        </ul>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Solved Example — NPV Calculation</h2>
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
        <p className="text-gray-800 mb-3 font-medium">Problem: A project requires an initial investment of ₹10,00,000. It is expected to generate cash flows of ₹3,00,000, ₹4,00,000, ₹4,50,000, and ₹3,50,000 over the next 4 years. The cost of capital is 10%. Calculate NPV.</p>
        <div className="space-y-2 text-sm text-gray-700">
          <p>Year 1: ₹3,00,000 / (1.10)¹ = ₹3,00,000 / 1.10 = ₹2,72,727</p>
          <p>Year 2: ₹4,00,000 / (1.10)² = ₹4,00,000 / 1.21 = ₹3,30,579</p>
          <p>Year 3: ₹4,50,000 / (1.10)³ = ₹4,50,000 / 1.331 = ₹3,38,092</p>
          <p>Year 4: ₹3,50,000 / (1.10)⁴ = ₹3,50,000 / 1.4641 = ₹2,39,084</p>
          <p className="font-semibold mt-3">Total PV of Inflows = ₹11,80,482</p>
          <p className="font-semibold">NPV = ₹11,80,482 − ₹10,00,000 = <span className="text-green-700">₹1,80,482 (Positive → Accept)</span></p>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">What is Internal Rate of Return (IRR)?</h2>
      <p className="text-gray-700 mb-4">
        The Internal Rate of Return is the discount rate at which the NPV of a project becomes exactly zero. In other words, it is the rate of return that makes the present value of future cash inflows equal to the initial investment. IRR represents the project's actual expected rate of return — if this exceeds the required rate (cost of capital), the project is worth undertaking.
      </p>
      <p className="text-gray-700 mb-4">
        IRR is also known as the "break-even discount rate" because at this rate, the project neither creates nor destroys value. It is widely used in banking for evaluating term loan proposals, project finance decisions, and assessing investment profitability.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">IRR Formula</h2>
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
        <p className="font-mono text-center text-lg font-semibold text-gray-900 mb-2">
          0 = Σ [CFₜ / (1 + IRR)ᵗ] − C₀
        </p>
        <p className="text-sm text-gray-600 text-center">
          IRR is found by trial and error or interpolation — it is the rate 'r' that satisfies NPV = 0
        </p>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">How to Calculate IRR (Interpolation Method)</h2>
      <p className="text-gray-700 mb-4">
        Since IRR cannot be solved algebraically for uneven cash flows, we use the interpolation method. The steps are:
      </p>
      <ol className="list-decimal pl-6 mb-4 text-gray-700 space-y-2">
        <li>Calculate NPV at a lower discount rate (r₁) where NPV is positive</li>
        <li>Calculate NPV at a higher discount rate (r₂) where NPV is negative</li>
        <li>Apply the interpolation formula:</li>
      </ol>
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
        <p className="font-mono text-center text-sm font-semibold text-gray-900">
          IRR = r₁ + [(NPV₁ / (NPV₁ − NPV₂)) × (r₂ − r₁)]
        </p>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">IRR Decision Rule</h2>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <ul className="space-y-2 text-blue-900 text-sm">
          <li>• <strong>IRR &gt; Cost of Capital:</strong> Accept the project</li>
          <li>• <strong>IRR = Cost of Capital:</strong> Indifferent (NPV is zero)</li>
          <li>• <strong>IRR &lt; Cost of Capital:</strong> Reject the project</li>
        </ul>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">NPV vs IRR — Comparison Table</h2>
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Parameter</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">NPV</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">IRR</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">Full Form</td>
              <td className="px-4 py-3 text-sm text-gray-700">Net Present Value</td>
              <td className="px-4 py-3 text-sm text-gray-700">Internal Rate of Return</td>
            </tr>
            <tr className="border-b bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">Result Type</td>
              <td className="px-4 py-3 text-sm text-gray-700">Absolute value (₹ amount)</td>
              <td className="px-4 py-3 text-sm text-gray-700">Percentage (% rate)</td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">Reinvestment Assumption</td>
              <td className="px-4 py-3 text-sm text-gray-700">At cost of capital (realistic)</td>
              <td className="px-4 py-3 text-sm text-gray-700">At IRR itself (often unrealistic)</td>
            </tr>
            <tr className="border-b bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">Mutually Exclusive Projects</td>
              <td className="px-4 py-3 text-sm text-gray-700">Reliable — choose highest NPV</td>
              <td className="px-4 py-3 text-sm text-gray-700">May give conflicting ranking</td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">Multiple Rates</td>
              <td className="px-4 py-3 text-sm text-gray-700">Always gives single answer</td>
              <td className="px-4 py-3 text-sm text-gray-700">Can have multiple IRRs (non-conventional CFs)</td>
            </tr>
            <tr className="border-b bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">Project Scale</td>
              <td className="px-4 py-3 text-sm text-gray-700">Accounts for scale differences</td>
              <td className="px-4 py-3 text-sm text-gray-700">Ignores scale (percentage bias)</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm text-gray-700 font-medium">Preferred Method</td>
              <td className="px-4 py-3 text-sm text-gray-700">Academically superior</td>
              <td className="px-4 py-3 text-sm text-gray-700">Widely used in practice</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Other Capital Budgeting Methods</h2>

      <h3 className="text-xl font-bold text-gray-800 mt-6 mb-3">Payback Period</h3>
      <p className="text-gray-700 mb-4">
        The payback period is the time required to recover the initial investment from cash inflows. For uniform cash flows: Payback Period = Initial Investment / Annual Cash Flow. For uneven flows, calculate cumulative cash flows until they equal the investment. While simple to understand, payback period ignores the time value of money and cash flows beyond the payback period. The discounted payback period addresses the time-value issue by using discounted cash flows but still ignores subsequent cash flows.
      </p>

      <h3 className="text-xl font-bold text-gray-800 mt-6 mb-3">Profitability Index (PI)</h3>
      <p className="text-gray-700 mb-4">
        The Profitability Index (also called Benefit-Cost Ratio) measures the return per unit of investment. It is calculated as:
      </p>
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
        <p className="font-mono text-center text-lg font-semibold text-gray-900">
          PI = Present Value of Cash Inflows / Initial Investment
        </p>
        <p className="text-sm text-gray-600 text-center mt-2">
          Accept if PI &gt; 1 | Reject if PI &lt; 1 | Note: PI = 1 + (NPV / Initial Investment)
        </p>
      </div>
      <p className="text-gray-700 mb-4">
        PI is particularly useful when capital rationing applies — the firm has limited funds and must choose among multiple positive-NPV projects. In such cases, rank projects by PI (descending) and select until the budget is exhausted. PI gives the "value per rupee invested," making it ideal for rationing situations.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">When NPV and IRR Conflict</h2>
      <p className="text-gray-700 mb-4">
        For independent projects (accept/reject decisions), NPV and IRR always give the same result. However, for mutually exclusive projects, they may rank projects differently due to: (a) differences in project scale/size, (b) differences in cash flow timing patterns, or (c) differences in project life. In case of conflict, NPV is the theoretically superior method because it correctly assumes reinvestment at the cost of capital, provides the absolute value addition to the firm, and is not affected by non-conventional cash flow patterns.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Key Points for JAIIB Exam</h2>
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
        <ul className="space-y-2 text-amber-900 text-sm">
          <li>• NPV gives <strong>absolute value</strong> (in ₹); IRR gives a <strong>percentage rate</strong></li>
          <li>• NPV is considered <strong>theoretically superior</strong> to IRR</li>
          <li>• IRR assumes reinvestment at <strong>IRR rate</strong> (unrealistic); NPV assumes reinvestment at <strong>cost of capital</strong></li>
          <li>• For mutually exclusive projects, always prefer <strong>NPV ranking</strong></li>
          <li>• Non-conventional cash flows can produce <strong>multiple IRRs</strong></li>
          <li>• PI is useful in <strong>capital rationing</strong> situations</li>
          <li>• Payback Period ignores <strong>time value of money</strong> and cash flows after recovery</li>
          <li>• Remember PVIFA tables for quick NPV calculation of uniform annuities</li>
        </ul>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Sample MCQs for JAIIB AFM</h2>

      <div className="space-y-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <p className="font-semibold text-gray-900 mb-3">Q1. A project with initial investment of ₹5,00,000 generates annual cash flows of ₹1,50,000 for 5 years. At 10% discount rate (PVIFA = 3.791), the NPV is:</p>
          <ul className="space-y-1 text-gray-700 mb-3 text-sm">
            <li>(a) ₹68,650</li>
            <li>(b) ₹2,50,000</li>
            <li>(c) −₹68,650</li>
            <li>(d) ₹5,68,650</li>
          </ul>
          <div className="bg-green-50 border border-green-200 rounded p-3">
            <p className="text-green-900 text-sm"><strong>Answer: (a)</strong> — NPV = (₹1,50,000 × 3.791) − ₹5,00,000 = ₹5,68,650 − ₹5,00,000 = ₹68,650. Since NPV is positive, the project should be accepted.</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <p className="font-semibold text-gray-900 mb-3">Q2. If a project's IRR is 15% and the cost of capital is 12%, the project should be:</p>
          <ul className="space-y-1 text-gray-700 mb-3 text-sm">
            <li>(a) Rejected because IRR is too high</li>
            <li>(b) Accepted because IRR exceeds cost of capital</li>
            <li>(c) Rejected because NPV will be negative</li>
            <li>(d) Deferred for further analysis</li>
          </ul>
          <div className="bg-green-50 border border-green-200 rounded p-3">
            <p className="text-green-900 text-sm"><strong>Answer: (b)</strong> — When IRR (15%) exceeds the cost of capital (12%), the project's NPV at 12% discount rate will be positive. The decision rule is: Accept if IRR &gt; cost of capital.</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <p className="font-semibold text-gray-900 mb-3">Q3. Which of the following is a limitation of the IRR method?</p>
          <ul className="space-y-1 text-gray-700 mb-3 text-sm">
            <li>(a) It does not consider the time value of money</li>
            <li>(b) It may give multiple rates for non-conventional cash flows</li>
            <li>(c) It always gives absolute values</li>
            <li>(d) It cannot be used for independent projects</li>
          </ul>
          <div className="bg-green-50 border border-green-200 rounded p-3">
            <p className="text-green-900 text-sm"><strong>Answer: (b)</strong> — Non-conventional cash flows (where signs change more than once, e.g., investment → inflows → major outflow → inflows) can produce multiple IRR values, making the decision ambiguous. This is a well-known limitation of the IRR method.</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <p className="font-semibold text-gray-900 mb-3">Q4. The Profitability Index (PI) of a project with PV of inflows = ₹8,40,000 and initial investment = ₹7,00,000 is:</p>
          <ul className="space-y-1 text-gray-700 mb-3 text-sm">
            <li>(a) 0.83</li>
            <li>(b) 1.00</li>
            <li>(c) 1.20</li>
            <li>(d) 1.40</li>
          </ul>
          <div className="bg-green-50 border border-green-200 rounded p-3">
            <p className="text-green-900 text-sm"><strong>Answer: (c)</strong> — PI = PV of Inflows / Initial Investment = ₹8,40,000 / ₹7,00,000 = 1.20. Since PI &gt; 1, the project is acceptable. This means for every ₹1 invested, ₹1.20 in present value is generated.</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <TopicPageLayout
      title="NPV & IRR Explained — Capital Budgeting Formulas for JAIIB AFM 2026"
      description="Complete guide to NPV and IRR for JAIIB AFM 2026. Learn Net Present Value formula, Internal Rate of Return calculation, NPV vs IRR comparison, Payback Period, Profitability Index, with solved examples and MCQs."
      canonical="https://mockmaster.fun/jaiib/afm/npv-irr-explained"
      keywords="NPV formula, IRR full form, capital budgeting JAIIB, NPV vs IRR, net present value, internal rate of return, profitability index, payback period"
      breadcrumb={[
        { label: 'Home', url: '/' },
        { label: 'JAIIB', url: '/practice-tests' },
        { label: 'AFM', url: '/practice-tests/afm' },
        { label: 'NPV & IRR Explained' },
      ]}
      content={content}
      relatedTopics={relatedTopics}
      lastUpdated="June 2026"
    />
  );
};

export default NpvIrrPage;
