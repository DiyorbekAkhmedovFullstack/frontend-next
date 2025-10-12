import type {
  ApiResponse,
} from '@/types';
import type {
  Comment,
  CreateCommentRequest,
  UpdateCommentRequest,
} from '@/types/comment';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;

  // Get access token from cookie
  const getAccessToken = () => {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(new RegExp('(^| )accessToken=([^;]+)'));
    return match ? match[2] : null;
  };

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const token = getAccessToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers: { ...headers, ...options.headers },
    credentials: 'include',
  };

  const response = await fetch(url, config);
  let data: ApiResponse<T>;

  try {
    data = await response.json();
  } catch (parseError) {
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new Error('You need to log in to perform this action.');
      }
      throw new Error(`Request failed with status ${response.status}`);
    }
    throw new Error('Failed to parse server response');
  }

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error(data?.message || 'You need to log in to perform this action.');
    }
    throw new Error(data?.message || `Request failed with status ${response.status}`);
  }

  return data;
}

export const commentApi = {
  async getComments(studienkollegId: string): Promise<ApiResponse<Comment[]>> {
    return fetchApi(`/studienkolleg/${studienkollegId}/comments`, {
      method: 'GET',
    });
  },

  async createComment(data: CreateCommentRequest): Promise<ApiResponse<Comment>> {
    return fetchApi(`/studienkolleg/${data.studienkollegId}/comments`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateComment(
    studienkollegId: string,
    commentId: number,
    data: UpdateCommentRequest
  ): Promise<ApiResponse<Comment>> {
    return fetchApi(`/studienkolleg/${studienkollegId}/comments/${commentId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteComment(
    studienkollegId: string,
    commentId: number
  ): Promise<ApiResponse<void>> {
    return fetchApi(`/studienkolleg/${studienkollegId}/comments/${commentId}`, {
      method: 'DELETE',
    });
  },

  async likeComment(
    studienkollegId: string,
    commentId: number
  ): Promise<ApiResponse<void>> {
    return fetchApi(`/studienkolleg/${studienkollegId}/comments/${commentId}/like`, {
      method: 'POST',
    });
  },

  async unlikeComment(
    studienkollegId: string,
    commentId: number
  ): Promise<ApiResponse<void>> {
    return fetchApi(`/studienkolleg/${studienkollegId}/comments/${commentId}/like`, {
      method: 'DELETE',
    });
  },
};
