import React from 'react';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';

const AboutPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <SEO
        title="About MockMaster — Free Certification Exam Practice Platform"
        description="MockMaster helps professionals pass certification exams with AI-powered practice tests, detailed explanations, and performance analytics. JAIIB, CAIIB, and Microsoft AI-300."
        canonical="https://mockmaster.fun/about"
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
            <button onClick={() => navigate('/exams')} className="hidden sm:block px-4 py-2 text-sm text-gray-300 hover:text-white transition">Exams</button>
            <button onClick={() => navigate('/login')} className="px-4 py-2 text-sm text-gray-300 hover:text-white transition">Login</button>
            <button onClick={() => navigate('/register')} className="px-5 py-2.5 text-sm bg-indigo-600 hover:bg-indigo-700 font-semibold rounded-lg transition">Sign Up Free</button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/40 via-transparent to-transparent" />
        <div className="max-w-3xl mx-auto text-center relative">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
            About <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">MockMaster</span>
          </h1>
          <p className="text-lg text-gray-400 leading-relaxed">
            Free AI-powered practice tests for banking professionals and cloud engineers. Built to help you pass on your first attempt.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-8 sm:p-10 shadow-2xl">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-indigo-100 text-lg leading-relaxed">
              Quality exam preparation shouldn't cost a fortune. We're building the most effective practice platform for professional certifications — powered by AI, backed by official sources, and completely free.
            </p>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center">What We Offer</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-indigo-500/30 transition">
              <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-xl">📚</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">4,300+ Questions</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                JAIIB (IE&IFS, PPB, AFM, RBWM) + Microsoft AI-300. Previous year papers included. Updated regularly with new content.
              </p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-purple-500/30 transition">
              <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-xl">🤖</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">AI Explanations</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Every question gets a detailed AI explanation citing RBI circulars, IIBF textbooks, or Azure documentation. Not generic — exam-specific.
              </p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-green-500/30 transition">
              <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-xl">📊</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Performance Analytics</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Score trends, weak area identification, exam readiness score, percentile ranking, and study streak tracking.
              </p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-amber-500/30 transition">
              <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-xl">💰</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Free Forever</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                No hidden charges. No premium tiers. No credit card. Quality exam preparation accessible to everyone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why We Built This */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">Why We Built This</h2>
          <div className="space-y-4 text-gray-300 text-base leading-relaxed">
            <p>
              MockMaster was built by professionals who experienced the pain of exam preparation firsthand — outdated materials, expensive coaching classes, and scattered resources that never matched the actual exam pattern.
            </p>
            <p>
              We combined modern AI technology with expert-curated content to create a platform that actually helps you pass. Our questions are sourced from official textbooks and previous exam papers. Our AI explanations cite specific regulatory references so you understand the "why" behind every answer.
            </p>
            <p>
              Whether you're a bank officer preparing for JAIIB/CAIIB or a cloud engineer studying for Microsoft AI-300, MockMaster gives you the practice and feedback you need — without spending a rupee.
            </p>
          </div>
        </div>
      </section>

      {/* Exams Covered */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center">Exams We Cover</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">🏦</span>
                <div>
                  <h3 className="font-bold text-white">JAIIB</h3>
                  <p className="text-xs text-gray-500">Indian Institute of Banking & Finance</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• IE & IFS — 1,163 questions (23 sets)</li>
                <li>• PPB — 760 questions (15 sets)</li>
                <li>• AFM — 1,195 questions (23 sets)</li>
                <li>• RBWM — 635 questions (13 sets)</li>
              </ul>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">🤖</span>
                <div>
                  <h3 className="font-bold text-white">Microsoft AI-300</h3>
                  <p className="text-xs text-gray-500">Operationalizing ML & GenAI Solutions</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• 600 scenario-based questions (12 sets)</li>
                <li>• Covers MLOps, GenAIOps, RAG, fine-tuning</li>
                <li>• Azure ML, Foundry, GitHub Actions</li>
                <li>• Expert-level difficulty</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Our Approach */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8">Our Approach</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4 bg-gray-900 border border-gray-800 rounded-xl p-5">
              <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">1</span>
              </div>
              <div>
                <h3 className="font-bold text-white mb-1">Official Sources Only</h3>
                <p className="text-gray-400 text-sm">Questions mapped to current IIBF syllabus and Microsoft Learn study guides. Explanations reference RBI circulars, Master Directions, and Azure documentation.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 bg-gray-900 border border-gray-800 rounded-xl p-5">
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">2</span>
              </div>
              <div>
                <h3 className="font-bold text-white mb-1">AI That Teaches, Not Just Answers</h3>
                <p className="text-gray-400 text-sm">Our AI doesn't just say "B is correct." It explains why B is correct, why A/C/D are wrong, and gives you a real-world scenario to cement the concept.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 bg-gray-900 border border-gray-800 rounded-xl p-5">
              <div className="w-8 h-8 bg-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">3</span>
              </div>
              <div>
                <h3 className="font-bold text-white mb-1">Community-Driven Quality</h3>
                <p className="text-gray-400 text-sm">Users can report incorrect questions, discuss answers, and share alternative reasoning. The community helps maintain accuracy.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Get in Touch</h2>
          <p className="text-gray-400 mb-8">Have questions, feedback, or want to contribute questions? We'd love to hear from you.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:support@mockmaster.fun"
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition"
            >
              📧 support@mockmaster.fun
            </a>
            <button
              onClick={() => navigate('/contact')}
              className="px-6 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold rounded-xl transition"
            >
              Contact Form
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

export default AboutPage;
