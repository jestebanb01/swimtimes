
import React, { useState, useRef } from 'react';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  RadioGroup, 
  RadioGroupItem 
} from '@/components/ui/radio-group';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { useProfile } from '@/contexts/ProfileContext';
import { UserCircle, Upload } from 'lucide-react';
import CountrySelector from '@/components/CountrySelector';
import ClubSelector from '@/components/ClubSelector';
import { useLanguage } from '@/contexts/LanguageContext';
import { UserType } from '@/types/swim';

const Profile = () => {
  const { profile, updateProfile, uploadAvatar, loading } = useProfile();
  const { t } = useLanguage();
  const [firstName, setFirstName] = useState(profile?.firstName || '');
  const [lastName, setLastName] = useState(profile?.lastName || '');
  const [yearOfBirth, setYearOfBirth] = useState<string>(profile?.yearOfBirth?.toString() || '');
  const [country, setCountry] = useState<string | null>(profile?.country || null);
  const [gender, setGender] = useState<string | null>(profile?.gender || null);
  const [clubId, setClubId] = useState<string | null>(profile?.clubId || null);
  const [userType, setUserType] = useState<UserType>(profile?.userType || 'basic');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (yearOfBirth) {
      const year = parseInt(yearOfBirth);
      const currentYear = new Date().getFullYear();
      if (isNaN(year) || year < 1900 || year > currentYear) {
        newErrors.yearOfBirth = `Year must be between 1900 and ${currentYear}`;
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
      
      await updateProfile({
        firstName: firstName || null,
        lastName: lastName || null,
        yearOfBirth: yearOfBirth ? parseInt(yearOfBirth) : null,
        country: country,
        gender: gender,
        clubId: clubId,
        userType: userType
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Basic validation
    if (!file.type.startsWith('image/')) {
      setErrors({ avatar: 'File must be an image' });
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB
      setErrors({ avatar: 'File size must be less than 5MB' });
      return;
    }
    
    setIsSubmitting(true);
    try {
      const avatarUrl = await uploadAvatar(file);
      if (avatarUrl) {
        await updateProfile({ avatarUrl });
      }
    } finally {
      setIsSubmitting(false);
      // Clear the input value so the same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-aqua-600"></div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>{t('profileSettings')}</CardTitle>
            <CardDescription>{t('manageAccount')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center mb-6">
              <div className="relative">
                <Avatar 
                  className="h-24 w-24 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={handleAvatarClick}
                >
                  <AvatarImage src={profile?.avatarUrl || ''} alt="Profile" />
                  <AvatarFallback>
                    <UserCircle className="h-12 w-12" />
                  </AvatarFallback>
                </Avatar>
                <div 
                  className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-1 cursor-pointer"
                  onClick={handleAvatarClick}
                >
                  <Upload className="h-4 w-4" />
                </div>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*"
              />
              {errors.avatar && <p className="text-red-500 text-sm mt-1">{errors.avatar}</p>}
              <p className="text-sm text-muted-foreground mt-2">{t('uploadAvatar')}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="firstName" className="block text-sm font-medium">{t('firstName')}</label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder={t('firstName')}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="lastName" className="block text-sm font-medium">{t('lastName')}</label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder={t('lastName')}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="yearOfBirth" className="block text-sm font-medium">{t('yearOfBirth')}</label>
                <Input
                  id="yearOfBirth"
                  value={yearOfBirth}
                  onChange={(e) => setYearOfBirth(e.target.value)}
                  placeholder="e.g., 1985"
                  type="number"
                  min="1900"
                  max={new Date().getFullYear()}
                />
                {errors.yearOfBirth && <p className="text-red-500 text-sm">{errors.yearOfBirth}</p>}
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium">{t('gender') || 'Gender'}</label>
                <RadioGroup
                  value={gender || ''}
                  onValueChange={(value) => setGender(value || null)}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male">{t('male') || 'Male'}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female">{t('female') || 'Female'}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other">{t('other') || 'Other'}</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="country" className="block text-sm font-medium">{t('country')}</label>
                <CountrySelector
                  value={country}
                  onChange={setCountry}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="club" className="block text-sm font-medium">{t('club') || 'Swimming Club'}</label>
                <ClubSelector
                  value={clubId}
                  onChange={setClubId}
                  className="w-full"
                />
              </div>
              
              {/* User type is read-only as it's managed by admins in the database */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">{t('userType') || 'User Type'}</label>
                <div className="p-2 bg-gray-50 rounded border border-gray-200">
                  {userType === 'coach' ? 
                    (t('coach') || 'Coach') : 
                    (t('basicUser') || 'Basic User')
                  }
                </div>
                <p className="text-xs text-muted-foreground">
                  {t('userTypeInfo') || 'User type can only be changed by administrators.'}
                </p>
              </div>
              
              <CardFooter className="px-0 pt-4">
                <Button 
                  type="submit" 
                  className="w-full bg-aqua-600 text-white hover:bg-aqua-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? t('saving') : t('saveProfile')}
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Profile;
