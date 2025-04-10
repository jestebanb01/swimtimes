
import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { useToast } from '@/components/ui/use-toast';
import { useProfile } from '@/contexts/ProfileContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { fetchAllSwimmerSessions, SwimmerSession } from '@/services/swimmerService';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import SessionsTable from '@/components/allSessions/SessionsTable';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { SwimStyle } from '@/types/swim';

const AllSessions: React.FC = () => {
  const [sessions, setSessions] = useState<SwimmerSession[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<SwimmerSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<string>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [groupBy, setGroupBy] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string>('all');
  
  const { toast } = useToast();
  const { profile } = useProfile();
  const { t } = useLanguage();

  useEffect(() => {
    if (!profile) return;
    
    fetchSessions();
  }, [profile]);

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
  }, [sessions, searchQuery, sortField, sortDirection, groupBy, selectedStyle]);

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

  const swimStyles: SwimStyle[] = ['freestyle', 'breaststroke', 'butterfly', 'backstroke', 'medley'];

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
                <div className="flex flex-col gap-4 md:flex-row">
                  {/* Search */}
                  <div className="flex-1">
                    <Input
                      placeholder={t('searchSwimmerOrClub')}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  {/* Style Filter */}
                  <div className="w-full md:w-48">
                    <Select
                      value={selectedStyle}
                      onValueChange={setSelectedStyle}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('style')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t('allStyles')}</SelectItem>
                        {swimStyles.map((style) => (
                          <SelectItem key={style} value={style}>
                            {t(style)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Sort By */}
                  <div className="w-full md:w-48">
                    <Select
                      value={sortField}
                      onValueChange={setSortField}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('sortBy')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="date">{t('date')}</SelectItem>
                        <SelectItem value="name">{t('name')}</SelectItem>
                        <SelectItem value="yearOfBirth">{t('yearOfBirth')}</SelectItem>
                        <SelectItem value="club">{t('club')}</SelectItem>
                        <SelectItem value="distance">{t('distance')}</SelectItem>
                        <SelectItem value="time">{t('time')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Sort Direction */}
                  <div className="w-full md:w-48">
                    <Select
                      value={sortDirection}
                      onValueChange={(value) => setSortDirection(value as 'asc' | 'desc')}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('order')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="asc">{t('ascending')}</SelectItem>
                        <SelectItem value="desc">{t('descending')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Group By */}
                  <div className="w-full md:w-48">
                    <Select
                      value={groupBy || ''}
                      onValueChange={(value) => setGroupBy(value || null)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('groupBy')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">{t('noGrouping')}</SelectItem>
                        <SelectItem value="style">{t('swimStyle')}</SelectItem>
                        <SelectItem value="club">{t('club')}</SelectItem>
                        <SelectItem value="year">{t('yearOfBirth')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {/* Display sessions with grouping if needed */}
                {groupBy ? (
                  <Tabs defaultValue={Object.keys(getGroupedSessions())[0]}>
                    <TabsList className="flex flex-wrap h-auto">
                      {Object.keys(getGroupedSessions()).map((groupKey) => (
                        <TabsTrigger key={groupKey} value={groupKey} className="capitalize">
                          {groupKey} ({getGroupedSessions()[groupKey].length})
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    
                    {Object.entries(getGroupedSessions()).map(([groupKey, groupSessions]) => (
                      <TabsContent key={groupKey} value={groupKey}>
                        <SessionsTable sessions={groupSessions} />
                      </TabsContent>
                    ))}
                  </Tabs>
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
