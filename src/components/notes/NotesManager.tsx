
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useUserNotes, useCreateNote, useUpdateNote, useDeleteNote } from '@/hooks/useUserNotes';
import { BookOpen, Bookmark, Edit, Trash2, Share2, Plus } from 'lucide-react';
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
        return <Edit className="h-4 w-4 text-gray-600" />;
    }
  };

  const getNoteTypeColor = (type: string) => {
    switch (type) {
      case 'bookmark':
        return 'bg-yellow-100 text-yellow-800';
      case 'highlight':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-200 rounded-lg animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          {courseId ? 'Note del Corso' : 'Le Mie Note'}
        </h3>
        <Button
          onClick={() => setIsCreating(true)}
          size="sm"
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Nuova Nota
        </Button>
      </div>

      {/* Create Note Form */}
      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Crea Nuova Nota</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button
                variant={newNoteType === 'personal' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setNewNoteType('personal')}
              >
                <Edit className="h-4 w-4 mr-1" />
                Personale
              </Button>
              <Button
                variant={newNoteType === 'bookmark' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setNewNoteType('bookmark')}
              >
                <Bookmark className="h-4 w-4 mr-1" />
                Bookmark
              </Button>
              <Button
                variant={newNoteType === 'highlight' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setNewNoteType('highlight')}
              >
                <BookOpen className="h-4 w-4 mr-1" />
                Highlight
              </Button>
            </div>

            <Textarea
              placeholder="Scrivi la tua nota..."
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              className="min-h-[100px]"
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch
                  id="share-note"
                  checked={isShared}
                  onCheckedChange={setIsShared}
                />
                <label htmlFor="share-note" className="text-sm text-gray-600">
                  Condividi con altri utenti
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
                >
                  Annulla
                </Button>
                <Button
                  size="sm"
                  onClick={handleCreateNote}
                  disabled={!newNoteContent.trim() || createNote.isPending}
                >
                  {createNote.isPending ? 'Salvando...' : 'Salva Nota'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
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
          <Card>
            <CardContent className="text-center py-12">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-800 mb-2">
                Nessuna nota trovata
              </h4>
              <p className="text-gray-600 mb-4">
                Inizia a prendere note per tenere traccia del tuo apprendimento.
              </p>
              <Button onClick={() => setIsCreating(true)}>
                Crea la prima nota
              </Button>
            </CardContent>
          </Card>
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
    <Card>
      <CardContent className="pt-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            {getNoteIcon(note.note_type)}
            <Badge variant="secondary" className={getNoteTypeColor(note.note_type)}>
              {note.note_type === 'personal' ? 'Personale' : 
               note.note_type === 'bookmark' ? 'Bookmark' : 'Highlight'}
            </Badge>
            {note.is_shared && (
              <Badge variant="outline" className="bg-green-50 text-green-700">
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
              className="h-8 w-8 p-0"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(note.id)}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-3">
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="min-h-[80px]"
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={editShared}
                  onCheckedChange={setEditShared}
                />
                <span className="text-sm text-gray-600">Condivisa</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCancel}>
                  Annulla
                </Button>
                <Button size="sm" onClick={handleSave}>
                  Salva
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <p className="text-gray-700 whitespace-pre-wrap mb-3">{note.content}</p>
            <div className="text-xs text-gray-500">
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
