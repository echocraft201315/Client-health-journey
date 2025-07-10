"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
const addClinicSchema = z.object({
  clinicName: z.string().min(1, "Clinic name is required"),
  clinicEmail: z.string().email("Invalid email format"),
  clinicPhone: z.string().min(1, "Phone number is required"),
  streetAddress: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(1, "ZIP code is required"),
  primaryContact: z.string().min(1, "Primary contact is required"),
  email: z.string().email("Invalid email format"),
  addOns: z.array(z.any()).optional(),
  additionalCoaches: z.array(z.any()).optional(),
  billingContactName: z.string().optional(),
  billingEmail: z.string().optional(),
  billingPhone: z.string().optional(),
  billingAddress: z.string().optional(),
  billingCity: z.string().optional(),
  billingState: z.string().optional(),
  billingZip: z.string().optional(),
  selectedPlan: z.string().optional(),
  hipaaAcknowledgment: z.boolean().optional(),
  legalAcknowledgment: z.boolean().optional(),
});

const AddClinicDialog = ({ open, setOpen, fetchClinics }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const form = useForm({
    resolver: zodResolver(addClinicSchema),
    defaultValues: {
      clinicName: "",
      clinicEmail: "",
      clinicPhone: "",
      streetAddress: "",
      city: "",
      state: "",
      zipCode: "",
      primaryContact: "",
      email: "",
      hipaaAcknowledgment: true,
      legalAcknowledgment: true,
      addOns: [],
      addtionalCoaches: [],
      billingContactName: "",
      billingEmail: "",
      billingPhone: "",
      billingAddress: "",
      billingCity: "",
      billingState: "",
      billingZip: "",
      selectedPlan: "",
    },
  });

  const handleSubmit = async (data) => {
    console.log("clinicdata", data);
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/admin/clinic", {
        method: "POST",
        body: JSON.stringify(data),
      });
      const responseData = await response.json();
      if (responseData.success) {
        toast.success("Clinic added successfully");
        setOpen(false);
        fetchClinics();
      } else {
        throw new Error(responseData.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to add clinic");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-full max-w-full sm:max-w-[600px] max-h-[90vh] overflow-y-auto px-2 sm:px-6 py-4">
        <DialogHeader>
          <DialogTitle>Add New Clinic</DialogTitle>
          <DialogDescription>
            Add a new clinic to your organization. A coach will automatically be
            created using the primary contact information.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="clinicName"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                    <FormLabel className="sm:text-right">
                      Name <span className="text-red-500">*</span>
                    </FormLabel>
                    <div className="sm:col-span-3">
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="clinicEmail"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                    <FormLabel className="sm:text-right">
                      Email <span className="text-red-500">*</span>
                    </FormLabel>
                    <div className="sm:col-span-3">
                      <FormControl>
                        <Input {...field} type="email" />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="clinicPhone"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                    <FormLabel className="sm:text-right">
                      Phone <span className="text-red-500">*</span>
                    </FormLabel>
                    <div className="sm:col-span-3">
                      <FormControl>
                        <Input {...field} type="tel" />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="primaryContact"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                    <FormLabel className="sm:text-right whitespace-nowrap">
                      Primary Contact{" "}
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <div className="sm:col-span-3">
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Main contact person's name"
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="streetAddress"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                    <FormLabel className="sm:text-right whitespace-nowrap">
                      Street Address <span className="text-red-500">*</span>
                    </FormLabel>
                    <div className="sm:col-span-3">
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                    <FormLabel className="sm:text-right">
                      City <span className="text-red-500">*</span>
                    </FormLabel>
                    <div className="sm:col-span-3">
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                    <FormLabel className="sm:text-right">
                      State <span className="text-red-500">*</span>
                    </FormLabel>
                    <div className="sm:col-span-3">
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="zipCode"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                    <FormLabel className="sm:text-right">
                      ZIP Code <span className="text-red-500">*</span>
                    </FormLabel>
                    <div className="sm:col-span-3">
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                    <FormLabel className="sm:text-right">
                      Admin Email <span className="text-red-500">*</span>
                    </FormLabel>
                    <div className="sm:col-span-3">
                      <FormControl>
                        <Input {...field} type="email" />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {isSubmitting ? "Adding..." : "Add Clinic"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddClinicDialog;
