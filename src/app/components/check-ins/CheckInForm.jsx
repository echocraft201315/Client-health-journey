"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Tabs, TabsContent } from "../../components/ui/tabs";
import { Button } from "../../components/ui/button";
import { Calendar } from "../../components/ui/calendar";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/app/lib/utils";
import { Label } from "@/app/components/ui/label";

// Import refactored components
import MeasurementsTab from "./form/MeasurementsTab";
import WellnessTab from "./form/WellnessTab";
import NutritionTab from "./form/NutritionTab";
import SupplementsTab from "./form/SupplementsTab";
import CheckInFormTabs from "./form/CheckInFormTabs";
import CheckInNavigation from "./form/CheckInNavigation";
import ImageUpload from "./form/resourceTabs/ImageUpload";

const checkInSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  coachId: z.string().min(1, "Coach ID is required"),
  clinic: z.string().min(1, "Clinic is required"),
  selectedDate: z.date(),
  weight: z.string().min(1, "Weight is required").transform((val) => parseFloat(val) || 0),
  waist: z.string().optional().default("").transform((val) => val ? parseFloat(val) : null),
  waterIntake: z.string().min(1, "Water intake is required").transform((val) => parseFloat(val) || 0),
  energyLevel: z.number().min(1).max(10).default(5),
  moodLevel: z.number().min(1).max(10).default(5),
  exerciseType: z.string().optional().default(""),
  exercise: z.string().optional().default(""),
  exerciseTime: z.string().optional().default("").transform((val) => val ? parseFloat(val) : null),
  sleepHours: z.string().min(1, "Sleep hours is required").transform((val) => parseFloat(val) || 0),
  nutrition: z.array(z.object({
    protein: z.string().optional(),
    proteinPortion: z.string().optional().transform((val) => val ? parseFloat(val) : null),
    fruit: z.string().optional(),
    fruitPortion: z.string().optional().transform((val) => val ? parseFloat(val) : null),
    vegetables: z.string().optional(),
    vegetablesPortion: z.string().optional().transform((val) => val ? parseFloat(val) : null),
    carbs: z.string().optional(),
    carbsPortion: z.string().optional().transform((val) => val ? parseFloat(val) : null),
    fats: z.string().optional(),
    fatsPortion: z.string().optional().transform((val) => val ? parseFloat(val) : null),
    other: z.string().optional(),
    otherPortion: z.string().optional().transform((val) => val ? parseFloat(val) : null),
    images: z.array(z.string()).optional().default([]),
  })),
  supplements: z.string().optional().default(""),
  notes: z.string().optional().default(""),
});

