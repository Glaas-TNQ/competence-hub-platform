
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUserNotes } from '@/hooks/useUserNotes';
import { BookOpen, Bookmark, Edit, Plus, ArrowRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { it } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';

export const NotesWidget: React.FC = () => {
  const { data: notes, isLoading } = useUserNotes();
  const navigate = useNavigate();
  
  const recentNotes = notes?.slice(0, 5) || [];

  const getNoteIcon = (type: string) => {
    switch (type) {
      case 'bookmark':
        return <Bookmark className="h-3 w-3 text-yellow-600" />;
      case 'highlight':
        return <BookOpen className="h-3 w-3 text-blue-600" />;
      default:
        return <Edit className="h-3 w-3 text-gray-600" />;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Note Recenti</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg">Note Recenti</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/notes')}
          className="h-8 px-2"
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardHeader>
      
      <CardContent>
        {recentNotes.length > 0 ? (
          <div className="space-y-3">
            {recentNotes.map((note) => (
              <div
                key={note.id}
                className="p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => navigate('/notes')}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getNoteIcon(note.note_type)}
                    <span className="text-sm font-medium text-gray-900">
                      {note.note_type === 'personal' ? 'Nota' : 
                       note.note_type === 'bookmark' ? 'Bookmark' : 'Highlight'}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(note.created_at), { 
                      addSuffix: true, 
                      locale: it 
                    })}
                  </span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {note.content}
                </p>
                {note.chapter_index !== null && (
                  <Badge variant="outline" className="mt-2 text-xs">
                    Capitolo {note.chapter_index + 1}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <BookOpen className="h-8 w-8 text-gray-400 mx-auto mb-3" />
            <p className="text-sm text-gray-600 mb-3">
              Non hai ancora preso note
            </p>
            <Button
              size="sm"
              onClick={() => navigate('/notes')}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Crea Nota
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
