/**
 * useSessionPersistence
 * Persists practice session state (answers + timer) to localStorage.
 * On mount, restores any in-progress session so a page refresh doesn't lose progress.
 */
import { useEffect } from 'react';
import { PracticeSession } from '../types/index';

const STORAGE_KEY = 'jaiib_practice_session';

export interface PersistedState {
  session: PracticeSession;
  answers: Record<string, string>;
  timeLeft: number;
  savedAt: number; // epoch ms
}

/** Save current session state to localStorage */
export function saveSessionState(
  session: PracticeSession,
  answers: Record<string, string>,
  timeLeft: number
): void {
  try {
    const state: PersistedState = {
      session,
      answers,
      timeLeft,
      savedAt: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage quota exceeded or unavailable — silently ignore
  }
}

/** Load persisted session state. Returns null if nothing saved or session expired. */
export function loadSessionState(): PersistedState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const state: PersistedState = JSON.parse(raw);

    // Adjust timeLeft for elapsed time since last save
    const elapsedSeconds = Math.floor((Date.now() - state.savedAt) / 1000);
    const adjustedTimeLeft = Math.max(0, state.timeLeft - elapsedSeconds);

    // If timer already ran out, clear and return null
    if (adjustedTimeLeft <= 0) {
      clearSessionState();
      return null;
    }

    return { ...state, timeLeft: adjustedTimeLeft };
  } catch {
    return null;
  }
}

/** Remove persisted session from localStorage */
export function clearSessionState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

/** Hook that auto-saves session state whenever answers or timeLeft change */
export function useSessionPersistence(
  session: PracticeSession | null,
  answers: Record<string, string>,
  timeLeft: number
): void {
  useEffect(() => {
    if (!session) return;
    saveSessionState(session, answers, timeLeft);
  }, [session, answers, timeLeft]);
}
