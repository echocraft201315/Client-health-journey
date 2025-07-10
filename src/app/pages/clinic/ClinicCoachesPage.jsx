"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { UserPlus, RefreshCw, AlertCircle } from "lucide-react";
import CoachesTable from "../../components/admin/coaches/CoachesTable";
import { AddCoachDialog } from "../../components/coaches/add/AddCoachDialog";
import { EditCoachDialog } from "../../components/coaches/edit/EditCoachDialog";
import { DeleteCoachDialog } from "../../components/coaches/delete/DeleteCoachDialog";
import { ResetCoachPasswordDialog } from "../../components/coaches/reset-password/ResetCoachPasswordDialog";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";
import { useState, useEffect } from "react";
import CoachesFilter from "../../components/admin/coaches/CoachesFilter";
import { useAuth } from "../../context/AuthContext";
import { toast } from "sonner";

const CoachesPage = () => {
  const { user } = useAuth();

  const [filterText, setFilterText] = useState("");
  const [isAddCoachDialogOpen, setIsAddCoachDialogOpen] = useState(false);
  const [isEditCoachDialogOpen, setIsEditCoachDialogOpen] = useState(false);
  const [isResetPasswordCoachDialogOpen, setIsResetPasswordCoachDialogOpen] =
    useState(false);
  const [isDeleteCoachDialogOpen, setIsDeleteCoachDialogOpen] = useState(false);
  const [coaches, setCoaches] = useState([]);
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const handleAddcoachdialogue = () => {
    setIsAddCoachDialogOpen(true);
  };

  const filteredCoaches = coaches?.filter((coach) => {
    const searchText = filterText.toLowerCase();
    return (
      coach.name.toLowerCase().includes(searchText) ||
      coach.email.toLowerCase().includes(searchText) ||
      (coach.phone && coach.phone.includes(searchText)) ||
      (coach.clinicName && coach.clinicName.toLowerCase().includes(searchText))
    );
  });

  const fetchCoaches = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/clinic/coach");
      const data = await response.json();
      setCoaches(data.coaches);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch coaches");
    }
  };

  const handleEditCoach = (coach) => {
    setSelectedCoach(coach);
    setIsEditCoachDialogOpen(true);
  };

  const handleDeleteCoach = (coach) => {
    setSelectedCoach(coach);
    setIsDeleteCoachDialogOpen(true);
  };

  const handleResetPassword = (coach) => {
    setSelectedCoach(coach);
    setIsResetPasswordCoachDialogOpen(true);
  };
  useEffect(() => {
    fetchCoaches();
  }, []);

  return (
    <div className="px-2 sm:px-4 md:px-6 py-4 w-full max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
        <h1 className="text-3xl font-bold">Coaches</h1>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="outline"
            size="icon"
            className="flex items-center justify-center"
            title="Refresh coaches"
            onClick={fetchCoaches}
            disabled={isLoading}
          >
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
          </Button>
          <Button
            className="flex items-center gap-2"
            onClick={handleAddcoachdialogue}
          >
            <UserPlus size={16} />
            <span>Add Coach</span>
          </Button>
        </div>
      </div>
      <Alert className="bg-primary-50 border-primary-200">
        <AlertCircle className="h-4 w-4 text-primary" />
        <AlertTitle>Clinic Admin View</AlertTitle>
        <AlertDescription>
          You are viewing coaches for {user?.name || "your clinic"} only. As a
          clinic administrator, you can manage all coaches and clients within
          your clinic.
        </AlertDescription>
      </Alert>
      <Card className="w-full overflow-x-auto">
        <CardHeader>
          <CardTitle>Manage Coaches</CardTitle>
          <CardDescription>
            {`Manage coaches for ${user?.name || "your clinic"}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CoachesFilter
            filterText={filterText}
            setFilterText={setFilterText}
            count={filteredCoaches.length}
          />
          <CoachesTable
            coaches={filteredCoaches}
            onEdit={handleEditCoach}
            onDelete={handleDeleteCoach}
            onResetPassword={handleResetPassword}
          />
        </CardContent>
      </Card>
      <AddCoachDialog
        open={isAddCoachDialogOpen}
        setOpen={setIsAddCoachDialogOpen}
        fetchCoaches={fetchCoaches}
      />
      {selectedCoach && (
        <>
          <EditCoachDialog
            selectedCoach={selectedCoach}
            open={isEditCoachDialogOpen}
            setOpen={setIsEditCoachDialogOpen}
            fetchCoaches={fetchCoaches}
          />
          <DeleteCoachDialog
            selectedCoach={selectedCoach}
            open={isDeleteCoachDialogOpen}
            setOpen={setIsDeleteCoachDialogOpen}
            fetchCoaches={fetchCoaches}
          />
          <ResetCoachPasswordDialog
            selectedCoach={selectedCoach}
            open={isResetPasswordCoachDialogOpen}
            setOpen={setIsResetPasswordCoachDialogOpen}
            fetchCoaches={fetchCoaches}
          />
        </>
      )}
    </div>
  );
};

export default CoachesPage;
