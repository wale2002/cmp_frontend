import { useState } from "react";
import Layout from "../components/Layout";
import FolderManagement from "../components/FolderManagement";
import { useAuthContext } from "../contexts/AuthContext";
import { organizationService } from "../services/organization.service";
import { documentService } from "../services/document.service";
import { toast } from "sonner";
import { handleApiError } from "../utils/error-handler";
import { useQuery } from "@tanstack/react-query";

const OrganizationsPage = () => {
  const { user, logout } = useAuthContext();

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
      }
      return [];
    },
    enabled: user?.role === "admin",
  });

  const { data: organizationsData, refetch: refetchOrganizations } = useQuery({
    queryKey: ["organizations"],
    queryFn: () => organizationService.getOrganizations(),
    enabled: user?.role === "admin",
  });

  const documents = allDocumentsData || [];
  const organizations = organizationsData?.data || [];

  const handleDocumentAction = async (action: string, doc: any) => {
    try {
      switch (action) {
        case "view":
          toast.info(`Viewing ${doc.name}`);
          break;
        case "download":
          await documentService.downloadDocument(doc._id);
          toast.success(`Downloading ${doc.name}`);
          break;
        case "edit":
          toast.info(`Editing ${doc.name}`);
          break;
        case "delete":
          await documentService.deleteDocument(doc._id);
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
      toast.success(`Organization "${folderName}" created successfully`);
      await refetchOrganizations();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to create organization"
      );
    }
  };

  const handleDeleteFolder = async (folderId: string) => {
    try {
      await organizationService.deleteOrganization(folderId);
      toast.success("Organization deleted successfully");
      await refetchOrganizations();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to delete organization"
      );
    }
  };

  const handleRenameFolder = async (folderId: string, newName: string) => {
    try {
      await organizationService.updateOrganization(folderId, newName);
      toast.success("Organization renamed successfully");
      await refetchOrganizations();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to rename organization"
      );
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

  if (!user || user.role !== "admin") {
    return (
      <Layout user={user} onLogout={handleLogout}>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">
            Access denied. Admin privileges required.
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout user={user} onLogout={handleLogout}>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Organizations
            </h1>
            <p className="text-muted-foreground">
              Manage all organizations in the system
            </p>
          </div>
        </div>

        <FolderManagement
          documents={documents}
          organizations={organizations}
          currentUser={user}
          onDocumentAction={handleDocumentAction}
          onCreateFolder={handleCreateFolder}
          onDeleteFolder={handleDeleteFolder}
          onRenameFolder={handleRenameFolder}
        />
      </div>
    </Layout>
  );
};

export default OrganizationsPage;
