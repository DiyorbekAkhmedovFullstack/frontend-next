import type {
  ApiResponse,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  LoginResponse,
  PasswordResetRequest,
  PasswordResetConfirmRequest,
} from '@/types';
import { ApiError, getApiBaseUrl, httpFetch } from '@/lib/api/http';

const fetchApi = async <T>(
  endpoint: string,
  options: RequestInit = {},
  skipAuth = false
): Promise<ApiResponse<T>> => httpFetch<T>(endpoint, { ...options, skipAuth });

export const authApi = {
  async register(data: RegisterRequest, passwordToken?: string): Promise<ApiResponse<void>> {
    const requestBody = passwordToken
      ? { ...data, passwordToken }
      : data;

    return fetchApi('/auth/register', {
      method: 'POST',
      body: JSON.stringify(requestBody),
    }, true); // Skip auth - public endpoint
  },

  async login(data: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    return fetchApi('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }, true); // Skip auth - public endpoint
  },

  async verifyEmail(token: string): Promise<ApiResponse<void>> {
    return fetchApi(`/auth/verify-email?token=${token}`, {
      method: 'GET',
    }, true); // Skip auth - public endpoint
  },

  async requestPasswordReset(data: PasswordResetRequest): Promise<ApiResponse<void>> {
    return fetchApi('/auth/password-reset/request', {
      method: 'POST',
      body: JSON.stringify(data),
    }, true); // Skip auth - public endpoint
  },

  async confirmPasswordReset(data: PasswordResetConfirmRequest): Promise<ApiResponse<void>> {
    return fetchApi('/auth/password-reset/confirm', {
      method: 'POST',
      body: JSON.stringify(data),
    }, true); // Skip auth - public endpoint
  },

  async refreshToken(): Promise<ApiResponse<AuthResponse>> {
    return fetchApi('/auth/refresh', {
      method: 'POST',
    }, true); // Skip auth - uses refresh token cookie instead
  },

  async logout(): Promise<ApiResponse<void>> {
    return fetchApi('/auth/logout', {
      method: 'POST',
    }); // Requires auth
  },
};

// Health check
export const healthApi = {
  async check(): Promise<{ status: string; timestamp: string; service: string }> {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.json();
  },
};

// Example protected endpoint - add your actual API calls here
export const protectedApi = {
  // Example: Get user profile (requires authentication)
  async getUserProfile(): Promise<ApiResponse<any>> {
    return fetchApi('/user/profile', {
      method: 'GET',
    }); // Authentication cookies are sent automatically
  },

  // Example: Update user profile
  async updateUserProfile(data: any): Promise<ApiResponse<any>> {
    return fetchApi('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }); // Authentication cookies are sent automatically
  },
};

export { ApiError };
