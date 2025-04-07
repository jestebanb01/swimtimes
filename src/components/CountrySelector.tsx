
import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';

// List of countries for the dropdown
const countries = [
  { code: 'us', name: 'United States', namees: 'Estados Unidos' },
  { code: 'es', name: 'Spain', namees: 'España' },
  { code: 'mx', name: 'Mexico', namees: 'México' },
  { code: 'ar', name: 'Argentina', namees: 'Argentina' },
  { code: 'uk', name: 'United Kingdom', namees: 'Reino Unido' },
  { code: 'ca', name: 'Canada', namees: 'Canadá' },
  { code: 'au', name: 'Australia', namees: 'Australia' },
  { code: 'fr', name: 'France', namees: 'Francia' },
  { code: 'de', name: 'Germany', namees: 'Alemania' },
  { code: 'it', name: 'Italy', namees: 'Italia' },
  { code: 'br', name: 'Brazil', namees: 'Brasil' },
  { code: 'jp', name: 'Japan', namees: 'Japón' },
  { code: 'cn', name: 'China', namees: 'China' },
  { code: 'ru', name: 'Russia', namees: 'Rusia' },
  { code: 'in', name: 'India', namees: 'India' },
];

interface CountrySelectorProps {
  value: string | null;
  onChange: (value: string) => void;
  className?: string;
}

const CountrySelector: React.FC<CountrySelectorProps> = ({ 
  value, 
  onChange,
  className
}) => {
  const { language, t } = useLanguage();
  
  return (
    <Select 
      value={value || ''} 
      onValueChange={onChange}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder={t('selectCountry')} />
      </SelectTrigger>
      <SelectContent>
        {countries.map((country) => (
          <SelectItem key={country.code} value={country.code}>
            {language === 'es' ? country.namees : country.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CountrySelector;
