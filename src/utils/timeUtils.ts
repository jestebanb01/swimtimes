
import { SwimTime } from "@/types/swim";

export function formatSwimTime(time: SwimTime): string {
  const { minutes, seconds, centiseconds } = time;
  
  // Format with leading zeros
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');
  const formattedCentiseconds = String(centiseconds).padStart(2, '0');
  
  return `${formattedMinutes}:${formattedSeconds}.${formattedCentiseconds}`;
}

export function parseTimeString(timeStr: string): SwimTime | null {
  // Pattern for MM:SS.CS (minutes:seconds.centiseconds)
  const pattern = /^(\d{1,2}):(\d{1,2})\.(\d{1,2})$/;
  const match = timeStr.match(pattern);
  
  if (!match) return null;
  
  const minutes = parseInt(match[1], 10);
  const seconds = parseInt(match[2], 10);
  const centiseconds = parseInt(match[3], 10);
  
  // Validate the values
  if (seconds >= 60 || centiseconds >= 100) return null;
  
  return { minutes, seconds, centiseconds };
}

export function timeToTotalSeconds(time: SwimTime): number {
  return time.minutes * 60 + time.seconds + time.centiseconds / 100;
}

export function calculatePace(time: SwimTime, distance: number): string {
  // Calculate seconds per 100m
  const totalSeconds = timeToTotalSeconds(time);
  const secondsPer100 = (totalSeconds * 100) / distance;
  
  // Convert to minutes:seconds format
  const paceMinutes = Math.floor(secondsPer100 / 60);
  const paceSeconds = Math.floor(secondsPer100 % 60);
  
  return `${paceMinutes}:${String(paceSeconds).padStart(2, '0')} min/100m`;
}
