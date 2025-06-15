
import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  BookOpen, 
  Target, 
  Award, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Home,
  Shield,
  Menu,
  X,
  Trophy,
  StickyNote
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/dashboard' },
  { id: 'areas', label: 'Aree di Competenza', icon: Target, path: '/areas' },
  { id: 'my-learning', label: 'I Miei Corsi', icon: BookOpen, path: '/my-learning' },
  { id: 'badges', label: 'Badge', icon: Trophy, path: '/badges' },
  { id: 'certificates', label: 'Certificati', icon: Award, path: '/certificates' },
  { id: 'notes', label: 'Note', icon: StickyNote, path: '/notes' },
  { id: 'goals', label: 'Obiettivi', icon: Target, path: '/goals' },
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
          className="fixed top-6 left-6 z-50 md:hidden bg-white/90 backdrop-blur-md shadow-educational border border-muted"
          onClick={() => setIsMobileOpen(true)}
        >
          <Menu size={20} />
        </Button>

        {/* Mobile Overlay */}
        {isMobileOpen && (
          <div 
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            onClick={() => setIsMobileOpen(false)}
          />
        )}

        {/* Mobile Sidebar */}
        <div className={`fixed left-0 top-0 h-full w-80 bg-background/95 backdrop-blur-lg border-r border-border z-50 transform transition-transform duration-300 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="flex items-center justify-between p-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center border border-primary/20">
                <BookOpen size={22} className="text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">FairMind Academy</h1>
                <p className="text-sm text-muted-foreground">Piattaforma educativa</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileOpen(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X size={20} />
            </Button>
          </div>

          <nav className="px-6 space-y-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.id}
                  to={item.path}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center space-x-4 px-4 py-3 rounded-2xl transition-all duration-200 group ${
                    isActive 
                      ? 'bg-primary/10 text-primary border-l-4 border-primary' 
                      : 'hover:bg-muted/50 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <item.icon size={20} className={`${isActive ? 'text-primary' : ''}`} />
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              );
            })}

            {isAdmin && (
              <NavLink
                to="/admin"
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center space-x-4 px-4 py-3 rounded-2xl transition-all duration-200 mt-6 pt-6 border-t border-border ${
                  location.pathname === '/admin'
                    ? 'bg-destructive/10 text-destructive border-l-4 border-destructive' 
                    : 'hover:bg-destructive/5 text-muted-foreground hover:text-destructive'
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
    <div className={`bg-background/95 backdrop-blur-lg border-r border-border transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-72'} min-h-screen relative hidden md:block`}>
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-4 top-8 bg-background border border-border rounded-full p-2 shadow-educational hover:shadow-educational-lg transition-all duration-200 hover:scale-105 z-10"
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {/* Header - solo quando non è collassato */}
      {!isCollapsed && (
        <div className="p-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center border border-primary/20">
              <BookOpen size={22} className="text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">FairMind Academy</h1>
              <p className="text-sm text-muted-foreground">Piattaforma educativa</p>
            </div>
          </div>
        </div>
      )}

      {/* Icona centrale quando collassato */}
      {isCollapsed && (
        <div className="p-4 flex justify-center">
          <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center border border-primary/20">
            <BookOpen size={22} className="text-primary" />
          </div>
        </div>
      )}

      <nav className={`${isCollapsed ? 'px-2' : 'px-6'} space-y-2`}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.id}
              to={item.path}
              className={`flex items-center ${isCollapsed ? 'justify-center w-12 h-12 mx-auto' : 'space-x-4'} px-4 py-3 rounded-2xl transition-all duration-200 group ${
                isActive 
                  ? isCollapsed 
                    ? 'bg-primary/15 text-primary' 
                    : 'bg-primary/10 text-primary border-l-4 border-primary'
                  : 'hover:bg-muted/50 text-muted-foreground hover:text-foreground'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <item.icon size={20} className={`${isActive ? 'text-primary' : ''} flex-shrink-0`} />
              {!isCollapsed && <span className="font-medium">{item.label}</span>}
            </NavLink>
          );
        })}

        {isAdmin && (
          <NavLink
            to="/admin"
            className={`flex items-center ${isCollapsed ? 'justify-center w-12 h-12 mx-auto' : 'space-x-4'} px-4 py-3 rounded-2xl transition-all duration-200 mt-6 pt-6 border-t border-border ${
              location.pathname === '/admin'
                ? isCollapsed
                  ? 'bg-destructive/15 text-destructive'
                  : 'bg-destructive/10 text-destructive border-l-4 border-destructive'
                : 'hover:bg-destructive/5 text-muted-foreground hover:text-destructive'
            }`}
            title={isCollapsed ? "Admin Panel" : undefined}
          >
            <Shield size={20} className="flex-shrink-0" />
            {!isCollapsed && <span className="font-medium">Admin Panel</span>}
          </NavLink>
        )}
      </nav>
    </div>
  );
};
