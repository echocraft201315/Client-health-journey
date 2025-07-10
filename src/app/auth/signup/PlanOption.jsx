import React from "react";
import { Check } from "lucide-react";
import { Label } from "../../components/ui/label";
import { cn } from "../../lib/utils";

const PlanOption = ({
  id,
  name,
  description,
  price,
  features,
  selected,
  onSelect,
}) => {
  return (
    <div
      className={cn(
        "border rounded-lg p-4 cursor-pointer transition-all",
        selected
          ? "border-primary bg-primary/5 shadow-sm"
          : "border-gray-200 hover:border-gray-300"
      )}
      onClick={onSelect}
      data-state={selected ? "checked" : "unchecked"}
    >
      <div className="flex items-start">
        <div className="h-4 w-4 mt-1 mr-2 rounded-full border border-primary relative">
          {selected && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-2.5 w-2.5 rounded-full bg-primary" />
            </div>
          )}
        </div>
        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <Label
              htmlFor={`plan-${id}`}
              className="text-lg font-medium cursor-pointer"
            >
              {name}
            </Label>
            <div className="text-lg font-bold text-primary">${price}/month</div>
          </div>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
          <ul className="mt-3 space-y-2">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center text-sm">
                <Check className="h-4 w-4 text-primary mr-2" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PlanOption;
