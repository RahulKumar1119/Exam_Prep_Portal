import React from 'react';
import { useNews } from '../hooks/useNews';

const NewsFeed: React.FC = () => {
  const { data: articles, isLoading, error } = useNews();

  if (!import.meta.env.VITE_NEWS_API_KEY) return null;
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">RBI Banking News</h3>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }
  if (error || !articles || articles.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">RBI Banking News</h3>
      <div className="space-y-4">
        {articles.map((a, i) => (
          <a key={i} href={a.url} target="_blank" rel="noopener noreferrer" className="block hover:bg-gray-50 p-2 rounded transition">
            <p className="text-sm font-medium text-gray-900 line-clamp-2">{a.title}</p>
            {a.description && <p className="text-xs text-gray-600 mt-1 line-clamp-2">{a.description}</p>}
            <p className="text-xs text-gray-500 mt-1">
              {a.source} • {new Date(a.publishedAt).toLocaleDateString('en-IN')}
            </p>
          </a>
        ))}
      </div>
      <p className="text-xs text-gray-400 mt-4">Powered by GNews • cached 1 hour</p>
    </div>
  );
};

export default NewsFeed;
