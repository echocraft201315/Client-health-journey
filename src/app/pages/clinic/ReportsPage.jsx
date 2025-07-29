"use client";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Banknote, Activity, TrendingUp, Users, Calendar } from "lucide-react";
import { Skeleton } from "../../components/ui/skeleton";
import { useAuth } from "@/app/context/AuthContext";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import CoachReport from "@/app/components/coaches/CoachReport"

const ReportsPage = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [totalClients, setTotalClients] = useState(0);
  const [revenueData, setRevenueData] = useState([]);
  const [subscriptionData, setSubscriptionData] = useState([]);
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [currentCoach, setCurrentCoach] = useState("");
  const [coaches, setCoaches] = useState([]);
  const [checkInData, setCheckInData] = useState([]);
  const [checkInLoading, setCheckInLoading] = useState(false);
  const [timeRange, setTimeRange] = useState("week"); // Add timeRange state

  const fetchRevenueData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/clinic/report/revenue");
      const data = await response.json();
      setRevenueData(data.revenueData);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch revenueData");
    }
  };

  const fetchsubscriptionData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/clinic/report/subscription");
      const data = await response.json();
      setSubscriptionData(data.subscriptionData);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch subscriptionData");
    }
  };

  const fetchTotalClients = async () => {
    try {
      const response = await fetch("/api/clinic/client");
      const data = await response.json();
      setTotalClients(data.clients.length);
      setClients(data.clients);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCoaches = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/clinic/coach");
      const data = await response.json();
      if (data.coaches) {
        setCoaches(data.coaches);
      } else {
        toast.error("Failed to fetch coaches");
      }
    } catch (error) {
      toast.error("Failed to fetch coaches");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchClientsByCoach = async (coachId) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/clinic/client/bycoachId", {
        method: "POST",
        body: JSON.stringify({ coachId }),
      });
      const data = await response.json();
      setClients(data.clients);
    } catch (error) {
      toast.error("Failed to fetch clients");
      console.log(error);
    }
    setIsLoading(false);
  };
  
  const handlechange = (e) => {
    setCurrentCoach(e);
    setCheckInData([]);
  };

  useEffect(() => {
    fetchRevenueData();
    fetchsubscriptionData();
    fetchTotalClients();
    fetchCoaches();
  }, []);


  useEffect(() => {
    fetchClientsByCoach(currentCoach);
    setSelectedClient("");
  }, [currentCoach]);

  useEffect(() => {
    const fetchCheckInsbyClient = async () => {
      try {
        setCheckInLoading(true);
        const response = await fetch("/api/client/progress/byClientId", {
          method: "POST",
          body: JSON.stringify({ clientId: selectedClient, current: new Date(), timeRange }),
        });
        const data = await response.json();
        if (data.status) {
          setCheckInData(data.progress);
        }
        setCheckInLoading(false);
      } catch (error) {
        setCheckInLoading(false);
        console.log(error);
      }
    };
    if (selectedClient) {
      fetchCheckInsbyClient();
    }
  }, [selectedClient, timeRange]); // Add timeRange to dependencies

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64 mb-4" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <Skeleton className="h-80 w-full" />
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  const dashboardTitle = "Clinic Reports";
  const dashboardDescription = "Overview of your clinic performance";

  return (
    <div className="px-2 sm:px-4 md:px-6 py-4 w-full max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{dashboardTitle}</h1>
        <p className="text-gray-500">{dashboardDescription}</p>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              Your Subscription
            </CardTitle>
            <Activity className="h-4 w-4 text-primary-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {subscriptionData[0]?.plan || "N/A"}
            </div>
            <p className="text-xs text-green-500">Active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-primary-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClients}</div>
            {/* <p className="text-xs text-green-500">+1 from last month</p> */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Subscription Price</CardTitle>
            <Banknote className="h-4 w-4 text-primary-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {subscriptionData[0]?.price ? `$${subscriptionData[0]?.price}/month` : "N/A"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              Subscription Start Date
            </CardTitle>
            <Calendar className="h-4 w-4 text-primary-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Date(subscriptionData[0]?.startDate).toLocaleDateString() || "N/A"}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6 overflow-x-auto">
        <CardHeader className="space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 md:gap-4">
            <CardTitle className="text-xl">Client Progress</CardTitle>
            <div className="flex flex-col w-full sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
            <Select
          name="userList"
          value={currentCoach}
          onValueChange={handlechange}
          disabled={isLoading}
        >
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Select a coach" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={user?.id}>{user?.name}</SelectItem>
            {coaches?.map((coach, index) => (
              <SelectItem value={coach.id} key={index}>
                {coach.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={selectedClient}
          onValueChange={(value) => setSelectedClient(value)}
          defaultValue={selectedClient}
          disabled={isLoading === true}
        >
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Select a client" />
          </SelectTrigger>
          <SelectContent>
            {clients?.map((client) => (
              <SelectItem key={client.id} value={client.id}>
                {client.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Time Range Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setTimeRange("week")}
            className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
              timeRange === "week"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setTimeRange("month")}
            className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
              timeRange === "month"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Month
          </button>
        </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          
        </CardContent>
      </Card>
      <div>
          {selectedClient?
          (<CoachReport checkIns={checkInData} loading={checkInLoading} timeRange={timeRange}/>

          ):(
              ""
          )  
          }          </div>

    </div>
  );
};

export default ReportsPage;
