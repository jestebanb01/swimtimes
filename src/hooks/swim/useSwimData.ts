
import { useState, useEffect } from 'react';
import { SwimSession } from '@/types/swim';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { fetchSwimSessions, addSwimSession, deleteSwimSession, updateSwimSession } from './swimApi';

export const useSwimData = () => {
  const [sessions, setSessions] = useState<SwimSession[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadSessions();
    } else {
      setSessions([]);
      setLoading(false);
    }
  }, [user]);

  const loadSessions = async () => {
    try {
      setLoading(true);
      const formattedSessions = await fetchSwimSessions();
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

      const newSession = await addSwimSession(user.id, sessionData);
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
      await deleteSwimSession(id);
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
      await updateSwimSession(id, sessionUpdate);

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

  return {
    sessions,
    addSession,
    deleteSession,
    updateSession,
    getSession,
    loading
  };
};
