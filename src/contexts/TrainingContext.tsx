
import React, { createContext, useContext, useState, useEffect } from 'react';
import { TrainingSession, TrainingIntensity } from '@/types/swim';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Database } from '@/integrations/supabase/types';
import { v4 as uuidv4 } from 'uuid';

interface TrainingContextType {
  trainingSessions: TrainingSession[];
  addTrainingSession: (session: Omit<TrainingSession, 'id'>) => Promise<void>;
  deleteTrainingSession: (id: string) => Promise<void>;
  loading: boolean;
}

const TrainingContext = createContext<TrainingContextType | undefined>(undefined);

export const useTraining = () => {
  const context = useContext(TrainingContext);
  if (context === undefined) {
    throw new Error('useTraining must be used within a TrainingProvider');
  }
  return context;
};

export const TrainingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [trainingSessions, setTrainingSessions] = useState<TrainingSession[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  // Load initial data - In a real app, this would fetch from Supabase
  useEffect(() => {
    const localData = localStorage.getItem('trainingSessions');
    if (localData) {
      try {
        const parsed = JSON.parse(localData);
        const sessions: TrainingSession[] = parsed.map((session: any) => ({
          ...session,
          date: new Date(session.date)
        }));
        setTrainingSessions(sessions);
      } catch (error) {
        console.error('Error parsing training sessions from localStorage', error);
      }
    }
    setLoading(false);
  }, []);

  // Save to localStorage when sessions change
  useEffect(() => {
    if (trainingSessions.length > 0) {
      localStorage.setItem('trainingSessions', JSON.stringify(trainingSessions));
    }
  }, [trainingSessions]);

  const addTrainingSession = async (sessionData: Omit<TrainingSession, 'id'>) => {
    try {
      const newSession: TrainingSession = {
        id: uuidv4(),
        ...sessionData
      };

      setTrainingSessions(prev => [newSession, ...prev]);
      
      toast({
        title: "Training session added",
        description: "Your training session has been recorded successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error adding training session",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteTrainingSession = async (id: string) => {
    try {
      setTrainingSessions(prev => prev.filter(session => session.id !== id));
      
      toast({
        title: "Training session deleted",
        description: "The training session has been removed.",
      });
    } catch (error: any) {
      toast({
        title: "Error deleting training session",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <TrainingContext.Provider value={{ trainingSessions, addTrainingSession, deleteTrainingSession, loading }}>
      {children}
    </TrainingContext.Provider>
  );
};
