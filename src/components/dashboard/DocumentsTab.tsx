import { useState, useEffect, useRef } from "react";
import { Upload, FileText, Check, X, Loader2, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/integrations/gcp/api-client";
import type { Document } from "@/integrations/gcp/types";

interface DocumentType {
  key: string;
  label: string;
  description: string;
  required: boolean;
}

const documentTypes: DocumentType[] = [
  {
    key: "government_id",
    label: "Government ID",
    description: "Passport, Driver's License, or National ID",
    required: true,
  },
  {
    key: "resume",
    label: "Resume / CV",
    description: "Your latest resume or curriculum vitae",
    required: false,
  },
  {
    key: "nbi_clearance",
    label: "NBI Clearance",
    description: "National Bureau of Investigation clearance",
    required: true,
  },
  {
    key: "educational_documents",
    label: "Educational Documents",
    description: "Diploma, transcript, or certificates",
    required: true,
  },
  {
    key: "skills_tesda_certification",
    label: "Skills / TESDA Certification",
    description: "Technical skills or TESDA certifications",
    required: false,
  },
  {
    key: "medical_exam_results",
    label: "Medical Exam Results",
    description: "Recent medical examination results",
    required: true,
  },
];

interface DocumentsTabProps {
  userId: string; // Firebase UID
}

const DocumentsTab = ({ userId }: DocumentsTabProps) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const { toast } = useToast();

  useEffect(() => {
    fetchDocuments();
  }, [userId]);

  const fetchDocuments = async () => {
    try {
      const data = await apiClient.listDocuments();
      setDocuments(data);
    } catch (error) {
      console.error("Error fetching documents:", error);
      toast({
        title: "Error",
        description: "Failed to load documents",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getDocumentForType = (type: string): Document | undefined => {
    return documents.find((doc) => doc.document_type === type);
  };

  const handleFileSelect = async (type: string, file: File) => {
    if (!file) return;

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Maximum file size is 10MB",
        variant: "destructive",
      });
      return;
    }

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/jpg",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload PDF, DOC, DOCX, JPG, or PNG files",
        variant: "destructive",
      });
      return;
    }

    setUploading(type);

    try {
      await apiClient.uploadDocument(file, type);

      toast({
        title: "Success",
        description: "Document uploaded successfully",
      });

      fetchDocuments();
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload document",
        variant: "destructive",
      });
    } finally {
      setUploading(null);
    }
  };

  const handleDelete = async (type: string) => {
    const doc = getDocumentForType(type);
    if (!doc) return;

    setDeleting(type);

    try {
      await apiClient.deleteDocument(doc.id);

      toast({
        title: "Deleted",
        description: "Document removed successfully",
      });

      fetchDocuments();
    } catch (error: any) {
      console.error("Delete error:", error);
      toast({
        title: "Delete failed",
        description: error.message || "Failed to delete document",
        variant: "destructive",
      });
    } finally {
      setDeleting(null);
    }
  };

  const handleView = async (doc: Document) => {
    try {
      const { url } = await apiClient.getDocumentDownloadUrl(doc.id);
      window.open(url, "_blank");
    } catch (error: any) {
      console.error("View error:", error);
      toast({
        title: "Error",
        description: "Failed to view document",
        variant: "destructive",
      });
    }
  };

  const formatFileSize = (bytes: number | null): string => {
    if (!bytes) return "Unknown size";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const completedCount = documents.length;
  const totalRequired = documentTypes.filter((d) => d.required).length;
  const completedRequired = documents.filter((d) =>
    documentTypes.find((dt) => dt.key === d.document_type && dt.required)
  ).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 text-cream animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Summary */}
      <div className="bg-cream/10 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-cream font-semibold">Document Completion</h3>
          <span className="text-secondary font-bold">
            {completedCount}/{documentTypes.length} uploaded
          </span>
        </div>
        <div className="w-full bg-cream/20 rounded-full h-2">
          <div
            className="bg-secondary h-2 rounded-full transition-all duration-300"
            style={{ width: `${(completedCount / documentTypes.length) * 100}%` }}
          />
        </div>
        <p className="text-cream/60 text-sm mt-2">
          {completedRequired}/{totalRequired} required documents completed
        </p>
      </div>

      {/* Document List */}
      <div className="space-y-4">
        {documentTypes.map((docType) => {
          const doc = getDocumentForType(docType.key);
          const isUploading = uploading === docType.key;
          const isDeleting = deleting === docType.key;

          return (
            <div
              key={docType.key}
              className={`bg-cream rounded-xl p-4 ${
                doc ? "border-2 border-secondary/30" : ""
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      doc ? "bg-secondary/20" : "bg-primary/10"
                    }`}
                  >
                    {doc ? (
                      <Check className="h-5 w-5 text-secondary" />
                    ) : (
                      <FileText className="h-5 w-5 text-primary/60" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-primary">{docType.label}</h4>
                      {docType.required && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                          Required
                        </span>
                      )}
                    </div>
                    <p className="text-primary/60 text-sm">{docType.description}</p>
                    {doc && (
                      <div className="mt-2 flex items-center gap-2 text-xs text-primary/50">
                        <span className="truncate max-w-[150px]">{doc.file_name}</span>
                        <span>•</span>
                        <span>{formatFileSize(doc.file_size)}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {doc && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleView(doc)}
                        className="border-primary/20 text-primary hover:bg-primary/5"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(docType.key)}
                        disabled={isDeleting}
                        className="border-red-200 text-red-600 hover:bg-red-50"
                      >
                        {isDeleting ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </>
                  )}
                  <input
                    type="file"
                    ref={(el) => (fileInputRefs.current[docType.key] = el)}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileSelect(docType.key, file);
                      e.target.value = "";
                    }}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    className="hidden"
                  />
                  <Button
                    variant={doc ? "outline" : "gold"}
                    size="sm"
                    onClick={() => fileInputRefs.current[docType.key]?.click()}
                    disabled={isUploading}
                    className={doc ? "border-primary/20 text-primary hover:bg-primary/5" : ""}
                  >
                    {isUploading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-1" />
                        {doc ? "Replace" : "Upload"}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Help Text */}
      <div className="bg-cream/5 rounded-xl p-4 text-center">
        <p className="text-cream/60 text-sm">
          Accepted formats: PDF, DOC, DOCX, JPG, PNG (max 10MB per file)
        </p>
      </div>

      {/* Save/Confirm Button */}
      <div className="pt-4">
        <Button
          variant="gold"
          className="w-full"
          onClick={() => {
            if (completedCount === documentTypes.length) {
              toast({
                title: "Thank you for submitting!",
                description: "The agency will verify these documents and get back to you ASAP. If you have any questions, send us a message on WhatsApp: +63 917 676 7678",
                duration: 8000,
              });
            } else {
              toast({
                title: "Documents Saved",
                description: `${completedCount} document${completedCount !== 1 ? 's' : ''} uploaded successfully. You can continue adding more anytime.`,
              });
            }
          }}
        >
          <Check className="h-4 w-4 mr-2" />
          Save & Confirm Documents
        </Button>
        {completedRequired < totalRequired && (
          <p className="text-cream/50 text-xs text-center mt-2">
            Note: {totalRequired - completedRequired} required document{totalRequired - completedRequired !== 1 ? 's' : ''} still missing
          </p>
        )}
      </div>
    </div>
  );
};

export default DocumentsTab;
