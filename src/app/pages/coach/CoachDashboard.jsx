"use client";
import React from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useState, useEffect } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Separator } from "../../components/ui/separator";
import { Skeleton } from "../../components/ui/skeleton";
import { UserPlus, Calendar, BookOpen, Flag } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const CoachDashboard = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [activeClients, setActiveClients] = useState(0);
  const [statsLoading, setStatsLoading] = useState(true);
  const [activitiesLoading, setActivitiesLoading] = useState(true);
  const [pendingCheckIns, setPendingCheckIns] = useState(0);
  const [activePrograms, setActivePrograms] = useState(0);
  const [completedProgram, setCompletedProgram] = useState(0);
  const [activities, setActivities] = useState([]);
  const fetchActiveClients = async () => {
    try {
      const response = await fetch("/api/coach/reports/activeClients");
      const data = await response.json();
      if (data.status) {
        toast.success("Fetched successfully");
        setActiveClients(data.activeClients);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Unable to get data");
    }
  };

  // Find clients with no check-ins or last check-in older than 7 days
  const fetchPendingCheckIn = async () => {
    try {
      const response = await fetch("/api/coach/dashboard/pendingcheckIn");
      const data = await response.json();
      if (data.status) {
        toast.success("Fetched successfully");
        setPendingCheckIns(data.pendingCheckIns);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Unable to get data");
    }
  };

  const fetchPrograms = async () => {
    try {
      const response = await fetch("/api/coach/reports/programs");
      const data = await response.json();
      if (data.status) {
        toast.success("Fetched successfully");
        setActivePrograms(data.numprograms);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Unable to get data");
    }
  };

  const fetchCompletedProgram = async () => {
    try {
      const response = await fetch("/api/coach/dashboard/completedProgram");
      const data = await response.json();
      if (data.status) {
        toast.success("Fetched successfully");
        setCompletedProgram(data.completedProgram);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Unable to get data");
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const response = await fetch("/api/coach/dashboard/recentActivity");
      const data = await response.json();
      if (data.status) {
        toast.success("Fetched successfully");
        setActivities(data.activities);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Unable to get data");
    }
  };

  useEffect(() => {
    setStatsLoading(true);
    fetchActiveClients();
    fetchPendingCheckIn();
    fetchPrograms();
    fetchCompletedProgram();
    setStatsLoading(false);
    setActivitiesLoading(true);
    fetchRecentActivity();
    setActivitiesLoading(false);
  }, []);

  return (
    <div className="px-2 sm:px-4 md:px-6 py-4 w-full max-w-6xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Welcome, {user?.name || "Coach"}
        </h2>
        <p className="text-muted-foreground">
          Here's what's happening with your clients today.
        </p>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <Card
          className="hover:shadow-md transition-shadow cursor-pointer hover:bg-gray-50"
          onClick={() => router.push("/coach/clients")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Clients
            </CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-7 w-20" />
            ) : (
              <div className="text-2xl font-bold">{activeClients || 0}</div>
            )}
          </CardContent>
        </Card>

        <Card
          className="hover:shadow-md transition-shadow cursor-pointer hover:bg-gray-50"
          onClick={() => router.push("/coach/check-ins")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Check-ins
            </CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-7 w-20" />
            ) : (
              <div className="text-2xl font-bold">
                {pendingCheckIns.length || 0}
              </div>
            )}
          </CardContent>
        </Card>

        <Card
          className="hover:shadow-md transition-shadow cursor-pointer hover:bg-gray-50"
          onClick={() => router.push("/coach/reports")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Programs
            </CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-7 w-20" />
            ) : (
              <div className="text-2xl font-bold">{activePrograms || 0}</div>
            )}
          </CardContent>
        </Card>

        <Card
          className="hover:shadow-md transition-shadow cursor-pointer hover:bg-gray-50"
          onClick={() => router.push("/coach/reports")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completed Programs
            </CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-7 w-20" />
            ) : (
              <div className="text-2xl font-bold">{completedProgram || 0}</div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your clients' recent actions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {activitiesLoading ? (
              <>
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
              </>
            ) : activities && activities.length > 0 ? (
              activities.map((activity, i) => (
                <div key={i}>
                  <div className="flex items-center">
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {activity.description}
                      </p>
                    </div>
                    <div className="ml-auto text-xs text-muted-foreground">
                      {new Date(activity.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                  {i < activities.length - 1 && <Separator className="my-2" />}
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No recent activities
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Actions</CardTitle>
            <CardDescription>
              Quick actions for managing your clients
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => router.push("/coach/clients")}
                // disabled={actionLoading}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Add Client
              </button>
              <button
                onClick={() => router.push("/coach/check-ins")}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground shadow hover:bg-secondary/90 disabled:pointer-events-none disabled:opacity-50"
              >
                <Calendar className="mr-2 h-4 w-4" />
                View Check-ins
              </button>
              <button
                onClick={() => router.push("/coach/resources")}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground shadow hover:bg-secondary/90 disabled:pointer-events-none disabled:opacity-50"
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Resources
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CoachDashboard;
