import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">JC</span>
            </div>
            <span className="text-xl font-bold text-gray-900">JAIIB-CAIIB Prep</span>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-2 text-gray-700 font-medium hover:text-gray-900 transition"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/register')}
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
            >
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Master JAIIB & CAIIB Exams
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Prepare for your banking exams with AI-powered practice sets, expert explanations, and personalized learning paths. Join thousands of successful candidates.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate('/register')}
                  className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition transform hover:scale-105"
                >
                  Start Free Trial
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="px-8 py-4 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition"
                >
                  Login to Account
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-6">✓ No credit card required • ✓ Free access to 100+ questions</p>
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
      <section className="bg-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-4xl font-bold text-blue-600 mb-2">50K+</p>
              <p className="text-gray-600">Active Students</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-indigo-600 mb-2">95%</p>
              <p className="text-gray-600">Success Rate</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-purple-600 mb-2">1000+</p>
              <p className="text-gray-600">Practice Questions</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-pink-600 mb-2">4.8★</p>
              <p className="text-gray-600">Average Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Us?</h2>
            <p className="text-xl text-gray-600">Everything you need to ace your banking exams</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition">
              <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Adaptive Learning</h3>
              <p className="text-gray-600">
                Our AI adapts to your learning pace, focusing on weak areas to maximize your score improvement.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition">
              <div className="w-14 h-14 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-3xl">💡</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Expert Explanations</h3>
              <p className="text-gray-600">
                Get detailed explanations for every question with RBI and IIBF references to deepen your understanding.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition">
              <div className="w-14 h-14 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-3xl">📈</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Performance Tracking</h3>
              <p className="text-gray-600">
                Monitor your progress with detailed analytics, score trends, and personalized recommendations.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition">
              <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-3xl">⏱️</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Timed Practice</h3>
              <p className="text-gray-600">
                Practice under exam conditions with realistic time limits to build speed and accuracy.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition">
              <div className="w-14 h-14 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-3xl">📱</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Mobile Friendly</h3>
              <p className="text-gray-600">
                Study anytime, anywhere with our fully responsive platform optimized for all devices.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition">
              <div className="w-14 h-14 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-3xl">🏆</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Proven Results</h3>
              <p className="text-gray-600">
                Join thousands of successful candidates who passed their exams using our platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Papers Section */}
      <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Exam Papers Covered</h2>
            <p className="text-xl text-gray-600">Comprehensive practice for all JAIIB papers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-8 border-2 border-blue-200">
              <h3 className="text-2xl font-bold text-blue-900 mb-3">IE & IFS</h3>
              <p className="text-blue-800 mb-4">Indian Economy & International Financial System</p>
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
              <h3 className="text-2xl font-bold text-purple-900 mb-3">AFB</h3>
              <p className="text-purple-800 mb-4">Advanced Financial Banking</p>
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-white font-bold mb-4">About</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">About Us</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Features</a></li>
                <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Follow Us</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition">Facebook</a></li>
                <li><a href="#" className="hover:text-white transition">LinkedIn</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2024 JAIIB-CAIIB Prep. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
