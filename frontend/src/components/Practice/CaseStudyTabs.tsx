import React, { useState } from 'react';

export interface Exhibit {
  title: string;
  content: string;
}

interface CaseStudyTabsProps {
  caseStudyId?: string;
  scenario?: string;
  exhibits?: Exhibit[];
  /** How many questions belong to this case study (shown as context) */
  questionCount?: number;
}

/**
 * CaseStudyTabs — Microsoft-style case study panel (issue #51).
 *
 * Shows the shared scenario for a group of questions with tabs:
 * Overview (scenario) + one tab per exhibit. Rendered above the question
 * when a question carries scenario / case_study_id / exhibits.
 */
const CaseStudyTabs: React.FC<CaseStudyTabsProps> = ({ caseStudyId, scenario, exhibits = [], questionCount }) => {
  const tabs = [
    { key: 'overview', label: 'Overview' },
    ...exhibits.map((ex, i) => ({ key: `exhibit-${i}`, label: ex.title || `Exhibit ${i + 1}` })),
  ];
  const [active, setActive] = useState('overview');

  return (
    <div className="mb-4 border border-amber-200 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between bg-amber-100 px-3 py-2">
        <p className="text-xs font-bold text-amber-800 uppercase tracking-wide">
          Case Study{caseStudyId ? ` — ${caseStudyId}` : ''}
        </p>
        {questionCount ? (
          <span className="text-[11px] text-amber-700 font-medium">{questionCount} question{questionCount > 1 ? 's' : ''}</span>
        ) : null}
      </div>

      {/* Tab bar */}
      {tabs.length > 1 && (
        <div className="flex flex-wrap gap-1 px-2 pt-2 bg-amber-50 border-b border-amber-200">
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setActive(t.key)}
              className={`px-3 py-1.5 text-xs font-medium rounded-t-md transition-colors ${
                active === t.key
                  ? 'bg-white text-amber-900 border border-amber-200 border-b-white -mb-px'
                  : 'text-amber-700 hover:bg-amber-100'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      {/* Tab content */}
      <div className="bg-amber-50 px-3 py-3">
        {active === 'overview' ? (
          scenario ? (
            <p className="text-sm text-amber-900 whitespace-pre-wrap leading-relaxed">{scenario}</p>
          ) : (
            <p className="text-sm text-amber-700 italic">Review the exhibits, then answer the questions in this case study.</p>
          )
        ) : (
          (() => {
            const idx = parseInt(active.replace('exhibit-', ''), 10);
            const ex = exhibits[idx];
            if (!ex) return null;
            return <p className="text-sm text-amber-900 whitespace-pre-wrap leading-relaxed">{ex.content}</p>;
          })()
        )}
      </div>
    </div>
  );
};

export default CaseStudyTabs;
