"use client";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { AlertCircle, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

const ResetPwdDialog = ({
    open,
    setOpen,
    selectedClinic,
    fetchClinics,
}) => {
    const clinic = selectedClinic;
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState(null);

    const handleResetPwd = async () => {
        console.log("selectedClinic", selectedClinic);
        if (!clinic) return;

        setIsDeleting(true);
        setError(null);

        try {
            const response = await fetch(`/api/admin/clinic/${selectedClinic.id}`, {
                method: "PATCH"
            });
            const responseData = await response.json();
            if (responseData.success) {
                setOpen(false);
                toast.success("Password reset successfully");
            } else {
                throw new Error(responseData.message);
            }
        } catch (err) {
            console.error("Error resetting password:", err);
            setError(
                err instanceof Error ? err.message : "An unknown error occurred"
            );
            toast.error("Failed to reset password");
        } finally {
            await fetchClinics();
            setIsDeleting(false);
            setOpen(false);
        }
    };
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="w-full max-w-full sm:max-w-[425px] px-2 sm:px-6 py-4">
                <DialogHeader>
                    <DialogTitle>Reset Password</DialogTitle>
                    <DialogDescription>
                        {clinic
                            ? `Are you sure you want to reset the password for ${clinic.name}?`
                            : "Reset the password for this clinic?"}
                    </DialogDescription>
                </DialogHeader>

                {error && (
                    <div className="bg-destructive/10 p-3 rounded-md flex items-start space-x-2">
                        <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
                        <div className="text-sm text-destructive">{error}</div>
                    </div>
                )}

                <div className="py-4">
                    <p className="text-sm text-muted-foreground">
                        This action cannot be undone. This will reset the password for the clinic.
                    </p>
                </div>

                <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                    <Button
                        variant="outline"
                        onClick={() => setOpen(false)}
                        disabled={isDeleting}
                        className="w-full sm:w-auto"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleResetPwd}
                        disabled={isDeleting}
                        className="w-full sm:w-auto"
                    >
                        {isDeleting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Resetting...
                            </>
                        ) : (
                            <>
                                Reset
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ResetPwdDialog;