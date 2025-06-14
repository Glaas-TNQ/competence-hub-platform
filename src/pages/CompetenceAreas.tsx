
import { Users, Target, Laptop, ArrowRight } from 'lucide-react';
import { competenceAreas } from '../data/mockData';

export const CompetenceAreas = () => {
  const icons = { users: Users, target: Target, laptop: Laptop };

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Aree di Competenza</h1>
        <p className="text-slate-600">Esplora le nostre aree di formazione specializzate</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {competenceAreas.map((area) => {
          const IconComponent = icons[area.icon as keyof typeof icons] || Target;
          const totalCourses = area.topics.reduce((acc, topic) => acc + topic.courses.length, 0);
          
          return (
            <div key={area.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group border border-slate-100">
              <div className={`h-32 bg-gradient-to-br from-${area.color}-500 to-${area.color}-600 relative`}>
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute bottom-4 left-6">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <IconComponent size={24} className="text-white" />
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
                  {area.name}
                </h3>
                <p className="text-slate-600 mb-4">
                  {area.description}
                </p>
                
                <div className="flex items-center justify-between text-sm text-slate-500 mb-6">
                  <span>{area.topics.length} tematiche</span>
                  <span>{totalCourses} corsi</span>
                </div>
                
                <div className="space-y-3 mb-6">
                  {area.topics.slice(0, 2).map((topic) => (
                    <div key={topic.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-800">{topic.name}</p>
                        <p className="text-sm text-slate-500">{topic.courses.length} corsi</p>
                      </div>
                      <ArrowRight size={16} className="text-slate-400" />
                    </div>
                  ))}
                  {area.topics.length > 2 && (
                    <p className="text-sm text-slate-500 px-3">
                      +{area.topics.length - 2} altre tematiche
                    </p>
                  )}
                </div>
                
                <button className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-blue-600 transition-all duration-200 transform hover:scale-105">
                  Esplora Area
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
