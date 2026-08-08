/**
 * useBookmarks
 * Persists bookmarked questions to localStorage, namespaced by user_id.
 * Stores full question data so bookmarks are viewable without re-fetching.
 */
import { useState, useCallback } from 'react';

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

function loadBookmarks(userId: string): BookmarkedQuestion[] {
  try {
    const raw = localStorage.getItem(getStorageKey(userId));
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveBookmarks(userId: string, bookmarks: BookmarkedQuestion[]): void {
  try {
    localStorage.setItem(getStorageKey(userId), JSON.stringify(bookmarks));
  } catch {
    // localStorage quota exceeded — silently ignore
  }
}

export function useBookmarks(userId: string) {
  const [bookmarks, setBookmarks] = useState<BookmarkedQuestion[]>(() => loadBookmarks(userId));

  const isBookmarked = useCallback(
    (questionId: string) => bookmarks.some((b) => b.question_id === questionId),
    [bookmarks]
  );

  const toggleBookmark = useCallback(
    (question: {
      question_id: string;
      question_text: string;
      options: Record<string, string>;
      correct_answer: string;
      topic?: string;
      difficulty?: string;
      paper_name?: string;
    }) => {
      setBookmarks((prev) => {
        const exists = prev.some((b) => b.question_id === question.question_id);
        let updated: BookmarkedQuestion[];

        if (exists) {
          updated = prev.filter((b) => b.question_id !== question.question_id);
        } else {
          updated = [
            ...prev,
            {
              question_id: question.question_id,
              question_text: question.question_text,
              options: question.options,
              correct_answer: question.correct_answer,
              topic: question.topic || 'General',
              difficulty: question.difficulty || 'medium',
              paper_name: question.paper_name || '',
              bookmarked_at: new Date().toISOString(),
            },
          ];
        }

        saveBookmarks(userId, updated);
        return updated;
      });
    },
    [userId]
  );

  const removeBookmark = useCallback(
    (questionId: string) => {
      setBookmarks((prev) => {
        const updated = prev.filter((b) => b.question_id !== questionId);
        saveBookmarks(userId, updated);
        return updated;
      });
    },
    [userId]
  );

  const clearAllBookmarks = useCallback(() => {
    setBookmarks([]);
    saveBookmarks(userId, []);
  }, [userId]);

  return {
    bookmarks,
    isBookmarked,
    toggleBookmark,
    removeBookmark,
    clearAllBookmarks,
    count: bookmarks.length,
  };
}
