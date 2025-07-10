import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Building } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

const ClinicsTable = ({
  clinics,
  getStatusColor,
  onEdit,
  onDelete,
  onResetPassword,
}) => {
  return (
    <div className="w-full overflow-x-auto">
      <Table className="min-w-[600px]">
        <TableHeader>
          <TableRow>
            <TableHead>Clinic</TableHead>
            <TableHead>Coaches</TableHead>
            <TableHead>Clients</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Status</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clinics && clinics.length > 0 ? (
            clinics.map((clinic) => (
              <TableRow key={clinic.id} className="hover:bg-gray-50">
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <div className="bg-primary-100 h-10 w-10 rounded-full flex items-center justify-center">
                      <Building className="h-5 w-5 text-primary-700" />
                    </div>
                    <div className="font-medium">{clinic.name}</div>
                  </div>
                </TableCell>
                <TableCell>{clinic.coach_counts || clinic.coachesCount}</TableCell>
                <TableCell>{clinic.client_counts || clinic.clientsCount}</TableCell>
                <TableCell>
                  {clinic.city && clinic.state
                    ? `${clinic.city}, ${clinic.state}`
                    : "N/A"}
                </TableCell>
                <TableCell>
                  <Badge
                    className={getStatusColor(clinic.status)}
                    variant="outline"
                  >
                    {clinic.isActive == true ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(clinic)}>
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onResetPassword(clinic)}>
                        Reset Password
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600 focus:text-red-600"
                        onClick={() => onDelete(clinic)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center py-8 text-muted-foreground"
              >
                No clinics found. Add a clinic to get started.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ClinicsTable;
