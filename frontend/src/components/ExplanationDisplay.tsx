import React from 'react';

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
      <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
        <div className="flex items-center gap-3">
          <div className="animate-spin">
            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
          <p className="text-blue-800 font-medium">Generating explanation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 rounded-lg p-6 border border-blue-200 space-y-4">
      {/* Main Explanation */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-2">Explanation</h4>
        <p className="text-gray-800 leading-relaxed">{explanation}</p>
      </div>

      {/* Citations */}
      {citations.length > 0 && (
        <div className="border-t border-blue-200 pt-4">
          <h4 className="font-semibold text-gray-900 mb-3">References</h4>
          <div className="space-y-2">
            {citations.map((citation, index) => (
              <div key={index} className="flex gap-2 text-sm">
                <span className="text-blue-600 font-medium min-w-fit">
                  [{citation.source}]
                </span>
                <span className="text-gray-700">{citation.reference}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
