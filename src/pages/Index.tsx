
import React from 'react';
import AppLayout from '@/components/AppLayout';
import SwimDashboard from '@/components/SwimDashboard';
import SwimSessionsList from '@/components/SwimSessionsList';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useSwim } from '@/contexts/SwimContext';

const Index = () => {
  const { sessions } = useSwim();
  
  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Hero section for new users */}
        {sessions.length === 0 && (
          <div className="bg-aqua-50 border border-aqua-100 rounded-lg p-8 text-center">
            <h1 className="text-3xl font-bold text-aqua-800 mb-4">Welcome to SwimTracker</h1>
            <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
              Start tracking your swimming sessions to monitor your progress and improve your performance.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/log">
                <Button className="bg-aqua-600 hover:bg-aqua-700 text-white">
                  Log Your First Swim
                </Button>
              </Link>
              <Link to="/log-training">
                <Button variant="outline" className="border-aqua-600 text-aqua-600 hover:bg-aqua-50">
                  Log Training Session
                </Button>
              </Link>
            </div>
          </div>
        )}
        
        {/* Dashboard */}
        <SwimDashboard />
        
        {/* Action buttons for logged-in users with sessions */}
        {sessions.length > 0 && (
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <Link to="/log">
              <Button className="bg-aqua-600 hover:bg-aqua-700 text-white">
                Log New Swim
              </Button>
            </Link>
            <Link to="/log-training">
              <Button variant="outline" className="border-aqua-600 text-aqua-600 hover:bg-aqua-50">
                Log Training Session
              </Button>
            </Link>
          </div>
        )}
        
        {/* Recent sessions */}
        {sessions.length > 0 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-aqua-800">Recent Sessions</h2>
              <Link to="/history">
                <Button variant="ghost" className="text-aqua-600 hover:text-aqua-700">
                  View All
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sessions.slice(0, 3).map((session) => (
                <div key={session.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold capitalize">{session.style}</h3>
                    <span className="bg-aqua-100 text-aqua-800 px-2 py-1 rounded-full text-xs">
                      {session.distance}m
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm mt-1">
                    {new Date(session.date).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Index;
