/**
 * useBookmarks
 * Persisted to DynamoDB (jaiib-bookmarks) with localStorage fallback.
 * Stores full question data so bookmarks are viewable without re-fetching.
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { apiClient } from '../services/api';

export interface BookmarkedQuestion {
  question_id: string;
  question_text: string;
  options: Record<string, string>;
  correct_answer: string;
  topic: string;
  difficulty: string;
  paper_name: string;
  bookmarked_at: string;
}

const STORAGE_KEY_PREFIX = 'jaiib_bookmarks_';

function getStorageKey(userId: string): string {
  return `${STORAGE_KEY_PREFIX}${userId}`;
}

function loadBookmarksFromCache(userId: string): BookmarkedQuestion[] {
  try {
    const raw = localStorage.getItem(getStorageKey(userId));
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveBookmarksToCache(userId: string, bookmarks: BookmarkedQuestion[]): void {
  try {
    localStorage.setItem(getStorageKey(userId), JSON.stringify(bookmarks));
  } catch {
    // quota exceeded — ignore
  }
}

export function useBookmarks(userId: string) {
  const [bookmarks, setBookmarks] = useState<BookmarkedQuestion[]>(() => loadBookmarksFromCache(userId));
  const [isLoading, setIsLoading] = useState(false);
  const fetchedRef = useRef(false);

  // Fetch from DynamoDB on mount / userId change
  useEffect(() => {
    if (!userId || userId === 'anonymous') {
      setBookmarks(loadBookmarksFromCache(userId));
      return;
    }

    fetchedRef.current = false;
    setIsLoading(true);

    apiClient
      .get<{ bookmarks: BookmarkedQuestion[]; count: number }>(`/bookmarks?user_id=${encodeURIComponent(userId)}`)
      .then((res) => {
        if (res.success && res.data?.bookmarks) {
          setBookmarks(res.data.bookmarks);
          saveBookmarksToCache(userId, res.data.bookmarks);
          fetchedRef.current = true;
        } else {
          // Fallback to cache if API returns no data
          setBookmarks(loadBookmarksFromCache(userId));
        }
      })
      .catch(() => {
        // Offline / error — use cache
        setBookmarks(loadBookmarksFromCache(userId));
      })
      .finally(() => setIsLoading(false));
  }, [userId]);

  const isBookmarked = useCallback(
    (questionId: string) => bookmarks.some((b) => b.question_id === questionId),
    [bookmarks]
  );

  const toggleBookmark = useCallback(
    async (question: {
      question_id: string;
      question_text: string;
      options: Record<string, string>;
      correct_answer: string;
      topic?: string;
      difficulty?: string;
      paper_name?: string;
    }) => {
      const exists = bookmarks.some((b) => b.question_id === question.question_id);

      if (exists) {
        // Remove
        const updated = bookmarks.filter((b) => b.question_id !== question.question_id);
        setBookmarks(updated);
        saveBookmarksToCache(userId, updated);

        if (userId && userId !== 'anonymous') {
          try {
            await apiClient.delete(`/bookmarks/${encodeURIComponent(question.question_id)}?user_id=${encodeURIComponent(userId)}`);
          } catch {
            // Revert on failure
            setBookmarks(bookmarks);
            saveBookmarksToCache(userId, bookmarks);
          }
        }
      } else {
        const newBookmark: BookmarkedQuestion = {
          question_id: question.question_id,
          question_text: question.question_text,
          options: question.options,
          correct_answer: question.correct_answer,
          topic: question.topic || 'General',
          difficulty: question.difficulty || 'medium',
          paper_name: question.paper_name || '',
          bookmarked_at: new Date().toISOString(),
        };
        const updated = [...bookmarks, newBookmark];
        setBookmarks(updated);
        saveBookmarksToCache(userId, updated);

        if (userId && userId !== 'anonymous') {
          try {
            await apiClient.post('/bookmarks', {
              user_id: userId,
              ...newBookmark,
            });
          } catch {
            // Keep local state even if API fails (offline)
          }
        }
      }
    },
    [bookmarks, userId]
  );

  const removeBookmark = useCallback(
    async (questionId: string) => {
      const prev = bookmarks;
      const updated = prev.filter((b) => b.question_id !== questionId);
      setBookmarks(updated);
      saveBookmarksToCache(userId, updated);

      if (userId && userId !== 'anonymous') {
        try {
          await apiClient.delete(`/bookmarks/${encodeURIComponent(questionId)}?user_id=${encodeURIComponent(userId)}`);
        } catch {
          setBookmarks(prev);
          saveBookmarksToCache(userId, prev);
        }
      }
    },
    [bookmarks, userId]
  );

  const clearAllBookmarks = useCallback(async () => {
    const prev = bookmarks;
    setBookmarks([]);
    saveBookmarksToCache(userId, []);

    if (userId && userId !== 'anonymous') {
      try {
        await apiClient.delete(`/bookmarks?user_id=${encodeURIComponent(userId)}`);
      } catch {
        setBookmarks(prev);
        saveBookmarksToCache(userId, prev);
      }
    }
  }, [bookmarks, userId]);

  return {
    bookmarks,
    isBookmarked,
    toggleBookmark,
    removeBookmark,
    clearAllBookmarks,
    count: bookmarks.length,
    isLoading,
  };
}
