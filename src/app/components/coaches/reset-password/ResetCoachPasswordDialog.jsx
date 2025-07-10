"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
export const ResetCoachPasswordDialog = ({
  open,
  selectedCoach,
  setOpen,
  fetchCoaches,
}) => {
  const coach = selectedCoach;
  const [isSubmitting, setisSubmitting] = useState(false);
  const [errorMessage, seterrorMessage] = useState("");

  const handleReset = async () => {
    if (!coach) return;

    setisSubmitting(true);
    seterrorMessage(null);

    try {
      const response = await fetch(`/api/clinic/coach/${selectedCoach.id}`, {
        method: "PUT",
      });
      const responseData = await response.json();
      if (responseData.status) {
        setOpen(false);
        toast.success("Password reset successfully");
      } else {
        throw new error(responseData.message);
      }
    } catch (err) {
      console.error("Error resetting password:", err);
      seterrorMessage(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      toast.error("Failed to reset password");
    } finally {
      await fetchCoaches();
      setisSubmitting(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px] w-full max-w-[95vw] p-4 sm:p-6 overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Reset Coach Password</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {errorMessage && (
            <div className="text-sm font-medium text-destructive">
              {errorMessage}
            </div>
          )}

          <p className="text-sm text-muted-foreground">
            The coach password will be reset to the default password.
          </p>
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => setOpen(false)} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button onClick={handleReset} className="w-full sm:w-auto">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Resetting...
              </>
            ) : (
              "Reset Password"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
