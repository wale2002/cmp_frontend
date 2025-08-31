export interface User {
  id: string;
  firstName: string;
  username: string;
  email: string;
  role: "admin" | "user";
  organization: string;
  createdAt: string;
}

export interface Organization {
  _id: string;
  name: string;
  createdAt: string;
}

export interface Document {
  // now(): unknown;
  id: string;
  name: string;
  fileUrl: string;
  googleDriveFileId?: string;
  organization: string;
  documentType: "SLA" | "NDA" | "Contract" | "Other";
  uploadedBy: string;
  accessCount: number;
  uploadDate: string;
  createdAt: string;
}

export interface AuthResponse {
  message: string;
  data: {
    token: string;
    user: User;
  };
}

export interface ApiResponse<T = unknown> {
  message: string;
  data: T;
}

export interface DocumentMetrics {
  mostPopular: Document[];
  newReports: Document[];
  accessedReports: Document[];
  othersReports: Document[];
}

export interface UserMetrics {
  totalUsers: number;
  activeUsers: number;
  adminUsers: number;
  recentlyJoined: number;
}

export interface OrganizationMetrics {
  totalOrganizations: number;
  activeOrganizations: number;
  documentsPerOrg: Array<{
    organization: string;
    documentCount: number;
  }>;
}
export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  role?: "admin" | "user";
  organization: string;
}

export interface CreateUserResponse {
  message: string;
  data: User;
}
