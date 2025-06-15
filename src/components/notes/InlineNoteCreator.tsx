
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useCreateNote } from '@/hooks/useUserNotes';
import { BookOpen, Bookmark, FileText, Plus, X, Send } from 'lucide-react';

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
        size="default"
        onClick={() => setIsOpen(true)}
        className={`gap-2 border-dashed hover:border-solid transition-all ${className}`}
      >
        <Plus className="h-4 w-4" />
        Aggiungi una nota veloce
      </Button>
    );
  }

  return (
    <div className={`bg-card/80 border border-border rounded-xl p-6 space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold text-foreground">Nuova Nota</h4>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCancel}
          className="h-8 w-8 p-0 hover:bg-muted"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex gap-2">
        <Button
          variant={noteType === 'personal' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setNoteType('personal')}
          className="gap-2"
        >
          <FileText className="h-4 w-4" />
          Nota Personale
        </Button>
        <Button
          variant={noteType === 'bookmark' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setNoteType('bookmark')}
          className="gap-2"
        >
          <Bookmark className="h-4 w-4" />
          Bookmark
        </Button>
        <Button
          variant={noteType === 'highlight' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setNoteType('highlight')}
          className="gap-2"
        >
          <BookOpen className="h-4 w-4" />
          Highlight
        </Button>
      </div>

      <Textarea
        placeholder="Scrivi la tua nota qui..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="min-h-[120px] resize-none focus:ring-2"
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Switch
            id="inline-share"
            checked={isShared}
            onCheckedChange={setIsShared}
          />
          <label htmlFor="inline-share" className="text-sm text-muted-foreground">
            Condividi con altri studenti
          </label>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            size="default"
            onClick={handleCancel}
          >
            Annulla
          </Button>
          <Button
            size="default"
            onClick={handleCreateNote}
            disabled={!content.trim() || createNote.isPending}
            className="gap-2"
          >
            {createNote.isPending ? (
              'Salvando...'
            ) : (
              <>
                <Send className="h-4 w-4" />
                Salva Nota
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
