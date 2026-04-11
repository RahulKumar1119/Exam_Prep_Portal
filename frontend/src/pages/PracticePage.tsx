import React, { useState } from 'react';
import { usePractice } from '../context/PracticeContext';
import LoadingSpinner from '../components/LoadingSpinner';

const PAPERS = ['IE & IFS', 'PPB', 'AFB', 'RBWM'];

const PracticePage: React.FC = () => {
  const { current_session, is_loading, error, generatePracticeSet, clearSession } = usePractice();
  const [selectedPaper, setSelectedPaper] = useState('');

  const handleGeneratePracticeSet = async () => {
    if (!selectedPaper) {
      alert('Please select a paper');
      return;
    }
    try {
      await generatePracticeSet(selectedPaper);
    } catch (err) {
      console.error('Failed to generate practice set:', err);
    }
  };

  if (is_loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Practice Sets</h1>
        <p className="text-gray-600 mt-2">Select a paper and start practicing</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {!current_session ? (
        <div className="card max-w-md">
          <h2 className="text-xl font-bold mb-4">Select a Paper</h2>
          <div className="space-y-3">
            {PAPERS.map((paper) => (
              <label key={paper} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="paper"
                  value={paper}
                  checked={selectedPaper === paper}
                  onChange={(e) => setSelectedPaper(e.target.value)}
                  className="w-4 h-4"
                />
                <span className="ml-3 font-medium text-gray-700">{paper}</span>
              </label>
            ))}
          </div>
          <button
            onClick={handleGeneratePracticeSet}
            disabled={!selectedPaper || is_loading}
            className="w-full btn-primary mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Generate Practice Set
          </button>
        </div>
      ) : (
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">{current_session.paper_name}</h2>
            <button
              onClick={clearSession}
              className="btn-secondary"
            >
              Back
            </button>
          </div>
          <p className="text-gray-600">Practice set loaded. Questions will be displayed here.</p>
        </div>
      )}
    </div>
  );
};

export default PracticePage;
