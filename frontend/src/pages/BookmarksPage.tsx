import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useBookmarks, BookmarkedQuestion } from '../hooks/useBookmarks';
import { ExplanationDisplay } from '../components/Practice/ExplanationDisplay';

const BookmarksPage: React.FC = () => {
  const { user } = useAuth();
  const { bookmarks, removeBookmark, clearAllBookmarks, count } = useBookmarks(user?.user_id || 'anonymous');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterPaper, setFilterPaper] = useState<string>('all');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Get unique papers for filter
  const papers = Array.from(new Set(bookmarks.map((b) => b.paper_name).filter(Boolean)));

  // Apply filter
  const filtered = filterPaper === 'all'
    ? bookmarks
    : bookmarks.filter((b) => b.paper_name === filterPaper);

  // Sort by most recently bookmarked
  const sorted = [...filtered].sort(
    (a, b) => new Date(b.bookmarked_at).getTime() - new Date(a.bookmarked_at).getTime()
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Saved Questions</h1>
          <p className="text-gray-600 mt-1">{count} question{count !== 1 ? 's' : ''} bookmarked for revision</p>
        </div>
        {count > 0 && (
          <button
            onClick={() => setShowClearConfirm(true)}
            className="px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Filter Bar */}
      {papers.length > 1 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-600 font-medium">Filter:</span>
          <button
            onClick={() => setFilterPaper('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-full transition ${
              filterPaper === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All ({count})
          </button>
          {papers.map((paper) => {
            const paperCount = bookmarks.filter((b) => b.paper_name === paper).length;
            return (
              <button
                key={paper}
                onClick={() => setFilterPaper(paper)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full transition ${
                  filterPaper === paper
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {paper} ({paperCount})
              </button>
            );
          })}
        </div>
      )}

      {/* Bookmarked Questions List */}
      {sorted.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <p className="text-4xl mb-4">☆</p>
          <p className="text-gray-700 font-medium text-lg">No saved questions yet</p>
          <p className="text-gray-500 text-sm mt-2">
            Tap the ☆ Save button during practice to bookmark tricky questions for later revision.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sorted.map((q, idx) => (
            <BookmarkCard
              key={q.question_id}
              question={q}
              index={idx + 1}
              isExpanded={expandedId === q.question_id}
              onToggleExpand={() =>
                setExpandedId(expandedId === q.question_id ? null : q.question_id)
              }
              onRemove={() => removeBookmark(q.question_id)}
            />
          ))}
        </div>
      )}

      {/* Clear Confirmation */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Clear all bookmarks?</h3>
            <p className="text-gray-600 text-sm mb-6">
              This will remove all {count} saved questions. This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  clearAllBookmarks();
                  setShowClearConfirm(false);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Individual bookmark card component
interface BookmarkCardProps {
  question: BookmarkedQuestion;
  index: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onRemove: () => void;
}

const BookmarkCard: React.FC<BookmarkCardProps> = ({
  question,
  index,
  isExpanded,
  onToggleExpand,
  onRemove,
}) => {
  const difficultyColor =
    question.difficulty === 'hard'
      ? 'bg-red-100 text-red-700'
      : question.difficulty === 'medium'
      ? 'bg-yellow-100 text-yellow-700'
      : 'bg-green-100 text-green-700';

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div
        className="p-4 md:p-5 cursor-pointer hover:bg-gray-50 transition"
        onClick={onToggleExpand}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-xs font-medium text-gray-500">#{index}</span>
              {question.paper_name && (
                <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                  {question.paper_name}
                </span>
              )}
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${difficultyColor}`}>
                {question.difficulty}
              </span>
              {question.topic && (
                <span className="text-xs text-gray-500 truncate max-w-[200px]">
                  {question.topic}
                </span>
              )}
            </div>
            <p className="text-sm md:text-base text-gray-900 leading-relaxed">
              {question.question_text}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
              title="Remove bookmark"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <span className={`text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-gray-200 p-4 md:p-5 bg-gray-50">
          {/* Options */}
          <div className="space-y-2 mb-4">
            {Object.entries(question.options).map(([key, value]) => {
              const isCorrect = key === question.correct_answer;
              return (
                <div
                  key={key}
                  className={`flex items-start gap-2 px-3 py-2 rounded-lg text-sm ${
                    isCorrect
                      ? 'bg-green-100 text-green-800 font-medium border border-green-200'
                      : 'bg-white text-gray-700 border border-gray-200'
                  }`}
                >
                  <span className="font-semibold shrink-0">{key}.</span>
                  <span>{value}</span>
                  {isCorrect && <span className="ml-auto shrink-0 text-green-600 font-bold">✓</span>}
                </div>
              );
            })}
          </div>

          {/* Correct Answer Badge */}
          <div className="mb-4">
            <span className="text-sm text-gray-600">
              Correct Answer: <span className="font-bold text-green-700">{question.correct_answer}</span>
            </span>
          </div>

          {/* AI Explanation */}
          <ExplanationDisplay
            questionId={question.question_id}
            questionText={question.question_text}
            correctAnswer={question.correct_answer}
            options={question.options}
            isCorrect={false}
          />

          {/* Meta info */}
          <p className="text-xs text-gray-400 mt-4">
            Saved on {new Date(question.bookmarked_at).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </p>
        </div>
      )}
    </div>
  );
};

export default BookmarksPage;
