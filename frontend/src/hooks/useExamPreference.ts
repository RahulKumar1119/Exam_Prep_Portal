/**
 * useExamPreference
 * Persists user's selected exam to localStorage.
 * Syncs with backend on login (AuthContext writes to localStorage).
 * Used to filter practice page and homepage to only show relevant papers.
 */
import { useState, useCallback, useEffect } from 'react';

export type ExamId = 'JAIIB' | 'AI-300';

export interface ExamInfo {
  id: ExamId;
  name: string;
  fullName: string;
}

export const AVAILABLE_EXAMS: ExamInfo[] = [
  { id: 'JAIIB', name: 'JAIIB', fullName: 'Junior Associate of Indian Institute of Bankers' },
  { id: 'AI-300', name: 'AI-300', fullName: 'Microsoft: Operationalizing ML & GenAI Solutions' },
];

const STORAGE_KEY = 'jaiib_selected_exam';

function loadPreference(): ExamId | null {
  try {
    const val = localStorage.getItem(STORAGE_KEY);
    if (val === 'JAIIB' || val === 'AI-300') return val;
    return null;
  } catch {
    return null;
  }
}

function savePreference(exam: ExamId): void {
  try {
    localStorage.setItem(STORAGE_KEY, exam);
  } catch {}
}

export function useExamPreference() {
  const [selectedExam, setSelectedExam] = useState<ExamId | null>(loadPreference);

  // Re-read from localStorage periodically (in case login updated it)
  useEffect(() => {
    const check = () => {
      const current = loadPreference();
      if (current && current !== selectedExam) {
        setSelectedExam(current);
      }
    };
    // Check on focus (user logs in another tab, or navigates)
    window.addEventListener('focus', check);
    // Also check after a short delay (login just happened)
    const timer = setTimeout(check, 1000);
    return () => {
      window.removeEventListener('focus', check);
      clearTimeout(timer);
    };
  }, [selectedExam]);

  const selectExam = useCallback((exam: ExamId) => {
    setSelectedExam(exam);
    savePreference(exam);
  }, []);

  const hasSelected = selectedExam !== null;

  return {
    selectedExam,
    selectExam,
    hasSelected,
  };
}
