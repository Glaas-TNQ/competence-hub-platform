
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Users, BookOpen, Play, CheckCircle, Lock } from 'lucide-react';
import { useCourses, useUserProgress, useUpdateProgress } from '../hooks/useSupabase';
import { useAuth } from '../contexts/AuthContext';
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
  const updateProgressMutation = useUpdateProgress();

  const course = courses?.find(c => c.id === courseId);
  const progress = userProgress?.find(p => p.course_id === courseId);

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
        return <BookOpen size={16} className="text-slate-600" />;
    }
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-4 transition-colors"
        >
          <ArrowLeft size={20} />
          Indietro
        </button>
        
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
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
            <p className="text-slate-600 mb-4">{course.description}</p>
            
            {progress && (
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-600">Progresso</span>
                  <span className="text-slate-800 font-medium">{progress.progress_percentage}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
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
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Contenuto del Corso</h2>
        
        {!hasAccess ? (
          <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-lg">
            <Lock className="mx-auto h-12 w-12 text-slate-400 mb-4" />
            <h3 className="text-lg font-medium text-slate-800 mb-2">Accesso Limitato</h3>
            <p className="text-slate-600 mb-4">
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
                      ? 'border-slate-200 hover:border-blue-300 hover:shadow-sm cursor-pointer' 
                      : 'border-slate-100 opacity-50'
                  }`}
                  onClick={() => isAccessible && handleStartChapter(index)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                      isCompleted 
                        ? 'bg-green-100' 
                        : isAccessible 
                          ? 'bg-blue-100' 
                          : 'bg-slate-100'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle size={20} className="text-green-600" />
                      ) : isAccessible ? (
                        getChapterIcon(chapter.type)
                      ) : (
                        <Lock size={16} className="text-slate-400" />
                      )}
                    </div>
                    
                    <div>
                      <h3 className={`font-medium ${isAccessible ? 'text-slate-800' : 'text-slate-400'}`}>
                        {chapter.title || `Capitolo ${index + 1}`}
                      </h3>
                      <p className={`text-sm ${isAccessible ? 'text-slate-600' : 'text-slate-400'}`}>
                        {chapter.description || 'Descrizione del capitolo'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    {chapter.duration && (
                      <span>{chapter.duration}</span>
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
          <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-lg">
            <BookOpen className="mx-auto h-12 w-12 text-slate-400 mb-4" />
            <h3 className="text-lg font-medium text-slate-800 mb-2">Contenuto in Preparazione</h3>
            <p className="text-slate-600">
              Il contenuto di questo corso sarà disponibile a breve.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
