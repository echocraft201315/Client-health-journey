"use client";

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "../../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label";
import { Calendar } from "../../components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { format } from "date-fns";
import {
  MessageSquare,
  Calendar as CalendarIcon,
  PlusCircle,
  Clock,
} from "lucide-react";

// Temporary mock data
const initialEntries = [
  {
    id: "1",
    date: "2023-09-15",
    meals: {
      breakfast: "Avocado toast with poached eggs and spinach",
      lunch: "Quinoa salad with roasted vegetables and grilled chicken",
      dinner: "Baked salmon with sweet potato and steamed broccoli",
      snacks: "Apple with almond butter, Greek yogurt with berries",
    },
    mood: "Energetic",
    notes: "Felt great throughout the day. No afternoon energy slump!",
    waterIntake: 8,
    hasCoachFeedback: true,
    coachFeedback:
      "Great job incorporating protein with each meal. Try adding more leafy greens to your lunch tomorrow.",
  },
  {
    id: "2",
    date: "2023-09-14",
    meals: {
      breakfast: "Smoothie with protein powder, banana, and berries",
      lunch: "Turkey wrap with mixed greens and avocado",
      dinner: "Stir-fry with tofu, brown rice, and vegetables",
      snacks: "Hummus with carrot sticks, handful of mixed nuts",
    },
    mood: "Tired",
    notes: "Didn't sleep well last night. Felt hungry between meals.",
    waterIntake: 6,
    hasCoachFeedback: false,
    coachFeedback: "",
  },
];

const ClientJournal = () => {
  const [entries] = useState(initialEntries);
  const [date, setDate] = useState(new Date());
  const [isCreatingEntry, setIsCreatingEntry] = useState(false);

  return (
    <div className="space-y-6 px-2 sm:px-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
        <h3 className="text-base sm:text-lg font-medium">Food Journal</h3>
        <Button
          onClick={() => setIsCreatingEntry(true)}
          className="flex items-center gap-2 w-full sm:w-auto"
        >
          <PlusCircle size={16} />
          New Entry
        </Button>
      </div>

      {isCreatingEntry ? (
        <JournalEntryForm onCancel={() => setIsCreatingEntry(false)} />
      ) : (
        <>
          <Card className="w-full max-w-full">
            <CardHeader className="pb-3 px-2 sm:px-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
                <CardTitle className="text-base sm:text-lg">Journal Entries</CardTitle>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2 w-full sm:w-auto"
                    >
                      <CalendarIcon size={16} />
                      <span>{format(date, "MMM d, yyyy")}</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(date) => date && setDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </CardHeader>
            <CardContent className="px-2 sm:px-4">
              <Tabs defaultValue="list" className="w-full">
                <TabsList className="mb-4 w-full flex flex-col sm:flex-row gap-2 sm:gap-0">
                  <TabsTrigger value="list" className="w-full sm:w-auto">List View</TabsTrigger>
                  <TabsTrigger value="calendar" className="w-full sm:w-auto">Calendar View</TabsTrigger>
                </TabsList>

                <TabsContent value="list">
                  <div className="space-y-4">
                    {entries.map((entry) => (
                      <JournalEntry key={entry.id} entry={entry} />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="calendar">
                  <div className="text-center p-8 text-gray-500 text-xs sm:text-sm">
                    Calendar view will be available soon.
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

const JournalEntry = ({ entry }) => {
  const formattedDate = new Date(entry.date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Card className="w-full max-w-full">
      <CardHeader className="pb-2 px-2 sm:px-4">
        <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-0">
          <CardTitle className="text-sm sm:text-base">{formattedDate}</CardTitle>
          <div className="flex items-center text-xs sm:text-sm text-gray-500">
            <Clock size={14} className="mr-1" />
            <span>Water: {entry.waterIntake} glasses</span>
          </div>
        </div>
        <CardDescription className="text-xs sm:text-sm">{entry.mood}</CardDescription>
      </CardHeader>
      <CardContent className="px-2 sm:px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <h4 className="text-sm font-medium mb-1">Breakfast</h4>
            <p className="text-sm text-gray-600">{entry.meals.breakfast}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-1">Lunch</h4>
            <p className="text-sm text-gray-600">{entry.meals.lunch}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-1">Dinner</h4>
            <p className="text-sm text-gray-600">{entry.meals.dinner}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-1">Snacks</h4>
            <p className="text-sm text-gray-600">{entry.meals.snacks}</p>
          </div>
        </div>

        {entry.notes && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-1">Notes</h4>
            <p className="text-sm text-gray-600">{entry.notes}</p>
          </div>
        )}
      </CardContent>

      {entry.hasCoachFeedback && (
        <CardFooter className="border-t bg-gray-50 p-4">
          <div className="flex gap-3 w-full">
            <MessageSquare size={16} className="text-primary mt-0.5" />
            <div>
              <h4 className="text-sm font-medium">Coach Feedback</h4>
              <p className="text-sm text-gray-600">{entry.coachFeedback}</p>
            </div>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

const JournalEntryForm = ({ onCancel }) => {
  const [date, setDate] = useState < Date > new Date();
  const [formData, setFormData] = useState({
    breakfast: "",
    lunch: "",
    dinner: "",
    snacks: "",
    mood: "",
    notes: "",
    waterIntake: 8,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically save the entry to your backend
    console.log("New journal entry:", { date, ...formData });
    onCancel();
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>New Journal Entry</CardTitle>
          <CardDescription>Record what you ate today</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="date">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(date, "PPP")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => date && setDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="breakfast">Breakfast</Label>
              <Textarea
                id="breakfast"
                name="breakfast"
                value={formData.breakfast}
                onChange={handleChange}
                placeholder="What did you eat for breakfast?"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lunch">Lunch</Label>
              <Textarea
                id="lunch"
                name="lunch"
                value={formData.lunch}
                onChange={handleChange}
                placeholder="What did you eat for lunch?"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dinner">Dinner</Label>
              <Textarea
                id="dinner"
                name="dinner"
                value={formData.dinner}
                onChange={handleChange}
                placeholder="What did you eat for dinner?"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="snacks">Snacks</Label>
              <Textarea
                id="snacks"
                name="snacks"
                value={formData.snacks}
                onChange={handleChange}
                placeholder="What snacks did you have?"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mood">Mood</Label>
              <Input
                id="mood"
                name="mood"
                value={formData.mood}
                onChange={handleChange}
                placeholder="How did you feel today?"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="waterIntake">Water Intake (Glasses)</Label>
              <Input
                id="waterIntake"
                name="waterIntake"
                type="number"
                value={formData.waterIntake}
                onChange={handleChange}
                min="0"
                max="20"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Any additional notes about your meals or how you felt?"
            />
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onCancel} type="button">
            Cancel
          </Button>
          <Button type="submit">Save Entry</Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ClientJournal;
