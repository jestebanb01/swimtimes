
// Re-export all swim services from their specific files
import { fetchSwimmerProfile, fetchSwimmersInClub } from './profileService';
import { 
  fetchSwimmerSwimSessions, 
  fetchAllSwimmerSessions,
  type SwimmerSession 
} from './swimSessionsService';
import { fetchSwimmerTrainingSessions } from './trainingSessionsService';

// Export all functions
export {
  fetchSwimmerProfile,
  fetchSwimmersInClub,
  fetchSwimmerSwimSessions,
  fetchAllSwimmerSessions,
  fetchSwimmerTrainingSessions,
};

// Re-export types
export type { SwimmerSession };
