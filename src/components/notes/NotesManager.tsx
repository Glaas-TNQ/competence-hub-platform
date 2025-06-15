
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useUserNotes, useCreateNote, useUpdateNote, useDeleteNote } from '@/hooks/useUserNotes';
import { BookOpen, Bookmark, Edit, Trash2, Share2, Plus, FileText } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { it } from 'date-fns/locale';

interface NotesManagerProps {
  courseId?: string;
  chapterIndex?: number;
  className?: string;
}

export const NotesManager: React.FC<NotesManagerProps> = ({
  courseId,
  chapterIndex,
  className = '',
}) => {
  const { data: notes, isLoading } = useUserNotes(courseId, chapterIndex);
  const createNote = useCreateNote();
  const updateNote = useUpdateNote();
  const deleteNote = useDeleteNote();

  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteType, setNewNoteType] = useState<'personal' | 'bookmark' | 'highlight'>('personal');
  const [isShared, setIsShared] = useState(false);

  const handleCreateNote = async () => {
    if (!newNoteContent.trim()) return;

    try {
      await createNote.mutateAsync({
        content: newNoteContent,
        note_type: newNoteType,
        is_shared: isShared,
        course_id: courseId,
        chapter_index: chapterIndex,
      });
      
      setNewNoteContent('');
      setIsCreating(false);
      setIsShared(false);
      setNewNoteType('personal');
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  const handleUpdateNote = async (noteId: string, content: string, shared: boolean) => {
    try {
      await updateNote.mutateAsync({
        id: noteId,
        updates: { content, is_shared: shared },
      });
      setEditingId(null);
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (window.confirm('Sei sicuro di voler eliminare questa nota?')) {
      try {
        await deleteNote.mutateAsync(noteId);
      } catch (error) {
        console.error('Error deleting note:', error);
      }
    }
  };

  const getNoteIcon = (type: string) => {
    switch (type) {
      case 'bookmark':
        return <Bookmark className="h-4 w-4 text-yellow-600" />;
      case 'highlight':
        return <BookOpen className="h-4 w-4 text-blue-600" />;
      default:
        return <FileText className="h-4 w-4 text-slate-600" />;
    }
  };

  const getNoteTypeColor = (type: string) => {
    switch (type) {
      case 'bookmark':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'highlight':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-20 bg-muted/50 rounded-lg animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Add Note Button */}
      {!isCreating && (
        <Button
          onClick={() => setIsCreating(true)}
          variant="outline"
          size="sm"
          className="w-full gap-2 border-dashed"
        >
          <Plus className="h-4 w-4" />
          Aggiungi Nota
        </Button>
      )}

      {/* Create Note Form */}
      {isCreating && (
        <div className="bg-muted/30 rounded-xl p-4 border border-dashed border-border">
          <div className="space-y-4">
            <div className="flex gap-1">
              <Button
                variant={newNoteType === 'personal' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setNewNoteType('personal')}
                className="h-8 px-3 text-xs"
              >
                <FileText className="h-3 w-3 mr-1" />
                Nota
              </Button>
              <Button
                variant={newNoteType === 'bookmark' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setNewNoteType('bookmark')}
                className="h-8 px-3 text-xs"
              >
                <Bookmark className="h-3 w-3 mr-1" />
                Bookmark
              </Button>
              <Button
                variant={newNoteType === 'highlight' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setNewNoteType('highlight')}
                className="h-8 px-3 text-xs"
              >
                <BookOpen className="h-3 w-3 mr-1" />
                Highlight
              </Button>
            </div>

            <Textarea
              placeholder="Scrivi la tua nota..."
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              className="min-h-[80px] text-sm"
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch
                  id="share-note"
                  checked={isShared}
                  onCheckedChange={setIsShared}
                />
                <label htmlFor="share-note" className="text-xs text-muted-foreground">
                  Condividi
                </label>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsCreating(false);
                    setNewNoteContent('');
                    setIsShared(false);
                  }}
                  className="h-8 px-3 text-xs"
                >
                  Annulla
                </Button>
                <Button
                  size="sm"
                  onClick={handleCreateNote}
                  disabled={!newNoteContent.trim() || createNote.isPending}
                  className="h-8 px-3 text-xs"
                >
                  {createNote.isPending ? 'Salvando...' : 'Salva'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notes List */}
      <div className="space-y-3">
        {notes && notes.length > 0 ? (
          notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              isEditing={editingId === note.id}
              onEdit={setEditingId}
              onUpdate={handleUpdateNote}
              onDelete={handleDeleteNote}
              getNoteIcon={getNoteIcon}
              getNoteTypeColor={getNoteTypeColor}
            />
          ))
        ) : (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <h4 className="text-sm font-medium text-foreground mb-2">
              Nessuna nota trovata
            </h4>
            <p className="text-xs text-muted-foreground mb-4">
              Inizia a prendere note per questo capitolo.
            </p>
            <Button 
              onClick={() => setIsCreating(true)}
              size="sm"
              variant="outline"
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Crea la prima nota
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

interface NoteCardProps {
  note: any;
  isEditing: boolean;
  onEdit: (id: string | null) => void;
  onUpdate: (id: string, content: string, shared: boolean) => void;
  onDelete: (id: string) => void;
  getNoteIcon: (type: string) => React.ReactNode;
  getNoteTypeColor: (type: string) => string;
}

const NoteCard: React.FC<NoteCardProps> = ({
  note,
  isEditing,
  onEdit,
  onUpdate,
  onDelete,
  getNoteIcon,
  getNoteTypeColor,
}) => {
  const [editContent, setEditContent] = useState(note.content);
  const [editShared, setEditShared] = useState(note.is_shared);

  const handleSave = () => {
    onUpdate(note.id, editContent, editShared);
  };

  const handleCancel = () => {
    setEditContent(note.content);
    setEditShared(note.is_shared);
    onEdit(null);
  };

  return (
    <div className="bg-card/50 border border-border rounded-lg p-4 space-y-3 hover:bg-card/70 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2 flex-1">
          {getNoteIcon(note.note_type)}
          <Badge variant="secondary" className={`${getNoteTypeColor(note.note_type)} text-xs`}>
            {note.note_type === 'personal' ? 'Nota' : 
             note.note_type === 'bookmark' ? 'Bookmark' : 'Highlight'}
          </Badge>
          {note.is_shared && (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
              <Share2 className="h-3 w-3 mr-1" />
              Condivisa
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(note.id)}
            className="h-7 w-7 p-0 hover:bg-muted"
          >
            <Edit className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(note.id)}
            className="h-7 w-7 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <Textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="min-h-[60px] text-sm"
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch
                checked={editShared}
                onCheckedChange={setEditShared}
              />
              <span className="text-xs text-muted-foreground">Condivisa</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCancel} className="h-7 px-3 text-xs">
                Annulla
              </Button>
              <Button size="sm" onClick={handleSave} className="h-7 px-3 text-xs">
                Salva
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
            {note.content}
          </p>
          <div className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(note.created_at), { 
              addSuffix: true, 
              locale: it 
            })}
            {note.chapter_index !== null && (
              <span className="ml-2">• Capitolo {note.chapter_index + 1}</span>
            )}
          </div>
        </>
      )}
    </div>
  );
};
