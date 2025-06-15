import { Bell, User, LogOut, Settings as SettingsIcon, Bot } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { AiChatModal } from '@/components/ai-chat/AiChatModal';
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
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const handleSettingsClick = () => {
    navigate('/settings');
  };

  console.log('Header - Current profile:', profile);
  console.log('Header - User email:', user?.email);

  return (
    <>
      <header className="bg-background border-b border-border px-educational-lg py-educational-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-educational-md">
            <img 
              src="/lovable-uploads/a00c60b8-e61f-425d-a9d2-0b978977292c.png" 
              alt="FairMind Logo"
              className="h-8 w-auto"
            />
          </div>
          
          <div className="flex items-center space-x-educational-md">
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => setIsChatOpen(true)}
                variant="outline"
                size="icon"
                className="hover-educational relative bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20 hover:from-primary/20 hover:to-secondary/20"
                title="Assistente AI"
              >
                <Bot className="h-5 w-5 text-primary" />
              </Button>
              <span className="text-sm text-muted-foreground">Need Help?</span>
            </div>

            <ThemeToggle />
            
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
                <DropdownMenuLabel className="text-educational-body">{t('navigation.myAccount')}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSettingsClick} className="text-educational-body">
                  <SettingsIcon className="mr-2 h-4 w-4" />
                  {t('navigation.settings')}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-educational-body">
                  <LogOut className="mr-2 h-4 w-4" />
                  {t('navigation.logout')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <AiChatModal 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
      />
    </>
  );
};
