import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { useToast } from '@/components/ui/use-toast';
import { useProfile } from '@/contexts/ProfileContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { UserProfile } from '@/types/swim';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, ChevronRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchSwimmersInClub } from '@/services/profileService';

const Swimmers = () => {
  const [swimmers, setSwimmers] = useState<UserProfile[]>([]);
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

    fetchSwimmers();
  }, [profile, navigate]);

  const fetchSwimmers = async () => {
    try {
      setLoading(true);
      
      if (!profile?.clubId) {
        setLoading(false);
        return;
      }
      
      console.log("Coach's club ID:", profile.clubId);
      
      // Use the new service function
      const swimmersList = await fetchSwimmersInClub(profile.clubId, profile.id);
      setSwimmers(swimmersList);
    } catch (error: any) {
      console.error("Error fetching swimmers:", error);
      toast({
        title: "Error fetching swimmers",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const viewSwimmerDetails = (swimmerId: string) => {
    navigate(`/swimmers/${swimmerId}`);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">{t('mySwimmers')}</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('clubSwimmers')}</CardTitle>
            <CardDescription>
              {profile?.clubId 
                ? t('swimmersInYourClub') 
                : t('noClubSelected')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : !profile?.clubId ? (
              <div className="text-center py-4">
                {t('pleaseSelectClub')}
              </div>
            ) : swimmers.length === 0 ? (
              <div className="text-center py-4">
                {t('noSwimmersInClub')}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('name')}</TableHead>
                    <TableHead>{t('yearOfBirth')}</TableHead>
                    <TableHead>{t('gender')}</TableHead>
                    <TableHead className="text-right">{t('actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {swimmers.map((swimmer) => (
                    <TableRow key={swimmer.id}>
                      <TableCell className="font-medium">
                        {swimmer.firstName} {swimmer.lastName}
                      </TableCell>
                      <TableCell>{swimmer.yearOfBirth}</TableCell>
                      <TableCell>{swimmer.gender}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => viewSwimmerDetails(swimmer.id)}>
                              {t('viewDetails')}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => viewSwimmerDetails(swimmer.id)}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Swimmers;
