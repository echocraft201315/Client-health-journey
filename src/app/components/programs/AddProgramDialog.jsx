"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../../components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { Skeleton } from "../ui/skeleton";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

const programSchema = z.object({
  type: z.string().min(1, "Type is required"),
  customName: z.string().optional(),
  duration: z.string().min(1, "Duration is required"),
  checkInFrequency: z.string().min(1, "Check-in frequency is required"),
  description: z.string().min(1, "Description is required"),
  tempId: z.string().optional(),
});

const AddProgramDialog = ({ isOpen, onClose, onSubmit, isSubmitting }) => {
  const { user } = useAuth();
  const [Templates, setTemplates] = useState([]);
  const [isTemplateLoading, setIsTemplateLoading] = useState(false);
  const [isTemplateError, setIsTemplateError] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
    trigger,
  } = useForm({
    resolver: zodResolver(programSchema),
    defaultValues: {
      type: "",
      customName: "",
      duration: "",
      checkInFrequency: "daily",
      description: "",
      tempId: "",
    },
    mode: "onChange",
  });

  const formData = watch();

  const fetchTemplates = async () => {
    try {
      setIsTemplateLoading(true);
      const response = await fetch("/api/admin/template");
      const data = await response.json();
      setTemplates(data.templates);
      setIsTemplateLoading(false);
      setIsTemplateError(false);
    } catch (error) {
      console.log(error);
      setIsTemplateError(true);
      toast.error("Failed to fetch templates");
    }
  };

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
    fetchTemplates();
  }, [isOpen, reset]);

  const handleTypeChange = async (value) => {
    if (value === "custom") {
      setValue("type", "custom");
      setValue("tempId", "");
      setValue("customName", "");
    } else {
      const template = Templates.find((template) => template.id === value);
      setValue("type", template.type);
      setValue("tempId", value);
    }
    // Trigger validation after setting values
    await trigger();
  };

  const onFormSubmit = async (data) => {
    try {
      const effectiveClinicId = user?.clinic || "";
      
      const programData = {
        name: data.type === "custom" ? data.customName : `${data.type.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())} PM`,
        type: data.type,
        duration: data.duration,
        checkInFrequency: data.checkInFrequency,
        description: data.description || "",
        tempId: data.tempId,
        clinicId: effectiveClinicId,
      };

      await onSubmit(programData);
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("Failed to create program. Please try again.");
    }
  };

  const onError = (errors) => {
    console.log("Form validation errors:", errors);
    // Show all validation errors in toast
    const errorMessages = Object.values(errors).map(error => error.message);
    if (errorMessages.length > 0) {
      toast.error(errorMessages.join(", "));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] w-full max-w-[95vw] p-4 sm:p-6 overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Program</DialogTitle>
          <DialogDescription>
            Create a new program for your clients. Fill in the details below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit, onError)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
              <Label htmlFor="type" className="sm:text-right">
                Type
              </Label>
              {isTemplateLoading ? (
                <div className="space-y-3 sm:col-span-3 w-full">
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : isTemplateError ? (
                <div className="text-center py-8 text-red-500 sm:col-span-3 w-full">
                  Failed to load Templates. Please try again.
                </div>
              ) : Templates && Templates.length > 0 ? (
                <div className="sm:col-span-3 w-full">
                  <Select onValueChange={handleTypeChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {Templates.map((template, index) => (
                        <SelectItem key={index} value={template.id}>
                          {template.type}
                        </SelectItem>
                      ))}
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.type && (
                    <p className="text-sm text-red-500 mt-1">{errors.type.message}</p>
                  )}
                  {errors.tempId && (
                    <p className="text-sm text-red-500 mt-1">{errors.tempId.message}</p>
                  )}
                </div>
              ) : (
                <div className="text-center text-gray-500 sm:col-span-3 w-full">
                  No Templates found.
                </div>
              )}
            </div>

            {formData.type === "custom" && (
              <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                <Label htmlFor="customName" className="sm:text-right">
                  Name
                </Label>
                <div className="sm:col-span-3 w-full">
                  <Input
                    id="customName"
                    {...register("customName")}
                    placeholder="Enter custom program name"
                    className="w-full"
                  />
                  {errors.customName && (
                    <p className="text-sm text-red-500 mt-1">{errors.customName.message}</p>
                  )}
                </div>
              </div>
            )}

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="duration" className="text-right">
                Duration
              </Label>
              <div className="col-span-3">
                <Select onValueChange={(value) => {
                  setValue("duration", value);
                  trigger("duration");
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30-days">30 Days</SelectItem>
                    <SelectItem value="60-days">60 Days</SelectItem>
                    <SelectItem value="6-weeks">6 Weeks</SelectItem>
                    <SelectItem value="8-weeks">8 Weeks</SelectItem>
                    <SelectItem value="12-weeks">12 Weeks</SelectItem>
                    <SelectItem value="16-weeks">16 Weeks</SelectItem>
                  </SelectContent>
                </Select>
                {errors.duration && (
                  <p className="text-sm text-red-500 mt-1">{errors.duration.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="checkInFrequency" className="text-right">
                Check-in
              </Label>
              <div className="col-span-3">
                <Select
                  onValueChange={(value) => {
                    setValue("checkInFrequency", value);
                    trigger("checkInFrequency");
                  }}
                  defaultValue="daily"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select check-in frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
                {errors.checkInFrequency && (
                  <p className="text-sm text-red-500 mt-1">{errors.checkInFrequency.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label
                htmlFor="description"
                className="text-right align-top pt-2"
              >
                Description
              </Label>
              <div className="col-span-3">
                <Textarea
                  id="description"
                  {...register("description", { required: false })}
                  rows={4}
                  placeholder="Describe the program and its goals"
                />
                {errors.description && errors.description.message && (
                  <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Program"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProgramDialog;
