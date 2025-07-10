"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/app/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Loader2, Upload, Camera, Image as ImageIcon, X, RotateCcw, Smartphone } from "lucide-react";
import { toast } from "sonner";

export default function ImageUpload({ open, onOpenChange, onUpload }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [cameraType, setCameraType] = useState("environment"); // "environment" (back) or "user" (front)
  const [isLoadingCamera, setIsLoadingCamera] = useState(false);
  const [frontCameraAvailable, setFrontCameraAvailable] = useState(false);
  const [backCameraAvailable, setBackCameraAvailable] = useState(false);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const galleryInputRef = useRef(null);
  const streamRef = useRef(null);

  // Detect available cameras and start camera when modal opens
  useEffect(() => {
    if (showCamera) {
      detectAvailableCameras().then(() => {
        // Start camera after detection is complete
        startCamera();
      });
    } else {
      stopCamera();
    }
    
    // Cleanup on unmount
    return () => {
      stopCamera();
    };
  }, [showCamera]);

  // Start camera when camera type changes (but only if camera modal is open)
  useEffect(() => {
    if (showCamera) {
      startCamera();
    }
  }, [cameraType]);

  const detectAvailableCameras = async () => {
    try {
      console.log("Detecting available cameras...");
      
      let frontAvailable = false;
      let backAvailable = false;
      
      // Test front camera availability
      try {
        const frontStream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'user' } 
        });
        frontStream.getTracks().forEach(track => track.stop());
        frontAvailable = true;
        console.log("Front camera is available");
      } catch (error) {
        console.log("Front camera not available:", error.name);
        frontAvailable = false;
      }
      
      // Test back camera availability
      try {
        const backStream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        backStream.getTracks().forEach(track => track.stop());
        backAvailable = true;
        console.log("Back camera is available");
      } catch (error) {
        console.log("Back camera not available:", error.name);
        backAvailable = false;
      }
      
      // If neither specific camera is available, try any camera
      if (!frontAvailable && !backAvailable) {
        try {
          const anyStream = await navigator.mediaDevices.getUserMedia({ video: true });
          anyStream.getTracks().forEach(track => track.stop());
          // If we get here, at least one camera is available
          backAvailable = true;
          console.log("At least one camera is available");
        } catch (error) {
          console.log("No cameras available:", error.name);
          setCameraError("No cameras available on this device");
        }
      }
      
      // Update state with the results
      setFrontCameraAvailable(frontAvailable);
      setBackCameraAvailable(backAvailable);
      
      console.log("Camera detection complete - Front:", frontAvailable, "Back:", backAvailable);
      
    } catch (error) {
      console.error("Error detecting cameras:", error);
      setCameraError("Could not detect cameras");
    }
  };

  const startCamera = async () => {
    setIsLoadingCamera(true);
    setCameraError("");
    
    try {
      // Stop existing stream if any
      stopCamera();
      
      console.log(`Starting camera with facing mode: ${cameraType}`);
      
      // Try to get camera stream with specific facing mode
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: cameraType,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });
      
      // Set the stream to video element
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        console.log(`Successfully started ${cameraType} camera`);
      }
      
    } catch (error) {
      console.error(`Error starting ${cameraType} camera:`, error);
      
      // If specific facing mode fails, try any available camera
      try {
        console.log("Trying any available camera");
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          }
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
          console.log("Successfully started any available camera");
        }
        
      } catch (anyCameraError) {
        console.error("All camera attempts failed:", anyCameraError);
        setCameraError("Camera not available or permission denied.");
        setShowCamera(false);
      }
    } finally {
      setIsLoadingCamera(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      console.log("Camera stream stopped");
    }
  };

  const switchCamera = async () => {
    try {
      const newCameraType = cameraType === "environment" ? "user" : "environment";
      
      console.log(`Switching from ${cameraType} to ${newCameraType}`);
      
      // Stop current stream first
      stopCamera();
      
      // Update camera state
      setCameraType(newCameraType);
      
      // Show a brief toast to indicate camera switching
      toast.info(`Switching to ${newCameraType === "environment" ? "back" : "front"} camera...`);
      
    } catch (error) {
      console.error('Error switching camera:', error);
      toast.error('Failed to switch camera');
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Open custom camera modal
  const handleTakePhoto = () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      toast.error("Camera not available on this device.");
      return;
    }
    setCameraError("");
    setShowCamera(true);
  };

  // Capture photo from video stream
  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (blob) {
        setSelectedFile(new File([blob], `photo_${Date.now()}.jpg`, { type: "image/jpeg" }));
        setPreviewUrl(URL.createObjectURL(blob));
        setShowCamera(false);
      }
    }, "image/jpeg", 0.95);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select an image first");
      return;
    }
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("description", description);
      const current = new Date();
      formData.append("date", current);
      // Upload to your API endpoint
      const response = await fetch("/api/admin/resource/image", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.status && data.url) {
        toast.success("Image uploaded successfully");
        onUpload({ url: data.url, description });
        setSelectedFile(null);
        setPreviewUrl(null);
        setDescription("");
        onOpenChange(false);
      } else {
        throw new Error(data.message || "Upload failed");
      }
    } catch (error) {
      toast.error(error.message || "Failed to upload image");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDialogClose = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setDescription("");
    setShowCamera(false);
    setCameraError("");
    setCameraType("environment"); // Reset to back camera
    setIsLoadingCamera(false);
    setFrontCameraAvailable(false);
    setBackCameraAvailable(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent
        className="w-full max-w-[95vw] sm:max-w-[400px] p-2 sm:p-6 max-h-[95vh] sm:max-h-[100vh] overflow-y-auto overflow-x-hidden"
        style={{
          borderRadius: 16,
          boxShadow: '0 4px 24px 0 rgba(80, 80, 120, 0.15)',
          margin: 0,
        }}
      >
        <DialogHeader>
          <DialogTitle>Upload Image</DialogTitle>
          <DialogDescription>Take a photo or select an image, add a description, and upload.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 w-full">
          {/* Camera Modal */}
          {showCamera && (
            <div className="flex flex-col items-center space-y-2 w-full">
              <div className="w-full flex justify-center relative">
                {isLoadingCamera && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg z-10">
                    <div className="flex items-center gap-2 text-white">
                      <Loader2 className="h-6 w-6 animate-spin" />
                      <span>Loading camera...</span>
                    </div>
                  </div>
                )}
                <video
                  ref={videoRef}
                  className="rounded-lg bg-black"
                  autoPlay
                  playsInline
                  muted
                  style={{
                    width: '100%',
                    maxWidth: '100vw',
                    height: 'auto',
                    aspectRatio: '3/4',
                    maxHeight: '60vh',
                    objectFit: 'cover',
                    background: '#000',
                  }}
                />
                {/* Camera switching button - always show when camera is active */}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={switchCamera}
                  disabled={isLoadingCamera}
                  className="absolute top-2 right-2 z-20 bg-white bg-opacity-80 hover:bg-opacity-100"
                  style={{ minWidth: 'auto', padding: '8px' }}
                  title={`Switch to ${cameraType === "environment" ? "front" : "back"} camera`}
                >
                  <RotateCcw className="h-4 w-4" />
                  <span className="ml-1 text-xs">
                    {cameraType === "environment" ? "→ Front" : "→ Back"}
                  </span>
                </Button>
                {/* Camera indicator */}
                <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded z-20">
                  <Smartphone className="h-3 w-3 inline mr-1" />
                  {cameraType === "environment" ? "Back Camera" : "Front Camera"}
                  {!frontCameraAvailable && !backCameraAvailable && (
                    <span className="ml-1 text-yellow-300">(Single camera)</span>
                  )}
                </div>
              </div>
              <div className="flex gap-2 w-full mt-2">
                <Button 
                  type="button" 
                  onClick={handleCapture} 
                  disabled={isLoadingCamera}
                  className="flex-1 flex items-center gap-2"
                >
                  <Camera className="h-4 w-4" /> Capture
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowCamera(false)} 
                  className="flex-1 flex items-center gap-2"
                >
                  <X className="h-4 w-4" /> Cancel
                </Button>
              </div>
              <canvas ref={canvasRef} style={{ display: "none" }} />
            </div>
          )}
          {!showCamera && (
            <>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleTakePhoto}
                  className="flex-1 flex items-center gap-2"
                >
                  <Camera className="h-4 w-4" /> Take Photo
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => galleryInputRef.current && galleryInputRef.current.click()}
                  className="flex-1 flex items-center gap-2"
                >
                  <ImageIcon className="h-4 w-4" /> Choose from Gallery
                </Button>
              </div>
              {/* Hidden file input for gallery */}
              <input
                ref={galleryInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFileSelect}
              />
              {cameraError && <div className="text-red-500 text-sm mt-2">{cameraError}</div>}
              <div className="text-blue-600 text-sm mt-2 flex items-center gap-1">
                <Smartphone className="h-3 w-3" />
                {!frontCameraAvailable && !backCameraAvailable ? (
                  "Single camera detected - switching not available"
                ) : !frontCameraAvailable ? (
                  "Back camera only - front camera not available"
                ) : !backCameraAvailable ? (
                  "Front camera only - back camera not available"
                ) : (
                  "Tap the rotate button (↻) in the camera view to switch between front and back cameras"
                )}
              </div>
            </>
          )}
          {previewUrl && !showCamera && (
            <div className="space-y-2">
              <Label>Preview</Label>
              <img src={previewUrl} alt="Preview" className="w-full max-h-48 rounded-lg object-cover" style={{ maxWidth: '100vw', height: 'auto' }} />
            </div>
          )}
          {!showCamera && (
            <>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Add a description (optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full"
                />
              </div>
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
                  {isSubmitting ? "Uploading..." : "Upload Image"}
                </Button>
                <Button onClick={handleDialogClose} variant="outline" className="w-full sm:w-auto">
                  Cancel
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 