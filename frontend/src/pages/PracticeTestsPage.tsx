import React from 'react';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';

const PAPERS = [
  {
    slug: 'ie-ifs',
    name: 'IE & IFS',
    fullName: 'Indian Economy & Indian Financial System',
    questions: '1068+',
    rating: 4.8,
    reviews: 142,
    color: 'blue',
    modules: ['Indian Economic Architecture', 'Economic Concepts Related to Banking', 'Indian Financial Architecture', 'Financial Products and Services'],
    highlights: ['RBI Monetary Policy & Functions', 'Banking Regulation Act 1949', 'SEBI & Financial Markets', 'Digital Banking & UPI'],
  },
  {
    slug: 'ppb',
    name: 'PPB',
    fullName: 'Principles & Practices of Banking',
    questions: '760+',
    rating: 4.9,
    reviews: 128,
    color: 'indigo',
    modules: ['General Banking Operations', 'Functions of Banks', 'Banking Technology', 'Ethics in Banking'],
    highlights: ['KYC & AML Norms', 'NPA Classification & IRAC', 'NI Act & Cheque Truncation', 'Digital Lending Guidelines'],
  },
  {
    slug: 'afm',
    name: 'AFM',
    fullName: 'Accounting & Financial Management for Bankers',
    questions: '1195+',
    rating: 4.7,
    reviews: 96,
    color: 'purple',
    modules: ['Accounting Principles & Processes', 'Financial Statements & Core Banking', 'Financial Management', 'Taxation & Costing'],
    highlights: ['NPV, IRR & Capital Budgeting', 'Ratio Analysis & BRS', 'TDS & GST Provisions', 'Break-Even Analysis'],
  },
  {
    slug: 'rbwm',
    name: 'RBWM',
    fullName: 'Retail Banking & Wealth Management',
    questions: '635+',
    rating: 4.8,
    reviews: 74,
    color: 'pink',
    modules: ['Retail Banking', 'Retail Products & Recovery', 'Marketing of Banking Services', 'Wealth Management'],
    highlights: ['Home & Auto Loans', 'Mutual Funds & Insurance', 'CRM & Digital Marketing', 'Financial Planning & Tax'],
  },
];

const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex items-center gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <span key={star} className={star <= Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}>★</span>
    ))}
    <span className="text-sm font-medium text-gray-700 ml-1">{rating}</span>
  </div>
);

// Store listing page
const PracticeTestsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="JAIIB Practice Tests 2026 — Free Mock Tests for All Papers"
        description="3000+ free JAIIB practice questions for IE&IFS, PPB, AFM, RBWM. AI-powered explanations with RBI circular references. Updated for 2026 syllabus."
        canonical="https://mockmaster.fun/practice-tests"
        keywords="JAIIB practice test free, JAIIB mock test online, IE IFS practice questions, PPB mock test, AFM questions"
      />
      {/* Nav */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">JC</span>
            </div>
            <span className="text-xl font-bold text-gray-900">JAIIB-CAIIB Prep</span>
          </div>
          <div className="flex gap-4">
            <button onClick={() => navigate('/login')} className="px-6 py-2 text-gray-700 font-medium hover:text-gray-900 transition">Login</button>
            <button onClick={() => navigate('/register')} className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition">Sign Up</button>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">JAIIB Practice Tests 2026</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            AI-powered practice questions with detailed explanations citing RBI circulars and IIBF textbook references. Updated for the latest syllabus.
          </p>
          <div className="flex items-center justify-center gap-6 mt-6 text-sm text-gray-600">
            <span>✅ 3,400+ Questions</span>
            <span>✅ AI Explanations</span>
            <span>✅ No Negative Marking</span>
            <span>✅ Lifetime Access</span>
          </div>
        </div>
      </section>

      {/* Paper Cards */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {PAPERS.map((paper) => (
              <div
                key={paper.slug}
                onClick={() => navigate(`/practice-tests/${paper.slug}`)}
                className="bg-white rounded-2xl border border-gray-200 shadow-md hover:shadow-xl transition-all cursor-pointer overflow-hidden group"
              >
                {/* Card Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white">{paper.name}</h3>
                      <p className="text-blue-100 text-sm">{paper.fullName}</p>
                    </div>
                    <span className="bg-white bg-opacity-20 text-white text-sm font-semibold px-3 py-1 rounded-full">
                      {paper.questions} Qs
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  {/* Rating */}
                  <div className="flex items-center justify-between mb-4">
                    <StarRating rating={paper.rating} />
                    <span className="text-sm text-gray-500">({paper.reviews} reviews)</span>
                  </div>

                  {/* Modules */}
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Modules Covered</p>
                    <div className="flex flex-wrap gap-2">
                      {paper.modules.map((mod) => (
                        <span key={mod} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          {mod}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Key Topics</p>
                    <ul className="grid grid-cols-2 gap-1 text-sm text-gray-600">
                      {paper.highlights.map((h) => (
                        <li key={h} className="flex items-center gap-1">
                          <span className="text-green-500 text-xs">✓</span> {h}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <span className="text-2xl font-bold text-gray-900">Free</span>
                      <span className="text-sm text-gray-500 ml-2">with signup</span>
                    </div>
                    <span className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg group-hover:bg-blue-700 transition text-sm">
                      View Details →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">What You Get</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: '🤖', title: 'AI Explanations', desc: 'Every question explained with RBI circular & IIBF textbook references' },
              { icon: '📊', title: 'Performance Analytics', desc: 'Track weak areas, score trends, and module-wise accuracy' },
              { icon: '⏱️', title: 'Mock Test Mode', desc: 'Full 2-hour, 100-question exam simulation with real weightage' },
              { icon: '🔄', title: 'Unlimited Attempts', desc: 'Practice as many times as you want with fresh question sets' },
            ].map((f) => (
              <div key={f.title} className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-200">
                <span className="text-3xl block mb-3">{f.icon}</span>
                <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Start Practicing Today</h2>
          <p className="text-blue-100 mb-8">Join thousands of bank officers who cleared JAIIB using MockMaster</p>
          <button onClick={() => navigate('/register')} className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition">
            Sign Up Free →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center text-sm">
          <p>&copy; 2024 MockMaster. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default PracticeTestsPage;
