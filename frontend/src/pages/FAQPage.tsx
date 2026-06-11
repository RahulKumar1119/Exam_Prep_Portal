import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSection {
  title: string;
  icon: string;
  items: FAQItem[];
}

const FAQPage: React.FC = () => {
  const navigate = useNavigate();
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggleItem = (sectionIndex: number, itemIndex: number) => {
    const key = `${sectionIndex}-${itemIndex}`;
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const faqSections: FAQSection[] = [
    {
      title: 'About JAIIB Exam',
      icon: '🏦',
      items: [
        {
          question: 'What is JAIIB and who conducts it?',
          answer:
            'JAIIB stands for Junior Associate of the Indian Institute of Bankers. It is conducted by the Indian Institute of Banking & Finance (IIBF). It is an entry-level professional certification for bank employees aimed at improving their knowledge of banking and financial services.',
        },
        {
          question: 'How many papers are in JAIIB 2026?',
          answer:
            'JAIIB 2026 has 4 compulsory papers: Indian Economy & Indian Financial System (IE&IFS), Principles & Practices of Banking (PPB), Accounting & Financial Management for Bankers (AFM), and Retail Banking & Wealth Management (RBWM).',
        },
        {
          question: 'What is the passing criteria for JAIIB?',
          answer:
            'You need to score a minimum of 50 out of 100 marks in each paper to pass. There is no aggregate passing criteria — each paper must be individually cleared.',
        },
        {
          question: 'How many attempts do I get for JAIIB?',
          answer:
            'You get a maximum of 4 consecutive attempts to clear all papers. If you fail to clear all papers within these attempts, you need to re-register and start fresh.',
        },
        {
          question: 'Is there negative marking in JAIIB?',
          answer:
            'No, there is no negative marking in JAIIB. Each correct answer carries 1 mark and there is no penalty for wrong answers. So it is always advisable to attempt all questions.',
        },
        {
          question: 'What is the exam pattern and marking scheme?',
          answer:
            'Each JAIIB paper consists of 100 multiple-choice questions (MCQs) to be completed in 2 hours. Each correct answer carries 1 mark, with no negative marking. The total marks for each paper is 100.',
        },
        {
          question: 'When are JAIIB exams held?',
          answer:
            'IIBF typically conducts JAIIB exams twice a year — once around May/June and once around November/December. The exact dates are announced on the IIBF website. Candidates should regularly check iibf.org.in for notification updates.',
        },
        {
          question: 'What is the validity period for passing all papers?',
          answer:
            'You must pass all 4 papers within 2 years (4 consecutive attempts) from the date of your first attempt. Papers cleared within this window remain valid. If you exceed this period, you need to re-register and clear all papers again.',
        },
      ],
    },
    {
      title: 'About CAIIB Exam',
      icon: '🎓',
      items: [
        {
          question: 'What is CAIIB and how is it different from JAIIB?',
          answer:
            'CAIIB stands for Certified Associate of the Indian Institute of Bankers. It is an advanced-level certification conducted by IIBF. While JAIIB covers foundational banking knowledge, CAIIB focuses on advanced concepts in banking management, technology, and specialized subjects. CAIIB holders get a higher increment and priority in promotions compared to JAIIB holders.',
        },
        {
          question: 'Can I attempt CAIIB without clearing JAIIB?',
          answer:
            'No, clearing JAIIB (or its equivalent — Part I of the Associate Examination) is a prerequisite for registering for CAIIB. You must have passed all JAIIB papers before you can apply for CAIIB.',
        },
        {
          question: 'How many papers are in CAIIB?',
          answer:
            'CAIIB has 3 compulsory papers: Advanced Bank Management (ABM), Bank Financial Management (BFM), and one elective paper chosen from options like Rural Banking, Information Technology, or Human Resource Management among others.',
        },
      ],
    },
    {
      title: 'About MockMaster Platform',
      icon: '💻',
      items: [
        {
          question: 'Is MockMaster really free?',
          answer:
            'Yes, MockMaster is 100% free to use. There are no hidden charges, premium tiers, or credit card requirements. All features including practice tests, AI explanations, and performance analytics are available to every user at no cost.',
        },
        {
          question: 'How many questions does MockMaster have?',
          answer:
            'MockMaster currently has 3000+ questions covering all JAIIB papers — IE&IFS, PPB, AFM, and RBWM. We regularly add new questions to keep the question bank fresh and comprehensive. Our goal is to cover every topic in the IIBF syllabus thoroughly.',
        },
        {
          question: 'What are AI explanations?',
          answer:
            'AI explanations are detailed, auto-generated explanations for each question that cite official sources like RBI Master Circulars, Master Directions, Banking Regulation Act, NI Act, and IIBF textbooks. They help you understand not just the correct answer, but the reasoning and legal/regulatory basis behind it.',
        },
        {
          question: 'Do I need to create an account to practice?',
          answer:
            'You can try a free quiz without creating an account. However, to access the full question bank, track your progress, and get personalized analytics, you need to create a free account. Registration only takes a minute.',
        },
        {
          question: 'How is MockMaster different from other platforms?',
          answer:
            'MockMaster stands out in three key ways: (1) It is completely free with no premium walls, (2) Every question has AI-generated explanations citing official RBI and IIBF sources, and (3) It offers adaptive practice that focuses on your weak areas. Most other platforms either charge fees or provide generic explanations without citing sources.',
        },
        {
          question: 'Can I practice on mobile?',
          answer:
            'Yes! MockMaster is fully responsive and works seamlessly on all devices — mobile phones, tablets, and desktops. You can practice on the go during your commute or breaks without needing to download any app.',
        },
        {
          question: 'How often is content updated?',
          answer:
            'We update our content regularly — whenever RBI issues new circulars or Master Directions, when IIBF updates the syllabus, or when banking regulations change. We also add new questions every week to expand our question bank.',
        },
      ],
    },
    {
      title: 'Salary & Career',
      icon: '💰',
      items: [
        {
          question: 'What increment do I get after JAIIB?',
          answer:
            'After clearing JAIIB, you receive one increment in your pay scale. The exact amount varies by bank and your current pay level, but typically ranges from ₹1,000 to ₹3,000 per month depending on your scale. This increment is over and above your regular annual increment.',
        },
        {
          question: 'Does JAIIB/CAIIB help in promotion?',
          answer:
            'Yes, JAIIB and CAIIB certifications carry significant weightage in promotions. Most public sector banks give preference to CAIIB-cleared officers for promotion from Scale I to Scale II and beyond. Some banks consider it as a mandatory qualification for certain promotions. Additionally, CAIIB gives 2 increments and further boosts your promotion prospects.',
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="JAIIB & CAIIB FAQ — Frequently Asked Questions | MockMaster"
        description="Find answers to common questions about JAIIB and CAIIB exams — eligibility, passing criteria, exam pattern, negative marking, salary increment, and how MockMaster helps you prepare for free."
        canonical="https://mockmaster.fun/faq"
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
            Frequently Asked Questions
          </h1>
          <p className="text-base sm:text-xl text-gray-600 leading-relaxed">
            Everything you need to know about JAIIB, CAIIB exams and MockMaster platform.
          </p>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-10 sm:space-y-14">
          {faqSections.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl sm:text-2xl">{section.icon}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{section.title}</h2>
              </div>
              <div className="space-y-3">
                {section.items.map((item, itemIndex) => {
                  const key = `${sectionIndex}-${itemIndex}`;
                  const isOpen = openItems[key] || false;
                  return (
                    <div
                      key={itemIndex}
                      className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
                    >
                      <button
                        onClick={() => toggleItem(sectionIndex, itemIndex)}
                        className="w-full text-left px-5 sm:px-6 py-4 sm:py-5 flex items-center justify-between gap-4 hover:bg-gray-50 transition"
                        aria-expanded={isOpen}
                      >
                        <span className="font-semibold text-gray-900 text-sm sm:text-base">
                          {item.question}
                        </span>
                        <span
                          className={`text-gray-400 text-xl flex-shrink-0 transition-transform duration-200 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        >
                          ▼
                        </span>
                      </button>
                      {isOpen && (
                        <div className="px-5 sm:px-6 pb-4 sm:pb-5">
                          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                            {item.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
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
                <li><a href="/about" className="hover:text-white transition">About Us</a></li>
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

export default FAQPage;
