import type { ApiResponse } from '@/types';

// Determine API base URL (runtime override first)
export function getApiBaseUrl(): string {
  // In production with proxy, use /api prefix for Next.js rewrites
  if (typeof window !== 'undefined') {
    const runtimeUrl = (window as any).__API_URL__;
    if (runtimeUrl === 'SAME_ORIGIN') {
      return '/api'; // Relative path that matches Next.js rewrite rule
    }
    if (runtimeUrl) {
      return runtimeUrl;
    }
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public errors?: Record<string, string>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface FetchOptions extends RequestInit {
  skipAuth?: boolean;
}

export async function httpFetch<T>(
  endpoint: string,
  { skipAuth = false, ...options }: FetchOptions = {}
): Promise<ApiResponse<T>> {
  const API_BASE_URL = getApiBaseUrl();
  const url = `${API_BASE_URL}${endpoint}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (options.headers) {
    Object.assign(headers, options.headers as Record<string, string>);
  }

  const config: RequestInit = {
    ...options,
    headers,
    credentials: 'include',
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401 && !skipAuth && !endpoint.includes('/auth/refresh')) {
        throw new ApiError('Session expired. Please log in again.', 401);
      }

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
