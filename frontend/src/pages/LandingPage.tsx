import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, MotionConfig } from 'motion/react';
import SEO from '../components/SEO';
import ExamOrgLogo from '../components/ExamOrgLogo';

// Shared scroll-reveal: fade up once when entering the viewport.
const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-64px' },
} as const;

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <MotionConfig reducedMotion="user">
    <div className="min-h-screen bg-gray-950 text-white">
      <SEO
        title="MockMaster — Free IT Certification & Banking Exam Practice Tests"
        description="Free practice tests for JAIIB 2026 (3700+ questions), Microsoft AI-300 (510 questions), and PMI CAPM (225 questions). AI explanations, leaderboard, timed mock tests. No payment required."
        canonical="https://mockmaster.fun/"
        keywords="JAIIB mock test 2026, AI-300 practice test, CAPM practice test, free certification practice, Microsoft AI-300, PMI CAPM, IIBF exam prep, Azure ML certification"
      />

      {/* Navigation */}
      <nav className="border-b border-gray-800 sticky top-0 z-50 bg-gray-950/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="text-xl font-bold">MockMaster</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <button onClick={() => navigate('/exams')} className="hidden sm:block px-4 py-2 text-sm text-gray-300 hover:text-white transition">Exams</button>
            <button onClick={() => navigate('/blog')} className="hidden md:block px-4 py-2 text-sm text-gray-300 hover:text-white transition">Blog</button>
            <button onClick={() => navigate('/login')} className="px-4 py-2 text-sm text-gray-300 hover:text-white transition">Login</button>
            <button onClick={() => navigate('/register')} className="px-5 py-2.5 text-sm bg-indigo-600 hover:bg-indigo-700 font-semibold rounded-lg transition">Sign Up Free</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/50 via-transparent to-transparent" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 sm:pt-32 sm:pb-24 text-center relative">
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="text-4xl sm:text-6xl lg:text-7xl font-bold leading-tight tracking-tight mb-6"
          >
            Master your certification.
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Pass on first attempt.
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
            className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            AI-powered practice tests with instant explanations, leaderboard rankings, and performance analytics. Built for bank officers, cloud engineers, and project managers.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => navigate('/register')} className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-base transition shadow-lg shadow-indigo-600/25">
              Create Free Account
            </motion.button>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => navigate('/exams')} className="px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold rounded-xl text-base transition">
              Browse Exams
            </motion.button>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="text-xs text-gray-500 mt-6"
          >
            No credit card. No trial period. Free forever.
          </motion.p>
        </div>
      </section>

      {/* Exam Cards */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div {...reveal} transition={{ duration: 0.5 }} className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Choose Your Exam</h2>
            <p className="text-gray-400">Select an exam to start practicing. More exams coming soon.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* JAIIB */}
            <motion.div
              {...reveal}
              transition={{ duration: 0.5, delay: 0 }}
              onClick={() => navigate('/register')}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-6 cursor-pointer hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/5 transition-all group"
            >
              <div className="flex items-center gap-3 mb-4">
                <ExamOrgLogo exam="JAIIB" size={48} />
                <div>
                  <h3 className="text-xl font-bold group-hover:text-indigo-400 transition">JAIIB</h3>
                  <p className="text-xs text-gray-500">Indian Institute of Banking & Finance</p>
                </div>
              </div>
              <p className="text-sm text-gray-400 mb-5">4 papers: IE&IFS, PPB, AFM, RBWM. Banking operations, financial management, wealth management.</p>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <span className="text-2xl font-bold text-white">3,700+</span>
                  <span className="text-xs text-gray-500">questions</span>
                </div>
                <div className="w-px h-6 bg-gray-800" />
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-bold text-white">74</span>
                  <span className="text-xs text-gray-500">sets</span>
                </div>
              </div>
            </motion.div>

            {/* CAIIB */}
            <motion.div
              {...reveal}
              transition={{ duration: 0.5, delay: 0.08 }}
              onClick={() => navigate('/register')}
              className="relative bg-gray-900 border border-gray-800 rounded-2xl p-6 cursor-pointer hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/5 transition-all group"
            >
              <span className="absolute top-4 right-4 text-[11px] font-bold text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full">NEW</span>
              <div className="flex items-center gap-3 mb-4">
                <ExamOrgLogo exam="CAIIB" size={48} />
                <div>
                  <h3 className="text-xl font-bold group-hover:text-emerald-400 transition">CAIIB</h3>
                  <p className="text-xs text-gray-500">Certified Associate (Advanced)</p>
                </div>
              </div>
              <p className="text-sm text-gray-400 mb-5">ABM paper live. Statistics, HRM, credit management, compliance & corporate governance.</p>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <span className="text-2xl font-bold text-white">740</span>
                  <span className="text-xs text-gray-500">questions</span>
                </div>
                <div className="w-px h-6 bg-gray-800" />
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-bold text-white">14</span>
                  <span className="text-xs text-gray-500">sets</span>
                </div>
              </div>
            </motion.div>

            {/* AI-300 */}
            <motion.div
              {...reveal}
              transition={{ duration: 0.5, delay: 0.16 }}
              onClick={() => navigate('/ai-300-practice-test')}
              className="relative bg-gray-900 border border-gray-800 rounded-2xl p-6 cursor-pointer hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/5 transition-all group"
            >
              <span className="absolute top-4 right-4 text-[11px] font-bold text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full">NEW</span>
              <div className="flex items-center gap-3 mb-4">
                <ExamOrgLogo exam="AI-300" size={48} />
                <div>
                  <h3 className="text-xl font-bold group-hover:text-purple-400 transition">AI-300</h3>
                  <p className="text-xs text-gray-500">Microsoft Certification</p>
                </div>
              </div>
              <p className="text-sm text-gray-400 mb-5">Operationalizing ML & GenAI Solutions. Azure ML, MLOps, Foundry, RAG, fine-tuning, and model deployment.</p>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <span className="text-2xl font-bold text-white">510</span>
                  <span className="text-xs text-gray-500">questions</span>
                </div>
                <div className="w-px h-6 bg-gray-800" />
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-bold text-white">10</span>
                  <span className="text-xs text-gray-500">sets</span>
                </div>
              </div>
            </motion.div>

            {/* CAPM */}
            <motion.div
              {...reveal}
              transition={{ duration: 0.5, delay: 0.24 }}
              onClick={() => navigate('/capm-practice-test')}
              className="relative bg-gray-900 border border-gray-800 rounded-2xl p-6 cursor-pointer hover:border-orange-500/50 hover:shadow-xl hover:shadow-orange-500/5 transition-all group"
            >
              <span className="absolute top-4 right-4 text-[11px] font-bold text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full">NEW</span>
              <div className="flex items-center gap-3 mb-4">
                <ExamOrgLogo exam="CAPM" size={48} />
                <div>
                  <h3 className="text-xl font-bold group-hover:text-orange-400 transition">CAPM</h3>
                  <p className="text-xs text-gray-500">PMI Certification</p>
                </div>
              </div>
              <p className="text-sm text-gray-400 mb-5">Certified Associate in Project Management. Fundamentals, predictive, agile & business analysis.</p>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <span className="text-2xl font-bold text-white">225</span>
                  <span className="text-xs text-gray-500">questions</span>
                </div>
                <div className="w-px h-6 bg-gray-800" />
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-bold text-white">3</span>
                  <span className="text-xs text-gray-500">sets</span>
                </div>
              </div>
            </motion.div>

            {/* QUANT */}
            <motion.div
              {...reveal}
              transition={{ duration: 0.5, delay: 0.32 }}
              onClick={() => navigate('/quant-practice-test')}
              className="relative bg-gray-900 border border-gray-800 rounded-2xl p-6 cursor-pointer hover:border-rose-500/50 hover:shadow-xl hover:shadow-rose-500/5 transition-all group"
            >
              <span className="absolute top-4 right-4 text-[11px] font-bold text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full">NEW</span>
              <div className="flex items-center gap-3 mb-4">
                <ExamOrgLogo exam="QUANT" size={48} />
                <div>
                  <h3 className="text-xl font-bold group-hover:text-rose-400 transition">QUANT</h3>
                  <p className="text-xs text-gray-500">All Competitive Exams</p>
                </div>
              </div>
              <p className="text-sm text-gray-400 mb-5">Quantitative Aptitude for Bank, SSC, CAT, UPSC & Railways. 35 chapters, 20-min sets with negative marking.</p>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <span className="text-2xl font-bold text-white">440+</span>
                  <span className="text-xs text-gray-500">questions</span>
                </div>
                <div className="w-px h-6 bg-gray-800" />
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-bold text-white">14</span>
                  <span className="text-xs text-gray-500">sets</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
        <div className="max-w-5xl mx-auto">
          <motion.div {...reveal} transition={{ duration: 0.5 }} className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Everything you need to pass</h2>
            <p className="text-gray-400">No fluff. Just the tools that actually help.</p>
          </motion.div>

          <motion.div
            {...reveal}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition">
              <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4"><span className="text-xl">🤖</span></div>
              <h3 className="font-bold text-white mb-2">AI Explanations</h3>
              <p className="text-sm text-gray-400">Every wrong answer gets a detailed explanation with official references. Not generic — exam-specific.</p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition">
              <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center mb-4"><span className="text-xl">🏆</span></div>
              <h3 className="font-bold text-white mb-2">Leaderboard</h3>
              <p className="text-sm text-gray-400">Compete with other candidates. See your rank. Top 3 get medals. Updated after every submission.</p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition">
              <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center mb-4"><span className="text-xl">⏱️</span></div>
              <h3 className="font-bold text-white mb-2">Timed Mock Tests</h3>
              <p className="text-sm text-gray-400">Real exam conditions. Auto-submit when time runs out. Build speed and accuracy under pressure.</p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition">
              <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center mb-4"><span className="text-xl">💬</span></div>
              <h3 className="font-bold text-white mb-2">Discussion Forum</h3>
              <p className="text-sm text-gray-400">Ask doubts on any question. Other candidates reply. Learn from the community.</p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition">
              <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center mb-4"><span className="text-xl">⭐</span></div>
              <h3 className="font-bold text-white mb-2">Bookmark Questions</h3>
              <p className="text-sm text-gray-400">Save tricky questions with one tap. Revisit them before the exam for targeted revision.</p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition">
              <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4"><span className="text-xl">📊</span></div>
              <h3 className="font-bold text-white mb-2">Performance Analytics</h3>
              <p className="text-sm text-gray-400">Score trends, weak areas, exam readiness score, percentile ranking, and study streak.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Leaderboard Preview */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 {...reveal} transition={{ duration: 0.5 }} className="text-2xl sm:text-3xl font-bold mb-3">Climb the leaderboard</motion.h2>
          <motion.p {...reveal} transition={{ duration: 0.5, delay: 0.08 }} className="text-gray-400 mb-10">Earn points for every question you master. See how you stack up against candidates across India.</motion.p>

          {/* Mock leaderboard */}
          <motion.div
            {...reveal}
            transition={{ duration: 0.5, delay: 0.12 }}
            className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden max-w-lg mx-auto"
          >
            <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-300">Top Performers</span>
              <span className="text-xs text-gray-500">Updated in real-time</span>
            </div>
            <div className="divide-y divide-gray-800">
              {[
                { rank: '🥇', name: 'Pradeep K.', score: '89%', sessions: 12 },
                { rank: '🥈', name: 'Rashmi H.', score: '84%', sessions: 8 },
                { rank: '🥉', name: 'Veerababu M.', score: '78%', sessions: 15 },
                { rank: '4', name: 'You?', score: '—', sessions: 0 },
              ].map((user, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                  className={`px-6 py-3.5 flex items-center justify-between ${i === 3 ? 'bg-indigo-500/5' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-base w-6 text-center">{user.rank}</span>
                    <span className={`text-sm font-medium ${i === 3 ? 'text-indigo-400' : 'text-gray-200'}`}>{user.name}</span>
                  </div>
                  <span className={`text-sm font-bold ${i === 3 ? 'text-indigo-400' : 'text-white'}`}>{user.score}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.button
            {...reveal}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/register')}
            className="mt-8 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 font-semibold rounded-xl transition"
          >
            Join the Leaderboard
          </motion.button>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-950 to-indigo-950/30">
        <motion.div {...reveal} transition={{ duration: 0.5 }} className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to start?</h2>
          <p className="text-gray-400 mb-8 text-lg">Create your free account in 10 seconds. No credit card needed.</p>
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={() => navigate('/register')} className="px-10 py-4 bg-white text-gray-900 font-bold rounded-xl text-lg hover:bg-gray-100 transition shadow-2xl">
            Create Free Account
          </motion.button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold text-white mb-4">Exams</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button onClick={() => navigate('/practice-tests')} className="hover:text-white transition">JAIIB Practice</button></li>
                <li><button onClick={() => navigate('/ai-300-practice-test')} className="hover:text-white transition">AI-300 Practice</button></li>
                <li><button onClick={() => navigate('/capm-practice-test')} className="hover:text-white transition">CAPM Practice</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button onClick={() => navigate('/blog')} className="hover:text-white transition">Blog</button></li>
                <li><button onClick={() => navigate('/study-topics')} className="hover:text-white transition">Study Topics</button></li>
                <li><button onClick={() => navigate('/faq')} className="hover:text-white transition">FAQ</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button onClick={() => navigate('/about')} className="hover:text-white transition">About</button></li>
                <li><button onClick={() => navigate('/contact')} className="hover:text-white transition">Contact</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button onClick={() => navigate('/privacy-policy')} className="hover:text-white transition">Privacy Policy</button></li>
                <li><button onClick={() => navigate('/terms-of-service')} className="hover:text-white transition">Terms of Service</button></li>
                <li><button onClick={() => navigate('/disclaimer')} className="hover:text-white transition">Disclaimer</button></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
            <p>&copy; 2026 MockMaster. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
    </MotionConfig>
  );
};

export default LandingPage;
