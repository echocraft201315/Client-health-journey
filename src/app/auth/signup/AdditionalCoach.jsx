import React from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Trash } from 'lucide-react';

const AdditionalCoach = ({ coach, index, onChange, onRemove }) => {
  return (
    <div className="border rounded-md p-4">
      <div className="flex justify-between mb-2">
        <h4 className="font-medium">Coach {index + 1}</h4>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm"
          className="text-red-500 h-8 px-2"
          onClick={() => onRemove(index)}
        >
          <Trash size={16} />
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium block mb-1">Name</label>
          <Input 
            value={coach.name}
            onChange={(e) => onChange(index, 'name', e.target.value)}
            placeholder="Full name"
          />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1">Email</label>
          <Input 
            type="email"
            value={coach.email}
            onChange={(e) => onChange(index, 'email', e.target.value)}
            placeholder="Email address"
          />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1">Phone</label>
          <Input 
            value={coach.phone}
            onChange={(e) => onChange(index, 'phone', e.target.value)}
            placeholder="Phone number"
          />
        </div>
      </div>
    </div>
  );
};

export default AdditionalCoach;
