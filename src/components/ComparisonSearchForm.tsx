
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface ComparisonSearchFormProps {
  firstName: string;
  lastName: string;
  setFirstName: (name: string) => void;
  setLastName: (name: string) => void;
  onSearch: () => void;
  isSearching: boolean;
}

const ComparisonSearchForm: React.FC<ComparisonSearchFormProps> = ({
  firstName,
  lastName,
  setFirstName,
  setLastName,
  onSearch,
  isSearching
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="flex-1">
        <Input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="w-full mb-3"
        />
        <Input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="w-full"
        />
      </div>
      <Button 
        onClick={onSearch} 
        disabled={isSearching}
        className="bg-aqua-600 hover:bg-aqua-700 self-end"
      >
        {isSearching ? (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
            Searching...
          </div>
        ) : (
          <div className="flex items-center">
            <Search className="h-4 w-4 mr-2" />
            Compare Times
          </div>
        )}
      </Button>
    </div>
  );
};

export default ComparisonSearchForm;
