"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText, Sparkles, Plus } from "lucide-react";

const templates = [
  {
    id: "practice-naturals",
    name: "30-Day Reset Program",
    category: "Practice Naturals",
    description: "Comprehensive metabolic reset with natural supplements",
    duration: "30 days",
    tags: ["Weight Loss", "Detox"],
  },
  {
    id: "chirothin",
    name: "21-Day ChiroThin Protocol",
    category: "ChiroThin",
    description: "Structured weight loss program with ChiroThin supplements",
    duration: "21 days",
    tags: ["Rapid Weight Loss"],
  },
  {
    id: "keto",
    name: "28-Day Keto Kickstart",
    category: "Keto",
    description: "High-fat, low-carb program for metabolic transformation",
    duration: "28 days",
    tags: ["Ketosis", "Fat Burning"],
  },
  {
    id: "athlete",
    name: "45-Day Athletic Performance",
    category: "Athlete",
    description: "Performance-focused nutrition for active individuals",
    duration: "45 days",
    tags: ["Performance", "Recovery"],
  },
  {
    id: "fasting",
    name: "14-Day Intermittent Fasting",
    category: "Fasting",
    description: "Gentle introduction to intermittent fasting protocols",
    duration: "14 days",
    tags: ["Autophagy", "Metabolic Health"],
  },
  {
    id: "lazy",
    name: "60-Day Gentle Approach",
    category: "Lazy",
    description: "Low-effort, sustainable changes for long-term success",
    duration: "60 days",
    tags: ["Sustainable", "Easy"],
  },
];

