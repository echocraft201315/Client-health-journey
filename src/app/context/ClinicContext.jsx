'use client'
import { createContext, useContext, useEffect, useState } from "react";
import { apiFetch } from "@/app/lib/apiUtils";

const ClinicContext = createContext(undefined);

export const ClinicProvider = ({ children, clinicId }) => {
  const [clinic, setClinic] = useState(null);

  const fetchClinicData = async () => {
    try {
      const res = await apiFetch(`/api/clinic/${clinicId}`);
      
      // If apiFetch returned a handled response (subscription inactive)
      if (res.success === false) {
        return;
      }
      
      const data = await res.json();
      if (data.success) {
        setClinic(data.clinic);
      }
    } catch (err) {
      console.error("Error fetching clinic data:", err);
    }
  };

  useEffect(() => {
    fetchClinicData();
  }, [clinicId]);

  return (
    <ClinicContext.Provider
      value={{
        clinic,
        setClinic,
      }}
    >
      {children}
    </ClinicContext.Provider>
  );
};

export const useClinic = () => {
  const context = useContext(ClinicContext);
  if (context === undefined) {
    throw new Error("useClinic must be used within an ClinicProvider");
  }
  return context;
};