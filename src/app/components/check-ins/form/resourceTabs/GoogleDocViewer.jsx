"use client";
import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { FileText, Download, Eye, FolderOpen } from "lucide-react";

export default function GoogleDocViewer({ selectedResource }) {
  const docId = extractDocId(selectedResource.content);
  const [isPreview, setIsPreview] = useState(false);
  if (!docId) {
    return <div>Invalid Google Doc URL</div>;
  }

  const embedUrl = `https://docs.google.com/document/d/${docId}/preview`;
  const pdfUrl = `https://docs.google.com/document/d/${docId}/export?format=pdf`;
  const docxUrl = `https://docs.google.com/document/d/${docId}/export?format=docx`;

  return (
    <div className="px-2">
      {isPreview ? (
        <iframe
          src={embedUrl}
          width="100%"
          height="600"
          frameBorder="0"
          style={{ border: "none" }}
          allowFullScreen
          title="Google Doc Preview"
        />
      ) : (
        <div className="flex flex-col items-center justify-center p-10 border rounded-md bg-gray-50 w-full">
          <FileText size={64} className="text-gray-400 mb-4" />
          <p className="text-gray-500 mb-6">{selectedResource.description}</p>
        </div>
      )}
      <div className="flex flex-col sm:flex-row gap-2 mt-5 justify-center w-full">
        <Button
          variant="outline"
          className="flex items-center gap-2 w-full sm:w-auto"
          onClick={() => setIsPreview((prev) => !prev)}
        >
          {isPreview ? <Eye size={16} /> : <FolderOpen size={16} />}
          Preview
        </Button>
        <Button className="flex items-center gap-2 w-full sm:w-auto">
          <Download size={16} />
          <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
            Download as PDF
          </a>
          {" | "}
          <a href={docxUrl} target="_blank" rel="noopener noreferrer">
            Download as DOCX
          </a>
        </Button>
      </div>
    </div>
  );
}

// Helper function
function extractDocId(url) {
  const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
  return match ? match[1] : null;
}
