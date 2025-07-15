import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "../ui/badge";

const ClientListItem = ({ client, handleViewProgram, hasActions, handleDeleteClient, handleResetClientPassword }) => {
  const router = useRouter();
  console.log("client", client)
  // Calculate overdue status
  const now = new Date();
  let showOverdueBadge = false;
  let badgeText = "";
  if (client.lastCheckIn) {
    const lastCheckInDate = new Date(client.lastCheckIn);
    const diffDays = (now - lastCheckInDate) / (1000 * 60 * 60 * 24);
    if (diffDays > 3) {
      showOverdueBadge = true;
      badgeText = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC'
      }).format(lastCheckInDate);
    }
  } else if (client.startDate) {
    const startDate = new Date(client.startDate);
    const diffDays = (now - startDate) / (1000 * 60 * 60 * 24);
    if (diffDays > 3) {
      showOverdueBadge = true;
      badgeText = "Never";
    }
  }
  return (
    <div
      key={client.id}
      className="flex sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 border rounded-md hover:bg-gray-50 cursor-pointer gap-2 sm:gap-0"
    >
      <div onClick={() => router.push(`/coach/clients/${client.id}`)}>
      <div>
        <h3 className="font-medium text-base sm:text-lg">{client.name}</h3>
        <p className="text-xs sm:text-sm text-gray-500">{client.email}</p>
      </div>
      <div className="text-xs sm:text-sm text-gray-500 flex items-center gap-2">
        Last check-in:{" "}
        {client.lastCheckIn ? (
          <>
            {!showOverdueBadge &&
            new Intl.DateTimeFormat('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              timeZone: 'UTC'
            }).format(new Date(client.lastCheckIn))}
            {showOverdueBadge && (
              <Badge variant="destructive" className="ml-2 animate-pulse" aria-label="Overdue check-in warning">
                {badgeText}
              </Badge>
            )}
          </>
        ) : (
          showOverdueBadge ? (
            <Badge variant="destructive" className="ml-2 animate-pulse" aria-label="Overdue check-in warning">
              Never
            </Badge>
          ) : (
            "Never"
          )
        )}
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
