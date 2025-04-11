
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SwimSession, SwimStyle } from '@/types/swim';
import { formatSwimTime, timeToTotalSeconds } from '@/utils/timeUtils';
import { format } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy } from 'lucide-react';

interface SwimmerStatsCardProps {
  sessions: SwimSession[];
}

const SwimmerStatsCard: React.FC<SwimmerStatsCardProps> = ({ sessions }) => {
  if (sessions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Swimmer Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">No swim sessions available to generate statistics.</p>
        </CardContent>
      </Card>
    );
  }

  // Get all unique distances
  const uniqueDistances = Array.from(new Set(sessions.map(s => s.distance))).sort((a, b) => a - b);
  
  // Common swim distances for filtering
  const commonDistances = [50, 100, 200, 400, 800, 1500];
  const tabDistances = ['all', ...commonDistances.filter(d => uniqueDistances.includes(d)).map(d => d.toString())];

  // Find best times for each style and distance
  const bestTimes: Record<string, Record<string, { time: SwimSession['time'], date: Date } | null>> = {};
  
  // Initialize bestTimes structure
  uniqueDistances.forEach(distance => {
    bestTimes[distance.toString()] = {
      freestyle: null,
      breaststroke: null,
      butterfly: null,
      backstroke: null,
      medley: null
    };
  });
  
  // Populate best times
  sessions.forEach(session => {
    const distanceKey = session.distance.toString();
    
    if (!bestTimes[distanceKey]) {
      bestTimes[distanceKey] = {
        freestyle: null,
        breaststroke: null,
        butterfly: null,
        backstroke: null,
        medley: null
      };
    }
    
    const currentBest = bestTimes[distanceKey][session.style];
    const sessionSeconds = timeToTotalSeconds(session.time);
    
    if (!currentBest || sessionSeconds < timeToTotalSeconds(currentBest.time)) {
      bestTimes[distanceKey][session.style] = {
        time: session.time,
        date: session.date
      };
    }
  });

  // Find fastest 100m pace for each style (for summary view)
  const fastest100m: Record<SwimStyle, { time: SwimSession['time'], date: Date, distance: number } | null> = {
    freestyle: null,
    breaststroke: null,
    butterfly: null,
    backstroke: null,
    medley: null
  };
  
  sessions.forEach(session => {
    // Normalize to 100m pace
    const totalSeconds = timeToTotalSeconds(session.time);
    const secondsPer100m = (totalSeconds * 100) / session.distance;
    
    // Convert back to SwimTime format
    const minutes = Math.floor(secondsPer100m / 60);
    const seconds = Math.floor(secondsPer100m % 60);
    const centiseconds = Math.round((secondsPer100m - Math.floor(secondsPer100m)) * 100);
    
    const normalizedTime = { minutes, seconds, centiseconds };
    
    const currentBest = fastest100m[session.style];
    
    if (
      !currentBest ||
      timeToTotalSeconds(normalizedTime) < timeToTotalSeconds(currentBest.time)
    ) {
      fastest100m[session.style] = {
        time: normalizedTime,
        date: session.date,
        distance: session.distance
      };
    }
  });

  // Calculate total stats
  const totalDistance = sessions.reduce((sum, session) => sum + session.distance, 0);
  const sessionsByStyle: Record<SwimStyle, number> = {
    freestyle: 0,
    breaststroke: 0,
    butterfly: 0,
    backstroke: 0,
    medley: 0
  };
  
  sessions.forEach(session => {
    sessionsByStyle[session.style]++;
  });

  // Find most popular style
  const mostPopularStyle = Object.entries(sessionsByStyle)
    .sort(([, a], [, b]) => b - a)[0][0];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Swimmer Statistics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Summary stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Total Sessions</p>
              <p className="text-2xl font-bold text-aqua-700">{sessions.length}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Total Distance</p>
              <p className="text-2xl font-bold text-aqua-700">{totalDistance}m</p>
              <p className="text-xs text-gray-500 mt-1">{(totalDistance / 1000).toFixed(2)} km</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Last Session</p>
              <p className="text-xl font-bold text-aqua-700">
                {sessions.length > 0 
                  ? format(new Date(Math.max(...sessions.map(s => s.date.getTime()))), 'MMM d, yyyy') 
                  : '-'}
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Most Popular Style</p>
              <p className="text-xl font-bold text-aqua-700 capitalize">
                {sessions.length > 0 ? mostPopularStyle : '-'}
              </p>
            </div>
          </div>
          
          {/* Best times by distance */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Best Times</h3>
            
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-4">
                {tabDistances.map(distance => (
                  <TabsTrigger key={distance} value={distance} className="text-sm">
                    {distance === 'all' ? 'All (100m pace)' : `${distance}m`}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              <TabsContent value="all" className="mt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  {(['freestyle', 'breaststroke', 'butterfly', 'backstroke', 'medley'] as SwimStyle[]).map(style => (
                    <div key={style} className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 capitalize">{style}</p>
                      {fastest100m[style] ? (
                        <>
                          <p className="text-xl font-mono font-bold text-aqua-700">
                            {formatSwimTime(fastest100m[style]!.time)}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {format(fastest100m[style]!.date, 'MMM d, yyyy')}
                          </p>
                          <p className="text-xs text-gray-500">
                            from {fastest100m[style]!.distance}m swim
                          </p>
                        </>
                      ) : (
                        <p className="text-gray-500">No data</p>
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              {tabDistances
                .filter(distance => distance !== 'all')
                .map(distance => (
                  <TabsContent key={distance} value={distance} className="mt-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                      {(['freestyle', 'breaststroke', 'butterfly', 'backstroke', 'medley'] as SwimStyle[]).map(style => (
                        <div key={style} className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-500 capitalize">{style}</p>
                          {bestTimes[distance]?.[style] ? (
                            <>
                              <p className="text-xl font-mono font-bold text-aqua-700">
                                {formatSwimTime(bestTimes[distance][style]!.time)}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {format(bestTimes[distance][style]!.date, 'MMM d, yyyy')}
                              </p>
                            </>
                          ) : (
                            <p className="text-gray-500">No data</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                ))}
            </Tabs>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SwimmerStatsCard;
