
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
    <header className="bg-white border-b border-slate-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-slate-800">Academy Corporate</h2>
          {profile?.role === 'admin' && (
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/admin')}
                className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
              >
                <Shield className="h-4 w-4 mr-2" />
                Admin Panel
              </Button>
              <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                Amministratore
              </span>
            </div>
          )}
          {user?.email === 'admin@academy.com' && !profile && (
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/admin')}
                className="bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100"
              >
                <Shield className="h-4 w-4 mr-2" />
                Admin Panel (Caricamento...)
              </Button>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Cerca contenuti..."
              className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80"
            />
          </div>
          
          <button className="relative p-2 text-slate-600 hover:text-slate-800 transition-colors">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
          </button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                  <User size={16} className="text-white" />
                </div>
                <span className="font-medium text-slate-700">
                  {profile?.full_name || user?.email}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Il mio account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <SettingsIcon className="mr-2 h-4 w-4" />
                Impostazioni
              </DropdownMenuItem>
              {(profile?.role === 'admin' || user?.email === 'admin@academy.com') && (
                <DropdownMenuItem onClick={() => navigate('/admin')}>
                  <Shield className="mr-2 h-4 w-4" />
                  Admin Dashboard
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
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
