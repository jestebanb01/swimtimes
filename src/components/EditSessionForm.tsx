
import React, { useState, useEffect } from 'react';
import { useSwim } from '@/contexts/SwimContext';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { SwimStyle, SwimTime, PoolLength, SwimSession, ChronoType, SessionType } from '@/types/swim';
import { parseTimeString, formatSwimTime } from '@/utils/timeUtils';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EditSessionFormProps {
  session: SwimSession;
  isOpen: boolean;
  onClose: () => void;
}

const EditSessionForm: React.FC<EditSessionFormProps> = ({ session, isOpen, onClose }) => {
  const { updateSession } = useSwim();
  const [date, setDate] = useState<Date>(session.date);
  const [style, setStyle] = useState<SwimStyle>(session.style);
  const [distance, setDistance] = useState<number>(session.distance);
  const [customDistance, setCustomDistance] = useState<string>(session.distance.toString());
  const [timeInput, setTimeInput] = useState<string>(formatSwimTime(session.time));
  const [location, setLocation] = useState<string>(session.location);
  const [description, setDescription] = useState<string>(session.description);
  const [poolLength, setPoolLength] = useState<PoolLength>(session.poolLength);
  const [chronoType, setChronoType] = useState<ChronoType>(session.chronoType || 'manual');
  const [sessionType, setSessionType] = useState<SessionType>(session.sessionType || 'pool');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [availableDistances, setAvailableDistances] = useState<number[]>([50, 100, 200, 400, 800, 1500, 3000, 5000]);
  const [useCustomDistance, setUseCustomDistance] = useState(session.sessionType === 'open water');

  // Update available distances when style or session type changes
  useEffect(() => {
    let distances: number[] = [];
    
    if (sessionType === 'open water') {
      setUseCustomDistance(true);
      return;
    } else {
      setUseCustomDistance(false);
    }
    
    if (style === 'freestyle') {
      distances = [50, 100, 200, 400, 800, 1500, 3000, 5000];
    } else if (style === 'medley') {
      distances = [100, 200, 400]; // Removed 50m for medley
    } else {
      // backstroke, butterfly, breaststroke
      distances = [50, 100, 200];
    }
    
    setAvailableDistances(distances);
    
    // If current distance is not in the new available distances, reset to the first available
    if (!distances.includes(distance)) {
      setDistance(distances[0]);
    }
  }, [style, sessionType]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!date) newErrors.date = 'Date is required';
    if (!style) newErrors.style = 'Swim style is required';
    
    if (sessionType === 'open water') {
      if (!customDistance.trim()) {
        newErrors.distance = 'Distance is required';
      } else {
        const parsedDistance = parseInt(customDistance);
        if (isNaN(parsedDistance) || parsedDistance <= 0) {
          newErrors.distance = 'Distance must be a positive number';
        }
      }
    } else {
      if (!distance) {
        newErrors.distance = 'Distance is required';
      }
    }
    
    const parsedTime = parseTimeString(timeInput);
    if (!parsedTime) {
      newErrors.time = 'Time must be in format MM:SS.CS';
    }
    
    if (!location.trim()) newErrors.location = 'Location is required';
    
    if (sessionType === 'pool') {
      if (!poolLength) newErrors.poolLength = 'Pool length is required';
      if (!chronoType) newErrors.chronoType = 'Chrono type is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const parsedTime = parseTimeString(timeInput) as SwimTime;
    const finalDistance = sessionType === 'open water' ? parseInt(customDistance) : distance;
    
    await updateSession(session.id, {
      date,
      style,
      distance: finalDistance,
      time: parsedTime,
      location,
      description,
      poolLength,
      chronoType,
      sessionType
    });
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Swim Session</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
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
          
          {/* Pool Length Field - Only show for pool sessions */}
          {sessionType === 'pool' && (
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
          )}

          {/* Chrono Type Field - Only show for pool sessions */}
          {sessionType === 'pool' && (
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
          )}
          
          {/* Distance Field */}
          <div className="space-y-2">
            <label htmlFor="distance" className="block text-sm font-medium text-gray-700">
              Distance (meters)
            </label>
            
            {sessionType === 'open water' ? (
              <Input
                id="customDistance"
                type="number"
                value={customDistance}
                onChange={(e) => setCustomDistance(e.target.value)}
                placeholder="Enter distance in meters"
                min="1"
                className="swim-input"
              />
            ) : (
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
            )}
            
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
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-aqua-600 text-white hover:bg-aqua-700"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditSessionForm;
