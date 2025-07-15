"use client"

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Badge } from "@/app/components/ui/badge"
import { Switch } from "@/app/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { Plus, X, Settings, Heart, Activity, TrendingUp, Clock, FileText, Info, Pencil, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/app/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/app/components/ui/alert-dialog";

// Helper to safely parse JSON fields
function safeParseJSON(val, fallback) {
  if (typeof val === "string") {
    try {
      return JSON.parse(val);
    } catch {
      return fallback;
    }
  }
  return val ?? fallback;
}

export default function HealthManagementApp() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [healthConditions, setHealthConditions] = useState([]);
  const [customRequests, setCustomRequests] = useState([]);
  const [coachingPrefs, setCoachingPrefs] = useState({});
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [editableProfile, setEditableProfile] = useState({});
  const [isAddConditionModalOpen, setIsAddConditionModalOpen] = useState(false);
  const [newCondition, setNewCondition] = useState({});
  const [isAddCustomConditionModalOpen, setIsAddCustomConditionModalOpen] = useState(false);
  const [customCondition, setCustomCondition] = useState({});
  const [noProfile, setNoProfile] = useState(false);
  const [editingCondition, setEditingCondition] = useState(null);
  const [isEditConditionModalOpen, setIsEditConditionModalOpen] = useState(false);
  const [editConditionForm, setEditConditionForm] = useState({ name: "", description: "" });
  const [deletingCondition, setDeletingCondition] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingCustomRequest, setEditingCustomRequest] = useState(null);
  const [isEditCustomRequestModalOpen, setIsEditCustomRequestModalOpen] = useState(false);
  const [editCustomRequestForm, setEditCustomRequestForm] = useState({ condition: "", severity: "", diagnosisDate: "", notes: "" });
  const [deletingCustomRequest, setDeletingCustomRequest] = useState(null);
  const [isDeleteCustomRequestDialogOpen, setIsDeleteCustomRequestDialogOpen] = useState(false);

  // Helper to fetch and set profile from backend
  const fetchAndSetProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/coach/client/${id}/profile`);
      if (res.status === 404) {
        setNoProfile(true);
        setProfileData(null);
        setHealthConditions([]);
        setCustomRequests([]);
        setCoachingPrefs({});
        setEditableProfile({});
      } else if (!res.ok) {
        throw new Error("Failed to fetch profile");
      } else {
        const data = await res.json();
        setNoProfile(false);
        if (data.profile) {
          setProfileData(safeParseJSON(data.profile.profileData, {}));
          setHealthConditions(Array.isArray(data.profile.healthConditions)
            ? data.profile.healthConditions
            : safeParseJSON(data.profile.healthConditions, []));
          setCustomRequests(Array.isArray(data.profile.customRequests)
            ? data.profile.customRequests
            : safeParseJSON(data.profile.customRequests, []));
          setCoachingPrefs(safeParseJSON(data.profile.coachingPrefs, {}));
          setEditableProfile(safeParseJSON(data.profile.profileData, {}));
        }
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchAndSetProfile();
    // eslint-disable-next-line
  }, [id]);


  // Save changes to profile (update backend with local frontend variables)
  const handleSaveChanges = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/coach/client/${id}/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileData: editableProfile,
          healthConditions,
          customRequests,
          coachingPrefs,
        }),
      });
      if (!res.ok) throw new Error("Failed to update profile");
      setIsProfileModalOpen(false);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Add health condition (only update customRequests)
  const handleAddCondition = () => {
    setCustomRequests(prev => {
      const parsed = Array.isArray(prev) ? prev : safeParseJSON(prev, []);
      const updated = [...parsed, newCondition];
      setIsAddConditionModalOpen(false);
      setNewCondition({
        condition: "",
        severity: "Moderate",
        diagnosisDate: "",
        notes: "",
      });
      return updated;
    });
  };

  // Remove health condition (only update state)
  const removeCondition = (idToRemove) => {
    setHealthConditions(healthConditions.filter((c) => c.id !== idToRemove));
  };

  // Add custom condition (only update healthConditions)
  const handleAddCustomCondition = () => {
    setHealthConditions(prev => {
      const parsed = Array.isArray(prev) ? prev : safeParseJSON(prev, []);
      // Only add name and description fields
      const { name, description } = customCondition;
      const updated = [...parsed, { name, description }];
      setIsAddCustomConditionModalOpen(false);
      setCustomCondition({
        name: "",
        description: "",
      });
      return updated;
    });
  };

  // Toggle coaching preference
  const togglePreference = (key) => {
    setCoachingPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const openProfileModal = () => {
    setIsProfileModalOpen(true)
  }

  const closeProfileModal = () => {
    setIsProfileModalOpen(false)
  }

  const openAddConditionModal = () => {
    setIsAddConditionModalOpen(true)
  }

  const closeAddConditionModal = () => {
    setIsAddConditionModalOpen(false)
    setNewCondition({
      condition: "",
      severity: "Moderate",
      diagnosisDate: "",
      notes: "",
    })
  }

  const openAddCustomConditionModal = () => {
    setIsAddCustomConditionModalOpen(true)
  }

  const closeAddCustomConditionModal = () => {
    setIsAddCustomConditionModalOpen(false)
    setCustomCondition({
      name: "",
      description: "",
    })
  }

  const updateNewCondition = (field, value) => {
    setNewCondition((prev) => ({ ...prev, [field]: value }))
  }

  const updateCustomCondition = (field, value) => {
    setCustomCondition((prev) => ({ ...prev, [field]: value }))
  }

  const updateEditableProfile = (field, value) => {
    setEditableProfile((prev) => ({ ...prev, [field]: value }))
  }

  // Create profile handler
  const handleCreateProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/coach/client/${id}/profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileData: editableProfile,
          healthConditions,
          customRequests,
          coachingPrefs,
        }),
      });

      if (!res.ok) throw new Error("Failed to create profile");
      const data = await res.json();
      if(data.status) {
      // After creation, fetch and show the latest data
      await fetchAndSetProfile();}
    } catch (e) {
      setError(e.message);
      throw new Error("error",e);
    } finally {
      setLoading(false);
    }
  };

  // In the render function, before using any profile data, always parse it:
  const parsedProfileData = safeParseJSON(profileData, {});
  const parsedHealthConditions = Array.isArray(healthConditions) ? healthConditions : safeParseJSON(healthConditions, []);
  const parsedCustomRequests = Array.isArray(customRequests) ? customRequests : safeParseJSON(customRequests, []);
  const parsedCoachingPrefs = safeParseJSON(coachingPrefs, {});
  const parsedEditableProfile = safeParseJSON(editableProfile, {});
  console.log("profileData in render", parsedProfileData, typeof parsedProfileData);
  console.log("healthConditions in render", parsedHealthConditions, typeof parsedHealthConditions);
  console.log("customRequests in render", parsedCustomRequests, typeof parsedCustomRequests);
  console.log("coachingPrefs in render", parsedCoachingPrefs, typeof parsedCoachingPrefs);

  const openEditConditionModal = (condition) => {
    setEditingCondition(condition);
    setEditConditionForm({ name: condition.name, description: condition.description });
    setIsEditConditionModalOpen(true);
  };
  const closeEditConditionModal = () => {
    setIsEditConditionModalOpen(false);
    setEditingCondition(null);
  };
  const handleEditConditionChange = (field, value) => {
    setEditConditionForm((prev) => ({ ...prev, [field]: value }));
  };
  const saveEditedCondition = () => {
    setHealthConditions((prev) =>
      prev.map((c) =>
        (c.id || c.name) === (editingCondition.id || editingCondition.name)
          ? { ...c, ...editConditionForm }
          : c
      )
    );
    closeEditConditionModal();
  };
  const openDeleteConditionDialog = (condition) => {
    setDeletingCondition(condition);
    setIsDeleteDialogOpen(true);
  };
  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setDeletingCondition(null);
  };
  const confirmDeleteCondition = () => {
    setHealthConditions((prev) =>
      prev.filter((c) => (c.id || c.name) !== (deletingCondition.id || deletingCondition.name))
    );
    closeDeleteDialog();
  };

  const openEditCustomRequestModal = (request) => {
    setEditingCustomRequest(request);
    setEditCustomRequestForm({
      condition: request.condition || "",
      severity: request.severity || "",
      diagnosisDate: request.diagnosisDate || "",
      notes: request.notes || "",
    });
    setIsEditCustomRequestModalOpen(true);
  };
  const closeEditCustomRequestModal = () => {
    setIsEditCustomRequestModalOpen(false);
    setEditingCustomRequest(null);
  };
  const handleEditCustomRequestChange = (field, value) => {
    setEditCustomRequestForm((prev) => ({ ...prev, [field]: value }));
  };
  const saveEditedCustomRequest = () => {
    setCustomRequests((prev) =>
      prev.map((r) =>
        (r.id || r.condition) === (editingCustomRequest.id || editingCustomRequest.condition)
          ? { ...r, ...editCustomRequestForm }
          : r
      )
    );
    closeEditCustomRequestModal();
  };
  const openDeleteCustomRequestDialog = (request) => {
    setDeletingCustomRequest(request);
    setIsDeleteCustomRequestDialogOpen(true);
  };
  const closeDeleteCustomRequestDialog = () => {
    setIsDeleteCustomRequestDialogOpen(false);
    setDeletingCustomRequest(null);
  };
  const confirmDeleteCustomRequest = () => {
    setCustomRequests((prev) =>
      prev.filter((r) => (r.id || r.condition) !== (deletingCustomRequest.id || deletingCustomRequest.condition))
    );
    closeDeleteCustomRequestDialog();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && noProfile && (
          <>
            <h1 className="text-2xl font-semibold text-gray-900 mb-4">Create Client Profile</h1>
            {/* Personal Information Section */}
            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">Gender</label>
                  <input className="w-full border rounded p-2" value={editableProfile.gender || ""} onChange={e => setEditableProfile(p => ({ ...p, gender: e.target.value }))} />
                </div>
                <div>
                  <label className="block mb-1">Age</label>
                  <input className="w-full border rounded p-2" value={editableProfile.age || ""} onChange={e => setEditableProfile(p => ({ ...p, age: e.target.value }))} />
                </div>
                <div>
                  <label className="block mb-1">Weight</label>
                  <input className="w-full border rounded p-2" value={editableProfile.weight || ""} onChange={e => setEditableProfile(p => ({ ...p, weight: e.target.value }))} />
                </div>
                <div>
                  <label className="block mb-1">Height</label>
                  <input className="w-full border rounded p-2" value={editableProfile.height || ""} onChange={e => setEditableProfile(p => ({ ...p, height: e.target.value }))} />
                </div>
                <div>
                  <label className="block mb-1">Activity Level</label>
                  <input className="w-full border rounded p-2" value={editableProfile.activityLevel || ""} onChange={e => setEditableProfile(p => ({ ...p, activityLevel: e.target.value }))} />
                </div>
                <div>
                  <label className="block mb-1">Goal</label>
                  <input className="w-full border rounded p-2" value={editableProfile.goal || ""} onChange={e => setEditableProfile(p => ({ ...p, goal: e.target.value }))} />
                </div>
                <div>
                  <label className="block mb-1">Dietary Preference</label>
                  <input className="w-full border rounded p-2" value={editableProfile.dietaryPreference || ""} onChange={e => setEditableProfile(p => ({ ...p, dietaryPreference: e.target.value }))} />
                </div>
                <div>
                  <label className="block mb-1">Food Allergies</label>
                  <input className="w-full border rounded p-2" value={editableProfile.foodAllergies || ""} onChange={e => setEditableProfile(p => ({ ...p, foodAllergies: e.target.value }))} />
                </div>
              </div>
            </section>

            <button className="mt-4 px-6 py-2 bg-teal-600 text-white rounded" onClick={handleCreateProfile}>Create Profile</button>
          </>
        )}
        {!loading && !error && !noProfile && (
          <>
        {/* Profile Settings Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Profile Settings</h1>
              <p className="text-gray-600">Manage your personal information and preferences</p>
            </div>
            <Button className="bg-teal-600 hover:bg-teal-700" onClick={openProfileModal}>
              <Settings className="w-4 h-4 mr-2" />
              Update Profile
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Personal Information
                </CardTitle>
                <CardDescription>Your basic profile details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Gender</Label>
                        <p className="text-gray-900">{parsedEditableProfile.gender}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Age</Label>
                        <p className="text-gray-900">{parsedEditableProfile.age}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Weight</Label>
                        <p className="text-gray-900">{parsedEditableProfile.weight}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Height</Label>
                        <p className="text-gray-900">{parsedEditableProfile.height}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Activity Level</Label>
                        <p className="text-gray-900">{parsedEditableProfile.activityLevel}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Goal</Label>
                        <p className="text-gray-900">{parsedEditableProfile.goal}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Dietary Preferences</CardTitle>
                <CardDescription>Your dietary restrictions and food allergies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Dietary Preference</Label>
                      <p className="text-gray-900">{parsedEditableProfile.dietaryPreference}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Food Allergies</Label>
                      <p className="text-gray-900">{parsedEditableProfile.foodAllergies}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Health Profile Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Health Profile</h1>
              <p className="text-gray-600">Manage your health conditions and coaching preferences</p>
            </div>
            <Button className="bg-teal-600 hover:bg-teal-700" onClick={openAddConditionModal}>
              <Plus className="w-4 h-4 mr-2" />
              Add Condition
            </Button>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Custom Condition Requests
              </CardTitle>
              <CardDescription>Track the status of your custom condition requests</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                  {parsedCustomRequests.map((request) => (
                <div key={request.id || request.condition} className="p-4 border rounded-lg bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-gray-900">{request.condition}</h3>
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Custom Request</Badge>
                      </div>
                      <p className="text-sm text-gray-600">Severity: {request.severity}</p>
                      <p className="text-sm text-gray-600">Diagnosis Date: {request.diagnosisDate}</p>
                      <p className="text-sm text-gray-600">Notes: {request.notes}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Edit"
                        onClick={() => openEditCustomRequestModal(request)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Delete"
                        onClick={() => openDeleteCustomRequestDialog(request)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  My Health Conditions
                </CardTitle>
                <CardDescription>Conditions you're managing with personalized nutrition guidance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                    {parsedHealthConditions.map((condition, idx) => (
                  <div key={condition.id || idx} className="p-4 border rounded-lg bg-white">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">{condition.name}</h3>
                          <p className="text-sm text-gray-600">{condition.description}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Edit"
                            onClick={() => openEditConditionModal(condition)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Delete"
                            onClick={() => openDeleteConditionDialog(condition)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <Button variant="outline" className="w-full bg-transparent" onClick={openAddCustomConditionModal}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Custom Condition
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Coaching Preferences
                </CardTitle>
                <CardDescription>Customize how you receive nutrition guidance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Daily Tips</Label>
                      <p className="text-sm text-gray-600">Receive daily nutrition tips based on your conditions</p>
                    </div>
                    <Switch checked={coachingPrefs.dailyTips} onCheckedChange={() => togglePreference("dailyTips")} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Food Warnings</Label>
                      <p className="text-sm text-gray-600">
                        Get alerts when logging foods that may affect your conditions
                      </p>
                    </div>
                    <Switch
                      checked={coachingPrefs.foodWarnings}
                      onCheckedChange={() => togglePreference("foodWarnings")}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Symptom Reminders</Label>
                      <p className="text-sm text-gray-600">Reminders to track symptoms and food reactions</p>
                    </div>
                    <Switch
                      checked={coachingPrefs.symptomReminders}
                      onCheckedChange={() => togglePreference("symptomReminders")}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Coaching Intensity</Label>
                    <Select
                      value={coachingPrefs.coachingIntensity}
                      onValueChange={(value) => setCoachingPrefs((prev) => ({ ...prev, coachingIntensity: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Minimal - Key tips only"
                        className="data-[state=checked]:bg-orange-500 data-[state=checked]:text-white"
                        >Minimal - Key tips only</SelectItem>
                        <SelectItem value="Moderate - Regular guidance"
                        className="data-[state=checked]:bg-orange-500 data-[state=checked]:text-white"
                        >Moderate - Regular guidance</SelectItem>
                        <SelectItem
                          value="Intensive - Detailed coaching"
                          className="data-[state=checked]:bg-orange-500 data-[state=checked]:text-white"
                        >
                          Intensive - Detailed coaching
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-2 block">Preferred Tip Time</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="time"
                        value={coachingPrefs.preferredTipTime || ''}
                        onChange={(e) => setCoachingPrefs((prev) => ({ ...prev, preferredTipTime: e.target.value }))}
                        className="flex-1"
                      />
                      <Clock className="w-4 h-4 text-gray-400" />
                    </div>
                    {coachingPrefs.preferredTipTime && (
                      <p className="text-xs text-gray-600 mt-1">Selected: {coachingPrefs.preferredTipTime}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Symptom Tracker Section
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Symptom Tracker</h1>
              <p className="text-gray-600">Track symptoms to identify patterns with food and lifestyle</p>
            </div>
            <Button className="bg-teal-600 hover:bg-teal-700">
              <Plus className="w-4 h-4 mr-2" />
              Log Symptom
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Recent Symptoms
              </CardTitle>
              <CardDescription>Your recent symptom logs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No symptoms logged yet</h3>
                <p className="text-gray-600">Start tracking to identify patterns</p>
              </div>
            </CardContent>
          </Card>
        </section> */}

        {/* Profile Update Modal */}
        <Dialog open={isProfileModalOpen} onOpenChange={setIsProfileModalOpen}>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">Your Profile Information</DialogTitle>
              <p className="text-sm text-gray-600">Complete your profile to get accurate nutrition recommendations</p>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              <p className="text-sm text-gray-600">
                Your profile information is used to calculate personalized nutrition recommendations. This information
                is required for both personalized and custom goal settings.
              </p>

              <div>
                <Label className="text-sm font-medium">Units</Label>
                <div className="flex items-center justify-between mt-1">
                      <span className="text-sm text-teal-600">{editableProfile?.units}</span>
                  <Switch defaultChecked />
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Gender</Label>
                <Select
                      value={editableProfile?.gender}
                  onValueChange={(value) => updateEditableProfile("gender", value)}
                >
                  <SelectTrigger className="mt-1 border-teal-500 focus:border-teal-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      value="Male"
                      className="data-[state=checked]:bg-orange-500 data-[state=checked]:text-white"
                    >
                      Male
                    </SelectItem>
                    <SelectItem value="Female"
                    className="data-[state=checked]:bg-orange-500 data-[state=checked]:text-white"
                    >Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Age (years)</Label>
                <Input
                  type="number"
                      value={editableProfile?.age}
                  onChange={(e) => updateEditableProfile("age", e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm font-medium">Weight (lbs)</Label>
                <Input
                  type="number"
                      value={editableProfile?.weight}
                  onChange={(e) => updateEditableProfile("weight", e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm font-medium">Height (in)</Label>
                <Input
                  type="number"
                      value={editableProfile?.height}
                  onChange={(e) => updateEditableProfile("height", e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm font-medium">Activity Level</Label>
                <Select
                      value={editableProfile?.activityLevel}
                  onValueChange={(value) => updateEditableProfile("activityLevel", value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sedentary (little or no exercise)"
                  className="data-[state=checked]:bg-orange-500 data-[state=checked]:text-white"
                    >Sedentary (little or no exercise)</SelectItem>
                    <SelectItem value="Light (exercise 1-3 days/week)"
                  className="data-[state=checked]:bg-orange-500 data-[state=checked]:text-white"
                    >Light (exercise 1-3 days/week)</SelectItem>
                    <SelectItem
                      value="Moderate (exercise 3-5 days/week)"
                  className="data-[state=checked]:bg-orange-500 data-[state=checked]:text-white"
                    >
                      Moderate (exercise 3-5 days/week)
                    </SelectItem>
                    <SelectItem value="Active (exercise 6-7 days/week)"
                   className="data-[state=checked]:bg-orange-500 data-[state=checked]:text-white"
                    >Active (exercise 6-7 days/week)</SelectItem>
                    <SelectItem value="Very Active (physical job or 2x training)"
                  className="data-[state=checked]:bg-orange-500 data-[state=checked]:text-white"
                    >
                      Very Active (physical job or 2x training)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Goal</Label>
                    <Select value={editableProfile?.goal} onValueChange={(value) => updateEditableProfile("goal", value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Weight Loss">Weight Loss</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                    <SelectItem value="Muscle Gain">Muscle Gain</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Dietary Preference</Label>
                <Select
                      value={editableProfile?.dietaryPreference}
                  onValueChange={(value) => updateEditableProfile("dietaryPreference", value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="No dietary restrictions">No dietary restrictions</SelectItem>
                    <SelectItem value="Vegetarian">Vegetarian</SelectItem>
                    <SelectItem value="Vegan">Vegan</SelectItem>
                    <SelectItem value="Pescatarian">Pescatarian</SelectItem>
                    <SelectItem value="Gluten-Free">Gluten-Free</SelectItem>
                    <SelectItem value="Keto/Low-Carb">Keto/Low-Carb</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Food Allergies (separate with commas)</Label>
                <Input
                      value={editableProfile?.foodAllergies}
                  onChange={(e) => updateEditableProfile("foodAllergies", e.target.value)}
                  className="mt-1"
                  placeholder="Enter allergies or type 'none'"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter your food allergies separated by commas, or type "none" if you have no allergies.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={closeProfileModal} className="flex-1 bg-transparent">
                  Cancel
                </Button>
                <Button onClick={()=>setIsProfileModalOpen(false)} className="flex-1 bg-teal-600 hover:bg-teal-700">
                  Save Profile
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Health Condition Modal */}
        <Dialog open={isAddConditionModalOpen} onOpenChange={setIsAddConditionModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">Add Health Condition</DialogTitle>
              <p className="text-sm text-gray-600">
                Add a health condition to receive personalized nutrition coaching.
              </p>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              <div>
                <Label className="text-sm font-medium">Health Condition</Label>
                <Select
                  value={newCondition.condition}
                  onValueChange={(value) => updateNewCondition("condition", value)}
                >
                  <SelectTrigger className="mt-1 border-teal-500 focus:border-teal-600">
                    <SelectValue placeholder="Select a condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cancer Treatment Support">Cancer Treatment Support</SelectItem>
                    <SelectItem value="Fibromyalgia">Fibromyalgia</SelectItem>
                    <SelectItem value="Hashimoto's">Hashimoto's</SelectItem>
                    <SelectItem value="Myasthenia Gravis">Myasthenia Gravis</SelectItem>
                    <SelectItem value="PCOS">PCOS</SelectItem>
                    <SelectItem value="Type 2 Diabetes">Type 2 Diabetes</SelectItem>
                    <SelectItem value="Arthritis">Arthritis</SelectItem>
                    <SelectItem value="Diverticulitis">Diverticulitis</SelectItem>
                    <SelectItem value="Crohns Disease">Crohn's Disease</SelectItem>
                    <SelectItem value="IBS">IBS</SelectItem>
                    <SelectItem value="Celiac Disease">Celiac Disease</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Severity Level</Label>
                <Select value={newCondition.severity} onValueChange={(value) => updateNewCondition("severity", value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mild">Mild</SelectItem>
                    <SelectItem value="Moderate">Moderate</SelectItem>
                    <SelectItem value="Severe">Severe</SelectItem>
                    <SelectItem value="Well Controlled">Well Controlled</SelectItem>
                    <SelectItem value="Remission">Remission</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Diagnosis Date (Optional)</Label>
                <Input
                  type="date"
                  value={newCondition.diagnosisDate}
                  onChange={(e) => updateNewCondition("diagnosisDate", e.target.value)}
                  className="mt-1"
                  placeholder="mm/dd/yyyy"
                />
              </div>

              <div>
                <Label className="text-sm font-medium">Notes (Optional)</Label>
                <textarea
                  value={newCondition.notes}
                  onChange={(e) => updateNewCondition("notes", e.target.value)}
                  className="mt-1 w-full min-h-[80px] px-3 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="Additional notes about your condition..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={closeAddConditionModal} className="flex-1 bg-transparent">
                  Cancel
                </Button>
                <Button
                  onClick={handleAddCondition}
                  className="flex-1 bg-teal-600 hover:bg-teal-700"
                  disabled={!newCondition.condition}
                >
                  Add Condition
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        {/* Add Custom Health Condition Modal */}
        <Dialog open={isAddCustomConditionModalOpen} onOpenChange={setIsAddCustomConditionModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">Add Custom Health Condition</DialogTitle>
              <p className="text-sm text-gray-600">
                Don't see your condition listed? Add it to your profile immediately and we'll research evidence-based
                dietary guidance for everyone.
              </p>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              <div>
                <Label className="text-sm font-medium">Name</Label>
                <Input
                  value={customCondition.name}
                  onChange={(e) => updateCustomCondition("name", e.target.value)}
                  className="mt-1 border-teal-500 focus:border-teal-600"
                  placeholder="e.g., PCOS, Hashimoto's Disease, etc."
                />
              </div>

              <div>
                <Label className="text-sm font-medium">Description (Optional)</Label>
                <textarea
                  value={customCondition.description}
                  onChange={(e) => updateCustomCondition("description", e.target.value)}
                  className="mt-1 w-full min-h-[80px] px-3 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="Additional details about your condition or specific dietary concerns..."
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-900 mb-2">What happens next:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Condition is immediately added to your profile for tracking</li>
                      <li>• AI generates evidence-based research for the condition</li>
                      <li>• Medical professionals review it for addition to global conditions list</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={closeAddCustomConditionModal} className="flex-1 bg-transparent">
                  Cancel
                </Button>
                <Button
                  onClick={handleAddCustomCondition}
                  className="flex-1 bg-teal-600 hover:bg-teal-700"
                  disabled={!customCondition.name}
                >
                  Add Condition
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        {/* Edit Condition Modal */}
        <Dialog open={isEditConditionModalOpen} onOpenChange={setIsEditConditionModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Health Condition</DialogTitle>
              <DialogDescription>Update the details for this condition.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <label className="block text-sm font-medium">Name</label>
              <Input
                value={editConditionForm.name}
                onChange={(e) => handleEditConditionChange("name", e.target.value)}
                className="mb-2"
              />
              <label className="block text-sm font-medium">Description</label>
              <Input
                value={editConditionForm.description}
                onChange={(e) => handleEditConditionChange("description", e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button onClick={saveEditedCondition}>Save</Button>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Health Condition?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this condition? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={closeDeleteDialog}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDeleteCondition} className="bg-red-600 hover:bg-red-700">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        {/* Edit Custom Request Modal */}
        <Dialog open={isEditCustomRequestModalOpen} onOpenChange={setIsEditCustomRequestModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Custom Condition Request</DialogTitle>
              <DialogDescription>Update the details for this custom request.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <label className="block text-sm font-medium">Condition</label>
              <Input
                value={editCustomRequestForm.condition}
                onChange={(e) => handleEditCustomRequestChange("condition", e.target.value)}
                className="mb-2"
              />
              <label className="block text-sm font-medium">Severity</label>
              <Input
                value={editCustomRequestForm.severity}
                onChange={(e) => handleEditCustomRequestChange("severity", e.target.value)}
                className="mb-2"
              />
              <label className="block text-sm font-medium">Diagnosis Date</label>
              <Input
                value={editCustomRequestForm.diagnosisDate}
                onChange={(e) => handleEditCustomRequestChange("diagnosisDate", e.target.value)}
                className="mb-2"
              />
              <label className="block text-sm font-medium">Notes</label>
              <Input
                value={editCustomRequestForm.notes}
                onChange={(e) => handleEditCustomRequestChange("notes", e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button onClick={saveEditedCustomRequest}>Save</Button>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {/* Delete Custom Request Confirmation Dialog */}
        <AlertDialog open={isDeleteCustomRequestDialogOpen} onOpenChange={setIsDeleteCustomRequestDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Custom Condition Request?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this custom request? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={closeDeleteCustomRequestDialog}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDeleteCustomRequest} className="bg-red-600 hover:bg-red-700">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
          </>
        )}
        {/* Save Changes Button */}
        <div className="flex justify-end mt-8">
          {
            !loading && !error && noProfile?"":(
              <Button
            className="bg-teal-600 hover:bg-teal-700 px-8 py-3 text-lg"
            onClick={handleSaveChanges}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>)
          }
          
        </div>
      </div>
    </div>
  )
}
