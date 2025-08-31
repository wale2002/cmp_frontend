import Layout from "../components/Layout";
import { AnalyticsCharts } from "../components/AnalyticsCharts";
import DashboardStats from "../components/DashboardStats";
import { useAuthContext } from "../contexts/AuthContext";
import { userService } from "../services/user.service";
import { organizationService } from "../services/organization.service";
import { documentService } from "../services/document.service";
import { toast } from "sonner";
import { handleApiError } from "../utils/error-handler";
import { useQuery } from "@tanstack/react-query";

const AnalyticsPage = () => {
  const { user, logout } = useAuthContext();

  const { data: allDocumentsData } = useQuery({
    queryKey: ["allDocuments"],
    queryFn: async () => {
      if (user?.role === "admin") {
        const orgs = await organizationService.getOrganizations();
        const allDocs = await Promise.all(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  const { data: organizationsData } = useQuery({
    queryKey: ["organizations"],
    queryFn: () => organizationService.getOrganizations(),
  });

  const { data: allUsersData } = useQuery({
    queryKey: ["allUsers"],
    queryFn: () => userService.getAllUsers(),
    enabled: user?.role === "admin",
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

  const documents = allDocumentsData || [];
  const organizations = organizationsData?.data || [];

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
            <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
            <p className="text-muted-foreground">
              View comprehensive analytics and metrics
            </p>
          </div>
        </div>

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

        <AnalyticsCharts
          allUsers={allUsersData?.data || []}
          allDocuments={documents}
          allOrganizations={organizations}
          userMetrics={userMetrics?.data}
          orgMetrics={orgMetrics?.data}
        />
      </div>
    </Layout>
  );
};

export default AnalyticsPage;
