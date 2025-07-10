import React from "react";
import { Textarea } from "../../../components/ui/textarea";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";

const MealSection = ({ title, register, errors, formData, setValue, prefix }) => {
  // Only show nutrition guidance for main meals, not snacks
  const mealType = title.toLowerCase();
  const showGuidance = mealType !== "snacks";

  const mealId = mealType.toLowerCase();

  return (
    <div className="space-y-4 mb-6 px-2">
      <h3 className="font-medium text-lg">{title}</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor={`${prefix}Protein`}>Protein</Label>
          <Textarea
            {...register(`${prefix}Protein`)}
            placeholder={`What protein did you have for ${title.toLowerCase()}?`}
            rows={2}
          />
          {errors[`${prefix}Protein`] && (
            <span className="text-red-500 text-sm">{errors[`${prefix}Protein`].message}</span>
          )}
        </div>
        <div>
          <Label htmlFor={`${prefix}ProteinPortion`}>
            Protein Portion (oz)
          </Label>
          <Input
            {...register(`${prefix}ProteinPortion`)}
            type="number"
            placeholder="Portion size"
          />
          {errors[`${prefix}ProteinPortion`] && (
            <span className="text-red-500 text-sm">{errors[`${prefix}ProteinPortion`].message}</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor={`${prefix}Fruit`}>Fruit</Label>
          <Textarea
            {...register(`${prefix}Fruit`)}
            placeholder={`What fruit did you have for ${title.toLowerCase()}?`}
            rows={2}
          />
          {errors[`${prefix}Fruit`] && (
            <span className="text-red-500 text-sm">{errors[`${prefix}Fruit`].message}</span>
          )}
        </div>
        <div>
          <Label htmlFor={`${prefix}FruitPortion`}>Fruit Portion (oz)</Label>
          <Input
            {...register(`${prefix}FruitPortion`)}
            type="number"
            placeholder="Portion size"
          />
          {errors[`${prefix}FruitPortion`] && (
            <span className="text-red-500 text-sm">{errors[`${prefix}FruitPortion`].message}</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor={`${prefix}Vegetable`}>Vegetables</Label>
          <Textarea
            {...register(`${prefix}Vegetable`)}
            placeholder={`What vegetables did you have for ${title.toLowerCase()}?`}
            rows={2}
          />
          {errors[`${prefix}Vegetable`] && (
            <span className="text-red-500 text-sm">{errors[`${prefix}Vegetable`].message}</span>
          )}
        </div>
        <div>
          <Label htmlFor={`${prefix}VegetablePortion`}>
            Vegetable Portion (oz)
          </Label>
          <Input
            {...register(`${prefix}VegetablePortion`)}
            type="number"
            placeholder="Portion size"
          />
          {errors[`${prefix}VegetablePortion`] && (
            <span className="text-red-500 text-sm">{errors[`${prefix}VegetablePortion`].message}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MealSection;
