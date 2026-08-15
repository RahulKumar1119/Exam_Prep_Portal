import React, { useState, useEffect } from 'react';

interface Article {
  id: number;
  title: string;
  url: string;
  description: string;
  cover_image: string | null;
  readable_publish_date: string;
  reading_time_minutes: number;
  user: {
    name: string;
    profile_image_90: string;
  };
  tag_list: string[];
}

interface DevToArticlesProps {
  tags?: string[];
  title?: string;
  limit?: number;
  darkMode?: boolean;
}

const DevToArticles: React.FC<DevToArticlesProps> = ({
  tags = ['azure', 'machinelearning', 'mlops'],
  title = 'Trending Articles',
  limit = 6,
  darkMode = false,
}) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTag, setActiveTag] = useState(tags[0]);

  useEffect(() => {
    fetchArticles(activeTag);
  }, [activeTag]);

  const fetchArticles = async (tag: string) => {
    setIsLoading(true);
    try {
      const resp = await fetch(
        `https://dev.to/api/articles?tag=${tag}&top=30&per_page=${limit}`
      );
      if (!resp.ok) throw new Error('Failed');
      const data = await resp.json();
      setArticles(data.slice(0, limit));
    } catch {
      setArticles([]);
    } finally {
      setIsLoading(false);
    }
  };

  const bgCard = darkMode ? 'bg-gray-900 border-gray-800 hover:border-gray-700' : 'bg-white border-gray-200 hover:border-indigo-200 hover:shadow-md';
  const textTitle = darkMode ? 'text-white group-hover:text-indigo-400' : 'text-gray-900 group-hover:text-indigo-600';
  const textDesc = darkMode ? 'text-gray-400' : 'text-gray-600';
  const textMeta = darkMode ? 'text-gray-500' : 'text-gray-500';
  const bgTag = darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600';
  const tabActive = darkMode ? 'bg-indigo-600 text-white' : 'bg-indigo-600 text-white';
  const tabInactive = darkMode ? 'bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200';

  return (
    <div>
      {/* Header + Tag Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h2 className={`text-xl sm:text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {title}
        </h2>
        <div className="flex gap-2 flex-wrap">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                activeTag === tag ? tabActive : tabInactive
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      {isLoading ? (
        <div className={`text-center py-8 ${textMeta}`}>Loading articles...</div>
      ) : articles.length === 0 ? (
        <div className={`text-center py-8 ${textMeta}`}>No articles found for #{activeTag}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {articles.map((article) => (
            <a
              key={article.id}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`border rounded-xl overflow-hidden transition-all group ${bgCard}`}
            >
              {/* Cover Image */}
              {article.cover_image && (
                <div className="h-32 overflow-hidden">
                  <img
                    src={article.cover_image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
              )}

              <div className="p-4">
                {/* Title */}
                <h3 className={`font-semibold text-sm leading-snug line-clamp-2 transition ${textTitle}`}>
                  {article.title}
                </h3>

                {/* Description */}
                {article.description && (
                  <p className={`text-xs mt-2 line-clamp-2 ${textDesc}`}>
                    {article.description}
                  </p>
                )}

                {/* Meta */}
                <div className={`flex items-center justify-between mt-3 text-xs ${textMeta}`}>
                  <div className="flex items-center gap-1.5">
                    <img
                      src={article.user.profile_image_90}
                      alt={article.user.name}
                      className="w-4 h-4 rounded-full"
                      loading="lazy"
                    />
                    <span className="truncate max-w-[80px]">{article.user.name}</span>
                  </div>
                  <span>{article.reading_time_minutes} min read</span>
                </div>

                {/* Tags */}
                <div className="flex gap-1 mt-2 flex-wrap">
                  {article.tag_list.slice(0, 3).map((tag) => (
                    <span key={tag} className={`px-1.5 py-0.5 rounded text-[10px] ${bgTag}`}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </a>
          ))}
        </div>
      )}

      {/* View More */}
      <div className="text-center mt-6">
        <a
          href={`https://dev.to/t/${activeTag}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-indigo-500 hover:text-indigo-400 font-medium"
        >
          View more on Dev.to →
        </a>
      </div>
    </div>
  );
};

export default DevToArticles;
