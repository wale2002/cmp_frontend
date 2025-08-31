// import { apiClient } from "../lib/api-client";
// import { API_ENDPOINTS } from "../config.ts/api";
// import type { AuthResponse, ApiResponse } from "../types/index";

// export class AuthService {
//   async login(username: string, password: string): Promise<AuthResponse> {
//     const response = await apiClient.post<AuthResponse>(
//       API_ENDPOINTS.AUTH.LOGIN,
//       { username, password }
//     );

//     if (response.data.token) {
//       localStorage.setItem("token", response.data.token);
//       localStorage.setItem("user", JSON.stringify(response.data.user));
//     }

//     return response;
//   }

//   async logout(): Promise<void> {
//     try {
//       await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
//     } finally {
//       localStorage.removeItem("token");
//       localStorage.removeItem("user");
//     }
//   }

//   async requestPasswordReset(email: string): Promise<ApiResponse> {
//     return apiClient.post<ApiResponse>(API_ENDPOINTS.AUTH.REQUEST_RESET, {
//       email,
//     });
//   }

//   async resetPassword(
//     resetToken: string,
//     newPassword: string
//   ): Promise<ApiResponse> {
//     return apiClient.post<ApiResponse>(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
//       resetToken,
//       newPassword,
//     });
//   }

//   getCurrentUser() {
//     const userStr = localStorage.getItem("user");
//     return userStr ? JSON.parse(userStr) : null;
//   }

//   getToken() {
//     return localStorage.getItem("token");
//   }

//   isAuthenticated(): boolean {
//     return !!this.getToken();
//   }
// }

// export const authService = new AuthService();

// import { apiClient } from "../lib/api-client";
// import { API_ENDPOINTS } from "../config.ts/api";
// import type { AuthResponse, ApiResponse } from "../types";

// export class AuthService {
//   async login(username: string, password: string): Promise<AuthResponse> {
//     const response = await apiClient.post<AuthResponse>(
//       API_ENDPOINTS.AUTH.LOGIN,
//       {
//         username,
//         password,
//       }
//     );

//     if (response.data.data?.token && response.data.data?.user) {
//       localStorage.setItem("token", response.data.data.token);
//       localStorage.setItem("user", JSON.stringify(response.data.data.user));
//     } else {
//       throw new Error("Invalid response from server");
//     }

//     return response.data;
//   }

//   logout(): void {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     // Optional: Make API call to logout, but don't await it
//     apiClient.post(API_ENDPOINTS.AUTH.LOGOUT).catch((error) => {
//       console.error("authService: Logout API error", error);
//     });
//   }

//   async requestPasswordReset(email: string): Promise<ApiResponse> {
//     return apiClient.post<ApiResponse>(API_ENDPOINTS.AUTH.REQUEST_RESET, {
//       email,
//     });
//   }

//   async resetPassword(
//     resetToken: string,
//     newPassword: string
//   ): Promise<ApiResponse> {
//     return apiClient.post<ApiResponse>(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
//       resetToken,
//       newPassword,
//     });
//   }

//   async getCurrentUser() {
//     const token = localStorage.getItem("token");
//     if (!token) throw new Error("No token found");

//     try {
//       const response = await apiClient.get(API_ENDPOINTS.AUTH.ME, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const user = response.data.data.user;
//       localStorage.setItem("user", JSON.stringify(user)); // Update user data
//       return user;
//     } catch (error) {
//       localStorage.removeItem("token");
//       localStorage.removeItem("user");
//       throw error;
//     }
//   }

//   getToken(): string | null {
//     return localStorage.getItem("token");
//   }

//   isAuthenticated(): boolean {
//     return !!this.getToken();
//   }

//   clearAuth(): void {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//   }
// }

// export const authService = new AuthService();

import { apiClient } from "../lib/api-client";
import { API_ENDPOINTS } from "../config.ts/api";
import type { AuthResponse, ApiResponse, User } from "../types";

export class AuthService {
  async login(username: string, password: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      {
        username,
        password,
      }
    );
    console.log("authService.login response:", response.data);

    if (response.data?.token && response.data?.user) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    } else {
      throw new Error("Invalid response from server");
    }

    return response;
  }

  logout(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // Optional: Non-blocking logout API call
    apiClient.post(API_ENDPOINTS.AUTH.LOGOUT).catch((error) => {
      console.error("authService: Logout API error", error);
    });
  }

  async requestPasswordReset(email: string): Promise<ApiResponse> {
    return await apiClient.post<ApiResponse>(API_ENDPOINTS.AUTH.REQUEST_RESET, {
      email,
    });
  }

  async resetPassword(
    resetToken: string,
    newPassword: string
  ): Promise<ApiResponse> {
    return await apiClient.post<ApiResponse>(
      API_ENDPOINTS.AUTH.RESET_PASSWORD,
      {
        resetToken,
        newPassword,
      }
    );
  }

  async getCurrentUser(): Promise<User> {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");

    try {
      const response = await apiClient.get<AuthResponse>(
        API_ENDPOINTS.AUTH.ME,
        {
          Authorization: `Bearer ${token}`,
        }
      );
      console.log("authService.getCurrentUser response:", response.data);
      const user = response.data.user;
      localStorage.setItem("user", JSON.stringify(user)); // Update user data
      return user;
    } catch (error) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      throw error;
    }
  }

  getToken(): string | null {
    return localStorage.getItem("token");
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  clearAuth(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
}

export const authService = new AuthService();
