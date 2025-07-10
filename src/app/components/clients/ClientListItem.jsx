import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";

const ClientListItem = ({ client, handleViewProgram, hasActions, handleDeleteClient, handleResetClientPassword }) => {
  const router = useRouter();
  return (
    <div
      key={client.id}
      className="flex sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 border rounded-md hover:bg-gray-50 cursor-pointer gap-2 sm:gap-0"
      onClick={() => router.push(`/coach/clients/${client.id}`)}
    >
      <div>
      <div>
        <h3 className="font-medium text-base sm:text-lg">{client.name}</h3>
        <p className="text-xs sm:text-sm text-gray-500">{client.email}</p>
      </div>
      <div className="text-xs sm:text-sm text-gray-500">
        Last check-in:{" "}
        {client.lastCheckIn
          ? new Date(client.lastCheckIn).toLocaleDateString()
          : "Never"}
      </div>
      </div>
      {hasActions && (
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
                )}
    </div>
  );
};

export default ClientListItem;
