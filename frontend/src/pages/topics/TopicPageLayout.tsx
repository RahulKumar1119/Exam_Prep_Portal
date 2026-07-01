import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import SEO from '../../components/SEO';

interface RelatedTopic {
  title: string;
  url: string;
}

interface TopicPageLayoutProps {
  title: string;
  description: string;
  canonical: string;
  keywords: string;
  breadcrumb: { label: string; url?: string }[];
  content: React.ReactNode;
  relatedTopics: RelatedTopic[];
  lastUpdated?: string;
}

const TopicPageLayout: React.FC<TopicPageLayoutProps> = ({
  title,
  description,
  canonical,
  keywords,
  breadcrumb,
  content,
  relatedTopics,
  lastUpdated = 'June 2026',
}) => {
  const navigate = useNavigate();

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    dateModified: '2026-06-01',
    datePublished: '2026-06-01',
    author: {
      '@type': 'Organization',
      name: 'MockMaster',
      url: 'https://mockmaster.fun',
    },
    publisher: {
      '@type': 'Organization',
      name: 'MockMaster',
      logo: {
        '@type': 'ImageObject',
        url: 'https://mockmaster.fun/og-image.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonical,
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumb.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: item.url ? `https://mockmaster.fun${item.url}` : undefined,
    })),
  };

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title={title}
        description={description}
        canonical={canonical}
        keywords={keywords}
        type="article"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

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

      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-gray-600 flex-wrap">
            {breadcrumb.map((item, index) => (
              <React.Fragment key={index}>
                {index > 0 && <span className="text-gray-400">›</span>}
                {item.url ? (
                  <a
                    href={item.url}
                    className="hover:text-blue-600 transition"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(item.url!);
                    }}
                  >
                    {item.label}
                  </a>
                ) : (
                  <span className="text-gray-900 font-medium">{item.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Article Content */}
          <article className="lg:col-span-3 prose prose-lg max-w-none">
            <p className="text-sm text-gray-500 mb-4">Last Updated: {lastUpdated}</p>
            {content}
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-20 space-y-6">
              {/* CTA */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                <h3 className="font-bold text-gray-900 mb-2 text-lg">Practice Questions on This Topic</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Test your understanding with MCQs that mirror actual JAIIB exam patterns.
                </p>
                <button
                  onClick={() => navigate('/register')}
                  className="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition text-sm"
                >
                  Start Practicing Free →
                </button>
              </div>

              {/* Related Topics */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-4 text-lg">Related Topics</h3>
                <ul className="space-y-3">
                  {relatedTopics.map((topic, index) => (
                    <li key={index}>
                      <a
                        href={topic.url}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium transition hover:underline"
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(topic.url);
                        }}
                      >
                        {topic.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="text-white font-bold mb-4">About</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/about" className="hover:text-white transition">About Us</a></li>
                <li><a href="/faq" className="hover:text-white transition">FAQ</a></li>
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
                <li><a href="/disclaimer" className="hover:text-white transition">Disclaimer</a></li>
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

export default TopicPageLayout;
