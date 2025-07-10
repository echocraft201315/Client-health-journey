import React from "react";
import { Button } from "../../components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { AlertCircle } from "lucide-react";

const ClinicInformationTab = ({ form, onNext }) => {
  const formState = form.formState;
  const hasErrors = Object.keys(formState.errors).length > 0;

  return (
    <div className="grid gap-4">
      {hasErrors && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please fix the errors in the form before proceeding.
          </AlertDescription>
        </Alert>
      )}

      <FormField
        control={form.control}
        name="clinicName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Clinic Name <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input 
                {...field} 
                placeholder="Enter your clinic's full name"
                className={formState.errors.clinicName ? "border-red-500" : ""}
              />
            </FormControl>
            <FormDescription>
              This will be displayed to clients and coaches
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="clinicEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Clinic Email <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  type="email" 
                  placeholder="clinic@example.com"
                  className={formState.errors.clinicEmail ? "border-red-500" : ""}
                />
              </FormControl>
              <FormDescription>
                This will be used for clinic communications
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="clinicPhone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Clinic Phone <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="(123) 456-7890"
                  className={formState.errors.clinicPhone ? "border-red-500" : ""}
                />
              </FormControl>
              <FormDescription>
                Include area code
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="primaryContact"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Primary Contact Person <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input 
                {...field} 
                placeholder="Full name of the primary contact"
                className={formState.errors.primaryContact ? "border-red-500" : ""}
              />
            </FormControl>
            <FormDescription>
              This person will be set up as the first coach
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="streetAddress"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Street Address <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input 
                {...field} 
                placeholder="123 Main Street"
                className={formState.errors.streetAddress ? "border-red-500" : ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                City <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="City name"
                  className={formState.errors.city ? "border-red-500" : ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                State <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="State abbreviation"
                  className={formState.errors.state ? "border-red-500" : ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="zipCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                ZIP Code <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="12345"
                  className={formState.errors.zipCode ? "border-red-500" : ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="flex justify-end">
        <Button 
          type="button" 
          onClick={onNext}
          disabled={hasErrors}
        >
          Next: Coach Setup
        </Button>
      </div>
    </div>
  );
};

export default ClinicInformationTab;
