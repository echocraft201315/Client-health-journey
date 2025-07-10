"use client";
import React from "react";
import { Badge } from "../../components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import Link from "next/link";
import { Skeleton } from "../../components/ui/skeleton";
import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";

const RecentCheckIns = ({ limit = 5 }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, isError] = useState(false);
  const [checkIns, setCheckIns] = useState([]);
  const {user} = useAuth();
  let apiRole = "";
  if (user?.role === "clinic_admin") {
    apiRole = "clinic";
  }
  if (user?.role === "admin") {
    apiRole = "admin";
  }
  const fetchCheckIns = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/${apiRole}/checkIns`);
      const data = await response.json();
      setCheckIns(data.checkIns);
      setIsLoading(false);
      isError(false);
    } catch (error) {
      console.log(error);
      isError(true);
    }
  };
  useEffect(() => {
    fetchCheckIns();
  }, []);


  const getMoodBadge = (mood) => {
    if (mood === null) return <Badge variant="outline">No mood</Badge>;

    switch (mood) {
      case 5:
        return (
          <Badge
            className="bg-cyan-100-100 text-cyan-800 hover:bg-green-200"
            variant="outline"
          >
            Great
          </Badge>
        );
      case 4:
        return (
          <Badge
            className="bg-blue-100 text-blue-800 hover:bg-blue-200"
            variant="outline"
          >
            Good
          </Badge>
        );
      case 3:
        return (
          <Badge
            className="bg-amber-100 text-amber-800 hover:bg-gray-200"
            variant="outline"
          >
            Average
          </Badge>
        );
      case 2:
        return (
          <Badge
            className="bg-pink-100 text-pink-800 hover:bg-gray-200"
            variant="outline"
          >
            Average
          </Badge>
        );
      case 1:
        return (
          <Badge
            className="bg-red-100 text-red-800 hover:bg-red-200"
            variant="outline"
          >
            Poor
          </Badge>
        );
      default:
        return <Badge variant="outline">very poor</Badge>;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return `Today, ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      const diffDays = Math.floor(
        (today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
      );
      return `${diffDays} days ago`;
    }
  };

  const formatWeight = (weight, previousWeight) => {
    if (weight === null) return "No weight";
    if (previousWeight === null || previousWeight === undefined)
      return `${weight} lbs`;

    const diff = weight - previousWeight;
    if (diff === 0) return "No change";
    return diff > 0
      ? `Gained ${Math.abs(diff).toFixed(1)} lbs`
      : `Lost ${Math.abs(diff).toFixed(1)} lbs`;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: limit }).map((_, i) => (
          <div key={i} className="flex items-start space-x-3 p-3 rounded-md">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4 text-red-500">
        Failed to load check-ins. Please try again later.
      </div>
    );
  }

  if (checkIns.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        No recent check-ins found.
      </div>
    );
  }
  return (
    <div className="space-y-4 px-2">
      {checkIns.map((checkIn) => (
        <Link
          key={checkIn.id}
          href={`/check-in/${checkIn.id}`}
          className="block"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 p-3 rounded-md hover:bg-gray-50 transition-colors">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${checkIn.name}`}
                alt={checkIn.name}
              />
              <AvatarFallback>{checkIn.name.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                <h4 className="font-medium text-sm">{checkIn.name}</h4>
                <span className="text-xs text-gray-500">
                  {formatDate(checkIn.selectedDate)}
                </span>
              </div>
              <div className="mt-1 text-xs text-gray-500">
                {formatWeight(checkIn.weight)}
              </div>
              <div className="mt-2">{getMoodBadge(Math.floor(checkIn.moodLevel[0]/2))}</div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default RecentCheckIns;
