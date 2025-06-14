
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
  Home,
  Shield,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';

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
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const { user, profile } = useAuth();
  const isMobile = useIsMobile();

  const isAdmin = profile?.role === 'admin' || user?.email === 'admin@academy.com';

  // Mobile toggle button
  if (isMobile) {
    return (
      <>
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50 md:hidden bg-white shadow-lg"
          onClick={() => setIsMobileOpen(true)}
        >
          <Menu size={20} />
        </Button>

        {/* Mobile Overlay */}
        {isMobileOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsMobileOpen(false)}
          />
        )}

        {/* Mobile Sidebar */}
        <div className={`fixed left-0 top-0 h-full w-80 bg-slate-900 text-white z-50 transform transition-transform duration-300 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                <BookOpen size={20} className="text-white" />
              </div>
              <h1 className="text-xl font-bold">Academy Pro</h1>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileOpen(false)}
              className="text-white hover:bg-slate-800"
            >
              <X size={20} />
            </Button>
          </div>

          <nav className="px-3">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.id}
                  to={item.path}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-3 rounded-lg mb-1 transition-all duration-200 ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg' 
                      : 'hover:bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  <item.icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              );
            })}

            {isAdmin && (
              <NavLink
                to="/admin"
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center space-x-3 px-3 py-3 rounded-lg mb-1 transition-all duration-200 mt-4 border-t border-slate-700 pt-4 ${
                  location.pathname === '/admin'
                    ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg' 
                    : 'hover:bg-red-900 text-red-300 hover:text-white bg-red-950'
                }`}
              >
                <Shield size={20} />
                <span className="font-medium">Admin Panel</span>
              </NavLink>
            )}
          </nav>
        </div>
      </>
    );
  }

  // Desktop sidebar
  return (
    <div className={`bg-slate-900 text-white transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'} min-h-screen relative hidden md:block`}>
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

        {isAdmin && (
          <NavLink
            to="/admin"
            className={`flex items-center space-x-3 px-3 py-3 rounded-lg mb-1 transition-all duration-200 mt-4 border-t border-slate-700 pt-4 ${
              location.pathname === '/admin'
                ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg' 
                : 'hover:bg-red-900 text-red-300 hover:text-white bg-red-950'
            }`}
          >
            <Shield size={20} />
            {!isCollapsed && <span className="font-medium">Admin Panel</span>}
          </NavLink>
        )}
      </nav>
    </div>
  );
};
