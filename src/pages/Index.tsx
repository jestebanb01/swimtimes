
import React from 'react';
import AppLayout from '@/components/AppLayout';
import SwimDashboard from '@/components/SwimDashboard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useSwim } from '@/contexts/SwimContext';
import { useTraining } from '@/contexts/TrainingContext';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dumbbell, ArrowRight } from 'lucide-react';

const Index = () => {
  const { sessions } = useSwim();
  const { trainingSessions } = useTraining();
  
  // Calculate training stats
  const totalTrainings = trainingSessions.length;
  const totalTrainingDistance = trainingSessions.reduce((sum, session) => sum + session.distance, 0);
  const lastTrainingDate = trainingSessions.length > 0 
    ? new Date(Math.max(...trainingSessions.map(s => new Date(s.date).getTime())))
    : null;
  
  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Hero section for new users */}
        {sessions.length === 0 && trainingSessions.length === 0 && (
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
        
        {/* Training Stats Section - only show if there are training sessions */}
        {trainingSessions.length > 0 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-aqua-800">Training Stats</h2>
              <Link to="/history?tab=training">
                <Button variant="ghost" className="text-aqua-600 hover:text-aqua-700 flex items-center">
                  View All <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Total Trainings</CardTitle>
                  <CardDescription>All time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Dumbbell className="h-5 w-5 text-aqua-600 mr-2" />
                    <p className="text-3xl font-bold text-aqua-700">{totalTrainings}</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Total Distance</CardTitle>
                  <CardDescription>All trainings</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-aqua-700">{totalTrainingDistance}m</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {(totalTrainingDistance / 1000).toFixed(2)} km
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Last Training</CardTitle>
                  <CardDescription>Date</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-xl font-bold text-aqua-700">
                    {lastTrainingDate ? format(lastTrainingDate, 'MMM d, yyyy') : '-'}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
        
        {/* Swimming Dashboard */}
        <SwimDashboard />
        
        {/* Action buttons for logged-in users with sessions */}
        {(sessions.length > 0 || trainingSessions.length > 0) && (
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
        
        {/* Recent swim sessions */}
        {sessions.length > 0 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-aqua-800">Recent Swim Sessions</h2>
              <Link to="/history">
                <Button variant="ghost" className="text-aqua-600 hover:text-aqua-700 flex items-center">
                  View All <ArrowRight className="ml-1 h-4 w-4" />
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
        
        {/* Recent training sessions */}
        {trainingSessions.length > 0 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-aqua-800">Recent Training Sessions</h2>
              <Link to="/history?tab=training">
                <Button variant="ghost" className="text-aqua-600 hover:text-aqua-700 flex items-center">
                  View All <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {trainingSessions.slice(0, 3).map((session) => (
                <div key={session.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold">
                      {format(new Date(session.date), 'MMM d, yyyy')}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      session.intensity === 'Light' ? 'bg-green-100 text-green-800' :
                      session.intensity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {session.intensity}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mt-1">
                    {session.distance}m
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
