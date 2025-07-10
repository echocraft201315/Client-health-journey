import React from "react";
import { Search } from "lucide-react";
import { Input } from "../../../components/ui/input";

const CoachesFilter = ({ filterText, setFilterText, count }) => {
  return (
    <div className="flex flex-col gap-2 mb-4 w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 w-full">
        <div className="relative w-full md:w-96">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={16}
          />
          <Input
            placeholder="Search coaches by name or email..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="pl-10"
          />
        </div>
        <span className="text-sm text-muted-foreground ml-0 md:ml-2 mt-2 md:mt-0">
          {count} {count === 1 ? "coach" : "coaches"} found
        </span>
      </div>
    </div>
  );
};

export default CoachesFilter;
