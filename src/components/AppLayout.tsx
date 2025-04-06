
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-aqua-50 to-white">
      <header className="bg-white shadow-sm border-b border-aqua-100">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="relative h-8 w-8">
              <div className="absolute inset-0 bg-aqua-500 rounded-full opacity-70" />
              <div className="absolute inset-1 bg-aqua-300 rounded-full" />
              <div className="absolute inset-2 bg-aqua-100 rounded-full animate-ripple" />
            </div>
            <span className="text-xl font-bold text-aqua-800">SwimTracker</span>
          </Link>
          
          <nav className="flex space-x-1">
            <Link to="/">
              <Button 
                variant={location.pathname === '/' ? 'default' : 'ghost'}
                className={cn(
                  location.pathname === '/' ? 'bg-aqua-500 hover:bg-aqua-600' : '',
                  "text-sm sm:text-base"
                )}
              >
                Dashboard
              </Button>
            </Link>
            <Link to="/log">
              <Button 
                variant={location.pathname === '/log' ? 'default' : 'ghost'}
                className={cn(
                  location.pathname === '/log' ? 'bg-aqua-500 hover:bg-aqua-600' : '',
                  "text-sm sm:text-base"
                )}
              >
                Log Session
              </Button>
            </Link>
            <Link to="/history">
              <Button 
                variant={location.pathname === '/history' ? 'default' : 'ghost'}
                className={cn(
                  location.pathname === '/history' ? 'bg-aqua-500 hover:bg-aqua-600' : '',
                  "text-sm sm:text-base"
                )}
              >
                History
              </Button>
            </Link>
          </nav>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
      
      <footer className="bg-white border-t border-aqua-100 py-6 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} SwimTracker. Keep swimming!</p>
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;
