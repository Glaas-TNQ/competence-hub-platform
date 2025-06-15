
import React from 'react';

interface ImageBlockProps {
  data: {
    imageUrl?: string;
    description?: string;
    title?: string;
  };
}

export const ImageBlock: React.FC<ImageBlockProps> = ({ data }) => {
  return (
    <div className="mb-6">
      {data.title && (
        <h3 className="text-xl font-semibold text-slate-800 mb-3">
          {data.title}
        </h3>
      )}
      {data.imageUrl && (
        <div className="rounded-lg overflow-hidden border border-slate-200">
          <img 
            src={data.imageUrl} 
            alt={data.description || 'Course content image'}
            className="w-full h-auto"
          />
        </div>
      )}
      {data.description && (
        <p className="text-sm text-slate-600 mt-2 italic">
          {data.description}
        </p>
      )}
    </div>
  );
};
