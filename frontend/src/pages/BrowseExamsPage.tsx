import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';

interface ExamCard {
  id: string;
  name: string;
  fullName: string;
  provider: string;
  providerIcon: string;
  category: string;
  questions: number;
  sets: number;
  difficulty: string;
  status: 'live' | 'coming_soon';
  color: string;
  link: string;
}

const EXAMS: ExamCard[] = [
  {
    id: 'ie-ifs',
    name: 'IE & IFS',
    fullName: 'Indian Economy & Indian Financial System',
    provider: 'IIBF',
    providerIcon: '🏦',
    category: 'Banking',
    questions: 1068,
    sets: 21,
    difficulty: 'Moderate',
    status: 'live',
    color: 'from-blue-500 to-blue-700',
    link: '/practice-tests/ie-ifs',
  },
  {
    id: 'ppb',
    name: 'PPB',
    fullName: 'Principles & Practices of Banking',
    provider: 'IIBF',
    providerIcon: '🏦',
    category: 'Banking',
    questions: 760,
    sets: 15,
    difficulty: 'Moderate',
    status: 'live',
    color: 'from-indigo-500 to-indigo-700',
    link: '/practice-tests/ppb',
  },
  {
    id: 'afm',
    name: 'AFM',
    fullName: 'Accounting & Financial Management',
    provider: 'IIBF',
    providerIcon: '🏦',
    category: 'Banking',
    questions: 1195,
    sets: 23,
    difficulty: 'Hard',
    status: 'live',
    color: 'from-purple-500 to-purple-700',
    link: '/practice-tests/afm',
  },
  {
    id: 'rbwm',
    name: 'RBWM',
    fullName: 'Retail Banking & Wealth Management',
    provider: 'IIBF',
    providerIcon: '🏦',
    category: 'Banking',
    questions: 635,
    sets: 13,
    difficulty: 'Moderate',
    status: 'live',
    color: 'from-pink-500 to-pink-700',
    link: '/practice-tests/rbwm',
  },
  {
    id: 'ai-300',
    name: 'AI-300',
    fullName: 'Operationalizing ML & GenAI Solutions',
    provider: 'Microsoft',
    providerIcon: '🟦',
    category: 'Cloud & AI',
    questions: 350,
    sets: 7,
    difficulty: 'Advanced',
    status: 'live',
    color: 'from-violet-500 to-purple-700',
    link: '/ai-300-practice-test',
  },
  {
    id: 'az-400',
    name: 'AZ-400',
    fullName: 'Designing & Implementing DevOps Solutions',
    provider: 'Microsoft',
    providerIcon: '🟦',
    category: 'Cloud & AI',
    questions: 0,
    sets: 0,
    difficulty: 'Advanced',
    status: 'coming_soon',
    color: 'from-cyan-500 to-blue-700',
    link: '#',
  },
  {
    id: 'az-104',
    name: 'AZ-104',
    fullName: 'Azure Administrator Associate',
    provider: 'Microsoft',
    providerIcon: '🟦',
    category: 'Cloud & AI',
    questions: 0,
    sets: 0,
    difficulty: 'Intermediate',
    status: 'coming_soon',
    color: 'from-sky-500 to-cyan-700',
    link: '#',
  },
  {
    id: 'caiib-abm',
    name: 'CAIIB - ABM',
    fullName: 'Advanced Bank Management',
    provider: 'IIBF',
    providerIcon: '🏦',
    category: 'Banking',
    questions: 0,
    sets: 0,
    difficulty: 'Advanced',
    status: 'coming_soon',
    color: 'from-emerald-500 to-teal-700',
    link: '#',
  },
];

const CATEGORIES = ['All', 'Banking', 'Cloud & AI'];

const BrowseExamsPage: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const filtered = EXAMS.filter((exam) => {
    const matchesSearch = exam.name.toLowerCase().includes(search.toLowerCase()) ||
      exam.fullName.toLowerCase().includes(search.toLowerCase()) ||
      exam.provider.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'All' || exam.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <SEO
        title="Browse Exams — Free Practice Tests | MockMaster"
        description="Browse all available certification practice tests. JAIIB banking exams, Microsoft AI-300, AZ-400, and more. Free practice with AI explanations."
        canonical="https://mockmaster.fun/exams"
        keywords="free certification practice test, JAIIB practice, AI-300 practice, AZ-400 practice, Microsoft certification free"
      />

      {/* Nav */}
      <nav className="border-b border-gray-800 sticky top-0 z-50 bg-gray-950/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="text-xl font-bold">MockMaster</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <button onClick={() => navigate('/login')} className="px-4 py-2 text-sm text-gray-300 hover:text-white transition">Login</button>
            <button onClick={() => navigate('/register')} className="px-5 py-2.5 text-sm bg-indigo-600 hover:bg-indigo-700 font-semibold rounded-lg transition">Sign Up Free</button>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">All Exams</h1>
          <p className="text-gray-400 mb-8">Choose an exam to start practicing. New exams added regularly.</p>

          {/* Search + Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex-1">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search exams..."
                className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
            <div className="flex gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                    category === cat
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-900 text-gray-400 border border-gray-800 hover:border-gray-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Results count */}
          <p className="text-sm text-gray-500 mb-6">{filtered.length} exam{filtered.length !== 1 ? 's' : ''} found</p>

          {/* Exam Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((exam) => (
              <div
                key={exam.id}
                onClick={() => exam.status === 'live' ? navigate(exam.link) : null}
                className={`bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden transition-all ${
                  exam.status === 'live'
                    ? 'cursor-pointer hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/5'
                    : 'opacity-60'
                }`}
              >
                {/* Color bar */}
                <div className={`h-1.5 bg-gradient-to-r ${exam.color}`} />

                <div className="p-6">
                  {/* Provider + Status */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{exam.providerIcon}</span>
                      <span className="text-xs text-gray-500 font-medium">{exam.provider}</span>
                    </div>
                    {exam.status === 'live' ? (
                      <span className="text-xs bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full font-medium">Live</span>
                    ) : (
                      <span className="text-xs bg-gray-800 text-gray-500 px-2 py-0.5 rounded-full font-medium">Coming Soon</span>
                    )}
                  </div>

                  {/* Exam Name */}
                  <h3 className="text-lg font-bold text-white mb-1">{exam.name}</h3>
                  <p className="text-sm text-gray-400 mb-4 line-clamp-2">{exam.fullName}</p>

                  {/* Stats */}
                  {exam.status === 'live' ? (
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span><strong className="text-white">{exam.questions}</strong> questions</span>
                      <span><strong className="text-white">{exam.sets}</strong> sets</span>
                      <span className="text-gray-600">|</span>
                      <span>{exam.difficulty}</span>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-600">Questions are being prepared</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Request exam */}
          <div className="mt-12 text-center">
            <p className="text-gray-500 text-sm mb-3">Don't see your exam?</p>
            <button
              onClick={() => navigate('/contact')}
              className="px-5 py-2.5 bg-gray-900 border border-gray-800 text-gray-300 hover:border-gray-700 hover:text-white rounded-lg text-sm font-medium transition"
            >
              Request an Exam
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center text-sm text-gray-500">
          <p>&copy; 2026 MockMaster. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default BrowseExamsPage;
