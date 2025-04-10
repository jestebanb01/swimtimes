
import React from 'react';
import { SwimSession } from '@/types/swim';
import SessionCard from './SessionCard';

interface SessionsListProps {
  sessions: SwimSession[];
  onEdit: (session: SwimSession) => void;
  onDelete: (id: string) => void;
  readOnly?: boolean;
}

const SessionsList: React.FC<SessionsListProps> = ({ 
  sessions, 
  onEdit, 
  onDelete, 
  readOnly = false 
}) => {
  if (sessions.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-lg text-gray-600">No swim sessions recorded yet.</p>
        <p className="text-sm text-gray-500 mt-2">Add your first session to get started!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {sessions.map((session) => (
        <SessionCard
          key={session.id}
          session={session}
          onEdit={onEdit}
          onDelete={onDelete}
          readOnly={readOnly}
        />
      ))}
    </div>
  );
};

export default SessionsList;
