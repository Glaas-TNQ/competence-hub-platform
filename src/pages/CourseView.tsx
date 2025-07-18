
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Users, BookOpen, Play, CheckCircle, Lock, Trophy, Zap } from 'lucide-react';
import { useCourses, useUserProgress, useUpdateProgress } from '../hooks/useSupabase';
import { useAuth } from '../contexts/AuthContext';
import { useUserTotalPoints } from '../hooks/useGamification';
import { Button } from '../components/ui/button';

type Chapter = {
  title: string;
  description: string;
  type: 'video' | 'text';
  duration?: string;
  content?: string;
  video_url?: string;
};

export const CourseView = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { data: courses } = useCourses();
  const { data: userProgress } = useUserProgress();
  const { data: userPoints } = useUserTotalPoints();
  const updateProgressMutation = useUpdateProgress();

  const course = courses?.find(c => c.id === courseId);
  const progress = userProgress?.find(p => p.course_id === courseId);

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

  // Parse course content to get chapters
  const chapters: Chapter[] = (course.content as any)?.chapters || [];

  const handleStartChapter = (chapterIndex: number) => {
    if (!hasAccess) return;
    navigate(`/course/${courseId}/chapter/${chapterIndex}`);
  };

  const getChapterIcon = (chapterType: string) => {
    switch (chapterType) {
      case 'video':
        return <Play size={16} className="text-blue-600" />;
      case 'text':
        return <BookOpen size={16} className="text-green-600" />;
      default:
        return <BookOpen size={16} className="text-muted-foreground" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ArrowLeft size={20} />
          Indietro
        </button>
        
        <div className="bg-card/80 backdrop-blur-sm rounded-2xl shadow-educational-sm border overflow-hidden">
          <div className="relative h-64">
            <img 
              src={course.image_url || `https://images.unsplash.com/photo-1516321318423-f06f85e504b3`}
              alt={course.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-6 left-6 text-white">
              <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Clock size={16} />
                  {course.duration}
                </div>
                <div className="flex items-center gap-1">
                  <Users size={16} />
                  {course.level}
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <p className="text-muted-foreground mb-4">{course.description}</p>
            
            {/* Gamification Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-3 text-center">
                <Zap className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                <div className="text-lg font-bold text-blue-800 dark:text-blue-300">+10</div>
                <div className="text-xs text-blue-600 dark:text-blue-400">Punti per capitolo</div>
              </div>
              <div className="bg-green-50 dark:bg-green-950/30 rounded-lg p-3 text-center">
                <Trophy className="h-6 w-6 text-green-600 mx-auto mb-1" />
                <div className="text-lg font-bold text-green-800 dark:text-green-300">+50</div>
                <div className="text-xs text-green-600 dark:text-green-400">Punti completamento</div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-950/30 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-purple-800 dark:text-purple-300">Liv. {userPoints?.level || 1}</div>
                <div className="text-xs text-purple-600 dark:text-purple-400">Il tuo livello</div>
              </div>
            </div>
            
            {progress && (
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Progresso</span>
                  <span className="text-foreground font-medium">{progress.progress_percentage}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress.progress_percentage}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="bg-card/80 backdrop-blur-sm rounded-2xl shadow-educational-sm border p-6">
        <h2 className="text-2xl font-bold text-foreground mb-6">Contenuto del Corso</h2>
        
        {!hasAccess ? (
          <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
            <Lock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Accesso Limitato</h3>
            <p className="text-muted-foreground mb-4">
              Questo corso richiede un abbonamento per accedere al contenuto.
            </p>
            <Button variant="outline">
              Richiedi Accesso
            </Button>
          </div>
        ) : chapters.length > 0 ? (
          <div className="space-y-4">
            {chapters.map((chapter: Chapter, index: number) => {
              const isCompleted = progress && progress.progress_percentage >= Math.round(((index + 1) / chapters.length) * 100);
              const isAccessible = index === 0 || (progress && progress.progress_percentage >= Math.round((index / chapters.length) * 100));
              
              return (
                <div
                  key={index}
                  className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-200 ${
                    isAccessible 
                      ? 'border-border hover:border-primary/30 hover:shadow-sm cursor-pointer bg-card/50' 
                      : 'border-border opacity-50 bg-muted/20'
                  }`}
                  onClick={() => isAccessible && handleStartChapter(index)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                      isCompleted 
                        ? 'bg-green-100 dark:bg-green-950/30' 
                        : isAccessible 
                          ? 'bg-blue-100 dark:bg-blue-950/30' 
                          : 'bg-muted'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle size={20} className="text-green-600" />
                      ) : isAccessible ? (
                        getChapterIcon(chapter.type)
                      ) : (
                        <Lock size={16} className="text-muted-foreground" />
                      )}
                    </div>
                    
                    <div>
                      <h3 className={`font-medium ${isAccessible ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {chapter.title || `Capitolo ${index + 1}`}
                      </h3>
                      <p className={`text-sm ${isAccessible ? 'text-muted-foreground' : 'text-muted-foreground/60'}`}>
                        {chapter.description || 'Descrizione del capitolo'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {chapter.duration && (
                      <span>{chapter.duration}</span>
                    )}
                    {isAccessible && !isCompleted && (
                      <div className="flex items-center gap-1 text-blue-600">
                        <Zap size={12} />
                        <span className="text-xs">+10 pt</span>
                      </div>
                    )}
                    {isCompleted && (
                      <CheckCircle size={16} className="text-green-600" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Contenuto in Preparazione</h3>
            <p className="text-muted-foreground">
              Il contenuto di questo corso sarà disponibile a breve.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
