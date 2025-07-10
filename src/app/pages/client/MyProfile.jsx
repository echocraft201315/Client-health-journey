"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { User, Settings, Shield, BellRing, LogOut } from "lucide-react";
import { Switch } from "../../components/ui/switch";
import { useAuth } from "../../context/AuthContext";
import { toast } from "sonner";
import { signOut } from "next-auth/react";

const MyProfile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    origin: user?.email || ""
  });

  const [securityForm, setSecurityForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notifications, setNotifications] = useState({
    email: true,
    inApp: true,
    checkIns: true,
    messages: true,
    updates: false,
  });

  const handleChange = (e) => {
    setFormData((pre) => ({ ...pre, [e.target.name]: e.target.value }));
  };

  const handleSecurityChange = (e) => {
    setSecurityForm((pre) => ({ ...pre, [e.target.name]: e.target.value }));
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      const respond = await fetch("/api/user/profile", {
        method: "PUT",
        body: JSON.stringify(formData),
      });
      const data = await respond.json();
      if (data.success) {
        toast.success("Profile updated successfully");
        setLoading(false);
        signOut();
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error("Something went wrong");
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (
      securityForm.newPassword &&
      securityForm.newPassword !== securityForm.confirmPassword
    ) {
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
        body: JSON.stringify({
          currentPassword: securityForm.currentPassword,
          newPassword: securityForm.newPassword,
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
  const logout = () => {};
  const handleNotificationChange = (key, value) => {
    const newNotifications = { ...notifications, [key]: value };
    setNotifications(newNotifications);
  };
  const [avatarSrc, setAvatarSrc] = useState("https://i.pravatar.cc/150");
  const fileInputRef = useRef(null);
  const onChangeClick = () => {
    fileInputRef.current?.click();
  };

  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!["image/png", "image/jpeg"].includes(file.type)) {
      alert("Please select a PNG or JPG image.");
      return;
    }

    // Create local URL for preview
    const localUrl = URL.createObjectURL(file);
    setAvatarSrc(localUrl);

    // Note: No upload, purely frontend
  };

  console.log(avatarSrc);
  return (
    <div className="px-2 sm:px-4 md:px-6 py-4 w-full max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-500">
          Update your personal information and preferences
        </p>
      </div>

      <Tabs defaultValue="personal">
        <TabsList className="mb-6 grid grid-cols-3 w-full">
          <TabsTrigger value="personal" className="flex items-center gap-2">
            <User size={16} />
            <span>Personal Info</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield size={16} />
            <span>Security</span>
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="flex items-center gap-2"
          >
            <BellRing size={16} />
            <span>Notifications</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex flex-col items-center space-y-4 md:w-1/3 w-full">
                  <Avatar className="w-32 h-32">
                    {/* <AvatarImage
                      src="https://i.pravatar.cc/150"
                      alt={user?.name}
                    /> */}
                    {avatarSrc ? (
                      <AvatarImage src={avatarSrc} alt={user?.name} />
                    ) : (
                      <AvatarFallback>U</AvatarFallback>
                    )}
                    <AvatarFallback className="text-2xl">
                      {user?.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <input
                    type="file"
                    accept="image/png, image/jpeg"
                    ref={fileInputRef}
                    onChange={onFileChange}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    onClick={onChangeClick}
                    className="w-full"
                  >
                    Change Photo
                  </Button>
                </div>

                <div className="space-y-4 md:w-2/3 w-full">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 gap-y-4">
                    <div>
                      <Label htmlFor="name" className="mb-[10px]">
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={loading}
                      />
                    </div>

                    <div>
                      <Label htmlFor="email" className="mb-[10px]">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={loading}
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone" className="mb-[10px]">
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSaveProfile} disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Password & Security</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Change Password</h3>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input
                        id="current-password"
                        name="currentPassword"
                        type="password"
                        value={securityForm.currentPassword}
                        onChange={handleSecurityChange}
                        placeholder="Enter your current password"
                        disabled={loading}
                      />
                    </div>

                    <div>
                      <Label htmlFor="password">New Password</Label>
                      <Input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        value={securityForm.newPassword}
                        onChange={handleSecurityChange}
                        placeholder="Enter your new password"
                        disabled={loading}
                      />
                    </div>

                    <div>
                      <Label htmlFor="confirmPassword">
                        Confirm New Password
                      </Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={securityForm.confirmPassword}
                        onChange={handleSecurityChange}
                        placeholder="Confirm your new password"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <Button onClick={handlePasswordChange} disabled={loading}>
                    {loading ? "Updating..." : "Update Password"}
                  </Button>
                </div>
                {/* 
                <div className="pt-6 border-t">
                  <h3 className="text-lg font-medium mb-4">Account Actions</h3>

                  <Button
                    variant="destructive"
                    onClick={() => logout()}
                    className="flex items-center gap-2"
                  >
                    <LogOut size={16} />
                    <span>Log Out</span>
                  </Button>
                </div> */}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">
                    Notification Preferences
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Email Notifications</Label>
                        <p className="text-sm text-gray-500">
                          Receive notifications via email
                        </p>
                      </div>
                      <Switch
                        checked={notifications.email}
                        onCheckedChange={(checked) =>
                          handleNotificationChange("email", checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>In-App Notifications</Label>
                        <p className="text-sm text-gray-500">
                          Receive notifications within the application
                        </p>
                      </div>
                      <Switch
                        checked={notifications.inApp}
                        onCheckedChange={(checked) =>
                          handleNotificationChange("inApp", checked)
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t">
                  <h3 className="text-lg font-medium mb-4">
                    Notification Types
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Daily Check-In Reminders</Label>
                        <p className="text-sm text-gray-500">
                          Remind me to complete my daily check-in
                        </p>
                      </div>
                      <Switch
                        checked={notifications.checkIns}
                        onCheckedChange={(checked) =>
                          handleNotificationChange("checkIns", checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>New Messages</Label>
                        <p className="text-sm text-gray-500">
                          Notify me when I receive new messages
                        </p>
                      </div>
                      <Switch
                        checked={notifications.messages}
                        onCheckedChange={(checked) =>
                          handleNotificationChange("messages", checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Program Updates</Label>
                        <p className="text-sm text-gray-500">
                          Notify me of updates to my program
                        </p>
                      </div>
                      <Switch
                        checked={notifications.updates}
                        onCheckedChange={(checked) =>
                          handleNotificationChange("updates", checked)
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyProfile;
