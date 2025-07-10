"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { CoachForm } from "../../../components/coaches/CoachForm";
import { useState } from "react";
import { toast } from "sonner";
export const EditCoachDialog = ({
  open,
  selectedCoach,
  setOpen,
  fetchCoaches,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data) => {
    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/clinic/coach/${selectedCoach.id}`, {
        method: "POST",
        body: JSON.stringify(data),
      });
      const responseData = await response.json();
      if (responseData.status) {
        setOpen(false);
        toast.success("Coach updated successfully");
      } else {
        throw new Error(responseData.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to add coach");
    } finally {
      await fetchCoaches();
      setIsSubmitting(false);
    }
  };
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px] w-full max-w-[95vw] p-4 sm:p-6 overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Coach</DialogTitle>
            <DialogDescription>
              Update coach information for {selectedCoach.clinic.name}
            </DialogDescription>
          </DialogHeader>
          {selectedCoach && (
            <CoachForm
              submitButtonText="Save Changes"
              coach={selectedCoach}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              onCancel={() => setOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
