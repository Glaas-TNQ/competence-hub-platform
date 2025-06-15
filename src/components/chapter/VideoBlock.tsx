
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
    <div className="mb-6">
      {data.title && (
        <h3 className="text-xl font-semibold text-slate-800 mb-3">
          {data.title}
        </h3>
      )}
      {data.videoUrl ? (
        <div className="aspect-video bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
          <iframe
            src={getEmbedUrl(data.videoUrl)}
            title={data.title || 'Course video'}
            className="w-full h-full"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>
      ) : (
        <div className="aspect-video bg-slate-100 rounded-lg flex items-center justify-center border-2 border-dashed border-slate-300">
          <div className="text-center">
            <Play size={48} className="mx-auto text-slate-400 mb-2" />
            <p className="text-slate-600">Video non disponibile</p>
          </div>
        </div>
      )}
      {data.description && (
        <p className="text-sm text-slate-600 mt-2">
          {data.description}
        </p>
      )}
    </div>
  );
};
