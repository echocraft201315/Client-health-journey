"use client";
import React from "react";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../../components/ui/card";
import { Skeleton } from "../../../components/ui/skeleton";
import {
  AlertTriangle,
  Calendar,
  Building,
  Users,
  Activity,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";

const ActivityList = ({ activities, isLoading, isError, timeRange, setTimeRange }) => {
  // Helper function to determine which icon to show
  const getActivityIcon = (type) => {
    switch (type) {
      case "check_in":
        return <Calendar size={16} className="text-blue-500 mt-1" />;
      case "clinic_signup":
        return <Building size={16} className="text-green-500 mt-1" />;
      case "coach_added":
        return <Users size={16} className="text-amber-500 mt-1" />;
      case "client_added":
        return <Users size={16} className="text-cyan-500 mt-1" />;
      default:
        return <Activity size={16} className="text-gray-500 mt-1" />;
    }
  };
  return (
    <Card className="w-full h-[358px]">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 gap-2">
        <CardTitle className="text-lg">Recent Activities</CardTitle>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[100px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Week</SelectItem>
            <SelectItem value="month">Month</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="overflow-x-auto overflow-y-scroll">
        {isLoading ? (
          <div className="space-y-4">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="flex items-start space-x-3">
                  <Skeleton className="h-5 w-5 rounded-full mt-1" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              ))}
          </div>
        ) : isError ? (
          <div className="text-center py-4">
            <div className="inline-flex items-center text-red-500 mb-2">
              <AlertTriangle size={18} className="mr-2" />
              <span>Failed to load activities</span>
            </div>
            <div>
              <Button variant="outline" size="sm" className="ml-2">
                Try Again
              </Button>
            </div>
          </div>
        ) : !activities || activities.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            No activities found for the selected time range
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                {getActivityIcon(activity.type)}
                <div>
                  <p className="text-sm font-medium">
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(activity.timeStamp || activity.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityList;
