import React from "react";
import { Building, Users, Activity } from "lucide-react";
import StatsCard from "./StatsCard";

const DashboardStats = ({ stats, isLoading, isClinicAdmin }) => {
  // Create stats data with appropriate filtering for clinic admins
  const statsData = [
    // Only show Active Clinics card to system admins
    ...(isClinicAdmin
      ? []
      : [
          {
            title: "Active Clinics",
            value: stats?.activeClinicCount || 0,
            icon: <Building className="text-primary-500" size={24} />,
            path: "/admin/clinics",
          },
        ]),
    {
      title: "Total Coaches",
      value: stats?.totalCoachCount || 0,
      icon: <Users className="text-secondary-500" size={24} />,
      path: "/admin/coaches",
    },
    {
      title: "Weekly Activities",
      value: stats?.weeklyActivitiesCount || 0,
      icon: <Activity className="text-purple-500" size={24} />,
      path: "/admin/activities",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-6 w-full">
      {statsData.map((stat, index) => (
        <StatsCard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
};

export default DashboardStats;
