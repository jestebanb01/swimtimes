
import React, { useState } from 'react';
import { useSwim } from '@/contexts/SwimContext';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { SwimStyle, SwimSession } from '@/types/swim';
import { formatSwimTime, calculatePace } from '@/utils/timeUtils';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  ArrowUp, 
  ArrowDown, 
  Calendar as CalendarIcon, 
  Clock as ClockIcon 
} from 'lucide-react';

const styleNames: Record<SwimStyle, string> = {
  freestyle: 'Freestyle',
  breaststroke: 'Breaststroke',
  butterfly: 'Butterfly',
  backstroke: 'Backstroke'
};

const SwimSessionsList: React.FC = () => {
  const { sessions, deleteSession } = useSwim();
  const [sortField, setSortField] = useState<keyof SwimSession>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filterStyle, setFilterStyle] = useState<SwimStyle | 'all'>('all');

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  const handleSort = (field: keyof SwimSession) => {
    if (sortField === field) {
      toggleSortDirection();
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredSessions = sessions.filter(session => 
    filterStyle === 'all' || session.style === filterStyle
  );

  const sortedSessions = [...filteredSessions].sort((a, b) => {
    // Handle date sorting specially
    if (sortField === 'date') {
      return sortDirection === 'asc' 
        ? a.date.getTime() - b.date.getTime()
        : b.date.getTime() - a.date.getTime();
    }
    
    // Handle other fields
    if (sortField === 'distance') {
      return sortDirection === 'asc'
        ? a.distance - b.distance
        : b.distance - a.distance;
    }
    
    // Special case for time
    if (sortField === 'time') {
      const aSeconds = a.time.minutes * 60 + a.time.seconds + a.time.centiseconds / 100;
      const bSeconds = b.time.minutes * 60 + b.time.seconds + b.time.centiseconds / 100;
      return sortDirection === 'asc' ? aSeconds - bSeconds : bSeconds - aSeconds;
    }
    
    return 0;
  });

  const SortIcon = sortDirection === 'asc' ? ArrowUp : ArrowDown;

  if (sessions.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-lg text-gray-600">No swim sessions recorded yet.</p>
        <p className="text-sm text-gray-500 mt-2">Add your first session to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <h2 className="text-2xl font-bold text-aqua-800">Your Swim Sessions</h2>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                Filter by Style
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Swim Styles</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setFilterStyle('all')}>
                All Styles
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStyle('freestyle')}>
                Freestyle
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStyle('breaststroke')}>
                Breaststroke
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStyle('butterfly')}>
                Butterfly
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStyle('backstroke')}>
                Backstroke
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                Sort by
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Sort Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleSort('date')}>
                Date {sortField === 'date' && <SortIcon className="ml-2 h-4 w-4" />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort('distance')}>
                Distance {sortField === 'distance' && <SortIcon className="ml-2 h-4 w-4" />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort('time')}>
                Time {sortField === 'time' && <SortIcon className="ml-2 h-4 w-4" />}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedSessions.map((session) => (
          <Card key={session.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg font-bold">
                    {styleNames[session.style]}
                  </CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <CalendarIcon className="h-3 w-3 mr-1" />
                    {format(session.date, 'MMMM d, yyyy')}
                  </CardDescription>
                </div>
                <div className="bg-aqua-100 text-aqua-800 px-3 py-1 rounded-full text-sm font-medium">
                  {session.distance}m
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex items-center gap-1 text-lg font-mono font-semibold text-aqua-700">
                <ClockIcon className="h-4 w-4 mr-1" />
                {formatSwimTime(session.time)}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Pace: {calculatePace(session.time, session.distance)}
              </p>
              <p className="text-sm mt-2">
                <span className="font-medium">Location:</span> {session.location}
              </p>
              {session.description && (
                <p className="text-sm mt-2 text-gray-600 line-clamp-2">
                  {session.description}
                </p>
              )}
            </CardContent>
            <CardFooter className="pt-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 w-full"
                  >
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete this swim session record.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => deleteSession(session.id)}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SwimSessionsList;
