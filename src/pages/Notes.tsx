
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { NotesManager } from '@/components/notes/NotesManager';
import { useUserNotes } from '@/hooks/useUserNotes';
import { useCourses } from '@/hooks/useSupabase';
import { BookOpen, Search, Filter, FileText, Bookmark, Highlight } from 'lucide-react';

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
    { type: 'personal', label: 'Personali', count: allNotes?.filter(n => n.note_type === 'personal').length || 0, icon: FileText },
    { type: 'bookmark', label: 'Bookmark', count: allNotes?.filter(n => n.note_type === 'bookmark').length || 0, icon: Bookmark },
    { type: 'highlight', label: 'Highlight', count: allNotes?.filter(n => n.note_type === 'highlight').length || 0, icon: Highlight },
  ];

  if (notesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="max-w-7xl mx-auto p-8">
          <div className="space-y-6">
            <div className="h-12 bg-card/50 rounded-2xl animate-pulse"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-card/50 rounded-2xl animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-7xl mx-auto p-8 space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Le Mie Note
          </h1>
          <p className="text-lg text-muted-foreground">
            Gestisci tutte le tue note, bookmark e highlights in un unico posto
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-educational bg-card/50 backdrop-blur-sm hover:shadow-educational-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center mr-4">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Totale Note</p>
                  <p className="text-2xl font-bold text-foreground">{allNotes?.length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {noteTypeStats.map((stat) => (
            <Card key={stat.type} className="border-0 shadow-educational bg-card/50 backdrop-blur-sm hover:shadow-educational-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className={`h-12 w-12 rounded-2xl flex items-center justify-center mr-4 ${
                    stat.type === 'personal' ? 'bg-secondary/10' :
                    stat.type === 'bookmark' ? 'bg-focus/10' : 'bg-success/10'
                  }`}>
                    <stat.icon className={`h-6 w-6 ${
                      stat.type === 'personal' ? 'text-secondary' :
                      stat.type === 'bookmark' ? 'text-focus' : 'text-success'
                    }`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.count}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search and Filters */}
            <Card className="border-0 shadow-educational bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Cerca nelle note..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 border-0 bg-background/50 rounded-xl"
                    />
                  </div>
                  
                  <div className="flex gap-3">
                    <select
                      value={selectedCourse}
                      onChange={(e) => setSelectedCourse(e.target.value)}
                      className="px-4 py-2 border-0 bg-background/50 rounded-xl text-sm min-w-[140px]"
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
                      className="px-4 py-2 border-0 bg-background/50 rounded-xl text-sm min-w-[120px]"
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
                    <span className="text-sm text-muted-foreground">Filtri attivi:</span>
                    {searchQuery && (
                      <Badge variant="secondary" className="gap-1 bg-primary/10 text-primary border-primary/20">
                        Ricerca: "{searchQuery}"
                        <button
                          onClick={() => setSearchQuery('')}
                          className="ml-1 hover:bg-primary/20 rounded-full p-0.5"
                        >
                          ×
                        </button>
                      </Badge>
                    )}
                    {selectedCourse && (
                      <Badge variant="secondary" className="gap-1 bg-secondary/10 text-secondary border-secondary/20">
                        Corso: {courses?.find(c => c.id === selectedCourse)?.title}
                        <button
                          onClick={() => setSelectedCourse('')}
                          className="ml-1 hover:bg-secondary/20 rounded-full p-0.5"
                        >
                          ×
                        </button>
                      </Badge>
                    )}
                    {selectedType && (
                      <Badge variant="secondary" className="gap-1 bg-focus/10 text-focus border-focus/20">
                        Tipo: {selectedType === 'personal' ? 'Personali' : 
                              selectedType === 'bookmark' ? 'Bookmark' : 'Highlight'}
                        <button
                          onClick={() => setSelectedType('')}
                          className="ml-1 hover:bg-focus/20 rounded-full p-0.5"
                        >
                          ×
                        </button>
                      </Badge>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Notes Content */}
            <div>
              {filteredNotes.length > 0 ? (
                <NotesManager />
              ) : (
                <Card className="border-0 shadow-educational bg-card/50 backdrop-blur-sm">
                  <CardContent className="text-center py-16">
                    <div className="w-24 h-24 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-6">
                      <BookOpen className="w-12 h-12 text-muted-foreground" />
                    </div>
                    <h4 className="text-xl font-semibold text-foreground mb-4">
                      {searchQuery || selectedCourse || selectedType 
                        ? 'Nessuna nota trovata con i filtri applicati'
                        : 'Nessuna nota trovata'
                      }
                    </h4>
                    <p className="text-muted-foreground mb-6">
                      {searchQuery || selectedCourse || selectedType
                        ? 'Prova a modificare i filtri di ricerca.'
                        : 'Inizia a prendere note durante lo studio dei corsi.'
                      }
                    </p>
                    {(!searchQuery && !selectedCourse && !selectedType) && (
                      <Button 
                        onClick={() => window.location.href = '/areas'}
                        className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white px-6 py-3 rounded-full"
                      >
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
            <Card className="border-0 shadow-educational bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Note per Corso</CardTitle>
              </CardHeader>
              <CardContent>
                {courseStats.length > 0 ? (
                  <div className="space-y-3">
                    {courseStats.map((course) => (
                      <div
                        key={course.id}
                        className="flex items-center justify-between p-3 hover:bg-background/50 rounded-xl cursor-pointer transition-colors"
                        onClick={() => setSelectedCourse(course.id)}
                      >
                        <span className="text-sm font-medium truncate mr-2">
                          {course.title}
                        </span>
                        <Badge variant="secondary" className="bg-primary/10 text-primary">
                          {course.noteCount}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Nessuna nota per corso trovata
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-0 shadow-educational bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Azioni Rapide</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start border-0 bg-background/50 hover:bg-background/80 rounded-xl"
                  onClick={() => setSelectedType('bookmark')}
                >
                  <Bookmark className="h-4 w-4 mr-2" />
                  Vedi tutti i Bookmark
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-0 bg-background/50 hover:bg-background/80 rounded-xl"
                  onClick={() => setSelectedType('highlight')}
                >
                  <Highlight className="h-4 w-4 mr-2" />
                  Vedi tutti gli Highlight
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-0 bg-background/50 hover:bg-background/80 rounded-xl"
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
