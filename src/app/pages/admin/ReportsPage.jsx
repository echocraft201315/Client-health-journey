"use client";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Banknote, Activity, TrendingUp, Users } from "lucide-react";
import { Skeleton } from "../../components/ui/skeleton";
import { useAuth } from "@/app/context/AuthContext";
import { toast } from "sonner";

const ReportsPage = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalClients, setTotalClients] = useState(0);
  const [subscriptionData, setSubscriptionData] = useState([]);
  const [subscriptionHistory, setSubscriptionHistory] = useState([]);
  const [revenueData, setRevenueData] = useState([]);

  // Calculate revenue (assuming $100 per check-in)
  const fetchRevenueData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/admin/report/revenue");
      const data = await response.json();
      setSubscriptionHistory(data.subscriptionHistory);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch revenueData");
    }
  };

  const fetchsubscriptionData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/admin/report/subscription");
      const data = await response.json();
      setSubscriptionData(data.subscriptionData);
      const totalClients = data.subscriptionData.reduce((acc, curr) => acc + curr.clients, 0);
      setRevenueData(revenueData);
      setTotalClients(totalClients);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch subscriptionData");
    }
  };
  //totalcheckIn*100
  const fetchTotalRevenue = async () => {
    try {
      const response = await fetch("/api/admin/report/totalRevenue");
      const data = await response.json();
      setSubscriptionHistory(data.subscriptionHistory);
      const totalRevenue = data.subscriptionHistory.reduce((acc, curr) => acc + curr.paymentAmount, 0);
      const revenueData = [];
      for (let i = 0; i < data.subscriptionHistory.length; i++) {
        const month = data.subscriptionHistory[i].createdAt.getMonth();
        const revenue = data.subscriptionHistory[i].paymentAmount;
        if (revenueData.find(item => item.month === month)) {
          revenueData.find(item => item.month === month).revenue += revenue;
        } else {
          revenueData.push({
            month: month,
            revenue: revenue
          });
        }
      }
      setTotalRevenue(totalRevenue);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTotalClients = async () => {
    try {
      const response = await fetch("/api/admin/clientNum");
      const data = await response.json(nts);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchRevenueData();
    fetchsubscriptionData();
    fetchTotalRevenue();
    fetchTotalClients();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6 px-2 sm:px-4 md:px-6">
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

  const dashboardTitle = "Clinic Financial Reports";
  const dashboardDescription = "Overview of your clinic performance";

  return (
    <div className="px-2 sm:px-4 md:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{dashboardTitle}</h1>
        <p className="text-gray-500">{dashboardDescription}</p>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <Banknote className="h-4 w-4 text-primary-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${
                totalRevenue
              }
            </div>
            {/* <p className="text-xs text-green-500">+8% from last month</p> */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              Total Clinics
            </CardTitle>
            <Activity className="h-4 w-4 text-primary-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {subscriptionData?.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              Monthly Revenue
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-primary-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {`$${Math.round(totalRevenue / (revenueData.length ?? 1)).toLocaleString()}/mo`}
            </div>
            {/* <p className="text-xs text-green-500">+5% from last month</p> */}
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
      </div>

      {/* Revenue Chart */}
      <Card className="mb-6 overflow-x-auto">
        <CardHeader>
          <CardTitle className="text-[24px]">
            Your System Monthly Revenue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={subscriptionHistory}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="revenue"
                  name="Revenue ($)"
                  fill="#8884d8"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Subscriptions Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[24px]">Your Subscription</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Clinic</th>
                  <th className="text-left py-3 px-4 font-medium">Plan</th>
                  <th className="text-left py-3 px-4 font-medium">Price</th>
                  <th className="text-left py-3 px-4 font-medium">Since</th>
                  <th className="text-left py-3 px-4 font-medium">Clients</th>
                </tr>
              </thead>
              <tbody>
                {subscriptionData?.map((sub) => (
                  <tr key={sub.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{sub.name}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-primary-50 text-primary-700 rounded-full text-xs">
                        {sub.plan}
                      </span>
                    </td>
                    <td className="py-3 px-4">{sub.price ? `$${sub.price}/month` : "N/A"}</td>
                    <td className="py-3 px-4">{new Date(sub.startDate).toLocaleDateString()}</td>
                    <td className="py-3 px-4">{sub.clients}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsPage;
