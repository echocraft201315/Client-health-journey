import React from "react";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../../components/ui/card";
import { Skeleton } from "../../../components/ui/skeleton";
import { AlertTriangle } from "lucide-react";

const ClinicsTable = ({
  dashboardStats,
  isLoading,
  isError,
  isClinicAdmin,
}) => {
  const title = isClinicAdmin ? "Your Clinic" : "Active Clinics";

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-lg">{title}</CardTitle>
        {!isClinicAdmin && (
          <Button variant="outline" size="sm">
            Manage Clinics
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="flex justify-between items-center">
                  <Skeleton className="h-5 w-32" />
                  <div className="flex space-x-4">
                    <Skeleton className="h-5 w-8" />
                    <Skeleton className="h-5 w-8" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                </div>
              ))}
          </div>
        ) : isError ? (
          <div className="text-center py-8">
            <div className="inline-flex items-center text-red-500 mb-2">
              <AlertTriangle size={20} className="mr-2" />
              <span>Failed to load clinic data</span>
            </div>
            <div>
              <Button variant="outline" size="sm" className="ml-2">
                Try Again
              </Button>
            </div>
          </div>
        ) : !dashboardStats || dashboardStats.clinicsSummary.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {isClinicAdmin
              ? "No clinic information found"
              : "No active clinics found"}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px] text-xs sm:text-sm">
              <thead>
                <tr className="border-b text-sm">
                  <th className="text-left font-medium py-2">Clinic</th>
                  <th className="text-left font-medium py-2">Coaches</th>
                  <th className="text-left font-medium py-2">Clients</th>
                  <th className="text-left font-medium py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {dashboardStats.clinicsSummary.map((clinic,index) => (
                  <tr key={clinic.id} className="border-b hover:bg-gray-50">
                    <td className="py-3">{clinic.name}</td>
                    <td className="py-3">
                      {clinic.coaches || clinic.coachesCount}
                    </td>
                    <td className="py-3">
                      {clinic.clients || clinic.clientsCount}
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                        {clinic.isActive == true ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClinicsTable;
