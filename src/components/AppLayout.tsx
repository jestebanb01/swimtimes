
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, Settings, Dumbbell, Pool } from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-aqua-800">
            SwimTracker
          </Link>
          
          <nav className="hidden md:flex space-x-4">
            <Link to="/" className="text-gray-600 hover:text-gray-900">
              Dashboard
            </Link>
            <Link to="/log" className="text-gray-600 hover:text-gray-900">
              Log Session
            </Link>
            <Link to="/log-training" className="text-gray-600 hover:text-gray-900">
              Log Training
            </Link>
            <Link to="/history" className="text-gray-600 hover:text-gray-900">
              History
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4">
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
                  <span>Profile Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="cursor-pointer"
                  onClick={() => navigate('/log')}
                >
                  <Pool className="mr-2 h-4 w-4" />
                  <span>Log Swim Session</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="cursor-pointer"
                  onClick={() => navigate('/log-training')}
                >
                  <Dumbbell className="mr-2 h-4 w-4" />
                  <span>Log Training</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="cursor-pointer text-red-500 focus:text-red-500"
                  onClick={() => signOut()}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <div className="md:hidden container mx-auto px-4 py-2 border-t border-gray-100">
          <div className="flex justify-between space-x-4 text-sm">
            <Link to="/" className="text-gray-600 hover:text-gray-900 flex-1 text-center py-1">
              Dashboard
            </Link>
            <Link to="/log" className="text-gray-600 hover:text-gray-900 flex-1 text-center py-1">
              Log Session
            </Link>
            <Link to="/log-training" className="text-gray-600 hover:text-gray-900 flex-1 text-center py-1">
              Log Training
            </Link>
            <Link to="/history" className="text-gray-600 hover:text-gray-900 flex-1 text-center py-1">
              History
            </Link>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
      
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} SwimTracker. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;
