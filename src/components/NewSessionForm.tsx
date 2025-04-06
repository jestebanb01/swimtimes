
import React, { useState, useEffect } from 'react';
import { useSwim } from '@/contexts/SwimContext';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { SwimStyle, SwimTime, PoolLength } from '@/types/swim';
import { parseTimeString } from '@/utils/timeUtils';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const NewSessionForm: React.FC = () => {
  const { addSession } = useSwim();
  const [date, setDate] = useState<Date>(new Date());
  const [style, setStyle] = useState<SwimStyle>('freestyle');
  const [distance, setDistance] = useState<number>(100);
  const [timeInput, setTimeInput] = useState<string>('00:00.00');
  const [location, setLocation] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [poolLength, setPoolLength] = useState<PoolLength>('25m');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [availableDistances, setAvailableDistances] = useState<number[]>([50, 100, 200, 400, 800, 1500, 3000, 5000]);

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
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const parsedTime = parseTimeString(timeInput) as SwimTime;
    
    addSession({
      date,
      style,
      distance,
      time: parsedTime,
      location,
      description,
      poolLength
    });
    
    // Reset form
    setDate(new Date());
    setStyle('freestyle');
    setDistance(100);
    setTimeInput('00:00.00');
    setLocation('');
    setDescription('');
    setPoolLength('25m');
    setErrors({});
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
        <select
          id="style"
          value={style}
          onChange={(e) => setStyle(e.target.value as SwimStyle)}
          className="swim-input"
        >
          <option value="freestyle">Freestyle</option>
          <option value="breaststroke">Breaststroke</option>
          <option value="butterfly">Butterfly</option>
          <option value="backstroke">Backstroke</option>
          <option value="medley">Medley</option>
        </select>
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
      
      {/* Distance Field */}
      <div className="space-y-2">
        <label htmlFor="distance" className="block text-sm font-medium text-gray-700">
          Distance (meters)
        </label>
        <select
          id="distance"
          value={distance}
          onChange={(e) => setDistance(Number(e.target.value))}
          className="swim-input"
        >
          {availableDistances.map((dist) => (
            <option key={dist} value={dist}>{dist}</option>
          ))}
        </select>
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
      >
        Save Session
      </Button>
    </form>
  );
};

export default NewSessionForm;
