import React, { useState } from 'react';
import { MCQFormData } from '../../types/index';

interface MCQFormProps {
  onSubmit: (data: MCQFormData) => Promise<void>;
  initial_data?: MCQFormData;
  is_loading?: boolean;
  is_edit?: boolean;
}

const MCQForm: React.FC<MCQFormProps> = ({ onSubmit, initial_data, is_loading = false, is_edit = false }) => {
  const [form_data, setFormData] = useState<MCQFormData>(
    initial_data || {
      question_text: '',
      options: ['', '', '', ''],
      correct_answer: 'A',
      topic: '',
      difficulty: 'medium',
      rbi_reference: '',
      iibf_reference: '',
    }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate_form = (): boolean => {
    const new_errors: Record<string, string> = {};

    if (!form_data.question_text.trim()) {
      new_errors.question_text = 'Question text is required';
    }

    form_data.options.forEach((option, index) => {
      if (!option.trim()) {
        new_errors[`option_${index}`] = `Option ${String.fromCharCode(65 + index)} is required`;
      }
    });

    if (!form_data.topic.trim()) {
      new_errors.topic = 'Topic is required';
    }

    setErrors(new_errors);
    return Object.keys(new_errors).length === 0;
  };

  const handle_submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate_form()) {
      return;
    }

    try {
      await onSubmit(form_data);
    } catch (err) {
      console.error('Form submission error:', err);
    }
  };

  const handle_option_change = (index: number, value: string) => {
    const new_options = [...form_data.options] as [string, string, string, string];
    new_options[index] = value;
    setFormData({ ...form_data, options: new_options });
    if (errors[`option_${index}`]) {
      setErrors({ ...errors, [`option_${index}`]: '' });
    }
  };

  return (
    <form onSubmit={handle_submit} className="bg-white rounded-lg shadow p-6 space-y-6">
      {/* Question Text */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">Question Text *</label>
        <textarea
          value={form_data.question_text}
          onChange={(e) => {
            setFormData({ ...form_data, question_text: e.target.value });
            if (errors.question_text) setErrors({ ...errors, question_text: '' });
          }}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter the question text"
        />
        {errors.question_text && <p className="text-red-600 text-sm mt-1">{errors.question_text}</p>}
      </div>

      {/* Options */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-900">Options *</label>
        {form_data.options.map((option, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 text-blue-600 rounded flex items-center justify-center font-bold">
              {String.fromCharCode(65 + index)}
            </div>
            <div className="flex-grow">
              <input
                type="text"
                value={option}
                onChange={(e) => handle_option_change(index, e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={`Option ${String.fromCharCode(65 + index)}`}
              />
              {errors[`option_${index}`] && <p className="text-red-600 text-sm mt-1">{errors[`option_${index}`]}</p>}
            </div>
            <div className="flex-shrink-0">
              <input
                type="radio"
                name="correct_answer"
                value={String.fromCharCode(65 + index)}
                checked={form_data.correct_answer === String.fromCharCode(65 + index)}
                onChange={(e) => setFormData({ ...form_data, correct_answer: e.target.value as 'A' | 'B' | 'C' | 'D' })}
                className="w-5 h-5 text-green-600"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Topic and Difficulty */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">Topic *</label>
          <input
            type="text"
            value={form_data.topic}
            onChange={(e) => {
              setFormData({ ...form_data, topic: e.target.value });
              if (errors.topic) setErrors({ ...errors, topic: '' });
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Banking Regulations"
          />
          {errors.topic && <p className="text-red-600 text-sm mt-1">{errors.topic}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">Difficulty Level</label>
          <select
            value={form_data.difficulty}
            onChange={(e) => setFormData({ ...form_data, difficulty: e.target.value as 'easy' | 'medium' | 'hard' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>

      {/* References */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">RBI Reference</label>
          <input
            type="text"
            value={form_data.rbi_reference || ''}
            onChange={(e) => setFormData({ ...form_data, rbi_reference: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., RBI Circular 2023/001"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">IIBF Reference</label>
          <input
            type="text"
            value={form_data.iibf_reference || ''}
            onChange={(e) => setFormData({ ...form_data, iibf_reference: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., IIBF Module 5"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={is_loading}
          className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-medium"
        >
          {is_loading ? 'Saving...' : is_edit ? 'Update Question' : 'Create Question'}
        </button>
      </div>
    </form>
  );
};

export default MCQForm;
