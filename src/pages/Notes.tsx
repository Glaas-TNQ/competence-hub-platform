
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { NotesManager } from '@/components/notes/NotesManager';
import { useUserNotes } from '@/hooks/useUserNotes';
import { useCourses } from '@/hooks/useSupabase';
import { BookOpen, Search, Filter, FileText } from 'lucide-react';

export const Notes = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  
  const { data: allNotes, isLoading: notesLoading } = useUserNotes();
  const { data: courses } = useCourses();

  // Filter notes based on search and filters
  const filteredNotes = allNotes?.filter(note => {
    const matchesSearch = !searchQuery || 
      note.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCourse = !selectedCourse || note.course_id === selectedCourse;
    
    const matchesType = !selectedType || note.note_type === selectedType;
    
    return matchesSearch && matchesCourse && matchesType;
  }) || [];

  // Get course statistics
  const courseStats = courses?.map(course => ({
    id: course.id,
    title: course.title,
    noteCount: allNotes?.filter(note => note.course_id === course.id).length || 0,
  })).filter(stat => stat.noteCount > 0) || [];

  const noteTypeStats = [
    { type: 'personal', label: 'Personali', count: allNotes?.filter(n => n.note_type === 'personal').length || 0 },
    { type: 'bookmark', label: 'Bookmark', count: allNotes?.filter(n => n.note_type === 'bookmark').length || 0 },
    { type: 'highlight', label: 'Highlight', count: allNotes?.filter(n => n.note_type === 'highlight').length || 0 },
  ];

  if (notesLoading) {
    return (
      <div className="p-6 bg-slate-50 min-h-screen">
        <div className="space-y-6">
          <div className="h-8 bg-gray-200 rounded animate-pulse w-48"></div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse"></div>
              ))}
            </div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-lg animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Le Mie Note</h1>
          <p className="text-gray-600 mt-2">
            Gestisci tutte le tue note, bookmark e highlights in un unico posto
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Totale Note</p>
                  <p className="text-2xl font-bold text-gray-900">{allNotes?.length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {noteTypeStats.map((stat) => (
            <Card key={stat.type}>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    stat.type === 'personal' ? 'bg-gray-100' :
                    stat.type === 'bookmark' ? 'bg-yellow-100' : 'bg-blue-100'
                  }`}>
                    {stat.type === 'personal' ? '📝' : stat.type === 'bookmark' ? '🔖' : '🔍'}
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.count}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Cerca nelle note..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <select
                      value={selectedCourse}
                      onChange={(e) => setSelectedCourse(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="">Tutti i corsi</option>
                      {courses?.map((course) => (
                        <option key={course.id} value={course.id}>
                          {course.title}
                        </option>
                      ))}
                    </select>
                    
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="">Tutti i tipi</option>
                      <option value="personal">Personali</option>
                      <option value="bookmark">Bookmark</option>
                      <option value="highlight">Highlight</option>
                    </select>
                  </div>
                </div>

                {(searchQuery || selectedCourse || selectedType) && (
                  <div className="flex items-center gap-2 mt-4">
                    <span className="text-sm text-gray-600">Filtri attivi:</span>
                    {searchQuery && (
                      <Badge variant="secondary" className="gap-1">
                        Ricerca: "{searchQuery}"
                        <button
                          onClick={() => setSearchQuery('')}
                          className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                        >
                          ×
                        </button>
                      </Badge>
                    )}
                    {selectedCourse && (
                      <Badge variant="secondary" className="gap-1">
                        Corso: {courses?.find(c => c.id === selectedCourse)?.title}
                        <button
                          onClick={() => setSelectedCourse('')}
                          className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                        >
                          ×
                        </button>
                      </Badge>
                    )}
                    {selectedType && (
                      <Badge variant="secondary" className="gap-1">
                        Tipo: {selectedType === 'personal' ? 'Personali' : 
                              selectedType === 'bookmark' ? 'Bookmark' : 'Highlight'}
                        <button
                          onClick={() => setSelectedType('')}
                          className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                        >
                          ×
                        </button>
                      </Badge>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Notes Manager with filtered notes */}
            <div>
              {filteredNotes.length > 0 ? (
                <NotesManager />
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-800 mb-2">
                      {searchQuery || selectedCourse || selectedType 
                        ? 'Nessuna nota trovata con i filtri applicati'
                        : 'Nessuna nota trovata'
                      }
                    </h4>
                    <p className="text-gray-600 mb-4">
                      {searchQuery || selectedCourse || selectedType
                        ? 'Prova a modificare i filtri di ricerca.'
                        : 'Inizia a prendere note durante lo studio dei corsi.'
                      }
                    </p>
                    {(!searchQuery && !selectedCourse && !selectedType) && (
                      <Button onClick={() => window.location.href = '/areas'}>
                        Vai ai Corsi
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course Notes Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Note per Corso</CardTitle>
              </CardHeader>
              <CardContent>
                {courseStats.length > 0 ? (
                  <div className="space-y-3">
                    {courseStats.map((course) => (
                      <div
                        key={course.id}
                        className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer"
                        onClick={() => setSelectedCourse(course.id)}
                      >
                        <span className="text-sm font-medium truncate mr-2">
                          {course.title}
                        </span>
                        <Badge variant="secondary">{course.noteCount}</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">
                    Nessuna nota per corso trovata
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Azioni Rapide</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setSelectedType('bookmark')}
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Vedi tutti i Bookmark
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setSelectedType('highlight')}
                >
                  <Search className="h-4 w-4 mr-2" />
                  Vedi tutti gli Highlight
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCourse('');
                    setSelectedType('');
                  }}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Rimuovi tutti i filtri
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
