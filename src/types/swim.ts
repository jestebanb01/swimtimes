
export type SwimStyle = 'freestyle' | 'breaststroke' | 'butterfly' | 'backstroke' | 'medley';
export type PoolLength = '25m' | '50m';
export type ChronoType = 'manual' | 'electronic';
export type SessionType = 'pool' | 'open water';

export interface SwimTime {
  minutes: number;
  seconds: number;
  centiseconds: number;
}

export interface SwimSession {
  id: string;
  date: Date;
  style: SwimStyle;
  distance: number;
  time: SwimTime;
  location: string;
  description: string;
  poolLength: PoolLength;
  chronoType: ChronoType;
  sessionType: SessionType;
}

export interface UserProfile {
  id: string;
  firstName: string | null;
  lastName: string | null;
  yearOfBirth: number | null;
  avatarUrl: string | null;
}
