import { apiClient } from "../lib/api-client";
import { API_ENDPOINTS } from "../config.ts/api";
import type { Document, ApiResponse, DocumentMetrics } from "../types/index";

export class DocumentService {
  async getDocumentsByOrg(orgId: string): Promise<ApiResponse<Document[]>> {
    return apiClient.get<ApiResponse<Document[]>>(
      API_ENDPOINTS.DOCUMENTS.GET_BY_ORG(orgId)
    );
  }

  async uploadDocument(
    orgId: string,
    file: File,
    name: string,
    documentType: string
  ): Promise<ApiResponse<Document>> {
    console.log("documentService.uploadDocument orgId:", orgId);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", name);
    formData.append("documentType", documentType);
    const response = await apiClient.post<ApiResponse<Document>>(
      API_ENDPOINTS.DOCUMENTS.UPLOAD(orgId),
      formData
    );
    console.log("documentService.uploadDocument response:", response.data);
    return response;
  }

  async downloadDocument(id: string, name?: string): Promise<void> {
    const blob = await apiClient.download(API_ENDPOINTS.DOCUMENTS.DOWNLOAD(id));
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = name ? `${name}.pdf` : `document-${id}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  async deleteDocument(id: string): Promise<ApiResponse> {
    return apiClient.delete<ApiResponse>(API_ENDPOINTS.DOCUMENTS.DELETE(id));
  }

  async updateDocument(
    id: string,
    name?: string,
    documentType?: string
  ): Promise<ApiResponse<Document>> {
    return apiClient.put<ApiResponse<Document>>(
      API_ENDPOINTS.DOCUMENTS.UPDATE(id),
      { name, documentType }
    );
  }

  async getDocumentsByUser(userId: string): Promise<ApiResponse<Document[]>> {
    return apiClient.get<ApiResponse<Document[]>>(
      API_ENDPOINTS.DOCUMENTS.GET_BY_USER(userId)
    );
  }

  async getDocumentMetrics(
    orgId: string
  ): Promise<ApiResponse<DocumentMetrics>> {
    return apiClient.get<ApiResponse<DocumentMetrics>>(
      API_ENDPOINTS.DOCUMENTS.GET_METRICS(orgId)
    );
  }
}

export const documentService = new DocumentService();
