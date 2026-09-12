import React from 'react';
import TopicPageLayout from './TopicPageLayout';
import { BlockMath } from '../../components/MathDisplay';

const QuantAptitudePage: React.FC = () => {
  const relatedTopics = [
    { title: 'Browse All Exams', url: '/exams' },
    { title: 'JAIIB AFM Practice Sets', url: '/practice-tests/afm' },
    { title: 'Ratio Analysis', url: '/jaiib/afm/ratio-analysis' },
    { title: 'Free Practice Quizzes', url: '/practice-tests' },
    { title: 'Study Topics', url: '/study-topics' },
  ];

  const content = (
    <div>
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
        Quantitative Aptitude — Complete Guide for Bank & Competitive Exams
      </h1>

      <p className="text-lg text-gray-700 mb-6">
        Quantitative Aptitude — the ability to solve numerical problems quickly and accurately —
        is the backbone of almost every competitive examination in India: JAIIB and CAIIB for bank
        officers, IBPS and SBI recruitment tests, SSC, Railways, LIC, CAT, CSAT, and state-level exams
        like TNPSC and KPSC. It tests the same core skill everywhere: applying basic arithmetic,
        algebra, and data interpretation under time pressure. Master the fundamentals once, and the
        same toolkit serves you across every exam on this page.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Syllabus Map — What to Study</h2>
      <p className="text-gray-700 mb-4">
        Nearly all quant sections draw from the same topic pool. Organise your preparation into
        four blocks:
      </p>
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left font-semibold text-gray-900">Block</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-900">Topics</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-900">Why it matters</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            <tr className="border-t">
              <td className="px-4 py-3 font-medium">Arithmetic foundations</td>
              <td className="px-4 py-3">Number systems, HCF & LCM, simplification, BODMAS, decimals & fractions</td>
              <td className="px-4 py-3">Speed base for everything else; directly tested in JAIIB AFM</td>
            </tr>
            <tr className="border-t">
              <td className="px-4 py-3 font-medium">Commercial maths</td>
              <td className="px-4 py-3">Percentages, ratio & proportion, averages, profit & loss, SI & CI, discount</td>
              <td className="px-4 py-3">Core of banking exams — interest, margins, and growth calculations</td>
            </tr>
            <tr className="border-t">
              <td className="px-4 py-3 font-medium">Time, work & measurement</td>
              <td className="px-4 py-3">Time & work, pipes & cisterns, speed–time–distance, trains, boats, mensuration</td>
              <td className="px-4 py-3">High weightage in IBPS, SSC, and Railways; formula-driven scoring area</td>
            </tr>
            <tr className="border-t">
              <td className="px-4 py-3 font-medium">Data & reasoning maths</td>
              <td className="px-4 py-3">Data interpretation (tables, bar/line/pie charts), series, quadratic equations, simplifications</td>
              <td className="px-4 py-3">Decisive in prelims and CAT-style papers; rewards practice over theory</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Exam-wise Relevance</h2>
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left font-semibold text-gray-900">Exam</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-900">Quant role</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            <tr className="border-t">
              <td className="px-4 py-3 font-medium">JAIIB AFM / CAIIB ABM</td>
              <td className="px-4 py-3">Numerical problems on interest, ratios, depreciation, and financial maths inside banking papers</td>
            </tr>
            <tr className="border-t">
              <td className="px-4 py-3 font-medium">IBPS PO / Clerk, SBI PO / Clerk</td>
              <td className="px-4 py-3">Dedicated quant + DI section in both prelims and mains; the main elimination round</td>
            </tr>
            <tr className="border-t">
              <td className="px-4 py-3 font-medium">SSC CGL / CHSL, Railways, LIC</td>
              <td className="px-4 py-3">Heavy arithmetic + advance maths weightage; speed decides merit</td>
            </tr>
            <tr className="border-t">
              <td className="px-4 py-3 font-medium">CAT, XAT, SNAP, MAT, GMAT, GRE</td>
              <td className="px-4 py-3">Higher-difficulty quant with emphasis on logic, shortcuts, and option elimination</td>
            </tr>
            <tr className="border-t">
              <td className="px-4 py-3 font-medium">UPSC CSAT, CLAT, State PSCs</td>
              <td className="px-4 py-3">Qualifying numeracy and DI — Class X level, but must not be ignored</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Must-Remember Formulas</h2>
      <p className="text-gray-700 mb-4">These four carry the highest marks-per-minute in banking exams:</p>
      <BlockMath math="SI = \\frac{P \\times R \\times T}{100}" />
      <BlockMath math="CI = P\\left(1 + \\frac{R}{100}\\right)^{T} - P" />
      <BlockMath math="Speed = \\frac{Distance}{Time}, \\qquad Work = Rate \\times Time" />
      <BlockMath math="CP,\\ SP\\ relation:\\ Profit\\% = \\frac{SP - CP}{CP} \\times 100" />
      <p className="text-gray-700 mb-4">
        Tip for JAIIB AFM: interest-rate and ratio questions are rarely about complex maths — they
        test whether you pick the right formula and handle percentages cleanly. Write the formula
        first, substitute values second, calculate last.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">30-Day Preparation Plan</h2>
      <div className="space-y-3 mb-6">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="font-semibold text-gray-900">Days 1–10: Foundations</p>
          <p className="text-sm text-gray-700">Percentages, ratios, averages, SI/CI. 30 problems a day with a timer. Target: 100% accuracy, speed secondary.</p>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="font-semibold text-gray-900">Days 11–20: Speed blocks</p>
          <p className="text-sm text-gray-700">Time–work, speed–distance, mensuration, simplification sets. Learn one shortcut per topic (e.g. successive-percentage change, alligation).</p>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="font-semibold text-gray-900">Days 21–30: Mock mode</p>
          <p className="text-sm text-gray-700">Full timed sets on MockMaster — quant sets are 30 questions in 20 minutes with −0.25 negative marking, so practice skipping wisely. Analyse every error into a notebook: concept gap, calculation slip, or time trap. Re-attempt wrong questions after 3 days.</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Sample MCQs</h2>
      <div className="space-y-4 mb-6">
        <div className="border border-gray-200 rounded-lg p-4">
          <p className="font-medium text-gray-900">1. A sum amounts to ₹11,023 in 3 years at 5% p.a. compound interest. The principal is closest to:</p>
          <p className="text-sm text-gray-600 mt-2">A) ₹9,000 &nbsp; B) ₹9,500 &nbsp; C) ₹10,000 &nbsp; D) ₹10,500</p>
          <p className="text-sm text-green-700 font-medium mt-2">Answer: B — P × (1.05)³ = 11,023 → P ≈ 11,023 / 1.1576 ≈ ₹9,522.</p>
        </div>
        <div className="border border-gray-200 rounded-lg p-4">
          <p className="font-medium text-gray-900">2. A and B together complete a work in 12 days. A alone takes 20 days. B alone takes:</p>
          <p className="text-sm text-gray-600 mt-2">A) 24 days &nbsp; B) 28 days &nbsp; C) 30 days &nbsp; D) 32 days</p>
          <p className="text-sm text-green-700 font-medium mt-2">Answer: C — 1/B = 1/12 − 1/20 = 1/30, so 30 days.</p>
        </div>
        <div className="border border-gray-200 rounded-lg p-4">
          <p className="font-medium text-gray-900">3. If a bank deposit grows 20% then falls 10%, the net change is:</p>
          <p className="text-sm text-gray-600 mt-2">A) +10% &nbsp; B) +8% &nbsp; C) −2% &nbsp; D) No change</p>
          <p className="text-sm text-green-700 font-medium mt-2">Answer: B — 1.20 × 0.90 = 1.08, i.e. +8%. (Successive change: a + b + ab/100.)</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">FAQs</h2>
      <div className="space-y-4 mb-6">
        <div>
          <p className="font-semibold text-gray-900">Is quantitative aptitude asked in JAIIB?</p>
          <p className="text-sm text-gray-700">Yes — the AFM paper includes numerical problems on interest, ratios, depreciation, and capital budgeting. The same arithmetic base also helps in PPB case studies involving calculations.</p>
        </div>
        <div>
          <p className="font-semibold text-gray-900">How much time should I give quant daily?</p>
          <p className="text-sm text-gray-700">60–90 minutes of timed problem-solving beats 3 hours of passive formula reading. Consistency over 30 days matters more than intensity.</p>
        </div>
        <div>
          <p className="font-semibold text-gray-900">Calculator tricks or mental maths?</p>
          <p className="text-sm text-gray-700">Learn percentage–fraction conversions (e.g. 12.5% = 1/8) and approximation. In exams without calculators, these decide your speed; where calculators are allowed, they help you verify answers.</p>
        </div>
      </div>

      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6 text-center">
        <p className="font-bold text-gray-900 mb-2">Practice 440+ quant questions free</p>
        <p className="text-sm text-gray-600 mb-1">30-question timed sets · 20 minutes · −0.25 per wrong answer.</p>
        <p className="text-sm text-gray-600 mb-4">Instant scoring with topic-wise accuracy across 35 chapters.</p>
        <a href="/quant-practice-test" className="inline-block px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition">
          Start Quant Practice
        </a>
      </div>
    </div>
  );

  return (
    <TopicPageLayout
      title="Quantitative Aptitude Guide for Bank & Competitive Exams 2026"
      description="Master Quantitative Aptitude for JAIIB, IBPS, SSC, CAT & all competitive exams. Syllabus map, must-remember formulas, 30-day plan, sample MCQs with answers."
      canonical="https://mockmaster.fun/guides/quantitative-aptitude-guide"
      keywords="quantitative aptitude, quant formulas, bank exam maths, IBPS quant syllabus, SI CI formula, time and work shortcuts"
      breadcrumb={[
        { label: 'Home', url: '/' },
        { label: 'Study Guides', url: '/study-topics' },
        { label: 'Quantitative Aptitude' },
      ]}
      content={content}
      relatedTopics={relatedTopics}
      lastUpdated="September 2026"
    />
  );
};

export default QuantAptitudePage;
