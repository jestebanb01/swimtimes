
import React, { useState } from 'react';
import { useTraining } from '@/contexts/TrainingContext';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { TrainingIntensity } from '@/types/swim';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const NewTrainingForm: React.FC = () => {
  const { addTrainingSession } = useTraining();
  const [date, setDate] = useState<Date>(new Date());
  const [intensity, setIntensity] = useState<TrainingIntensity>('Medium');
  const [distance, setDistance] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!date) newErrors.date = 'Date is required';
    if (!intensity) newErrors.intensity = 'Intensity is required';
    
    if (!distance.trim()) {
      newErrors.distance = 'Distance is required';
    } else {
      const parsedDistance = parseInt(distance);
      if (isNaN(parsedDistance) || parsedDistance <= 0) {
        newErrors.distance = 'Distance must be a positive number';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setIsSubmitting(true);
      
      await addTrainingSession({
        date,
        intensity,
        distance: parseInt(distance),
        description
      });
      
      // Reset form
      setDate(new Date());
      setIntensity('Medium');
      setDistance('');
      setDescription('');
      setErrors({});
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold text-aqua-800 mb-4">Log Training Session</h2>
      
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
      
      {/* Intensity Field */}
      <div className="space-y-2">
        <label htmlFor="intensity" className="block text-sm font-medium text-gray-700">
          Training Intensity
        </label>
        <Select value={intensity} onValueChange={(value: TrainingIntensity) => setIntensity(value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select intensity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Light">Light</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Hard">Hard</SelectItem>
          </SelectContent>
        </Select>
        {errors.intensity && <p className="text-red-500 text-sm">{errors.intensity}</p>}
      </div>
      
      {/* Distance Field */}
      <div className="space-y-2">
        <label htmlFor="distance" className="block text-sm font-medium text-gray-700">
          Distance (meters)
        </label>
        <Input
          id="distance"
          type="number"
          value={distance}
          onChange={(e) => setDistance(e.target.value)}
          placeholder="Enter distance in meters"
          min="1"
          className="swim-input"
        />
        {errors.distance && <p className="text-red-500 text-sm">{errors.distance}</p>}
      </div>
      
      {/* Description Field */}
      <div className="space-y-2">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Notes about this training session..."
          rows={3}
          className="swim-input"
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-aqua-600 text-white hover:bg-aqua-700"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Saving..." : "Save Training Session"}
      </Button>
    </form>
  );
};

export default NewTrainingForm;
