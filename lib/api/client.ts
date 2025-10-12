import type {
  ApiResponse,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  PasswordResetRequest,
  PasswordResetConfirmRequest,
  RefreshTokenRequest,
} from '@/types';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public errors?: Record<string, string>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Get access token from cookie
function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return Cookies.get('accessToken') || null;
}

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {},
  skipAuth = false
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;

  // Prepare headers
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Add Authorization header for authenticated requests
  if (!skipAuth) {
    const token = getAccessToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  // Merge with provided headers
  if (options.headers) {
    Object.assign(headers, options.headers);
  }

  const config: RequestInit = {
    ...options,
    headers,
    credentials: 'include', // Important for HttpOnly cookies
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      // Handle 401 Unauthorized - token expired or invalid
      if (response.status === 401) {
        // Token might be expired, try to refresh
        if (!skipAuth && !endpoint.includes('/auth/refresh')) {
          // Attempt token refresh will be handled by the auth store
          throw new ApiError('Session expired. Please log in again.', 401);
        }
      }

      // Handle validation errors
      if (data.errors) {
        throw new ApiError(data.message || 'Validation failed', response.status, data.errors);
      }
      throw new ApiError(data.message || 'Request failed', response.status);
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Network error occurred', 500);
  }
}

// Auth API
export const authApi = {
  async register(data: RegisterRequest): Promise<ApiResponse<void>> {
    return fetchApi('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }, true); // Skip auth - public endpoint
  },

  async login(data: LoginRequest): Promise<ApiResponse<AuthResponse>> {
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

  async refreshToken(data: RefreshTokenRequest): Promise<ApiResponse<AuthResponse>> {
    return fetchApi('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify(data),
    }, true); // Skip auth - uses refresh token instead
  },

  async logout(refreshToken: string): Promise<ApiResponse<void>> {
    return fetchApi('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    }); // Requires auth
  },
};

// Health check
export const healthApi = {
  async check(): Promise<{ status: string; timestamp: string; service: string }> {
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
    }); // Will automatically include Authorization header
  },

  // Example: Update user profile
  async updateUserProfile(data: any): Promise<ApiResponse<any>> {
    return fetchApi('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }); // Will automatically include Authorization header
  },
};

export { ApiError };
