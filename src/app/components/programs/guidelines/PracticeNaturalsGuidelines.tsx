
const PracticeNaturalsGuidelines = ({ category }) => {
  return (
    <div>
      <h3 className="font-medium mb-3">Practice Naturals™ - Category {category || '?'}</h3>
      
      {category === 'A' && (
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-sm">Breakfast</h4>
            <ul className="list-disc pl-5 text-sm">
              <li>4 oz protein, OR</li>
              <li>20g protein in a vegan protein shake</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-sm">Lunch</h4>
            <ul className="list-disc pl-5 text-sm">
              <li>4 oz protein</li>
              <li>2 oz fruit</li>
              <li>4 oz vegetables</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-sm">Dinner</h4>
            <ul className="list-disc pl-5 text-sm">
              <li>4 oz protein</li>
              <li>2 oz fruit</li>
              <li>4 oz vegetables</li>
            </ul>
          </div>
        </div>
      )}
      
      {category === 'B' && (
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-sm">Breakfast</h4>
            <ul className="list-disc pl-5 text-sm">
              <li>5 oz protein, OR</li>
              <li>20g protein in a vegan protein shake</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-sm">Lunch</h4>
            <ul className="list-disc pl-5 text-sm">
              <li>4 oz protein</li>
              <li>3 oz fruit</li>
              <li>6 oz vegetables</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-sm">Dinner</h4>
            <ul className="list-disc pl-5 text-sm">
              <li>4 oz protein</li>
              <li>3 oz fruit</li>
              <li>4 oz vegetables</li>
            </ul>
          </div>
        </div>
      )}
      
      {category === 'C' && (
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-sm">Breakfast</h4>
            <ul className="list-disc pl-5 text-sm">
              <li>5 oz protein, OR</li>
              <li>20g protein in a vegan protein shake</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-sm">Lunch</h4>
            <ul className="list-disc pl-5 text-sm">
              <li>4 oz protein</li>
              <li>4 oz fruit</li>
              <li>6 oz vegetables</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-sm">Dinner</h4>
            <ul className="list-disc pl-5 text-sm">
              <li>4 oz protein</li>
              <li>4 oz fruit</li>
              <li>6 oz vegetables</li>
            </ul>
          </div>
        </div>
      )}
      
      {!category && (
        <div className="bg-yellow-50 p-3 rounded-md text-sm">
          <p className="text-yellow-800">No category assigned. Please contact your coach.</p>
        </div>
      )}

      <div className="mt-4">
        <h4 className="font-medium">Recommended Supplements</h4>
        <ul className="list-disc pl-5 text-sm space-y-1 mt-1">
          <li>Boost: 1 dropper under the tongue 3x/day</li>
          <li>Burn (optional): 1 capsule with breakfast, before 10am</li>
          <li>Cleanse: 1 capsule with both lunch and dinner</li>
          <li>Digest: 1 capsule with both lunch and dinner</li>
          <li>Suppress: 1 capsule 1-2 hrs AFTER lunch and dinner</li>
          <li>Reuv or Revive (optional): Collagen - take anytime 1x/day</li>
          <li>V-Pro (optional): Vegan protein shake anytime</li>
          <li>Sweep (optional): Take as directed by Coach</li>
        </ul>
      </div>
    </div>
  );
};

export default PracticeNaturalsGuidelines;
