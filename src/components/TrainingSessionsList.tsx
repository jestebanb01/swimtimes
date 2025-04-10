
import React, { useState } from 'react';
import { useTraining } from '@/contexts/TrainingContext';
import { format } from 'date-fns';
import { Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import EditTrainingForm from './EditTrainingForm';
import { TrainingSession, TrainingIntensity } from '@/types/swim';

interface TrainingSessionsListProps {
  sessions?: TrainingSession[];
  readOnly?: boolean;
}

const TrainingSessionsList: React.FC<TrainingSessionsListProps> = ({ sessions, readOnly = false }) => {
  const { trainingSessions, deleteTrainingSession, loading } = useTraining();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);
  const [sessionToEdit, setSessionToEdit] = useState<TrainingSession | null>(null);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);

  // Use provided sessions if available, otherwise use from context
  const displaySessions = sessions || trainingSessions;

  if (loading && !sessions) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (displaySessions.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <h3 className="text-xl font-medium text-gray-600 mb-2">No Training Sessions Yet</h3>
        <p className="text-gray-500">
          Start logging your training sessions to see them here.
        </p>
      </div>
    );
  }

  const handleDelete = async () => {
    if (sessionToDelete && !readOnly) {
      await deleteTrainingSession(sessionToDelete);
      setSessionToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleEdit = (session: TrainingSession) => {
    if (!readOnly) {
      setSessionToEdit(session);
      setIsEditFormOpen(true);
    }
  };

  const getIntensityColor = (intensity: TrainingIntensity) => {
    switch (intensity) {
      case 'Light':
        return 'bg-green-100 text-green-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-blue-800 mb-6">Training Sessions</h2>
      
      <div className="space-y-4">
        {displaySessions.map((session) => (
          <Card key={session.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{format(new Date(session.date), 'MMMM d, yyyy')}</CardTitle>
                  <CardDescription>{session.distance}m</CardDescription>
                </div>
                <Badge className={getIntensityColor(session.intensity)}>
                  {session.intensity}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{session.description || 'No description provided'}</p>
              
              {!readOnly && (
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(session)}
                    className="flex items-center"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSessionToDelete(session.id);
                      setIsDeleteDialogOpen(true);
                    }}
                    className="flex items-center text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      {!readOnly && (
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the training session.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* Edit Form Modal */}
      {sessionToEdit && !readOnly && (
        <EditTrainingForm
          isOpen={isEditFormOpen}
          onOpenChange={setIsEditFormOpen}
          trainingSession={sessionToEdit}
        />
      )}
    </div>
  );
};

export default TrainingSessionsList;
