import React from 'react';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';

const CAPMPracticeTestPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="CAPM Practice Test 2026 — Free PMI CAPM Certification Prep"
        description="Free CAPM practice questions for PMI Certified Associate in Project Management. Covers fundamentals, predictive, agile, and business analysis domains with scenario-based questions."
        canonical="https://mockmaster.fun/capm-practice-test"
        keywords="CAPM practice test, CAPM exam questions, PMI CAPM, CAPM certification free, CAPM mock test, project management certification"
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
      <section className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-800 text-xs font-semibold px-3 py-1 rounded-full mb-4">
            <span>PMI Certification</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            CAPM: Certified Associate in Project Management
          </h1>
          <p className="text-base sm:text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            Free practice questions covering project management fundamentals, predictive and agile methodologies, and business analysis. Scenario-based items aligned with the official PMI Exam Content Outline.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => navigate('/register')} className="px-8 py-3.5 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition shadow-lg shadow-orange-200">
              Start Practicing Free
            </button>
            <a href="#syllabus" className="px-8 py-3.5 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-gray-400 transition">
              View Full Syllabus
            </a>
          </div>
        </div>
      </section>

      {/* Exam Overview */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">About the CAPM Exam</h2>
          <div className="prose prose-lg text-gray-700 leading-relaxed space-y-4">
            <p>
              The <strong>CAPM</strong> (Certified Associate in Project Management) is PMI's entry-level credential for students, career changers, and coordinators who want into project work but can't sit the PMP yet. It validates foundational knowledge across predictive, agile, and business analysis ways of working.
            </p>

            <div className="overflow-x-auto my-6">
              <table className="min-w-full border border-gray-200 rounded-lg text-sm">
                <tbody>
                  <tr className="border-b"><td className="px-4 py-3 font-medium text-gray-900 bg-gray-50 w-40">Exam Code</td><td className="px-4 py-3">CAPM</td></tr>
                  <tr className="border-b"><td className="px-4 py-3 font-medium text-gray-900 bg-gray-50">Full Name</td><td className="px-4 py-3">Certified Associate in Project Management</td></tr>
                  <tr className="border-b"><td className="px-4 py-3 font-medium text-gray-900 bg-gray-50">Provider</td><td className="px-4 py-3">PMI (Project Management Institute)</td></tr>
                  <tr className="border-b"><td className="px-4 py-3 font-medium text-gray-900 bg-gray-50">Prerequisite</td><td className="px-4 py-3">Secondary degree + 23 contact hours of PM education</td></tr>
                  <tr className="border-b"><td className="px-4 py-3 font-medium text-gray-900 bg-gray-50">Question Format</td><td className="px-4 py-3">150 questions (135 scored) — multiple choice, matching, hot-spot; largely scenario-based</td></tr>
                  <tr className="border-b"><td className="px-4 py-3 font-medium text-gray-900 bg-gray-50">Duration</td><td className="px-4 py-3">180 minutes + 10-min break after Q75</td></tr>
                  <tr><td className="px-4 py-3 font-medium text-gray-900 bg-gray-50">Exam Fee</td><td className="px-4 py-3">~$225 (PMI member) / ~$300 (non-member)</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Syllabus */}
      <section id="syllabus" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">CAPM Exam Domains (ECO)</h2>

          <div className="space-y-5">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-orange-800">Project Management Fundamentals and Core Concepts</h3>
                <span className="text-sm font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded">36%</span>
              </div>
              <p className="text-sm text-gray-700">How projects create value; project vs program vs portfolio; predictive vs adaptive; org structures and PMO; PM/team roles; life-cycle phases; artifacts and documents; risk vs issue vs assumption vs constraint; risk and stakeholder registers.</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-blue-800">Business Analysis Frameworks</h3>
                <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">27%</span>
              </div>
              <p className="text-sm text-gray-700">Requirements elicitation and documentation; stakeholder identification and analysis; requirements traceability (RTM); validation against business needs; acceptance-criteria logic; "what should you do next?" scenarios.</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-green-800">Agile Frameworks/Methodologies</h3>
                <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">20%</span>
              </div>
              <p className="text-sm text-gray-700">Agile mindset and values; when adaptive delivery fits; Scrum roles, events, artifacts; Kanban boards and WIP limits; backlog prioritization; iterative delivery and feedback.</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-purple-800">Predictive, Plan-Based Methodologies</h3>
                <span className="text-sm font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded">17%</span>
              </div>
              <p className="text-sm text-gray-700">When predictive is appropriate; WBS and work packages; scope decomposition; critical-path basics; schedule dependencies; schedule/cost variance interpretation; baselines and controls.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Who Should Take This */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Who Should Take CAPM?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
              <h4 className="font-bold text-gray-900 mb-2">Students & Recent Graduates</h4>
              <p className="text-sm text-gray-600">Stand out to employers with a globally recognized PMI credential before you have the experience for the PMP.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
              <h4 className="font-bold text-gray-900 mb-2">Career Changers</h4>
              <p className="text-sm text-gray-600">Moving into project work from another field — CAPM proves you speak the language of delivery.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
              <h4 className="font-bold text-gray-900 mb-2">Project Coordinators & Team Members</h4>
              <p className="text-sm text-gray-600">Coordinators who move work along without formally leading it — validate your contribution.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
              <h4 className="font-bold text-gray-900 mb-2">Future PMP Candidates</h4>
              <p className="text-sm text-gray-600">Build the foundation now; the CAPM maps directly onto the senior PMP credential later.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-orange-600 to-amber-600">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Practice CAPM Questions Free</h2>
          <p className="text-orange-100 mb-8">225 scenario-based questions across all four ECO domains. 75-question sets with instant explanations.</p>
          <button onClick={() => navigate('/register')} className="px-8 py-4 bg-white text-orange-600 font-semibold rounded-lg hover:bg-gray-100 transition shadow-lg">
            Create Free Account
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="text-white font-bold mb-4">Exams</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/practice-tests" className="hover:text-white transition">JAIIB Practice Tests</a></li>
                <li><a href="/ai-300-practice-test" className="hover:text-white transition">AI-300 Practice Test</a></li>
                <li><a href="/capm-practice-test" className="hover:text-white transition">CAPM Practice Test</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/blog" className="hover:text-white transition">Blog</a></li>
                <li><a href="/blog/capm-exam-complete-guide-2026" className="hover:text-white transition">CAPM Complete Guide</a></li>
                <li><a href="/faq" className="hover:text-white transition">FAQ</a></li>
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
            <p>&copy; 2026 MockMaster. All rights reserved. PMI and CAPM are registered marks of the Project Management Institute, Inc.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CAPMPracticeTestPage;
