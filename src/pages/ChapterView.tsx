
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, BookOpen, Play, CheckCircle } from 'lucide-react';
import { useCourses } from '../hooks/useSupabase';
import { useChapterProgress, useMarkChapterComplete, useCalculateProgress } from '../hooks/useChapterProgress';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { BlockRenderer } from '../components/chapter/BlockRenderer';
import { InlineNoteCreator } from '../components/notes/InlineNoteCreator';
import { NotesManager } from '../components/notes/NotesManager';

export const ChapterView = () => {
  const { courseId, chapterIndex } = useParams<{ courseId: string; chapterIndex: string }>();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { data: courses } = useCourses();
  const { data: chapterProgress } = useChapterProgress(courseId!);
  const markChapterComplete = useMarkChapterComplete();
  const calculateProgress = useCalculateProgress();

  const course = courses?.find(c => c.id === courseId);
  const chapterIdx = parseInt(chapterIndex || '0');
  
  console.log('Course data:', course);
  console.log('Course content:', course?.content);
  
  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-foreground mb-4">Corso non trovato</h1>
          <Button onClick={() => navigate('/areas')} variant="outline">
            Torna ai corsi
          </Button>
        </div>
      </div>
    );
  }

  // Check if user has access to this course
  const hasAccess = !course.requires_payment || 
    (profile?.purchased_courses && profile.purchased_courses.includes(courseId!)) ||
    profile?.role === 'admin';

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-foreground mb-4">Accesso Negato</h1>
          <p className="text-muted-foreground mb-4">Non hai accesso a questo contenuto.</p>
          <Button onClick={() => navigate(`/course/${courseId}`)} variant="outline">
            Torna al corso
          </Button>
        </div>
      </div>
    );
  }

  // Parse course content to get chapters - handle different possible structures
  let chapters: any[] = [];
  if (course.content) {
    if (Array.isArray(course.content)) {
      chapters = course.content;
    } else if (typeof course.content === 'object' && course.content !== null) {
      // Handle object content
      const contentObj = course.content as any;
      if (contentObj.chapters && Array.isArray(contentObj.chapters)) {
        chapters = contentObj.chapters;
      } else {
        // If it's an object but doesn't have chapters array, treat it as empty
        chapters = [];
      }
    } else if (typeof course.content === 'string') {
      try {
        const parsed = JSON.parse(course.content);
        if (Array.isArray(parsed)) {
          chapters = parsed;
        } else if (parsed && typeof parsed === 'object' && parsed.chapters && Array.isArray(parsed.chapters)) {
          chapters = parsed.chapters;
        } else {
          chapters = [];
        }
      } catch (e) {
        console.error('Error parsing course content:', e);
        chapters = [];
      }
    }
  }
  
  console.log('Parsed chapters:', chapters);
  console.log('Current chapter index:', chapterIdx);
  
  const currentChapter = chapters[chapterIdx];
  console.log('Current chapter:', currentChapter);

  if (!currentChapter) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-foreground mb-4">Capitolo non trovato</h1>
          <Button onClick={() => navigate(`/course/${courseId}`)} variant="outline">
            Torna al corso
          </Button>
        </div>
      </div>
    );
  }

  // Check if current chapter is completed
  const isChapterCompleted = chapterProgress?.some(
    progress => progress.chapter_index === chapterIdx
  );

  const handleMarkAsCompleted = async () => {
    if (isChapterCompleted) return;
    
    try {
      // Mark chapter as completed
      await markChapterComplete.mutateAsync({
        courseId: course.id,
        chapterIndex: chapterIdx
      });
      
      // Update overall course progress
      await calculateProgress.mutateAsync({
        courseId: course.id,
        totalChapters: chapters.length
      });
      
      console.log('Chapter marked as completed successfully');
    } catch (error) {
      console.error('Error marking chapter as completed:', error);
    }
  };

  const handleNextChapter = () => {
    if (chapterIdx < chapters.length - 1) {
      navigate(`/course/${courseId}/chapter/${chapterIdx + 1}`);
    } else {
      navigate(`/course/${courseId}`);
    }
  };

  const handlePreviousChapter = () => {
    if (chapterIdx > 0) {
      navigate(`/course/${courseId}/chapter/${chapterIdx - 1}`);
    } else {
      navigate(`/course/${courseId}`);
    }
  };

  const getChapterIcon = (chapterType: string) => {
    switch (chapterType) {
      case 'video':
        return <Play size={20} className="text-blue-600" />;
      case 'text':
        return <BookOpen size={20} className="text-green-600" />;
      default:
        return <BookOpen size={20} className="text-muted-foreground" />;
    }
  };

  const parseContentBlocks = (content: any) => {
    if (!content) return [];
    
    // Handle string content that might be JSON
    if (typeof content === 'string') {
      // Check if it looks like a JSON block format
      if (content.includes('"id":"block-') && content.includes('"type":')) {
        try {
          // Parse individual blocks from the string
          const blockMatches = content.match(/\{"id":"block-[^}]+\}/g);
          if (blockMatches) {
            return blockMatches.map((blockStr, index) => {
              try {
                const block = JSON.parse(blockStr);
                return {
                  id: block.id || `block-${index}`,
                  type: block.type || 'text',
                  data: block.data || {},
                  order: block.order || index
                };
              } catch (e) {
                console.error('Error parsing block:', e);
                return {
                  id: `block-${index}`,
                  type: 'text',
                  data: { text: blockStr },
                  order: index
                };
              }
            });
          }
        } catch (e) {
          console.error('Error parsing content blocks:', e);
        }
      }
      
      // If it's just plain text, return as a single text block
      return [{
        id: 'block-0',
        type: 'text',
        data: { text: content },
        order: 0
      }];
    }
    
    // Handle array of blocks
    if (Array.isArray(content)) {
      return content.map((block, index) => ({
        id: block.id || `block-${index}`,
        type: block.type || 'text',
        data: block.data || block,
        order: block.order !== undefined ? block.order : index
      }));
    }
    
    // Handle single object
    if (typeof content === 'object' && content !== null) {
      if (content.id && content.type && content.data) {
        // Single block object
        return [content];
      } else {
        // Generic object, treat as text
        return [{
          id: 'block-0',
          type: 'text',
          data: { text: JSON.stringify(content, null, 2) },
          order: 0
        }];
      }
    }
    
    return [];
  };

  const renderChapterContent = () => {
    const blocks = parseContentBlocks(currentChapter.content);
    
    console.log('Parsed blocks:', blocks);

    if (blocks.length === 0) {
      return (
        <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
          <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Contenuto in Preparazione</h3>
          <p className="text-muted-foreground">
            Il contenuto di questo capitolo sarà disponibile a breve.
          </p>
        </div>
      );
    }

    return <BlockRenderer blocks={blocks} />;
  };

  // Calculate current progress based on completed chapters
  const completedChaptersCount = chapterProgress?.length || 0;
  const currentProgress = Math.round((completedChaptersCount / chapters.length) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="space-y-6">
          <button
            onClick={() => navigate(`/course/${courseId}`)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={20} />
            Torna al corso
          </button>
          
          <div className="bg-card/80 backdrop-blur-sm rounded-2xl shadow-lg border p-8">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                {getChapterIcon(currentChapter.type)}
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">
                    {currentChapter.title || `Capitolo ${chapterIdx + 1}`}
                  </h1>
                  <p className="text-lg text-muted-foreground mb-4">{course.title}</p>
                  
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock size={16} />
                      {currentChapter.duration || '5 min'}
                    </div>
                    <span>Capitolo {chapterIdx + 1} di {chapters.length}</span>
                  </div>
                </div>
              </div>
              
              {isChapterCompleted && (
                <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-4 py-2 rounded-full">
                  <CheckCircle size={20} />
                  <span className="font-medium">Completato</span>
                </div>
              )}
            </div>
            
            {currentChapter.description && (
              <p className="text-muted-foreground mt-4 text-lg leading-relaxed">
                {currentChapter.description}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="xl:col-span-3 space-y-8">
            {/* Chapter Content */}
            <div className="bg-card/80 backdrop-blur-sm rounded-2xl shadow-lg border overflow-hidden">
              <div className="p-8">
                <div className="prose max-w-none dark:prose-invert prose-lg">
                  {renderChapterContent()}
                </div>
              </div>
              
              {/* Inline Note Creator */}
              <div className="border-t border-border bg-muted/30 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">Aggiungi una Nota</h3>
                </div>
                <InlineNoteCreator
                  courseId={courseId!}
                  chapterIndex={chapterIdx}
                  className="w-full"
                />
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="bg-card/80 backdrop-blur-sm rounded-2xl shadow-lg border p-6">
              <div className="flex items-center justify-between mb-6">
                <Button
                  onClick={handlePreviousChapter}
                  variant="outline"
                  size="lg"
                  disabled={chapterIdx === 0}
                  className="gap-2"
                >
                  <ArrowLeft size={18} />
                  Capitolo Precedente
                </Button>

                <div className="flex items-center gap-4">
                  <Button
                    onClick={handleMarkAsCompleted}
                    variant={isChapterCompleted ? "secondary" : "outline"}
                    size="lg"
                    className="gap-2"
                    disabled={isChapterCompleted || markChapterComplete.isPending}
                  >
                    <CheckCircle size={18} />
                    {isChapterCompleted ? 'Completato' : 'Segna come Completato'}
                  </Button>

                  <Button
                    onClick={handleNextChapter}
                    size="lg"
                    className="gap-2"
                  >
                    {chapterIdx < chapters.length - 1 ? (
                      <>
                        Prossimo Capitolo
                        <ArrowLeft size={18} className="rotate-180" />
                      </>
                    ) : (
                      <>
                        Completa Corso
                        <CheckCircle size={18} />
                      </>
                    )}
                  </Button>
                </div>
              </div>
              
              {/* Progress indicator */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-medium">Progresso del corso</span>
                  <span className="text-foreground font-semibold">
                    {currentProgress}% ({completedChaptersCount}/{chapters.length} capitoli)
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${currentProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar with Chapter Notes */}
          <div className="xl:col-span-1">
            <div className="bg-card/80 backdrop-blur-sm rounded-2xl shadow-lg border overflow-hidden sticky top-6">
              <div className="border-b border-border bg-muted/30 p-6">
                <h3 className="text-xl font-semibold text-foreground">Note del Capitolo</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Le tue annotazioni per questo capitolo
                </p>
              </div>
              
              <div className="p-6">
                <NotesManager 
                  courseId={courseId}
                  chapterIndex={chapterIdx}
                  className="space-y-4"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
