"use client";
import ClinicsOverview from "../../components/clinics/ClinicsOverview";
import AddClinicDialog from "../../components/clinics/AddClinicDialog";
import EditClinicDialog from "../../components/clinics/EditClinicDialog";
import DeleteClinicDialog from "../../components/clinics/DeleteClinicDialog";
import ResetPwdDialog from "../../components/clinics/ResetPwdDialog";
import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { toast } from "sonner";

const ClinicsPage = () => {
  const [isAddClinicDialogOpen, setIsAddClinicDialogOpen] = useState(false);
  const [isEditClinicDialogOpen, setIsEditClinicDialogOpen] = useState(false);
  const [isDeleteClinicDialogOpen, setIsDeleteClinicDialogOpen] =
    useState(false);
  const [isResetPwdDialogOpen, setIsResetPwdDialogOpen] = useState(false);
  const { user } = useAuth();
  const [clinics, setClinics] = useState([]);
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchClinics = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/admin/clinic");
      const data = await response.json();
      setClinics(data.clinics);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch clinics");
    }
  };
  useEffect(() => {
    fetchClinics();
  }, []);
  console.log(selectedClinic);
  const handleAddlclinicdialogue = () => {
    setIsAddClinicDialogOpen(true);
  };

  const handleClinicEditDialogue = (clinic) => {
    setSelectedClinic(clinic);
    setIsEditClinicDialogOpen(true);
  };

  const handleClinicDelete = (clinic) => {
    setSelectedClinic(clinic);
    setIsDeleteClinicDialogOpen(true);
  };

  const handleClinicResetPassword = (clinic) => {
    setSelectedClinic(clinic);
    setIsResetPwdDialogOpen(true);
  };

  const isClinicAdmin = user?.role === "clinic_admin";
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800 border-green-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "inactive":
        return "bg-gray-100 text-gray-800 border-gray-300";
      default:
        return "bg-blue-100 text-blue-800 border-blue-300";
    }
  };

  return (
    <div className="px-2 sm:px-4 md:px-6 py-6">
      {/* <h1 className="text-2xl font-bold mb-6">
        {isClinicAdmin ? "Clinic Management" : "Clinics Management"}
      </h1> */}

      <ClinicsOverview
        clinics={clinics}
        getStatusColor={getStatusColor}
        onEdit={handleClinicEditDialogue}
        onDelete={handleClinicDelete}
        onResetPassword={handleClinicResetPassword}
        fetchClinics={fetchClinics}
        isLoading={isLoading}
        onAddClinic={handleAddlclinicdialogue}
      />

      <AddClinicDialog
        open={isAddClinicDialogOpen}
        setOpen={setIsAddClinicDialogOpen}
        fetchClinics={fetchClinics}
      />

      <EditClinicDialog
        open={isEditClinicDialogOpen}
        setOpen={setIsEditClinicDialogOpen}
        clinic={selectedClinic}
        fetchClinics={fetchClinics}
      />

      <DeleteClinicDialog
        open={isDeleteClinicDialogOpen}
        setOpen={setIsDeleteClinicDialogOpen}
        selectedClinic={selectedClinic}
        fetchClinics={fetchClinics}
      />

      <ResetPwdDialog
        open={isResetPwdDialogOpen}
        setOpen={setIsResetPwdDialogOpen}
        selectedClinic={selectedClinic}
        fetchClinics={fetchClinics}
      />
    </div>
  );
};

export default ClinicsPage;
