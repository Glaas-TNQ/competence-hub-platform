
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
        return <Bookmark className="h-4 w-4 text-amber-600" />;
      case 'highlight':
        return <BookOpen className="h-4 w-4 text-blue-600" />;
      default:
        return <FileText className="h-4 w-4 text-slate-600" />;
    }
  };

  const getNoteTypeColor = (type: string) => {
    switch (type) {
      case 'bookmark':
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800';
      case 'highlight':
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-950/30 dark:text-slate-400 dark:border-slate-800';
    }
  };

  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-20 bg-muted/50 rounded-xl animate-pulse"></div>
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
          className="w-full gap-2 border-dashed border-2 h-12 text-sm font-medium hover:bg-muted/50 transition-all"
        >
          <Plus className="h-5 w-5" />
          Nuova Nota
        </Button>
      )}

      {/* Create Note Form */}
      {isCreating && (
        <Card className="border-2 border-dashed border-primary/30 bg-primary/5">
          <CardContent className="p-6 space-y-5">
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={newNoteType === 'personal' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setNewNoteType('personal')}
                className="h-10 text-xs flex items-center justify-center gap-2"
              >
                <FileText className="h-4 w-4" />
                Nota
              </Button>
              <Button
                variant={newNoteType === 'bookmark' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setNewNoteType('bookmark')}
                className="h-10 text-xs flex items-center justify-center gap-2"
              >
                <Bookmark className="h-4 w-4" />
                Bookmark
              </Button>
              <Button
                variant={newNoteType === 'highlight' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setNewNoteType('highlight')}
                className="h-10 text-xs flex items-center justify-center gap-2"
              >
                <BookOpen className="h-4 w-4" />
                Highlight
              </Button>
            </div>

            <Textarea
              placeholder="Scrivi la tua nota..."
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              className="min-h-[100px] text-sm resize-none"
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Switch
                  id="share-note"
                  checked={isShared}
                  onCheckedChange={setIsShared}
                />
                <label htmlFor="share-note" className="text-sm text-muted-foreground font-medium">
                  Condividi
                </label>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsCreating(false);
                    setNewNoteContent('');
                    setIsShared(false);
                    setNewNoteType('personal');
                  }}
                  className="h-9 px-4 text-sm"
                >
                  Annulla
                </Button>
                <Button
                  size="sm"
                  onClick={handleCreateNote}
                  disabled={!newNoteContent.trim() || createNote.isPending}
                  className="h-9 px-4 text-sm"
                >
                  {createNote.isPending ? 'Salvando...' : 'Salva'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notes List */}
      <div className="space-y-4">
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
          <div className="text-center py-12 border-2 border-dashed border-border rounded-xl bg-muted/30">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h4 className="text-lg font-medium text-foreground mb-2">
              Nessuna nota trovata
            </h4>
            <p className="text-sm text-muted-foreground">
              Le tue note per questo capitolo appariranno qui.
            </p>
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
    <Card className="border border-border hover:shadow-lg transition-all duration-300 bg-card/90">
      <CardContent className="p-5 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1">
            {getNoteIcon(note.note_type)}
            <Badge variant="secondary" className={`${getNoteTypeColor(note.note_type)} text-sm px-3 py-1`}>
              {note.note_type === 'personal' ? 'Nota' : 
               note.note_type === 'bookmark' ? 'Bookmark' : 'Highlight'}
            </Badge>
            {note.is_shared && (
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-sm px-3 py-1 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800">
                <Share2 className="h-3 w-3 mr-1" />
                Condivisa
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(note.id)}
              className="h-8 w-8 p-0 hover:bg-muted"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(note.id)}
              className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="min-h-[80px] text-sm resize-none"
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Switch
                  checked={editShared}
                  onCheckedChange={setEditShared}
                />
                <span className="text-sm text-muted-foreground font-medium">Condivisa</span>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" size="sm" onClick={handleCancel} className="h-8 px-4 text-sm">
                  Annulla
                </Button>
                <Button size="sm" onClick={handleSave} className="h-8 px-4 text-sm">
                  Salva
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap break-words">
              {note.content}
            </p>
            <div className="text-xs text-muted-foreground border-t border-border pt-3">
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
      </CardContent>
    </Card>
  );
};
