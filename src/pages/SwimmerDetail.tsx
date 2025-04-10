
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { useToast } from '@/components/ui/use-toast';
import { useProfile } from '@/contexts/ProfileContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile, SwimSession, TrainingSession } from '@/types/swim';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User } from 'lucide-react';
import SwimSessionsList from '@/components/SwimSessionsList';
import TrainingSessionsList from '@/components/TrainingSessionsList';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatSessionsForComparison } from '@/services/comparisonService';

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
      fetchSwimmerDetails();
      fetchSwimmerSessions();
      fetchSwimmerTrainings();
    }
  }, [profile, swimmerId, navigate]);

  const fetchSwimmerDetails = async () => {
    try {
      if (!swimmerId) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', swimmerId)
        .single();

      if (error) throw error;

      console.log("Fetched swimmer details:", data);

      if (data) {
        setSwimmer({
          id: data.id,
          firstName: data.first_name,
          lastName: data.last_name,
          yearOfBirth: data.year_of_birth,
          avatarUrl: data.avatar_url,
          country: data.country,
          gender: data.gender,
          clubId: data.club_id,
          userType: data.user_type
        });
      }
    } catch (error: any) {
      console.error("Error fetching swimmer details:", error);
      toast({
        title: "Error fetching swimmer details",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const fetchSwimmerSessions = async () => {
    try {
      if (!swimmerId) return;

      console.log("Fetching swim sessions for swimmer ID:", swimmerId);
      
      const { data, error } = await supabase
        .from('swim_sessions')
        .select('*')
        .eq('user_id', swimmerId)
        .order('date', { ascending: false });

      if (error) throw error;

      console.log("Fetched swim sessions:", data);

      if (data) {
        const formattedSessions = formatSessionsForComparison(data);
        setSwimSessions(formattedSessions);
      }
    } catch (error: any) {
      console.error("Error fetching swim sessions:", error);
      toast({
        title: "Error fetching swim sessions",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSwimmerTrainings = async () => {
    try {
      if (!swimmerId) return;

      console.log("Fetching training sessions for swimmer ID:", swimmerId);
      
      const { data, error } = await supabase
        .from('training_sessions')
        .select('*')
        .eq('user_id', swimmerId)
        .order('date', { ascending: false });

      if (error) throw error;

      console.log("Fetched training sessions:", data);

      if (data) {
        const formattedTrainings: TrainingSession[] = data.map((training: any) => ({
          id: training.id,
          date: new Date(training.date),
          intensity: training.intensity,
          distance: training.distance,
          description: training.description || ''
        }));
        
        setTrainingSessions(formattedTrainings);
      }
    } catch (error: any) {
      console.error("Error fetching training sessions:", error);
      toast({
        title: "Error fetching training sessions",
        description: error.message,
        variant: "destructive",
      });
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
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={swimmer?.avatarUrl || undefined} />
                    <AvatarFallback>
                      <User className="h-8 w-8" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-2xl">
                      {swimmer?.firstName} {swimmer?.lastName}
                    </CardTitle>
                    <CardDescription>
                      {swimmer?.yearOfBirth && `${t('yearOfBirth')}: ${swimmer.yearOfBirth}`}
                      {swimmer?.gender && ` • ${t('gender')}: ${swimmer.gender}`}
                      {swimmer?.country && ` • ${t('country')}: ${swimmer.country}`}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Tabs defaultValue="swim" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="swim">{t('swimSessions')}</TabsTrigger>
                <TabsTrigger value="training">{t('trainingSessions')}</TabsTrigger>
              </TabsList>
              <TabsContent value="swim">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('swimSessions')}</CardTitle>
                    <CardDescription>
                      {t('swimmersSwimSessions')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {swimSessions.length === 0 ? (
                      <div className="text-center py-6">
                        {t('noSwimSessions')}
                      </div>
                    ) : (
                      <SwimSessionsList 
                        sessions={swimSessions} 
                        readOnly={true}
                      />
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="training">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('trainingSessions')}</CardTitle>
                    <CardDescription>
                      {t('swimmersTrainingSessions')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {trainingSessions.length === 0 ? (
                      <div className="text-center py-6">
                        {t('noTrainingSessions')}
                      </div>
                    ) : (
                      <TrainingSessionsList 
                        sessions={trainingSessions} 
                        readOnly={true}
                      />
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default SwimmerDetail;
