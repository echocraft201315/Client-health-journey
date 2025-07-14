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

const SleepTab = ({ checkIns }) => {
  return (
    <div className="w-full max-w-3xl mx-auto px-2 py-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-2xl font-semibold ml-0 sm:ml-[20px]">
            Sleep Tracking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full h-[300px]">
            <ResponsiveContainer height={300} width="100%">
              <LineChart
                data={checkIns.checkIns}
                margin={{ top: 40, left: -35, right: 5, bottom: 10 }}
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
                      timeZone: "UTC", // Ensures consistent date formatting in UTC
                    });
                  }}
                />
                <YAxis
                  dataKey="sleepHours"
                  tickLine={true}
                  axisLine={true}
                  tickMargin={8}
                  tickFormatter={(value) => `${value}`}
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
                      timeZone: "UTC", // Keep tooltip label in UTC for clarity
                    });
                  }}
                  formatter={(value, name) => [`${value} hrs`, name]}
                />
                <Line
                  dataKey="sleepHours"
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
    </div>
  );
};
export default SleepTab;
