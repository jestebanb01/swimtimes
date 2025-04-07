
import React, { useState } from 'react';
import { useTraining } from '@/contexts/TrainingContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { TrainingIntensity } from '@/types/swim';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const NewTrainingForm: React.FC = () => {
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [intensity, setIntensity] = useState<TrainingIntensity>('Medium');
  const [distance, setDistance] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { addTrainingSession } = useTraining();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!date) {
      newErrors.date = 'Date is required';
    }
    
    if (!distance) {
      newErrors.distance = 'Distance is required';
    } else if (isNaN(Number(distance)) || Number(distance) <= 0) {
      newErrors.distance = 'Distance must be a positive number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      await addTrainingSession({
        date: new Date(date),
        intensity,
        distance: Number(distance),
        description
      });
      
      // Reset form
      setDate(new Date().toISOString().split('T')[0]);
      setIntensity('Medium');
      setDistance('');
      setDescription('');
      setErrors({});
    } catch (error) {
      console.error('Error adding training session:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Log Training Session</CardTitle>
        <CardDescription>
          Record your training sessions to track your progress
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="intensity">Intensity</Label>
            <Select value={intensity} onValueChange={(value: TrainingIntensity) => setIntensity(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select intensity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Light">Light</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="distance">Distance (meters)</Label>
            <Input
              id="distance"
              type="number"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              placeholder="e.g., 1000"
            />
            {errors.distance && <p className="text-red-500 text-sm">{errors.distance}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details about your training session..."
              rows={3}
            />
          </div>
        </CardContent>
        
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Logging Session...' : 'Log Training Session'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default NewTrainingForm;
