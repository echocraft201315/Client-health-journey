
const SupplementItem = ({
  name,
  description,
  dosage,
  frequency,
  timeOfDay,
}) => {
  return (
    <div className="border-b pb-3 last:border-0">
      <h4 className="font-medium">{name}</h4>
      <p className="text-sm text-gray-600">{description}</p>
      <div className="grid grid-cols-3 gap-2 mt-1 text-sm">
        <div>
          <span className="text-gray-500">Dosage:</span> {dosage}
        </div>
        {frequency && (
          <div>
            <span className="text-gray-500">Frequency:</span> {frequency}
          </div>
        )}
        {timeOfDay && (
          <div>
            <span className="text-gray-500">Time:</span> {timeOfDay}
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplementItem;
