import { useState } from "react";
import Layout from "../components/Layout";
import DocumentCard from "../components/DocumentCard";
import DocumentUpload from "../components/DocumentUpload";
import OrganizationFolders from "../components/OrganizationFolders";
import FolderManagement from "../components/FolderManagement";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { toast } from "sonner";
import {
  Search,
  Filter,
  Plus,
  FolderOpen,
  Grid3X3,
  Building,
} from "lucide-react";
import { useAuthContext } from "../contexts/AuthContext";
import { documentService } from "../services/document.service";
import { organizationService } from "../services/organization.service";
import type { Document } from "../types/index";
import { handleApiError } from "../utils/error-handler";
import { useQuery } from "@tanstack/react-query";

const DocumentsPage = () => {
  const { user, logout } = useAuthContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "folders" | "management">(
    "grid"
  );
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");

  const { data: allDocumentsData, refetch } = useQuery({
    queryKey: ["allDocuments"],
    queryFn: async () => {
      if (user?.role === "admin") {
        const orgs = await organizationService.getOrganizations();
        const allDocs = await Promise.all(
          orgs.data.map(async (org: any) => {
            try {
              const docs = await documentService.getDocumentsByOrg(org._id);
              return docs.data || [];
            } catch {
              return [];
            }
          })
        );
        return allDocs.flat();
      } else {
        const docs = await documentService.getDocumentsByOrg(
          user?.organization || ""
        );
        return docs.data || [];
      }
    },
    enabled: !!user,
  });

  const { data: organizationsData, refetch: refetchOrganizations } = useQuery({
    queryKey: ["organizations"],
    queryFn: () => organizationService.getOrganizations(),
  });

  const documents = allDocumentsData || [];
  const organizations = organizationsData?.data || [];

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || doc.documentType === filterType;
    return matchesSearch && matchesType;
  });

  const handleUpload = async (
    file: File,
    name: string,
    type: string,
    organizationId: string
  ) => {
    setUploadLoading(true);
    setUploadError("");
    setUploadSuccess("");

    try {
      await documentService.uploadDocument(organizationId, file, name, type);
      refetch();
      setUploadSuccess("Document uploaded successfully!");
      toast.success("Document uploaded successfully!");
    } catch (error) {
      const errorMessage = "Failed to upload document. Please try again.";
      setUploadError(errorMessage);
      handleApiError(error);
    } finally {
      setUploadLoading(false);
    }
  };

  const handleDocumentAction = async (action: string, doc: Document) => {
    try {
      switch (action) {
        case "view":
          toast.info(`Viewing ${doc.name}`);
          break;
        case "download":
          await documentService.downloadDocument(doc.id);
          toast.success(`Downloading ${doc.name}`);
          break;
        case "edit":
          toast.info(`Editing ${doc.name}`);
          break;
        case "delete":
          await documentService.deleteDocument(doc.id);
          refetch();
          toast.success(`${doc.name} deleted`);
          break;
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleCreateFolder = async (folderName: string) => {
    try {
      await organizationService.createOrganization(folderName);
      toast.success(`Folder "${folderName}" created successfully`);
      await refetchOrganizations();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create folder");
    }
  };

  const handleDeleteFolder = async (folderId: string) => {
    try {
      await organizationService.deleteOrganization(folderId);
      toast.success("Folder deleted successfully");
      await refetchOrganizations();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete folder");
    }
  };

  const handleRenameFolder = async (folderId: string, newName: string) => {
    try {
      await organizationService.updateOrganization(folderId, newName);
      toast.success("Folder renamed successfully");
      await refetchOrganizations();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to rename folder");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
    } catch (error) {
      handleApiError(error);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <Layout user={user} onLogout={handleLogout}>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Documents</h1>
            <p className="text-muted-foreground">
              Manage your contracts and documents
            </p>
          </div>
        </div>

        <Tabs defaultValue="documents" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="upload">Upload</TabsTrigger>
          </TabsList>

          <TabsContent value="documents" className="space-y-6">
            <div className="flex gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Contract">Contracts</SelectItem>
                  <SelectItem value="SLA">SLAs</SelectItem>
                  <SelectItem value="NDA">NDAs</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-1 border rounded-lg p-1">
                <Button
                  variant={viewMode === "management" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("management")}
                  className="px-3"
                  title="Folder Management"
                >
                  <Building className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "folders" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("folders")}
                  className="px-3"
                  title="Folder View"
                >
                  <FolderOpen className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="px-3"
                  title="Grid View"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {viewMode === "management" ? (
              <FolderManagement
                documents={filteredDocuments}
                organizations={organizations}
                currentUser={user}
                onDocumentAction={handleDocumentAction}
                onCreateFolder={handleCreateFolder}
                onDeleteFolder={handleDeleteFolder}
                onRenameFolder={handleRenameFolder}
              />
            ) : viewMode === "folders" ? (
              <OrganizationFolders
                documents={filteredDocuments}
                organizations={organizations}
                currentUser={user}
                onDocumentAction={handleDocumentAction}
              />
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredDocuments.map((doc) => (
                  <DocumentCard
                    key={doc.id}
                    document={doc}
                    canEdit={
                      user.role === "admin" || doc.uploadedBy === user.id
                    }
                    onView={() => handleDocumentAction("view", doc)}
                    onDownload={() => handleDocumentAction("download", doc)}
                    onEdit={() => handleDocumentAction("edit", doc)}
                    onDelete={() => handleDocumentAction("delete", doc)}
                  />
                ))}
              </div>
            )}

            {filteredDocuments.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No documents found matching your criteria.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="upload">
            <DocumentUpload
              onUpload={handleUpload}
              organizations={organizations}
              currentUserOrg={user.organization}
              loading={uploadLoading}
              error={uploadError}
              success={uploadSuccess}
            />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default DocumentsPage;
