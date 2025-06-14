
import React from 'react';
import { useCompetenceAreas, useCourses } from '@/hooks/useSupabase';
import { CourseCard } from '@/components/CourseCard';
import { Target, BookOpen } from 'lucide-react';

export const CompetenceAreas = () => {
  const { data: competenceAreas, isLoading: areasLoading } = useCompetenceAreas();
  const { data: courses } = useCourses();

  if (areasLoading) {
    return (
      <div className="p-6 bg-slate-50 min-h-screen">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/3 mb-4"></div>
          <div className="grid gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-slate-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const getCoursesForArea = (areaId: string) => {
    return courses?.filter(course => 
      course.competence_area_id === areaId && course.is_published
    ) || [];
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Aree di Competenza</h1>
        <p className="text-slate-600">Esplora le diverse aree di competenza e i corsi disponibili</p>
      </div>

      {competenceAreas && competenceAreas.length > 0 ? (
        <div className="space-y-8">
          {competenceAreas.map((area) => {
            const areaCourses = getCoursesForArea(area.id);
            
            return (
              <div key={area.id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white mr-4">
                    <Target size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">{area.name}</h2>
                    <p className="text-slate-600">{area.description}</p>
                    <p className="text-sm text-slate-500 mt-1">
                      {areaCourses.length} {areaCourses.length === 1 ? 'corso disponibile' : 'corsi disponibili'}
                    </p>
                  </div>
                </div>

                {areaCourses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {areaCourses.map((course) => (
                      <CourseCard
                        key={course.id}
                        title={course.title}
                        description={course.description}
                        duration={course.duration}
                        participants={0}
                        type={course.course_type as 'text' | 'video' | 'arcade'}
                        image="photo-1516321318423-f06f85e504b3"
                        level={course.level as 'Principiante' | 'Intermedio' | 'Avanzato'}
                        requiresPayment={course.requires_payment}
                        price={course.price}
                        courseId={course.id}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BookOpen className="mx-auto h-8 w-8 text-slate-400 mb-2" />
                    <p className="text-slate-500">Nessun corso disponibile in questa area</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <Target className="mx-auto h-16 w-16 text-slate-400 mb-4" />
          <h3 className="text-xl font-medium text-slate-800 mb-2">Nessuna area di competenza</h3>
          <p className="text-slate-600">Le aree di competenza configurate appariranno qui</p>
        </div>
      )}
    </div>
  );
};
