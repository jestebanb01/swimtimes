
import React from 'react';
import { format } from 'date-fns';
import { SwimSession, SwimStyle } from '@/types/swim';
import { formatSwimTime, calculatePace } from '@/utils/timeUtils';
import { 
  Card, 
  CardContent, 
  CardDescription, 
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  CalendarIcon, 
  ClockIcon,
  MoreVertical,
  Edit,
  Trash,
  Timer,
  Waves
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const styleNames: Record<SwimStyle, string> = {
  freestyle: 'Freestyle',
  breaststroke: 'Breaststroke',
  butterfly: 'Butterfly',
  backstroke: 'Backstroke',
  medley: 'Medley'
};

interface SessionCardProps {
  session: SwimSession;
  onEdit: (session: SwimSession) => void;
  onDelete: (id: string) => void;
  readOnly?: boolean;
}

const SessionCard: React.FC<SessionCardProps> = ({ 
  session, 
  onEdit, 
  onDelete,
  readOnly = false 
}) => {
  return (
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
          <div className="flex items-center">
            <div className="bg-aqua-100 text-aqua-800 px-3 py-1 rounded-full text-sm font-medium mr-2">
              {session.distance}m
            </div>
            {!readOnly && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(session)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <div className="flex items-center w-full">
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </div>
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
                            onClick={() => onDelete(session.id)}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
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
        
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Timer className="h-3 w-3" />
            {session.chronoType || 'Manual'}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Waves className="h-3 w-3" />
            {session.sessionType || 'Pool'}
          </Badge>
        </div>
        
        <p className="text-sm mt-2">
          <span className="font-medium">Location:</span> {session.location}
        </p>
        {session.description && (
          <p className="text-sm mt-2 text-gray-600 line-clamp-2">
            {session.description}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default SessionCard;
