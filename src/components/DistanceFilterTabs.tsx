
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface DistanceFilterTabsProps {
  activeDistance: string;
  setActiveDistance: (distance: string) => void;
  tabDistances: string[];
}

const DistanceFilterTabs: React.FC<DistanceFilterTabsProps> = ({
  activeDistance,
  setActiveDistance,
  tabDistances
}) => {
  return (
    <Tabs value={activeDistance} onValueChange={setActiveDistance}>
      <TabsList>
        {tabDistances.map(distance => (
          <TabsTrigger key={distance} value={distance}>
            {distance === 'all' ? 'All Distances' : `${distance}m`}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export default DistanceFilterTabs;
