
import React, { createContext, useContext, useState, useEffect } from 'react';
import { TrainingSession, TrainingIntensity } from '@/types/swim';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { v4 as uuidv4 } from 'uuid';

interface TrainingContextType {
  trainingSessions: TrainingSession[];
  addTrainingSession: (session: Omit<TrainingSession, 'id'>) => Promise<void>;
  deleteTrainingSession: (id: string) => Promise<void>;
  updateTrainingSession: (session: TrainingSession) => Promise<void>;
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

  // Fetch training sessions from Supabase
  useEffect(() => {
    const fetchTrainingSessions = async () => {
      if (!user) {
        setTrainingSessions([]);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('training_sessions')
          .select('*')
          .order('date', { ascending: false });

        if (error) throw error;

        if (data) {
          const formattedSessions: TrainingSession[] = data.map(session => ({
            id: session.id,
            date: new Date(session.date),
            intensity: session.intensity as TrainingIntensity,
            distance: session.distance,
            description: session.description || ''
          }));
          
          setTrainingSessions(formattedSessions);
        }
      } catch (error: any) {
        console.error('Error fetching training sessions:', error.message);
        toast({
          title: "Failed to load training sessions",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTrainingSessions();
  }, [user, toast]);

  const addTrainingSession = async (sessionData: Omit<TrainingSession, 'id'>) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to add training sessions.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('training_sessions')
        .insert({
          user_id: user.id,
          date: sessionData.date.toISOString(),
          intensity: sessionData.intensity,
          distance: sessionData.distance,
          description: sessionData.description || null
        })
        .select('*')
        .single();

      if (error) throw error;

      if (data) {
        const newSession: TrainingSession = {
          id: data.id,
          date: new Date(data.date),
          intensity: data.intensity as TrainingIntensity,
          distance: data.distance,
          description: data.description || ''
        };

        setTrainingSessions(prev => [newSession, ...prev]);
        
        toast({
          title: "Training session added",
          description: "Your training session has been recorded successfully.",
        });
      }
    } catch (error: any) {
      console.error('Error adding training session:', error);
      toast({
        title: "Error adding training session",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateTrainingSession = async (session: TrainingSession) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to update training sessions.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('training_sessions')
        .update({
          date: session.date.toISOString(),
          intensity: session.intensity,
          distance: session.distance,
          description: session.description || null
        })
        .eq('id', session.id);

      if (error) throw error;

      setTrainingSessions(prev => 
        prev.map(item => item.id === session.id ? session : item)
      );
      
      toast({
        title: "Training session updated",
        description: "Your training session has been updated successfully.",
      });
    } catch (error: any) {
      console.error('Error updating training session:', error);
      toast({
        title: "Error updating training session",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteTrainingSession = async (id: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to delete training sessions.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('training_sessions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTrainingSessions(prev => prev.filter(session => session.id !== id));
      
      toast({
        title: "Training session deleted",
        description: "The training session has been removed.",
      });
    } catch (error: any) {
      console.error('Error deleting training session:', error);
      toast({
        title: "Error deleting training session",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <TrainingContext.Provider value={{ trainingSessions, addTrainingSession, updateTrainingSession, deleteTrainingSession, loading }}>
      {children}
    </TrainingContext.Provider>
  );
};
