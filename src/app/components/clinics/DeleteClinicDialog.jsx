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

const DeleteClinicDialog = ({
    open,
    setOpen,
    selectedClinic,
    fetchClinics,
}) => {
    const clinic = selectedClinic;
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState(null);

    const handleDelete = async () => {
        console.log("selectedClinic", selectedClinic);
        if (!clinic) return;

        setIsDeleting(true);
        setError(null);

        try {
            const response = await fetch(`/api/admin/clinic/${selectedClinic.id}`, {
                method: "DELETE",
                body: JSON.stringify(clinic),
            });
            const responseData = await response.json();
            if (responseData.success) {
                setOpen(false);
                toast.success("Clinic deleted successfully");
            } else {
                throw new Error(responseData.message);
            }
        } catch (err) {
            console.error("Error deleting clinic:", err);
            setError(
                err instanceof Error ? err.message : "An unknown error occurred"
            );
            toast.error("Failed to delete clinic");
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
                    <DialogTitle>Delete Clinic</DialogTitle>
                    <DialogDescription>
                        {clinic
                            ? `Are you sure you want to delete ${clinic.name}?`
                            : "Delete this clinic?"}
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
                        This action cannot be undone. This will permanently delete the clinic
                        and remove any associated data.
                    </p>

                    {clinic && clinic.clients > 0 && (
                        <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-md">
                            <p className="text-xs sm:text-sm text-amber-800">
                                <strong>Warning:</strong> This clinic has {clinic.coaches[0]?.count} active{" "}
                                {clinic.coaches[0]?.count === 1 ? "coach" : "coaches"}, {clinic.clients[0]?.count} active{" "}
                                {clinic.clients[0]?.count === 1 ? "client" : "clients"}. You will need to
                                reassign them to another clinic.
                            </p>
                        </div>
                    )}
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
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="w-full sm:w-auto"
                    >
                        {isDeleting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            <>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteClinicDialog;
