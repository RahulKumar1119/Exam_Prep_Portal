import React from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

export const InlineMath: React.FC<{ math: string }> = ({ math }) => {
  const html = React.useMemo(() => {
    try {
      return katex.renderToString(math, { throwOnError: false, displayMode: false });
    } catch {
      return math;
    }
  }, [math]);
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
};

export const BlockMath: React.FC<{ math: string }> = ({ math }) => {
  const html = React.useMemo(() => {
    try {
      return katex.renderToString(math, { throwOnError: false, displayMode: true });
    } catch {
      return math;
    }
  }, [math]);
  return <div className="my-2 overflow-x-auto" dangerouslySetInnerHTML={{ __html: html }} />;
};
