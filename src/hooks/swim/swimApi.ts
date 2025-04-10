
import { supabase } from '@/integrations/supabase/client';
import { SwimSession, SwimStyle, PoolLength, ChronoType, SessionType } from '@/types/swim';
import { Database } from '@/integrations/supabase/types';

type SwimSessionRow = Database['public']['Tables']['swim_sessions']['Row'];

export const fetchSwimSessions = async () => {
  const { data, error } = await supabase
    .from('swim_sessions')
    .select('*')
    .order('date', { ascending: false });

  if (error) {
    throw error;
  }

  // Convert from database format to application format
  const formattedSessions: SwimSession[] = (data || []).map(session => ({
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
    chronoType: (session.chrono_type || 'manual') as ChronoType,
    sessionType: (session.session_type || 'pool') as SessionType
  }));

  return formattedSessions;
};

export const addSwimSession = async (
  userId: string,
  sessionData: Omit<SwimSession, 'id'>
) => {
  const { minutes, seconds, centiseconds } = sessionData.time;
  
  const { data, error } = await supabase
    .from('swim_sessions')
    .insert([{
      user_id: userId,
      date: sessionData.date.toISOString(),
      style: sessionData.style,
      distance: sessionData.distance,
      minutes,
      seconds,
      centiseconds,
      location: sessionData.location,
      description: sessionData.description,
      pool_length: sessionData.poolLength,
      chrono_type: sessionData.chronoType,
      session_type: sessionData.sessionType
    }])
    .select()
    .single();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error('No data returned from insert operation');
  }

  return {
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
    chronoType: data.chrono_type as ChronoType,
    sessionType: data.session_type as SessionType
  };
};

export const deleteSwimSession = async (id: string) => {
  const { error } = await supabase
    .from('swim_sessions')
    .delete()
    .eq('id', id);

  if (error) {
    throw error;
  }
};

export const updateSwimSession = async (id: string, sessionUpdate: Partial<SwimSession>) => {
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
  if (sessionUpdate.chronoType) updateData.chrono_type = sessionUpdate.chronoType;
  if (sessionUpdate.sessionType) updateData.session_type = sessionUpdate.sessionType;

  const { error } = await supabase
    .from('swim_sessions')
    .update(updateData)
    .eq('id', id);

  if (error) {
    throw error;
  }
};
