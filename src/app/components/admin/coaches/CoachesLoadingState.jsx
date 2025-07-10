import React from "react";
import { RefreshCw } from "lucide-react";

const CoachesLoadingState = ({ retryCount = 0 }) => {
  return (
    <div className="flex justify-center py-8 px-2">
      <div className="text-center w-full">
        <RefreshCw size={24} className="animate-spin mx-auto mb-2" />
        <p className="text-gray-600">Loading coaches...</p>
        <p className="text-xs text-gray-400 mt-1">
          {retryCount > 0 ? `Attempt ${retryCount + 1}` : ""}
        </p>
      </div>
    </div>
  );
};

export default CoachesLoadingState;
