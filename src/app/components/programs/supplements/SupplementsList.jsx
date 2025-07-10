
import React from 'react';
import SupplementItem from './SupplementItem';
import PracticeNaturalsSupplements from './PracticeNaturalsSupplements';
import ChiroThinSupplements from './ChiroThinSupplements';

const SupplementsList = ({ supplements, programType }) => {
  if (supplements && supplements.length > 0) {
    return (
      <div className="space-y-3">
        {supplements.map((supplement, index) => (
          <SupplementItem
            key={index}
            name={supplement.name}
            description={supplement.description}
            dosage={supplement.dosage}
            frequency={supplement.frequency}
            timeOfDay={supplement.time_of_day}
          />
        ))}
      </div>
    );
  }
  
  if (programType === 'practice_naturals') {
    return <PracticeNaturalsSupplements />;
  }
  
  if (programType === 'chirothin') {
    return <ChiroThinSupplements />;
  }
  
  return (
    <p className="text-sm text-gray-500 py-2">No supplements have been added to your program.</p>
  );
};

export default SupplementsList;
