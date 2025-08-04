'use client'
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const ClinicContext = createContext(undefined);

export const ClinicProvider = ({ children }) => {
  const { user } = useAuth();
  const [clinic, setClinic] = useState(null);
  const [clientLimit, setClientLimit] = useState(0);
  const [planId, setPlanId] = useState(null);
  const [currentPlan, setCurrentPlan] = useState(null);

  useEffect(() => {
    const fetchClinic = async (clinicId) => {
      const res = await fetch(`/api/clinic/${clinicId}`);
      const data = await res.json();
      if (data.success) {
        setClinic(data.clinic);
        setClientLimit(data.clientLimit);
        setPlanId(data.planId);
        setCurrentPlan(data.currentPlan);
      }
    }

    if (user?.clinic) {
      fetchClinic(user.clinic);
    }
  }, [user]);

  return (
    <ClinicContext.Provider
      value={{
        clinic,
        setClinic,
        clientLimit,
        planId,
        currentPlan,
        setCurrentPlan,
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