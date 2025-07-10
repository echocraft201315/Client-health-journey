"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { Switch } from "../../components/ui/switch";
import { useAuth } from "@/app/context/AuthContext";
import { SubscriptionPlan } from "@/app/lib/stack";
import { toast } from "sonner";
import { Check } from "lucide-react";
import { useClinic } from "@/app/context/ClinicContext";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

const SettingsPage = () => {
  const { user, setUser } = useAuth();
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    phone: "",
    origin: ""
  });

  const [securityForm, setSecurityForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    newClinicSignup: true,
    coachSignup: true,
    weeklyReports: true,
  });

  const [isUpdatingSubscription, setIsUpdatingSubscription] = useState(false);
  const { planId, currentPlan, setCurrentPlan } = useClinic();
  const router = useRouter();

  useEffect(() => {
    setProfileForm({
      name: user?.name || "HealthTracker Admin",
      email: user?.email || "",
      phone: user?.phoneNumber || "", // Safe to use now that we've added it to the UserData type
      origin: user?.email || ""
    });
  }, [user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        body: JSON.stringify(profileForm),
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Profile updated successfully");
        setUser(data.user);
        signOut();
      } else {
        toast.error("Profile update failed");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Profile update failed");
    }
  };

  const handleSecuritySubmit = async (e) => {
    e.preventDefault();
    if (securityForm.newPassword && securityForm.newPassword !== securityForm.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!securityForm.newPassword) {
      toast.error("New password is required");
      return;
    }

    if (!securityForm.currentPassword) {
      toast.error("Current password is required");
      return;
    }

    try {
      const response = await fetch("/api/user/updatePassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: securityForm.currentPassword,
          newPassword: securityForm.newPassword
        }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Password updated successfully");
        setSecurityForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while updating the password");
    }
  };

  const handleNotificationChange = (setting) => {
    setNotificationSettings({
      ...notificationSettings,
      [setting]: !notificationSettings[setting],
    });
  };

  const handleSubscriptionChange = async (newPlan) => {
    try {
      setIsUpdatingSubscription(true);
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          newPlan,
          currentPlan: planId,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        if (data.url) {
          router.push(data.url);
        } else {
          toast.success(`Successfully Send Request for ${newPlan === 'pro' ? 'upgrading' : 'downgrading'} to ${newPlan} plan`);
          setCurrentPlan(newPlan);
        }
      } else {
        toast.error(data.message || 'Failed to update subscription');
      }
    } catch (error) {
      console.error('Error updating subscription:', error);
      toast.error('An error occurred while updating your subscription');
    } finally {
      setIsUpdatingSubscription(false);
    }
  };

  return (
    <div className="px-2 sm:px-4 md:px-6 py-4 w-full max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500">Manage your account preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid w-full max-w-md grid-cols-2 sm:grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card className="w-full max-w-xl mx-auto">
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>
                Manage your account information.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Company Name</Label>
                  <Input
                    id="name"
                    value={profileForm.name}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        name: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileForm.email}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, email: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={profileForm.phone}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, phone: e.target.value })
                    }
                  />
                </div>
                <Button type="submit">Save Changes</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Update your password and security preferences.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSecuritySubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={securityForm.currentPassword}
                    onChange={(e) =>
                      setSecurityForm({
                        ...securityForm,
                        currentPassword: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={securityForm.newPassword}
                    onChange={(e) =>
                      setSecurityForm({
                        ...securityForm,
                        newPassword: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={securityForm.confirmPassword}
                    onChange={(e) =>
                      setSecurityForm({
                        ...securityForm,
                        confirmPassword: e.target.value,
                      })
                    }
                  />
                </div>

                <Button type="submit">Update Password</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Manage how you receive notifications.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-gray-500">
                    Receive email notifications
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.emailNotifications}
                  onCheckedChange={() =>
                    handleNotificationChange("emailNotifications")
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">New Clinic Signup</p>
                  <p className="text-sm text-gray-500">
                    Get notified when a new clinic registers
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.newClinicSignup}
                  onCheckedChange={() =>
                    handleNotificationChange("newClinicSignup")
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Coach Signup</p>
                  <p className="text-sm text-gray-500">
                    Get notified when a new coach is added
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.coachSignup}
                  onCheckedChange={() =>
                    handleNotificationChange("coachSignup")
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Weekly Reports</p>
                  <p className="text-sm text-gray-500">
                    Receive weekly summary reports
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.weeklyReports}
                  onCheckedChange={() =>
                    handleNotificationChange("weeklyReports")
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscription">
          <Card className="bg-transparent border-none shadow-none">
            <CardHeader>
              <CardTitle>Subscription</CardTitle>
              <CardDescription>
                Choose the plan that best fits your clinic's needs.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6 justify-center items-stretch">
                {SubscriptionPlan.map((plan) => {
                  const isCurrent = planId === plan.id;
                  const isRequest = currentPlan === plan.id;
                  return (
                    <div
                      key={plan.id}
                      className={`flex-1 rounded-2xl border border-gray-200 bg-white p-6 flex flex-col min-w-[260px] max-w-[340px] shadow-md ${isCurrent ? 'ring-2 ring-primary' : ''}`}
                    >
                      <div className="mb-4">
                        <div className="text-lg font-semibold text-gray-900 mb-2">{plan.name}</div>
                        <div className="flex items-end gap-1">
                          <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                          <span className="text-base text-gray-500">/ month</span>
                        </div>
                        <div className="text-xs text-gray-400 mt-1 border-b border-gray-200 pb-2">
                          Totalling to ${plan.price * 12} yearly
                        </div>
                      </div>
                      <Button
                        className={`w-full mt-2 mb-4 ${isCurrent ? 'bg-primary text-white cursor-default' : 'bg-gray-100 text-gray-700 hover:bg-primary hover:text-white'}`}
                        variant={isCurrent ? 'default' : 'outline'}
                        disabled={isCurrent || isUpdatingSubscription || isRequest}
                        onClick={() => {
                          if (!isCurrent && !isRequest) handleSubscriptionChange(plan.id);
                        }}
                      >
                        {isCurrent ? 'Current Plan' : isRequest ? 'Request Sent' : 'Switch to this Plan'}
                      </Button>
                      <div className="mt-auto">
                        <div className="text-sm text-gray-700 mb-2">Plan includes:</div>
                        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                          {plan.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-gray-800 text-sm mb-1">
                              <Check className="h-4 w-4 text-primary" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;

