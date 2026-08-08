import React, { useState, useEffect } from 'react';
import { apiClient } from '../../services/api';

interface ExamDate {
  label: string;
  date: string; // YYYY-MM-DD
}

// Fallback dates in case API is unreachable
const FALLBACK_DATES: ExamDate[] = [
  { label: 'JAIIB Nov-Dec 2026', date: '2026-11-15' },
  { label: 'JAIIB May-Jun 2027', date: '2027-05-15' },
];

function getNextExam(dates: ExamDate[]): ExamDate | null {
  const now = new Date();
  for (const exam of dates) {
    if (new Date(exam.date + 'T09:00:00+05:30') > now) return exam;
  }
  return null;
}

function getDaysUntil(dateStr: string): number {
  const target = new Date(dateStr + 'T09:00:00+05:30');
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function getWeeksAndDays(totalDays: number): { weeks: number; days: number } {
  return { weeks: Math.floor(totalDays / 7), days: totalDays % 7 };
}

const ExamCountdown: React.FC = () => {
  const [examDates, setExamDates] = useState<ExamDate[]>(FALLBACK_DATES);

  useEffect(() => {
    const fetchDates = async () => {
      try {
        const response = await apiClient.get<{ exam_dates: ExamDate[] }>('/auth/config/exam-dates');
        if (response.success && response.data?.exam_dates?.length) {
          setExamDates(response.data.exam_dates);
        }
      } catch {
        // Use fallback dates silently
      }
    };
    fetchDates();
  }, []);

  // Force re-render daily
  const [, setTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const nextExam = getNextExam(examDates);
  if (!nextExam) return null;

  const daysLeft = getDaysUntil(nextExam.date);
  const { weeks, days } = getWeeksAndDays(daysLeft);

  // Urgency levels
  const isUrgent = daysLeft <= 14;
  const isWarning = daysLeft <= 30 && !isUrgent;

  const bgGradient = isUrgent
    ? 'from-red-500 to-orange-500'
    : isWarning
    ? 'from-orange-400 to-yellow-400'
    : 'from-blue-500 to-indigo-600';

  const urgencyMessage = isUrgent
    ? 'Final stretch! Focus on mock tests and revision.'
    : isWarning
    ? 'Time to intensify practice. Attempt full mock tests.'
    : 'Plenty of time. Stay consistent with daily practice.';

  // Progress ring (90 days = full preparation cycle)
  const totalPrepDays = 90;
  const prepProgress = Math.min(100, Math.round(((totalPrepDays - Math.min(daysLeft, totalPrepDays)) / totalPrepDays) * 100));

  return (
    <div className={`bg-gradient-to-r ${bgGradient} rounded-xl p-6 text-white shadow-lg`}>
      <div className="flex items-center justify-between">
        {/* Left: Exam info */}
        <div>
          <p className="text-sm font-medium opacity-90">{nextExam.label}</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-4xl font-bold">{daysLeft}</span>
            <span className="text-lg opacity-90">days to go</span>
          </div>
          {weeks > 0 && (
            <p className="text-sm opacity-80 mt-1">
              ({weeks} week{weeks > 1 ? 's' : ''}{days > 0 ? ` ${days} day${days > 1 ? 's' : ''}` : ''})
            </p>
          )}
          <p className="text-sm mt-3 opacity-90">{urgencyMessage}</p>
        </div>

        {/* Right: Visual countdown ring */}
        <div className="hidden sm:flex flex-col items-center">
          <div className="relative w-20 h-20">
            <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="3"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="white"
                strokeWidth="3"
                strokeDasharray={`${prepProgress}, 100`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold">{prepProgress}%</span>
            </div>
          </div>
          <p className="text-xs mt-1 opacity-80">Prep window</p>
        </div>
      </div>

      {/* Milestones */}
      {daysLeft > 7 && (
        <div className="mt-4 pt-4 border-t border-white border-opacity-20">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className={`rounded-lg p-2 ${daysLeft <= 30 ? 'bg-white bg-opacity-20' : 'bg-white bg-opacity-10'}`}>
              <p className="text-lg font-bold">{Math.max(0, daysLeft - 14)}</p>
              <p className="text-xs opacity-80">Days to study</p>
            </div>
            <div className="rounded-lg p-2 bg-white bg-opacity-10">
              <p className="text-lg font-bold">14</p>
              <p className="text-xs opacity-80">Days for revision</p>
            </div>
            <div className="rounded-lg p-2 bg-white bg-opacity-10">
              <p className="text-lg font-bold">{Math.min(daysLeft, 7)}</p>
              <p className="text-xs opacity-80">Mock test days</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamCountdown;
