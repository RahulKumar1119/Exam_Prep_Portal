import React from 'react';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="MockMaster — Free JAIIB & CAIIB Mock Tests 2026 | AI-Powered Practice"
        description="Free JAIIB 2026 mock tests with 3000+ questions. AI explanations citing RBI circulars & IIBF textbooks. Practice IE&IFS, PPB, AFM, RBWM papers. Pass in first attempt."
        canonical="https://mockmaster.fun/"
        keywords="JAIIB mock test 2026, JAIIB practice questions free, CAIIB mock test, IIBF exam prep, banking exam preparation"
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
            <button
              onClick={() => navigate('/practice-tests')}
              className="px-2 sm:px-6 py-2 text-xs sm:text-sm text-gray-700 font-medium hover:text-gray-900 transition hidden sm:block"
            >
              Practice Tests
            </button>
            <button
              onClick={() => navigate('/blog')}
              className="px-2 sm:px-6 py-2 text-xs sm:text-sm text-gray-700 font-medium hover:text-gray-900 transition hidden md:block"
            >
              Blog
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-3 sm:px-6 py-2 text-xs sm:text-sm text-gray-700 font-medium hover:text-gray-900 transition"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/register')}
              className="px-3 sm:px-6 py-2 text-xs sm:text-sm bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
            >
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-10 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
                Master JAIIB & CAIIB Exams
              </h1>
              <p className="text-base sm:text-xl text-gray-600 mb-6 sm:mb-8 leading-relaxed">
                AI-powered practice sets with expert explanations and personalized learning paths. Join thousands of successful candidates.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => navigate('/register')}
                  className="px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition text-sm sm:text-base"
                >
                  Start Free Trial
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="px-6 sm:px-8 py-3 sm:py-4 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition text-sm sm:text-base"
                >
                  Login to Account
                </button>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 mt-4 sm:mt-6">✓ No credit card required • ✓ Free access to 3000+ questions</p>
            </div>
            <div className="hidden md:block">
              <div className="bg-gradient-to-br from-blue-400 to-indigo-600 rounded-2xl p-8 text-white shadow-2xl">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">📚</span>
                    </div>
                    <div>
                      <p className="font-semibold">1000+ Questions</p>
                      <p className="text-sm text-blue-100">Curated from latest exams</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">🤖</span>
                    </div>
                    <div>
                      <p className="font-semibold">AI Explanations</p>
                      <p className="text-sm text-blue-100">Understand every concept</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">📊</span>
                    </div>
                    <div>
                      <p className="font-semibold">Performance Analytics</p>
                      <p className="text-sm text-blue-100">Track your progress</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-10 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
            <div className="text-center p-3 sm:p-0">
              <p className="text-2xl sm:text-4xl font-bold text-blue-600 mb-1">3000+</p>
              <p className="text-xs sm:text-base text-gray-600">Practice Questions</p>
            </div>
            <div className="text-center p-3 sm:p-0">
              <p className="text-2xl sm:text-4xl font-bold text-indigo-600 mb-1">4</p>
              <p className="text-xs sm:text-base text-gray-600">JAIIB Papers</p>
            </div>
            <div className="text-center p-3 sm:p-0">
              <p className="text-2xl sm:text-4xl font-bold text-purple-600 mb-1">3000+</p>
              <p className="text-xs sm:text-base text-gray-600">Practice Questions</p>
            </div>
            <div className="text-center p-3 sm:p-0">
              <p className="text-2xl sm:text-4xl font-bold text-pink-600 mb-1">Free</p>
              <p className="text-xs sm:text-base text-gray-600">Forever</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">Why Choose Us?</h2>
            <p className="text-sm sm:text-xl text-gray-600">Everything you need to ace your banking exams</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-xl p-4 sm:p-8 shadow-md hover:shadow-lg transition">
              <div className="w-10 h-10 sm:w-14 sm:h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <span className="text-xl sm:text-3xl">🎯</span>
              </div>
              <h3 className="text-sm sm:text-xl font-bold text-gray-900 mb-1 sm:mb-3">Adaptive Learning</h3>
              <p className="text-xs sm:text-base text-gray-600 hidden sm:block">
                Our AI adapts to your learning pace, focusing on weak areas to maximize your score improvement.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-xl p-4 sm:p-8 shadow-md hover:shadow-lg transition">
              <div className="w-10 h-10 sm:w-14 sm:h-14 bg-indigo-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <span className="text-xl sm:text-3xl">💡</span>
              </div>
              <h3 className="text-sm sm:text-xl font-bold text-gray-900 mb-1 sm:mb-3">Expert Explanations</h3>
              <p className="text-xs sm:text-base text-gray-600 hidden sm:block">
                Get detailed explanations for every question with RBI and IIBF references to deepen your understanding.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-xl p-4 sm:p-8 shadow-md hover:shadow-lg transition">
              <div className="w-10 h-10 sm:w-14 sm:h-14 bg-purple-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <span className="text-xl sm:text-3xl">📈</span>
              </div>
              <h3 className="text-sm sm:text-xl font-bold text-gray-900 mb-1 sm:mb-3">Performance Tracking</h3>
              <p className="text-xs sm:text-base text-gray-600 hidden sm:block">
                Monitor your progress with detailed analytics, score trends, and personalized recommendations.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-xl p-4 sm:p-8 shadow-md hover:shadow-lg transition">
              <div className="w-10 h-10 sm:w-14 sm:h-14 bg-green-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <span className="text-xl sm:text-3xl">⏱️</span>
              </div>
              <h3 className="text-sm sm:text-xl font-bold text-gray-900 mb-1 sm:mb-3">Timed Practice</h3>
              <p className="text-xs sm:text-base text-gray-600 hidden sm:block">
                Practice under exam conditions with realistic time limits to build speed and accuracy.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white rounded-xl p-4 sm:p-8 shadow-md hover:shadow-lg transition">
              <div className="w-10 h-10 sm:w-14 sm:h-14 bg-yellow-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <span className="text-xl sm:text-3xl">📱</span>
              </div>
              <h3 className="text-sm sm:text-xl font-bold text-gray-900 mb-1 sm:mb-3">Mobile Friendly</h3>
              <p className="text-xs sm:text-base text-gray-600 hidden sm:block">
                Study anytime, anywhere with our fully responsive platform optimized for all devices.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white rounded-xl p-4 sm:p-8 shadow-md hover:shadow-lg transition">
              <div className="w-10 h-10 sm:w-14 sm:h-14 bg-red-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <span className="text-xl sm:text-3xl">🏆</span>
              </div>
              <h3 className="text-sm sm:text-xl font-bold text-gray-900 mb-1 sm:mb-3">Proven Results</h3>
              <p className="text-xs sm:text-base text-gray-600 hidden sm:block">
                Join thousands of successful candidates who passed their exams using our platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Demo Preview Section */}
      <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">See AI Explanations in Action</h2>
            <p className="text-xl text-gray-600">Not just answers — deep understanding with official references</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Question Mock-up */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium text-sm">PPB • Question 14 of 100</span>
                  <span className="text-blue-100 text-sm">⏱ 1:23 remaining</span>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-900 font-medium mb-6 leading-relaxed">
                  As per RBI guidelines, what is the maximum period for which a bank can classify a restructured advance as a "standard asset" after the restructuring date?
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-4 rounded-lg border-2 border-gray-200 bg-gray-50">
                    <span className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-600">A</span>
                    <span className="text-gray-700">6 months</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-lg border-2 border-red-300 bg-red-50">
                    <span className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-sm font-semibold text-white">B</span>
                    <span className="text-red-800 font-medium">12 months</span>
                    <span className="ml-auto text-red-600 text-sm font-medium">✗ Your answer</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-lg border-2 border-green-300 bg-green-50">
                    <span className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-sm font-semibold text-white">C</span>
                    <span className="text-green-800 font-medium">1 year from the date of first payment of interest/principal</span>
                    <span className="ml-auto text-green-600 text-sm font-medium">✓ Correct</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-lg border-2 border-gray-200 bg-gray-50">
                    <span className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-600">D</span>
                    <span className="text-gray-700">2 years</span>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Explanation Mock-up */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 flex items-center gap-2">
                <span className="text-xl">🤖</span>
                <span className="text-white font-medium">AI Explanation</span>
              </div>
              <div className="p-6 space-y-5">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Why Option C is Correct</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    A restructured account is classified as a standard asset only if it demonstrates satisfactory performance for <strong>1 year from the date of first payment of interest or principal</strong> (whichever is later) after the restructuring. This is known as the "specified period" under RBI's prudential framework.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Why Option B is Wrong</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    12 months is a common misconception. The period is not a fixed calendar duration — it starts from the <em>first payment date post-restructuring</em>, not from the restructuring date itself.
                  </p>
                </div>

                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                    <span className="text-sm">📖</span> Official References
                  </h4>
                  <ul className="space-y-2 text-sm text-blue-800">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5">•</span>
                      <span><strong>RBI Master Circular</strong> — Prudential Norms on Income Recognition, Asset Classification and Provisioning (DOR.STR.REC.55/21.04.048/2023-24), Para 10.3.2</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5">•</span>
                      <span><strong>IIBF PPB Textbook</strong> — Chapter 12: "Credit Management", Section 12.7 (Restructuring of Advances), Page 287</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5">•</span>
                      <span><strong>RBI Framework</strong> — Resolution of Stressed Assets (June 7, 2019), Clause 17</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                  <h4 className="font-semibold text-amber-900 mb-1 text-sm">💡 Exam Tip</h4>
                  <p className="text-amber-800 text-sm">
                    IIBF frequently tests the distinction between "restructuring date" vs "first payment date" — always remember the clock starts at first payment, not at approval.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">Every question comes with detailed AI explanations citing official RBI circulars, IIBF textbooks, and relevant Acts</p>
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition"
            >
              Try It Free →
            </button>
          </div>
        </div>
      </section>

      {/* Papers Section */}
      <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Exam Papers Covered</h2>
            <p className="text-xl text-gray-600">Comprehensive practice for all JAIIB & CAIIB papers</p>
          </div>

          {/* JAIIB Papers */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">J</span>
              JAIIB — Compulsory Papers
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-8 border-2 border-blue-200">
                <h3 className="text-2xl font-bold text-blue-900 mb-3">IE & IFS</h3>
                <p className="text-blue-800 mb-4">Indian Economy & Indian Financial System</p>
                <ul className="space-y-2 text-blue-700">
                  <li>✓ 250+ practice questions</li>
                  <li>✓ Topic-wise breakdown</li>
                  <li>✓ Previous year papers</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-8 border-2 border-indigo-200">
                <h3 className="text-2xl font-bold text-indigo-900 mb-3">PPB</h3>
                <p className="text-indigo-800 mb-4">Principles & Practices of Banking</p>
                <ul className="space-y-2 text-indigo-700">
                  <li>✓ 250+ practice questions</li>
                  <li>✓ Topic-wise breakdown</li>
                  <li>✓ Previous year papers</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-8 border-2 border-purple-200">
                <h3 className="text-2xl font-bold text-purple-900 mb-3">AFM</h3>
                <p className="text-purple-800 mb-4">Accounting & Financial Management for Bankers</p>
                <ul className="space-y-2 text-purple-700">
                  <li>✓ 250+ practice questions</li>
                  <li>✓ Topic-wise breakdown</li>
                  <li>✓ Previous year papers</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-8 border-2 border-pink-200">
                <h3 className="text-2xl font-bold text-pink-900 mb-3">RBWM</h3>
                <p className="text-pink-800 mb-4">Retail Banking & Wealth Management</p>
                <ul className="space-y-2 text-pink-700">
                  <li>✓ 250+ practice questions</li>
                  <li>✓ Topic-wise breakdown</li>
                  <li>✓ Previous year papers</li>
                </ul>
              </div>
            </div>
          </div>

          {/* CAIIB Papers */}
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold">C</span>
              CAIIB — Compulsory Papers
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-8 border-2 border-emerald-200">
                <h3 className="text-2xl font-bold text-emerald-900 mb-3">ABM</h3>
                <p className="text-emerald-800 mb-4">Advanced Bank Management</p>
                <ul className="space-y-2 text-emerald-700">
                  <li>✓ Economic analysis & credit management</li>
                  <li>✓ NPA & risk management</li>
                  <li>✓ Organizational behaviour</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-8 border-2 border-teal-200">
                <h3 className="text-2xl font-bold text-teal-900 mb-3">BFM</h3>
                <p className="text-teal-800 mb-4">Bank Financial Management</p>
                <ul className="space-y-2 text-teal-700">
                  <li>✓ Treasury & international banking</li>
                  <li>✓ Risk management & Basel norms</li>
                  <li>✓ Balance sheet management</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl p-8 border-2 border-cyan-200">
                <h3 className="text-2xl font-bold text-cyan-900 mb-3">ABF</h3>
                <p className="text-cyan-800 mb-4">Advanced Business & Financial Management</p>
                <ul className="space-y-2 text-cyan-700">
                  <li>✓ Corporate finance & project appraisal</li>
                  <li>✓ Financial services & fintech</li>
                  <li>✓ Strategic management</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-sky-50 to-sky-100 rounded-xl p-8 border-2 border-sky-200">
                <h3 className="text-2xl font-bold text-sky-900 mb-3">BRBL</h3>
                <p className="text-sky-800 mb-4">Banking Regulations & Business Laws</p>
                <ul className="space-y-2 text-sky-700">
                  <li>✓ Banking Regulation Act & RBI Act</li>
                  <li>✓ Contract Act & NI Act</li>
                  <li>✓ Consumer protection & cyber laws</li>
                </ul>
              </div>
            </div>

            <h4 className="text-lg font-semibold text-gray-700 mb-4">Popular Electives</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { code: 'RBCB', name: 'Retail Banking & Consumer Banking' },
                { code: 'CRCM', name: 'Credit Management' },
                { code: 'ITK', name: 'Information Technology & Digital Banking' },
                { code: 'RISKM', name: 'Risk Management' },
                { code: 'CBBO', name: 'Central Banking & Business Operations' },
                { code: 'HRM', name: 'Human Resource Management' },
              ].map((elective) => (
                <div key={elective.code} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="font-semibold text-gray-800">{elective.code}</p>
                  <p className="text-sm text-gray-600">{elective.name}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-4 italic">
              CAIIB content coming soon — sign up to get notified when it launches.
            </p>
          </div>

          {/* Browse All Button */}
          <div className="text-center mt-12">
            <button
              onClick={() => navigate('/practice-tests')}
              className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition transform hover:scale-105"
            >
              Browse All Practice Tests →
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gray-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Students Say</h2>
            <p className="text-xl text-gray-600">Real success stories from our users</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Rajesh Kumar',
                role: 'JAIIB Passed',
                text: 'The AI explanations helped me understand complex concepts easily. Scored 85% in my first attempt!',
                rating: 5,
              },
              {
                name: 'Priya Singh',
                role: 'CAIIB Passed',
                text: 'Best platform for exam prep. The adaptive learning feature really helped me focus on weak areas.',
                rating: 5,
              },
              {
                name: 'Amit Patel',
                role: 'JAIIB Passed',
                text: 'Comprehensive question bank and excellent explanations. Highly recommended for all banking aspirants.',
                rating: 5,
              },
            ].map((testimonial, idx) => (
              <div key={idx} className="bg-white rounded-xl p-8 shadow-md">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">★</span>
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.text}"</p>
                <div>
                  <p className="font-bold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Ace Your Exam?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of successful candidates. Start your free trial today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition transform hover:scale-105"
            >
              Get Started Free
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:bg-opacity-10 transition"
            >
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="text-white font-bold mb-4">About</h4>
              <ul className="space-y-2 text-sm">
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
