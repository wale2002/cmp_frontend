import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { FileText, TrendingUp, Users, Building } from "lucide-react";

interface StatsProps {
  totalDocuments?: number;
  recentUploads?: number;
  totalOrganizations?: number;
  totalUsers?: number;
  isAdmin?: boolean;
}

const DashboardStats = ({
  totalDocuments = 0,
  recentUploads = 0,
  totalOrganizations = 0,
  totalUsers = 0,
  isAdmin = false,
}: StatsProps) => {
  const userStats = [
    {
      title: "Total Documents",
      value: totalDocuments || 0,
      icon: FileText,
      color: "text-primary",
      bgColor: "bg-primary-light",
    },
    {
      title: "Recent Uploads",
      value: recentUploads || 0,
      icon: TrendingUp,
      color: "text-success",
      bgColor: "bg-success-light",
    },
  ];

  const adminStats = [
    ...userStats,
    {
      title: "Organizations",
      value: totalOrganizations || 0,
      icon: Building,
      color: "text-warning",
      bgColor: "bg-warning-light",
    },
    {
      title: "Total Users",
      value: totalUsers || 0,
      icon: Users,
      color: "text-secondary-foreground",
      bgColor: "bg-secondary",
    },
  ];

  const stats = isAdmin ? adminStats : userStats;

  if (!stats.length) {
    return <div>No stats available</div>;
  }

  return (
    <div
      className={`grid gap-6 ${
        isAdmin
          ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
          : "grid-cols-1 md:grid-cols-2"
      }`}
    >
      {stats.map((stat, index) => (
        <Card
          key={index}
          className="shadow-soft hover:shadow-medium transition-shadow"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value ?? "N/A"}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats;