const CheckInForm = () => {
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState("measurements");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUploadOpen, setImageUploadOpen] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    getValues,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(checkInSchema),
    defaultValues: {
      name: "",
      email: "",
      coachId: "",
      clinic: "",
      selectedDate: new Date(),
      weight: "",
      waist: "",
      waterIntake: "",
      energyLevel: 5,
      moodLevel: 5,
      exerciseType: "",
      exercise: "",
      exerciseTime: "",
      sleepHours: "",
      nutrition: [],
      supplements: "",
      notes: "",
    },
  });

  const formData = watch();

  useEffect(() => {
    if (user) {
      setValue("name", user.name || "");
      setValue("email", user.email || "");
      setValue("coachId", user.coachId || "");
      setValue("clinic", user.clinic || "");
    }
  }, [user, setValue]);

  const handleDateChange = (date) => {
    setValue("selectedDate", date);
  };

  const onSubmit = async (data) => {
    if (!user) {
      toast.error("Please log in to submit check-in data");
      return;
    }

    // Check for required fields based on current tab
    const requiredFields = {
      measurements: ["weight", "waterIntake"],
      wellness: ["energyLevel", "moodLevel", "sleepHours"],
      nutrition: [], // Optional fields
      supplements: [], // Optional fields
    };

    const currentTabRequiredFields = requiredFields[currentTab];
    const missingFields = currentTabRequiredFields.filter(field => {
      // For nutrition tab, we don't need to check any fields
      if (currentTab === 'nutrition') return false;
      // For other tabs, check if the field is empty
      return !data[field];
    });

    if (missingFields.length > 0) {
      const fieldNames = {
        weight: "Weight",
        waterIntake: "Water Intake",
        energyLevel: "Energy Level",
        moodLevel: "Mood Level",
        sleepHours: "Sleep Hours",
      };

      const missingFieldNames = missingFields.map(field => fieldNames[field]).join(", ");
       toast.error(`Please fill in the required fields: ${missingFieldNames}`);
      return;
    }

    setIsSubmitting(true);
    try {
      // Calculate calories for each nutrition entry
      const nutritionWithCalories = (data.nutrition || []).map((entry) => {
        const protein = parseFloat(entry.proteinPortion) || 0;
        const carbs = parseFloat(entry.carbsPortion) || 0;
        const fats = parseFloat(entry.fatsPortion) || 0;
        const calories = (4 * protein + 4 * carbs + 9 * fats);
        return {
          ...entry,
          calories: calories ? calories.toFixed(0) : '0',
        };
      });

      // Ensure all required fields have values and proper types
      const formData = {
        ...data,
        name: data.name || user.name,
        email: data.email || user.email,
        coachId: data.coachId || user.coachId,
        clinic: data.clinic || user.clinic,
        selectedDate: data.selectedDate || new Date(),
        weight: data.weight || 0,
        waist: data.waist || null,
        waterIntake: data.waterIntake || 0,
        energyLevel: data.energyLevel || 5,
        moodLevel: data.moodLevel || 5,
        exerciseType: data.exerciseType || "",
        exercise: data.exercise || "",
        exerciseTime: data.exerciseTime || null,
        sleepHours: data.sleepHours || 0,
        nutrition: nutritionWithCalories,
        supplements: data.supplements || "",
        notes: data.notes || "",
        current: new Date(),
      };

      const response = await fetch("/api/client/checkIn", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();
      if (responseData.status) {
        toast.success("clientCheckIndata added successfully");
        setIsSubmitting(false);
      } else {
        throw new Error(responseData.message);
      }

      const resActivity = await fetch("/api/activity/checkIn", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "check_in",
          description: `Client ${user.name || 'Unknown'} completed weekly check-in`,
          clinicId: user.clinic || '',
        }),
      });
      const respond = await resActivity.json();
      if (respond.status) {
        toast.success("weekly check-in activity added successfully");
      } else {
        throw new Error(respond.message);
      }
    } catch (error) {
      console.log("Failed to add checkin", error);
      toast.error("Failed to submit check-in data");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onError = (errors) => {
    const firstError = Object.values(errors)[0];
    if (firstError) {
      console.log(firstError)
      toast.error(firstError.message || "Please fill in all required fields");
    }
  };

  // Handler to add uploaded image to form state
  const handleImageUpload = (imageObj) => {
    setUploadedImages((prev) => [...prev, imageObj]);
    // Optionally, add to nutrition[0].images or a dedicated images field
    // setValue('nutrition.0.images', [...(getValues('nutrition.0.images') || []), imageObj]);
  };

  if (!user) {
    return (
      <div className="max-w-3xl w-full px-2 sm:px-4 py-4 mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Please Log In</CardTitle>
          </CardHeader>
          <CardContent>
            <p>You need to be logged in to submit check-in data.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-0 pt-0 sm:px-0 py-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Client Check-In</CardTitle>
          <div className="mt-4">
            <Label htmlFor="selectedDate" className="mb-3">Check-in Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.selectedDate ? (
                    format(formData.selectedDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.selectedDate}
                  onSelect={(date) => setValue("selectedDate", date)}
                  initialFocus
                  disabled={(date) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return date > today;
                  }}
                />
              </PopoverContent>
            </Popover>
            {errors.selectedDate && (
              <span className="text-red-500 text-sm">{errors.selectedDate.message}</span>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-1 pt-0">
          <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6 w-full">
            
            <Tabs value={currentTab} className="w-full">
              <CheckInFormTabs
                currentTab={currentTab}
                onTabChange={setCurrentTab}
              />
              <div>
                <TabsContent value="measurements" className="space-y-6 w-full">
                  <MeasurementsTab
                    register={register}
                    errors={errors}
                    formData={formData}
                    setValue={setValue}
                  />
                </TabsContent>
                <TabsContent value="wellness" className="space-y-6 w-full">
                  <WellnessTab
                    register={register}
                    errors={errors}
                    formData={formData}
                    setValue={setValue}
                  />
                </TabsContent>
                <TabsContent value="nutrition" className="space-y-6 w-full">
                  <NutritionTab
                    register={register}
                    errors={errors}
                    formData={formData}
                    setValue={setValue}
                    getValues={getValues}
                  />
                </TabsContent>
                <TabsContent value="supplements" className="space-y-6 w-full">
                  <SupplementsTab
                    register={register}
                    errors={errors}
                    formData={formData}
                    setValue={setValue}
                  />
                </TabsContent>
                <CheckInNavigation
                  currentTab={currentTab}
                  setCurrentTab={setCurrentTab}
                  isSubmitting={isSubmitting}
                  onSubmit={handleSubmit(onSubmit, onError)}
                />
              </div>
            </Tabs>
            <Button
              type="button"
              variant="outline"
              onClick={() => setImageUploadOpen(true)}
              className="mb-4 w-full sm:w-auto px-6 py-3 rounded-xl shadow-lg bg-gradient-to-r from-[#e0c3fc] via-[#8ec5fc] to-[#e0c3fc] text-lg font-semibold text-gray-900 border-0 hover:scale-105 transition-transform duration-200 flex items-center justify-center gap-2"
              style={{ boxShadow: '0 4px 24px 0 rgba(80, 80, 120, 0.15)' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-[#7f53ac]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A2 2 0 0020 6.382V5a2 2 0 00-2-2H6a2 2 0 00-2 2v1.382a2 2 0 00.447 1.342L9 10m6 0v4m0 0l-4.553 2.276A2 2 0 014 17.618V19a2 2 0 002 2h12a2 2 0 002-2v-1.382a2 2 0 00-.447-1.342L15 14z" /></svg>
              Take selfie image
            </Button>
            <ImageUpload open={imageUploadOpen} onOpenChange={setImageUploadOpen} onUpload={handleImageUpload} />
            {/* Preview uploaded images */}
            {uploadedImages.length > 0 && (
              <div className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-2">
                {uploadedImages.map((img, idx) => (
                  <div key={idx} className="border rounded p-2 flex flex-col items-center">
                    <img src={img.url} alt={img.description} className="w-full h-24 object-cover rounded mb-1" />
                    <div className="text-xs text-gray-600">{img.description}</div>
                  </div>
                ))}
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CheckInForm;
