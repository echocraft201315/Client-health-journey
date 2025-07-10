"use client";

import { useState, useEffect } from "react";
import { Button } from "@/app/components/ui/button";
import { toast } from "sonner";
import { Download, Trash2, Loader2 } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";

export default function VideoList({ trigger }) {
  const {user} = useAuth();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const isAdmin = user?.role === "admin";
  useEffect(() => {
    fetchVideos();
  }, [trigger]);

  const fetchVideos = async () => {
    try {
      const response = await fetch("/api/admin/resource/video");
      const data = await response.json();
      setVideos(data.videos);
    } catch (error) {
      toast.error("Error fetching videos");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (videoId) => {
    setDeletingId(videoId);
    try {
      const response = await fetch(`/api/admin/resource/video/${videoId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to delete video: ${response.status}`);
      }

      setVideos(videos.filter((v) => v.id !== videoId));
      toast.success("Video deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error.message || "Error deleting video");
    } finally {
      setDeletingId(null);
    }
  };

  const handleDownload = async (url, title, videoId) => {
    if (!url) {
      toast.error("Invalid video URL");
      return;
    }

    setDownloadingId(videoId);
    try {
      const response = await fetch(`/api/admin/resource/video/download?url=${encodeURIComponent(url)}`, {
        method: "GET",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to download video: ${response.status}`);
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `${title}.mp4`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
      toast.success(`"${title}" downloaded successfully`);
    } catch (error) {
      console.error("Download error:", error);
      toast.error(error.message || "Error downloading video");
    } finally {
      setDownloadingId(null);
    }
  };

  if (loading) {
    return <div className="px-2">Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-2">
      {videos?.map((video) => (
        <div key={video.id} className="border rounded-lg p-4 w-full">
          <video
            controls
            className="w-full rounded-lg mb-2"
            src={video.content}
          >
            Your browser does not support the video tag.
          </video>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <span className="text-sm text-gray-600 w-full sm:w-auto">{video.title}</span>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleDownload(video.content, video.title, video.id)}
                disabled={downloadingId === video.id || deletingId === video.id}
                className="flex items-center gap-2 w-full sm:w-auto"
              >
                {downloadingId === video.id ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Downloading...</span>
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    <span>Download</span>
                  </>
                )}
              </Button>
              {isAdmin?(
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(video.id)}
                  disabled={downloadingId === video.id || deletingId === video.id}
                  className="flex items-center gap-2 w-full sm:w-auto"
                >
                  {deletingId === video.id ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4" />
                      <span>Delete</span>
                    </>
                  )}
                </Button>
              ):null}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
