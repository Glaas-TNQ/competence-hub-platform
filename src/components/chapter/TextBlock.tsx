
import React from 'react';

interface TextBlockProps {
  data: {
    text?: string;
    title?: string;
  };
}

export const TextBlock: React.FC<TextBlockProps> = ({ data }) => {
  return (
    <div className="mb-6">
      {data.title && (
        <h3 className="text-xl font-semibold text-slate-800 mb-3">
          {data.title}
        </h3>
      )}
      {data.text && (
        <div className="prose max-w-none text-slate-700 leading-relaxed">
          <p>{data.text}</p>
        </div>
      )}
    </div>
  );
};
