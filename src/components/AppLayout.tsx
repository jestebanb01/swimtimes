
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/contexts/ProfileContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, Settings, Dumbbell, Waves, Users, List, BarChart2 } from 'lucide-react';
import LanguageSelector from '@/components/LanguageSelector';
import { useLanguage } from '@/contexts/LanguageContext';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { signOut, user } = useAuth();
  const { profile } = useProfile();
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const isCoach = profile?.userType === 'coach';

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-aqua-800">
            SwimTracker
          </Link>
          
          <nav className="hidden md:flex space-x-4">
            <Link to="/" className="text-gray-600 hover:text-gray-900">
              {t('dashboard')}
            </Link>
            <Link to="/log" className="text-gray-600 hover:text-gray-900">
              {t('logSession')}
            </Link>
            <Link to="/log-training" className="text-gray-600 hover:text-gray-900">
              {t('logTraining')}
            </Link>
            <Link to="/history" className="text-gray-600 hover:text-gray-900">
              {t('history')}
            </Link>
            <Link to="/head-to-head" className="text-gray-600 hover:text-gray-900">
              Head to Head
            </Link>
            {isCoach && (
              <>
                <Link to="/swimmers" className="text-gray-600 hover:text-gray-900">
                  {t('mySwimmers')}
                </Link>
                <Link to="/all-sessions" className="text-gray-600 hover:text-gray-900">
                  {t('allSessions')}
                </Link>
              </>
            )}
          </nav>
          
          <div className="flex items-center space-x-2">
            <LanguageSelector />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex flex-col space-y-1 p-2">
                  <p className="text-sm font-medium">{user?.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="cursor-pointer"
                  onClick={() => navigate('/profile')}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  <span>{t('profile')}</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="cursor-pointer"
                  onClick={() => navigate('/log')}
                >
                  <Waves className="mr-2 h-4 w-4" />
                  <span>{t('logSession')}</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="cursor-pointer"
                  onClick={() => navigate('/log-training')}
                >
                  <Dumbbell className="mr-2 h-4 w-4" />
                  <span>{t('logTraining')}</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="cursor-pointer"
                  onClick={() => navigate('/head-to-head')}
                >
                  <BarChart2 className="mr-2 h-4 w-4" />
                  <span>Head to Head</span>
                </DropdownMenuItem>
                {isCoach && (
                  <>
                    <DropdownMenuItem 
                      className="cursor-pointer"
                      onClick={() => navigate('/swimmers')}
                    >
                      <Users className="mr-2 h-4 w-4" />
                      <span>{t('mySwimmers')}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="cursor-pointer"
                      onClick={() => navigate('/all-sessions')}
                    >
                      <List className="mr-2 h-4 w-4" />
                      <span>{t('allSessions')}</span>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="cursor-pointer text-red-500 focus:text-red-500"
                  onClick={() => signOut()}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{t('logOut')}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <div className="md:hidden container mx-auto px-4 py-2 border-t border-gray-100">
          <div className="flex flex-wrap justify-between space-x-2 text-sm">
            <Link to="/" className="text-gray-600 hover:text-gray-900 flex-1 text-center py-1">
              {t('dashboard')}
            </Link>
            <Link to="/log" className="text-gray-600 hover:text-gray-900 flex-1 text-center py-1">
              {t('logSession')}
            </Link>
            <Link to="/log-training" className="text-gray-600 hover:text-gray-900 flex-1 text-center py-1">
              {t('logTraining')}
            </Link>
            <Link to="/history" className="text-gray-600 hover:text-gray-900 flex-1 text-center py-1">
              {t('history')}
            </Link>
            <Link to="/head-to-head" className="text-gray-600 hover:text-gray-900 flex-1 text-center py-1">
              H2H
            </Link>
            {isCoach && (
              <>
                <Link to="/swimmers" className="text-gray-600 hover:text-gray-900 flex-1 text-center py-1">
                  {t('mySwimmers')}
                </Link>
                <Link to="/all-sessions" className="text-gray-600 hover:text-gray-900 flex-1 text-center py-1">
                  {t('allSessions')}
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
      
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} SwimTracker. {t('footer')}.
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;
