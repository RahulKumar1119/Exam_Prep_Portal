import React from 'react';

/**
 * Minimal rich-text renderer for question text and options.
 * Supports fenced code blocks (```...```) and `inline code` —
 * the exact markup the question generators emit. No dependencies.
 */
function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  const parts = text.split(/(`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      return (
        <code
          key={`${keyPrefix}-c${i}`}
          className="font-mono text-[0.9em] bg-gray-100 text-gray-900 px-1.5 py-0.5 rounded border border-gray-200 whitespace-pre-wrap break-words"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return <React.Fragment key={`${keyPrefix}-t${i}`}>{part}</React.Fragment>;
  });
}

const RichText: React.FC<{ text: string; className?: string }> = ({ text, className = '' }) => {
  const blocks = text.split(/```(?:\w*\n)?([\s\S]*?)```/g);

  // No fenced blocks — render inline code only.
  if (blocks.length === 1) {
    return <span className={className}>{renderInline(text, 'b0')}</span>;
  }

  return (
    <span className={className}>
      {blocks.map((block, i) => {
        if (i % 2 === 1) {
          // Fenced code block.
          return (
            <pre
              key={`code${i}`}
              className="font-mono text-[0.85em] leading-relaxed bg-gray-900 text-gray-100 rounded-lg p-3 my-2 overflow-x-auto whitespace-pre"
            >
              {block.replace(/^\n|\n$/, '')}
            </pre>
          );
        }
        return (
          <React.Fragment key={`txt${i}`}>
            {renderInline(block, `t${i}`)}
          </React.Fragment>
        );
      })}
    </span>
  );
};

export default RichText;
