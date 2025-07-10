"use client";
import { TrendingUp } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  LabelList,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { arrowRight, BalanceIcon, goalIcon } from "./Icon";
import MealHistoryComponent from "./MealHistoryComponent";

const NutritionWeightTab = ({ checkIns }) => {
  const weights = checkIns.checkIns?.map(d => d.weight) || [];
  const minWeight = Math.min(...weights);
  const maxWeight = Math.max(...weights);

  return (
    <div className="w-full max-w-3xl mx-auto px-2 sm:px-6 py-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-2xl font-semibold ml-0 sm:ml-[20px]">
            Weight Trends
          </CardTitle>
        </CardHeader>
        <div className="flex flex-col md:flex-row gap-4 md:gap-[16px] p-2 sm:p-[16px]">
          <div className="flex gap-2 items-center bg-[#F8FAFC] rounded-[18px] p-2 sm:p-[16px] w-full md:w-[33%]">
            <div className="items-center">
              <span className="w-[20px] h-[20px]">{BalanceIcon}</span>
            </div>
            <div>
              <div className="text-[#6B7280] text-xs sm:text-[14px]">Starting Weight</div>
              <div className="text-[#020817] font-bold text-base sm:text-[20px]">
                {checkIns?.weight?.initialWeight}
              </div>
            </div>
          </div>
          <div className="flex gap-2 items-center bg-[#F8FAFC] rounded-[8px] p-2 sm:p-[16px] w-full md:w-[33%]">
            <div className="items-center">
              <span className="w-[20px] h-[20px]">{arrowRight}</span>
            </div>
            <div>
              <div className="text-[#6B7280] text-xs sm:text-[14px]">Current Weight</div>
              <div className="text-[#020817] font-bold text-base sm:text-[20px]">
                {checkIns?.weight?.currentWeight}
              </div>
              <div
                className={`$${
                  checkIns?.weight?.currentWeight -
                    checkIns?.weight?.initialWeight >
                  0
                    ? "text-[#e90f0f]"
                    : "text-[#16A34A]"
                } text-xs sm:text-[14px]`}
              >
                {checkIns?.weight?.currentWeight -
                  checkIns?.weight?.initialWeight >
                0
                  ? `+${checkIns?.weight?.currentWeight -
                      checkIns?.weight?.initialWeight}`
                  : `-${checkIns?.weight?.initialWeight -
                      checkIns?.weight?.currentWeight}`}
                &nbsp;lbs
              </div>
            </div>
          </div>
          <div className="flex gap-2 items-center bg-[#F8FAFC] rounded-[8px] p-2 sm:p-[16px] w-full md:flex-1">
            <div className="items-center">
              <span className="w-[20px] h-[20px]">{goalIcon}</span>
            </div>
            <div>
              <div className="text-[#6B7280] text-xs sm:text-[14px]">Goal Weight</div>
              <div className="text-[#020817] font-bold text-base sm:text-[20px]">{checkIns?.weight?.goalWeight}</div>
            </div>
          </div>
        </div>
        <CardContent className="p-0 pt-2 sm:p-2"  >
          <div className="w-full h-[300px]">
            <ResponsiveContainer height={300} width="100%">
              <LineChart
                data={checkIns.checkIns}
                margin={{ top: 60, left: 12, right: 12, bottom: 40 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="selectedDate"
                  tickLine={true}
                  axisLine={true}
                  tickMargin={8}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      timeZone: "UTC", // Ensures date is formatted in UTC consistently
                    });
                  }}
                />
                <YAxis
                  dataKey="weight"
                  domain={[minWeight-20, maxWeight + 20]}
                  tickLine={true}
                  axisLine={true}
                  tickMargin={8}
                  tickFormatter={(value) => `${value} lbs`} // Add unit for clarity
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                    border: "none",
                    backgroundColor: "white",
                    padding: "10px",
                  }}
                  labelFormatter={(label) => {
                    if (!label) return "";
                    const date = new Date(label);
                    return date.toLocaleDateString(undefined, {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      timeZone: "UTC", // Keep tooltip label in UTC for consistency
                    });
                  }}
                />
                <Line
                  dataKey="weight"
                  type="natural"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={{ fill: "#2563eb" }}
                  activeDot={{ r: 6 }}
                >
                  <LabelList
                    position="top"
                    offset={12}
                    className="fill-foreground"
                    fontSize={12}
                  />
                </Line>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      <Card className="mt-4 sm:mt-[16px]">
        <CardHeader className="pl-0 sm:pl-[20px]">
          <CardTitle className="text-lg pl-2 sm:text-2xl font-semibold">
            Meal History
          </CardTitle>
        </CardHeader>
        {checkIns?.checkIns?.length === 0 ? (
          <CardContent className="text-[14px] pb-[24px]">
            <div className="text-[#020817] font-bold mb-[4px]">
              No meal history
            </div>
          </CardContent>
        ) : (
          checkIns?.checkIns
            ?.slice() // create a copy to avoid mutating original array
            .sort((a, b) => new Date(b.selectedDate) - new Date(a.selectedDate))
            .map((checkIn, index) => (
              <MealHistoryComponent checkIn={checkIn} key={index} />
            ))
        )}
      </Card>
    </div>
  );
};
export default NutritionWeightTab;
