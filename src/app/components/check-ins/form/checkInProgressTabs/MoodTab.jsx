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

const MoodTab = ({ checkIns }) => {
  return (
    <div className="w-full max-w-3xl mx-auto px-2 py-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-2xl font-semibold ml-0 sm:ml-[20px]">
            Mood Tracking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full h-[300px]">
            <ResponsiveContainer height={300} width="100%">
      <LineChart
        data={checkIns.checkIns}
        margin={{ top: 40, left: -35, right: 5, bottom: 20 }}
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
              timeZone: "UTC", // Ensures date is formatted in UTC
            });
          }}
        />
        <YAxis
          dataKey="moodLevel"
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
              timeZone: "UTC", // Consistent UTC formatting here
            });
          }}
        />
        <Line
          dataKey="moodLevel"
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
export default MoodTab;
