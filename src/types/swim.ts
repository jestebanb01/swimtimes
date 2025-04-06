
export type SwimStyle = 'freestyle' | 'breaststroke' | 'butterfly' | 'backstroke';

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
}
