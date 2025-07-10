"use client";

import { Button } from "../components/ui/button";
import { ArrowLeft } from "lucide-react";
import SignupDemoNotice from "../auth/signup/SignupDemoNotice";
import { Card } from "../components/ui/card";
import ClinicSignupForm from "../auth/signup/ClinicSignupForm";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const ClinicSignUpPage = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data, additionalCoaches) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/auth/clinicRegister", {
        method: "POST",
        body: JSON.stringify({ ...data, additionalCoaches }),
      });
      if (!response.ok) {
        throw new Error("Failed to create clinic");
      }
      const result = await response.json();
      if (result.success) {
        toast.success("Clinic created successfully");
        router.push(result.url);
      } else {
        throw new Error(result.message);
      }

      const resActivity = await fetch("/api/activity/addMembers", {
        method: "POST",
        body: JSON.stringify({
          type: "clinic_signup",
          description: "New clinic added",
        }),
      });
      const respond = await resActivity.json();
      if (respond.success) {
        toast.success("Activity added successfully");
      } else {
        throw new Error(respond.message);
      }
    } catch (error) {
      console.log(error.message);
      toast.error("Failed to Create Clinic");
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-4xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6 gap-2 sm:gap-0">
          <Button variant="ghost" className="mr-2" onClick={() => router.push("/")}>
            <ArrowLeft size={16} className="mr-2" />
            Back to home
          </Button>
        </div>
        <Card className="w-full">
          {/* <div className="px-6 pt-4">
            <SignupDemoNotice />
          </div> */}
          <ClinicSignupForm
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
          />
        </Card>
      </div>
    </div>
  );
};

export default ClinicSignUpPage;
