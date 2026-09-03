import React, { useState } from 'react';
import { MCQFormData, QuestionType } from '../../types/index';

interface MCQFormProps {
  onSubmit: (data: MCQFormData) => Promise<void>;
  initial_data?: MCQFormData;
  is_loading?: boolean;
  is_edit?: boolean;
}

// Types the admin form can author directly. drag_drop / hot_area / case_study
// need richer editors and are produced by the generator instead (issue #51).
const AUTHORABLE_TYPES: { value: QuestionType; label: string }[] = [
  { value: 'single_choice', label: 'Single choice (pick one)' },
  { value: 'multi_select', label: 'Multi-select (pick 2+)' },
  { value: 'yes_no', label: 'Yes/No statements' },
  { value: 'build_list', label: 'Build list (ordering)' },
];

const LETTERS = ['A', 'B', 'C', 'D'];

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
      question_type: 'single_choice',
      correct_answers: [],
      statements: ['', '', ''],
      correct_order: ['', '', ''],
    }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const qType: QuestionType = form_data.question_type || 'single_choice';
  const isChoice = qType === 'single_choice' || qType === 'multi_select';

  const validate_form = (): boolean => {
    const e: Record<string, string> = {};

    if (!form_data.question_text.trim()) e.question_text = 'Question text is required';
    if (!form_data.topic.trim()) e.topic = 'Topic is required';

    if (isChoice) {
      form_data.options.forEach((option, index) => {
        if (!option.trim()) e[`option_${index}`] = `Option ${LETTERS[index]} is required`;
      });
      if (qType === 'multi_select' && (form_data.correct_answers?.length || 0) < 2) {
        e.correct_answers = 'Select at least 2 correct options';
      }
    } else if (qType === 'yes_no') {
      const stmts = form_data.statements || [];
      const filled = stmts.filter((s) => s.trim());
      if (filled.length < 2) e.statements = 'Add at least 2 statements';
      const answers = form_data.correct_answers || [];
      if (answers.length !== stmts.length || answers.some((a) => a !== 'Yes' && a !== 'No')) {
        e.statements = 'Set Yes/No for every statement';
      }
    } else if (qType === 'build_list') {
      const steps = (form_data.correct_order || []).filter((s) => s.trim());
      if (steps.length < 2) e.correct_order = 'Add at least 2 ordered steps';
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handle_submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate_form()) return;

    // Build a payload trimmed to the fields relevant for the chosen type.
    const payload: MCQFormData = {
      question_text: form_data.question_text.trim(),
      topic: form_data.topic.trim(),
      difficulty: form_data.difficulty,
      rbi_reference: form_data.rbi_reference,
      iibf_reference: form_data.iibf_reference,
      question_type: qType,
      options: ['', '', '', ''],
      correct_answer: 'A',
    };

    if (qType === 'single_choice') {
      payload.options = form_data.options;
      payload.correct_answer = form_data.correct_answer;
    } else if (qType === 'multi_select') {
      payload.options = form_data.options;
      const answers = [...(form_data.correct_answers || [])].sort();
      payload.correct_answers = answers;
      payload.correct_answer = answers.join(',') as MCQFormData['correct_answer'];
    } else if (qType === 'yes_no') {
      payload.statements = (form_data.statements || []).filter((s) => s.trim());
      payload.correct_answers = form_data.correct_answers || [];
    } else if (qType === 'build_list') {
      payload.correct_order = (form_data.correct_order || []).filter((s) => s.trim());
    }

    try {
      await onSubmit(payload);
    } catch (err) {
      console.error('Form submission error:', err);
    }
  };

  const handle_option_change = (index: number, value: string) => {
    const new_options = [...form_data.options] as [string, string, string, string];
    new_options[index] = value;
    setFormData({ ...form_data, options: new_options });
    if (errors[`option_${index}`]) setErrors({ ...errors, [`option_${index}`]: '' });
  };

  const toggle_multi = (letter: string) => {
    const set = new Set(form_data.correct_answers || []);
    if (set.has(letter)) set.delete(letter);
    else set.add(letter);
    setFormData({ ...form_data, correct_answers: Array.from(set) });
    if (errors.correct_answers) setErrors({ ...errors, correct_answers: '' });
  };

  const set_statement = (i: number, value: string) => {
    const stmts = [...(form_data.statements || [])];
    stmts[i] = value;
    setFormData({ ...form_data, statements: stmts });
  };

  const set_statement_answer = (i: number, value: 'Yes' | 'No') => {
    const answers = [...(form_data.correct_answers || [])];
    while (answers.length < (form_data.statements || []).length) answers.push('Yes');
    answers[i] = value;
    setFormData({ ...form_data, correct_answers: answers });
  };

  const set_step = (i: number, value: string) => {
    const steps = [...(form_data.correct_order || [])];
    steps[i] = value;
    setFormData({ ...form_data, correct_order: steps });
  };

  const inputClass =
    'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent';

  return (
    <form onSubmit={handle_submit} className="bg-white rounded-lg shadow p-6 space-y-6">
      {/* Question Type */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">Question Type</label>
        <select
          value={qType}
          onChange={(e) => setFormData({ ...form_data, question_type: e.target.value as QuestionType })}
          className={inputClass}
          disabled={is_edit}
        >
          {AUTHORABLE_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
        {is_edit && <p className="text-xs text-gray-500 mt-1">Type can't be changed when editing.</p>}
      </div>

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
          className={inputClass}
          placeholder={
            qType === 'yes_no'
              ? 'Intro line, e.g. "For each statement, select Yes if true, otherwise No."'
              : 'Enter the question text'
          }
        />
        {errors.question_text && <p className="text-red-600 text-sm mt-1">{errors.question_text}</p>}
      </div>

      {/* Choice options (single_choice / multi_select) */}
      {isChoice && (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-900">
            Options * {qType === 'multi_select' ? '(check all correct answers)' : '(select the one correct answer)'}
          </label>
          {form_data.options.map((option, index) => {
            const letter = LETTERS[index];
            return (
              <div key={index} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 text-blue-600 rounded flex items-center justify-center font-bold">
                  {letter}
                </div>
                <div className="flex-grow">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handle_option_change(index, e.target.value)}
                    className={inputClass}
                    placeholder={`Option ${letter}`}
                  />
                  {errors[`option_${index}`] && <p className="text-red-600 text-sm mt-1">{errors[`option_${index}`]}</p>}
                </div>
                <div className="flex-shrink-0 pt-2.5">
                  {qType === 'multi_select' ? (
                    <input
                      type="checkbox"
                      checked={(form_data.correct_answers || []).includes(letter)}
                      onChange={() => toggle_multi(letter)}
                      className="w-5 h-5 text-green-600"
                      aria-label={`Mark option ${letter} correct`}
                    />
                  ) : (
                    <input
                      type="radio"
                      name="correct_answer"
                      value={letter}
                      checked={form_data.correct_answer === letter}
                      onChange={(e) =>
                        setFormData({ ...form_data, correct_answer: e.target.value as 'A' | 'B' | 'C' | 'D' })
                      }
                      className="w-5 h-5 text-green-600"
                    />
                  )}
                </div>
              </div>
            );
          })}
          {errors.correct_answers && <p className="text-red-600 text-sm">{errors.correct_answers}</p>}
        </div>
      )}

      {/* Yes/No statements */}
      {qType === 'yes_no' && (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-900">Statements * (set the correct Yes/No for each)</label>
          {(form_data.statements || []).map((stmt, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-8 h-10 flex items-center justify-center font-bold text-gray-600">
                {i + 1}.
              </span>
              <input
                type="text"
                value={stmt}
                onChange={(e) => set_statement(i, e.target.value)}
                className={inputClass}
                placeholder={`Statement ${i + 1}`}
              />
              <select
                value={(form_data.correct_answers || [])[i] || 'Yes'}
                onChange={(e) => set_statement_answer(i, e.target.value as 'Yes' | 'No')}
                className="flex-shrink-0 px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setFormData({
                ...form_data,
                statements: [...(form_data.statements || []), ''],
                correct_answers: [...(form_data.correct_answers || []), 'Yes'],
              })
            }
            className="text-sm text-blue-600 hover:underline"
          >
            + Add statement
          </button>
          {errors.statements && <p className="text-red-600 text-sm">{errors.statements}</p>}
        </div>
      )}

      {/* Build list / ordering */}
      {qType === 'build_list' && (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-900">Steps * (enter in the CORRECT order)</label>
          {(form_data.correct_order || []).map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-8 h-10 flex items-center justify-center font-bold text-gray-600">
                {i + 1}.
              </span>
              <input
                type="text"
                value={step}
                onChange={(e) => set_step(i, e.target.value)}
                className={inputClass}
                placeholder={`Step ${i + 1}`}
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() => setFormData({ ...form_data, correct_order: [...(form_data.correct_order || []), ''] })}
            className="text-sm text-blue-600 hover:underline"
          >
            + Add step
          </button>
          {errors.correct_order && <p className="text-red-600 text-sm">{errors.correct_order}</p>}
        </div>
      )}

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
            className={inputClass}
            placeholder="e.g., Banking Regulations"
          />
          {errors.topic && <p className="text-red-600 text-sm mt-1">{errors.topic}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">Difficulty Level</label>
          <select
            value={form_data.difficulty}
            onChange={(e) => setFormData({ ...form_data, difficulty: e.target.value as 'easy' | 'medium' | 'hard' })}
            className={inputClass}
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
            className={inputClass}
            placeholder="e.g., RBI Circular 2023/001"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">IIBF Reference</label>
          <input
            type="text"
            value={form_data.iibf_reference || ''}
            onChange={(e) => setFormData({ ...form_data, iibf_reference: e.target.value })}
            className={inputClass}
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
