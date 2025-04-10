
import React from 'react';
import { SwimSession, TrainingSession } from '@/types/swim';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import SwimSessionsList from '@/components/SwimSessionsList';
import TrainingSessionsList from '@/components/TrainingSessionsList';

interface SwimmerSessionsTabsProps {
  swimSessions: SwimSession[];
  trainingSessions: TrainingSession[];
}

const SwimmerSessionsTabs: React.FC<SwimmerSessionsTabsProps> = ({ 
  swimSessions, 
  trainingSessions 
}) => {
  const { t } = useLanguage();

  return (
    <Tabs defaultValue="swim" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="swim">{t('swimSessions')}</TabsTrigger>
        <TabsTrigger value="training">{t('trainingSessions')}</TabsTrigger>
      </TabsList>
      <TabsContent value="swim">
        <Card>
          <CardHeader>
            <CardTitle>{t('swimSessions')}</CardTitle>
            <CardDescription>
              {t('swimmersSwimSessions')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {swimSessions.length === 0 ? (
              <div className="text-center py-6">
                {t('noSwimSessions')}
              </div>
            ) : (
              <SwimSessionsList 
                sessions={swimSessions} 
                readOnly={true}
              />
            )}
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="training">
        <Card>
          <CardHeader>
            <CardTitle>{t('trainingSessions')}</CardTitle>
            <CardDescription>
              {t('swimmersTrainingSessions')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {trainingSessions.length === 0 ? (
              <div className="text-center py-6">
                {t('noTrainingSessions')}
              </div>
            ) : (
              <TrainingSessionsList 
                sessions={trainingSessions} 
                readOnly={true}
              />
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default SwimmerSessionsTabs;
