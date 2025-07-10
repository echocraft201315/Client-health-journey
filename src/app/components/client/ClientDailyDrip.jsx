import DripMessageCard from './drip/DripMessageCard';
import DripLoadingCard from './drip/DripLoadingCard';

const ClientDailyDrip = () => {
  const loading = false;
  if (loading) {
    return <DripLoadingCard />;
  }
  const todaysDrip = {
    subject: "👋 Welcome to Client Health Tracker!",
    content: "new message",
    day_number:"1",
  }
  return (
    <DripMessageCard/>
  );
};

export default ClientDailyDrip;
