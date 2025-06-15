
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useCreateNote } from '@/hooks/useUserNotes';
import { BookOpen, Bookmark, Edit, Plus, X } from 'lucide-react';

interface InlineNoteCreatorProps {
  courseId: string;
  chapterIndex: number;
  positionData?: any;
  onNoteCreated?: () => void;
  className?: string;
}

export const InlineNoteCreator: React.FC<InlineNoteCreatorProps> = ({
  courseId,
  chapterIndex,
  positionData,
  onNoteCreated,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState('');
  const [noteType, setNoteType] = useState<'personal' | 'bookmark' | 'highlight'>('personal');
  const [isShared, setIsShared] = useState(false);
  
  const createNote = useCreateNote();

  const handleCreateNote = async () => {
    if (!content.trim()) return;

    try {
      await createNote.mutateAsync({
        content,
        note_type: noteType,
        is_shared: isShared,
        course_id: courseId,
        chapter_index: chapterIndex,
        position_data: positionData,
      });
      
      setContent('');
      setIsOpen(false);
      setIsShared(false);
      setNoteType('personal');
      onNoteCreated?.();
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  const handleCancel = () => {
    setContent('');
    setIsOpen(false);
    setIsShared(false);
    setNoteType('personal');
  };

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className={`flex items-center gap-2 ${className}`}
      >
        <Plus className="h-4 w-4" />
        Aggiungi Nota
      </Button>
    );
  }

  return (
    <Card className={`w-full max-w-md ${className}`}>
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium">Nuova Nota</h4>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex gap-1">
          <Button
            variant={noteType === 'personal' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setNoteType('personal')}
            className="h-8 px-2"
          >
            <Edit className="h-3 w-3 mr-1" />
            Nota
          </Button>
          <Button
            variant={noteType === 'bookmark' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setNoteType('bookmark')}
            className="h-8 px-2"
          >
            <Bookmark className="h-3 w-3 mr-1" />
            Bookmark
          </Button>
          <Button
            variant={noteType === 'highlight' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setNoteType('highlight')}
            className="h-8 px-2"
          >
            <BookOpen className="h-3 w-3 mr-1" />
            Highlight
          </Button>
        </div>

        <Textarea
          placeholder="Scrivi la tua nota..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[80px] text-sm"
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Switch
              id="inline-share"
              checked={isShared}
              onCheckedChange={setIsShared}
            />
            <label htmlFor="inline-share" className="text-xs text-gray-600">
              Condividi
            </label>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
              className="h-8 px-3 text-xs"
            >
              Annulla
            </Button>
            <Button
              size="sm"
              onClick={handleCreateNote}
              disabled={!content.trim() || createNote.isPending}
              className="h-8 px-3 text-xs"
            >
              {createNote.isPending ? 'Salvando...' : 'Salva'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
