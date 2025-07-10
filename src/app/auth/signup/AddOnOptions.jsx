import React from "react";
import { Checkbox } from "../../components/ui/checkbox";

const AddOnOptions = ({ addOns, availableAddOns, onToggleAddOn }) => {
  if (availableAddOns.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4 mt-6 border-t pt-6">
      <h3 className="text-lg font-medium">Optional Add-ons</h3>
      <div className="space-y-3">
        {availableAddOns.map((addon) => (
          <div
            key={addon.id}
            className="border rounded-lg p-4 bg-background hover:bg-background/80"
          >
            <div className="flex items-start">
              <Checkbox
                id={`addon-${addon.id}`}
                checked={addOns.includes(addon.id)}
                onCheckedChange={(checked) =>
                  onToggleAddOn(addon.id, checked === true)
                }
                className="mt-1 mr-2"
              />
              <div>
                <label
                  htmlFor={`addon-${addon.id}`}
                  className="text-lg font-medium cursor-pointer"
                >
                  {addon.name}
                </label>
                <p className="text-sm text-muted-foreground">
                  {addon.description}
                </p>
                <div className="text-sm font-semibold text-primary mt-1">
                  {addon.price}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddOnOptions;
