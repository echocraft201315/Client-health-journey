import React from "react";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { Slider } from "../../../components/ui/slider";

const WellnessTab = ({ register, errors, formData, setValue }) => {
  return (
    <div className="space-y-6 px-2">
      <div>
        <div className="flex flex-col sm:flex-row justify-between mb-2 gap-2">
          <Label className="mb-2">Energy Level (1-10)</Label>
          <span className="text-primary-600 font-medium">
            {formData.energyLevel}/10
          </span>
        </div>
        <Slider
          defaultValue={[5]}
          max={10}
          min={1}
          step={1}
          value={[formData.energyLevel]}
          onValueChange={(value) => setValue("energyLevel", value[0])}
          className="py-4"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>Low Energy</span>
          <span>High Energy</span>
        </div>
        {errors.energyLevel && (
          <span className="text-red-500 text-sm">{errors.energyLevel.message}</span>
        )}
      </div>

      <div>
        <div className="flex flex-col sm:flex-row justify-between mb-2 gap-2">
          <Label className="mb-2">Mood (1-10)</Label>
          <span className="text-primary-600 font-medium">
            {formData.moodLevel}/10
          </span>
        </div>
        <Slider
          defaultValue={[5]}
          max={10}
          min={1}
          step={1}
          value={[formData.moodLevel]}
          onValueChange={(value) => setValue("moodLevel", value[0])}
          className="py-4"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>Poor Mood</span>
          <span>Great Mood</span>
        </div>
        {errors.moodLevel && (
          <span className="text-red-500 text-sm">{errors.moodLevel.message}</span>
        )}
      </div>

      <div>
        <Label htmlFor="sleepHours" className="mb-2">Last Night's Sleep (hours)</Label>
        <div className="flex items-center gap-2 mt-[10px]">
          <Input
            {...register("sleepHours")}
            type="number"
            placeholder="Hours of sleep"
            className="max-w-[120px]"
            min="0"
            max="24"
            step="0.5"
          />
          <span className="text-sm text-gray-500">hours</span>
        </div>
        {errors.sleepHours && (
          <span className="text-red-500 text-sm">{errors.sleepHours.message}</span>
        )}
      </div>
    </div>
  );
};

export default WellnessTab;
