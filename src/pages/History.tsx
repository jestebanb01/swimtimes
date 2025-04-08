
import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import SwimSessionsList from '@/components/SwimSessionsList';
import TrainingSessionsList from '@/components/TrainingSessionsList';
import HeadToHeadComparison from '@/components/HeadToHeadComparison';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';

const History = () => {
  const [activeTab, setActiveTab] = useState('swim');
  const { t } = useLanguage();
  
  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-aqua-800 mb-6">{t('history')}</h1>
        
        <Tabs defaultValue="swim" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="swim">{t('swimSessions')}</TabsTrigger>
            <TabsTrigger value="training">{t('trainingSessions')}</TabsTrigger>
            <TabsTrigger value="headtohead">Head to Head</TabsTrigger>
          </TabsList>
          
          <TabsContent value="swim" className="mt-0">
            <SwimSessionsList />
          </TabsContent>
          
          <TabsContent value="training" className="mt-0">
            <TrainingSessionsList />
          </TabsContent>
          
          <TabsContent value="headtohead" className="mt-0">
            <HeadToHeadComparison />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default History;
