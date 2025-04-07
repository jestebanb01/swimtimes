
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { TrainingSession, TrainingIntensity } from '@/types/swim';
import { useTraining } from '@/contexts/TrainingContext';
import { format } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface EditTrainingFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  trainingSession: TrainingSession;
}

const EditTrainingForm: React.FC<EditTrainingFormProps> = ({
  isOpen,
  onOpenChange,
  trainingSession,
}) => {
  const [date, setDate] = useState<string>(
    format(new Date(trainingSession.date), 'yyyy-MM-dd')
  );
  const [intensity, setIntensity] = useState<TrainingIntensity>(trainingSession.intensity);
  const [distance, setDistance] = useState<string>(trainingSession.distance.toString());
  const [description, setDescription] = useState<string>(trainingSession.description || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { updateTrainingSession } = useTraining();

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
      const updatedSession: TrainingSession = {
        ...trainingSession,
        date: new Date(date),
        intensity,
        distance: Number(distance),
        description
      };
      
      await updateTrainingSession(updatedSession);
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating training session:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Training Session</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid gap-4">
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
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Update Session'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTrainingForm;
