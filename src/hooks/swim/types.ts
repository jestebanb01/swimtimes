
import { SwimSession, SwimStyle, PoolLength, ChronoType, SessionType } from '@/types/swim';

export interface SwimContextType {
  sessions: SwimSession[];
  addSession: (session: Omit<SwimSession, 'id'>) => Promise<void>;
  deleteSession: (id: string) => Promise<void>;
  updateSession: (id: string, session: Partial<SwimSession>) => Promise<void>;
  getSession: (id: string) => SwimSession | undefined;
  loading: boolean;
}
