
import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  BookOpen, 
  Target, 
  Play, 
  Award, 
  BarChart3, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Home
} from 'lucide-react';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/' },
  { id: 'areas', label: 'Aree di Competenza', icon: Target, path: '/areas' },
  { id: 'my-learning', label: 'I Miei Corsi', icon: BookOpen, path: '/my-learning' },
  { id: 'progress', label: 'Progressi', icon: BarChart3, path: '/progress' },
  { id: 'certificates', label: 'Certificati', icon: Award, path: '/certificates' },
  { id: 'settings', label: 'Impostazioni', icon: Settings, path: '/settings' }
];

export const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div className={`bg-slate-900 text-white transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'} min-h-screen relative`}>
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 bg-white text-slate-900 rounded-full p-1 shadow-lg hover:shadow-xl transition-shadow"
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
            <BookOpen size={20} className="text-white" />
          </div>
          {!isCollapsed && <h1 className="text-xl font-bold">Academy Pro</h1>}
        </div>
      </div>

      <nav className="px-3">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.id}
              to={item.path}
              className={`flex items-center space-x-3 px-3 py-3 rounded-lg mb-1 transition-all duration-200 ${
                isActive 
                  ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg' 
                  : 'hover:bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              {!isCollapsed && <span className="font-medium">{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};
