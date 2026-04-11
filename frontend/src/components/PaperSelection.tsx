import React, { useState } from 'react';
import { usePractice } from '../context/PracticeContext';
import { useNotification } from '../context/NotificationContext';
import { LoadingSpinner } from './LoadingSpinner';

const PAPERS = [
  {
    id: 'IE & IFS',
    name: 'IE & IFS',
    description: 'Indian Economy & International Financial System',
  },
  {
    id: 'PPB',
    name: 'PPB',
    description: 'Principles & Practices of Banking',
  },
  {
    id: 'AFB',
    name: 'AFB',
    description: 'Advanced Financial Banking',
  },
  {
    id: 'RBWM',
    name: 'RBWM',
    description: 'Retail Banking & Wealth Management',
  },
];

interface PaperSelectionProps {
  onPracticeStart?: (sessionId: string) => void;
}

export const PaperSelection: React.FC<PaperSelectionProps> = ({ onPracticeStart }) => {
  const [selectedPaper, setSelectedPaper] = useState<string | null>(null);
  const { generatePracticeSet, is_loading, error } = usePractice();
  const { showNotification } = useNotification();

  const handleStartPractice = async () => {
    if (!selectedPaper) {
      showNotification('Please select a paper', 'error');
      return;
    }

    try {
      await generatePracticeSet(selectedPaper);
      showNotification(`Practice set generated for ${selectedPaper}`, 'success');
      onPracticeStart?.(selectedPaper);
    } catch (err) {
      showNotification('Failed to generate practice set', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Select a Paper</h1>
          <p className="text-lg text-gray-600">
            Choose a JAIIB paper to start your practice session
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {PAPERS.map((paper) => (
            <button
              key={paper.id}
              onClick={() => setSelectedPaper(paper.id)}
              className={`p-6 rounded-lg border-2 transition-all duration-200 text-left ${
                selectedPaper === paper.id
                  ? 'border-indigo-600 bg-indigo-50 shadow-lg'
                  : 'border-gray-200 bg-white hover:border-indigo-300 hover:shadow-md'
              }`}
            >
              <div className="flex items-start">
                <div
                  className={`w-6 h-6 rounded-full border-2 mr-4 mt-1 flex items-center justify-center ${
                    selectedPaper === paper.id
                      ? 'border-indigo-600 bg-indigo-600'
                      : 'border-gray-300'
                  }`}
                >
                  {selectedPaper === paper.id && (
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{paper.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{paper.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleStartPractice}
            disabled={!selectedPaper || is_loading}
            className={`px-8 py-3 rounded-lg font-semibold text-white transition-all duration-200 flex items-center gap-2 ${
              !selectedPaper || is_loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95'
            }`}
          >
            {is_loading ? (
              <>
                <LoadingSpinner size="sm" />
                Generating...
              </>
            ) : (
              'Start Practice'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
