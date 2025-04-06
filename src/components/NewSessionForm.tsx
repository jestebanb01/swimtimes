
import React, { useState } from 'react';
import { useSwim } from '@/contexts/SwimContext';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { SwimStyle, SwimTime } from '@/types/swim';
import { parseTimeString } from '@/utils/timeUtils';

const NewSessionForm: React.FC = () => {
  const { addSession } = useSwim();
  const [date, setDate] = useState<Date>(new Date());
  const [style, setStyle] = useState<SwimStyle>('freestyle');
  const [distance, setDistance] = useState<number>(100);
  const [timeInput, setTimeInput] = useState<string>('00:00.00');
  const [location, setLocation] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!date) newErrors.date = 'Date is required';
    if (!style) newErrors.style = 'Swim style is required';
    
    if (!distance) {
      newErrors.distance = 'Distance is required';
    } else if (distance <= 0) {
      newErrors.distance = 'Distance must be a positive number';
    }
    
    const parsedTime = parseTimeString(timeInput);
    if (!parsedTime) {
      newErrors.time = 'Time must be in format MM:SS.CS';
    }
    
    if (!location.trim()) newErrors.location = 'Location is required';
    
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
      description
    });
    
    // Reset form
    setDate(new Date());
    setStyle('freestyle');
    setDistance(100);
    setTimeInput('00:00.00');
    setLocation('');
    setDescription('');
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
        </select>
        {errors.style && <p className="text-red-500 text-sm">{errors.style}</p>}
      </div>
      
      {/* Distance Field */}
      <div className="space-y-2">
        <label htmlFor="distance" className="block text-sm font-medium text-gray-700">
          Distance (meters)
        </label>
        <input
          id="distance"
          type="number"
          value={distance}
          onChange={(e) => setDistance(Number(e.target.value))}
          min="1"
          className="swim-input"
        />
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
