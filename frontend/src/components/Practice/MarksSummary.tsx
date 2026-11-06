import React from 'react';
import { SessionResult } from '../../types/index';

/** Format a marks value without trailing zeros: 2 → "2", 0.5 → "0.5", 52.25 → "52.25". */
export function formatMarks(value: number | undefined | null): string {
  if (value == null || Number.isNaN(Number(value))) return '0';
  return String(Math.round(Number(value) * 100) / 100);
}

/** "1 mark" / "0.5 marks" / "2 marks" */
export function marksLabel(value: number): string {
  return `${formatMarks(value)} ${Number(value) === 1 ? 'mark' : 'marks'}`;
}

interface MarksSummaryProps {
  result: SessionResult;
}

/**
 * Result dashboard for marks-based scoring (issue #87): total questions,
 * correct / incorrect / unanswered counts, marks obtained, maximum marks and %.
 * Renders nothing for legacy results that carry no marks data.
 */
const MarksSummary: React.FC<MarksSummaryProps> = ({ result }) => {
  if (result.marks_earned == null || result.total_marks == null) return null;

  const results = result.results || [];
  const total = result.total_questions ?? results.length;
  const correct = result.correct_count ?? results.filter(r => r.correct).length;
  const unanswered = result.unanswered_count ?? results.filter(r => r.unanswered).length;
  const incorrect = result.incorrect_count ?? Math.max(total - correct - unanswered, 0);
  const pct = result.marks_percentage
    ?? (result.total_marks > 0 ? Math.round((result.marks_earned / result.total_marks) * 10000) / 100 : 0);

  const stats: { label: string; value: string; tone: string }[] = [
    { label: 'Total questions', value: String(total), tone: 'text-gray-900' },
    { label: 'Correct', value: String(correct), tone: 'text-green-700' },
    { label: 'Incorrect', value: String(incorrect), tone: 'text-red-700' },
    { label: 'Unanswered', value: String(unanswered), tone: 'text-gray-600' },
    { label: 'Marks obtained', value: formatMarks(result.marks_earned), tone: 'text-indigo-700' },
    { label: 'Maximum marks', value: formatMarks(result.total_marks), tone: 'text-gray-900' },
    { label: 'Percentage', value: `${formatMarks(pct)}%`, tone: 'text-indigo-700' },
  ];

  const rows = (result.marks_breakdown || []).filter(r => r.total > 0);

  return (
    <section aria-labelledby="marks-summary-heading" className="mb-8">
      <h3 id="marks-summary-heading" className="text-lg font-bold text-gray-900 mb-3">Marks summary</h3>
      <dl className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {stats.map(s => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-lg p-3 text-center">
            <dt className="text-xs text-gray-600">{s.label}</dt>
            <dd className={`text-xl font-bold mt-1 ${s.tone}`}>{s.value}</dd>
          </div>
        ))}
      </dl>
      {(result.negative_marks ?? 0) > 0 && (
        <p className="text-sm text-red-700 mt-2">Includes −{formatMarks(result.negative_marks)} negative marks.</p>
      )}
      {result.pass_marks != null && (
        <p className="text-sm text-gray-600 mt-2">Pass marks: {formatMarks(result.pass_marks)}</p>
      )}

      {rows.length > 1 && (
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full text-sm border border-gray-200 rounded-lg">
            <caption className="sr-only">Marks by question weight</caption>
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th scope="col" className="px-3 py-2 text-left font-semibold">Weight</th>
                <th scope="col" className="px-3 py-2 text-right font-semibold">Questions</th>
                <th scope="col" className="px-3 py-2 text-right font-semibold">Correct</th>
                <th scope="col" className="px-3 py-2 text-right font-semibold">Incorrect</th>
                <th scope="col" className="px-3 py-2 text-right font-semibold">Unanswered</th>
                <th scope="col" className="px-3 py-2 text-right font-semibold">Marks</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.marks} className="border-t border-gray-200">
                  <th scope="row" className="px-3 py-2 text-left font-medium text-gray-900">{marksLabel(r.marks)} each</th>
                  <td className="px-3 py-2 text-right">{r.total}</td>
                  <td className="px-3 py-2 text-right text-green-700">{r.correct}</td>
                  <td className="px-3 py-2 text-right text-red-700">{r.incorrect}</td>
                  <td className="px-3 py-2 text-right text-gray-600">{r.unanswered}</td>
                  <td className="px-3 py-2 text-right font-medium">{formatMarks(r.marks_earned)} / {formatMarks(r.max_marks)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default MarksSummary;
