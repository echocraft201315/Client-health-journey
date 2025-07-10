"use client";

import React, { useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

import { Skeleton } from "../../components/ui/skeleton";
import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import ProgressChart from "@/app/components/progress/ProgressChart";
import { Button } from "../../components/ui/button";
import { Calendar } from "../../components/ui/calendar";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { CalendarIcon } from "lucide-react";
import NutritionWeightTab from "./form/checkInProgressTabs/NutritionWeightTab";
import ExerciseTab from "./form/checkInProgressTabs/ExerciseTab";
import SleepTab from "./form/checkInProgressTabs/SleepTab";
import MoodTab from "./form/checkInProgressTabs/MoodTab";

const ClinicCheckIns = () => {
  const { user } = useAuth();
  const [clients, setClients] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [currentCoach, setCurrentCoach] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [selectedClient, setSelectedClient] = useState("");
  const [endDate, setEndDate] = useState(new Date());
  const [checkIns, setCheckIns] = useState([]);
  const [loading, setLoading] = useState(false);

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
    setCheckIns([]);
  };

  useEffect(() => {
    fetchCoaches();
  }, []);
  useEffect(() => {
    const fetchCoachCheckIns = async () => {
      setLoading(true);
      const response = await fetch("/api/coach/checkIn", {
        method: "POST",
        body: JSON.stringify({
          clientId: selectedClient,
          startDate,
          endDate,
        }),
      });
      const data = await response.json();
      if (data.status) {
        setCheckIns(data.result);
      } else {
        toast.error(data.message);
      }
      setLoading(false);
    };
    if (selectedClient && selectedTimeRange) {
      fetchCoachCheckIns();
    }
  }, [selectedClient, startDate, endDate]);

  useEffect(() => {
    fetchClientsByCoach(currentCoach);
    setSelectedClient("");
  }, [currentCoach]);
console.log("checkIn", checkIns)
  useEffect(() => {
    const now = new Date();

    switch (selectedTimeRange) {
      case "month":
        setStartDate(new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000));
        break;
      case "week":
        setStartDate(new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000));
        break;
      case "quarter":
        setStartDate(new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000));
        break;
      case "half":
        setStartDate(new Date(now.getTime() - 182 * 24 * 60 * 60 * 1000));
        break;
      default:
        setStartDate(new Date());
    }
    setEndDate(new Date());
  }, [selectedTimeRange]);

  const handlechange1 = (date) => {
    setStartDate(date);
  };
  const handlechange2 = (date) => {
    setEndDate(date);
  };
  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-6 py-4">
      <div className="flex flex-col md:flex-row flex-wrap gap-2 md:gap-4 items-start md:items-center mb-4">
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
        <Select
          defaultValue={selectedTimeRange}
          onValueChange={(value) => setSelectedTimeRange(value)}
        >
          <SelectTrigger className="w-full md:w-[150px]">
            <SelectValue placeholder="Time range" />
          </SelectTrigger>
          <SelectContent className="w-full md:w-[180px]">
            <SelectItem value="week">Last 7 days</SelectItem>
            <SelectItem value="month">Last 30 days</SelectItem>
            <SelectItem value="quarter">Last 3 months</SelectItem>
            <SelectItem value="half">Last 6 months</SelectItem>
            <SelectItem value="custom">Custom range</SelectItem>
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-2 w-full md:w-auto"
              disabled={selectedTimeRange !== "custom"}
            >
              <CalendarIcon className="h-4 w-4" />
              {startDate ? format(startDate, "MMMM d, yyyy") : ""}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={(date) => date && handlechange1(date)}
              initialFocus
              disabled={(date) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return date > today;
              }}
            />
          </PopoverContent>
        </Popover>
        <div className="text-[#6B7280]">to</div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-2 w-full md:w-auto"
              disabled={selectedTimeRange !== "custom"}
            >
              <CalendarIcon className="h-4 w-4" />
              {endDate ? format(endDate, "MMMM d, yyyy") : ""}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={(date) => date && handlechange2(date)}
              initialFocus
              disabled={(date) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const sevenDaysAgo = new Date();
                sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                sevenDaysAgo.setHours(0, 0, 0, 0);

                return date > today || date < startDate;
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
      {!isLoading ? (
        <Tabs defaultValue="Nutrition">
          <TabsList className="mt-6 mb-6 grid grid-cols-2 sm:grid-cols-4 w-full">
            <TabsTrigger value="Nutrition">
              Nutrition & Weight
            </TabsTrigger>
            <TabsTrigger value="Sleep">
              Sleep
            </TabsTrigger>
            <TabsTrigger value="Exercise">
              Exercise
            </TabsTrigger>
            <TabsTrigger value="Mood">
              Mood
            </TabsTrigger>
          </TabsList>
          {!loading && checkIns?.length != 0 ? (
            <>
              <TabsContent value="Nutrition">
                <NutritionWeightTab checkIns={checkIns} />
              </TabsContent>
              <TabsContent value="Sleep">
                <SleepTab checkIns={checkIns} />
              </TabsContent>
              <TabsContent value="Exercise">
                <ExerciseTab checkIns={checkIns} />
              </TabsContent>
              <TabsContent value="Mood">
                <MoodTab checkIns={checkIns} />
              </TabsContent>
            </>
          ) : (
            "No check-ins found"
          )}
        </Tabs>
      ) : (
        "Loading..."
      )}
    </div>
  );
};

export default ClinicCheckIns;
