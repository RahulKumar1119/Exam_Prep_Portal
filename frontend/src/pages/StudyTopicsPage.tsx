import React from 'react';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';

const StudyTopicsPage: React.FC = () => {
  const navigate = useNavigate();

  const ppbTopics = [
    { title: 'CRR Explained', path: '/jaiib/ppb/crr-explained' },
    { title: 'SLR Explained', path: '/jaiib/ppb/slr-explained' },
    { title: 'NPA Classification', path: '/jaiib/ppb/npa-classification' },
    { title: 'Priority Sector Lending', path: '/jaiib/ppb/priority-sector-lending' },
    { title: 'SARFAESI Act', path: '/jaiib/ppb/sarfaesi-act' },
    { title: 'KYC Norms', path: '/jaiib/ppb/kyc-norms' },
    { title: 'Negotiable Instruments Act', path: '/jaiib/ppb/negotiable-instruments-act' },
    { title: 'Basel Norms', path: '/jaiib/ppb/basel-norms' },
    { title: 'Deposit Insurance (DICGC)', path: '/jaiib/ppb/deposit-insurance-dicgc' },
    { title: 'Repo Rate Explained', path: '/jaiib/ppb/repo-rate-explained' },
    { title: 'UPI & Payment Systems', path: '/jaiib/ppb/upi-payments-system' },
  ];

  const afmTopics = [
    { title: 'NPV & IRR Explained', path: '/jaiib/afm/npv-irr-explained' },
    { title: 'Break-Even Analysis', path: '/jaiib/afm/break-even-analysis' },
    { title: 'Depreciation Methods', path: '/jaiib/afm/depreciation-methods' },
    { title: 'Ratio Analysis', path: '/jaiib/afm/ratio-analysis' },
  ];

  const rbwmTopics = [
    { title: 'Mutual Funds Guide', path: '/jaiib/rbwm/mutual-funds-guide' },
    { title: 'Home Loan Guide', path: '/jaiib/rbwm/home-loan-guide' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="JAIIB Study Topics — Free Notes & Guides for All Papers | MockMaster"
        description="Comprehensive JAIIB study topic guides covering PPB, AFM, and RBWM papers. Free notes, formulas, and exam-focused explanations for banking professionals."
        canonical="https://mockmaster.fun/study-topics"
        keywords="JAIIB study notes, PPB topics, AFM formulas, RBWM guide"
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
              onClick={() => navigate('/study-topics')}
              className="px-2 sm:px-6 py-2 text-xs sm:text-sm text-gray-700 font-medium hover:text-gray-900 transition hidden sm:block"
            >
              Study Topics
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
      <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-4">
            JAIIB Study Topics
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Comprehensive topic guides for all three JAIIB papers. Free notes, formulas, and exam-focused explanations to help you pass.
          </p>
        </div>
      </section>

      {/* Topic Cards Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">

          {/* PPB Card */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
              <h2 className="text-white font-bold text-lg">PPB — Principles & Practices of Banking</h2>
              <p className="text-blue-100 text-sm mt-1">{ppbTopics.length} Topics</p>
            </div>
            <div className="p-4">
              <ul className="space-y-1">
                {ppbTopics.map((topic) => (
                  <li key={topic.path}>
                    <button
                      onClick={() => navigate(topic.path)}
                      className="w-full flex items-center justify-between px-3 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition group"
                    >
                      <span>{topic.title}</span>
                      <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* AFM Card */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4">
              <h2 className="text-white font-bold text-lg">AFM — Accounting & Financial Management</h2>
              <p className="text-purple-100 text-sm mt-1">{afmTopics.length} Topics</p>
            </div>
            <div className="p-4">
              <ul className="space-y-1">
                {afmTopics.map((topic) => (
                  <li key={topic.path}>
                    <button
                      onClick={() => navigate(topic.path)}
                      className="w-full flex items-center justify-between px-3 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded-lg transition group"
                    >
                      <span>{topic.title}</span>
                      <svg className="w-4 h-4 text-gray-400 group-hover:text-purple-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* RBWM Card */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-pink-600 to-pink-700 px-6 py-4">
              <h2 className="text-white font-bold text-lg">RBWM — Retail Banking & Wealth Management</h2>
              <p className="text-pink-100 text-sm mt-1">{rbwmTopics.length} Topics</p>
            </div>
            <div className="p-4">
              <ul className="space-y-1">
                {rbwmTopics.map((topic) => (
                  <li key={topic.path}>
                    <button
                      onClick={() => navigate(topic.path)}
                      className="w-full flex items-center justify-between px-3 py-2.5 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-700 rounded-lg transition group"
                    >
                      <span>{topic.title}</span>
                      <svg className="w-4 h-4 text-gray-400 group-hover:text-pink-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* More topics note */}
        <div className="max-w-6xl mx-auto mt-8 text-center">
          <p className="text-gray-500 text-sm italic">More topics coming soon</p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Ready to Test Your Knowledge?
          </h2>
          <p className="text-blue-100 text-lg mb-8">
            Practice with 3000+ questions and AI-powered explanations to pass JAIIB in your first attempt.
          </p>
          <button
            onClick={() => navigate('/practice-tests')}
            className="px-8 py-3 bg-white text-blue-700 font-semibold rounded-lg hover:bg-blue-50 transition shadow-lg"
          >
            Start Practice Tests
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">JC</span>
            </div>
            <span className="text-white font-semibold">MockMaster</span>
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <button onClick={() => navigate('/about')} className="hover:text-white transition">About</button>
            <button onClick={() => navigate('/contact')} className="hover:text-white transition">Contact</button>
            <button onClick={() => navigate('/privacy-policy')} className="hover:text-white transition">Privacy Policy</button>
            <button onClick={() => navigate('/terms-of-service')} className="hover:text-white transition">Terms</button>
            <button onClick={() => navigate('/disclaimer')} className="hover:text-white transition">Disclaimer</button>
          </div>
          <p className="text-sm">&copy; {new Date().getFullYear()} MockMaster. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default StudyTopicsPage;
