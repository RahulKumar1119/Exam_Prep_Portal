import React, { useState } from 'react';
import { apiClient } from '../services/api';

interface ReportQuestionButtonProps {
  questionId: string;
  userId?: string;
}

const REASONS = [
  { value: 'wrong_answer', label: 'Wrong answer marked as correct' },
  { value: 'incomplete_question', label: 'Question text is incomplete' },
  { value: 'wrong_options', label: 'Options are incorrect' },
  { value: 'other', label: 'Other issue' },
] as const;

export const ReportQuestionButton: React.FC<ReportQuestionButtonProps> = ({
  questionId,
  userId,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState<string>('wrong_answer');
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async () => {
    setStatus('submitting');
    try {
      await apiClient.post('/question-bank', {
        action: 'report_question',
        question_id: questionId,
        user_id: userId || 'anonymous',
        reason,
        comment: comment.trim() || undefined,
      });
      setStatus('success');
      setTimeout(() => {
        setIsOpen(false);
        setStatus('idle');
        setComment('');
        setReason('wrong_answer');
      }, 1500);
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <span className="text-green-600 text-sm font-medium flex items-center gap-1">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        Reported
      </span>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1 transition-colors"
        title="Report this question"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Report
      </button>

      {isOpen && (
        <div className="absolute right-0 top-8 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-72">
          <h4 className="font-semibold text-gray-900 text-sm mb-3">Report this question</h4>

          <div className="space-y-2 mb-3">
            {REASONS.map((r) => (
              <label key={r.value} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="radio"
                  name="reason"
                  value={r.value}
                  checked={reason === r.value}
                  onChange={(e) => setReason(e.target.value)}
                  className="text-indigo-600"
                />
                {r.label}
              </label>
            ))}
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Additional details (optional)"
            className="w-full border border-gray-300 rounded-md p-2 text-sm resize-none h-16 mb-3"
          />

          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              disabled={status === 'submitting'}
              className="flex-1 bg-red-600 text-white text-sm py-1.5 rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors"
            >
              {status === 'submitting' ? 'Sending...' : 'Submit'}
            </button>
            <button
              onClick={() => { setIsOpen(false); setStatus('idle'); }}
              className="flex-1 bg-gray-100 text-gray-700 text-sm py-1.5 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>

          {status === 'error' && (
            <p className="text-red-600 text-xs mt-2">Failed to submit. Try again.</p>
          )}
        </div>
      )}
    </div>
  );
};
