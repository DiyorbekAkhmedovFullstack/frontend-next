import type { ApiResponse } from '@/types';
import type { Comment, CreateCommentRequest, UpdateCommentRequest } from '@/types/comment';
import { ApiError, httpFetch } from '@/lib/api/http';

async function commentRequest<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  try {
    return await httpFetch<T>(endpoint, { ...options });
  } catch (error) {
    if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
      throw new Error(error.message || 'You need to log in to perform this action.');
    }
    throw error;
  }
}

export const commentApi = {
  async getComments(studienkollegId: string): Promise<ApiResponse<Comment[]>> {
    return commentRequest(`/studienkolleg/${studienkollegId}/comments`, {
      method: 'GET',
    });
  },

  async createComment(data: CreateCommentRequest): Promise<ApiResponse<Comment>> {
    return commentRequest(`/studienkolleg/${data.studienkollegId}/comments`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateComment(
    studienkollegId: string,
    commentId: number,
    data: UpdateCommentRequest
  ): Promise<ApiResponse<Comment>> {
    return commentRequest(`/studienkolleg/${studienkollegId}/comments/${commentId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteComment(
    studienkollegId: string,
    commentId: number
  ): Promise<ApiResponse<void>> {
    return commentRequest(`/studienkolleg/${studienkollegId}/comments/${commentId}`, {
      method: 'DELETE',
    });
  },

  async likeComment(
    studienkollegId: string,
    commentId: number
  ): Promise<ApiResponse<void>> {
    return commentRequest(`/studienkolleg/${studienkollegId}/comments/${commentId}/like`, {
      method: 'POST',
    });
  },

  async unlikeComment(
    studienkollegId: string,
    commentId: number
  ): Promise<ApiResponse<void>> {
    return commentRequest(`/studienkolleg/${studienkollegId}/comments/${commentId}/like`, {
      method: 'DELETE',
    });
  },
};
