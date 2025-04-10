
import React from 'react';
import { Button } from '@/components/ui/button';
import { SwimStyle } from '@/types/swim';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUp, ArrowDown } from 'lucide-react';

interface SessionFilterProps {
  filterStyle: SwimStyle | 'all';
  setFilterStyle: (style: SwimStyle | 'all') => void;
  sortField: string;
  sortDirection: 'asc' | 'desc';
  handleSort: (field: string) => void;
  readOnly?: boolean;
}

const SessionFilter: React.FC<SessionFilterProps> = ({
  filterStyle,
  setFilterStyle,
  sortField,
  sortDirection,
  handleSort,
  readOnly = false
}) => {
  const SortIcon = sortDirection === 'asc' ? ArrowUp : ArrowDown;

  if (readOnly) {
    return null;
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full sm:w-auto">
            Filter by Style
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Swim Styles</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setFilterStyle('all')}>
            All Styles
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setFilterStyle('freestyle')}>
            Freestyle
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setFilterStyle('breaststroke')}>
            Breaststroke
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setFilterStyle('butterfly')}>
            Butterfly
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setFilterStyle('backstroke')}>
            Backstroke
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setFilterStyle('medley')}>
            Medley
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full sm:w-auto">
            Sort by
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Sort Options</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => handleSort('date')}>
            Date {sortField === 'date' && <SortIcon className="ml-2 h-4 w-4" />}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSort('distance')}>
            Distance {sortField === 'distance' && <SortIcon className="ml-2 h-4 w-4" />}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSort('time')}>
            Time {sortField === 'time' && <SortIcon className="ml-2 h-4 w-4" />}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default SessionFilter;
