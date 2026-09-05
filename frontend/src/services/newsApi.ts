import { get, set } from 'idb-keyval';

export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  source: string;
}

const CACHE_KEY = 'rbi_news_cache';
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

interface CachedNews {
  articles: NewsArticle[];
  timestamp: number;
}

async function getCachedNews(): Promise<NewsArticle[] | null> {
  try {
    const cached = await get<CachedNews>(CACHE_KEY);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return cached.articles;
    }
  } catch {
    // ignore
  }
  // fallback to localStorage
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as CachedNews;
      if (Date.now() - parsed.timestamp < CACHE_TTL_MS) return parsed.articles;
    }
  } catch {
    // ignore
  }
  return null;
}

async function setCachedNews(articles: NewsArticle[]): Promise<void> {
  const data: CachedNews = { articles, timestamp: Date.now() };
  try {
    await set(CACHE_KEY, data);
  } catch {
    // ignore
  }
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

export async function fetchRbiNews(): Promise<NewsArticle[]> {
  const cached = await getCachedNews();
  if (cached) return cached;

  const apiKey = import.meta.env.VITE_NEWS_API_KEY as string | undefined;
  if (!apiKey) return [];

  // Use GNews (free, CORS yes) as primary — compatible with NewsAPI query style
  const endpoint = import.meta.env.VITE_NEWS_API_ENDPOINT || 'https://gnews.io/api/v4/search';
  const query = encodeURIComponent('RBI banking repo rate');
  const url = `${endpoint}?q=${query}&lang=en&country=in&max=5&apikey=${apiKey}`;

  try {
    const resp = await fetch(url);
    if (!resp.ok) return cached || [];

    const json = await resp.json();
    const rawArticles: any[] = json.articles || json.data || [];

    const articles: NewsArticle[] = rawArticles.slice(0, 5).map((a: any) => ({
      title: a.title || a.name || '',
      description: a.description || a.content || '',
      url: a.url || a.link || '#',
      publishedAt: a.publishedAt || a.published_at || a.date || new Date().toISOString(),
      source: a.source?.name || a.source || 'News',
    }));

    if (articles.length > 0) await setCachedNews(articles);
    return articles;
  } catch {
    return cached || [];
  }
}
