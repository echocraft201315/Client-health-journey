import React, { useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import {
  FormField,
  FormItem,
  FormMessage,
  FormControl,
} from "../../components/ui/form";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";
import { AlertCircle, Info } from "lucide-react";
import HipaaNotice from "./HipaaNotice";
import PlanOption from "./PlanOption";
import AccountCreationFields from "./AccountCreationFields";
import { SubscriptionPlan } from "../../lib/stack";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../components/ui/tooltip";

const AccountSetupTab = ({
  form,
  createAccount,
  onToggleCreateAccount,
  onBack,
  isSubmitting,
}) => {
  useEffect(() => {
    if (createAccount && form.getValues("email") === "") {
      const clinicEmail = form.getValues("clinicEmail");
      form.setValue("email", clinicEmail);
    }
  }, [createAccount, form]);

  const formState = form.formState;
  const hasErrors = Object.keys(formState.errors).length > 0;

  const handlePlanSelect = (planId) => {
    form.setValue("selectedPlan", planId, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  return (
    <div className="space-y-6">
      {hasErrors && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Form Errors</AlertTitle>
          <AlertDescription>
            Please fix the errors in the form before submitting.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex items-center mb-4">
        <Checkbox
          id="create-account"
          checked={createAccount}
          onCheckedChange={(checked) => onToggleCreateAccount(true)}
          className="mr-2"
          disabled={true}
        />
        <div className="flex items-center gap-2">
          <label htmlFor="create-account" className="text-sm font-medium">
            Create an account for clinic management
          </label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>This account will be used to manage your clinic's settings and coaches</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <HipaaNotice />

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-medium">Select a Plan</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Choose the plan that best fits your clinic's needs</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <FormField
          control={form.control}
          name="selectedPlan"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormControl>
                <div className="space-y-3">
                  {SubscriptionPlan.map((plan) => (
                    <PlanOption
                      key={plan.id}
                      id={plan.id}
                      name={plan.name}
                      description={plan.description}
                      price={plan.price}
                      features={plan.features}
                      selected={field.value === plan.id}
                      onSelect={() => {
                        field.onChange(plan.id);
                        handlePlanSelect(plan.id);
                      }}
                    />
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-medium">Add-ons</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Enhance your plan with additional features</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <AddOnOptions
          addOns={addOns}
          availableAddOns={availableAddOns}
          onToggleAddOn={handleAddOnToggle}
        />
      </div> */}

      {createAccount && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-medium">Account Details</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Set up your clinic management account credentials</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <AccountCreationFields form={form} show={createAccount} />
        </div>
      )}

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting || hasErrors}
        >
          {isSubmitting ? "Creating Clinic..." : "Complete Signup"}
        </Button>
      </div>
    </div>
  );
};

export default AccountSetupTab;
