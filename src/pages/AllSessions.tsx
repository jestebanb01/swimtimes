
import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { useToast } from '@/components/ui/use-toast';
import { useProfile } from '@/contexts/ProfileContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { fetchAllSwimmerSessions } from '@/services/swimmerService';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import SessionsTable from '@/components/allSessions/SessionsTable';
import SessionFilters from '@/components/allSessions/SessionFilters';
import GroupedSessionsTabs from '@/components/allSessions/GroupedSessionsTabs';
import { useSessionFiltering } from '@/hooks/useSessionFiltering';

const AllSessions: React.FC = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { profile } = useProfile();
  const { t } = useLanguage();
  
  const {
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
  } = useSessionFiltering(sessions);

  useEffect(() => {
    if (!profile) return;
    
    fetchSessions();
  }, [profile]);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const data = await fetchAllSwimmerSessions();
      setSessions(data);
    } catch (error: any) {
      console.error("Error fetching all sessions:", error);
      toast({
        title: "Error fetching sessions",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
          <h1 className="text-2xl font-bold">{t('allSwimmerSessions')}</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('browseAllSessions')}</CardTitle>
            <CardDescription>
              {t('viewAndCompareSwimmerSessions')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-64 w-full" />
              </div>
            ) : (
              <div className="space-y-4">
                <SessionFilters 
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  selectedStyle={selectedStyle}
                  setSelectedStyle={setSelectedStyle}
                  sortField={sortField}
                  setSortField={setSortField}
                  sortDirection={sortDirection}
                  setSortDirection={setSortDirection}
                  groupBy={groupBy}
                  setGroupBy={setGroupBy}
                />
                
                {/* Display sessions with grouping if needed */}
                {groupBy ? (
                  <GroupedSessionsTabs groupedSessions={getGroupedSessions()} />
                ) : (
                  <SessionsTable sessions={filteredSessions} />
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default AllSessions;
