import React from "react";
import { useForm } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { Loader2, Globe } from "lucide-react";
import { clientGoals } from "./AddClientSchema";
import { useAuth } from "@/app/context/AuthContext";

const ClientFormFields = ({
  form,
  programs,
  coaches,
  selectedProgramType,
  isProgramsLoading = false,
  isCoachesLoading = false,
}) => {
  const { user } = useAuth();
  const isCoach = user?.role == "coach";

  return (
    <div className="space-y-3">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Client Name</FormLabel>
            <FormControl>
              <Input placeholder="Full name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input type="email" placeholder="Email address" {...field} />
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
            <FormLabel>Phone (optional)</FormLabel>
            <FormControl>
              <Input placeholder="Phone number" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <FormField
          control={form.control}
          name="initialWeight"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Initial Weight</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Weight in pounds"
                  {...field}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value ? parseFloat(e.target.value) : undefined
                    )
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="weightDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Weight Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="goalWeight"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Goal Weight</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="Goal weight in pounds"
                {...field}
                onChange={(e) =>
                  field.onChange(
                    e.target.value ? parseFloat(e.target.value) : undefined
                  )
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="goals"
        render={() => (
          <FormItem>
            <FormLabel>Client Goals (Select all that apply)</FormLabel>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
              {clientGoals.map((goal) => (
                <FormField
                  key={goal.id}
                  control={form.control}
                  name="goals"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={goal.id}
                        className="flex flex-row items-start space-x-2 space-y-0 py-1"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(goal.id)}
                            onCheckedChange={(checked) => {
                              const current = field.value || [];
                              const updated = checked
                                ? [...current, goal.id]
                                : current.filter((value) => value !== goal.id);
                              field.onChange(updated);
                            }}
                            className="w-5 h-5"
                          />
                        </FormControl>
                        <FormLabel className="font-normal text-sm">
                          {goal.label}
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
            </div>
          </FormItem>
        )}
      />
      {!isCoach && (
        <FormField
          control={form.control}
          name="coachId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assign Coach</FormLabel>
              <FormDescription>
                Select a coach to assign to this client
              </FormDescription>
              <Select
                onValueChange={field.onChange}
                value={field.value || "none"}
                defaultValue={field.value || "none"}
                disabled={isCoachesLoading}
              >
                <FormControl>
                  <SelectTrigger>
                    {isCoachesLoading ? (
                      <div className="flex items-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading coaches...
                      </div>
                    ) : (
                      <SelectValue placeholder="Select a coach" />
                    )}
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">No coach</SelectItem>
                  <SelectItem value={user?.id}>
                    {user.name}({user.email})
                  </SelectItem>
                  {coaches && coaches.length > 0 ? (
                    coaches.map((coach) => (
                      <SelectItem key={coach.id} value={coach.id}>
                        {coach.name} ({coach.email})
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-coaches-available" disabled>
                      {isCoachesLoading
                        ? "Loading coaches..."
                        : "No coaches available"}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      <FormField
        control={form.control}
        name="programId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Program Template</FormLabel>
            <FormDescription>
              Select a program template to assign to this client
            </FormDescription>
            <Select
              onValueChange={field.onChange}
              value={field.value || ""}
              defaultValue={field.value || ""}
              disabled={isProgramsLoading}
            >
              <FormControl>
                <SelectTrigger>
                  {isProgramsLoading ? (
                    <div className="flex items-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading programs...
                    </div>
                  ) : (
                    <SelectValue placeholder="Select a program template" />
                  )}
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="no-program">No program</SelectItem>
                {programs && programs.length > 0 ? (
                  programs.map((program) => (
                    <SelectItem key={program.id} value={program.id}>
                      {program.program_name} ({program.program_type}) - {program.program_length} days
                      {program.isGlobal && (
                        <span className="ml-2 inline-flex items-center">
                          <Globe className="h-3 w-3 text-blue-500" />
                        </span>
                      )}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-programs-available" disabled>
                    {isProgramsLoading
                      ? "Loading programs..."
                      : "No program templates available"}
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {selectedProgramType === "practice_naturals" && (
        <FormField
          control={form.control}
          name="programCategory"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Program Category</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value || ""}
                defaultValue={field.value || ""}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="A">Category A - Small Portions</SelectItem>
                  <SelectItem value="B">
                    Category B - Medium Portions
                  </SelectItem>
                  <SelectItem value="C">Category C - Large Portions</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (optional)</FormLabel>
              <FormControl>
                <Input placeholder="Additional notes" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default ClientFormFields;
