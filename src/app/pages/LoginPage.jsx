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
import { Alert, AlertDescription } from "../components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { apiFetch } from "@/app/lib/apiUtils";

const LoginPage = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscriptionError, setSubscriptionError] = useState(null);

  // Check for subscription inactive error from URL params
  useEffect(() => {
    // Small delay to ensure URL is properly updated
    const checkUrlParams = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const error = urlParams.get('error');
      const message = urlParams.get('message');
      const callbackUrl = urlParams.get('callbackUrl');
      
      console.log('LoginPage useEffect - URL params:', { error, message, callbackUrl, search: window.location.search });
      console.log('Current URL:', window.location.href);
      console.log('Referrer:', document.referrer);
      
      if (error === 'subscription_inactive') {
        console.log('Showing subscription inactive error message');
        setSubscriptionError(message || 'Your clinic subscription is inactive. Please contact your administrator.');
        
        // Handle signout for subscription issues
        const handleSubscriptionSignout = async () => {
          try {
            await signOut({ 
              redirect: false,
              callbackUrl: '/login'
            });
            console.log('User signed out due to subscription issue');
          } catch (error) {
            console.error('Error signing out:', error);
          }
        };
        
        handleSubscriptionSignout();
        
        // Clear the URL parameters after showing the error
        const newUrl = new URL(window.location);
        newUrl.searchParams.delete('error');
        newUrl.searchParams.delete('message');
        newUrl.searchParams.delete('callbackUrl');
        window.history.replaceState({}, '', newUrl);
      }
      
      // Fallback: Check if user was redirected from a protected route (might indicate subscription issue)
      if (callbackUrl && (callbackUrl.includes('/clinic/') || callbackUrl.includes('/coach/') || callbackUrl.includes('/client/'))) {
        console.log('User was redirected from protected route:', callbackUrl);
        // This might indicate a subscription issue, but we'll only show alert if we have explicit error
      }
      
      // Additional fallback: Check referrer for protected routes
      if (document.referrer && (document.referrer.includes('/clinic/') || document.referrer.includes('/coach/') || document.referrer.includes('/client/'))) {
        console.log('User came from protected route (referrer):', document.referrer);
        // This could indicate a subscription issue
      }
    };

    // Check immediately
    checkUrlParams();
    
    // Also check after a small delay to handle any timing issues
    const timeoutId = setTimeout(checkUrlParams, 100);
    
    // Check again after a longer delay to catch any late URL updates
    const timeoutId2 = setTimeout(checkUrlParams, 500);
    
    // Check again after 1 second to catch any very late URL updates
    const timeoutId3 = setTimeout(checkUrlParams, 1000);
    
    return () => {
      clearTimeout(timeoutId);
      clearTimeout(timeoutId2);
      clearTimeout(timeoutId3);
    };
  }, []); // Run only once when component mounts

  const onSubmit = async (data) => {
    // Clear subscription error when user tries to login
    setSubscriptionError(null);
    
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

        // Check subscription status before redirecting
        if (session?.user?.role !== "admin") {
          const subscriptionResponse = await apiFetch("/api/auth/check-subscription");
          
          // If apiFetch returned a handled response (subscription inactive)
          if (subscriptionResponse.success === false) {
            return;
          }
          
          const subscriptionData = await subscriptionResponse.json();
          
          if (!subscriptionData.success || !subscriptionData.isValid) {
            // Sign out the user and show error
            await signOut({ redirect: false });
            setSubscriptionError(subscriptionData.message || "Your clinic subscription is inactive. Please contact your administrator.");
            setIsSubmitting(false);
            return;
          }
        }

        // Redirect based on role - only if subscription is valid
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
          
          {/* Subscription Inactive Warning Alert */}
          {subscriptionError && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800 font-medium">
                {subscriptionError}
              </AlertDescription>
            </Alert>
          )}
          
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
