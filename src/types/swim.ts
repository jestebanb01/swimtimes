
export type SwimStyle = 'freestyle' | 'breaststroke' | 'butterfly' | 'backstroke';
export type PoolLength = '25m' | '50m';

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
}
