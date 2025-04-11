
import { supabase } from "@/integrations/supabase/client";
import { SwimSession, SwimStyle, BestTimeComparison } from "@/types/swim";
import { timeToTotalSeconds } from "@/utils/timeUtils";
import { Database } from "@/integrations/supabase/types";

type SwimSessionRow = Database['public']['Tables']['swim_sessions']['Row'];

export async function findUserByName(firstName: string, lastName: string) {
  let query = supabase
    .from('profiles')
    .select('id, first_name, last_name');
  
  if (firstName.trim() && lastName.trim()) {
    // If both first and last name are provided
    query = query
      .ilike('first_name', `%${firstName.trim()}%`)
      .ilike('last_name', `%${lastName.trim()}%`);
  } else if (firstName.trim()) {
    // If only first name is provided
    query = query.ilike('first_name', `%${firstName.trim()}%`);
  } else {
    // If only last name is provided
    query = query.ilike('last_name', `%${lastName.trim()}%`);
  }

  const { data: users, error } = await query;
  
  if (error) throw error;
  return users;
}

export async function getOpponentSessions(opponentId: string) {
  // Use direct query to get another user's swim sessions
  // This should work because we've set up a policy to allow all users to see all swim sessions
  const { data: directSessions, error: directError } = await supabase
    .from('swim_sessions')
    .select('*')
    .eq('user_id', opponentId);
      
  if (directError) {
    console.error("Query Error:", directError);
    throw directError;
  }

  return directSessions || [];
}

export function formatSessionsForComparison(sessions: SwimSessionRow[]) {
  // Format opponent sessions to match our format
  return sessions.map(session => ({
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
    poolLength: session.pool_length,
    chronoType: session.chrono_type,
    sessionType: session.session_type,
  }));
}

export function createComparisons(yourSessions: SwimSession[], opponentSessions: any[]): BestTimeComparison[] {
  const comparisons: BestTimeComparison[] = [];
  
  // Get all unique distance-style combinations from both users
  const yourDistanceStyles = new Set(yourSessions.map(s => `${s.distance}-${s.style}`));
  const opponentDistanceStyles = new Set(opponentSessions.map(s => `${s.distance}-${s.style}`));
  const allDistanceStyles = new Set([...yourDistanceStyles, ...opponentDistanceStyles]);
  
  allDistanceStyles.forEach(distanceStyle => {
    const [distanceStr, style] = distanceStyle.split('-');
    const distance = parseInt(distanceStr);
    
    // Find your best time for this distance-style
    let yourBestSession = yourSessions
      .filter(s => s.distance === distance && s.style === style)
      .sort((a, b) => {
        const aTime = timeToTotalSeconds(a.time);
        const bTime = timeToTotalSeconds(b.time);
        return aTime - bTime;
      })[0];
    
    // Find opponent's best time for this distance-style
    let opponentBestSession = opponentSessions
      .filter(s => s.distance === distance && s.style === style)
      .sort((a, b) => {
        const aTime = timeToTotalSeconds(a.time);
        const bTime = timeToTotalSeconds(b.time);
        return aTime - bTime;
      })[0];
    
    let timeDifference = 0;
    if (yourBestSession && opponentBestSession) {
      const yourTime = timeToTotalSeconds(yourBestSession.time);
      const opponentTime = timeToTotalSeconds(opponentBestSession.time);
      timeDifference = opponentTime - yourTime; // Positive means your time is better
    }
    
    comparisons.push({
      distance,
      style: style as SwimStyle,
      yourTime: yourBestSession?.time || null,
      yourDate: yourBestSession?.date || null,
      opponentTime: opponentBestSession?.time || null,
      opponentDate: opponentBestSession?.date || null,
      timeDifference
    });
  });
  
  // Sort by distance and then by style
  comparisons.sort((a, b) => {
    if (a.distance !== b.distance) {
      return a.distance - b.distance;
    }
    return a.style.localeCompare(b.style);
  });
  
  return comparisons;
}
