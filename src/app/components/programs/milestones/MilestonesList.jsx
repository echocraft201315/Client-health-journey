
import MilestoneItem from './MilestoneItem';

const MilestonesList = () => {
  return (
    <div className="space-y-3">
      <MilestoneItem 
        day={7} 
        title="First Week Complete" 
        description="Review your progress after one week" 
      />
      <MilestoneItem 
        day={14} 
        title="Two Week Check-in" 
        description="Expect to see initial results" 
      />
      <MilestoneItem 
        day={30} 
        title="Program Complete" 
        description="Final measurements and program review" 
      />
    </div>
  );
};

export default MilestonesList;
