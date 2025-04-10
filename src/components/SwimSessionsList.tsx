
import React, { useState } from 'react';
import { useSwim } from '@/contexts/SwimContext';
import { SwimStyle, SwimSession } from '@/types/swim';
import EditSessionForm from './EditSessionForm';
import SessionFilter from './swim/SessionFilter';
import SessionsList from './swim/SessionsList';

interface SwimSessionsListProps {
  sessions?: SwimSession[];
  readOnly?: boolean;
}

const SwimSessionsList: React.FC<SwimSessionsListProps> = ({ sessions, readOnly = false }) => {
  const { sessions: contextSessions, deleteSession, loading } = useSwim();
  const [sortField, setSortField] = useState<keyof SwimSession>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filterStyle, setFilterStyle] = useState<SwimStyle | 'all'>('all');
  const [editingSession, setEditingSession] = useState<SwimSession | null>(null);

  // Use provided sessions if available, otherwise use from context
  const allSessions = sessions || contextSessions;

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

  const handleEdit = (session: SwimSession) => {
    if (!readOnly) {
      setEditingSession(session);
    }
  };

  const closeEditForm = () => {
    setEditingSession(null);
  };

  const filteredSessions = allSessions.filter(session => 
    filterStyle === 'all' || session.style === filterStyle
  );

  const sortedSessions = [...filteredSessions].sort((a, b) => {
    if (sortField === 'date') {
      return sortDirection === 'asc' 
        ? a.date.getTime() - b.date.getTime()
        : b.date.getTime() - a.date.getTime();
    }
    
    if (sortField === 'distance') {
      return sortDirection === 'asc'
        ? a.distance - b.distance
        : b.distance - a.distance;
    }
    
    if (sortField === 'time') {
      const aSeconds = a.time.minutes * 60 + a.time.seconds + a.time.centiseconds / 100;
      const bSeconds = b.time.minutes * 60 + b.time.seconds + b.time.centiseconds / 100;
      return sortDirection === 'asc' ? aSeconds - bSeconds : bSeconds - aSeconds;
    }
    
    return 0;
  });

  if (loading && !sessions) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-aqua-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <h2 className="text-2xl font-bold text-aqua-800">Your Swim Sessions</h2>
        
        <SessionFilter
          filterStyle={filterStyle}
          setFilterStyle={setFilterStyle}
          sortField={sortField}
          sortDirection={sortDirection}
          handleSort={handleSort}
          readOnly={readOnly}
        />
      </div>
      
      <SessionsList
        sessions={sortedSessions}
        onEdit={handleEdit}
        onDelete={deleteSession}
        readOnly={readOnly}
      />

      {!readOnly && editingSession && (
        <EditSessionForm 
          session={editingSession} 
          isOpen={!!editingSession} 
          onClose={closeEditForm} 
        />
      )}
    </div>
  );
};

export default SwimSessionsList;
