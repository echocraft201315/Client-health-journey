import { useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const ProgressChart = ({ progressData }) => {
  // Define colors for different lines
  const lineColors = {
    weight: "#1eaedb",
    waist: "#2ecc71",
    energyLevel: "#e74c3c",
    moodLevel: "#f1c40f",
    sleepHours: "#9b59b6"
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={progressData}
        margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="#f0f0f0"
        />
        <XAxis
          dataKey="exerciseType"
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          domain={["dataMin - 5", "dataMax + 5"]}
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip
          contentStyle={{
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
            border: "none",
          }}
        />
        <Legend />
        
        {/* Weight Line */}
        <Line
          type="monotone"
          dataKey="weight"
          name="Weight"
          stroke={lineColors.weight}
          strokeWidth={2}
          activeDot={{ r: 6, fill: lineColors.weight, stroke: "#fff", strokeWidth: 2 }}
          dot={{ r: 4, fill: lineColors.weight, stroke: "#fff", strokeWidth: 2 }}
        />
        
        {/* Reps Line */}
        <Line
          type="monotone"
          dataKey="waist"
          name="Waist"
          stroke={lineColors.waist}
          strokeWidth={2}
          activeDot={{ r: 6, fill: lineColors.waist, stroke: "#fff", strokeWidth: 2 }}
          dot={{ r: 4, fill: lineColors.waist, stroke: "#fff", strokeWidth: 2 }}
        />
        
        {/* Sets Line */}
        <Line
          type="monotone"
          dataKey="energyLevel"
          name="Energy Level"
          stroke={lineColors.energyLevel}
          strokeWidth={2}
          activeDot={{ r: 6, fill: lineColors.energyLevel, stroke: "#fff", strokeWidth: 2 }}
          dot={{ r: 4, fill: lineColors.energyLevel, stroke: "#fff", strokeWidth: 2 }}
        />
        
        {/* Duration Line */}
        <Line
          type="monotone"
          dataKey="moodLevel"
          name="Mood Level"
          stroke={lineColors.moodLevel}
          strokeWidth={2}
          activeDot={{ r: 6, fill: lineColors.moodLevel, stroke: "#fff", strokeWidth: 2 }}
          dot={{ r: 4, fill: lineColors.moodLevel, stroke: "#fff", strokeWidth: 2 }}
        />
        
        {/* Intensity Line */}
        <Line
          type="monotone"
          dataKey="sleepHours"
          name="Sleep Hours"
          stroke={lineColors.sleepHours}
          strokeWidth={2}
          activeDot={{ r: 6, fill: lineColors.sleepHours, stroke: "#fff", strokeWidth: 2 }}
          dot={{ r: 4, fill: lineColors.sleepHours, stroke: "#fff", strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ProgressChart;
