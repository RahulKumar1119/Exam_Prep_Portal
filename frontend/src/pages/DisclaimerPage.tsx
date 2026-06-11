import React from 'react';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-8">
    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">{title}</h2>
    <div className="text-gray-600 dark:text-gray-400 space-y-2 leading-relaxed">{children}</div>
  </div>
);

const DisclaimerPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <SEO
        title="Disclaimer | MockMaster"
        description="MockMaster is for educational and informational purposes only. Not affiliated with IIBF or RBI. Read our full disclaimer."
        canonical="https://mockmaster.fun/disclaimer"
      />

      {/* Navigation Bar */}
      <nav className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm sm:text-lg">JC</span>
            </div>
            <span className="text-base sm:text-xl font-bold text-gray-900 dark:text-gray-100 hidden sm:block">JAIIB-CAIIB Prep</span>
            <span className="text-base font-bold text-gray-900 dark:text-gray-100 sm:hidden">MockMaster</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-4">
            <button
              onClick={() => navigate('/practice-tests')}
              className="px-2 sm:px-6 py-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-medium hover:text-gray-900 dark:hover:text-white transition hidden sm:block"
            >
              Practice Tests
            </button>
            <button
              onClick={() => navigate('/blog')}
              className="px-2 sm:px-6 py-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-medium hover:text-gray-900 dark:hover:text-white transition hidden md:block"
            >
              Blog
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-3 sm:px-6 py-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-medium hover:text-gray-900 dark:hover:text-white transition"
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

      {/* Content */}
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow p-8 border border-gray-200 dark:border-gray-700">
          <button
            onClick={() => navigate('/')}
            className="text-sm text-blue-600 hover:underline mb-6 inline-block"
          >
            ← Back to Home
          </button>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">Disclaimer</h1>

          <Section title="Educational Purpose Only">
            <p>
              MockMaster (mockmaster.fun) is designed solely for educational and informational purposes. The content on this platform is intended to assist banking professionals in preparing for JAIIB and CAIIB examinations.
            </p>
            <p>
              This platform is not a substitute for official IIBF study material, prescribed textbooks, or authoritative RBI publications. Users should always refer to official sources for the most accurate and up-to-date information.
            </p>
          </Section>

          <Section title="Content Accuracy">
            <p>
              While we strive to ensure the accuracy of all questions, explanations, and reference material on MockMaster, we cannot guarantee that all information is completely error-free or current.
            </p>
            <p>
              Banking regulations, RBI circulars, and IIBF syllabus content change frequently. Always verify critical information with official RBI and IIBF sources before relying on it for professional or examination purposes.
            </p>
          </Section>

          <Section title="No Guarantee of Results">
            <p>
              Using MockMaster does not guarantee passing JAIIB, CAIIB, or any other banking examination. Exam success depends on individual study effort, preparation strategy, and a variety of other factors beyond the scope of this platform.
            </p>
          </Section>

          <Section title="Third-Party References">
            <p>
              MockMaster references RBI circulars, IIBF textbooks, banking Acts, and other regulatory documents for educational purposes only. These references are provided to help users understand the source and context of examination topics.
            </p>
            <p>
              All trademarks, service marks, trade names, and logos mentioned on this platform belong to their respective owners. Their use here does not imply endorsement or affiliation.
            </p>
          </Section>

          <Section title="AI-Generated Content">
            <p>
              Explanations and supplementary content on MockMaster are generated using AI technology. While we review AI-generated content for accuracy and relevance, AI can occasionally produce errors, outdated information, or incomplete explanations.
            </p>
            <p>
              Users are encouraged to cross-reference AI explanations with official study material. If you notice any inaccuracies, please report them via our contact form so we can review and correct the content promptly.
            </p>
          </Section>

          <Section title="Not Affiliated">
            <p>
              MockMaster is an independent educational platform. It is not affiliated with, endorsed by, or officially connected to the Indian Institute of Banking & Finance (IIBF), the Reserve Bank of India (RBI), or any bank or financial institution.
            </p>
          </Section>

          <Section title="Changes to Content">
            <p>
              We reserve the right to update, modify, or remove any content on this platform at any time without prior notice. This includes questions, explanations, practice sets, and any other material available on MockMaster.
            </p>
          </Section>

          <Section title="Contact">
            <p>
              For concerns about content accuracy or to report errors, please contact us at:{' '}
              <a href="mailto:support@mockmaster.fun" className="text-blue-600 hover:underline">
                support@mockmaster.fun
              </a>
            </p>
          </Section>
        </div>
      </div>

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
                <li><a href="/disclaimer" className="hover:text-white transition font-medium text-gray-200">Disclaimer</a></li>
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

export default DisclaimerPage;
