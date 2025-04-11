
import React from 'react';
import { SwimmerSession } from '@/services/swimmerService';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import SessionsTable from '@/components/allSessions/SessionsTable';

interface GroupedSessionsTabsProps {
  groupedSessions: Record<string, SwimmerSession[]>;
}

const GroupedSessionsTabs: React.FC<GroupedSessionsTabsProps> = ({ 
  groupedSessions 
}) => {
  const groupKeys = Object.keys(groupedSessions);
  
  if (groupKeys.length === 0) {
    return <div>No sessions found</div>;
  }

  return (
    <Tabs defaultValue={groupKeys[0]}>
      <TabsList className="flex flex-wrap h-auto">
        {groupKeys.map((groupKey) => (
          <TabsTrigger key={groupKey} value={groupKey} className="capitalize">
            {groupKey} ({groupedSessions[groupKey].length})
          </TabsTrigger>
        ))}
      </TabsList>
      
      {Object.entries(groupedSessions).map(([groupKey, groupSessions]) => (
        <TabsContent key={groupKey} value={groupKey}>
          <SessionsTable sessions={groupSessions} />
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default GroupedSessionsTabs;
