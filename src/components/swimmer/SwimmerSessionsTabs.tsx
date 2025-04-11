
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SwimSession, TrainingSession } from '@/types/swim';
import SwimSessionsList from '@/components/SwimSessionsList';
import TrainingSessionsList from '@/components/TrainingSessionsList';
import SwimmerStatsCard from './SwimmerStatsCard';
import { BarChart3, Waves, Dumbbell } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface SwimmerSessionsTabsProps {
  swimSessions: SwimSession[];
  trainingSessions: TrainingSession[];
}

const SwimmerSessionsTabs: React.FC<SwimmerSessionsTabsProps> = ({
  swimSessions,
  trainingSessions,
}) => {
  const [activeTab, setActiveTab] = useState<string>('stats');
  const { t } = useLanguage();

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid grid-cols-3 mb-6">
        <TabsTrigger value="stats" className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          <span>Statistics</span>
        </TabsTrigger>
        <TabsTrigger value="swim" className="flex items-center gap-2">
          <Waves className="h-4 w-4" />
          <span>{t('swimSessions')}</span>
        </TabsTrigger>
        <TabsTrigger value="training" className="flex items-center gap-2">
          <Dumbbell className="h-4 w-4" />
          <span>{t('trainingSessions')}</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="stats" className="mt-0">
        <SwimmerStatsCard sessions={swimSessions} />
      </TabsContent>

      <TabsContent value="swim" className="mt-0">
        <SwimSessionsList sessions={swimSessions} readOnly={true} />
      </TabsContent>

      <TabsContent value="training" className="mt-0">
        <TrainingSessionsList sessions={trainingSessions} readOnly={true} />
      </TabsContent>
    </Tabs>
  );
};

export default SwimmerSessionsTabs;
