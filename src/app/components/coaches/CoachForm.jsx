import React from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { coachSignupSchema } from "../../auth/signup/types";

export const CoachForm = ({
  onSubmit,
  isSubmitting,
  onCancel,
  coach,
  submitButtonText = "Add Coach",
}) => {
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
    },
    resolver: zodResolver(coachSignupSchema),
  });

  useEffect(() => {
    if (coach) {
      form.reset({
        name: coach.name,
        email: coach.email,
        phoneNumber: coach.phoneNumber,
      });
    }
  }, [coach]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <div className="flex flex-col sm:grid sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                <FormLabel htmlFor="name" className="sm:text-right">
                  Name <span className="text-red-500">*</span>
                </FormLabel>
                <div className="sm:col-span-3 w-full">
                  <FormControl>
                    <Input id="name" {...field} className="w-full" />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm mt-1" />
                </div>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <div className="flex flex-col sm:grid sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                <FormLabel htmlFor="email" className="sm:text-right">
                  Email <span className="text-red-500">*</span>
                </FormLabel>
                <div className="sm:col-span-3 w-full">
                  <FormControl>
                    <Input id="email" type="email" {...field} className="w-full" />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm mt-1" />
                </div>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <div className="flex flex-col sm:grid sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                <FormLabel htmlFor="phoneNumber" className="sm:text-right">
                  Phone <span className="text-red-500">*</span>
                </FormLabel>
                <div className="sm:col-span-3 w-full">
                  <FormControl>
                    <Input id="phoneNumber" type="text" {...field} className="w-full" />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm mt-1" />
                </div>
              </div>
            </FormItem>
          )}
        />

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-6 gap-2 sm:gap-0">
          <Button variant="outline" onClick={onCancel} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
            {isSubmitting ? "Saving..." : submitButtonText}
          </Button>
        </div>
      </form>
    </Form>
  );
};
