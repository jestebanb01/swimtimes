
import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { SwimSession, SwimTime, SwimStyle } from '@/types/swim';
import { useToast } from '@/components/ui/use-toast';

interface SwimContextType {
  sessions: SwimSession[];
  addSession: (session: Omit<SwimSession, 'id'>) => void;
  deleteSession: (id: string) => void;
  updateSession: (id: string, session: Partial<SwimSession>) => void;
  getSession: (id: string) => SwimSession | undefined;
}

const SwimContext = createContext<SwimContextType | undefined>(undefined);

export const useSwim = () => {
  const context = useContext(SwimContext);
  if (context === undefined) {
    throw new Error('useSwim must be used within a SwimProvider');
  }
  return context;
};

export const SwimProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sessions, setSessions] = useState<SwimSession[]>(() => {
    // Try to load from localStorage on initialization
    const saved = localStorage.getItem('swimSessions');
    if (saved) {
      try {
        // Parse the stored JSON and convert date strings back to Date objects
        return JSON.parse(saved, (key, value) => {
          if (key === 'date') return new Date(value);
          return value;
        });
      } catch (err) {
        console.error('Failed to parse stored sessions:', err);
        return [];
      }
    }
    return [];
  });

  const { toast } = useToast();

  useEffect(() => {
    // Save to localStorage whenever sessions change
    localStorage.setItem('swimSessions', JSON.stringify(sessions));
  }, [sessions]);

  const addSession = (sessionData: Omit<SwimSession, 'id'>) => {
    const newSession = {
      ...sessionData,
      id: uuidv4(),
    };
    
    setSessions(prev => [...prev, newSession]);
    toast({
      title: "Session added",
      description: "Your swim session has been recorded successfully.",
    });
  };

  const deleteSession = (id: string) => {
    setSessions(prev => prev.filter(session => session.id !== id));
    toast({
      title: "Session deleted",
      description: "The swim session has been removed.",
    });
  };

  const updateSession = (id: string, sessionUpdate: Partial<SwimSession>) => {
    setSessions(prev => 
      prev.map(session => 
        session.id === id 
          ? { ...session, ...sessionUpdate } 
          : session
      )
    );
    toast({
      title: "Session updated",
      description: "Your swim session has been updated successfully.",
    });
  };

  const getSession = (id: string) => {
    return sessions.find(session => session.id === id);
  };

  return (
    <SwimContext.Provider value={{ sessions, addSession, deleteSession, updateSession, getSession }}>
      {children}
    </SwimContext.Provider>
  );
};
