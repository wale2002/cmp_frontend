import { apiClient, ApiError } from "../lib/api-client";
import { API_ENDPOINTS } from "../config.ts/api";
import type {
  CreateUserRequest,
  CreateUserResponse,
  User,
  ApiResponse,
  UserMetrics,
} from "../types/index";

export class UserService {
  async createUser(userData: CreateUserRequest): Promise<CreateUserResponse> {
    return apiClient.post<CreateUserResponse>(
      API_ENDPOINTS.USERS.CREATE,
      userData
    );
  }

  async getAllUsers(): Promise<ApiResponse<User[]>> {
    return apiClient.get<ApiResponse<User[]>>(API_ENDPOINTS.USERS.GET_ALL);
  }

  async getUserById(id: string): Promise<{ data: User }> {
    if (!id || typeof id !== "string") {
      throw new ApiError("Invalid user ID", 1);
    }
    try {
      const response = await apiClient.get<ApiResponse<User>>(
        API_ENDPOINTS.USERS.GET_BY_ID(id)
      );
      return {
        data: {
          ...response.data,
          id: response.data.id,
        },
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      throw new ApiError(
        error.response?.data?.message || `Failed to fetch user ${id}`,
        error.response?.status
      );
    }
  }

  async updateUser(
    id: string,
    userData: Partial<CreateUserRequest>
  ): Promise<ApiResponse<User>> {
    return apiClient.put<ApiResponse<User>>(
      API_ENDPOINTS.USERS.UPDATE(id),
      userData
    );
  }

  async deleteUser(id: string): Promise<ApiResponse> {
    return apiClient.delete<ApiResponse>(API_ENDPOINTS.USERS.DELETE(id));
  }
  async getUserMetrics(): Promise<ApiResponse<UserMetrics>> {
    return apiClient.get<ApiResponse<UserMetrics>>(
      API_ENDPOINTS.USERS.GET_METRICS
    );
  }
}

export const userService = new UserService();
