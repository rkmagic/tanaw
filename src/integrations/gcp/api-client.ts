import type { Profile, PublicProfile, Document, CreateProfileData, UpdateProfileData, AccountMe } from './types';
import { getAuthToken } from './auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

class ApiClient {
  private async getAuthToken(): Promise<string | null> {
    return getAuthToken();
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = await this.getAuthToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Account endpoints
  async getAccountsMe(): Promise<AccountMe> {
    return this.request<AccountMe>('/api/v1/accounts/me');
  }

  // Profile endpoints
  async getProfile(id: string): Promise<PublicProfile> {
    return this.request<PublicProfile>(`/api/v1/profiles/${id}`);
  }

  async getMyProfile(): Promise<Profile> {
    return this.request<Profile>('/api/v1/profiles/me');
  }

  async createProfile(data: CreateProfileData): Promise<Profile> {
    return this.request<Profile>('/api/v1/profiles', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProfile(data: UpdateProfileData): Promise<Profile> {
    return this.request<Profile>('/api/v1/profiles/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Document endpoints
  async listDocuments(): Promise<Document[]> {
    return this.request<Document[]>(`/api/v1/documents`);
  }

  async uploadDocument(file: File, documentType: string): Promise<Document> {
    const token = await this.getAuthToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('document_type', documentType);

    const response = await fetch(`${API_URL}/api/documents/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async deleteDocument(id: string): Promise<void> {
    await this.request(`/api/v1/documents/${id}`, {
      method: 'DELETE',
    });
  }

  async getDocumentDownloadUrl(id: string): Promise<{ url: string }> {
    return this.request<{ url: string }>(`/api/v1/documents/${id}/download`);
  }
}

export const apiClient = new ApiClient();
