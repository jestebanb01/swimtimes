
import React from 'react';
import AppLayout from '@/components/AppLayout';
import NewSessionForm from '@/components/NewSessionForm';

const LogSession = () => {
  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        <NewSessionForm />
      </div>
    </AppLayout>
  );
};

export default LogSession;
