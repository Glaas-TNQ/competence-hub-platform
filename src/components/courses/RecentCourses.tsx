
import React from 'react';
import { CourseCard } from '@/components/CourseCard';
import { useCourses, useUserProgress } from '@/hooks/useSupabase';

export const RecentCourses: React.FC = () => {
  const { data: courses } = useCourses();
  const { data: userProgress } = useUserProgress();

  if (!courses || courses.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Nessun corso disponibile</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Corsi Disponibili</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.slice(0, 6).map((course) => (
          <CourseCard 
            key={course.id} 
            title={course.title}
            description={course.description}
            duration={course.duration}
            type={course.course_type as 'text' | 'video' | 'arcade'}
            image={course.image_url || 'photo-1546410531-bb4caa6b424d'}
            level={course.level as 'Principiante' | 'Intermedio' | 'Avanzato'}
            requiresPayment={course.requires_payment || false}
            price={Number(course.price) || 0}
            courseId={course.id}
            progress={userProgress?.find(p => p.course_id === course.id)?.progress_percentage}
          />
        ))}
      </div>
    </div>
  );
};
