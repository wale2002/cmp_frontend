// API Configuration
export const API_CONFIG = {
  BASE_URL: "https://cpm-contracts.onrender.com/api",
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
};

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    RESET_PASSWORD: "/auth/reset-password",
    REQUEST_RESET: "/auth/request-reset",
    ME: "/auth/me",
  },

  // Document endpoints
  DOCUMENTS: {
    GET_BY_ORG: (orgId: string) => `/documents/${orgId}`,
    UPLOAD: (orgId: string) => `/documents/${orgId}/upload`,
    DOWNLOAD: (id: string) => `/documents/download/${id}`,
    DELETE: (id: string) => `/documents/${id}`,
    UPDATE: (id: string) => `/documents/${id}`,
    GET_BY_USER: (userId: string) => `/documents/user/${userId}`,
    GET_METRICS: (orgId: string) => `/documents/metrics/${orgId}`,
  },

  // Organization endpoints
  ORGANIZATIONS: {
    GET_ALL: "/organizations",
    CREATE: "/organizations",
    UPDATE: (id: string) => `/organizations/${id}`,
    DELETE: (id: string) => `/organizations/${id}`,
    GET_METRICS: "/organizations/metrics",
  },

  // User endpoints
  USERS: {
    CREATE: "/users",
    GET_ALL: "/users",
    GET_BY_ID: (id: string) => `/users/${id}`,
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
    GET_METRICS: "/users/metrics",
  },
};
