"use client";
import { useState, useEffect } from "react";
import { Button } from "@/app/components/ui/button";
import { toast } from "sonner";
import { Download, Trash2, Eye, Loader2, FileText } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/app/components/ui/dialog";

export default function PDFList({ trigger }) {
  const { user } = useAuth();
  const [pdfs, setPDFs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    fetchPDFs();
  }, [trigger]);

  const fetchPDFs = async () => {
    try {
      const response = await fetch("/api/admin/resource/pdf");
      const data = await response.json();
      setPDFs(data.pdfs);
    } catch (error) {
      toast.error("Error fetching PDFs");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (pdfId) => {
    setDeletingId(pdfId);
    try {
      const response = await fetch(`/api/admin/resource/pdf/${pdfId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to delete PDF: ${response.status}`);
      }
      setPDFs(pdfs.filter((p) => p.id !== pdfId));
      toast.success("PDF deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error.message || "Error deleting PDF");
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  };

  const handleDownload = async (url, title, pdfId) => {
    if (!url) {
      toast.error("Invalid PDF URL");
      return;
    }
    setDownloadingId(pdfId);
    try {
      const response = await fetch(`/api/admin/resource/pdf/download?url=${encodeURIComponent(url)}`, {
        method: "GET",
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to download PDF: ${response.status}`);
      }
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `${title}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
      toast.success(`"${title}" downloaded successfully`);
    } catch (error) {
      console.error("Download error:", error);
      toast.error(error.message || "Error downloading PDF");
    } finally {
      setDownloadingId(null);
    }
  };

  const handleView = (url) => {
    if (!url) {
      toast.error("Invalid PDF URL");
      return;
    }
    window.open(url, "_blank");
    toast.success("PDF opened in a new tab");
  };

  if (loading) {
    return <div className="px-2">Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-2">
      {pdfs?.map((pdf) => (
        <div
          key={pdf.id}
          className="border rounded-lg p-4 w-full bg-white hover:shadow-lg transition-shadow cursor-pointer group"
          tabIndex={0}
          aria-label={`PDF resource: ${pdf.title}`}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-100 rounded-full">
              <FileText className="text-red-500 h-6 w-6" />
            </div>
            <span className="text-base font-semibold text-gray-800 group-hover:text-red-600 transition-colors">{pdf.title}</span>
          </div>
          <div className="flex flex-wrap gap-2 mt-2 items-center text-xs text-gray-500">
            {pdf.size && <span>Size: {(pdf.size / 1024).toFixed(1)} KB</span>}
            {pdf.uploadDate && <span>Uploaded: {new Date(pdf.uploadDate).toLocaleDateString()}</span>}
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleDownload(pdf.content, pdf.title, pdf.id)}
              disabled={downloadingId === pdf.id || deletingId === pdf.id}
              className="flex items-center gap-2"
              aria-label="Download PDF"
            >
              {downloadingId === pdf.id ? (
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
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleView(pdf.content)}
              className="flex items-center gap-2"
              aria-label="View PDF"
            >
              <Eye className="h-4 w-4" />
              <span>View</span>
            </Button>
            {isAdmin ? (
              <>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setConfirmDeleteId(pdf.id)}
                  disabled={downloadingId === pdf.id || deletingId === pdf.id}
                  className="flex items-center gap-2"
                  aria-label="Delete PDF"
                >
                  {deletingId === pdf.id ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4" />
                      <span>Delete</span>
                    </>
                  )}
                </Button>
                <Dialog open={confirmDeleteId === pdf.id} onOpenChange={() => setConfirmDeleteId(null)}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete PDF</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete <b>{pdf.title}</b>? This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex gap-2 justify-end mt-4">
                      <Button variant="outline" onClick={() => setConfirmDeleteId(null)}>
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleDelete(pdf.id)}
                        disabled={deletingId === pdf.id}
                      >
                        {deletingId === pdf.id ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
} 