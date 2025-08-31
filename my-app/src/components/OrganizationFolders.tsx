import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Folder,
  FolderOpen,
  FileText,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import type { Document, Organization } from "../types/index";
import DocumentCard from "./DocumentCard";

interface OrganizationFoldersProps {
  documents: Document[];
  organizations: Organization[];
  currentUser: any;
  onDocumentAction: (action: string, doc: Document) => void;
}

const OrganizationFolders = ({
  documents,
  organizations,
  currentUser,
  onDocumentAction,
}: OrganizationFoldersProps) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set()
  );

  const toggleFolder = (orgId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(orgId)) {
      newExpanded.delete(orgId);
    } else {
      newExpanded.add(orgId);
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

  // Filter organizations to show only those with documents or user's organization
  const relevantOrganizations = organizations.filter(
    (org) => documentsByOrg[org._id] || org._id === currentUser?.organization
  );

  if (currentUser?.role !== "admin") {
    // Non-admin users only see their organization's documents
    const userOrgDocs = documentsByOrg[currentUser?.organization] || [];
    const userOrg = organizations.find(
      (org) => org._id === currentUser?.organization
    );

    return (
      <div className="space-y-4">
        <Card className="border-primary/20">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Folder className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">
                  {userOrg?.name || "Your Organization"}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {userOrgDocs.length} document
                  {userOrgDocs.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {userOrgDocs.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {userOrgDocs.map((doc) => (
                  <DocumentCard
                    key={doc.id}
                    document={doc}
                    canEdit={
                      currentUser.role === "admin" ||
                      doc.uploadedBy === currentUser.id
                    }
                    onView={() => onDocumentAction("view", doc)}
                    onDownload={() => onDocumentAction("download", doc)}
                    onEdit={() => onDocumentAction("edit", doc)}
                    onDelete={() => onDocumentAction("delete", doc)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  No documents uploaded yet
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Admin view - shows all organizations
  return (
    <div className="space-y-4">
      {relevantOrganizations.map((org) => {
        const orgDocs = documentsByOrg[org._id] || [];
        const isExpanded = expandedFolders.has(org._id);

        return (
          <Card key={org._id} className="border-muted/40">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleFolder(org._id)}
                    className="p-1 h-auto"
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                  <div className="p-2 rounded-lg bg-secondary/50">
                    {isExpanded ? (
                      <FolderOpen className="h-5 w-5 text-secondary-foreground" />
                    ) : (
                      <Folder className="h-5 w-5 text-secondary-foreground" />
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{org.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {orgDocs.length} document{orgDocs.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                <Badge variant={orgDocs.length > 0 ? "default" : "secondary"}>
                  {orgDocs.length} files
                </Badge>
              </div>
            </CardHeader>

            {isExpanded && (
              <CardContent>
                {orgDocs.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {orgDocs.map((doc) => (
                      <DocumentCard
                        key={doc.id}
                        document={doc}
                        canEdit={
                          currentUser.role === "admin" ||
                          doc.uploadedBy === currentUser.id
                        }
                        onView={() => onDocumentAction("view", doc)}
                        onDownload={() => onDocumentAction("download", doc)}
                        onEdit={() => onDocumentAction("edit", doc)}
                        onDelete={() => onDocumentAction("delete", doc)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      No documents in this organization
                    </p>
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        );
      })}

      {relevantOrganizations.length === 0 && (
        <div className="text-center py-12">
          <Folder className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg font-medium text-muted-foreground">
            No organizations found
          </p>
          <p className="text-sm text-muted-foreground">
            Organizations will appear here once they have documents
          </p>
        </div>
      )}
    </div>
  );
};

export default OrganizationFolders;
