import React from "react";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import SupplementsList from "./SupplementsList";

const SupplementsTab = ({ register, errors, formData, setValue }) => {
  const loading = false;
  const programSupplements = [];

  return (
    <div className="space-y-4 px-2">
      {loading ? (
        <p className="text-sm text-gray-500">Loading your supplements...</p>
      ) : programSupplements.length > 0 ? (
        <div>
          <Card className="w-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Supplements Taken Today</CardTitle>
            </CardHeader>
            <CardContent>
              <SupplementsList />
            </CardContent>
          </Card>
        </div>
      ) : (
        <div>
          <Label htmlFor="supplements" className="mb-2">Supplements Taken Today</Label>
          <Textarea
            {...register("supplements")}
            placeholder="List supplements and time taken (e.g., Multivitamin - morning, Magnesium - evening)"
            rows={4}
            className="w-full"
          />
          {errors.supplements && (
            <span className="text-red-500 text-sm">{errors.supplements.message}</span>
          )}
        </div>
      )}

      <div>
        <Label htmlFor="notes" className="mb-2">Additional Notes</Label>
        <Textarea
          {...register("notes")}
          placeholder="Any additional notes about your progress for this day?"
          rows={3}
          className="w-full"
        />
        {errors.notes && (
          <span className="text-red-500 text-sm">{errors.notes.message}</span>
        )}
        <p className="text-xs text-gray-500 mt-1">
          You can record check-ins for up to 7 previous days. Make sure the
          correct date is selected.
        </p>
      </div>
    </div>
  );
};

export default SupplementsTab;
