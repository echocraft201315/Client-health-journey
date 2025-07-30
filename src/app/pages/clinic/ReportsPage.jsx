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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
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
{/* 
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
        </Card> */}

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
      {selectedClient ? (
            checkInLoading ? (
              <div className="text-center py-12">
                <div className="max-w-sm mx-auto">
                  <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center animate-pulse">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Loading Client Data</h3>
                  <p className="text-sm text-gray-600">Fetching progress information...</p>
                </div>
              </div>
            ) : checkInData && checkInData.progressData && checkInData.progressData.length > 0 ? (
              <CoachReport 
                checkIns={checkInData} 
                loading={checkInLoading} 
                selectedClient={selectedClient}
                timeRange={timeRange}
              />
            ) : (
              <div className="text-center py-12">
                <div className="max-w-md mx-auto">
                  <div className="mb-6">
                    <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
                      <svg 
                        className="w-8 h-8 text-yellow-600" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No Check-in Data in this {timeRange}!
                    </h3>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">What to expect:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Daily meal tracking and nutrition data</li>
                      <li>• Weight progress and trends</li>
                      <li>• AI-powered meal recommendations</li>
                      <li>• Micronutrient analysis</li>
                      <li>• Progress photos and selfies</li>
                    </ul>
                  </div>
                  
                  {/* <div className="mt-6">
                    <button 
                      onClick={() => {
                        // You can add navigation to client management or messaging here
                        toast.info("Consider reaching out to encourage the client to start their daily check-ins");
                      }}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      Send Reminder
                    </button>
                  </div> */}
                </div>
              </div>
            )
          ) : (
            <div className="text-center py-8 text-gray-500">
              <div className="max-w-sm mx-auto">
                <div className="w-12 h-12 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-2">Select a Client</h3>
                <p className="text-sm">Choose a client from the dropdown above to view their progress report</p>
              </div>
            </div>
          )}         </div>

    </div>
  );
};

export default ReportsPage;
