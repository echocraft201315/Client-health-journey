
import { AlertCircle, Info, CheckCircle } from 'lucide-react';

const ChiroThinGuidelines = () => {
  return (
    <div>
      <h3 className="font-medium mb-3">ChiroThin™ Program</h3>
      
      <div className="space-y-4">
        <div>
          <ul className="list-disc pl-5 text-sm">
            <li className="text-red-600 font-medium">No Breakfast or snacks allowed</li>
          </ul>
        </div>
        <div>
          <h4 className="font-medium text-sm">Lunch & Dinner</h4>
          <ul className="list-disc pl-5 text-sm">
            <li>4 oz protein</li>
            <li>4 oz fruit</li>
            <li>4 oz vegetables</li>
          </ul>
        </div>
      </div>

      <div className="mt-4">
        <h4 className="font-medium">Recommended Supplements</h4>
        <ul className="list-disc pl-5 text-sm mt-1">
          <li>ChiroThin™ drops: Take 10 drops under the tongue 3x/day</li>
        </ul>
      </div>
    </div>
  );
};

export default ChiroThinGuidelines;
