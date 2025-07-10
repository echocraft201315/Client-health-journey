"use client";
import PDFUpload from "./PDFUpload";
import PDFList from "./PDFList";
import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";

export default function PDFTab() {
  const { user } = useAuth();
  const [trigger, setTrigger] = useState(false);
  const isAdmin = user?.role === "admin";
  return (
    <div className="w-full max-w-3xl px-2 py-4">
      {isAdmin ? (
        <>
          <h1 className="text-2xl font-bold mb-4">PDF Management</h1>
          <PDFUpload setTrigger={setTrigger} />
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Uploaded PDFs</h2>
            <PDFList trigger={trigger} />
          </div>
        </>
      ) : (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Uploaded PDFs</h2>
          <PDFList trigger={trigger} />
        </div>
      )}
    </div>
  );
} 