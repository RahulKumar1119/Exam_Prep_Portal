/**
 * useSessionPersistence
 * Persists practice session state to IndexedDB via idb-keyval.
 * On mount, restores any in-progress session so a page refresh doesn't lose progress.
 */
import { useEffect, useRef } from 'react';
import { PracticeSession } from '../types/index';
import { saveSession, loadSession, clearSession, PersistedSession } from '../lib/db';

export type { PersistedSession };

/** Save current session state to IndexedDB (async, non-blocking) */
export async function saveSessionState(
  session: PracticeSession,
  answers: Record<string, string>,
  timeLeft: number,
  currentQuestionIndex: number,
  reviewedQuestions: string[],
  checkedQuestions: string[]
): Promise<void> {
  await saveSession({
    session,
    answers,
    timeLeft,
    currentQuestionIndex,
    reviewedQuestions,
    checkedQuestions,
    savedAt: Date.now(),
  });
}

/** Load persisted session state. Returns null if nothing saved or session expired. */
export async function loadSessionState(): Promise<PersistedSession | null> {
  return loadSession();
}

/** Remove persisted session from IndexedDB */
export async function clearSessionState(): Promise<void> {
  return clearSession();
}

/** Hook that auto-saves session state whenever answers or timeLeft change */
export function useSessionPersistence(
  session: PracticeSession | null,
  answers: Record<string, string>,
  timeLeft: number,
  currentQuestionIndex: number,
  reviewedQuestions: Set<string>,
  checkedQuestions: Set<string>
): void {
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!session) return;

    // Debounce saves to avoid excessive IndexedDB writes
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      saveSessionState(
        session,
        answers,
        timeLeft,
        currentQuestionIndex,
        Array.from(reviewedQuestions),
        Array.from(checkedQuestions)
      );
    }, 300);

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [session, answers, timeLeft, currentQuestionIndex, reviewedQuestions, checkedQuestions]);
}
