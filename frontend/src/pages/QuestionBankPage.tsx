import React, { useState, useEffect } from 'react';
import { Question, QuestionBankSearchParams, QuestionBankVersion, MCQFormData } from '../types/index';
import { apiClient } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import MCQForm from '../components/QuestionBank/MCQForm';
import QuestionSearchFilter from '../components/QuestionBank/QuestionSearchFilter';
import QuestionList from '../components/QuestionBank/QuestionList';
import VersionHistory from '../components/QuestionBank/VersionHistory';

type TabType = 'browse' | 'create' | 'versions';

const QuestionBankPage: React.FC = () => {
  const [active_tab, setActiveTab] = useState<TabType>('browse');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [versions, setVersions] = useState<QuestionBankVersion[]>([]);
  const [is_loading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success_message, setSuccessMessage] = useState<string | null>(null);
  const [editing_question, setEditingQuestion] = useState<Question | null>(null);

  useEffect(() => {
    if (active_tab === 'browse') {
      fetch_questions({});
    } else if (active_tab === 'versions') {
      fetch_versions();
    }
  }, [active_tab]);

  const fetch_questions = async (params: QuestionBankSearchParams) => {
    setIsLoading(true);
    setError(null);
    try {
      const query_params = new URLSearchParams();
      if (params.paper) query_params.append('paper', params.paper);
      if (params.topic) query_params.append('topic', params.topic);
      if (params.difficulty) query_params.append('difficulty', params.difficulty);
      if (params.keyword) query_params.append('keyword', params.keyword);

      const response = await apiClient.get<{ questions: Question[] }>(
        `/questions/search?${query_params.toString()}`
      );

      if (response.success && response.data) {
        setQuestions(response.data.questions);
      } else {
        throw new Error(response.error || 'Failed to fetch questions');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch questions';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const fetch_versions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<{ versions: QuestionBankVersion[] }>('/questions/versions');

      if (response.success && response.data) {
        setVersions(response.data.versions);
      } else {
        throw new Error(response.error || 'Failed to fetch versions');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch versions';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handle_create_question = async (data: MCQFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.post('/questions/create', data);

      if (response.success) {
        setSuccessMessage('Question created successfully!');
        setActiveTab('browse');
        fetch_questions({});
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        throw new Error(response.error || 'Failed to create question');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create question';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handle_update_question = async (data: MCQFormData) => {
    if (!editing_question) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.put(`/questions/${editing_question.id}`, data);

      if (response.success) {
        setSuccessMessage('Question updated successfully!');
        setEditingQuestion(null);
        setActiveTab('browse');
        fetch_questions({});
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        throw new Error(response.error || 'Failed to update question');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update question';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handle_delete_question = async (question_id: string) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.delete(`/questions/${question_id}`);

      if (response.success) {
        setSuccessMessage('Question deleted successfully!');
        fetch_questions({});
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        throw new Error(response.error || 'Failed to delete question');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete question';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handle_rollback = async (version_id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.post('/questions/version/rollback', { version_id });

      if (response.success) {
        setSuccessMessage('Rollback completed successfully!');
        fetch_versions();
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        throw new Error(response.error || 'Failed to rollback version');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to rollback version';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Question Bank Management</h1>
        <p className="text-gray-600 mt-2">Manage MCQs, versions, and question bank content</p>
      </div>

      {/* Success Message */}
      {success_message && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700">{success_message}</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200">
        <button
          onClick={() => {
            setActiveTab('browse');
            setEditingQuestion(null);
          }}
          className={`px-4 py-2 font-medium border-b-2 ${
            active_tab === 'browse'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Browse Questions
        </button>
        <button
          onClick={() => setActiveTab('create')}
          className={`px-4 py-2 font-medium border-b-2 ${
            active_tab === 'create'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          {editing_question ? 'Edit Question' : 'Create Question'}
        </button>
        <button
          onClick={() => setActiveTab('versions')}
          className={`px-4 py-2 font-medium border-b-2 ${
            active_tab === 'versions'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Version History
        </button>
      </div>

      {/* Tab Content */}
      {is_loading && active_tab === 'browse' && <LoadingSpinner />}

      {active_tab === 'browse' && !is_loading && (
        <>
          <QuestionSearchFilter onSearch={fetch_questions} is_loading={is_loading} />
          <QuestionList
            questions={questions}
            onEdit={(q) => {
              setEditingQuestion(q);
              setActiveTab('create');
            }}
            onDelete={handle_delete_question}
            is_loading={is_loading}
          />
        </>
      )}

      {active_tab === 'create' && (
        <MCQForm
          onSubmit={editing_question ? handle_update_question : handle_create_question}
          initial_data={
            editing_question
              ? {
                  question_text: editing_question.question_text,
                  options: editing_question.options as [string, string, string, string],
                  correct_answer: editing_question.correct_answer as 'A' | 'B' | 'C' | 'D',
                  topic: editing_question.topic,
                  difficulty: editing_question.difficulty,
                  rbi_reference: editing_question.rbi_reference,
                  iibf_reference: editing_question.iibf_reference,
                }
              : undefined
          }
          is_loading={is_loading}
          is_edit={!!editing_question}
        />
      )}

      {active_tab === 'versions' && (
        <>
          {is_loading ? (
            <LoadingSpinner />
          ) : (
            <VersionHistory versions={versions} onRollback={handle_rollback} is_loading={is_loading} />
          )}
        </>
      )}
    </div>
  );
};

export default QuestionBankPage;
