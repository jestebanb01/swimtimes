
import React from 'react';
import { AlertCircle, Users } from 'lucide-react';

interface ComparisonEmptyStateProps {
  type: 'no-data' | 'initial' | 'no-matches';
}

const ComparisonEmptyState: React.FC<ComparisonEmptyStateProps> = ({ type }) => {
  if (type === 'no-data') {
    return (
      <div className="text-center py-8 text-gray-500">
        <AlertCircle className="h-10 w-10 mx-auto mb-2" />
        <p>No matching distance/style combinations found.</p>
        <p className="text-sm">Try selecting a different distance or "All Distances".</p>
      </div>
    );
  }
  
  if (type === 'no-matches') {
    return (
      <div className="text-center py-8 text-gray-500">
        <AlertCircle className="h-10 w-10 mx-auto mb-2" />
        <p>No matching swim data found.</p>
        <p className="text-sm">Try searching for another user or checking if they have swim sessions recorded.</p>
      </div>
    );
  }
  
  // Initial state
  return (
    <div className="text-center py-8 text-gray-500 mt-4">
      <Users className="h-10 w-10 mx-auto mb-2" />
      <p>Enter an opponent's first and last name and click "Compare Times" to see how your swim times compare.</p>
    </div>
  );
};

export default ComparisonEmptyState;
