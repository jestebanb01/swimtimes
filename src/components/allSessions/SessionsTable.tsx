
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { format } from 'date-fns';
import { formatSwimTime } from '@/utils/timeUtils';
import { SwimmerSession } from '@/services/swimmerService';

interface SessionsTableProps {
  sessions: SwimmerSession[];
}

const SessionsTable: React.FC<SessionsTableProps> = ({ sessions }) => {
  if (sessions.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-lg text-gray-600">No swimming sessions found.</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Swimmer</TableHead>
            <TableHead>Year of Birth</TableHead>
            <TableHead>Club</TableHead>
            <TableHead>Style</TableHead>
            <TableHead>Distance</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Location</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sessions.map((session) => (
            <TableRow key={session.id}>
              <TableCell>{format(session.date, 'PPP')}</TableCell>
              <TableCell>
                {session.swimmer.firstName} {session.swimmer.lastName}
              </TableCell>
              <TableCell>{session.swimmer.yearOfBirth}</TableCell>
              <TableCell>{session.swimmer.clubName || '-'}</TableCell>
              <TableCell className="capitalize">{session.style}</TableCell>
              <TableCell>{session.distance}m</TableCell>
              <TableCell>{formatSwimTime(session.time)}</TableCell>
              <TableCell>{session.location}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SessionsTable;
