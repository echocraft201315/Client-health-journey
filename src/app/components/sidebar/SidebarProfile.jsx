import React from "react";
import { Button } from "../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { User, LogOut, Settings, Building } from "lucide-react";
import { signOut } from "next-auth/react";

const SidebarProfile = ({ user, userRole, roleIcon: RoleIcon = User }) => {
  if (!user) return null;

  return (
    <div className="mt-auto p-4 border-t">
      <div className="flex items-center gap-3">
        <div className="bg-primary/10 h-10 w-10 rounded-full flex items-center justify-center">
          <RoleIcon className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 overflow-hidden">
          <p className="text-sm font-medium truncate">{user.name}</p>
          <p className="text-xs text-muted-foreground truncate">
            {userRole}
            {user.clinicId && user.role === "clinic_admin" && (
              <span className="flex items-center gap-1 mt-1">
                <Building className="h-3 w-3" />
                <span className="text-xs opacity-70">Clinic Admin</span>
              </span>
            )}
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Settings className="h-4 w-4" />
              <span className="sr-only">Settings</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => signOut()}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default SidebarProfile;
