"use client";
import { Editor } from "primereact/editor";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/app/components/ui/button";
import { UserPlus, AlertCircle, RefreshCw, Upload, Trash2, Download, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const UploadVideo = ({ setTrigger }) => {
  const [open, onOpenChange] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [data, submittedData] = useState({
    title: "",
    role: "",
    type: "Video",
    content: "",
  });


  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a video file first");
      return;
    }

    try {
      setIsSubmitting(true);

      // Create FormData
      const formData = new FormData();
      formData.append('video', selectedFile);
      formData.append('title', data.title);
      formData.append('role', data.role);

      // Upload to your API endpoint
      const response = await fetch('/api/admin/resource/video', {
        method: 'POST',
        body: formData,
      });

      const responseData = await response.json();
      
      if (responseData.status) {
        onOpenChange(false);
        setTrigger((prev) => !prev);
        toast.success("Video uploaded successfully");
        // Reset states
        setSelectedFile(null);
        setPreviewUrl(null);
      } else {
        throw new Error(responseData.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload video");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="px-2">
      <Button onClick={() => onOpenChange(true)} className="mb-4 w-full sm:w-auto">
        <UserPlus className="mr-2 h-4 w-4" />
        Add video
      </Button>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-full max-w-xs sm:max-w-[500px] p-4 sm:p-6 max-h-[100vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Video</DialogTitle>
            <DialogDescription>Upload a new video to DigitalOcean.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 w-full">
            <Input
              name="title"
              placeholder="Video Title"
              onChange={(e) =>
                submittedData((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value,
                }))
              }
              className="w-full"
            />
            <div>
              <Label htmlFor="role" className="mb-2">
                To show
              </Label>
              <Select
                name="role"
                value={data.role}
                onValueChange={(e) =>
                  submittedData((prev) => ({ ...prev, ["role"]: e }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select the role to show" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="clinic">Clinic</SelectItem>
                  <SelectItem value="coach">Coach</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Select Video File</Label>
              <Input
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                className="cursor-pointer w-full"
              />
            </div>
            {previewUrl && (
              <div className="space-y-2">
                <Label>Preview</Label>
                <video
                  src={previewUrl}
                  controls
                  className="w-full max-h-[300px] rounded-lg"
                />
              </div>
            )}
            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-4 w-full">
              <Button
                onClick={handleUpload}
                disabled={isSubmitting || !selectedFile}
                className="flex items-center w-full sm:w-auto"
              >
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="mr-2 h-4 w-4" />
                )}
                {isSubmitting ? "Uploading..." : "Upload Video"}
              </Button>
              <Button onClick={() => onOpenChange(false)} variant="outline" className="w-full sm:w-auto">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UploadVideo;
