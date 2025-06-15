
import React from 'react';
import { Play } from 'lucide-react';

interface VideoBlockProps {
  data: {
    videoUrl?: string;
    title?: string;
    description?: string;
  };
}

export const VideoBlock: React.FC<VideoBlockProps> = ({ data }) => {
  const getEmbedUrl = (url: string) => {
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
  };

  return (
    <div className="mb-8">
      {data.title && (
        <h3 className="text-xl font-semibold text-foreground mb-4">
          {data.title}
        </h3>
      )}
      <div className="w-full max-w-4xl mx-auto">
        {data.videoUrl ? (
          <div className="aspect-video bg-black rounded-xl overflow-hidden border border-border shadow-lg">
            <iframe
              src={getEmbedUrl(data.videoUrl)}
              title={data.title || 'Course video'}
              className="w-full h-full"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>
        ) : (
          <div className="aspect-video bg-muted rounded-xl flex items-center justify-center border-2 border-dashed border-border">
            <div className="text-center">
              <Play size={48} className="mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground font-medium">Video non disponibile</p>
            </div>
          </div>
        )}
      </div>
      {data.description && (
        <p className="text-sm text-muted-foreground mt-3 text-center">
          {data.description}
        </p>
      )}
    </div>
  );
};
