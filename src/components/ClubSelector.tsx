
import React, { useState, useEffect } from 'react';
import { Club } from '@/types/swim';
import { supabase } from '@/integrations/supabase/client';
import { 
  Select, 
  SelectContent, 
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

interface ClubSelectorProps {
  value: string | null;
  onChange: (value: string | null) => void;
  className?: string;
}

const ClubSelector: React.FC<ClubSelectorProps> = ({ 
  value, 
  onChange,
  className
}) => {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { t } = useLanguage();
  
  useEffect(() => {
    const fetchClubs = async () => {
      try {
        setLoading(true);
        // Use any type to bypass the TypeScript restriction temporarily
        // until the generated types are updated
        const { data, error } = await (supabase as any)
          .from('clubs')
          .select('*')
          .order('name');
          
        if (error) {
          throw error;
        }
        
        if (data) {
          const formattedClubs: Club[] = data.map((club: any) => ({
            id: club.id,
            name: club.name,
            country: club.country,
            createdAt: new Date(club.created_at)
          }));
          
          setClubs(formattedClubs);
        }
      } catch (error: any) {
        toast({
          title: "Error fetching clubs",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchClubs();
  }, [toast]);
  
  return (
    <Select 
      value={value || 'none'} 
      onValueChange={(val) => onChange(val === 'none' ? null : val)}
    >
      <SelectTrigger className={className} disabled={loading}>
        <SelectValue placeholder={t('selectClub')} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="none">
          {t('noClub')}
        </SelectItem>
        {clubs.map((club) => (
          <SelectItem key={club.id} value={club.id}>
            {club.name} ({club.country})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default ClubSelector;
