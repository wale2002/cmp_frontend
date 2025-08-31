import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Upload, File, AlertCircle, CheckCircle, Building } from "lucide-react";
import type { Organization } from "../types/index";

interface DocumentUploadProps {
  onUpload: (
    file: File,
    name: string,
    type: string,
    organizationId: string
  ) => Promise<void>;
  organizations: Organization[];
  currentUserOrg?: string;
  loading?: boolean;
  error?: string;
  success?: string;
}

const DocumentUpload = ({
  onUpload,
  organizations,
  currentUserOrg,
  loading,
  error,
  success,
}: DocumentUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [selectedOrganization, setSelectedOrganization] = useState(
    currentUserOrg || ""
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (!name) {
        setName(selectedFile.name.replace(/\.[^/.]+$/, ""));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (file && name && documentType && selectedOrganization) {
      await onUpload(file, name, documentType, selectedOrganization);
      // Reset form on success
      if (success) {
        setFile(null);
        setName("");
        setDocumentType("");
        setSelectedOrganization(currentUserOrg || "");
        // Reset file input
        const fileInput = document.getElementById("file") as HTMLInputElement;
        if (fileInput) fileInput.value = "";
      }
    }
  };

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Document to Organization
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="border-success bg-success-light">
            <CheckCircle className="h-4 w-4 text-success" />
            <AlertDescription className="text-success">
              {success}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="organization">Select Organization</Label>
            <Select
              value={selectedOrganization}
              onValueChange={setSelectedOrganization}
              required
            >
              <SelectTrigger>
                <Building className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Choose organization folder" />
              </SelectTrigger>
              <SelectContent>
                {organizations.map((org) => (
                  <SelectItem key={org._id} value={org._id}>
                    {org.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="file">Choose File (PDF)</Label>
            <div className="relative">
              <Input
                id="file"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="cursor-pointer"
                required
              />
              {file && (
                <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                  <File className="h-4 w-4" />
                  <span>{file.name}</span>
                  <span className="text-xs">
                    ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Document Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter document name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Document Type</Label>
            <Select
              value={documentType}
              onValueChange={setDocumentType}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Contract">Contract</SelectItem>
                <SelectItem value="SLA">
                  SLA (Service Level Agreement)
                </SelectItem>
                <SelectItem value="NDA">
                  NDA (Non-Disclosure Agreement)
                </SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={
              loading ||
              !file ||
              !name ||
              !documentType ||
              !selectedOrganization
            }
          >
            {loading ? "Uploading..." : "Upload Document to organization"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default DocumentUpload;
