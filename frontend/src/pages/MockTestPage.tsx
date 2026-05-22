import React, { useState } from 'react';
import { usePractice } from '../context/PracticeContext';
import { useDashboard } from '../context/DashboardContext';
import QuestionDisplay from '../components/Practice/QuestionDisplay';
import MockTestResults from '../components/Practice/MockTestResults';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/Select';

const PAPERS = ['IE & IFS', 'PPB', 'AFM', 'RBWM'];

const MockTestPage: React.FC = () => {
  const { current_session, session_result, is_loading, error, generatePracticeSet, submitPracticeSet, clearSession } = usePractice();
  const { fetchDashboardData } = useDashboard();
  const [selectedPaper, setSelectedPaper] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStartMockTest = async () => {
    if (!selectedPaper) {
      alert('Please select a paper');
      return;
    }
    try {
      await generatePracticeSet(selectedPaper, 'mock_test');
    } catch (err) {
      console.error('Failed to generate mock test:', err);
    }
  };

  const handleAnswerQuestion = (questionId: string, answer: string) => {
    console.log(`Question ${questionId} answered with ${answer}`);
  };

  const handleSubmitMockTest = async (answers: Record<string, string>) => {
    if (!current_session) return;
    
    setIsSubmitting(true);
    try {
      await submitPracticeSet(current_session.session_id, answers, () => {
        fetchDashboardData().catch(() => {});
      });
    } catch (err) {
      console.error('Failed to submit mock test:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (is_loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <p className="text-gray-600 font-medium">Generating your mock test...</p>
        <p className="text-gray-400 text-sm">Preparing 100 questions with exam-level difficulty</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mock Test</h1>
        <p className="text-gray-600 mt-2">Simulate the real JAIIB exam with proper weightage</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {!current_session ? (
        <div className="max-w-lg mx-auto">
          {/* Exam Info Card */}
          <div className="card mb-6">
            <h2 className="text-xl font-bold mb-4 text-indigo-900">📝 JAIIB Mock Test Format</h2>
            <div className="bg-indigo-50 rounded-lg p-4 mb-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-indigo-700 font-semibold">
                    <th className="pb-2">Difficulty</th>
                    <th className="pb-2">Questions</th>
                    <th className="pb-2">Marks Each</th>
                    <th className="pb-2">Total</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  <tr>
                    <td className="py-1">🟢 Easy</td>
                    <td>50</td>
                    <td>0.5</td>
                    <td>25</td>
                  </tr>
                  <tr>
                    <td className="py-1">🟡 Medium</td>
                    <td>25</td>
                    <td>1.0</td>
                    <td>25</td>
                  </tr>
                  <tr>
                    <td className="py-1">🔴 Hard</td>
                    <td>25</td>
                    <td>2.0</td>
                    <td>50</td>
                  </tr>
                  <tr className="font-bold border-t border-indigo-200">
                    <td className="pt-2">Total</td>
                    <td className="pt-2">100</td>
                    <td className="pt-2">—</td>
                    <td className="pt-2">100</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">⏱ 120 minutes</span>
              <span className="flex items-center gap-1">✅ Pass: 50 marks</span>
              <span className="flex items-center gap-1">❌ No negative marking</span>
            </div>
          </div>

          {/* Paper Selection */}
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Select Paper</h2>
            <Select value={selectedPaper} onValueChange={setSelectedPaper}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a paper..." />
              </SelectTrigger>
              <SelectContent>
                {PAPERS.map((paper) => (
                  <SelectItem key={paper} value={paper}>{paper}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <button
              onClick={handleStartMockTest}
              disabled={!selectedPaper || is_loading}
              className="w-full mt-6 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              🎯 Start Mock Test
            </button>
          </div>
        </div>
      ) : session_result ? (
        <MockTestResults 
          result={session_result} 
          onBack={clearSession} 
        />
      ) : (
        <QuestionDisplay
          session={current_session}
          onAnswer={handleAnswerQuestion}
          onSubmit={handleSubmitMockTest}
          isSubmitting={isSubmitting}
          isMockTest={true}
        />
      )}
    </div>
  );
};

export default MockTestPage;
