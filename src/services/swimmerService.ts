
import { supabase } from '@/integrations/supabase/client';
import { SwimSession, TrainingSession, UserProfile } from '@/types/swim';
import { formatSessionsForComparison } from '@/services/comparisonService';

export async function fetchSwimmerProfile(swimmerId: string): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', swimmerId)
      .single();

    if (error) throw error;

    console.log("Fetched swimmer details:", data);

    if (data) {
      return {
        id: data.id,
        firstName: data.first_name,
        lastName: data.last_name,
        yearOfBirth: data.year_of_birth,
        avatarUrl: data.avatar_url,
        country: data.country,
        gender: data.gender,
        clubId: data.club_id,
        userType: data.user_type
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching swimmer details:", error);
    throw error;
  }
}

export async function fetchSwimmerSwimSessions(swimmerId: string): Promise<SwimSession[]> {
  try {
    console.log("Fetching swim sessions for swimmer ID:", swimmerId);
    
    const { data, error } = await supabase
      .from('swim_sessions')
      .select('*')
      .eq('user_id', swimmerId)
      .order('date', { ascending: false });

    if (error) throw error;

    console.log("Fetched swim sessions:", data);

    if (data) {
      return formatSessionsForComparison(data);
    }
    return [];
  } catch (error) {
    console.error("Error fetching swim sessions:", error);
    throw error;
  }
}

export async function fetchSwimmerTrainingSessions(swimmerId: string): Promise<TrainingSession[]> {
  try {
    console.log("Fetching training sessions for swimmer ID:", swimmerId);
    
    const { data, error } = await supabase
      .from('training_sessions')
      .select('*')
      .eq('user_id', swimmerId)
      .order('date', { ascending: false });

    if (error) throw error;

    console.log("Fetched training sessions:", data);

    if (data) {
      const formattedTrainings: TrainingSession[] = data.map((training: any) => ({
        id: training.id,
        date: new Date(training.date),
        intensity: training.intensity,
        distance: training.distance,
        description: training.description || ''
      }));
      
      return formattedTrainings;
    }
    return [];
  } catch (error) {
    console.error("Error fetching training sessions:", error);
    throw error;
  }
}
