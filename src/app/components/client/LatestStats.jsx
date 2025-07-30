"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Progress } from "../../components/ui/progress";
import {
  ArrowUp,
  ArrowDown,
  BarChart2,
  Scale,
  Droplets,
  Moon,
} from "lucide-react";
import { Separator } from "../../components/ui/separator";
import { useAuth } from "@/app/context/AuthContext";
import { useState, useEffect } from "react";
const LatestStats = () => {
  const [checkIns, setCheckIns] = useState([]);
  const { user } = useAuth();

  const fetchLatestStatus = async () => {
    try {
      const response = await fetch("/api/client/progress");
      const data = await response.json();
      setCheckIns(data.progress);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchLatestStatus();
  }, [user]);
  console.log(checkIns);
  const weightTrend = "down";
  const waterProgress = 12;
  return (
    <Card className="w-full max-w-full">
      <CardHeader className="pb-2 px-4 sm:px-4">
        <CardTitle className="text-base sm:text-lg flex items-center gap-2">
          <BarChart2 className="h-4 w-4" />
          Latest Stats
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 px-4 sm:px-4">
        {checkIns?.length>0 ? (
          <>
            {checkIns[0].weight && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 sm:gap-2">
                <div className="flex items-center gap-2">
                  <Scale className="h-4 w-4 text-gray-500" />
                  <span className="text-xs sm:text-sm text-gray-600">Weight</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm sm:text-base">{checkIns[0].weight} lbs</span>
                  {weightTrend === "down" && (
                    <ArrowDown className="h-4 w-4 text-green-500" />
                  )}
                  {weightTrend === "up" && (
                    <ArrowUp className="h-4 w-4 text-red-500" />
                  )}
                </div>
              </div>
            )}

            {checkIns[0].sleepHours && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 sm:gap-2">
                <div className="flex items-center gap-2">
                  <Moon className="h-4 w-4 text-gray-500" />
                  <span className="text-xs sm:text-sm text-gray-600">Sleep</span>
                </div>
                <span className="font-medium text-sm sm:text-base">
                  {checkIns[0].sleepHours} hrs
                </span>
              </div>
            )}

            {checkIns[0].waterIntake && (
              <div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-1 gap-1 sm:gap-2">
                  <div className="flex items-center gap-2">
                    <Droplets className="h-4 w-4 text-gray-500" />
                    <span className="text-xs sm:text-sm text-gray-600">Water Intake</span>
                  </div>
                  <span className="text-xs sm:text-sm">
                    {checkIns[0].waterIntake} glasses
                  </span>
                </div>
                <Progress value={waterProgress} className="h-1" />
              </div>
            )}

            <Separator />

            <div className="pt-2">
              <span className="text-xs text-gray-500">
                Last updated:{" "}
                {(() => {
                  try {
                    return new Date(checkIns[0].selectedDate).toLocaleDateString();
                  } catch (error) {
                    return 'Recently';
                  }
                })()}
              </span>
            </div>
          </>
        ) : (
          <div className="text-xs sm:text-sm text-gray-500 py-2">
            No check-ins recorded yet. Start tracking your progress!
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LatestStats;
