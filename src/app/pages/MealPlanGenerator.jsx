import React from "react";
import { MealPlanForm } from "../components/meal-plan/MealPlanForm";

const MealPlanGenerator = () => {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Meal Plan Generator</h1>
        <p className="text-muted-foreground mt-2">
          Create personalized meal plans and shopping lists for your clients
          based on their program and preferences.
        </p>
      </div>

      <MealPlanForm />
    </div>
  );
};

export default MealPlanGenerator;
