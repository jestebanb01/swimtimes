
export type SwimStyle = 'freestyle' | 'breaststroke' | 'butterfly' | 'backstroke' | 'medley';
export type PoolLength = '25m' | '50m';
export type ChronoType = 'manual' | 'electronic';
export type SessionType = 'pool' | 'open water';
export type TrainingIntensity = 'Light' | 'Medium' | 'Hard';

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

export interface TrainingSession {
  id: string;
  date: Date;
  intensity: TrainingIntensity;
  distance: number;
  description: string;
}

export interface UserProfile {
  id: string;
  firstName: string | null;
  lastName: string | null;
  yearOfBirth: number | null;
  avatarUrl: string | null;
  country: string | null;
}
