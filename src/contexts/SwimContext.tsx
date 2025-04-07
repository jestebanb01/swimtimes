
import React, { createContext, useContext, useState, useEffect } from 'react';
import { SwimSession, SwimTime, SwimStyle, PoolLength } from '@/types/swim';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface SwimContextType {
  sessions: SwimSession[];
  addSession: (session: Omit<SwimSession, 'id'>) => Promise<void>;
  deleteSession: (id: string) => Promise<void>;
  updateSession: (id: string, session: Partial<SwimSession>) => Promise<void>;
  getSession: (id: string) => SwimSession | undefined;
  loading: boolean;
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
  const [sessions, setSessions] = useState<SwimSession[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchSessions();
    } else {
      setSessions([]);
      setLoading(false);
    }
  }, [user]);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('swim_sessions')
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        throw error;
      }

      // Convert from database format to application format
      const formattedSessions: SwimSession[] = data.map(session => ({
        id: session.id,
        date: new Date(session.date),
        style: session.style as SwimStyle,
        distance: session.distance,
        time: {
          minutes: session.minutes,
          seconds: session.seconds,
          centiseconds: session.centiseconds,
        },
        location: session.location,
        description: session.description || '',
        poolLength: session.pool_length as PoolLength,
      }));

      setSessions(formattedSessions);
    } catch (error: any) {
      toast({
        title: "Error fetching sessions",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addSession = async (sessionData: Omit<SwimSession, 'id'>) => {
    try {
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to add a session.",
          variant: "destructive",
        });
        return;
      }

      const { minutes, seconds, centiseconds } = sessionData.time;
      
      const { data, error } = await supabase
        .from('swim_sessions')
        .insert([{
          user_id: user.id,
          date: sessionData.date.toISOString(),
          style: sessionData.style,
          distance: sessionData.distance,
          minutes,
          seconds,
          centiseconds,
          location: sessionData.location,
          description: sessionData.description,
          pool_length: sessionData.poolLength,
        }])
        .select()
        .single();

      if (error) {
        throw error;
      }

      const newSession: SwimSession = {
        id: data.id,
        date: new Date(data.date),
        style: data.style as SwimStyle,
        distance: data.distance,
        time: {
          minutes: data.minutes,
          seconds: data.seconds,
          centiseconds: data.centiseconds,
        },
        location: data.location,
        description: data.description || '',
        poolLength: data.pool_length as PoolLength,
      };

      setSessions(prev => [newSession, ...prev]);
      
      toast({
        title: "Session added",
        description: "Your swim session has been recorded successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error adding session",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteSession = async (id: string) => {
    try {
      const { error } = await supabase
        .from('swim_sessions')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setSessions(prev => prev.filter(session => session.id !== id));
      
      toast({
        title: "Session deleted",
        description: "The swim session has been removed.",
      });
    } catch (error: any) {
      toast({
        title: "Error deleting session",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateSession = async (id: string, sessionUpdate: Partial<SwimSession>) => {
    try {
      // Prepare the update data
      const updateData: any = {};
      
      if (sessionUpdate.date) updateData.date = sessionUpdate.date.toISOString();
      if (sessionUpdate.style) updateData.style = sessionUpdate.style;
      if (sessionUpdate.distance) updateData.distance = sessionUpdate.distance;
      if (sessionUpdate.time) {
        updateData.minutes = sessionUpdate.time.minutes;
        updateData.seconds = sessionUpdate.time.seconds;
        updateData.centiseconds = sessionUpdate.time.centiseconds;
      }
      if (sessionUpdate.location) updateData.location = sessionUpdate.location;
      if ('description' in sessionUpdate) updateData.description = sessionUpdate.description;
      if (sessionUpdate.poolLength) updateData.pool_length = sessionUpdate.poolLength;

      const { error } = await supabase
        .from('swim_sessions')
        .update(updateData)
        .eq('id', id);

      if (error) {
        throw error;
      }

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
    } catch (error: any) {
      toast({
        title: "Error updating session",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getSession = (id: string) => {
    return sessions.find(session => session.id === id);
  };

  return (
    <SwimContext.Provider value={{ sessions, addSession, deleteSession, updateSession, getSession, loading }}>
      {children}
    </SwimContext.Provider>
  );
};
