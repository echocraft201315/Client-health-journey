import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../components/ui/dialog";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { MoreHorizontal } from "lucide-react";
import { DeleteClientDialog } from "./DeleteClientDialog";
import { ResetClientPasswordDialog } from "./ResetClientPasswordDialog";

const ClientList = ({ clients, fetchClients }) => {
  const [isCoachDetailsOpen, setIsCoachDetailsOpen] = useState(false);
  const [isProgramDetailsOpen, setIsProgramDetailsOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [isDeleteClientDialogOpen, setIsDeleteClientDialogOpen] = useState(false);
  const [isResetClientPasswordDialogOpen, setIsResetClientPasswordDialogOpen] = useState(false);

  const handleViewCoach = (client) => {
    setSelectedClient(client);
    setIsCoachDetailsOpen(true);
  };

  const handleResetClientPassword = (client) => {
    setSelectedClient(client);
    setIsResetClientPasswordDialogOpen(true);
  };

  const handleDeleteClient = (client) => {
    setSelectedClient(client);
    setIsDeleteClientDialogOpen(true);
  };

  const handleViewProgram = (client) => {
    setSelectedClient(client);
    setIsProgramDetailsOpen(true);
  };
    const hasActions = Boolean(handleDeleteClient || handleResetClientPassword);

  return (
    <>
      <div className="w-full overflow-x-auto">
        <Table className="min-w-[600px]">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Coach</TableHead>
              <TableHead>Program</TableHead>
              <TableHead>Last Check-in</TableHead>
              {hasActions && <TableHead className="w-[80px]">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients?.map((client) => (
              <TableRow
                key={client.id}
                className="hover:bg-gray-50 cursor-pointer"
              >
                <TableCell className="font-medium">{client.name}</TableCell>
                <TableCell>{client.email}</TableCell>
                <TableCell className="hover:bg-[#c4c4c4]" onClick={() => handleViewCoach(client)}>
                  <span style={{ display: "inline-flex", alignItems: "center" }}>
                    <Eye style={{ marginRight: 8 }} size={18} className="text-[#5298f5]"/>
                    {client.coachId ? client.coach_name : "None"}
                  </span>
                </TableCell>
                <TableCell className="hover:bg-[#c4c4c4]" onClick={() => handleViewProgram(client)}>
                  <span style={{ display: "flex", alignItems: "center" }}>
                    <Eye style={{ marginRight: 8 }} size={18} className="text-[#5298f5]"/>
                    {client.programId ? client.program_title : "None"}
                  </span>
                </TableCell>
                <TableCell>
                  {client.lastCheckIn ? (
                    new Date(client.lastCheckIn).toLocaleDateString()
                  ) : (
                    <Badge
                      variant="outline"
                      className="bg-amber-100 text-amber-800"
                    >
                      No check-ins
                    </Badge>
                  )}
                </TableCell>
                {hasActions && (
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                          {handleResetClientPassword && (
                          <DropdownMenuItem
                            onClick={() =>
                              handleResetClientPassword(client)
                            }
                          >
                            Reset Password
                          </DropdownMenuItem>
                        )}
                          {handleDeleteClient && (
                          <DropdownMenuItem
                            onClick={() =>
                              handleDeleteClient(client)
                            }
                            className="text-red-600 focus:text-red-600"
                          >
                            Delete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Dialog open={isCoachDetailsOpen} onOpenChange={setIsCoachDetailsOpen}>
        <DialogContent className="w-full max-w-full sm:max-w-[600px] px-2 sm:px-6 py-4">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">
              {selectedClient?.coach_name}
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Coach Details
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-2 text-xs sm:text-sm">
            <div><span className="font-bold text-gray-600">Email:</span> {selectedClient?.coach_email}</div>
            <div><span className="font-bold text-gray-600">Phone:</span> {selectedClient?.coach_phone}</div>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={isProgramDetailsOpen} onOpenChange={setIsProgramDetailsOpen}>
        <DialogContent className="w-full max-w-full sm:max-w-[600px] px-2 sm:px-6 py-4">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">
              {selectedClient?.program_title}
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Program Details
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-2 text-xs sm:text-sm">
            <div><span className="font-bold text-gray-600">Description:</span> {selectedClient?.program_description}</div>
            <div><span className="font-bold text-gray-600">Duration:</span> {selectedClient?.program_duration}</div>
          </div>
        </DialogContent>
      </Dialog>
      {selectedClient && (
        <>
          <DeleteClientDialog
            selectedClient={selectedClient}
            open={isDeleteClientDialogOpen}
            setOpen={setIsDeleteClientDialogOpen}
            fetchClients={fetchClients}
          />
          <ResetClientPasswordDialog
            selectedClient={selectedClient}
            open={isResetClientPasswordDialogOpen}
            setOpen={setIsResetClientPasswordDialogOpen}
            fetchClients={fetchClients}
          />
        </>
      )}
      </>
  );
};

export default ClientList;
