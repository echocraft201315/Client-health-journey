"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Activity,
  Calendar,
  Bell,
  Users,
  Building,
  RefreshCw,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Skeleton } from "../../components/ui/skeleton";
import { toast } from "sonner";
import { useState, useEffect } from "react";

const AdminActivitiesPage = () => {
  const [recentActivities, setRecentActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [isActivitiesError, setIsActivitiesError]= useState(false)
  const fetchrecentActivities = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/clinic/dashboard/recentActivities");
      const data = await response.json();
      if (data.status) {
        toast.success("Fetched successfully");
        setRecentActivities(data.recentActivity);
        
      } else {
        setIsActivitiesError(true);
        toast.error(data.message);
      }
      setIsLoading(false);
    } catch (error) {
      setError(true);
      setIsActivitiesError(true);
      toast.error("Unable to get data");
    }
  };
  useEffect(() => {
    fetchrecentActivities();
  }, []);

  const getActivityIcon = (type) => {
    switch (type) {
      case "check_in":
        return <Calendar size={16} className="text-blue-500" />;
      case "clinic_signup":
        return <Building size={16} className="text-green-500" />;
      case "coach_added":
        return <Users size={16} className="text-amber-500" />;
      case "message":
        return <Bell size={16} className="text-amber-500" />;
      default:
        return <Activity size={16} className="text-purple-500" />;
    }
  };

  const renderActivitySummary = () => {
    if (!recentActivities || recentActivities.length === 0) {
      console.log("ActivitiesPage: No activities available for summary");
      return (
        <Card>
          <CardHeader>
            <CardTitle>Activity Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="py-8 text-center text-gray-500">
              No activities found to summarize
            </div>
          </CardContent>
        </Card>
      );
    }

    // Count activities by type
    const checkIns = recentActivities.filter(
      (a) => a.type === "check_in"
    ).length;
    const clinics = recentActivities.filter(
      (a) => a.type === "clinic_signup"
    ).length;
    const coaches = recentActivities.filter(
      (a) => a.type === "coach_added"
    ).length;
    const others = recentActivities.filter(
      (a) =>
        a.type !== "check_in" &&
        a.type !== "clinic_signup" &&
        a.type !== "coach_added"
    ).length;

    // Calculate total activities
    const totalActivities = recentActivities.length;

    return (
      <Card>
        <CardHeader>
          <CardTitle>Activity Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {clinics > 0 && (
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-sm">New clinics this month</span>
                <span className="font-bold">{clinics}</span>
              </div>
            )}
            {coaches > 0 && (
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-sm">New coaches this month</span>
                <span className="font-bold">{coaches}</span>
              </div>
            )}
            {checkIns > 0 && (
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-sm">Check-ins this month</span>
                <span className="font-bold">{checkIns}</span>
              </div>
            )}
            {others > 0 && (
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-sm">Other activities</span>
                <span className="font-bold">{others}</span>
              </div>
            )}
            <div className="flex justify-between items-center pb-2 border-b">
              <span className="text-sm">Total activities</span>
              <span className="font-bold">{totalActivities}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Last updated</span>
              <span className="text-sm text-gray-500">just now</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="px-2 sm:px-4 md:px-6 py-4 w-full max-w-5xl mx-auto">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Activities</h1>
          <p className="text-gray-500">
            Recent platform activities across all clinics
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          disabled={isLoading}
          onClick={() => fetchrecentActivities()}
        >
          <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
          <span>Refresh</span>
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 gap-y-4 w-full">
        <div className="lg:col-span-2 overflow-x-auto">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-6">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="flex items-start space-x-3 pb-4 border-b last:border-0"
                    >
                      <Skeleton className="h-6 w-6 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="p-4 text-center">
                  <p className="text-red-500">Failed to load activities</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Try Again
                  </Button>
                </div>
              ) : recentActivities && recentActivities.length > 0 ? (
                <div className="space-y-6">
                  {recentActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start space-x-3 pb-4 border-b last:border-0"
                    >
                      <div className="mt-1">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {activity.description}
                        </p>
                        <p className="text-xs text-gray-500">
                          {activity.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No activities found.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="w-full">
          {renderActivitySummary()}
        </div>
      </div>
    </div>
  );
};

export default AdminActivitiesPage;
