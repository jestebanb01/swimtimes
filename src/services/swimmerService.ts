
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
  // First fetch all swim sessions without any user filter
  const { data: sessionsData, error: sessionsError } = await supabase
    .from('swim_sessions')
    .select('*')
    .order('date', { ascending: false });
    
  if (sessionsError) {
    console.error('Error fetching all swimmer sessions:', sessionsError);
    return [];
  }
  
  // Create a map to store user profile data
  const userProfiles: Map<string, {
    id: string;
    firstName: string | null;
    lastName: string | null;
    yearOfBirth: number | null;
    clubName: string | null;
  }> = new Map();
  
  // Get unique user IDs from sessions
  const userIds = [...new Set((sessionsData || []).map(session => session.user_id))];
  
  // Fetch all relevant profiles
  if (userIds.length > 0) {
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select(`
        id,
        first_name,
        last_name,
        year_of_birth,
        club_id
      `)
      .in('id', userIds);
      
    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
    } else {
      // Get club data for profiles with club_id
      const clubIds = profilesData
        ?.filter(profile => profile.club_id)
        .map(profile => profile.club_id) || [];
      
      const clubMap = new Map<string, string>();
      
      if (clubIds.length > 0) {
        const { data: clubsData, error: clubsError } = await supabase
          .from('clubs')
          .select('id, name')
          .in('id', clubIds);
          
        if (clubsError) {
          console.error('Error fetching clubs:', clubsError);
        } else {
          // Create club name map
          (clubsData || []).forEach(club => {
            clubMap.set(club.id, club.name);
          });
        }
      }
      
      // Store profiles in map
      (profilesData || []).forEach(profile => {
        userProfiles.set(profile.id, {
          id: profile.id,
          firstName: profile.first_name,
          lastName: profile.last_name,
          yearOfBirth: profile.year_of_birth,
          clubName: profile.club_id ? clubMap.get(profile.club_id) || null : null
        });
      });
    }
  }
  
  // Convert from database format to application format with proper swimmer data
  const formattedSessions: SwimmerSession[] = (sessionsData || []).map(session => {
    const profile = userProfiles.get(session.user_id) || {
      id: session.user_id,
      firstName: null,
      lastName: null,
      yearOfBirth: null,
      clubName: null
    };
    
    return {
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
      swimmer: profile
    };
  });
  
  return formattedSessions;
};
