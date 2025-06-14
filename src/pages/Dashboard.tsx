
import { BookOpen, Clock, Award, TrendingUp, Users, Target, Laptop } from 'lucide-react';
import { CourseCard } from '../components/CourseCard';
import { StatsCard } from '../components/StatsCard';
import { competenceAreas, userStats, recentActivity } from '../data/mockData';

export const Dashboard = () => {
  const featuredCourses = competenceAreas.flatMap(area => 
    area.topics.flatMap(topic => topic.courses)
  ).slice(0, 3);

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Benvenuto nella tua Academy</h1>
        <p className="text-slate-600">Continua il tuo percorso di apprendimento</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Corsi Completati"
          value={userStats.coursesCompleted.toString()}
          icon={<BookOpen size={24} />}
          color="blue"
          trend={{ value: "+2 questo mese", isPositive: true }}
        />
        <StatsCard
          title="Ore di Formazione"
          value={userStats.hoursLearned.toString()}
          icon={<Clock size={24} />}
          color="green"
          trend={{ value: "+8h questa settimana", isPositive: true }}
        />
        <StatsCard
          title="Certificati"
          value={userStats.certificatesEarned.toString()}
          icon={<Award size={24} />}
          color="purple"
        />
        <StatsCard
          title="Streak Giorni"
          value={userStats.currentStreak.toString()}
          icon={<TrendingUp size={24} />}
          color="orange"
          trend={{ value: "Record personale!", isPositive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Featured Courses */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-800">Corsi in Evidenza</h2>
            <button className="text-blue-600 hover:text-blue-700 font-medium">Vedi tutti</button>
          </div>
          
          <div className="grid gap-6">
            {featuredCourses.map((course) => (
              <CourseCard key={course.id} {...course} />
            ))}
          </div>
        </div>

        {/* Sidebar Content */}
        <div className="space-y-6">
          {/* Quick Access */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Accesso Rapido</h3>
            <div className="space-y-3">
              {competenceAreas.map((area) => {
                const icons = { users: Users, target: Target, laptop: Laptop };
                const IconComponent = icons[area.icon as keyof typeof icons] || Target;
                
                return (
                  <button
                    key={area.id}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors text-left"
                  >
                    <div className={`w-10 h-10 bg-gradient-to-br from-${area.color}-500 to-${area.color}-600 rounded-lg flex items-center justify-center text-white`}>
                      <IconComponent size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{area.name}</p>
                      <p className="text-sm text-slate-500">{area.topics.length} tematiche</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Attività Recente</h3>
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
          </div>
        </div>
      </div>
    </div>
  );
};
