
import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import SwimSessionsList from '@/components/SwimSessionsList';
import TrainingSessionsList from '@/components/TrainingSessionsList';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLocation } from 'react-router-dom';

const History = () => {
  const [activeTab, setActiveTab] = useState('swim');
  const { t } = useLanguage();
  const location = useLocation();
  
  useEffect(() => {
    // Check for URL parameters to set the initial tab
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam && ['swim', 'training'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [location]);
  
  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-aqua-800 mb-6">{t('history')}</h1>
        
        <Tabs value={activeTab} className="w-full" onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="swim">{t('swimSessions')}</TabsTrigger>
            <TabsTrigger value="training">{t('trainingSessions')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="swim" className="mt-0">
            <SwimSessionsList />
          </TabsContent>
          
          <TabsContent value="training" className="mt-0">
            <TrainingSessionsList />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default History;
