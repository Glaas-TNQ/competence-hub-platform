
import { BookOpen, Clock, Award, TrendingUp, Users, Target, Laptop } from 'lucide-react';
import { CourseCard } from '../components/CourseCard';
import { StatsCard } from '../components/StatsCard';
import { userStats, recentActivity } from '../data/mockData';
import { useCourses, useCompetenceAreas } from '@/hooks/useSupabase';

export const Dashboard = () => {
  const { data: courses } = useCourses();
  const { data: competenceAreas } = useCompetenceAreas();

  // Show only the first 3 published courses
  const featuredCourses = courses?.filter(course => course.is_published).slice(0, 3) || [];

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Benvenuto nella tua Academy</h1>
        <p className="text-slate-600">Continua il tuo percorso di apprendimento</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Corsi Disponibili"
          value={courses?.filter(c => c.is_published)?.length?.toString() || "0"}
          icon={<BookOpen size={24} />}
          color="blue"
        />
        <StatsCard
          title="Aree di Competenza"
          value={competenceAreas?.length?.toString() || "0"}
          icon={<Target size={24} />}
          color="green"
        />
        <StatsCard
          title="Certificati"
          value={userStats.certificatesEarned.toString()}
          icon={<Award size={24} />}
          color="purple"
        />
        <StatsCard
          title="Ore di Studio"
          value={userStats.hoursLearned.toString()}
          icon={<Clock size={24} />}
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Featured Courses */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-800">Corsi in Evidenza</h2>
            <button className="text-blue-600 hover:text-blue-700 font-medium">Vedi tutti</button>
          </div>
          
          {featuredCourses.length > 0 ? (
            <div className="grid gap-6">
              {featuredCourses.map((course) => (
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
            <div className="text-center py-12 bg-white rounded-xl border border-slate-100">
              <BookOpen className="mx-auto h-12 w-12 text-slate-400 mb-4" />
              <h3 className="text-lg font-medium text-slate-800 mb-2">Nessun corso disponibile</h3>
              <p className="text-slate-600">I corsi pubblicati appariranno qui</p>
            </div>
          )}
        </div>

        {/* Sidebar Content */}
        <div className="space-y-6">
          {/* Quick Access */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Aree di Competenza</h3>
            {competenceAreas && competenceAreas.length > 0 ? (
              <div className="space-y-3">
                {competenceAreas.map((area) => {
                  const icons = { users: Users, target: Target, laptop: Laptop };
                  const IconComponent = icons[area.icon as keyof typeof icons] || Target;
                  
                  return (
                    <button
                      key={area.id}
                      className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors text-left"
                    >
                      <div className={`w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white`}>
                        <IconComponent size={20} />
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{area.name}</p>
                        <p className="text-sm text-slate-500">{area.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="text-slate-500 text-sm">Nessuna area di competenza configurata</p>
            )}
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Attività Recente</h3>
            {recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-slate-800 font-medium">{activity.title}</p>
                      <p className="text-sm text-slate-500">{activity.timestamp}</p>
                      <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mt-1">
                        +{activity.points} punti
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-sm">Nessuna attività recente</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
