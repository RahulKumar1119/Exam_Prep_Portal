import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

interface ExplanationDisplayProps {
  explanation: string;
  citations?: Array<{ source: string; reference: string }>;
  isLoading?: boolean;
}

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
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-3 flex items-center gap-2">
        <span className="text-white text-base">🤖</span>
        <h3 className="text-white font-semibold text-sm">AI Explanation</h3>
      </div>

      <div className="px-5 py-4 prose prose-sm max-w-none prose-p:text-gray-700 prose-p:text-sm prose-p:leading-relaxed prose-strong:text-gray-900 prose-headings:text-blue-800 prose-ul:ml-1">
        <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
          {explanation}
        </ReactMarkdown>
      </div>

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
