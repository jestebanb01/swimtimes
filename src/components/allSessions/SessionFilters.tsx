
import React from 'react';
import { SwimStyle } from '@/types/swim';
import { useLanguage } from '@/contexts/LanguageContext';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SessionFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedStyle: string;
  setSelectedStyle: (style: string) => void;
  sortField: string;
  setSortField: (field: string) => void;
  sortDirection: 'asc' | 'desc';
  setSortDirection: (direction: 'asc' | 'desc') => void;
  groupBy: string | null;
  setGroupBy: (groupBy: string | null) => void;
}

const SessionFilters: React.FC<SessionFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  selectedStyle,
  setSelectedStyle,
  sortField,
  setSortField,
  sortDirection,
  setSortDirection,
  groupBy,
  setGroupBy,
}) => {
  const { t } = useLanguage();
  const swimStyles: SwimStyle[] = ['freestyle', 'breaststroke', 'butterfly', 'backstroke', 'medley'];

  return (
    <div className="flex flex-col gap-4 md:flex-row">
      {/* Search */}
      <div className="flex-1">
        <Input
          placeholder={t('searchSwimmerOrClub')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {/* Style Filter */}
      <div className="w-full md:w-48">
        <Select
          value={selectedStyle}
          onValueChange={setSelectedStyle}
        >
          <SelectTrigger>
            <SelectValue placeholder={t('style')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('allStyles')}</SelectItem>
            {swimStyles.map((style) => (
              <SelectItem key={style} value={style}>
                {t(style)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Sort By */}
      <div className="w-full md:w-48">
        <Select
          value={sortField}
          onValueChange={setSortField}
        >
          <SelectTrigger>
            <SelectValue placeholder={t('sortBy')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">{t('date')}</SelectItem>
            <SelectItem value="name">{t('name')}</SelectItem>
            <SelectItem value="yearOfBirth">{t('yearOfBirth')}</SelectItem>
            <SelectItem value="club">{t('club')}</SelectItem>
            <SelectItem value="distance">{t('distance')}</SelectItem>
            <SelectItem value="time">{t('time')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Sort Direction */}
      <div className="w-full md:w-48">
        <Select
          value={sortDirection}
          onValueChange={(value) => setSortDirection(value as 'asc' | 'desc')}
        >
          <SelectTrigger>
            <SelectValue placeholder={t('order')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">{t('ascending')}</SelectItem>
            <SelectItem value="desc">{t('descending')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Group By */}
      <div className="w-full md:w-48">
        <Select
          value={groupBy || 'none'}
          onValueChange={(value) => setGroupBy(value === 'none' ? null : value)}
        >
          <SelectTrigger>
            <SelectValue placeholder={t('groupBy')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">{t('noGrouping')}</SelectItem>
            <SelectItem value="style">{t('swimStyle')}</SelectItem>
            <SelectItem value="club">{t('club')}</SelectItem>
            <SelectItem value="year">{t('yearOfBirth')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default SessionFilters;
