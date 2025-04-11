
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types/swim';

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

export const fetchSwimmersInClub = async (clubId: string, excludeUserId?: string): Promise<UserProfile[]> => {
  try {
    if (!clubId) {
      return [];
    }
    
    let query = supabase
      .from('profiles')
      .select('*')
      .eq('club_id', clubId);
    
    if (excludeUserId) {
      query = query.neq('id', excludeUserId);
    }
    
    const { data, error } = await query;

    if (error) throw error;
    
    return (data || []).map((swimmer: any) => ({
      id: swimmer.id,
      firstName: swimmer.first_name,
      lastName: swimmer.last_name,
      yearOfBirth: swimmer.year_of_birth,
      avatarUrl: swimmer.avatar_url,
      country: swimmer.country,
      gender: swimmer.gender,
      clubId: swimmer.club_id,
      userType: swimmer.user_type
    }));
  } catch (error: any) {
    console.error("Error fetching swimmers:", error);
    return [];
  }
};
