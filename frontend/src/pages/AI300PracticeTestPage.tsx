import React from 'react';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';

const AI300PracticeTestPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="AI-300 Practice Test 2026 — Free Microsoft ML & GenAI Certification Prep"
        description="Free AI-300 practice questions for Microsoft Certified: Operationalizing Machine Learning & Generative AI Solutions. Covers Azure ML, MLOps, model deployment, RAG, prompt engineering, and monitoring."
        canonical="https://mockmaster.fun/ai-300-practice-test"
        keywords="AI-300 practice test, AI-300 exam questions, Microsoft AI-300, Azure ML certification, MLOps certification, GenAI certification, AI-300 mock test free"
      />

      {/* Nav */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm sm:text-lg">JC</span>
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
      <section className="bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 text-xs font-semibold px-3 py-1 rounded-full mb-4">
            <span>Microsoft Certification</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            AI-300: Operationalizing Machine Learning & Generative AI Solutions
          </h1>
          <p className="text-base sm:text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            Free practice questions covering Azure ML, MLOps pipelines, model deployment, RAG patterns, prompt engineering, and AI solution monitoring. Aligned with the official Microsoft study guide.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => navigate('/register')} className="px-8 py-3.5 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition shadow-lg shadow-purple-200">
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
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">About the AI-300 Exam</h2>
          <div className="prose prose-lg text-gray-700 leading-relaxed space-y-4">
            <p>
              The <strong>AI-300</strong> (Operationalizing Machine Learning and Generative AI Solutions) is a Microsoft certification exam for professionals who design, deploy, and manage ML and GenAI solutions on Azure. It validates skills in MLOps, model lifecycle management, and production AI systems.
            </p>

            <div className="overflow-x-auto my-6">
              <table className="min-w-full border border-gray-200 rounded-lg text-sm">
                <tbody>
                  <tr className="border-b"><td className="px-4 py-3 font-medium text-gray-900 bg-gray-50 w-40">Exam Code</td><td className="px-4 py-3">AI-300</td></tr>
                  <tr className="border-b"><td className="px-4 py-3 font-medium text-gray-900 bg-gray-50">Full Name</td><td className="px-4 py-3">Operationalizing Machine Learning and Generative AI Solutions</td></tr>
                  <tr className="border-b"><td className="px-4 py-3 font-medium text-gray-900 bg-gray-50">Provider</td><td className="px-4 py-3">Microsoft</td></tr>
                  <tr className="border-b"><td className="px-4 py-3 font-medium text-gray-900 bg-gray-50">Prerequisite</td><td className="px-4 py-3">None (AI-102 or Azure ML experience recommended)</td></tr>
                  <tr className="border-b"><td className="px-4 py-3 font-medium text-gray-900 bg-gray-50">Question Format</td><td className="px-4 py-3">Multiple choice, case studies, drag-and-drop, hot area</td></tr>
                  <tr className="border-b"><td className="px-4 py-3 font-medium text-gray-900 bg-gray-50">Passing Score</td><td className="px-4 py-3">700 out of 1000</td></tr>
                  <tr className="border-b"><td className="px-4 py-3 font-medium text-gray-900 bg-gray-50">Duration</td><td className="px-4 py-3">120 minutes</td></tr>
                  <tr><td className="px-4 py-3 font-medium text-gray-900 bg-gray-50">Exam Fee</td><td className="px-4 py-3">$165 USD</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Syllabus */}
      <section id="syllabus" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">AI-300 Exam Topics (Skills Measured)</h2>

          <div className="space-y-5">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-purple-800">Design and Plan AI Solutions</h3>
                <span className="text-sm font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded">15-20%</span>
              </div>
              <p className="text-sm text-gray-700">Azure AI services architecture, solution requirements analysis, responsible AI principles, cost optimization, Azure OpenAI Service planning, model selection strategy, compute and infrastructure planning, security and compliance for AI.</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-blue-800">Design and Manage Data Pipelines</h3>
                <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">20-25%</span>
              </div>
              <p className="text-sm text-gray-700">Data ingestion pipeline design, feature engineering, data validation and quality, Azure Data Factory for ML, data versioning and lineage, real-time vs batch processing, data labeling and annotation, Azure Databricks integration.</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-indigo-800">Design and Manage Model Training</h3>
                <span className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">20-25%</span>
              </div>
              <p className="text-sm text-gray-700">Azure Machine Learning workspace, training compute management, hyperparameter tuning, Automated ML (AutoML), distributed training, model evaluation and validation, MLflow experiment tracking, fine-tuning foundation models, prompt engineering for GenAI, RAG pattern implementation.</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-green-800">Design and Manage Deployment Infrastructure</h3>
                <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">20-25%</span>
              </div>
              <p className="text-sm text-gray-700">Model deployment strategies, Azure ML managed endpoints, real-time vs batch inference, model packaging and containerization, blue-green and canary deployments, auto-scaling inference endpoints, Azure Kubernetes Service for ML, edge deployment with ONNX.</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-orange-800">Monitor and Maintain AI Solutions</h3>
                <span className="text-sm font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded">10-15%</span>
              </div>
              <p className="text-sm text-gray-700">Model monitoring and drift detection, data drift vs concept drift, Azure ML model monitoring, logging and alerting for AI systems, model retraining triggers, A/B testing for models, cost monitoring for AI workloads, incident response for AI failures.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Who Should Take This */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Who Should Take AI-300?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
              <h4 className="font-bold text-gray-900 mb-2">ML Engineers & MLOps Engineers</h4>
              <p className="text-sm text-gray-600">Professionals building and deploying ML pipelines on Azure who want to validate their production ML skills.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
              <h4 className="font-bold text-gray-900 mb-2">AI Solution Architects</h4>
              <p className="text-sm text-gray-600">Those designing end-to-end AI systems including data pipelines, training infrastructure, and deployment strategies.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
              <h4 className="font-bold text-gray-900 mb-2">Data Scientists Moving to Production</h4>
              <p className="text-sm text-gray-600">Data scientists transitioning from notebooks to production-grade ML systems with monitoring and governance.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
              <h4 className="font-bold text-gray-900 mb-2">GenAI/LLM Practitioners</h4>
              <p className="text-sm text-gray-600">Engineers working with Azure OpenAI, RAG patterns, fine-tuning, and prompt engineering in enterprise environments.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-600 to-indigo-600">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Practice AI-300 Questions Free</h2>
          <p className="text-purple-100 mb-8">AI-powered explanations for every question. Track your progress across all exam domains.</p>
          <button onClick={() => navigate('/register')} className="px-8 py-4 bg-white text-purple-600 font-semibold rounded-lg hover:bg-gray-100 transition shadow-lg">
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
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/blog" className="hover:text-white transition">Blog</a></li>
                <li><a href="/study-topics" className="hover:text-white transition">Study Topics</a></li>
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
            <p>&copy; 2026 MockMaster. All rights reserved. Microsoft, Azure, and AI-300 are trademarks of Microsoft Corporation.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AI300PracticeTestPage;
