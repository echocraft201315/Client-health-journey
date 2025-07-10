
import React from 'react';
import SupplementItem from './SupplementItem';

const PracticeNaturalsSupplements = () => {
  return (
    <div className="space-y-3">
      <SupplementItem
        name="Boost"
        description="Helps boost metabolism and energy"
        dosage="1 dropper"
        frequency="3x daily"
        timeOfDay="Under the tongue"
      />
      
      <SupplementItem
        name="Burn (optional)"
        description="Supports fat metabolism"
        dosage="1 capsule"
        timeOfDay="With breakfast, before 10am"
      />
      
      <SupplementItem
        name="Cleanse"
        description="Supports digestive health"
        dosage="1 capsule"
        timeOfDay="With lunch and dinner"
      />
      
      <SupplementItem
        name="Digest"
        description="Enhances nutrient absorption"
        dosage="1 capsule"
        timeOfDay="With lunch and dinner"
      />
      
      <SupplementItem
        name="Suppress"
        description="Helps control appetite"
        dosage="1 capsule"
        timeOfDay="1-2 hrs after lunch and dinner"
      />
      
      <SupplementItem
        name="Reuv or Revive (optional)"
        description="Collagen supplement"
        dosage="As directed"
        timeOfDay="Once daily, anytime"
      />
      
      <SupplementItem
        name="V-Pro (optional)"
        description="Vegan protein shake"
        dosage="1 scoop"
        timeOfDay="Anytime"
      />
      
      <SupplementItem
        name="Sweep (optional)"
        description="Detoxification support"
        dosage="As directed by Coach"
      />
    </div>
  );
};

export default PracticeNaturalsSupplements;
