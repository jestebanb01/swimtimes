
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { BestTimeComparison } from '@/types/swim';
import { formatSwimTime } from '@/utils/timeUtils';
import { format } from 'date-fns';
import { getComparisonMessage } from '@/utils/comparisonUtils';
import { TrendingDown, TrendingUp, Trophy, AlertCircle } from 'lucide-react';

interface ComparisonResultsTableProps {
  comparisons: BestTimeComparison[];
}

const ComparisonResultsTable: React.FC<ComparisonResultsTableProps> = ({ comparisons }) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Distance</TableHead>
            <TableHead>Style</TableHead>
            <TableHead>Your Best</TableHead>
            <TableHead>Opponent's Best</TableHead>
            <TableHead>Comparison</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {comparisons.map((comp, index) => {
            const comparison = getComparisonMessage(comp.timeDifference);
            let icon;
            switch(comparison.icon) {
              case 'trending-down':
                icon = <TrendingDown className="h-5 w-5 text-green-500" />;
                break;
              case 'trending-up':
                icon = <TrendingUp className="h-5 w-5 text-red-500" />;
                break;
              case 'trophy':
                icon = <Trophy className="h-5 w-5 text-yellow-500" />;
                break;
              default:
                icon = null;
            }
            
            return (
              <TableRow key={index}>
                <TableCell className="font-medium">{comp.distance}m</TableCell>
                <TableCell className="capitalize">{comp.style}</TableCell>
                <TableCell>
                  {comp.yourTime ? (
                    <>
                      <div className="font-mono font-semibold">{formatSwimTime(comp.yourTime)}</div>
                      <div className="text-xs text-gray-500">
                        {comp.yourDate && format(comp.yourDate, 'MMM d, yyyy')}
                      </div>
                    </>
                  ) : (
                    <span className="text-gray-500">No data</span>
                  )}
                </TableCell>
                <TableCell>
                  {comp.opponentTime ? (
                    <>
                      <div className="font-mono font-semibold">{formatSwimTime(comp.opponentTime)}</div>
                      <div className="text-xs text-gray-500">
                        {comp.opponentDate && format(comp.opponentDate, 'MMM d, yyyy')}
                      </div>
                    </>
                  ) : (
                    <span className="text-gray-500">No data</span>
                  )}
                </TableCell>
                <TableCell>
                  {comp.yourTime && comp.opponentTime ? (
                    <div className={`flex items-center gap-1 ${comparison.className}`}>
                      {icon}
                      <span>{comparison.message}</span>
                    </div>
                  ) : (
                    <span className="text-gray-500 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      Incomplete data
                    </span>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default ComparisonResultsTable;
