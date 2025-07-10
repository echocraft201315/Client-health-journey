import { AlertCircle, Info, CheckCircle } from 'lucide-react';

const GeneralGuidelines = () => {
  return (
    <div>
      <h3 className="font-medium mb-2">General Guidelines</h3>
      <ul className="space-y-2">
        <li className="flex items-start">
          <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
          <span>Drink 80-100 oz of water daily</span>
        </li>
        <li className="flex items-start">
          <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
          <span>Coffee and tea are allowed (watch creamer)</span>
        </li>
        <li className="flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
          <span>No dairy or alcohol allowed</span>
        </li>
        <li className="flex items-start">
          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
          <span>Focus on high protein, low carb, low fat</span>
        </li>
        <li className="flex items-start">
          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
          <span>Choose lean proteins (bacon does not apply)</span>
        </li>
        <li className="flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
          <span>Avoid cooking oils - use dry rubs and seasonings instead</span>
        </li>
        <li className="flex items-start">
          <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
          <span>For salads, avoid dairy-based dressings and use only 1 tbsp of olive or avocado oil</span>
        </li>
      </ul>
    </div>
  );
};

export default GeneralGuidelines;
