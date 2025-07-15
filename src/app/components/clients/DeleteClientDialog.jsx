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

export const DeleteClientDialog = ({
  open,
  setOpen,
  selectedClient,
  fetchClients,
}) => {
  const client = selectedClient;
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  console.log("client", client);
  const handleDelete = async () => {
    console.log("selectedClient");
    if (!client) return;

    setIsDeleting(true);
    setError(null);

    try {
      const response = await fetch(`/api/clinic/client/${client.id}`, {
        method: "DELETE",
        body: JSON.stringify({id: client.id}),
      });
      const responseData = await response.json();
      if (responseData.status) {
        setOpen(false);
        toast.success("Client deleted successfully");
      } else {
        throw new error(responseData.message);
      }
    } catch (err) {
      console.error("Error deleting client:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      toast.error("Failed to delete client");
    } finally {
      await fetchClients();
      setIsDeleting(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px] w-full max-w-[95vw] p-4 sm:p-6 overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Delete Client</DialogTitle>
          <DialogDescription>
            {client
              ? `Are you sure you want to delete ${client.name}?`
              : "Delete this client?"}
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
            This action cannot be undone. This will permanently delete the client
            and remove any associated data.
          </p>

          {client && client.program_title && (
            <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-md">
              <p className="text-sm text-amber-800">
            <strong>Warning:</strong> This client has a program assigned to them.
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isDeleting}
            className="w-full sm:w-auto mr-[15px]"
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
