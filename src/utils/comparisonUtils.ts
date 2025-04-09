
import { BestTimeComparison, SwimTime } from "@/types/swim";
import { formatSwimTime } from "./timeUtils";

export const formatTimeDifference = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  const centiseconds = Math.round((seconds - Math.floor(seconds)) * 100);
  
  if (minutes > 0) {
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
  }
  return `${remainingSeconds}.${centiseconds.toString().padStart(2, '0')}`;
};

export const getComparisonMessage = (timeDiff: number): { 
  icon: string;
  message: string; 
  className: string 
} => {
  if (timeDiff > 0) {
    return { 
      icon: "trending-down",
      message: `You're ${formatTimeDifference(timeDiff)} faster`, 
      className: 'text-green-600'
    };
  } else if (timeDiff < 0) {
    return { 
      icon: "trending-up",
      message: `You're ${formatTimeDifference(Math.abs(timeDiff))} slower`, 
      className: 'text-red-600'
    };
  } else {
    return { 
      icon: "trophy",
      message: 'Tied!', 
      className: 'text-yellow-600'
    };
  }
};
