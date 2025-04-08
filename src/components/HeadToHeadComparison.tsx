
import React, { useState } from 'react';
import { useSwim } from '@/contexts/SwimContext';
import { formatSwimTime, timeToTotalSeconds } from '@/utils/timeUtils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { format } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Trophy, 
  TrendingDown, 
  TrendingUp, 
  Users, 
  Search, 
  AlertCircle 
} from 'lucide-react';
import { SwimStyle, SwimTime, BestTimeComparison } from '@/types/swim';

const HeadToHeadComparison: React.FC = () => {
  const { sessions } = useSwim();
  const { toast } = useToast();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [comparisons, setComparisons] = useState<BestTimeComparison[]>([]);
  const [opponentName, setOpponentName] = useState<string | null>(null);
  const [activeDistance, setActiveDistance] = useState<string>('all');

  // Get all unique distances from the user's sessions
  const uniqueDistances = Array.from(new Set(sessions.map(s => s.distance))).sort((a, b) => a - b);
  
  // Common swim distances for filtering
  const commonDistances = [50, 100, 200, 400, 800, 1500];
  const tabDistances = ['all', ...commonDistances.filter(d => uniqueDistances.includes(d)).map(d => d.toString())];

  const findOpponentBestTimes = async () => {
    if (!firstName.trim() && !lastName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter at least a first name or last name to compare with",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    try {
      // First get the opponent's user ID from their name
      let query = supabase
        .from('profiles')
        .select('id, first_name, last_name');
      
      if (firstName.trim() && lastName.trim()) {
        // If both first and last name are provided
        query = query
          .eq('first_name', firstName.trim())
          .eq('last_name', lastName.trim());
      } else if (firstName.trim()) {
        // If only first name is provided
        query = query.eq('first_name', firstName.trim());
      } else {
        // If only last name is provided
        query = query.eq('last_name', lastName.trim());
      }

      const { data: users, error: userError } = await query.limit(1);

      if (userError) throw userError;
      
      if (!users || users.length === 0) {
        toast({
          title: "User not found",
          description: "No user found with that name",
          variant: "destructive",
        });
        setIsSearching(false);
        return;
      }

      const opponentId = users[0].id;
      const displayName = users[0].first_name && users[0].last_name
        ? `${users[0].first_name} ${users[0].last_name}`
        : (users[0].first_name || users[0].last_name);
      setOpponentName(displayName);

      // Get the opponent's swim sessions
      const { data: opponentSessions, error: sessionsError } = await supabase
        .from('swim_sessions')
        .select('*')
        .eq('user_id', opponentId);

      if (sessionsError) throw sessionsError;

      if (!opponentSessions || opponentSessions.length === 0) {
        toast({
          title: "No swim data",
          description: "This user has no swim sessions recorded",
          variant: "destructive",
        });
        setIsSearching(false);
        return;
      }

      // Format opponent sessions to match our format
      const formattedOpponentSessions = opponentSessions.map(session => ({
        id: session.id,
        date: new Date(session.date),
        style: session.style as SwimStyle,
        distance: session.distance,
        time: {
          minutes: session.minutes,
          seconds: session.seconds,
          centiseconds: session.centiseconds,
        },
        location: session.location,
        description: session.description || '',
        poolLength: session.pool_length,
        chronoType: session.chrono_type,
        sessionType: session.session_type,
      }));

      // Create comparisons
      const newComparisons: BestTimeComparison[] = [];
      
      // Get all unique distance-style combinations from both users
      const yourDistanceStyles = new Set(sessions.map(s => `${s.distance}-${s.style}`));
      const opponentDistanceStyles = new Set(formattedOpponentSessions.map(s => `${s.distance}-${s.style}`));
      const allDistanceStyles = new Set([...yourDistanceStyles, ...opponentDistanceStyles]);
      
      allDistanceStyles.forEach(distanceStyle => {
        const [distanceStr, style] = distanceStyle.split('-');
        const distance = parseInt(distanceStr);
        
        // Find your best time for this distance-style
        let yourBestSession = sessions
          .filter(s => s.distance === distance && s.style === style)
          .sort((a, b) => {
            const aTime = timeToTotalSeconds(a.time);
            const bTime = timeToTotalSeconds(b.time);
            return aTime - bTime;
          })[0];
        
        // Find opponent's best time for this distance-style
        let opponentBestSession = formattedOpponentSessions
          .filter(s => s.distance === distance && s.style === style)
          .sort((a, b) => {
            const aTime = timeToTotalSeconds(a.time);
            const bTime = timeToTotalSeconds(b.time);
            return aTime - bTime;
          })[0];
        
        let timeDifference = 0;
        if (yourBestSession && opponentBestSession) {
          const yourTime = timeToTotalSeconds(yourBestSession.time);
          const opponentTime = timeToTotalSeconds(opponentBestSession.time);
          timeDifference = opponentTime - yourTime; // Positive means your time is better
        }
        
        newComparisons.push({
          distance,
          style: style as SwimStyle,
          yourTime: yourBestSession?.time || null,
          yourDate: yourBestSession?.date || null,
          opponentTime: opponentBestSession?.time || null,
          opponentDate: opponentBestSession?.date || null,
          timeDifference
        });
      });
      
      // Sort by distance and then by style
      newComparisons.sort((a, b) => {
        if (a.distance !== b.distance) {
          return a.distance - b.distance;
        }
        return a.style.localeCompare(b.style);
      });
      
      setComparisons(newComparisons);
      
      toast({
        title: "Comparison ready",
        description: `Showing comparison with ${displayName}`,
      });
    } catch (error: any) {
      toast({
        title: "Error finding opponent",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const getComparisonMessage = (timeDiff: number): { icon: React.ReactNode, message: string, class: string } => {
    if (timeDiff > 0) {
      return { 
        icon: <TrendingDown className="h-5 w-5 text-green-500" />, 
        message: `You're ${formatTimeDifference(timeDiff)} faster`, 
        class: 'text-green-600'
      };
    } else if (timeDiff < 0) {
      return { 
        icon: <TrendingUp className="h-5 w-5 text-red-500" />, 
        message: `You're ${formatTimeDifference(Math.abs(timeDiff))} slower`, 
        class: 'text-red-600'
      };
    } else {
      return { 
        icon: <Trophy className="h-5 w-5 text-yellow-500" />, 
        message: 'Tied!', 
        class: 'text-yellow-600'
      };
    }
  };

  const formatTimeDifference = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const centiseconds = Math.round((seconds - Math.floor(seconds)) * 100);
    
    if (minutes > 0) {
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
    }
    return `${remainingSeconds}.${centiseconds.toString().padStart(2, '0')}`;
  };

  // Filter comparisons based on selected distance
  const filteredComparisons = activeDistance === 'all'
    ? comparisons
    : comparisons.filter(c => c.distance === parseInt(activeDistance));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-aqua-600" />
            Head to Head Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full mb-3"
              />
              <Input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full"
              />
            </div>
            <Button 
              onClick={findOpponentBestTimes} 
              disabled={isSearching}
              className="bg-aqua-600 hover:bg-aqua-700 self-end"
            >
              {isSearching ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Searching...
                </div>
              ) : (
                <div className="flex items-center">
                  <Search className="h-4 w-4 mr-2" />
                  Compare Times
                </div>
              )}
            </Button>
          </div>
          
          {comparisons.length > 0 && opponentName && (
            <div className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  Your times vs. {opponentName}
                </h3>
                
                {uniqueDistances.length > 0 && (
                  <Tabs value={activeDistance} onValueChange={setActiveDistance}>
                    <TabsList>
                      {tabDistances.map(distance => (
                        <TabsTrigger key={distance} value={distance}>
                          {distance === 'all' ? 'All Distances' : `${distance}m`}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>
                )}
              </div>
              
              {filteredComparisons.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Distance</TableHead>
                        <TableHead>Style</TableHead>
                        <TableHead>Your Best</TableHead>
                        <TableHead>Opponent's Best</TableHead>
                        <TableHead>Comparison</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredComparisons.map((comp, index) => {
                        const comparison = getComparisonMessage(comp.timeDifference);
                        return (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{comp.distance}m</TableCell>
                            <TableCell className="capitalize">{comp.style}</TableCell>
                            <TableCell>
                              {comp.yourTime ? (
                                <>
                                  <div className="font-mono font-semibold">{formatSwimTime(comp.yourTime)}</div>
                                  <div className="text-xs text-gray-500">
                                    {comp.yourDate && format(comp.yourDate, 'MMM d, yyyy')}
                                  </div>
                                </>
                              ) : (
                                <span className="text-gray-500">No data</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {comp.opponentTime ? (
                                <>
                                  <div className="font-mono font-semibold">{formatSwimTime(comp.opponentTime)}</div>
                                  <div className="text-xs text-gray-500">
                                    {comp.opponentDate && format(comp.opponentDate, 'MMM d, yyyy')}
                                  </div>
                                </>
                              ) : (
                                <span className="text-gray-500">No data</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {comp.yourTime && comp.opponentTime ? (
                                <div className={`flex items-center gap-1 ${comparison.class}`}>
                                  {comparison.icon}
                                  <span>{comparison.message}</span>
                                </div>
                              ) : (
                                <span className="text-gray-500 flex items-center">
                                  <AlertCircle className="h-4 w-4 mr-1" />
                                  Incomplete data
                                </span>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <AlertCircle className="h-10 w-10 mx-auto mb-2" />
                  <p>No matching distance/style combinations found.</p>
                  <p className="text-sm">Try selecting a different distance or "All Distances".</p>
                </div>
              )}
            </div>
          )}
          
          {comparisons.length === 0 && !isSearching && (
            <div className="text-center py-8 text-gray-500 mt-4">
              <Users className="h-10 w-10 mx-auto mb-2" />
              <p>Enter an opponent's first and last name and click "Compare Times" to see how your swim times compare.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HeadToHeadComparison;
