"use client";

import DemoLoginButtons from "../auth/signup/DemoLoginButtons";
import LoginFormFields from "../auth/signup/LoginFormFields";
import LoginHeader from "../auth/signup/LoginHeader";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { signIn, signOut } from "next-auth/react";
import { toast } from "sonner";

const LoginPage = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasShownSubscriptionError, setHasShownSubscriptionError] = useState(false);

  // Check for subscription inactive error from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    const message = urlParams.get('message');
    
    if (error === 'subscription_inactive' && !hasShownSubscriptionError) {
      toast.error(message || 'Your clinic subscription is inactive. Please contact your administrator.');
      setHasShownSubscriptionError(true);
      
      // Clear the URL parameters after showing the error
      const newUrl = new URL(window.location);
      newUrl.searchParams.delete('error');
      newUrl.searchParams.delete('message');
      window.history.replaceState({}, '', newUrl);
    }
  }, [hasShownSubscriptionError]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      if (result.error) {
        toast.error("Invalid email or password");
      } else {
        // Get the user's role from the session
        const response = await fetch("/api/auth/session");
        const session = await response.json();

        // Redirect based on role - let middleware handle subscription checks
        if (session?.user?.role === "admin") {
          router.push("/admin/dashboard");
        } else if (session?.user?.role === "coach") {
          router.push("/coach/dashboard");
        } else if (session?.user?.role === "client") {
          router.push("/client/dashboard");
        } else if (session?.user?.role === "clinic_admin") {
          router.push("/clinic/dashboard");
        } else {
          router.push("/");
        }
      }
    } catch (error) {
      toast.error("Invalid email or password");
      console.error(error);
    } finally {
      console.log("logined+add-user", data.email);
      // socket.emit("user_login", data.email);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-2 sm:px-4">
      <div className="max-w-md w-full">
        <div className="bg-white p-4 sm:p-8 rounded-lg shadow-md">
          <LoginHeader />
          {/* <Tabs
            defaultValue="login"
            className="mt-6"
            onValueChange={(value) => {
              if (value === "signup") {
                router.push("clinicRegister");
              }
            }}
          > */}
            {/* <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Register Your Clinic</TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="mt-4"> */}
              <LoginFormFields
                onSubmit={onSubmit}
                isSubmitting={isSubmitting}
              />
            {/* </TabsContent>
          </Tabs> */}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
