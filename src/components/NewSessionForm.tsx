
import React, { useState, useEffect } from 'react';
import { useSwim } from '@/contexts/SwimContext';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { SwimStyle, SwimTime, PoolLength, ChronoType, SessionType } from '@/types/swim';
import { parseTimeString } from '@/utils/timeUtils';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const NewSessionForm: React.FC = () => {
  const { addSession } = useSwim();
  const [date, setDate] = useState<Date>(new Date());
  const [style, setStyle] = useState<SwimStyle>('freestyle');
  const [distance, setDistance] = useState<number>(100);
  const [timeInput, setTimeInput] = useState<string>('00:00.00');
  const [location, setLocation] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [poolLength, setPoolLength] = useState<PoolLength>('25m');
  const [chronoType, setChronoType] = useState<ChronoType>('manual');
  const [sessionType, setSessionType] = useState<SessionType>('pool');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [availableDistances, setAvailableDistances] = useState<number[]>([50, 100, 200, 400, 800, 1500, 3000, 5000]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update available distances when style changes
  useEffect(() => {
    let distances: number[] = [];
    
    if (style === 'freestyle') {
      distances = [50, 100, 200, 400, 800, 1500, 3000, 5000];
    } else if (style === 'medley') {
      distances = [50, 100, 200, 400];
    } else {
      // backstroke, butterfly, breaststroke
      distances = [50, 100, 200];
    }
    
    setAvailableDistances(distances);
    
    // If current distance is not in the new available distances, reset to the first available
    if (!distances.includes(distance)) {
      setDistance(distances[0]);
    }
  }, [style]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!date) newErrors.date = 'Date is required';
    if (!style) newErrors.style = 'Swim style is required';
    
    if (!distance) {
      newErrors.distance = 'Distance is required';
    } else {
      // Validate distance based on swim style
      if (style === 'freestyle' && ![50, 100, 200, 400, 800, 1500, 3000, 5000].includes(distance)) {
        newErrors.distance = 'For freestyle, distance must be 50, 100, 200, 400, 800, 1500, 3000 or 5000 meters';
      } else if (style === 'medley' && ![50, 100, 200, 400].includes(distance)) {
        newErrors.distance = 'For medley, distance must be 50, 100, 200 or 400 meters';
      } else if (['backstroke', 'butterfly', 'breaststroke'].includes(style) && ![50, 100, 200].includes(distance)) {
        newErrors.distance = 'For backstroke, butterfly or breaststroke, distance must be 50, 100 or 200 meters';
      }
    }
    
    const parsedTime = parseTimeString(timeInput);
    if (!parsedTime) {
      newErrors.time = 'Time must be in format MM:SS.CS';
    }
    
    if (!location.trim()) newErrors.location = 'Location is required';
    if (!poolLength) newErrors.poolLength = 'Pool length is required';
    if (!chronoType) newErrors.chronoType = 'Chrono type is required';
    if (!sessionType) newErrors.sessionType = 'Session type is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setIsSubmitting(true);
      const parsedTime = parseTimeString(timeInput) as SwimTime;
      
      await addSession({
        date,
        style,
        distance,
        time: parsedTime,
        location,
        description,
        poolLength,
        chronoType,
        sessionType
      });
      
      // Reset form
      setDate(new Date());
      setStyle('freestyle');
      setDistance(100);
      setTimeInput('00:00.00');
      setLocation('');
      setDescription('');
      setPoolLength('25m');
      setChronoType('manual');
      setSessionType('pool');
      setErrors({});
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold text-aqua-800 mb-4">Add New Swim Session</h2>
      
      {/* Date Field */}
      <div className="space-y-2">
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
          Date
        </label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, 'PPP') : <span>Select a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(date) => date && setDate(date)}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
        {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
      </div>
      
      {/* Style Field */}
      <div className="space-y-2">
        <label htmlFor="style" className="block text-sm font-medium text-gray-700">
          Swim Style
        </label>
        <Select value={style} onValueChange={(value: SwimStyle) => setStyle(value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select style" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="freestyle">Freestyle</SelectItem>
            <SelectItem value="breaststroke">Breaststroke</SelectItem>
            <SelectItem value="butterfly">Butterfly</SelectItem>
            <SelectItem value="backstroke">Backstroke</SelectItem>
            <SelectItem value="medley">Medley</SelectItem>
          </SelectContent>
        </Select>
        {errors.style && <p className="text-red-500 text-sm">{errors.style}</p>}
      </div>
      
      {/* Pool Length Field */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Pool Length
        </label>
        <RadioGroup 
          value={poolLength} 
          onValueChange={(value) => setPoolLength(value as PoolLength)}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="25m" id="r1" />
            <Label htmlFor="r1">25m</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="50m" id="r2" />
            <Label htmlFor="r2">50m</Label>
          </div>
        </RadioGroup>
        {errors.poolLength && <p className="text-red-500 text-sm">{errors.poolLength}</p>}
      </div>

      {/* Chrono Type Field */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Chrono Type
        </label>
        <RadioGroup 
          value={chronoType} 
          onValueChange={(value) => setChronoType(value as ChronoType)}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="manual" id="chrono1" />
            <Label htmlFor="chrono1">Manual</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="electronic" id="chrono2" />
            <Label htmlFor="chrono2">Electronic</Label>
          </div>
        </RadioGroup>
        {errors.chronoType && <p className="text-red-500 text-sm">{errors.chronoType}</p>}
      </div>

      {/* Session Type Field */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Session Type
        </label>
        <RadioGroup 
          value={sessionType} 
          onValueChange={(value) => setSessionType(value as SessionType)}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="pool" id="session1" />
            <Label htmlFor="session1">Pool</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="open water" id="session2" />
            <Label htmlFor="session2">Open Water</Label>
          </div>
        </RadioGroup>
        {errors.sessionType && <p className="text-red-500 text-sm">{errors.sessionType}</p>}
      </div>
      
      {/* Distance Field */}
      <div className="space-y-2">
        <label htmlFor="distance" className="block text-sm font-medium text-gray-700">
          Distance (meters)
        </label>
        <Select value={distance.toString()} onValueChange={(value) => setDistance(Number(value))}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select distance" />
          </SelectTrigger>
          <SelectContent>
            {availableDistances.map((dist) => (
              <SelectItem key={dist} value={dist.toString()}>{dist}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.distance && <p className="text-red-500 text-sm">{errors.distance}</p>}
      </div>
      
      {/* Time Field */}
      <div className="space-y-2">
        <label htmlFor="time" className="block text-sm font-medium text-gray-700">
          Time (MM:SS.CS)
        </label>
        <input
          id="time"
          type="text"
          value={timeInput}
          onChange={(e) => setTimeInput(e.target.value)}
          placeholder="00:00.00"
          className="swim-input"
        />
        <p className="text-xs text-gray-500">Format: minutes:seconds.centiseconds (e.g., 01:30.75)</p>
        {errors.time && <p className="text-red-500 text-sm">{errors.time}</p>}
      </div>
      
      {/* Location Field */}
      <div className="space-y-2">
        <label htmlFor="location" className="block text-sm font-medium text-gray-700">
          Location
        </label>
        <input
          id="location"
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Swimming pool name or location"
          className="swim-input"
        />
        {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}
      </div>
      
      {/* Description Field */}
      <div className="space-y-2">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description (optional)
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Notes about this session..."
          rows={3}
          className="swim-input"
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-aqua-600 text-white hover:bg-aqua-700"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Saving..." : "Save Session"}
      </Button>
    </form>
  );
};

export default NewSessionForm;
