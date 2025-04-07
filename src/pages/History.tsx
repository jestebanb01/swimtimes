
import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import SwimSessionsList from '@/components/SwimSessionsList';
import TrainingSessionsList from '@/components/TrainingSessionsList';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const History = () => {
  const [activeTab, setActiveTab] = useState('swim');
  
  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-aqua-800 mb-6">History</h1>
        
        <Tabs defaultValue="swim" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="swim">Swim Sessions</TabsTrigger>
            <TabsTrigger value="training">Training Sessions</TabsTrigger>
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
