
import React from 'react';
import { Language, useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Languages } from 'lucide-react';

const LanguageSelector: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  
  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Languages className="h-5 w-5" />
          <span className="sr-only">{t('changeLanguage')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          className={language === 'en' ? 'bg-gray-100' : ''}
          onClick={() => handleLanguageChange('en')}
        >
          {t('english')}
        </DropdownMenuItem>
        <DropdownMenuItem 
          className={language === 'es' ? 'bg-gray-100' : ''}
          onClick={() => handleLanguageChange('es')}
        >
          {t('spanish')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
