
import { useState, useEffect } from 'react';
import { SwimmerSession } from '@/services/swimmerService';

export const useSessionFiltering = (sessions: SwimmerSession[]) => {
  const [filteredSessions, setFilteredSessions] = useState<SwimmerSession[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<string>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [groupBy, setGroupBy] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string>('all');

  useEffect(() => {
    // Apply filters, sorting, and grouping when dependencies change
    let result = [...sessions];
    
    // Filter by swim style
    if (selectedStyle !== 'all') {
      result = result.filter(session => session.style === selectedStyle);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        session => 
          session.swimmer.firstName?.toLowerCase().includes(query) ||
          session.swimmer.lastName?.toLowerCase().includes(query) ||
          session.location.toLowerCase().includes(query) ||
          session.swimmer.clubName?.toLowerCase().includes(query)
      );
    }
    
    // Sort results
    result.sort((a, b) => {
      let valueA, valueB;
      
      switch (sortField) {
        case 'date':
          valueA = a.date.getTime();
          valueB = b.date.getTime();
          break;
        case 'distance':
          valueA = a.distance;
          valueB = b.distance;
          break;
        case 'time':
          const totalCentisecondsA = a.time.minutes * 6000 + a.time.seconds * 100 + a.time.centiseconds;
          const totalCentisecondsB = b.time.minutes * 6000 + b.time.seconds * 100 + b.time.centiseconds;
          valueA = totalCentisecondsA;
          valueB = totalCentisecondsB;
          break;
        case 'name':
          valueA = `${a.swimmer.lastName}${a.swimmer.firstName}`.toLowerCase();
          valueB = `${b.swimmer.lastName}${b.swimmer.firstName}`.toLowerCase();
          break;
        case 'yearOfBirth':
          valueA = a.swimmer.yearOfBirth || 0;
          valueB = b.swimmer.yearOfBirth || 0;
          break;
        case 'club':
          valueA = (a.swimmer.clubName || '').toLowerCase();
          valueB = (b.swimmer.clubName || '').toLowerCase();
          break;
        default:
          valueA = a.date.getTime();
          valueB = b.date.getTime();
      }
      
      const compareResult = valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
      return sortDirection === 'asc' ? compareResult : -compareResult;
    });
    
    setFilteredSessions(result);
  }, [sessions, searchQuery, sortField, sortDirection, selectedStyle]);

  // Function to group sessions if needed
  const getGroupedSessions = () => {
    if (!groupBy) {
      return { "All Sessions": filteredSessions };
    }

    const grouped: Record<string, SwimmerSession[]> = {};
    
    filteredSessions.forEach(session => {
      let groupKey = '';
      
      switch (groupBy) {
        case 'style':
          groupKey = session.style;
          break;
        case 'club':
          groupKey = session.swimmer.clubName || 'No Club';
          break;
        case 'year':
          groupKey = session.swimmer.yearOfBirth?.toString() || 'Unknown';
          break;
        default:
          groupKey = 'All';
      }
      
      if (!grouped[groupKey]) {
        grouped[groupKey] = [];
      }
      
      grouped[groupKey].push(session);
    });
    
    return grouped;
  };

  return {
    filteredSessions,
    searchQuery,
    setSearchQuery,
    sortField,
    setSortField,
    sortDirection,
    setSortDirection,
    groupBy,
    setGroupBy,
    selectedStyle,
    setSelectedStyle,
    getGroupedSessions
  };
};
