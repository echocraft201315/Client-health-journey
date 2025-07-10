import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { X, Plus } from "lucide-react";

import { Button } from "../../components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Checkbox } from "../../components/ui/checkbox";
import { Badge } from "../../components/ui/badge";
import { Textarea } from "../../components/ui/textarea";
import { Card } from "../../components/ui/card";

const formSchema = z.object({
  program: z.enum([
    "practice_naturals",
    "chirothin",
    "keto",
    "nutrition",
    "fitness",
    "custom",
  ]),
  programCategory: z.enum(["A", "B", "C"]).optional(),
  days: z.number().int().min(1).max(14).default(7),
  allergies: z.array(z.string()).default([]),
  likes: z.array(z.string()).default([]),
  dislikes: z.array(z.string()).default([]),
  dietaryRestrictions: z.array(z.string()).default([]),
  clientName: z.string().optional(),
  clientEmail: z.string().email().optional(),
});

export function MealPlanForm({ clientId, onComplete }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [newAllergy, setNewAllergy] = useState("");
  const [newLike, setNewLike] = useState("");
  const [newDislike, setNewDislike] = useState("");
  const [newRestriction, setNewRestriction] = useState("");
  const [generatedPlan, setGeneratedPlan] = useState(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      program: "practice_naturals",
      days: 7,
      allergies: [],
      likes: [],
      dislikes: [],
      dietaryRestrictions: [],
    },
  });
  const watchProgram = "practice_naturals";
  const onSubmit = async (values) => {};

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">
          Create Personalized Meal Plan
        </h2>
        <p className="text-muted-foreground">
          Generate a custom meal plan based on dietary preferences and program
          requirements.
        </p>
      </div>

      {!generatedPlan ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="program"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Program</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select program" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="practice_naturals">
                            Practice Naturals
                          </SelectItem>
                          <SelectItem value="chirothin">ChiroThin</SelectItem>
                          <SelectItem value="nutrition">
                            Basic Nutrition
                          </SelectItem>
                          <SelectItem value="keto">Keto</SelectItem>
                          <SelectItem value="fitness">Fitness</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {watchProgram === "practice_naturals" && (
                  <FormField
                    control={form.control}
                    name="programCategory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Program Category</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="A">Category A</SelectItem>
                            <SelectItem value="B">Category B</SelectItem>
                            <SelectItem value="C">Category C</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="days"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Days</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          max={14}
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <div>
                    <FormLabel>Food Allergies</FormLabel>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Add an allergy..."
                        value={newAllergy}
                        onChange={(e) => setNewAllergy(e.target.value)}
                        className="flex-1"
                      />
                      <Button type="button" size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {form.watch("allergies").map((allergy, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="px-2 py-1"
                        >
                          {allergy}
                          <X
                            className="ml-1 h-3 w-3 cursor-pointer"
                            onClick={() => handleRemoveItem("allergies", index)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <FormLabel>Food Likes</FormLabel>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Add foods you like..."
                        value={newLike}
                        onChange={(e) => setNewLike(e.target.value)}
                        className="flex-1"
                      />
                      <Button type="button" size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {form.watch("likes").map((like, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="px-2 py-1"
                        >
                          {like}
                          <X
                            className="ml-1 h-3 w-3 cursor-pointer"
                            onClick={() => handleRemoveItem("likes", index)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <FormLabel>Food Dislikes</FormLabel>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Add foods you dislike..."
                      value={newDislike}
                      onChange={(e) => setNewDislike(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="button" size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form.watch("dislikes").map((dislike, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="px-2 py-1"
                      >
                        {dislike}
                        <X
                          className="ml-1 h-3 w-3 cursor-pointer"
                          onClick={() => handleRemoveItem("dislikes", index)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <FormLabel>Dietary Restrictions</FormLabel>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Add dietary restrictions..."
                      value={newRestriction}
                      onChange={(e) => setNewRestriction(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="button" size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form
                      .watch("dietaryRestrictions")
                      .map((restriction, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="px-2 py-1"
                        >
                          {restriction}
                          <X
                            className="ml-1 h-3 w-3 cursor-pointer"
                            onClick={() =>
                              handleRemoveItem("dietaryRestrictions", index)
                            }
                          />
                        </Badge>
                      ))}
                  </div>
                </div>

                {!clientId && (
                  <>
                    <FormField
                      control={form.control}
                      name="clientName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Client Name (Optional)</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="clientEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Client Email (Optional)</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </div>
            </div>

            <Button
              type="submit"
              disabled={isGenerating}
              className="w-full md:w-auto"
            >
              {isGenerating ? "Generating..." : "Generate Meal Plan"}
            </Button>
          </form>
        </Form>
      ) : (
        <MealPlanDisplay
          mealPlan={generatedPlan.mealPlan}
          shoppingList={generatedPlan.shoppingList}
          onBack={() => setGeneratedPlan(null)}
          clientEmail={form.getValues("clientEmail")}
          clientName={form.getValues("clientName")}
        />
      )}
    </div>
  );
}

function MealPlanDisplay({
  mealPlan,
  shoppingList,
  onBack,
  clientEmail,
  clientName,
}) {
  const [isSending, setIsSending] = useState(false);

  const convertToHtml = (text) => {
    return text
      .split("\n\n")
      .map((paragraph) => {
        // Handle lists
        if (paragraph.startsWith("- ")) {
          const items = paragraph
            .split("\n")
            .filter((line) => line.startsWith("- "))
            .map((line) => `<li>${line.substring(2)}</li>`)
            .join("");
          return `<ul>${items}</ul>`;
        }

        // Handle headings
        if (paragraph.startsWith("# ")) {
          return `<h2>${paragraph.substring(2)}</h2>`;
        }
        if (paragraph.startsWith("## ")) {
          return `<h3>${paragraph.substring(3)}</h3>`;
        }
        if (paragraph.startsWith("### ")) {
          return `<h4>${paragraph.substring(4)}</h4>`;
        }

        // Handle bold and italic text
        let processed = paragraph
          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
          .replace(/\*(.*?)\*/g, "<em>$1</em>");

        // Convert remaining newlines to <br />
        processed = processed.replace(/\n/g, "<br />");

        return `<p>${processed}</p>`;
      })
      .join("");
  };

  const handleEmailMealPlan = async () => {
    if (!clientEmail) {
      alert("Client email is required to send the meal plan");
      return;
    }

    try {
      setIsSending(true);

      const response = await supabase.functions.invoke("email-meal-plan", {
        body: {
          email: clientEmail,
          name: clientName || "Client",
          subject: "7-Day Meal Plan",
          mealPlan: mealPlan,
          shoppingList: shoppingList,
        },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      alert("Meal plan has been emailed successfully!");
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Failed to send email. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          Back to Form
        </Button>

        {clientEmail && (
          <Button onClick={handleEmailMealPlan} disabled={isSending}>
            {isSending ? "Sending..." : "Email to Client"}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">7-Day Meal Plan</h3>
          <div
            className="prose max-w-none overflow-auto max-h-[600px] whitespace-pre-wrap"
            dangerouslySetInnerHTML={{
              __html: `<p>${convertToHtml(mealPlan)}</p>`,
            }}
          ></div>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Shopping List</h3>
          <div
            className="prose max-w-none overflow-auto max-h-[600px] whitespace-pre-wrap"
            dangerouslySetInnerHTML={{
              __html: `<p>${convertToHtml(shoppingList)}</p>`,
            }}
          ></div>
        </Card>
      </div>
    </div>
  );
}
