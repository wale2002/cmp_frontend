import { apiClient } from "../lib/api-client";
import { API_ENDPOINTS } from "../config.ts/api";
import type {
  Organization,
  ApiResponse,
  OrganizationMetrics,
} from "../types/index";

export class OrganizationService {
  async getOrganizations(): Promise<ApiResponse<Organization[]>> {
    try {
      const response = await apiClient.get<ApiResponse<Organization[]>>(
        API_ENDPOINTS.ORGANIZATIONS.GET_ALL
      );
      return response;
    } catch (error) {
      console.error("Error fetching organizations:", error);
      throw error;
    }
  }

  async createOrganization(name: string): Promise<ApiResponse<Organization>> {
    try {
      const response = await apiClient.post<ApiResponse<Organization>>(
        API_ENDPOINTS.ORGANIZATIONS.CREATE,
        { name }
      );
      return response;
    } catch (error) {
      console.error("Error creating organization:", error);
      throw error;
    }
  }

  async updateOrganization(
    id: string,
    name: string
  ): Promise<ApiResponse<Organization>> {
    try {
      const response = await apiClient.put<ApiResponse<Organization>>(
        API_ENDPOINTS.ORGANIZATIONS.UPDATE(id),
        { name }
      );
      return response;
    } catch (error) {
      console.error("Error updating organization:", error);
      throw error;
    }
  }

  async deleteOrganization(id: string): Promise<ApiResponse> {
    try {
      const response = await apiClient.delete<ApiResponse>(
        API_ENDPOINTS.ORGANIZATIONS.DELETE(id)
      );
      return response;
    } catch (error) {
      console.error("Error deleting organization:", error);
      throw error;
    }
  }

  async getOrganizationMetrics(): Promise<ApiResponse<OrganizationMetrics>> {
    try {
      const response = await apiClient.get<ApiResponse<OrganizationMetrics>>(
        API_ENDPOINTS.ORGANIZATIONS.GET_METRICS
      );
      return response;
    } catch (error) {
      console.error("Error fetching organization metrics:", error);
      throw error;
    }
  }
}

export const organizationService = new OrganizationService();
