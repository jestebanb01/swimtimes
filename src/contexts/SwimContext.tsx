
import React, { createContext, useContext } from 'react';
import { SwimContextType } from '@/hooks/swim/types';
import { useSwimData } from '@/hooks/swim/useSwimData';

const SwimContext = createContext<SwimContextType | undefined>(undefined);

export const useSwim = () => {
  const context = useContext(SwimContext);
  if (context === undefined) {
    throw new Error('useSwim must be used within a SwimProvider');
  }
  return context;
};

export const SwimProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const swimData = useSwimData();

  return (
    <SwimContext.Provider value={swimData}>
      {children}
    </SwimContext.Provider>
  );
};
