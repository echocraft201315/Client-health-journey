"use client";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
  UserPlus,
  Pencil,
  Trash2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { AddAdminUserDialog } from "../../components/admin/AddAdminUserDialog";
import { EditAdminUserDialog } from "../../components/admin/EditAdminUserDialog";
import ConfirmationDialog from "../../components/admin/ConfirmationDialog";
import { Badge } from "../../components/ui/badge";
import { useAuth } from "@/app/context/AuthContext";

const AdminUsersPage = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPromoteDialogOpen, setIsPromoteDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(undefined);
  const {user} = useAuth();
  const isSuperAdmin = user?.role === "super_admin";
  const [isError, setIsError] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [adminUsers, setAdminUsers] = useState([]);

  const handleAdd = () => {
    setIsAddDialogOpen(true);
  };
  const handleEdit = (user) => {
    setSelectedUserId(user.id);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (user) => {
    setSelectedUserId(user.id);
    setIsDeleteDialogOpen(true);
  };

  const fetchAdminUsers = async () => {
    setIsFetching(true);
    try {
      const response = await fetch("/api/admin");
      const data = await response.json();
      if (data.status) {
        setAdminUsers(data.users);
        setIsError(false);
      } else {
        setIsError(true);
      }
    } catch (error) {
      console.log(error);
      setIsError(true);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchAdminUsers();
  }, []);

  return (
    <div className="px-2 sm:px-4 md:px-6 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <h1 className="text-3xl font-bold">Admin Users</h1>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            disabled={isFetching}
            className="flex items-center justify-center"
            title="Refresh list"
            onClick={fetchAdminUsers}
          >
            <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} />
          </Button>
          <Button className="flex items-center gap-2" onClick={handleAdd}>
            <UserPlus size={16} />
            <span>Add Admin User</span>
          </Button>
        </div>
      </div>

      <Card className="overflow-x-auto">
        <CardHeader>
          <CardTitle>Manage Admin Users</CardTitle>
          <CardDescription>
            Add, edit, or remove users with administrative access to the system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Admin users have full access to all features and data in the
              system. Add new admin users carefully.
            </AlertDescription>
          </Alert>

          {isError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                There was an error loading admin users. Please try refreshing
                the page.
              </AlertDescription>
            </Alert>
          )}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Full Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isFetching ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-8 text-muted-foreground"
                  >
                    Loading admin users...
                  </TableCell>
                </TableRow>
              ) : adminUsers?.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No admin users found. Add an admin to get started.
                  </TableCell>
                </TableRow>
              ) : (
                adminUsers?.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.role === "admin" ? "default" : "outline"
                        }
                      >
                        {user.role === "admin" ? "Admin" : "Clinic Admin"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={user.isActive ? "success" : "destructive"}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {/* {isSuperAdmin && user.role !== "super_admin" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-blue-600"
                          >
                            <ShieldCheck size={14} className="mr-1" /> Make
                            Super
                          </Button>
                        )} */}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(user)}
                        >
                          <Pencil size={14} className="mr-1" /> Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-destructive"
                          onClick={() => handleDelete(user)}
                        >
                          <Trash2 size={14} className="mr-1" /> Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AddAdminUserDialog
        open={isAddDialogOpen}
        setOpen={setIsAddDialogOpen}
        isSuperAdmin={isSuperAdmin}
        onAdd={fetchAdminUsers}
      />

      <EditAdminUserDialog
        open={isEditDialogOpen}
        setOpen={setIsEditDialogOpen}
        isSuperAdmin={isSuperAdmin}
        onEdit={fetchAdminUsers}
        userId={selectedUserId}
      />

      <ConfirmationDialog
        open={isDeleteDialogOpen}
        setOpen={setIsDeleteDialogOpen}
        title="Delete Admin User"
        description="Are you sure you want to delete this admin user?"
        onDelete={fetchAdminUsers}
        userId={selectedUserId}
      />
    </div>
  );
};

export default AdminUsersPage;
