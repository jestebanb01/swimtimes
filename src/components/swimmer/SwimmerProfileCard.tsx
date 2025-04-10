
import React from 'react';
import { User } from 'lucide-react';
import { UserProfile } from '@/types/swim';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface SwimmerProfileCardProps {
  swimmer: UserProfile | null;
}

const SwimmerProfileCard: React.FC<SwimmerProfileCardProps> = ({ swimmer }) => {
  const { t } = useLanguage();

  if (!swimmer) return null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={swimmer.avatarUrl || undefined} />
            <AvatarFallback>
              <User className="h-8 w-8" />
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl">
              {swimmer.firstName} {swimmer.lastName}
            </CardTitle>
            <CardDescription>
              {swimmer.yearOfBirth && `${t('yearOfBirth')}: ${swimmer.yearOfBirth}`}
              {swimmer.gender && ` • ${t('gender')}: ${swimmer.gender}`}
              {swimmer.country && ` • ${t('country')}: ${swimmer.country}`}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

export default SwimmerProfileCard;
