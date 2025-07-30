"use client"
import { Button } from "../../components/ui/button";
import { RefreshCw } from "lucide-react";
import DashboardStats from "../../components/admin/dashboard/DashboardStats";
import ClinicsTable from "../../components/admin/dashboard/ClinicsTable";
import ActivityList from "../../components/admin/dashboard/ActivityList";
import { useAuth } from "@/app/context/AuthContext";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const AdminDashboard = () => {
  const {user} = useAuth();
  const [totalClinics, setTotalClinics] = useState(0);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [isStatsError, setIsStatsError] = useState(false);
  const [isActivitiesError, setIsActivitiesError] = useState(false);
  const [totalCoaches, setTotalCoaches] = useState(0);
  const [weeklyActivitiesCount, setWeeklyActivitiesCount] = useState(0);
  const [recentActivities, setRecentActivities] = useState([]);
  const [clinicsSummary, setClinicsSummary] = useState([]);
  const [isLoadingActivities, setIsLoadingActivities] = useState(false);
  const [timeRange, setTimeRange] = useState("week");


  const fetchTotalClinics = async () => {
    try { 
      setIsLoadingStats(true);
      const response = await fetch("/api/admin/dashboard/totalClinics");
      const data = await response.json();
      if (data.status) {
        toast.success("Fetched successfully");
        setTotalClinics(data.clinics);
      } else {
        setIsStatsError(true);
        toast.error(data.message);
      } 
      setIsLoadingStats(false);
    } catch (error) {
      setIsStatsError(true);
      toast.error("Unable to get data");
    }
    setIsLoadingStats(false);
  }

  const fetchTotalCoaches = async () => {
    try {
      setIsLoadingStats(true);
      const response = await fetch("/api/admin/dashboard/totalCoaches");
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
      const response = await fetch("/api/admin/dashboard/weeklyActivities");
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
  const fetchrecentActivities = async (range = timeRange) => {
    try {
      setIsLoadingActivities(true);
      const response = await fetch("/api/admin/dashboard/recentActivities", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ timeRange: range }),
      });
      const data = await response.json();
      if (data.status) {
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

  const fetchClinics = async () => {
    try {
      setIsLoadingStats(true);
      const response = await fetch("/api/admin/clinic");
      const data = await response.json();
      setClinicsSummary(data.clinics);
      setIsLoadingStats(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch clinics");
    }
  };
  useEffect(() => {
    fetchClinics();
    fetchTotalClinics();
    fetchTotalCoaches();
    fetchweeklyActivitiesCount();
    fetchrecentActivities(timeRange);
  }, [timeRange]);
  
  const handleRefresh = () => {
    fetchClinics();
    fetchTotalClinics();
    fetchTotalCoaches();
    fetchweeklyActivitiesCount();
    fetchrecentActivities(timeRange);
  };
  const dashboardStats = {
    activeClinicCount: totalClinics || 0,
    totalCoachCount: totalCoaches || 0,
    weeklyActivitiesCount: weeklyActivitiesCount || 0,
    clinicsSummary: clinicsSummary || [],
  };

  const isClinicAdmin = false;
  return (
    <div className="px-2 sm:px-4 md:px-6">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500">
            Welcome back, {user?.name || "Admin User"}!
          </p>
        </div>
        <Button
            variant="outline"
            size="icon"
            className="flex items-center justify-center"
            title="Refresh clients"
            onClick={handleRefresh}
            disabled={isLoadingStats}
          >
            <RefreshCw size={16} className={isLoadingStats ? "animate-spin" : ""} />

        </Button>
      </div>

      {/* Stats Cards */}
      <DashboardStats
        stats={dashboardStats}
        isLoading={isLoadingStats}
        isClinicAdmin={isClinicAdmin}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
        <div className="lg:col-span-2 overflow-x-auto">
          <ClinicsTable
            dashboardStats={dashboardStats}
            isLoading={isLoadingStats}
            isError={isStatsError}
            isClinicAdmin={isClinicAdmin}
          />
        </div>

        <div>
          <ActivityList
            activities={recentActivities}
            isLoading={isLoadingActivities}
            isError={isActivitiesError}
            timeRange={timeRange}
            setTimeRange={setTimeRange}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
