import React from 'react';

interface ExplanationDisplayProps {
  explanation: string;
  citations?: Array<{ source: string; reference: string }>;
  isLoading?: boolean;
}

/** Renders a single line of markdown-ish text: **bold**, inline text */
const InlineText: React.FC<{ text: string }> = ({ text }) => {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith('**') && part.endsWith('**') ? (
          <strong key={i} className="font-semibold text-gray-900">
            {part.slice(2, -2)}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
};

/** Parses the AI markdown output into structured blocks */
const renderExplanation = (text: string) => {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trim();

    if (!line) { i++; continue; }

    // ## Heading
    if (line.startsWith('## ')) {
      const title = line.slice(3);
      const icons: Record<string, string> = {
        'CORRECT ANSWER': '✅',
        'DETAILED REASONING': '📖',
        'WHY OTHER OPTIONS': '❌',
        'REGULATORY': '📋',
        'PRACTICAL': '💡',
        'KEY CONCEPTS': '🔑',
        'COMMON MISCONCEPTIONS': '⚠️',
      };
      const icon = Object.entries(icons).find(([k]) => title.toUpperCase().includes(k))?.[1] ?? '📌';
      elements.push(
        <div key={i} className="flex items-center gap-2 mt-5 mb-2 pb-1 border-b border-blue-100">
          <span className="text-base">{icon}</span>
          <h3 className="text-sm font-bold text-blue-800 uppercase tracking-wide">{title}</h3>
        </div>
      );
      i++; continue;
    }

    // Numbered list: 1. or 1)
    if (/^\d+[\.\)]/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+[\.\)]/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+[\.\)]\s*/, ''));
        i++;
      }
      elements.push(
        <ol key={i} className="list-decimal list-inside space-y-1 ml-1 my-1">
          {items.map((item, idx) => (
            <li key={idx} className="text-gray-700 text-sm leading-relaxed">
              <InlineText text={item} />
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // Bullet: - or *
    if (/^[-*]\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s/.test(lines[i].trim())) {
        items.push(lines[i].trim().slice(2));
        i++;
      }
      elements.push(
        <ul key={i} className="space-y-1 ml-1 my-1">
          {items.map((item, idx) => (
            <li key={idx} className="flex gap-2 text-sm text-gray-700 leading-relaxed">
              <span className="text-blue-400 mt-0.5">•</span>
              <span><InlineText text={item} /></span>
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Regular paragraph
    elements.push(
      <p key={i} className="text-gray-700 text-sm leading-relaxed">
        <InlineText text={line} />
      </p>
    );
    i++;
  }

  return elements;
};

export const ExplanationDisplay: React.FC<ExplanationDisplayProps> = ({
  explanation,
  citations = [],
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
        <div className="flex items-center gap-3">
          <div className="animate-spin">
            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
          <p className="text-blue-800 font-medium text-sm">Generating AI explanation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-blue-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-3 flex items-center gap-2">
        <span className="text-white text-base">🤖</span>
        <h3 className="text-white font-semibold text-sm">AI Explanation</h3>
      </div>

      {/* Body */}
      <div className="px-5 py-4 space-y-1">
        {renderExplanation(explanation)}
      </div>

      {/* Citations */}
      {citations.length > 0 && (
        <div className="border-t border-gray-100 bg-gray-50 px-5 py-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">References</p>
          <div className="space-y-1">
            {citations.map((c, idx) => (
              <div key={idx} className="flex gap-2 text-xs">
                <span className="text-blue-600 font-semibold shrink-0">[{c.source}]</span>
                <span className="text-gray-600">{c.reference}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
