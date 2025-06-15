
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCourses, useUserProgress } from '../hooks/useSupabase';
import { CourseCard } from '../components/CourseCard';
import { UserLevel } from '../components/gamification/UserLevel';
import { UserBadges } from '../components/gamification/UserBadges';
import { BookOpen, Trophy, Target, Clock } from 'lucide-react';

export const Dashboard = () => {
  const { user, profile } = useAuth();
  const { data: courses } = useCourses();
  const { data: userProgress } = useUserProgress();

  // Filter courses based on user access
  const accessibleCourses = courses?.filter(course => {
    if (!course.requires_payment) return true;
    return profile?.purchased_courses?.includes(course.id) || 
           profile?.accessible_courses?.includes(course.id) ||
           profile?.role === 'admin';
  }) || [];

  // Get courses in progress
  const coursesInProgress = accessibleCourses.filter(course => {
    const progress = userProgress?.find(p => p.course_id === course.id);
    return progress && progress.progress_percentage > 0 && progress.progress_percentage < 100;
  });

  // Get completed courses
  const completedCourses = userProgress?.filter(p => p.progress_percentage === 100) || [];

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          Ciao, {profile?.full_name || user?.email}! 👋
        </h1>
        <p className="text-slate-600">Ecco il tuo progresso di apprendimento.</p>
      </div>

      {/* Gamification Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* User Level */}
        <div className="lg:col-span-1">
          <UserLevel />
        </div>
        
        {/* User Badges */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="h-5 w-5 text-yellow-600" />
              <h2 className="text-lg font-semibold text-slate-800">Badge Guadagnati</h2>
            </div>
            <UserBadges limit={6} />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Corsi Disponibili</p>
              <p className="text-2xl font-bold text-slate-800">{accessibleCourses.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">In Corso</p>
              <p className="text-2xl font-bold text-slate-800">{coursesInProgress.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Target className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Completati</p>
              <p className="text-2xl font-bold text-slate-800">{completedCourses.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Trophy className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Badge</p>
              <p className="text-2xl font-bold text-slate-800">{userProgress?.length || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Continue Learning Section */}
      {coursesInProgress.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Continua a Studiare</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coursesInProgress.slice(0, 3).map((course) => {
              const progress = userProgress?.find(p => p.course_id === course.id);
              return (
                <CourseCard
                  key={course.id}
                  title={course.title}
                  description={course.description}
                  duration={course.duration}
                  participants={0}
                  progress={progress?.progress_percentage || 0}
                  type={course.course_type as 'text' | 'video' | 'arcade'}
                  image={course.image_url || 'photo-1516321318423-f06f85e504b3?w=500&h=300&fit=crop'}
                  level={course.level as 'Principiante' | 'Intermedio' | 'Avanzato'}
                  requiresPayment={course.requires_payment || false}
                  price={Number(course.price) || 0}
                  courseId={course.id}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Recommended Courses */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-6">
          {coursesInProgress.length > 0 ? 'Altri Corsi' : 'Inizia a Imparare'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accessibleCourses
            .filter(course => !coursesInProgress.some(cp => cp.id === course.id))
            .slice(0, 6)
            .map((course) => {
              const progress = userProgress?.find(p => p.course_id === course.id);
              return (
                <CourseCard
                  key={course.id}
                  title={course.title}
                  description={course.description}
                  duration={course.duration}
                  participants={0}
                  progress={progress?.progress_percentage || 0}
                  type={course.course_type as 'text' | 'video' | 'arcade'}
                  image={course.image_url || 'photo-1516321318423-f06f85e504b3?w=500&h=300&fit=crop'}
                  level={course.level as 'Principiante' | 'Intermedio' | 'Avanzato'}
                  requiresPayment={course.requires_payment || false}
                  price={Number(course.price) || 0}
                  courseId={course.id}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
};
