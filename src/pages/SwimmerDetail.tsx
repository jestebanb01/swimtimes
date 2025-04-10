
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { useToast } from '@/components/ui/use-toast';
import { useProfile } from '@/contexts/ProfileContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { UserProfile, SwimSession, TrainingSession } from '@/types/swim';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import SwimmerProfileCard from '@/components/swimmer/SwimmerProfileCard';
import SwimmerSessionsTabs from '@/components/swimmer/SwimmerSessionsTabs';
import { 
  fetchSwimmerProfile, 
  fetchSwimmerSwimSessions, 
  fetchSwimmerTrainingSessions 
} from '@/services/swimmerService';

const SwimmerDetail = () => {
  const { swimmerId } = useParams<{ swimmerId: string }>();
  const [swimmer, setSwimmer] = useState<UserProfile | null>(null);
  const [swimSessions, setSwimSessions] = useState<SwimSession[]>([]);
  const [trainingSessions, setTrainingSessions] = useState<TrainingSession[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { profile } = useProfile();
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    if (!profile) return;
    
    // Only allow coaches to access this page
    if (profile.userType !== 'coach') {
      navigate('/');
      toast({
        title: "Access denied",
        description: "Only coaches can access this page",
        variant: "destructive",
      });
      return;
    }

    if (swimmerId) {
      console.log("Fetching details for swimmer ID:", swimmerId);
      loadSwimmerData();
    }
  }, [profile, swimmerId, navigate]);

  const loadSwimmerData = async () => {
    if (!swimmerId) return;
    
    try {
      setLoading(true);
      
      // Fetch swimmer profile
      const swimmerProfile = await fetchSwimmerProfile(swimmerId);
      setSwimmer(swimmerProfile);
      
      // Fetch swim sessions
      const swimmerSessions = await fetchSwimmerSwimSessions(swimmerId);
      setSwimSessions(swimmerSessions);
      
      // Fetch training sessions
      const trainingData = await fetchSwimmerTrainingSessions(swimmerId);
      setTrainingSessions(trainingData);
    } catch (error: any) {
      console.error("Error loading swimmer data:", error);
      toast({
        title: "Error loading data",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={() => navigate('/swimmers')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('back')}
          </Button>
        </div>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-[300px]" />
            <Skeleton className="h-48 w-full" />
          </div>
        ) : (
          <>
            <SwimmerProfileCard swimmer={swimmer} />
            <SwimmerSessionsTabs 
              swimSessions={swimSessions} 
              trainingSessions={trainingSessions} 
            />
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default SwimmerDetail;
