import React from 'react';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';

const AboutPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="About MockMaster — Free JAIIB & CAIIB Exam Prep Platform"
        description="Learn about MockMaster — who we are, our mission to help bank officers clear JAIIB and CAIIB exams with AI-powered practice, detailed explanations, and free access to 3000+ questions."
        canonical="https://mockmaster.fun/about"
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
      <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
            About MockMaster
          </h1>
          <p className="text-base sm:text-xl text-gray-600 leading-relaxed">
            Your free companion for JAIIB & CAIIB exam preparation — built by bankers, for bankers.
          </p>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-6 sm:p-10 shadow-lg border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-xl sm:text-2xl">🎯</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Our Mission</h2>
            </div>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
              We're on a mission to help bank officers clear their JAIIB and CAIIB exams with confidence. Through AI-powered practice sets, detailed explanations citing official sources, and adaptive learning, we make quality exam preparation accessible to everyone — completely free of charge.
            </p>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="bg-gray-50 py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <span className="text-xl sm:text-2xl">🚀</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">What We Offer</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                <span className="text-xl">📚</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">3000+ Questions</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                A comprehensive question bank covering all JAIIB papers — IE&IFS, PPB, AFM, and RBWM — with new questions added regularly.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                <span className="text-xl">🤖</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">AI Explanations</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Every question comes with AI-generated explanations that cite specific RBI circulars, Master Directions, and IIBF textbook references.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                <span className="text-xl">📊</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Performance Analytics</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Track your progress with detailed analytics — see your strengths, identify weak areas, and monitor improvement over time.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mb-3">
                <span className="text-xl">💰</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Free Forever</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                No hidden charges, no premium tiers, no credit card required. Quality exam preparation should be accessible to every bank officer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why We Built This */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 sm:p-10 text-white shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <span className="text-xl sm:text-2xl">💡</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold">Why We Built This</h2>
            </div>
            <p className="text-base sm:text-lg text-blue-100 leading-relaxed mb-4">
              MockMaster was founded by banking professionals who struggled with outdated study materials, expensive coaching, and scattered resources while preparing for their own JAIIB and CAIIB exams.
            </p>
            <p className="text-base sm:text-lg text-blue-100 leading-relaxed">
              We believe every bank officer deserves access to quality exam preparation regardless of their budget. That's why we built MockMaster — a platform that combines the latest technology with expert-curated content to give you the best possible chance of clearing your exams in the first attempt.
            </p>
          </div>
        </div>
      </section>

      {/* Our Approach */}
      <section className="bg-gray-50 py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-xl sm:text-2xl">⚙️</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Our Approach</h2>
          </div>
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 flex items-start gap-4">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white font-bold text-sm">1</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Aligned with Latest IIBF Syllabus</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  All questions are mapped to the current IIBF syllabus, ensuring you practice exactly what will be tested in the exam. We update our question bank whenever the syllabus changes.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 flex items-start gap-4">
              <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white font-bold text-sm">2</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">AI Explanations with Official References</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Our AI-powered explanations don't just tell you the right answer — they cite specific RBI Master Circulars, Master Directions, IIBF textbook chapters, and relevant Banking Acts so you understand the "why" behind every concept.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 flex items-start gap-4">
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white font-bold text-sm">3</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Adaptive Learning for Weak Areas</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Our system identifies your weak topics and adapts your practice sessions accordingly. Spend less time on what you already know and more time strengthening areas that need improvement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Quality */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-xl sm:text-2xl">✅</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Content Quality</h2>
          </div>
          <div className="bg-white rounded-2xl p-6 sm:p-10 shadow-lg border border-gray-100">
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="text-green-500 font-bold mt-0.5">✓</span>
                <p className="text-gray-700 leading-relaxed">
                  <strong>Accuracy Reviewed:</strong> All questions are reviewed for factual accuracy before being added to the platform.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 font-bold mt-0.5">✓</span>
                <p className="text-gray-700 leading-relaxed">
                  <strong>Official Sources:</strong> Explanations reference official sources including RBI circulars, IIBF textbooks, Banking Regulation Act, NI Act, and other relevant legislation.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 font-bold mt-0.5">✓</span>
                <p className="text-gray-700 leading-relaxed">
                  <strong>Regular Updates:</strong> Our content is updated whenever RBI policies change, new Master Directions are issued, or the IIBF syllabus is revised.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 font-bold mt-0.5">✓</span>
                <p className="text-gray-700 leading-relaxed">
                  <strong>Community Feedback:</strong> Users can flag inaccurate questions, which are promptly reviewed and corrected by our team.
                </p>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Contact Us */}
      <section className="bg-gray-50 py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white rounded-2xl p-6 sm:p-10 shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">✉️</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Contact Us</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Have questions, feedback, or suggestions? We'd love to hear from you.
            </p>
            <a
              href="mailto:support@mockmaster.fun"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
            >
              <span>📧</span>
              support@mockmaster.fun
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4 sm:mb-6">Ready to Start Preparing?</h2>
          <p className="text-base sm:text-xl text-blue-100 mb-6 sm:mb-8">
            Join thousands of bank officers who are preparing smarter with MockMaster.
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

export default AboutPage;
