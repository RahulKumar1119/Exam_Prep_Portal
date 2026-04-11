import React, { useState } from 'react';
import { QuestionBankSearchParams } from '../../types/index';

interface QuestionSearchFilterProps {
  onSearch: (params: QuestionBankSearchParams) => void;
  is_loading?: boolean;
}

const QuestionSearchFilter: React.FC<QuestionSearchFilterProps> = ({ onSearch, is_loading = false }) => {
  const [search_params, setSearchParams] = useState<QuestionBankSearchParams>({
    paper: '',
    topic: '',
    difficulty: undefined,
    keyword: '',
  });

  const handle_search = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(search_params);
  };

  const handle_reset = () => {
    setSearchParams({
      paper: '',
      topic: '',
      difficulty: undefined,
      keyword: '',
    });
    onSearch({});
  };

  return (
    <form onSubmit={handle_search} className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Search & Filter Questions</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Paper Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Paper</label>
          <select
            value={search_params.paper || ''}
            onChange={(e) => setSearchParams({ ...search_params, paper: e.target.value || undefined })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Papers</option>
            <option value="IE & IFS">IE & IFS</option>
            <option value="PPB">PPB</option>
            <option value="AFB">AFB</option>
            <option value="RBWM">RBWM</option>
          </select>
        </div>

        {/* Topic Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Topic</label>
          <input
            type="text"
            value={search_params.topic || ''}
            onChange={(e) => setSearchParams({ ...search_params, topic: e.target.value || undefined })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Search by topic"
          />
        </div>

        {/* Difficulty Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
          <select
            value={search_params.difficulty || ''}
            onChange={(e) => setSearchParams({ ...search_params, difficulty: (e.target.value as any) || undefined })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Levels</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {/* Keyword Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Keyword</label>
          <input
            type="text"
            value={search_params.keyword || ''}
            onChange={(e) => setSearchParams({ ...search_params, keyword: e.target.value || undefined })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Search by keyword"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-end gap-2">
          <button
            type="submit"
            disabled={is_loading}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-medium"
          >
            Search
          </button>
          <button
            type="button"
            onClick={handle_reset}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
          >
            Reset
          </button>
        </div>
      </div>
    </form>
  );
};

export default QuestionSearchFilter;
