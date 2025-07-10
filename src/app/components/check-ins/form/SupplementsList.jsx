import React from 'react';
import { Checkbox } from '../../../components/ui/checkbox';

const SupplementsList = () => {
  const suppliments = [ {
    id: "1",
    name: "aaa",
    dosage: 8,
    frequency: 3,
    time_of_day: "2012/2/2",
    description: "hello"
  }
  ]
  return (
    <div className="space-y-3">
      {supplements.map((supplement) => (
        <div key={supplement.id} className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 mb-3 p-2 rounded-md border border-gray-100">
          <Checkbox
            id={supplement.id}
            checked={!!checkedSupplements[supplement.id]}
            onCheckedChange={(checked) => 
              onSupplementChange(supplement.id, Boolean(checked))
            }
            className="w-5 h-5"
          />
          <div className="grid gap-0.5 w-full">
            <label
              htmlFor={supplement.id}
              className="font-medium cursor-pointer text-sm sm:text-base"
            >
              {supplement.name}
            </label>
            <p className="text-xs sm:text-sm text-gray-500">
              {supplement.dosage} - {supplement.frequency}
              {supplement.time_of_day && ` - ${supplement.time_of_day}`}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SupplementsList;
