
import React from 'react';
import { TextBlock } from './TextBlock';
import { ImageBlock } from './ImageBlock';
import { VideoBlock } from './VideoBlock';

interface Block {
  id: string;
  type: 'text' | 'image' | 'video';
  data: any;
  order: number;
}

interface BlockRendererProps {
  blocks: Block[];
}

export const BlockRenderer: React.FC<BlockRendererProps> = ({ blocks }) => {
  const sortedBlocks = blocks.sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-4">
      {sortedBlocks.map((block) => {
        switch (block.type) {
          case 'text':
            return <TextBlock key={block.id} data={block.data} />;
          case 'image':
            return <ImageBlock key={block.id} data={block.data} />;
          case 'video':
            return <VideoBlock key={block.id} data={block.data} />;
          default:
            return (
              <div key={block.id} className="p-4 bg-slate-100 rounded-lg">
                <p className="text-slate-600">Tipo di blocco non supportato: {block.type}</p>
              </div>
            );
        }
      })}
    </div>
  );
};
