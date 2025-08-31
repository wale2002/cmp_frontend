import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { documentService } from "../services/document.service";
import { userService } from "../services/user.service";
import { organizationService } from "../services/organization.service";
import { useAuthContext } from "../contexts/AuthContext";
import { Skeleton } from "../components/ui/skeleton";

import type {
  User,
  Document,
  Organization,
  UserMetrics,
  OrganizationMetrics,
} from "../types/index";

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--secondary))",
  "hsl(var(--accent))",
  "hsl(var(--muted))",
];

interface AnalyticsChartsProps {
  allUsers?: User[];
  allDocuments?: Document[];
  allOrganizations?: Organization[];
  userMetrics?: UserMetrics;
  orgMetrics?: OrganizationMetrics;
}

export function AnalyticsCharts({
  allUsers = [],
  allDocuments = [],
  allOrganizations = [],
  userMetrics,
  orgMetrics,
}: AnalyticsChartsProps) {
  const { user } = useAuthContext();

  const { data: docMetrics, isLoading: docLoading } = useQuery({
    queryKey: ["documentMetrics", user?.organization],
    queryFn: () => documentService.getDocumentMetrics(user?.organization || ""),
    enabled: !!user?.organization,
  });

  if (docLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Enhanced data processing using props
  const documentTypeData =
    allDocuments.length > 0
      ? [
          {
            name: "Contract",
            value: allDocuments.filter((d) => d.documentType === "Contract")
              .length,
          },
          {
            name: "SLA",
            value: allDocuments.filter((d) => d.documentType === "SLA").length,
          },
          {
            name: "NDA",
            value: allDocuments.filter((d) => d.documentType === "NDA").length,
          },
          {
            name: "Other",
            value: allDocuments.filter((d) => d.documentType === "Other")
              .length,
          },
        ]
      : [];

  const userRoleData =
    allUsers.length > 0
      ? [
          {
            name: "Admin Users",
            value: allUsers.filter((u) => u.role === "admin").length,
          },
          {
            name: "Regular Users",
            value: allUsers.filter((u) => u.role !== "admin").length,
          },
        ]
      : userMetrics
      ? [
          { name: "Admin Users", value: userMetrics.adminUsers },
          {
            name: "Regular Users",
            value: userMetrics.totalUsers - userMetrics.adminUsers,
          },
        ]
      : [];

  const orgDocumentData = allOrganizations.map((org) => ({
    organization: org.name,
    documentCount: allDocuments.filter((doc) => doc.organization === org._id)
      .length,
  }));

  const recentUploadsData = allDocuments
    .filter(
      (d) =>
        new Date(d.uploadDate || d.createdAt) >
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    )
    .reduce((acc, doc) => {
      const date = new Date(
        doc.uploadDate || doc.createdAt
      ).toLocaleDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const uploadsTimelineData = Object.entries(recentUploadsData).map(
    ([date, count]) => ({
      date,
      uploads: count,
    })
  );

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Document Types Distribution */}
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Document Distribution</CardTitle>
          <CardDescription>Distribution of document types</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={documentTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="hsl(var(--primary))"
                dataKey="value"
              >
                {documentTypeData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {user?.role === "admin" && (
        <>
          {/* User Role Distribution */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>User Roles</CardTitle>
              <CardDescription>Distribution of user roles</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={userRoleData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Documents per Organization */}
          <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle>Documents per Organization</CardTitle>
              <CardDescription>
                Number of documents in each organization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={orgDocumentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="organization" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="documentCount" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </>
      )}

      {/* Most Popular Documents */}
      <Card className="col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle>Recent Uploads (Last 30 Days)</CardTitle>
          <CardDescription>Document upload activity over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={uploadsTimelineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="uploads" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Total Statistics Summary */}
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>System Overview</CardTitle>
          <CardDescription>Total counts across the system</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">
              Total Documents:
            </span>
            <span className="font-semibold">{allDocuments.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">
              Total Organizations:
            </span>
            <span className="font-semibold">{allOrganizations.length}</span>
          </div>
          {user?.role === "admin" && (
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">
                Total Users:
              </span>
              <span className="font-semibold">{allUsers.length}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
