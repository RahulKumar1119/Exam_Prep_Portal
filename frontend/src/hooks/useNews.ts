import { useQuery } from '@tanstack/react-query';
import { fetchRbiNews, NewsArticle } from '../services/newsApi';

export function useNews() {
  const apiKey = import.meta.env.VITE_NEWS_API_KEY as string | undefined;

  return useQuery<NewsArticle[]>({
    queryKey: ['rbi-news'],
    queryFn: fetchRbiNews,
    enabled: !!apiKey,
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 60 * 60 * 1000,
    retry: 1,
  });
}
