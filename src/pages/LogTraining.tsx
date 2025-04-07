
import React from 'react';
import AppLayout from '@/components/AppLayout';
import NewTrainingForm from '@/components/NewTrainingForm';

const LogTraining = () => {
  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        <NewTrainingForm />
      </div>
    </AppLayout>
  );
};

export default LogTraining;