export default function ProgramWizard() {
  const [currentStep, setCurrentStep] = useState("start");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [formData, setFormData] = useState({
    programName: "30-Day Practice Naturals Reset",
    programLength: "30",
    programType: "Practice Naturals",
    checkInDaily: true,
    checkInWeekly: true,
    description:
      "Comprehensive metabolic reset using natural supplements and whole foods approach",
    goals: {
      weightLoss: true,
      metabolicReset: true,
      detox: true,
      improvedEnergy: false,
      gutHealth: false,
      hormoneBalance: false,
    },
    foodRules: {
      noCookingOils: true,
      oilFreeDressings: true,
    },
    cookingMethods: {
      grill: true,
      bake: true,
      steam: true,
      poach: false,
    },
    recommendedProteins:
      "Organic chicken, wild-caught fish, grass-fed beef, free-range eggs",
    recommendedVegetables:
      "Leafy greens, cruciferous vegetables, bell peppers, cucumber, zucchini",
    allowedFruits: "Berries, green apples, citrus fruits (limited portions)",
    healthyFats: "Avocado, nuts, olive oil",
    foodsToAvoid: {
      processedFoods: true,
      sugaryDrinks: true,
      friedFoods: true,
      refinedCarbs: true,
      dairy: true,
      alcohol: true,
      artificialSweeteners: true,
      cookingOils: true,
    },
    portionGuidelines: {
      proteinPerMeal: "4",
      proteinMealsPerDay: "3",
      vegetablesPerMeal: "6",
      fruitsPerDay: "4",
      dailyWaterIntake: "64",
      additionalNotes: "Meal timing, fasting windows, etc.",
    },
    supplements: [
      {
        name: "Metabolic Support",
        purpose: "Boost metabolism",
        dosage: "2 capsules",
        timing: "Morning with food",
      },
      {
        name: "Liver Detox",
        purpose: "Support detoxification",
        dosage: "1 capsule",
        timing: "Evening before bed",
      },
    ],
    weeklySchedule: [
      {
        week: 1,
        focusArea: "Initial adaptation",
        coachNotes: "Monitor compliance",
      },
      {
        week: 2,
        focusArea: "Habit formation",
        coachNotes: "Address challenges",
      },
      {
        week: 3,
        focusArea: "Progress assessment",
        coachNotes: "Mid-program evaluation",
      },
      { week: 4, focusArea: "Optimization", coachNotes: "Fine-tune approach" },
    ],
    lifestyle: {
      dailyJournaling: false,
      gratitudePractice: false,
      sleepGoal: "8",
      movementGoal: "10,000 steps/day",
    },
    messagingPreferences: {
      tone: "gentle-encouragement",
      keywords: "Enter keywords and phrases that resonate with clients",
    },
  });

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateNestedFormData = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const addSupplement = () => {
    setFormData((prev) => ({
      ...prev,
      supplements: [
        ...prev.supplements,
        {
          name: "",
          purpose: "",
          dosage: "",
          timing: "",
        },
      ],
    }));
  };

  const removeSupplement = (index) => {
    setFormData((prev) => ({
      ...prev,
      supplements: prev.supplements.filter((_, i) => i !== index),
    }));
  };

  const addWeek = () => {
    const nextWeek = formData.weeklySchedule.length + 1;
    setFormData((prev) => ({
      ...prev,
      weeklySchedule: [
        ...prev.weeklySchedule,
        {
          week: nextWeek,
          focusArea: "",
          coachNotes: "",
        },
      ],
    }));
  };

  if (currentStep === "start") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-4xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-gray-800">
              Create New Program
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-lg p-8 text-white">
              <h2 className="text-xl font-semibold mb-6">
                Choose Your Starting Point
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Card
                  className="bg-white/10 border-2 border-white/20 hover:border-white/40 cursor-pointer transition-all hover:bg-blue-50 transition-colors"
                  onClick={() => setCurrentStep("templates")}
                >
                  <CardContent className="p-6 text-center">
                    <FileText className="w-12 h-12 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      Use Existing Template
                    </h3>
                    <p className="text-sm opacity-90">
                      Start with a proven program template and customize as
                      needed
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-white/10 border-2 border-white/20 hover:border-white/40 cursor-pointer transition-all hover:bg-blue-50 transition-colors">
                  <CardContent className="p-6 text-center">
                    <Sparkles className="w-12 h-12 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      Create from Scratch
                    </h3>
                    <p className="text-sm opacity-90">
                      Build a completely custom program from the ground up
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentStep === "templates") {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-6xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-gray-800">
                Create New Program
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-lg p-8 text-white mb-8">
                <h2 className="text-xl font-semibold mb-6">
                  Choose Your Starting Point
                </h2>
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <Card className="bg-white/10 border-2 border-green-400 border-white/40">
                    <CardContent className="p-6 text-center">
                      <FileText className="w-12 h-12 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        Use Existing Template
                      </h3>
                      <p className="text-sm opacity-90">
                        Start with a proven program template and customize as
                        needed
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-white/10 border-2 border-white/20 hover:border-white/40 cursor-pointer transition-all">
                    <CardContent className="p-6 text-center">
                      <Sparkles className="w-12 h-12 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        Create from Scratch
                      </h3>
                      <p className="text-sm opacity-90">
                        Build a completely custom program from the ground up
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <h3 className="text-lg font-semibold mb-4">
                  Select a Template
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {templates.map((template) => (
                    <Card
                      key={template.id}
                      className={`bg-white cursor-pointer transition-all hover:shadow-md hover:bg-blue-50 ${
                        selectedTemplate === template.id
                          ? "ring-2 ring-blue-500 bg-blue-50"
                          : ""
                      }`}
                      onClick={() => {
                        setSelectedTemplate(template.id);
                        if (template.id === "practice-naturals") {
                          setCurrentStep("form");
                        }
                      }}
                    >
                      <CardContent className="p-4">
                        <div className="mb-2">
                          <span className="inline-block px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded">
                            {template.category}
                          </span>
                        </div>
                        <h4 className="font-semibold text-gray-800 mb-2">
                          {template.name}
                        </h4>
                        <p className="text-sm text-gray-600 mb-3">
                          {template.description}
                        </p>
                        <div className="text-xs text-gray-500 mb-2">
                          {template.duration}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {template.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-gray-800">
              Create New Program
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Template Selection Summary */}
        <Card>
          <CardContent className="p-6">
            <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-lg p-6 text-white">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <Card className="bg-white/10 border-2 border-green-400">
                  <CardContent className="p-4 text-center">
                    <FileText className="w-8 h-8 mx-auto mb-2" />
                    <h3 className="font-semibold">Use Existing Template</h3>
                    <p className="text-xs opacity-90">
                      Start with a proven program template and customize as
                      needed
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-white/10 border-2 border-white/20">
                  <CardContent className="p-4 text-center">
                    <Sparkles className="w-8 h-8 mx-auto mb-2" />
                    <h3 className="font-semibold">Create from Scratch</h3>
                    <p className="text-xs opacity-90">
                      Build a completely custom program from the ground up
                    </p>
                  </CardContent>
                </Card>
              </div>

              <h3 className="font-semibold mb-4">Select a Template</h3>
              <div className="grid md:grid-cols-3 gap-3">
                {templates.map((template) => (
                  <Card
                    key={template.id}
                    className={`bg-white ${
                      selectedTemplate === template.id
                        ? "ring-2 ring-blue-500"
                        : ""
                    }`}
                  >
                    <CardContent className="p-3">
                      <div className="mb-1">
                        <span className="inline-block px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded">
                          {template.category}
                        </span>
                      </div>
                      <h4 className="font-semibold text-gray-800 text-sm mb-1">
                        {template.name}
                      </h4>
                      <p className="text-xs text-gray-600 mb-2">
                        {template.description}
                      </p>
                      <div className="text-xs text-gray-500">
                        {template.duration} • {template.tags.join(" • ")}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Program Basics */}
        <Card>
          <CardHeader>
            <CardTitle>Program Basics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="programName">Program Name *</Label>
                <Input
                  id="programName"
                  value={formData.programName}
                  onChange={(e) =>
                    updateFormData("programName", e.target.value)
                  }
                />
              </div>
              <div>
                <Label htmlFor="programLength">Program Length (days) *</Label>
                <Input
                  id="programLength"
                  value={formData.programLength}
                  onChange={(e) =>
                    updateFormData("programLength", e.target.value)
                  }
                />
              </div>
            </div>

            <div>
              <Label htmlFor="programType">Program Type</Label>
              <Select
                value={formData.programType}
                onValueChange={(value) => updateFormData("programType", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Practice Naturals">
                    Practice Naturals
                  </SelectItem>
                  <SelectItem value="ChiroThin">ChiroThin</SelectItem>
                  <SelectItem value="Keto">Keto</SelectItem>
                  <SelectItem value="Custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Check-In Frequency</Label>
              <div className="flex gap-6 mt-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="daily"
                    checked={formData.checkInDaily}
                    onCheckedChange={(checked) =>
                      updateFormData("checkInDaily", checked)
                    }
                  />
                  <Label htmlFor="daily">Daily</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="weekly"
                    checked={formData.checkInWeekly}
                    onCheckedChange={(checked) =>
                      updateFormData("checkInWeekly", checked)
                    }
                  />
                  <Label htmlFor="weekly">Weekly</Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Program Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Program Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="description">Program Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => updateFormData("description", e.target.value)}
                rows={3}
              />
            </div>

            <div>
              <Label>Program Goals</Label>
              <div className="grid md:grid-cols-3 gap-4 mt-2">
                {Object.entries({
                  weightLoss: "Weight Loss",
                  metabolicReset: "Metabolic Reset",
                  improvedEnergy: "Improved Energy",
                  gutHealth: "Gut Health",
                  detox: "Detox",
                  hormoneBalance: "Hormone Balance",
                }).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <Checkbox
                      id={key}
                      checked={formData.goals[key]}
                      onCheckedChange={(checked) =>
                        updateNestedFormData("goals", key, checked)
                      }
                    />
                    <Label htmlFor={key}>{label}</Label>
                  </div>
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
              <div className="grid md:grid-cols-2 gap-4 mt-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="noCookingOils"
                    checked={formData.foodRules.noCookingOils}
                    onCheckedChange={(checked) =>
                      updateNestedFormData(
                        "foodRules",
                        "noCookingOils",
                        checked
                      )
                    }
                  />
                  <Label htmlFor="noCookingOils">No cooking oils</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="oilFreeDressings"
                    checked={formData.foodRules.oilFreeDressings}
                    onCheckedChange={(checked) =>
                      updateNestedFormData(
                        "foodRules",
                        "oilFreeDressings",
                        checked
                      )
                    }
                  />
                  <Label htmlFor="oilFreeDressings">
                    Oil-free salad dressings
                  </Label>
                </div>
              </div>
            </div>

            <div>
              <Label>Allowed Cooking Methods</Label>
              <div className="grid md:grid-cols-4 gap-4 mt-2">
                {Object.entries({
                  grill: "Grill",
                  bake: "Bake",
                  steam: "Steam",
                  poach: "Poach",
                }).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <Checkbox
                      id={key}
                      checked={formData.cookingMethods[key]}
                      onCheckedChange={(checked) =>
                        updateNestedFormData("cookingMethods", key, checked)
                      }
                    />
                    <Label htmlFor={key}>{label}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="recommendedProteins">
                  Recommended Proteins
                </Label>
                <Textarea
                  id="recommendedProteins"
                  value={formData.recommendedProteins}
                  onChange={(e) =>
                    updateFormData("recommendedProteins", e.target.value)
                  }
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="recommendedVegetables">
                  Recommended Vegetables
                </Label>
                <Textarea
                  id="recommendedVegetables"
                  value={formData.recommendedVegetables}
                  onChange={(e) =>
                    updateFormData("recommendedVegetables", e.target.value)
                  }
                  rows={3}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="allowedFruits">Allowed Fruits</Label>
                <Textarea
                  id="allowedFruits"
                  value={formData.allowedFruits}
                  onChange={(e) =>
                    updateFormData("allowedFruits", e.target.value)
                  }
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="healthyFats">Healthy Fats (if allowed)</Label>
                <Textarea
                  id="healthyFats"
                  value={formData.healthyFats}
                  onChange={(e) =>
                    updateFormData("healthyFats", e.target.value)
                  }
                  rows={3}
                />
              </div>
            </div>

            <div>
              <Label>Foods to Avoid (commonly restricted)</Label>
              <div className="grid md:grid-cols-3 gap-4 mt-2">
                {Object.entries({
                  processedFoods: "Processed foods",
                  sugaryDrinks: "Sugary drinks/juices",
                  friedFoods: "Fried foods",
                  refinedCarbs: "Refined carbs",
                  dairy: "Dairy",
                  alcohol: "Alcohol",
                  artificialSweeteners: "Artificial sweeteners",
                  cookingOils: "Cooking oils",
                }).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <Checkbox
                      id={key}
                      checked={formData.foodsToAvoid[key]}
                      onCheckedChange={(checked) =>
                        updateNestedFormData("foodsToAvoid", key, checked)
                      }
                    />
                    <Label htmlFor={key}>{label}</Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Portion Guidelines */}
        <Card>
          <CardHeader>
            <CardTitle>Portion Guidelines</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="proteinPerMeal">Protein per meal (oz)</Label>
                <Input
                  id="proteinPerMeal"
                  value={formData.portionGuidelines.proteinPerMeal}
                  onChange={(e) =>
                    updateNestedFormData(
                      "portionGuidelines",
                      "proteinPerMeal",
                      e.target.value
                    )
                  }
                />
              </div>
              <div>
                <Label htmlFor="proteinMealsPerDay">
                  Protein meals per day
                </Label>
                <Input
                  id="proteinMealsPerDay"
                  value={formData.portionGuidelines.proteinMealsPerDay}
                  onChange={(e) =>
                    updateNestedFormData(
                      "portionGuidelines",
                      "proteinMealsPerDay",
                      e.target.value
                    )
                  }
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="vegetablesPerMeal">
                  Vegetables per meal (oz)
                </Label>
                <Input
                  id="vegetablesPerMeal"
                  value={formData.portionGuidelines.vegetablesPerMeal}
                  onChange={(e) =>
                    updateNestedFormData(
                      "portionGuidelines",
                      "vegetablesPerMeal",
                      e.target.value
                    )
                  }
                />
              </div>
              <div>
                <Label htmlFor="fruitsPerDay">Fruits per day (oz)</Label>
                <Input
                  id="fruitsPerDay"
                  value={formData.portionGuidelines.fruitsPerDay}
                  onChange={(e) =>
                    updateNestedFormData(
                      "portionGuidelines",
                      "fruitsPerDay",
                      e.target.value
                    )
                  }
                />
              </div>
            </div>

            <div>
              <Label htmlFor="dailyWaterIntake">Daily water intake (oz)</Label>
              <Input
                id="dailyWaterIntake"
                value={formData.portionGuidelines.dailyWaterIntake}
                onChange={(e) =>
                  updateNestedFormData(
                    "portionGuidelines",
                    "dailyWaterIntake",
                    e.target.value
                  )
                }
              />
            </div>

            <div>
              <Label htmlFor="additionalNotes">Additional portion notes</Label>
              <Textarea
                id="additionalNotes"
                value={formData.portionGuidelines.additionalNotes}
                onChange={(e) =>
                  updateNestedFormData(
                    "portionGuidelines",
                    "additionalNotes",
                    e.target.value
                  )
                }
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Supplement Protocol */}
        <Card>
          <CardHeader>
            <CardTitle>Supplement Protocol</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 p-2 text-left">
                        Supplement
                      </th>
                      <th className="border border-gray-300 p-2 text-left">
                        Purpose
                      </th>
                      <th className="border border-gray-300 p-2 text-left">
                        Dosage
                      </th>
                      <th className="border border-gray-300 p-2 text-left">
                        Timing
                      </th>
                      <th className="border border-gray-300 p-2 text-left">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.supplements.map((supplement, index) => (
                      <tr key={index}>
                        <td className="border border-gray-300 p-2">
                          {supplement.name}
                        </td>
                        <td className="border border-gray-300 p-2">
                          {supplement.purpose}
                        </td>
                        <td className="border border-gray-300 p-2">
                          {supplement.dosage}
                        </td>
                        <td className="border border-gray-300 p-2">
                          {supplement.timing}
                        </td>
                        <td className="border border-gray-300 p-2">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeSupplement(index)}
                          >
                            Remove
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Button
                onClick={addSupplement}
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white"
              >
                <Plus className="w-4 h-4" />
                Add Supplement
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Schedule */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 p-2 text-left">
                        Week
                      </th>
                      <th className="border border-gray-300 p-2 text-left">
                        Focus Area
                      </th>
                      <th className="border border-gray-300 p-2 text-left">
                        Coach Notes
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.weeklySchedule.map((week, index) => (
                      <tr key={index}>
                        <td className="border border-gray-300 p-2">
                          {week.week}
                        </td>
                        <td className="border border-gray-300 p-2">
                          {week.focusArea}
                        </td>
                        <td className="border border-gray-300 p-2">
                          {week.coachNotes}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Button
                onClick={addWeek}
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white"
              >
                <Plus className="w-4 h-4" />
                Add Week
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Lifestyle & Mindset */}
        <Card>
          <CardHeader>
            <CardTitle>Lifestyle & Mindset</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="dailyJournaling"
                  checked={formData.lifestyle.dailyJournaling}
                  onCheckedChange={(checked) =>
                    updateNestedFormData(
                      "lifestyle",
                      "dailyJournaling",
                      checked
                    )
                  }
                />
                <Label htmlFor="dailyJournaling">Daily journaling</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="gratitudePractice"
                  checked={formData.lifestyle.gratitudePractice}
                  onCheckedChange={(checked) =>
                    updateNestedFormData(
                      "lifestyle",
                      "gratitudePractice",
                      checked
                    )
                  }
                />
                <Label htmlFor="gratitudePractice">Gratitude practice</Label>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sleepGoal">Sleep goal (hours/night)</Label>
                <Input
                  id="sleepGoal"
                  value={formData.lifestyle.sleepGoal}
                  onChange={(e) =>
                    updateNestedFormData(
                      "lifestyle",
                      "sleepGoal",
                      e.target.value
                    )
                  }
                />
              </div>
              <div>
                <Label htmlFor="movementGoal">Movement goal</Label>
                <Input
                  id="movementGoal"
                  value={formData.lifestyle.movementGoal}
                  onChange={(e) =>
                    updateNestedFormData(
                      "lifestyle",
                      "movementGoal",
                      e.target.value
                    )
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Messaging Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>AI Messaging Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Message tone</Label>
              <RadioGroup
                value={formData.messagingPreferences.tone}
                onValueChange={(value) =>
                  updateNestedFormData("messagingPreferences", "tone", value)
                }
                className="mt-2"
              >
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="gentle-encouragement" id="gentle" />
                    <Label htmlFor="gentle">Gentle encouragement</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="tough-love" id="tough" />
                    <Label htmlFor="tough">Tough love</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="humor-lightness" id="humor" />
                    <Label htmlFor="humor">Humor & lightness</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="direct-clinical" id="direct" />
                    <Label htmlFor="direct">Direct & clinical</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="keywords">Motivational keywords/phrases</Label>
              <Textarea
                id="keywords"
                value={formData.messagingPreferences.keywords}
                onChange={(e) =>
                  updateNestedFormData(
                    "messagingPreferences",
                    "keywords",
                    e.target.value
                  )
                }
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <Card>
          <CardContent className="p-6 text-center">
            <Button
              size="lg"
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3"
            >
              Create Program
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
