"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "../../components/ui/alert";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
  fullName: z
    .string()
    .min(3, { message: "Full name must be at least 3 characters" }),
  phone: z.string().min(1, { message: "Invalid phone number" }),
  role: z.string().default("admin"),
  clinicId: z.string().optional(),
});

export function AddAdminUserDialog({
  open,
  setOpen,
  isSuperAdmin = false,
  onAdd,
}) {
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      fullName: "",
      phone: "",
      role: "admin",
      clinicId: "111",
    },
  });
  const onSubmit = async () => {
    let submitData = form.getValues();
    submitData = { ...submitData, clinicId: null };
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin", {
        method: "POST",
        body: JSON.stringify(submitData),
      });
      const data = await response.json();
      if (data.status) {
        setErrorMessage(null);
        form.reset();
        setOpen(false);
        await onAdd();
        toast.success("User added successfully");
      } else {
        setErrorMessage(data.message);
        // toast.error(data.message);
      }
    } catch (error) {
      setErrorMessage("Unable to add user");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          form.reset();
          setErrorMessage(null);
        }
        setOpen(isOpen);
      }}
    >
      <DialogContent className="w-full max-w-xs sm:max-w-[500px] p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle>Add Admin User</DialogTitle>
          <DialogDescription>
            Create a new admin user with access to the admin dashboard.
          </DialogDescription>
        </DialogHeader>

        {errorMessage && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormDescription>
                    The user will be able to change their password after logging
                    in.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PhoneNumber</FormLabel>
                  <FormControl>
                    <Input placeholder="phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      {/* <SelectItem value="clinic_admin">Clinic Admin</SelectItem> */}
                      {/* Only show Super Admin option if current user is a Super Admin */}
                      {isSuperAdmin && (
                        <SelectItem value="super_admin">Super Admin</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Determines the user's permissions in the system.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Conditional clinic selection field for clinic admins */}
            {/* {showClinicField && (
              <FormField
                control={form.control}
                name="clinicId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assign to Clinic</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a clinic" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {clinicsLoading ? (
                          <SelectItem value="loading" disabled>
                            Loading clinics...
                          </SelectItem>
                        ) : clinics && clinics.length > 0 ? (
                          clinics.map((clinic) => (
                            <SelectItem key={clinic.id} value={clinic.id}>
                              {clinic.name}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="none" disabled>
                            No clinics available
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      The clinic this admin will manage.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )} */}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create User"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
