/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Badge } from "../components/ui/badge";
import { Alert, AlertDescription } from "../components/ui/alert";
import {
  Folder,
  FolderOpen,
  FolderPlus,
  FileText,
  ChevronRight,
  ChevronDown,
  Building,
  // Plus,
  Trash2,
  Edit3,
} from "lucide-react";
import type { Document, Organization } from "../types";
import DocumentCard from "./DocumentCard";
import { Label } from "../components/ui/label";
import { toast } from "sonner";

interface FolderManagementProps {
  documents: Document[];
  organizations: Organization[];
  currentUser: any;
  onDocumentAction: (action: string, doc: Document) => void;
  onCreateFolder?: (folderName: string) => Promise<void>;
  onDeleteFolder?: (folderId: string) => Promise<void>;
  onRenameFolder?: (folderId: string, newName: string) => Promise<void>;
}

const FolderManagement = ({
  documents,
  organizations,
  currentUser,
  onDocumentAction,
  onCreateFolder,
  onDeleteFolder,
  onRenameFolder,
}: FolderManagementProps) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(["company-documents"])
  );
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [editingFolder, setEditingFolder] = useState<string | null>(null);
  const [editFolderName, setEditFolderName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  // Group documents by organization
  const documentsByOrg = documents.reduce((acc, doc) => {
    if (!acc[doc.organization]) {
      acc[doc.organization] = [];
    }
    acc[doc.organization].push(doc);
    return acc;
  }, {} as Record<string, Document[]>);

  // Filter organizations based on user role
  const visibleOrganizations =
    currentUser?.role === "admin"
      ? organizations
      : organizations.filter((org) => org._id === currentUser?.organization);

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;

    setIsCreating(true);
    try {
      if (onCreateFolder) {
        await onCreateFolder(newFolderName);
        toast.success(`Folder "${newFolderName}" created successfully`);
        setNewFolderName("");
        setShowCreateDialog(false);
      }
    } catch (error) {
      toast.error("Failed to create folder");
    } finally {
      setIsCreating(false);
    }
  };

  const handleRenameFolder = async (orgId: string) => {
    if (!editFolderName.trim()) return;

    try {
      if (onRenameFolder) {
        await onRenameFolder(orgId, editFolderName);
        toast.success("Folder renamed successfully");
        setEditingFolder(null);
        setEditFolderName("");
      }
    } catch (error) {
      toast.error("Failed to rename folder");
    }
  };

  const handleDeleteFolder = async (orgId: string) => {
    const hasDocuments = documentsByOrg[orgId]?.length > 0;
    if (hasDocuments) {
      toast.error("Cannot delete folder containing documents");
      return;
    }

    if (window.confirm("Are you sure you want to delete this folder?")) {
      try {
        if (onDeleteFolder) {
          await onDeleteFolder(orgId);
          toast.success("Folder deleted successfully");
        }
      } catch (error) {
        toast.error("Failed to delete folder");
      }
    }
  };

  const FolderIcon = ({
    isExpanded,
    hasDocuments,
  }: {
    isExpanded: boolean;
    hasDocuments: boolean;
  }) =>
    isExpanded ? (
      <FolderOpen className="h-5 w-5 text-blue-500" />
    ) : (
      <Folder
        className={`h-5 w-5 ${
          hasDocuments ? "text-blue-600" : "text-gray-400"
        }`}
      />
    );

  return (
    <div className="space-y-4">
      {/* Company Documents Parent Folder */}
      <Card className="border-2 border-primary/20 shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div
              className="flex items-center gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded-md transition-colors"
              onClick={() => toggleFolder("company-documents")}
            >
              <div className="flex items-center gap-2">
                {expandedFolders.has("company-documents") ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
                <Building className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-primary">
                  Company Documents
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Organization folders and documents
                </p>
              </div>
            </div>

            {(currentUser?.role === "admin" ||
              currentUser?.role === "user") && (
              <Dialog
                open={showCreateDialog}
                onOpenChange={setShowCreateDialog}
              >
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <FolderPlus className="h-4 w-4" />
                    New Folder
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Organization Folder</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="folderName">Folder Name</Label>
                      <Input
                        id="folderName"
                        placeholder="Enter organization name"
                        value={newFolderName}
                        onChange={(e) => setNewFolderName(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === "Enter" && handleCreateFolder()
                        }
                      />
                    </div>
                    <Alert>
                      <Building className="h-4 w-4" />
                      <AlertDescription>
                        This will create a new organization folder under Company
                        Documents
                      </AlertDescription>
                    </Alert>
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        onClick={() => setShowCreateDialog(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleCreateFolder}
                        disabled={!newFolderName.trim() || isCreating}
                      >
                        {isCreating ? "Creating..." : "Create Folder"}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardHeader>

        {expandedFolders.has("company-documents") && (
          <CardContent className="pt-0">
            <div className="pl-6 space-y-3">
              {visibleOrganizations.length === 0 ? (
                <div className="text-center py-8">
                  <Folder className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">
                    No organization folders yet
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Create a folder to organize your documents
                  </p>
                </div>
              ) : (
                visibleOrganizations.map((org) => {
                  const orgDocuments = documentsByOrg[org._id] || [];
                  const isExpanded = expandedFolders.has(org._id);
                  const isEditing = editingFolder === org._id;

                  return (
                    <Card key={org._id} className="border border-border/50">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div
                            className="flex items-center gap-3 cursor-pointer hover:bg-muted/30 p-2 rounded-md transition-colors flex-1"
                            onClick={() => !isEditing && toggleFolder(org._id)}
                          >
                            <div className="flex items-center gap-2">
                              {isExpanded ? (
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                              )}
                              <FolderIcon
                                isExpanded={isExpanded}
                                hasDocuments={orgDocuments.length > 0}
                              />
                            </div>

                            {isEditing ? (
                              <div className="flex items-center gap-2 flex-1">
                                <Input
                                  value={editFolderName}
                                  onChange={(e) =>
                                    setEditFolderName(e.target.value)
                                  }
                                  onKeyPress={(e) => {
                                    if (e.key === "Enter")
                                      handleRenameFolder(org._id);
                                    if (e.key === "Escape") {
                                      setEditingFolder(null);
                                      setEditFolderName("");
                                    }
                                  }}
                                  onBlur={() => handleRenameFolder(org._id)}
                                  autoFocus
                                  className="h-8"
                                />
                              </div>
                            ) : (
                              <div className="flex items-center gap-3 flex-1">
                                <span className="font-medium">{org.name}</span>
                                <Badge variant="secondary" className="text-xs">
                                  {orgDocuments.length} document
                                  {orgDocuments.length !== 1 ? "s" : ""}
                                </Badge>
                              </div>
                            )}
                          </div>

                          {currentUser?.role === "admin" && !isEditing && (
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingFolder(org._id);
                                  setEditFolderName(org.name);
                                }}
                                className="h-8 w-8 p-0"
                              >
                                <Edit3 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteFolder(org._id);
                                }}
                                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                disabled={orgDocuments.length > 0}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>

                        {isExpanded && (
                          <div className="pl-6 space-y-3">
                            {orgDocuments.length === 0 ? (
                              <div className="text-center py-6 border-2 border-dashed border-muted-foreground/20 rounded-lg">
                                <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                                <p className="text-sm text-muted-foreground">
                                  No documents in this folder
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Upload documents to get started
                                </p>
                              </div>
                            ) : (
                              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                                {orgDocuments.map((doc) => (
                                  <DocumentCard
                                    key={doc.id}
                                    document={doc}
                                    canEdit={
                                      currentUser?.role === "admin" ||
                                      doc.uploadedBy === currentUser?.id
                                    }
                                    onView={() => onDocumentAction("view", doc)}
                                    onDownload={() =>
                                      onDocumentAction("download", doc)
                                    }
                                    onEdit={() => onDocumentAction("edit", doc)}
                                    onDelete={() =>
                                      onDocumentAction("delete", doc)
                                    }
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Summary Statistics */}
      <Card className="bg-muted/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Folder className="h-4 w-4 text-muted-foreground" />
                <span>
                  {visibleOrganizations.length} folder
                  {visibleOrganizations.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span>
                  {documents.length} document{documents.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
            <Badge variant="outline" className="text-xs">
              Company Documents
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FolderManagement;
