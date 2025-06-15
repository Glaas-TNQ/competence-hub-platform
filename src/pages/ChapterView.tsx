import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, BookOpen, Play, CheckCircle } from 'lucide-react';
import { useCourses, useUpdateProgress } from '../hooks/useSupabase';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { BlockRenderer } from '../components/chapter/BlockRenderer';

export const ChapterView = () => {
  const { courseId, chapterIndex } = useParams<{ courseId: string; chapterIndex: string }>();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { data: courses } = useCourses();
  const updateProgressMutation = useUpdateProgress();

  const course = courses?.find(c => c.id === courseId);
  const chapterIdx = parseInt(chapterIndex || '0');
  
  console.log('Course data:', course);
  console.log('Course content:', course?.content);
  
  if (!course) {
    return (
      <div className="p-6 bg-slate-50 min-h-screen">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">Corso non trovato</h1>
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
      <div className="p-6 bg-slate-50 min-h-screen">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">Accesso Negato</h1>
          <p className="text-slate-600 mb-4">Non hai accesso a questo contenuto.</p>
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
      <div className="p-6 bg-slate-50 min-h-screen">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">Capitolo non trovato</h1>
          <Button onClick={() => navigate(`/course/${courseId}`)} variant="outline">
            Torna al corso
          </Button>
        </div>
      </div>
    );
  }

  const handleMarkAsCompleted = () => {
    // Calculate progress based on chapter completion
    const newProgress = Math.round(((chapterIdx + 1) / chapters.length) * 100);
    
    updateProgressMutation.mutate({
      courseId: course.id,
      progressPercentage: newProgress
    });
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
        return <BookOpen size={20} className="text-slate-600" />;
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
        <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-lg">
          <BookOpen className="mx-auto h-12 w-12 text-slate-400 mb-4" />
          <h3 className="text-lg font-medium text-slate-800 mb-2">Contenuto in Preparazione</h3>
          <p className="text-slate-600">
            Il contenuto di questo capitolo sarà disponibile a breve.
          </p>
        </div>
      );
    }

    return <BlockRenderer blocks={blocks} />;
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate(`/course/${courseId}`)}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-4 transition-colors"
        >
          <ArrowLeft size={20} />
          Torna al corso
        </button>
        
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            {getChapterIcon(currentChapter.type)}
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                {currentChapter.title || `Capitolo ${chapterIdx + 1}`}
              </h1>
              <p className="text-slate-600">{course.title}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
            <div className="flex items-center gap-1">
              <Clock size={16} />
              {currentChapter.duration || '5 min'}
            </div>
            <span>Capitolo {chapterIdx + 1} di {chapters.length}</span>
          </div>
          
          {currentChapter.description && (
            <p className="text-slate-600">{currentChapter.description}</p>
          )}
        </div>
      </div>

      {/* Chapter Content */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mb-6">
        <div className="prose max-w-none">
          {renderChapterContent()}
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center justify-between">
          <Button
            onClick={handlePreviousChapter}
            variant="outline"
            disabled={chapterIdx === 0}
          >
            <ArrowLeft size={16} className="mr-2" />
            Capitolo Precedente
          </Button>

          <div className="flex items-center gap-3">
            <Button
              onClick={handleMarkAsCompleted}
              variant="outline"
              className="gap-2"
            >
              <CheckCircle size={16} />
              Segna come Completato
            </Button>

            <Button
              onClick={handleNextChapter}
              className="gap-2"
            >
              {chapterIdx < chapters.length - 1 ? (
                <>
                  Prossimo Capitolo
                  <ArrowLeft size={16} className="rotate-180" />
                </>
              ) : (
                <>
                  Completa Corso
                  <CheckCircle size={16} />
                </>
              )}
            </Button>
          </div>
        </div>
        
        {/* Progress indicator */}
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-600">Progresso del corso</span>
            <span className="text-slate-800 font-medium">
              {Math.round(((chapterIdx + 1) / chapters.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.round(((chapterIdx + 1) / chapters.length) * 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
