"use client";
import UploadVideo from "./VideoUpload";
import VideoList from "./VideoList";
import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";

export default function VideoTab() {
  const { user } = useAuth();
  const [trigger, setTrigger] = useState(false);
  const isAdmin = user?.role === "admin";
  console.log(trigger);
  return (
    <div className="w-full max-w-3xl px-2 py-4">
      {isAdmin ? (
        <>
          <h1 className="text-2xl font-bold mb-4">Video Management</h1>
          <UploadVideo setTrigger={setTrigger} />
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Uploaded Videos</h2>
            <VideoList trigger={trigger} />
          </div>
        </>
      ) : (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Uploaded Videos</h2>
          <VideoList trigger={trigger} />
        </div>
      )}
    </div>
  );
}
