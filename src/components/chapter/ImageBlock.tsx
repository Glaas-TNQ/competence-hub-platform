
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
    <div className="mb-8">
      {data.title && (
        <h3 className="text-xl font-semibold text-foreground mb-4">
          {data.title}
        </h3>
      )}
      {data.imageUrl && (
        <div className="w-full max-w-4xl mx-auto">
          <div className="aspect-video bg-muted rounded-xl overflow-hidden border border-border shadow-sm">
            <img 
              src={data.imageUrl} 
              alt={data.description || 'Course content image'}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}
      {data.description && (
        <p className="text-sm text-muted-foreground mt-3 text-center italic">
          {data.description}
        </p>
      )}
    </div>
  );
};
