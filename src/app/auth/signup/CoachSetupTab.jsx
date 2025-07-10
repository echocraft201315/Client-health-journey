import React from "react";
import { Button } from "../../components/ui/button";
import { Separator } from "../../components/ui/separator";
import { Plus, AlertCircle, Info } from "lucide-react";
import AdditionalCoach from "./AdditionalCoach";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../components/ui/tooltip";

const CoachSetupTab = ({
  form,
  additionalCoaches,
  onAddCoach,
  onRemoveCoach,
  onUpdateCoach,
  onBack,
  onNext,
}) => {
  const primaryContact = form.watch("primaryContact");
  const clinicEmail = form.watch("clinicEmail");
  const clinicPhone = form.watch("clinicPhone");

  const hasPrimaryContact = primaryContact && clinicEmail && clinicPhone;

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 rounded-lg p-4 mb-4">
        <h3 className="text-blue-800 font-medium mb-1">About Coach Setup</h3>
        <p className="text-blue-700 text-sm">
          The primary contact person will automatically be set up as the first
          coach for your clinic. You can add additional coaches now or later
          through your dashboard.
        </p>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-2">
          <h3 className="font-medium">Primary Coach (Clinic Contact)</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>This is the primary contact person from the previous step</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        {!hasPrimaryContact ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Missing Information</AlertTitle>
            <AlertDescription>
              Please go back and complete the primary contact information in the Clinic Information tab.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="bg-gray-50 p-4 border rounded-md">
            <p className="text-sm">
              Name:{" "}
              <span className="font-medium">{primaryContact}</span>
            </p>
            <p className="text-sm">
              Email:{" "}
              <span className="font-medium">{clinicEmail}</span>
            </p>
            <p className="text-sm">
              Phone:{" "}
              <span className="font-medium">{clinicPhone}</span>
            </p>
          </div>
        )}
      </div>

      <Separator />

      <div>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <h3 className="font-medium">Additional Coaches (Optional)</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add more coaches who will work with clients</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={onAddCoach}
            className="flex items-center gap-1"
            disabled={!hasPrimaryContact}
          >
            <Plus size={16} />
            Add Coach
          </Button>
        </div>

        {additionalCoaches.length === 0 ? (
          <div className="text-center py-6 bg-gray-50 rounded-md border border-dashed">
            <p className="text-gray-500 text-sm">
              No additional coaches added yet.
            </p>
            <p className="text-gray-400 text-xs mt-1">
              Click "Add Coach" to add more coaches to your clinic
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {additionalCoaches.map((coach, index) => (
              <AdditionalCoach
                key={index}
                coach={coach}
                index={index}
                onChange={onUpdateCoach}
                onRemove={onRemoveCoach}
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button 
          type="button" 
          onClick={onNext}
          disabled={!hasPrimaryContact}
        >
          Next: Account Setup
        </Button>
      </div>
    </div>
  );
};

export default CoachSetupTab;
