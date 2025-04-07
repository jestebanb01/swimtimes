
import React from 'react';
import { useSwim } from '@/contexts/SwimContext';
import { format } from 'date-fns';
import { SwimTime, SwimStyle } from '@/types/swim';
import { formatSwimTime, timeToTotalSeconds } from '@/utils/timeUtils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const SwimDashboard: React.FC = () => {
  const { sessions } = useSwim();
  
  if (sessions.length === 0) {
    return null;
  }
  
  // Total distance swam
  const totalDistance = sessions.reduce((sum, session) => sum + session.distance, 0);
  
  // Count sessions by style
  const sessionsByStyle: Record<SwimStyle, number> = {
    freestyle: 0,
    breaststroke: 0,
    butterfly: 0,
    backstroke: 0,
    medley: 0  // Added medley style
  };
  
  sessions.forEach(session => {
    sessionsByStyle[session.style]++;
  });
  
  // Find fastest 100m for each style
  const fastest100m: Partial<Record<SwimStyle, { time: SwimTime, date: Date } | null>> = {};
  
  sessions.forEach(session => {
    // Normalize to 100m pace
    const totalSeconds = timeToTotalSeconds(session.time);
    const secondsPer100m = (totalSeconds * 100) / session.distance;
    
    // Convert back to SwimTime format
    const minutes = Math.floor(secondsPer100m / 60);
    const seconds = Math.floor(secondsPer100m % 60);
    const centiseconds = Math.round((secondsPer100m - Math.floor(secondsPer100m)) * 100);
    
    const normalizedTime: SwimTime = { minutes, seconds, centiseconds };
    
    if (
      !fastest100m[session.style] ||
      timeToTotalSeconds(normalizedTime) < timeToTotalSeconds(fastest100m[session.style]!.time)
    ) {
      fastest100m[session.style] = {
        time: normalizedTime,
        date: session.date
      };
    }
  });
  
  // Get last session date
  const lastSessionDate = new Date(Math.max(...sessions.map(s => s.date.getTime())));
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-aqua-800">Your Swimming Stats</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Sessions</CardTitle>
            <CardDescription>All time</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-aqua-700">{sessions.length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Distance</CardTitle>
            <CardDescription>All time</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-aqua-700">{totalDistance}m</p>
            <p className="text-sm text-gray-500 mt-1">{(totalDistance / 1000).toFixed(2)} km</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Last Session</CardTitle>
            <CardDescription>Date</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold text-aqua-700">
              {sessions.length > 0 ? format(lastSessionDate, 'MMM d, yyyy') : '-'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Most Popular Style</CardTitle>
            <CardDescription>By session count</CardDescription>
          </CardHeader>
          <CardContent>
            {sessions.length > 0 ? (
              <p className="text-xl font-bold text-aqua-700 capitalize">
                {Object.entries(sessionsByStyle)
                  .sort(([, a], [, b]) => b - a)[0][0]}
              </p>
            ) : (
              <p>-</p>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Best Times (100m pace)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(['freestyle', 'breaststroke', 'butterfly', 'backstroke', 'medley'] as SwimStyle[]).map(style => (
            <Card key={style}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg capitalize">{style}</CardTitle>
                <CardDescription>Best 100m pace</CardDescription>
              </CardHeader>
              <CardContent>
                {fastest100m[style] ? (
                  <>
                    <p className="text-2xl font-mono font-bold text-aqua-700">
                      {formatSwimTime(fastest100m[style]!.time)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {format(fastest100m[style]!.date, 'MMM d, yyyy')}
                    </p>
                  </>
                ) : (
                  <p className="text-gray-500">No data</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SwimDashboard;
