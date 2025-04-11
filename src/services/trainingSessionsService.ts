
import { supabase } from '@/integrations/supabase/client';
import { TrainingSession, TrainingIntensity } from '@/types/swim';

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
