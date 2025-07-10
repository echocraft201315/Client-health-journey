import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import AddClientForm from "./AddClientForm";

const AddClientDialog = ({
  open,
  onOpenChange,
  fetchClients,
  clientLimit,
  clientCount
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-full sm:max-w-[500px] max-h-[90vh] overflow-y-auto px-2 sm:px-6 py-4">
        <DialogHeader>
          <DialogTitle>Add New Client</DialogTitle>
          <DialogDescription>
            Create a new client record for your practice.
          </DialogDescription>
        </DialogHeader>

        <AddClientForm
          onCancel={() => onOpenChange(false)}
          fetchClients={fetchClients}
          clientLimit={clientLimit}
          clientCount={clientCount}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddClientDialog;
