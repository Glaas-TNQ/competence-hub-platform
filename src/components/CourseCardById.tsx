
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Users, BookOpen, Play, Lock, Euro } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useCourses, useUserProgress } from '@/hooks/useSupabase';

interface CourseCardByIdProps {
  courseId: string;
}

const typeIcons = {
  text: BookOpen,
  video: Play,
  arcade: Play
};

const levelColors = {
  'Principiante': 'bg-green-100 text-green-800',
  'Intermedio': 'bg-yellow-100 text-yellow-800',
  'Avanzato': 'bg-red-100 text-red-800'
};

export const CourseCardById = ({ courseId }: CourseCardByIdProps) => {
  const { data: courses } = useCourses();
  const { data: userProgress } = useUserProgress();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  
  const course = courses?.find(c => c.id === courseId);
  
  if (!course) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-slate-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  const IconComponent = typeIcons[course.course_type as keyof typeof typeIcons] || BookOpen;
  const progress = userProgress?.find(p => p.course_id === course.id)?.progress_percentage || 0;
  
  // Check if user has access to this course
  const hasAccess = !course.requires_payment || 
    (profile?.purchased_courses && profile.purchased_courses.includes(courseId)) ||
    profile?.role === 'admin';

  const handleCourseClick = () => {
    if (hasAccess) {
      navigate(`/course/${courseId}`);
    }
  };

  const handleContactAdmin = () => {
    const subject = encodeURIComponent(`Richiesta accesso corso: ${course.title}`);
    const body = encodeURIComponent(
      `Gentile Amministratore,\n\n` +
      `Vorrei richiedere l'accesso al corso "${course.title}".\n\n` +
      `I miei dati:\n` +
      `- Email: ${user?.email}\n` +
      `- Nome completo: ${profile?.full_name || 'Non specificato'}\n` +
      `- Azienda: ${profile?.company || 'Non specificata'}\n\n` +
      `Grazie per l'attenzione.\n\n` +
      `Cordiali saluti`
    );
    
    window.open(`mailto:admin@academy.com?subject=${subject}&body=${body}`, '_blank');
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group border border-slate-100 w-full">
      <div className="relative">
        <img 
          src={course.image_url || `https://images.unsplash.com/photo-1516321318423-f06f85e504b3`} 
          alt={course.title}
          className="w-full h-40 md:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 md:top-4 right-3 md:right-4 flex gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${levelColors[course.level as keyof typeof levelColors] || 'bg-gray-100 text-gray-800'}`}>
            {course.level}
          </span>
          {course.requires_payment && (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 flex items-center gap-1">
              <Euro size={12} />
              {course.price && course.price > 0 ? `€${course.price}` : 'Premium'}
            </span>
          )}
        </div>
        <div className="absolute bottom-3 md:bottom-4 left-3 md:left-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2">
            <IconComponent size={18} className="text-slate-700 md:w-5 md:h-5" />
          </div>
        </div>
        {course.requires_payment && !hasAccess && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3">
              <Lock size={24} className="text-slate-700" />
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4 md:p-6">
        <h3 className="text-lg md:text-xl font-semibold text-slate-800 mb-2 group-hover:text-fairmind-primary transition-colors line-clamp-2">
          {course.title}
        </h3>
        <p className="text-slate-600 mb-4 line-clamp-2 text-sm md:text-base">
          {course.description}
        </p>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-slate-500 mb-4 gap-2">
          <div className="flex items-center space-x-3 md:space-x-4">
            <div className="flex items-center space-x-1">
              <Clock size={14} className="md:w-4 md:h-4" />
              <span className="text-xs md:text-sm">{course.duration}</span>
            </div>
          </div>
        </div>
        
        {progress > 0 && (
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-600 text-xs md:text-sm">Progresso</span>
              <span className="text-slate-800 font-medium text-xs md:text-sm">{progress}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-fairmind-primary to-fairmind-accent h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}
        
        {hasAccess ? (
          <button 
            onClick={handleCourseClick}
            className="w-full bg-gradient-to-r from-fairmind-primary to-fairmind-accent text-white py-2 md:py-3 rounded-lg font-medium hover:from-fairmind-primary/90 hover:to-fairmind-accent/90 transition-all duration-200 transform hover:scale-105 text-sm md:text-base"
          >
            {progress ? 'Continua' : 'Inizia Corso'}
          </button>
        ) : (
          <Dialog>
            <DialogTrigger asChild>
              <button className="w-full bg-gradient-to-r from-purple-600 to-purple-500 text-white py-2 md:py-3 rounded-lg font-medium hover:from-purple-700 hover:to-purple-600 transition-all duration-200 transform hover:scale-105 text-sm md:text-base flex items-center justify-center gap-2">
                <Lock size={16} />
                Richiedi Accesso
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Lock size={20} />
                  Corso a Pagamento
                </DialogTitle>
                <DialogDescription>
                  Questo corso richiede un abbonamento o un acquisto per essere accessibile.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h4 className="font-medium text-slate-800 mb-2">{course.title}</h4>
                  <p className="text-sm text-slate-600 mb-3">{course.description}</p>
                  {course.price && course.price > 0 && (
                    <div className="flex items-center gap-2 text-lg font-semibold text-purple-600">
                      <Euro size={20} />
                      {course.price}
                    </div>
                  )}
                </div>
                <div className="space-y-3">
                  <p className="text-sm text-slate-600">
                    Per accedere a questo corso, invia una richiesta all'amministratore.
                  </p>
                  <Button onClick={handleContactAdmin} className="w-full">
                    Contatta l'Amministratore
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};
