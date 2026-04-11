import React from 'react';

interface OptionButtonsProps {
  options: string[];
  selectedOption: string | null;
  onSelectOption: (option: string) => void;
  correctAnswer?: string;
  showResults?: boolean;
  userAnswer?: string;
}

export const OptionButtons: React.FC<OptionButtonsProps> = ({
  options,
  selectedOption,
  onSelectOption,
  correctAnswer,
  showResults = false,
  userAnswer,
}) => {
  const optionLabels = ['A', 'B', 'C', 'D'];

  const getOptionStyle = (index: number) => {
    const option = optionLabels[index];

    if (!showResults) {
      // Normal selection mode
      return selectedOption === option
        ? 'border-indigo-600 bg-indigo-50 border-2'
        : 'border-gray-300 bg-white border-2 hover:border-indigo-300';
    }

    // Results display mode
    if (option === correctAnswer) {
      return 'border-green-600 bg-green-50 border-2';
    }

    if (option === userAnswer && userAnswer !== correctAnswer) {
      return 'border-red-600 bg-red-50 border-2';
    }

    return 'border-gray-300 bg-gray-50 border-2 opacity-60';
  };

  const getIcon = (index: number) => {
    const option = optionLabels[index];

    if (!showResults) return null;

    if (option === correctAnswer) {
      return (
        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
      );
    }

    if (option === userAnswer && userAnswer !== correctAnswer) {
      return (
        <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
      );
    }

    return null;
  };

  return (
    <div className="space-y-3">
      {options.map((option, index) => (
        <button
          key={index}
          onClick={() => !showResults && onSelectOption(optionLabels[index])}
          disabled={showResults}
          className={`w-full p-4 rounded-lg text-left transition-all duration-200 flex items-center justify-between ${getOptionStyle(index)} ${
            showResults ? 'cursor-default' : 'cursor-pointer'
          }`}
        >
          <div className="flex items-center gap-4 flex-1">
            <span className="font-bold text-lg text-gray-700 min-w-8">{optionLabels[index]}.</span>
            <span className="text-gray-800">{option}</span>
          </div>
          {getIcon(index)}
        </button>
      ))}
    </div>
  );
};
