"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import RecentCheckIns from "../../components/check-ins/RecentCheckIns";
import CoachCheckIns from "../../components/check-ins/CoachCheckIns";
import { useAuth } from "@/app/context/AuthContext";

const CheckInsPage = () => {
  const { user } = useAuth();
  const isCoach = user?.role === "coach";
  return (
    <div className="px-2 sm:px-4 md:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Progress Tracking</h1>
        <p className="text-gray-500">
          Track health and fitness metrics over time
        </p>
      </div>

      <Card className="overflow-x-auto">
        <CardContent>
          {isCoach ? <CoachCheckIns /> : <RecentCheckIns />}
        </CardContent>
      </Card>
    </div>
  );
};

export default CheckInsPage;
