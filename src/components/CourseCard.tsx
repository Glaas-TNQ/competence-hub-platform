
import { Clock, Users, BookOpen, Play } from 'lucide-react';

interface CourseCardProps {
  title: string;
  description: string;
  duration: string;
  participants: number;
  progress?: number;
  type: 'text' | 'video' | 'arcade';
  image: string;
  level: 'Principiante' | 'Intermedio' | 'Avanzato';
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

export const CourseCard = ({ title, description, duration, participants, progress, type, image, level }: CourseCardProps) => {
  const IconComponent = typeIcons[type];
  
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group border border-slate-100 w-full">
      <div className="relative">
        <img 
          src={`https://images.unsplash.com/${image}`} 
          alt={title}
          className="w-full h-40 md:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 md:top-4 right-3 md:right-4">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${levelColors[level]}`}>
            {level}
          </span>
        </div>
        <div className="absolute bottom-3 md:bottom-4 left-3 md:left-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2">
            <IconComponent size={18} className="text-slate-700 md:w-5 md:h-5" />
          </div>
        </div>
      </div>
      
      <div className="p-4 md:p-6">
        <h3 className="text-lg md:text-xl font-semibold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
          {title}
        </h3>
        <p className="text-slate-600 mb-4 line-clamp-2 text-sm md:text-base">
          {description}
        </p>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-slate-500 mb-4 gap-2">
          <div className="flex items-center space-x-3 md:space-x-4">
            <div className="flex items-center space-x-1">
              <Clock size={14} className="md:w-4 md:h-4" />
              <span className="text-xs md:text-sm">{duration}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users size={14} className="md:w-4 md:h-4" />
              <span className="text-xs md:text-sm">{participants} partecipanti</span>
            </div>
          </div>
        </div>
        
        {progress !== undefined && (
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-600 text-xs md:text-sm">Progresso</span>
              <span className="text-slate-800 font-medium text-xs md:text-sm">{progress}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}
        
        <button className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-2 md:py-3 rounded-lg font-medium hover:from-blue-700 hover:to-blue-600 transition-all duration-200 transform hover:scale-105 text-sm md:text-base">
          {progress ? 'Continua' : 'Inizia Corso'}
        </button>
      </div>
    </div>
  );
};
