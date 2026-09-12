import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import { useAuth } from '../context/AuthContext';
import { usePractice } from '../context/PracticeContext';

const TOPICS = [
  { name: 'Percentages and Ratios', desc: 'Percentages, ratios, proportion, successive change', count: 5 },
  { name: 'Simple and Compound Interest', desc: 'SI, CI, doubling time, CI–SI difference', count: 5 },
  { name: 'Time Work and Speed', desc: 'Time & work, trains, boats, average speed', count: 5 },
  { name: 'Profit Loss and Averages', desc: 'Profit %, CP/SP, averages, discount', count: 5 },
  { name: 'Number Systems and Simplification', desc: 'BODMAS, HCF/LCM, powers, divisibility', count: 5 },
  { name: 'Data Interpretation Basics', desc: 'Tables, pie charts, growth rates, projections', count: 5 },
];

const QuantPracticePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { generatePracticeSet, is_loading } = usePractice();
  const [error, setError] = useState<string | null>(null);

  const startPractice = async () => {
    if (!user) {
      navigate('/register');
      return;
    }
    setError(null);
    try {
      await generatePracticeSet('QUANT');
      navigate('/practice');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to start practice set');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Quantitative Aptitude Practice Test — Free Bank & Competitive Exam Prep"
        description="Free Quantitative Aptitude practice sets: percentages, SI/CI, time-work-speed, profit-loss, number systems & DI. 25-question timed sets with instant scoring."
        canonical="https://mockmaster.fun/quant-practice-test"
        keywords="quantitative aptitude practice, quant mock test, IBPS quant questions, bank exam maths practice, SI CI practice"
      />

      {/* Nav */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm sm:text-lg">M</span>
            </div>
            <span className="text-base sm:text-xl font-bold text-gray-900">MockMaster</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <button onClick={() => navigate('/login')} className="px-3 sm:px-6 py-2 text-xs sm:text-sm text-gray-700 font-medium hover:text-gray-900 transition">Login</button>
            <button onClick={() => navigate('/register')} className="px-3 sm:px-6 py-2 text-xs sm:text-sm bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition">Sign Up</button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full mb-4">
            <span>All Competitive Exams</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Quantitative Aptitude Practice Test
          </h1>
          <p className="text-base sm:text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            25-question timed sets across 6 core topics — percentages, interest, time-work-speed,
            profit-loss, number systems, and data interpretation. Same maths as JAIIB, IBPS, SSC & CAT.
          </p>
          <div className="flex items-center justify-center gap-6 mb-8 text-sm">
            <div><span className="text-2xl font-bold text-gray-900">30</span> <span className="text-gray-600">questions</span></div>
            <div className="w-px h-6 bg-gray-300" />
            <div><span className="text-2xl font-bold text-gray-900">6</span> <span className="text-gray-600">topics</span></div>
            <div className="w-px h-6 bg-gray-300" />
            <div><span className="text-2xl font-bold text-gray-900">25</span> <span className="text-gray-600">per set</span></div>
          </div>
          <button
            onClick={startPractice}
            disabled={is_loading}
            className="px-8 py-3.5 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition shadow-lg shadow-emerald-200 disabled:opacity-50"
          >
            {is_loading ? 'Preparing your set…' : user ? 'Start Practice Set' : 'Sign Up Free to Practice'}
          </button>
          {error && <p className="text-red-600 text-sm mt-4">{error}</p>}
          <p className="mt-4">
            <button onClick={() => navigate('/guides/quantitative-aptitude-guide')} className="text-sm text-emerald-700 font-medium hover:underline">
              First read the Quantitative Aptitude Guide →
            </button>
          </p>
        </div>
      </section>

      {/* Topics */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-3">What each set covers</h2>
          <p className="text-gray-600 text-center mb-10">Every 25-question set is sampled across all 6 topics.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {TOPICS.map((t) => (
              <div key={t.name} className="bg-white border border-gray-200 rounded-xl p-6 hover:border-emerald-300 hover:shadow-md transition">
                <h3 className="font-bold text-gray-900 mb-2">{t.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{t.desc}</p>
                <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full">{t.count} questions live</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">How it works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
            <div className="bg-white rounded-xl p-5 border border-gray-200">
              <p className="text-2xl font-bold text-emerald-600 mb-2">1</p>
              <p className="text-sm text-gray-700">Hit start — a fresh 25-question set is generated from the bank.</p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-200">
              <p className="text-2xl font-bold text-emerald-600 mb-2">2</p>
              <p className="text-sm text-gray-700">Solve against the clock, exactly like the real exam.</p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-200">
              <p className="text-2xl font-bold text-emerald-600 mb-2">3</p>
              <p className="text-sm text-gray-700">Get instant scoring with topic-wise accuracy breakdown.</p>
            </div>
          </div>
          <button
            onClick={startPractice}
            disabled={is_loading}
            className="mt-8 px-8 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
          >
            {is_loading ? 'Preparing…' : 'Start Now — It’s Free'}
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-400 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center text-sm">
          <p>&copy; 2026 MockMaster. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default QuantPracticePage;
