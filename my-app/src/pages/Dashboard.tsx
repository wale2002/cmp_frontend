import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Added for navigation
import Layout from "../components/Layout";
import DashboardStats from "../components/DashboardStats";
import DocumentCard from "../components/DocumentCard";
import DocumentUpload from "../components/DocumentUpload";
import OrganizationFolders from "../components/OrganizationFolders";
import { AnalyticsCharts } from "../components/AnalyticsCharts";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import FolderManagement from "../components/FolderManagement";
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
import { userService } from "../services/user.service";
import { organizationService } from "../services/organization.service";
import type { Document } from "../types/index";
import { handleApiError } from "../utils/error-handler";
import { UserManagement } from "../components/UserManagement";
import { useQuery } from "@tanstack/react-query";

const Dashboard = () => {
  const {
    user,
    logout,
    isLoading: authLoading,
    isAuthenticated,
  } = useAuthContext();
  const navigate = useNavigate(); // Added for navigation
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "folders" | "management">(
    "management"
  );
  const [showUpload, setShowUpload] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast.error("Please log in to access the dashboard");
      navigate("/login", { replace: true });
    }
  }, [authLoading, isAuthenticated, navigate]);

  const {
    data: documentsData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["documents", user?.organization],
    queryFn: () => documentService.getDocumentsByOrg(user?.organization || ""),
    enabled: !!user?.organization,
    onError: (error: any) => {
      console.error("Failed to fetch documents", {
        error: error.message,
        status: error.status,
      });
      toast.error("Failed to load documents. Please try again.");
    },
  });

  const { data: userMetrics } = useQuery({
    queryKey: ["userMetrics"],
    queryFn: () => userService.getUserMetrics(),
    enabled: user?.role === "admin",
  });

  const { data: orgMetrics } = useQuery({
    queryKey: ["organizationMetrics"],
    queryFn: () => organizationService.getOrganizationMetrics(),
    enabled: user?.role === "admin",
  });
  const { data: allUsersData } = useQuery({
    queryKey: ["allUsers"],
    queryFn: () => userService.getAllUsers(),
    enabled: user?.role === "admin",
  });

  const {
    data: organizationsData,
    isLoading: organizationsLoading,
    error: organizationsError,
  } = useQuery({
    queryKey: ["organizations"],
    queryFn: () => organizationService.getOrganizations(),
    enabled: !!user,
    onError: (error: any) => {
      console.error("Failed to fetch organizations", {
        error: error.message,
        status: error.status,
      });
      toast.error("Failed to load organizations. Please try again.");
    },
  });

  // For admin users, get all documents. For regular users, get only their org's documents
  const { data: allDocumentsData } = useQuery({
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

  const documents = allDocumentsData || [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const organizations = (organizationsData as { data?: any[] })?.data || [];

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
      const response = await documentService.uploadDocument(
        organizationId,
        file,
        name,
        type
      );

      refetch();
      setUploadSuccess("Document uploaded successfully!");
      toast.success("Document uploaded successfully!");
      setShowUpload(false);
    } catch (error) {
      const errorMessage = handleApiError(error);
      setUploadError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setUploadLoading(false);
    }
  };

  const handleDocumentAction = async (action: string, doc: Document) => {
    try {
      switch (action) {
        case "view":
          window.open(doc.fileUrl, "_blank");
          toast.info(`Viewing ${doc.name}`);
          break;
        case "download":
          await documentService.downloadDocument(doc.id, doc.name);
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
      console.error("Error creating folder:", error);
      toast.error(error.response?.data?.message || "Failed to create folder");
    }
  };

  const handleDeleteFolder = async (folderId: string) => {
    try {
      await organizationService.deleteOrganization(folderId);
      toast.success("Folder deleted successfully");
      await refetchOrganizations();
    } catch (error: any) {
      console.error("Error deleting folder:", error);
      toast.error(error.response?.data?.message || "Failed to delete folder");
    }
  };

  const handleRenameFolder = async (folderId: string, newName: string) => {
    try {
      await organizationService.updateOrganization(folderId, newName);
      toast.success("Folder renamed successfully");
      await refetchOrganizations();
    } catch (error: any) {
      console.error("Error renaming folder:", error);
      toast.error(error.response?.data?.message || "Failed to rename folder");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/login", { replace: true }); // Navigate to login page
    } catch (error) {
      const errorMessage = handleApiError(error);
      toast.error(errorMessage);
    }
  };

  if (authLoading || organizationsLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user || !isAuthenticated) {
    return null; // Redirect handled by useEffect
  }

  if (organizationsError) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">
          Error loading organizations. Please try again.
        </p>
      </div>
    );
  }

  return (
    <Layout user={user} onLogout={handleLogout}>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your contracts and documents
            </p>
          </div>
          <Button
            onClick={() => setShowUpload(!showUpload)}
            variant="professional"
          >
            <Plus className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
        </div>

        {/* Stats */}
        <DashboardStats
          totalDocuments={documents.length}
          recentUploads={
            documents.filter(
              (d) =>
                new Date(d.uploadDate || d.createdAt) >
                new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            ).length
          }
          totalOrganizations={orgMetrics?.data?.totalOrganizations || 0}
          totalUsers={userMetrics?.data?.totalUsers || 0}
          isAdmin={user.role === "admin"}
        />

        <Tabs defaultValue="documents" className="space-y-6">
          <TabsList
            className={`grid w-full ${
              user?.role === "admin" ? "grid-cols-4" : "grid-cols-3"
            }`}
          >
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            {user?.role === "admin" && (
              <TabsTrigger value="users">Users</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="documents" className="space-y-6">
            {/* Search, Filter and View Toggle */}
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
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
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

            {/* Documents Display */}
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading documents...</p>
              </div>
            ) : viewMode === "management" ? (
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

            {!isLoading && filteredDocuments.length === 0 && (
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

          <TabsContent value="analytics">
            <AnalyticsCharts
              allUsers={allUsersData?.data || []}
              allDocuments={documents}
              allOrganizations={organizations}
              userMetrics={userMetrics?.data}
              orgMetrics={orgMetrics?.data}
            />
          </TabsContent>

          {user?.role === "admin" && (
            <TabsContent value="users">
              <UserManagement />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </Layout>
  );
};

export default Dashboard;
function refetchOrganizations() {
  throw new Error("Function not implemented.");
}
