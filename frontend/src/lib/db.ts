import { get, set, del } from 'idb-keyval';
import { PracticeSession } from '../types/index';

const SESSION_KEY = 'jaiib_practice_session';

export interface PersistedSession {
  session: PracticeSession;
  answers: Record<string, string>;
  timeLeft: number;
  currentQuestionIndex: number;
  reviewedQuestions: string[];
  checkedQuestions: string[];
  savedAt: number;
}

export async function saveSession(data: PersistedSession): Promise<void> {
  try {
    await set(SESSION_KEY, data);
  } catch {
    // IndexedDB quota exceeded or unavailable — silently ignore
  }
}

export async function loadSession(): Promise<PersistedSession | null> {
  try {
    const state = await get<PersistedSession>(SESSION_KEY);
    if (!state) return null;

    const elapsed = Math.floor((Date.now() - state.savedAt) / 1000);
    const adjusted = Math.max(0, state.timeLeft - elapsed);

    if (adjusted <= 0) {
      await clearSession();
      return null;
    }

    return { ...state, timeLeft: adjusted };
  } catch {
    return null;
  }
}

export async function clearSession(): Promise<void> {
  try {
    await del(SESSION_KEY);
  } catch {
    // ignore
  }
}
