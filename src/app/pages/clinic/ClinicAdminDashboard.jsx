"use client";
import { Button } from "../../components/ui/button";
import { RefreshCw } from "lucide-react";
import DashboardStats from "../../components/admin/dashboard/DashboardStats";
import ClinicsTable from "../../components/admin/dashboard/ClinicsTable";
import ActivityList from "../../components/admin/dashboard/ActivityList";
import { useAuth } from "@/app/context/AuthContext";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [totalCoaches, setTotalCoaches] = useState(0);
  const [weeklyActivitiesCount, setWeeklyActivitiesCount] = useState(0);
  const [recentActivities, setRecentActivities] = useState([]);
  const [clients, setClients] = useState(0);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [isStatsError, setIsStatsError] = useState(false);
  const [isLoadingActivities, setIsLoadingActivities] = useState(false);
  const [isActivitiesError, setIsActivitiesError] = useState(false);

  const fetchTotalCoaches = async () => {
    try {
      setIsLoadingStats(true);
      const response = await fetch("/api/clinic/dashboard/totalCoaches");
      const data = await response.json();
      if (data.status) {
        toast.success("Fetched successfully");
        setTotalCoaches(data.coaches);
      } else {
        setIsStatsError(true);
        toast.error(data.message);
      }
      setIsLoadingStats(false);
    } catch (error) {
      setIsStatsError(true);
      toast.error("Unable to get data");
    }
  };

  const fetchweeklyActivitiesCount = async () => {
    try {
      setIsLoadingStats(true);
      const response = await fetch("/api/clinic/dashboard/weeklyActivities");
      const data = await response.json();
      if (data.status) {
        toast.success("Fetched successfully");
        setWeeklyActivitiesCount(data.numActivity);
      } else {
        setIsActivitiesError(true);
        toast.error(data.message);
      }
      setIsLoadingStats(false);
    } catch (error) {
      setIsActivitiesError(true);
      toast.error("Unable to get data");
    }
  };

  const fetchrecentActivities = async () => {
    try {
      setIsLoadingActivities(true);
      const response = await fetch("/api/clinic/dashboard/recentActivities");
      const data = await response.json();
      if (data.status) {
        toast.success("Fetched successfully");
        setRecentActivities(data.recentActivity);
      } else {
        setIsActivitiesError(true);
        toast.error(data.message);
      }
      setIsLoadingActivities(false);
    } catch (error) {
      setIsActivitiesError(true);
      toast.error("Unable to get data");
    }
  };

  const fetchClientsNum = async () => {
    try {
      setIsLoadingStats(true);
      const response = await fetch("/api/clinic/clientNum");
      const data = await response.json();
      setClients(data.clients);
    } catch (error) {
      setIsStatsError(true);
      toast.error("Failed to fetch clients");
      console.log(error);
    }
    setIsLoadingStats(false);
  };

  useEffect(() => {
    setIsLoadingStats(true);
    fetchTotalCoaches();
    fetchClientsNum();
    setIsLoadingStats(false);
    setIsLoadingActivities(true);
    fetchweeklyActivitiesCount();
    fetchrecentActivities();
    setIsLoadingActivities(false);
  }, []);

  const handleRefresh = () => {
    fetchClientsNum();
    fetchTotalCoaches();
    fetchweeklyActivitiesCount();
    fetchrecentActivities();
  };

  const dashboardStats = {
    totalCoachCount: totalCoaches,
    weeklyActivitiesCount: weeklyActivitiesCount,
    clinicsSummary: [
      {
        name: user?.name,
        coaches: totalCoaches,
        clients: clients,
        isActive: true
      },
    ],
  };

  ///////////////////////////////////////////
  const isClinicAdmin = true;
  const dashboardTitle = "Clinic Dashboard";

  return (
    <div className="px-2 sm:px-4 md:px-6 py-4 w-full max-w-5xl mx-auto">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{dashboardTitle}</h1>
          <p className="text-gray-500">
            Welcome back, {user?.name || "Admin User"}!
          </p>
        </div>
        <Button
          variant="outline"
          className="flex items-center gap-1"
          onClick={handleRefresh}
          disabled={isLoadingStats}
        >
          <RefreshCw
            size={16}
            className={isLoadingStats ? "animate-spin" : ""}
          />
          <span>Refresh</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <DashboardStats
        stats={dashboardStats}
        isLoading={isLoadingStats}
        isClinicAdmin={isClinicAdmin}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 gap-y-4 mt-4 w-full">
        <div className="lg:col-span-2 overflow-x-auto">
          <ClinicsTable
            dashboardStats={dashboardStats}
            isLoading={isLoadingStats}
            isError={isStatsError}
            isClinicAdmin={isClinicAdmin}
          />
        </div>

        <div className="w-full">
          <ActivityList
            activities={recentActivities}
            isLoading={isLoadingActivities}
            isError={isActivitiesError}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
