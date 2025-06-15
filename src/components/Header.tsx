
import { Bell, Search, User, LogOut, Settings as SettingsIcon, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';

export const Header = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  console.log('Header - Current profile:', profile);
  console.log('Header - User email:', user?.email);

  return (
    <header className="bg-background border-b border-border px-educational-lg py-educational-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-educational-md">
          <h2 className="text-educational-h2 font-bold text-accent-foreground">
            Academy Corporate
          </h2>
          {profile?.role === 'admin' && (
            <div className="flex items-center space-x-educational-sm">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/admin')}
                className="bg-destructive/5 border-destructive/20 text-destructive hover:bg-destructive/10 hover-educational"
              >
                <Shield className="h-4 w-4 mr-2" />
                Admin Panel
              </Button>
              <span className="text-educational-caption bg-destructive/10 text-destructive px-educational-sm py-1 rounded-pill">
                Amministratore
              </span>
            </div>
          )}
          {user?.email === 'admin@academy.com' && !profile && (
            <div className="flex items-center space-x-educational-sm">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/admin')}
                className="bg-secondary/10 border-secondary/20 text-secondary-foreground hover:bg-secondary/20 hover-educational"
              >
                <Shield className="h-4 w-4 mr-2" />
                Admin Panel (Caricamento...)
              </Button>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-educational-md">
          <div className="relative">
            <Search className="absolute left-educational-sm top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
            <input
              type="text"
              placeholder="Cerca contenuti..."
              className="pl-10 pr-educational-md py-educational-sm border border-input rounded-educational-lg focus:ring-2 focus:ring-focus focus:border-transparent w-80 bg-background text-educational-body transition-all duration-200"
            />
          </div>
          
          <button className="relative p-educational-sm text-muted-foreground hover:text-accent-foreground transition-colors hover-educational rounded-educational">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-educational-caption rounded-full w-5 h-5 flex items-center justify-center">
              3
            </span>
          </button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-educational-sm hover-educational">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                  <User size={16} className="text-primary-foreground" />
                </div>
                <span className="font-medium text-accent-foreground text-educational-body">
                  {profile?.full_name || user?.email}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="text-educational-body">Il mio account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-educational-body">
                <SettingsIcon className="mr-2 h-4 w-4" />
                Impostazioni
              </DropdownMenuItem>
              {(profile?.role === 'admin' || user?.email === 'admin@academy.com') && (
                <DropdownMenuItem onClick={() => navigate('/admin')} className="text-educational-body">
                  <Shield className="mr-2 h-4 w-4" />
                  Admin Dashboard
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="text-educational-body">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
