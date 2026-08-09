import React from 'react';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="MockMaster — Free JAIIB Mock Tests 2026 | AI Explanations, Leaderboard & More"
        description="Free JAIIB 2026 practice with 3600+ questions, AI explanations citing RBI circulars, All-India leaderboard, timed mock tests, discussion forum, and performance analytics. IE&IFS, PPB, AFM, RBWM."
        canonical="https://mockmaster.fun/"
        keywords="JAIIB mock test 2026, JAIIB practice questions free, JAIIB AI explanation, JAIIB leaderboard, IIBF exam prep, JAIIB mock test free online"
      />
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm sm:text-lg">JC</span>
            </div>
            <span className="text-base sm:text-xl font-bold text-gray-900 hidden sm:block">JAIIB-CAIIB Prep</span>
            <span className="text-base font-bold text-gray-900 sm:hidden">MockMaster</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-4">
            <button onClick={() => navigate('/practice-tests')} className="px-2 sm:px-6 py-2 text-xs sm:text-sm text-gray-700 font-medium hover:text-gray-900 transition hidden sm:block">Practice Tests</button>
            <button onClick={() => navigate('/study-topics')} className="px-2 sm:px-6 py-2 text-xs sm:text-sm text-gray-700 font-medium hover:text-gray-900 transition hidden sm:block">Study Topics</button>
            <button onClick={() => navigate('/blog')} className="px-2 sm:px-6 py-2 text-xs sm:text-sm text-gray-700 font-medium hover:text-gray-900 transition hidden md:block">Blog</button>
            <button onClick={() => navigate('/login')} className="px-3 sm:px-6 py-2 text-xs sm:text-sm text-gray-700 font-medium hover:text-gray-900 transition">Login</button>
            <button onClick={() => navigate('/register')} className="px-3 sm:px-6 py-2 text-xs sm:text-sm bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition">Sign Up</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
            Pass JAIIB 2026 with Free AI-Powered Practice
          </h1>
          <p className="text-base sm:text-lg text-gray-700 mb-8 leading-relaxed max-w-2xl mx-auto">
            3,600+ questions across all 4 papers. AI explanations citing RBI circulars. All-India leaderboard. Timed mock tests. Discussion forum. Performance analytics. Everything free.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => navigate('/register')} className="px-8 py-3.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition text-sm sm:text-base shadow-lg shadow-blue-200">
              Start Practicing Free
            </button>
            <button onClick={() => navigate('/login')} className="px-8 py-3.5 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-gray-400 transition text-sm sm:text-base">
              Login to Account
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-4">No credit card required. No subscription. Free forever.</p>
        </div>
      </section>

      {/* Papers Quick Start */}
      <section className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 text-center">Practice All 4 JAIIB Papers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <div onClick={() => navigate('/practice-tests/ie-ifs')} className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl p-4 sm:p-5 cursor-pointer hover:shadow-lg hover:scale-[1.03] transition-all text-white text-center">
              <h3 className="font-bold text-lg sm:text-xl">IE & IFS</h3>
              <p className="text-2xl font-bold mt-2">1068</p>
              <p className="text-xs opacity-80">questions</p>
            </div>
            <div onClick={() => navigate('/practice-tests/ppb')} className="bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-xl p-4 sm:p-5 cursor-pointer hover:shadow-lg hover:scale-[1.03] transition-all text-white text-center">
              <h3 className="font-bold text-lg sm:text-xl">PPB</h3>
              <p className="text-2xl font-bold mt-2">760</p>
              <p className="text-xs opacity-80">questions</p>
            </div>
            <div onClick={() => navigate('/practice-tests/afm')} className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl p-4 sm:p-5 cursor-pointer hover:shadow-lg hover:scale-[1.03] transition-all text-white text-center">
              <h3 className="font-bold text-lg sm:text-xl">AFM</h3>
              <p className="text-2xl font-bold mt-2">1195</p>
              <p className="text-xs opacity-80">questions</p>
            </div>
            <div onClick={() => navigate('/practice-tests/rbwm')} className="bg-gradient-to-br from-pink-500 to-pink-700 rounded-xl p-4 sm:p-5 cursor-pointer hover:shadow-lg hover:scale-[1.03] transition-all text-white text-center">
              <h3 className="font-bold text-lg sm:text-xl">RBWM</h3>
              <p className="text-2xl font-bold mt-2">635</p>
              <p className="text-xs opacity-80">questions</p>
            </div>
          </div>

          {/* Other Exams */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">Also Available</h3>
            <div className="flex justify-center">
              <div onClick={() => navigate('/ai-300-practice-test')} className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-xl p-5 cursor-pointer hover:shadow-lg hover:scale-[1.03] transition-all text-white text-center max-w-xs w-full">
                <div className="inline-flex items-center gap-1 bg-white bg-opacity-20 text-xs px-2 py-0.5 rounded-full mb-2">
                  <span>Microsoft</span>
                </div>
                <h3 className="font-bold text-lg">AI-300</h3>
                <p className="text-sm opacity-80 mt-1">ML & GenAI Solutions</p>
                <p className="text-xs opacity-60 mt-1">Coming Soon</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 text-center">Everything You Need to Pass JAIIB</h2>
          <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">No fluff. Just the features that actually help you clear the exam.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3"><span className="text-xl">📝</span></div>
              <h3 className="font-bold text-gray-900 mb-1">3,600+ Practice Questions</h3>
              <p className="text-sm text-gray-600">50 questions per set. Fixed sets so you can track progress. Covers all modules across all 4 papers.</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-3"><span className="text-xl">🤖</span></div>
              <h3 className="font-bold text-gray-900 mb-1">AI Explanations</h3>
              <p className="text-sm text-gray-600">Every wrong answer gets a detailed explanation citing specific RBI circulars, IIBF textbook chapters, and relevant Act sections.</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-3"><span className="text-xl">⏱️</span></div>
              <h3 className="font-bold text-gray-900 mb-1">Timed Mock Tests</h3>
              <p className="text-sm text-gray-600">100 questions in 120 minutes with real JAIIB weightage — easy (0.5), medium (1.0), hard (2.0 marks). Auto-submit when time runs out.</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mb-3"><span className="text-xl">🏆</span></div>
              <h3 className="font-bold text-gray-900 mb-1">All-India Leaderboard</h3>
              <p className="text-sm text-gray-600">See your rank among all users. Compete with colleagues. Top 3 get medals. Updated in real-time after every submission.</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mb-3"><span className="text-xl">⭐</span></div>
              <h3 className="font-bold text-gray-900 mb-1">Bookmark Questions</h3>
              <p className="text-sm text-gray-600">Save tricky questions with one tap. Revisit them anytime from your Saved Questions page — perfect for last-day revision.</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-3"><span className="text-xl">💬</span></div>
              <h3 className="font-bold text-gray-900 mb-1">Discussion per Question</h3>
              <p className="text-sm text-gray-600">Ask doubts or share reasoning after checking any answer. Other candidates reply. Learn from the community.</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mb-3"><span className="text-xl">📊</span></div>
              <h3 className="font-bold text-gray-900 mb-1">Performance Dashboard</h3>
              <p className="text-sm text-gray-600">Score trends, paper-wise breakdown, topic accuracy, weak areas, exam readiness score, and percentile ranking.</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mb-3"><span className="text-xl">⏰</span></div>
              <h3 className="font-bold text-gray-900 mb-1">Exam Countdown & Reminders</h3>
              <p className="text-sm text-gray-600">Live countdown to the next JAIIB exam. Browser notifications if you haven't practiced in 3 days.</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition">
              <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center mb-3"><span className="text-xl">🔥</span></div>
              <h3 className="font-bold text-gray-900 mb-1">Study Streak & Badges</h3>
              <p className="text-sm text-gray-600">Build daily habits with streak tracking. Earn badges for milestones — first session, 10 sessions, 7-day streak, all papers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-10 text-center">Start Practicing in 30 Seconds</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Sign Up Free</h3>
              <p className="text-sm text-gray-600">Email + password. No credit card, no phone number, no bank details needed.</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Pick a Paper</h3>
              <p className="text-sm text-gray-600">Choose IE&IFS, PPB, AFM, or RBWM. Select a practice set number.</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Practice & Learn</h3>
              <p className="text-sm text-gray-600">Answer questions, check instantly, read AI explanations, discuss with others.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Ready to Start?</h2>
          <p className="text-blue-100 mb-8">Join bank officers across India who are preparing smarter for JAIIB 2026.</p>
          <button onClick={() => navigate('/register')} className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition shadow-lg">
            Create Free Account
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="text-white font-bold mb-4">About</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/about" className="hover:text-white transition">About Us</a></li>
                <li><a href="/faq" className="hover:text-white transition">FAQ</a></li>
                <li><a href="/blog" className="hover:text-white transition">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Practice</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/practice-tests" className="hover:text-white transition">Practice Tests</a></li>
                <li><a href="/practice-tests/ie-ifs" className="hover:text-white transition">IE & IFS</a></li>
                <li><a href="/practice-tests/ppb" className="hover:text-white transition">PPB</a></li>
                <li><a href="/practice-tests/afm" className="hover:text-white transition">AFM</a></li>
                <li><a href="/practice-tests/rbwm" className="hover:text-white transition">RBWM</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/privacy-policy" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="/terms-of-service" className="hover:text-white transition">Terms of Service</a></li>
                <li><a href="/disclaimer" className="hover:text-white transition">Disclaimer</a></li>
                <li><a href="/contact" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2026 MockMaster. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
