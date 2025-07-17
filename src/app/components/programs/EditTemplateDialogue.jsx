"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { AlertCircle, Plus, Loader2, Trash2 } from "lucide-react";
import { Alert, AlertDescription } from "@/app/components/ui/alert";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "@/app/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";

const dietaryOptions = [
  { key: "vegan", label: "Vegan" },
  { key: "vegetarian", label: "Vegetarian" },
  { key: "diabetic", label: "Diabetic" },
  { key: "glutenFree", label: "Gluten-Free" },
  { key: "dairyFree", label: "Dairy-free" },
  { key: "keto", label: "Keto" },
  { key: "paleo", label: "Paleo" },
  { key: "antiInflammatory", label: "Anti-Inflammatory" },
  { key: "halalKosher", label: "Halal / Kosher" },
];

const formSchema = z.object({
  programName: z.string().min(1, "Program name is required"),
  programLength: z.string().min(1, "Program length is required").regex(/^[0-9]+$/, "Program length must be a number"),
  programType: z.string().min(1, "Program type is required"),
  checkInFrequency: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  goals: z.object({
    weightLoss: z.boolean().optional(),
    metabolicReset: z.boolean().optional(),
    detox: z.boolean().optional(),
    improvedEnergy: z.boolean().optional(),
    gutHealth: z.boolean().optional(),
    hormoneBalance: z.boolean().optional(),
  }).partial(),
  foodRules: z.object({
    noCookingOils: z.boolean().optional(),
    oilFreeDressings: z.boolean().optional(),
  }).partial(),
  cookingMethods: z.object({
    grill: z.boolean().optional(),
    bake: z.boolean().optional(),
    steam: z.boolean().optional(),
    poach: z.boolean().optional(),
  }).partial(),
  recommendedProteins: z.string().optional(),
  recommendedVegetables: z.string().optional(),
  allowedFruits: z.string().optional(),
  healthyFats: z.string().optional(),
  foodsToAvoid: z.object({
    processedFoods: z.boolean().optional(),
    sugaryDrinks: z.boolean().optional(),
    friedFoods: z.boolean().optional(),
    refinedCarbs: z.boolean().optional(),
    dairy: z.boolean().optional(),
    alcohol: z.boolean().optional(),
    artificialSweeteners: z.boolean().optional(),
    cookingOils: z.boolean().optional(),
  }).partial(),
  portionGuidelines: z.array(z.object({
    protein: z.string().optional(),
    fruit: z.string().optional(),
    vegetables: z.string().optional(),
    carbs: z.string().optional(),
    fats: z.string().optional(),
    other: z.string().optional(),
    calories: z.string().optional(),
  })),
  supplements: z.array(z.object({
    name: z.string().min(1, "Required"),
    purpose: z.string().min(1, "Required"),
    dosage: z.string().min(1, "Required"),
    timing: z.string().min(1, "Required"),
  })),
  weeklySchedule: z.array(z.object({
    week: z.string().min(1, "Week is required").regex(/^[0-9]+$/, "Week must be a number"),
    focusArea: z.string().min(1, "Focus area is required"),
    coachNotes: z.string().min(1, "Coach notes are required"),
  })),
  lifestyle: z.object({
    dailyJournaling: z.boolean().optional(),
    gratitudePractice: z.boolean().optional(),
    sleepGoal: z.string().optional(),
    movementGoal: z.string().optional(),
  }).partial(),
  messagingPreferences: z.object({
    tone: z.string().min(1, "Message tone is required"),
    keywords: z.string().optional(),
  }),
  foodAllergies: z.string().optional(),
  dietaryPreferences: z.object({
    vegan: z.boolean().optional(),
    vegetarian: z.boolean().optional(),
    diabetic: z.boolean().optional(),
    glutenFree: z.boolean().optional(),
    dairyFree: z.boolean().optional(),
    keto: z.boolean().optional(),
    paleo: z.boolean().optional(),
    antiInflammatory: z.boolean().optional(),
    halalKosher: z.boolean().optional(),
  }).partial(),
});

