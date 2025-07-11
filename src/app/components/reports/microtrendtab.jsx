"use client"

import { Button } from "../../components/ui/button";
import { Calendar } from "../../components/ui/calendar";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import {useAuth} from "@/app/context/AuthContext"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { AlertTriangle } from 'lucide-react';

const MICRONUTRIENTS = [
  'fiber', 'sodium', 'vitaminA', 'vitaminC', 'vitaminD', 'vitaminE', 'vitaminK',
  'vitaminB1', 'vitaminB2', 'vitaminB3', 'vitaminB6', 'vitaminB12', 'folate',
  'calcium', 'iron', 'magnesium', 'phosphorus', 'potassium', 'zinc', 'selenium'
];

const COLORS = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1', '#a4de6c', '#d0ed57', '#ffc0cb',
  '#b0e0e6', '#ffb6c1', '#c6e2ff', '#eedd82', '#dda0dd', '#f08080', '#e9967a', '#bdb76b',
  '#20b2aa', '#87cefa', '#778899', '#b22222'
];

const MICRONUTRIENT_TARGETS = {
  fiber: { target: 25, unit: 'g' },
  sodium: { target: 2300, unit: 'mg' },
  vitaminA: { target: 3000, unit: 'mcg' },
  vitaminC: { target: 90, unit: 'mg' },
  vitaminD: { target: 20, unit: 'mcg' },
  vitaminE: { target: 15, unit: 'mg' },
  vitaminK: { target: 120, unit: 'mcg' },
  vitaminB1: { target: 1.2, unit: 'mg' },
  vitaminB2: { target: 1.3, unit: 'mg' },
  vitaminB3: { target: 16, unit: 'mg' },
  vitaminB6: { target: 1.7, unit: 'mg' },
  vitaminB12: { target: 2.4, unit: 'mcg' },
  folate: { target: 400, unit: 'mcg' },
  calcium: { target: 1300, unit: 'mg' },
  iron: { target: 18, unit: 'mg' },
  magnesium: { target: 420, unit: 'mg' },
  phosphorus: { target: 1250, unit: 'mg' },
  potassium: { target: 4700, unit: 'mg' },
  zinc: { target: 11, unit: 'mg' },
  selenium: { target: 55, unit: 'mcg' },
};

const formatNutrientName = (key) => {
  const nameMap = {
    fiber:        'Fiber',
    sodium:       'Sodium',
    vitaminA:     'Vitamin A',
    vitaminC:     'Vitamin C',
    vitaminD:     'Vitamin D',
    vitaminE:     'Vitamin E',
    vitaminK:     'Vitamin K',
    vitaminB1:    'Vitamin B1 (Thiamin)',
    vitaminB2:    'Vitamin B2 (Riboflavin)',
    vitaminB3:    'Vitamin B3 (Niacin)',
    vitaminB6:    'Vitamin B6',
    vitaminB12:   'Vitamin B12',
    folate:       'Folate',
    calcium:      'Calcium',
    iron:         'Iron',
    magnesium:    'Magnesium',
    phosphorus:   'Phosphorus',
    potassium:    'Potassium',
    zinc:         'Zinc',
    selenium:     'Selenium'
  };
  return nameMap[key] || key.charAt(0).toUpperCase() + key.slice(1);
};

const MicroTrendTab = () => {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [microTrend, setMicroTrend] = useState([]);
    const [loading, setMicronutrientLoading] = useState(false);
    const {user} = useAuth();
    const handlechange1 = (date) => {
        setStartDate(date);
    };
    const handlechange2 = (date) => {
        setEndDate(date);
    };
    useEffect(() => {
        const fetchMicroTrend = async () => {
            setMicronutrientLoading(true);
            try {
              const response = await fetch("/api/client/micronutrients/trend", {
                method: "POST",
                body: JSON.stringify({startDate, endDate}),
              });
    
              const data = await response.json();
              if (data.status) {
                setMicroTrend(data.microTrend);
              } else {
                setMicroTrend([]);
              }
            } catch (error) {
              console.error("Error fetching micronutrients:", error);
              setMicroTrend([]);
            } finally {
              setMicronutrientLoading(false);
            }
          };
          fetchMicroTrend();
    },[user, startDate, endDate]);
console.log("microTrend", microTrend)

    // Prepare data for charts: array of { date, fiber, sodium, ... }
    const chartData = microTrend.map(item => ({
      date: item.date,
      ...item.totalMicronutrients
    }));

    return (
        <div>
            <div className="flex flex-col md:flex-row flex-wrap gap-2 md:gap-4 items-start md:items-center mb-4">
            <div>Time Range: </div>
            <Popover>
            <PopoverTrigger asChild>
                <Button
                variant="outline"
                className="flex items-center gap-2 w-full md:w-auto"
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
      {/* Render microTrend data as barcharts for each micronutrient */}
      <div className="flex flex-col gap-8">
        {loading ? (
          <div>Loading...</div>
        ) : (
          microTrend && microTrend.length > 0 ? (
            MICRONUTRIENTS.map((nutrient, idx) => {
              const unit = MICRONUTRIENT_TARGETS[nutrient]?.unit || '';
              return (
                <div key={nutrient} className="bg-white rounded-lg shadow p-4">
                  <h3 className="font-semibold mb-2 capitalize">
                    {formatNutrientName(nutrient)} Trend <span className="text-xs text-gray-500">({unit})</span>
                  </h3>
                  <div style={{ width: '100%', height: 250 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" tickLine={false} tickMargin={10} axisLine={false}
                          tickFormatter={(value) => {
                            const date = new Date(value);
                            return date.toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                              timeZone: "UTC",
                            });
                          }}
                        />
                        <YAxis allowDecimals={true} />
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
                              timeZone: "UTC",
                            });
                          }}
                          formatter={(value, name) => [`${value} ${unit}`, formatNutrientName(name)]}
                        />
                        <Bar dataKey={nutrient} fill={COLORS[idx % COLORS.length]} radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-lg border border-dashed border-gray-200">
              <AlertTriangle className="w-12 h-12 text-yellow-400 mb-4" />
              <div className="text-lg font-semibold text-gray-700 mb-2">No micronutrient data found</div>
              <div className="text-gray-500 text-center max-w-md">
                There is no micronutrient trend data for the selected date range.<br />
                Try selecting a different range or add new check-ins to see your micronutrient trends visualized here.
              </div>
            </div>
          )
        )}
      </div>
        </div>
    )
}

export default MicroTrendTab;