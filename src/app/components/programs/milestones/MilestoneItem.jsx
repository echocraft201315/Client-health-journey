const MilestoneItem = ({ day, title, description }) => {
  const clientStartDate = "4/11/2025";
  const isCompleted = () => {
    if (!clientStartDate) return false;

    const startDate = new Date(clientStartDate);
    const targetDate = new Date(startDate);
    targetDate.setDate(startDate.getDate() + day - 1);

    return new Date() > targetDate;
  };

  return (
    <div className="flex items-start gap-3">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center ${
          isCompleted()
            ? "bg-green-100 text-green-600"
            : "bg-gray-100 text-gray-500"
        }`}
      >
        {day}
      </div>
      <div>
        <h4 className="font-medium">{title}</h4>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
  );
};

export default MilestoneItem;
