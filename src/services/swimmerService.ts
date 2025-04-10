
import { supabase } from '@/integrations/supabase/client';
import { SwimSession, TrainingSession, UserProfile, SwimStyle, PoolLength, ChronoType, SessionType, TrainingIntensity } from '@/types/swim';

export const fetchSwimmerProfile = async (swimmerId: string): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', swimmerId)
    .single();
    
  if (error || !data) {
    console.error('Error fetching swimmer profile:', error);
    return null;
  }
  
  return {
    id: data.id,
    firstName: data.first_name,
    lastName: data.last_name,
    yearOfBirth: data.year_of_birth,
    avatarUrl: data.avatar_url,
    country: data.country,
    gender: data.gender,
    clubId: data.club_id,
    userType: data.user_type,
  };
};

export const fetchSwimmerSwimSessions = async (swimmerId: string): Promise<SwimSession[]> => {
  const { data, error } = await supabase
    .from('swim_sessions')
    .select('*')
    .eq('user_id', swimmerId)
    .order('date', { ascending: false });
    
  if (error) {
    console.error('Error fetching swimmer swim sessions:', error);
    return [];
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

export const fetchSwimmerTrainingSessions = async (swimmerId: string): Promise<TrainingSession[]> => {
  const { data, error } = await supabase
    .from('training_sessions')
    .select('*')
    .eq('user_id', swimmerId)
    .order('date', { ascending: false });
    
  if (error) {
    console.error('Error fetching swimmer training sessions:', error);
    return [];
  }
  
  return (data || []).map(session => ({
    id: session.id,
    date: new Date(session.date),
    intensity: session.intensity as TrainingIntensity,
    distance: session.distance,
    description: session.description || '',
  }));
};

export interface SwimmerSession extends SwimSession {
  swimmer: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    yearOfBirth: number | null;
    clubName: string | null;
  };
}

export const fetchAllSwimmerSessions = async (): Promise<SwimmerSession[]> => {
  // Join swim_sessions with profiles to get swimmer info
  const { data, error } = await supabase
    .from('swim_sessions')
    .select(`
      *,
      profiles:user_id (
        id,
        first_name,
        last_name,
        year_of_birth,
        clubs:club_id (
          name
        )
      )
    `)
    .order('date', { ascending: false });
    
  if (error) {
    console.error('Error fetching all swimmer sessions:', error);
    return [];
  }
  
  // Convert from database format to application format
  const formattedSessions: SwimmerSession[] = (data || []).map(session => ({
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
    sessionType: (session.session_type || 'pool') as SessionType,
    swimmer: {
      id: session.profiles?.id || '',
      firstName: session.profiles?.first_name,
      lastName: session.profiles?.last_name,
      yearOfBirth: session.profiles?.year_of_birth,
      clubName: session.profiles?.clubs?.name,
    },
  }));
  
  return formattedSessions;
};
