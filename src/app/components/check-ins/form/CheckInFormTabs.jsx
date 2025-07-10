import React from "react";
import { TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { Weight, Activity, Apple, BookOpen } from "lucide-react";

const CheckInFormTabs = ({ currentTab, onTabChange }) => {
  return (
    <TabsList className="grid grid-cols-2 sm:grid-cols-4 w-full mb-8 gap-1 mb-4">
      <TabsTrigger
        value="measurements"
        className="flex flex-col items-center justify-center px-0 py-2 text-[12px] sm:text-sm"
        onClick={() => onTabChange("measurements")}
        data-state={currentTab === "measurements" ? "active" : ""}
      >
        <Weight size={16} />
        <span className="mt-1">Measurements</span>
      </TabsTrigger>

      <TabsTrigger
        value="wellness"
        className="flex flex-col items-center justify-center px-0 py-2 text-[12px] sm:text-sm"
        onClick={() => onTabChange("wellness")}
        data-state={currentTab === "wellness" ? "active" : ""}
      >
        <Activity size={16} />
        <span className="mt-1">Wellness</span>
      </TabsTrigger>

      <TabsTrigger
        value="nutrition"
        className="flex flex-col items-center justify-center px-0 py-2 text-[12px] sm:text-sm"
        onClick={() => onTabChange("nutrition")}
        data-state={currentTab === "nutrition" ? "active" : ""}
      >
        <Apple size={16} />
        <span className="mt-1">Nutrition</span>
      </TabsTrigger>

      <TabsTrigger
        value="supplements"
        className="flex flex-col items-center justify-center px-0 py-2 text-[12px] sm:text-sm"
        onClick={() => onTabChange("supplements")}
        data-state={currentTab === "supplements" ? "active" : ""}
      >
        <BookOpen size={16} />
        <span className="mt-1">Supplements</span>
      </TabsTrigger>
    </TabsList>
  );
};

export default CheckInFormTabs;
