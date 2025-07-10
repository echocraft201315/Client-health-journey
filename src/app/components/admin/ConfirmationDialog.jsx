import { useState } from "react";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogCancel,
    AlertDialogAction
} from "../ui/alert-dialog";
import { toast } from "sonner";
import { Button } from "../ui/button";

export default function ConfirmationDialog({ open, setOpen, title, description, onDelete, userId }) {
    const [isLoading, setIsLoading] = useState(false);

    const handleDelete = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/admin/${userId}`, {
                method: "DELETE",
            });
            const data = await response.json();
            if (data.status) {
                await onDelete();
                setOpen(false);
                toast.success("Admin user deleted successfully");
            } else {
                console.error("Error deleting admin user:", data.message);
                toast.error("Error deleting admin user");
            }
        } catch (error) {
            console.error("Error deleting admin user:", error);
            toast.error("Error deleting admin user");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent className="w-full max-w-xs sm:max-w-md p-4 sm:p-6">
                <AlertDialogHeader>
                    <AlertDialogTitle>{title || "Are you sure?"}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {description || "This action cannot be undone."}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                    <AlertDialogCancel className="w-full sm:w-auto" onClick={() => setOpen(false)}>Cancel</AlertDialogCancel>
                    <Button className="w-full sm:w-auto" onClick={() => handleDelete()} disabled={isLoading}>
                        {isLoading ? "Deleting..." : "Continue"}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}