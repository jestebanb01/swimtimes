
import React from 'react';
import AppLayout from '@/components/AppLayout';
import HeadToHeadComparison from '@/components/HeadToHeadComparison';
import { useLanguage } from '@/contexts/LanguageContext';

const HeadToHead = () => {
  const { t } = useLanguage();
  
  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-aqua-800 mb-6">Head to Head Comparison</h1>
        <HeadToHeadComparison />
      </div>
    </AppLayout>
  );
};

export default HeadToHead;