export function EditTemplateDialogue({
  open,
  setOpen,
  fetchTemplates,
  selectedTemplate,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      programName: "",
      programLength: "",
    programType: "Practice Naturals",
    checkInFrequency: "none",
      description: "",
      goals: {},
      foodRules: {},
      cookingMethods: {},
      recommendedProteins: "",
      recommendedVegetables: "",
      allowedFruits: "",
      healthyFats: "",
      foodsToAvoid: {},
      portionGuidelines: [],
      supplements: [],
      weeklySchedule: [],
      lifestyle: {},
    messagingPreferences: {
      tone: "gentle-encouragement",
        keywords: "",
      },
    foodAllergies: "",
    dietaryPreferences: {},
    },
  });

  // Reset form when selectedTemplate changes
  useEffect(() => {
    if (selectedTemplate) {
      form.reset({
        programName: selectedTemplate.program_name || "",
        programLength: Number(selectedTemplate.program_length) || 0,
        programType: selectedTemplate.program_type || "Practice Naturals",
        checkInFrequency: selectedTemplate.check_in_frequency || "none",
        description: selectedTemplate.description || "",
        goals: JSON.parse(selectedTemplate.goals) || {},
        foodRules: JSON.parse(selectedTemplate.food_rules) || {},
        cookingMethods: JSON.parse(selectedTemplate.cooking_methods) || {},
        recommendedProteins: selectedTemplate.recommended_proteins || "",
        recommendedVegetables: selectedTemplate.recommended_vegetables || "",
        allowedFruits: selectedTemplate.allowed_fruits || "",
        healthyFats: selectedTemplate.healthy_fats || "",
        foodsToAvoid: JSON.parse(selectedTemplate.foods_to_avoid) || {},
        portionGuidelines: JSON.parse(selectedTemplate.portion_guidelines) || [],
        supplements: JSON.parse(selectedTemplate.supplements) || [],
        weeklySchedule: JSON.parse(selectedTemplate.weekly_schedule) || [],
        lifestyle: JSON.parse(selectedTemplate.lifestyle) || {},
        messagingPreferences: JSON.parse(selectedTemplate.messaging_preferences) || {
          tone: "gentle-encouragement",
          keywords: "",
        },
        foodAllergies: selectedTemplate.food_allergies || "",
        dietaryPreferences: JSON.parse(selectedTemplate.dietary_preferences) || {},
      });
    }
  }, [selectedTemplate, form]);
  const { control, handleSubmit, setValue, getValues, watch } = form;
  const addSupplement = () => {
    const currentSupplements = getValues("supplements");
    setValue("supplements", [
      ...currentSupplements,
      { name: "", purpose: "", dosage: "", timing: "" },
    ]);
  };

  const removeSupplement = (index) => {
    const currentSupplements = getValues("supplements");
    const newSupplements = currentSupplements.filter((_, i) => i !== index);
    setValue("supplements", newSupplements, { shouldValidate: true, shouldDirty: true });
  };

  const addWeek = () => {
    const currentWeeklySchedule = getValues("weeklySchedule");
    const nextWeekNumber = currentWeeklySchedule.length + 1;
    setValue("weeklySchedule", [
      ...currentWeeklySchedule,
      { week: String(nextWeekNumber), focusArea: "", coachNotes: "" },
    ], { shouldValidate: true, shouldDirty: true });
  };

  const removeWeek = (index) => {
    const currentWeeklySchedule = getValues("weeklySchedule");
    const newWeeklySchedule = currentWeeklySchedule.filter((_, i) => i !== index);
    setValue("weeklySchedule", newWeeklySchedule, { shouldValidate: true, shouldDirty: true });
  };

  const onSubmit = async (data) => {
    if (!selectedTemplate?.id) {
      setErrorMessage("No template selected for editing");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/template/${selectedTemplate.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (result.status) {
        setErrorMessage(null);
        setOpen(false);
        await fetchTemplates();
        toast.success("Template updated successfully");
      } else {
        setErrorMessage(result.message || "Failed to update template");
      }
    } catch (error) {
      console.error("Error updating template:", error);
      setErrorMessage("Failed to update template");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[700px] w-full max-w-[98vw] p-4 sm:p-8 max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Edit Template</DialogTitle>
          <DialogDescription>
            Update the template details below.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 overflow-y-auto flex-1 pr-2">
        {errorMessage && (
              <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
            <Card>
              <CardHeader>
                <CardTitle>Program Basics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={control}
                    name="programName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Program Name *</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="programLength"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Program Length (days) *</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                    />
                  </div>
                <FormField
                  control={control}
                  name="programType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Program Type</FormLabel>
                  <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                    <SelectTrigger>
                            <SelectValue placeholder="Select program type" />
                    </SelectTrigger>
                        </FormControl>
                    <SelectContent>
                      <SelectItem value="Practice Naturals">
                        Practice Naturals
                      </SelectItem>
                      <SelectItem value="ChiroThin">ChiroThin</SelectItem>
                      <SelectItem value="Keto">Keto</SelectItem>
                          <SelectItem value="Athlete">Athlete</SelectItem>
                          <SelectItem value="Fasting">Fasting</SelectItem>
                          <SelectItem value="Lazy">Lazy</SelectItem>
                      <SelectItem value="Custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="checkInFrequency"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Check-In Frequency</FormLabel>
                      <FormControl>
                  <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="daily" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Daily Check-in
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="weekly" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Weekly Check-in
                            </FormLabel>
                          </FormItem>
                  </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Program Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Program Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Program Description *</FormLabel>
                      <FormControl>
                  <Textarea
                          placeholder="Comprehensive metabolic reset using natural supplements and whole foods approach"
                          className="resize-none"
                    rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
                  <Label>Program Goals</Label>
                  {/* Goals Checkboxes */}
                  <div className="grid md:grid-cols-3 gap-4 mt-2">
                    {Object.entries({
                      weightLoss: "Weight Loss",
                      metabolicReset: "Metabolic Reset",
                      improvedEnergy: "Improved Energy",
                      gutHealth: "Gut Health",
                      detox: "Detox",
                      hormoneBalance: "Hormone Balance",
                    }).map(([key, label]) => (
                      <FormField
                        key={key}
                        control={control}
                        name={`goals.${key}`}
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                        <Checkbox
                                checked={field.value ?? false}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>{label}</FormLabel>
                      </div>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Nutrition Guidelines */}
            <Card>
              <CardHeader>
                <CardTitle>Nutrition Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Food Preparation Rules</Label>
                  {/* Food Rules Checkboxes */}
                  <div className="grid md:grid-cols-2 gap-4 mt-2">
                    {Object.entries({
                      noCookingOils: "No cooking oils",
                      oilFreeDressings: "Oil-free salad dressings",
                    }).map(([key, label]) => (
                      <FormField
                        key={key}
                        control={control}
                        name={`foodRules.${key}`}
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                      <Checkbox
                                checked={field.value ?? false}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>{label}</FormLabel>
                    </div>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Allowed Cooking Methods</Label>
                  {/* Cooking Methods Checkboxes */}
                  <div className="grid md:grid-cols-4 gap-4 mt-2">
                    {Object.entries({
                      grill: "Grill",
                      bake: "Bake",
                      steam: "Steam",
                      poach: "Poach",
                    }).map(([key, label]) => (
                      <FormField
                        key={key}
                        control={control}
                        name={`cookingMethods.${key}`}
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                        <Checkbox
                                checked={field.value ?? false}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>{label}</FormLabel>
                      </div>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={control}
                    name="recommendedProteins"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Recommended Proteins</FormLabel>
                        <FormControl>
                    <Textarea
                            placeholder="Organic chicken, wild-caught fish, grass-fed beef, free-range eggs"
                            className="resize-none"
                      rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="recommendedVegetables"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Recommended Vegetables</FormLabel>
                        <FormControl>
                    <Textarea
                            placeholder="Leafy greens, cruciferous vegetables, bell peppers, cucumber, zucchini"
                            className="resize-none"
                      rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={control}
                    name="allowedFruits"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Allowed Fruits</FormLabel>
                        <FormControl>
                    <Textarea
                            placeholder="Berries, green apples, citrus fruits (limited portions)"
                            className="resize-none"
                      rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="healthyFats"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Healthy Fats (if allowed)</FormLabel>
                        <FormControl>
                    <Textarea
                            placeholder="Avocado, nuts, olive oil"
                            className="resize-none"
                      rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div>
                  <Label>Foods to Avoid</Label>
                  {/* Foods to Avoid Checkboxes */}
                  <div className="grid md:grid-cols-3 gap-4 mt-2">
                    {Object.entries({
                      processedFoods: "Processed foods",
                      sugaryDrinks: "Sugary drinks",
                      friedFoods: "Fried foods",
                      refinedCarbs: "Refined carbs",
                      dairy: "Dairy",
                      alcohol: "Alcohol",
                      artificialSweeteners: "Artificial sweeteners",
                      cookingOils: "Cooking oils",
                    }).map(([key, label]) => (
                      <FormField
                        key={key}
                        control={control}
                        name={`foodsToAvoid.${key}`}
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                        <Checkbox
                                checked={field.value ?? false}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>{label}</FormLabel>
                      </div>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </div>

               <div className="space-y-4 md:space-y-0 md:flex md:flex-col">
                  <div className="mb-2 md:mb-4">
                    <FormField
                      control={control}
                      name="foodAllergies"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Food Allergies</FormLabel>
                          <FormControl>
                            <Input placeholder="List any food allergies" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <Label>Dietary Preferences</Label>
                    <div className="grid md:grid-cols-3 gap-4 mt-2">
                      {dietaryOptions.map(opt => (
                        <FormField
                          key={opt.key}
                          control={control}
                          name={`dietaryPreferences.${opt.key}`}
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value ?? false}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>{opt.label}</FormLabel>
                              </div>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Portion Guidelines */}
            <Card>
              <CardHeader>
                <CardTitle>Portion Guidelines</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Protein(g)</TableHead>
                      <TableHead>Fruit(g)</TableHead>
                      <TableHead>Vegetables(g)</TableHead>
                      <TableHead>Carbs(g)</TableHead>     
                      <TableHead>Fats(g)</TableHead>
                      <TableHead>Other(g)</TableHead>
                      <TableHead>Calories</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {watch("portionGuidelines").map((guideline, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <FormField
                            control={control}
                            name={`portionGuidelines.${index}.protein`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <FormField
                            control={control}
                            name={`portionGuidelines.${index}.fruit`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <FormField
                            control={control}
                            name={`portionGuidelines.${index}.vegetables`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <FormField
                            control={control}
                            name={`portionGuidelines.${index}.carbs`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <FormField
                            control={control}
                            name={`portionGuidelines.${index}.fats`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <FormField
                            control={control}
                            name={`portionGuidelines.${index}.other`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <FormField
                            control={control}
                            name={`portionGuidelines.${index}.calories`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={() => {
                              const current = getValues("portionGuidelines");
                              setValue("portionGuidelines", current.filter((_, i) => i !== index), { shouldValidate: true, shouldDirty: true });
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Button type="button" onClick={() => {
                  const current = getValues("portionGuidelines");
                  setValue("portionGuidelines", [...current, { protein: "", fruit: "", vegetables: "", carbs: "", fats: "", other: "", calories: "" }]);
                }} className="mt-4">
                  <Plus className="mr-2 h-4 w-4" /> Add Portion Guidelines
                </Button>
              </CardContent>
            </Card>

            {/* Supplements */}
            <Card>
              <CardHeader>
                <CardTitle>Supplements</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Purpose</TableHead>
                      <TableHead>Dosage</TableHead>
                      <TableHead>Timing</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {watch("supplements").map((supplement, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <FormField
                            control={control}
                            name={`supplements.${index}.name`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <FormField
                            control={control}
                            name={`supplements.${index}.purpose`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <FormField
                            control={control}
                            name={`supplements.${index}.dosage`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <FormField
                            control={control}
                            name={`supplements.${index}.timing`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell>
                              <Button
                            type="button"
                                variant="destructive"
                            size="icon"
                                onClick={() => removeSupplement(index)}
                              >
                            <Trash2 className="h-4 w-4" />
                              </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Button type="button" onClick={addSupplement} className="mt-4">
                  <Plus className="mr-2 h-4 w-4" /> Add Supplement
                  </Button>
              </CardContent>
            </Card>

            {/* Weekly Schedule */}
            <Card>
              <CardHeader>
                <CardTitle>Weekly Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Week</TableHead>
                      <TableHead>Focus Area</TableHead>
                      <TableHead>Coach Notes</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {watch("weeklySchedule").map((weekItem, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <FormField
                            control={control}
                            name={`weeklySchedule.${index}.week`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <FormField
                            control={control}
                            name={`weeklySchedule.${index}.focusArea`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <FormField
                            control={control}
                            name={`weeklySchedule.${index}.coachNotes`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell>
                  <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={() => removeWeek(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                  </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Button type="button" onClick={addWeek} className="mt-4">
                  <Plus className="mr-2 h-4 w-4" /> Add Week
                </Button>
              </CardContent>
            </Card>

            {/* Lifestyle */}
            <Card>
              <CardHeader>
                <CardTitle>Lifestyle</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={control}
                    name="lifestyle.dailyJournaling"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                    <Checkbox
                            checked={field.value ?? false}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Daily Journaling</FormLabel>
                          <FormDescription>
                            Encourage daily journaling for clients
                          </FormDescription>
                  </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="lifestyle.gratitudePractice"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                    <Checkbox
                            checked={field.value ?? false}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Gratitude Practice</FormLabel>
                          <FormDescription>
                            Promote daily gratitude practice
                          </FormDescription>
                  </div>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={control}
                    name="lifestyle.sleepGoal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sleep Goal (hours)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="lifestyle.movementGoal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Movement Goal</FormLabel>
                        <FormControl>
                    <Input
                            placeholder="e.g., 10,000 steps/day"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Messaging Preferences */}
            <Card>
              <CardHeader>
                <CardTitle>AI Messaging Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={control}
                  name="messagingPreferences.tone"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Message tone</FormLabel>
                      <FormControl>
                  <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="gentle-encouragement" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Gentle encouragement
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="tough-love" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Tough love
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="humor-lightness" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Humor & lightness
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="direct-clinical" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Direct & clinical
                            </FormLabel>
                          </FormItem>
                  </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="messagingPreferences.keywords"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Motivational keywords/phrases</FormLabel>
                      <FormControl>
                  <Textarea
                          placeholder="Enter keywords and phrases that resonate with clients"
                          className="resize-none"
                    rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

        <DialogFooter className="flex-shrink-0 pt-4 border-t bg-background">
          <Button type="submit" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Template"}
          </Button>
        </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
