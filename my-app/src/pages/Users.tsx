import Layout from "../components/Layout";
import { UserManagement } from "../components/UserManagement";
import { useAuthContext } from "../contexts/AuthContext";
import { toast } from "sonner";
import { handleApiError } from "../utils/error-handler";

const UsersPage = () => {
  const { user, logout } = useAuthContext();

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
              User Management
            </h1>
            <p className="text-muted-foreground">
              Manage all users in the system
            </p>
          </div>
        </div>

        <UserManagement />
      </div>
    </Layout>
  );
};

export default UsersPage;
