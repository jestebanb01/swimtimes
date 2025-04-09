
import React, { useState } from 'react';
import { useSwim } from '@/contexts/SwimContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Users } from 'lucide-react';
import ComparisonSearchForm from './ComparisonSearchForm';
import ComparisonResultsTable from './ComparisonResultsTable';
import DistanceFilterTabs from './DistanceFilterTabs';
import ComparisonEmptyState from './ComparisonEmptyState';
import { BestTimeComparison } from '@/types/swim';
import { 
  findUserByName, 
  getOpponentSessions, 
  formatSessionsForComparison,
  createComparisons
} from '@/services/comparisonService';

const HeadToHeadComparison: React.FC = () => {
  const { sessions } = useSwim();
  const { toast } = useToast();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [comparisons, setComparisons] = useState<BestTimeComparison[]>([]);
  const [opponentName, setOpponentName] = useState<string | null>(null);
  const [activeDistance, setActiveDistance] = useState<string>('all');

  // Get all unique distances from the user's sessions
  const uniqueDistances = Array.from(new Set(sessions.map(s => s.distance))).sort((a, b) => a - b);
  
  // Common swim distances for filtering
  const commonDistances = [50, 100, 200, 400, 800, 1500];
  const tabDistances = ['all', ...commonDistances.filter(d => uniqueDistances.includes(d)).map(d => d.toString())];

  const findOpponentBestTimes = async () => {
    if (!firstName.trim() && !lastName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter at least a first name or last name to compare with",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    try {
      // Find user by name
      const users = await findUserByName(firstName, lastName);
      
      if (!users || users.length === 0) {
        toast({
          title: "User not found",
          description: "No user found with that name",
          variant: "destructive",
        });
        setIsSearching(false);
        return;
      }

      console.log("Found users:", users);
      const opponentId = users[0].id;
      const displayName = users[0].first_name && users[0].last_name
        ? `${users[0].first_name} ${users[0].last_name}`
        : (users[0].first_name || users[0].last_name);
      setOpponentName(displayName);

      // Get opponent sessions - using direct query now instead of RPC
      const rawOpponentSessions = await getOpponentSessions(opponentId);
      
      if (!rawOpponentSessions || rawOpponentSessions.length === 0) {
        toast({
          title: "No swim data",
          description: "This user has no swim sessions recorded",
          variant: "destructive",
        });
        setIsSearching(false);
        return;
      }

      console.log("Opponent sessions retrieved:", rawOpponentSessions.length);
      
      // Format sessions for comparison
      const formattedOpponentSessions = formatSessionsForComparison(rawOpponentSessions);
      
      // Create comparisons
      const newComparisons = createComparisons(sessions, formattedOpponentSessions);
      setComparisons(newComparisons);
      
      toast({
        title: "Comparison ready",
        description: `Showing comparison with ${displayName}`,
      });
    } catch (error: any) {
      console.error("Error in comparison:", error);
      toast({
        title: "Error finding opponent",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  // Filter comparisons based on selected distance
  const filteredComparisons = activeDistance === 'all'
    ? comparisons
    : comparisons.filter(c => c.distance === parseInt(activeDistance));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-aqua-600" />
            Head to Head Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ComparisonSearchForm
            firstName={firstName}
            lastName={lastName}
            setFirstName={setFirstName}
            setLastName={setLastName}
            onSearch={findOpponentBestTimes}
            isSearching={isSearching}
          />
          
          {comparisons.length > 0 && opponentName && (
            <div className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  Your times vs. {opponentName}
                </h3>
                
                {uniqueDistances.length > 0 && (
                  <DistanceFilterTabs
                    activeDistance={activeDistance}
                    setActiveDistance={setActiveDistance}
                    tabDistances={tabDistances}
                  />
                )}
              </div>
              
              {filteredComparisons.length > 0 ? (
                <ComparisonResultsTable comparisons={filteredComparisons} />
              ) : (
                <ComparisonEmptyState type="no-data" />
              )}
            </div>
          )}
          
          {comparisons.length === 0 && !isSearching && (
            <ComparisonEmptyState type="initial" />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HeadToHeadComparison;
