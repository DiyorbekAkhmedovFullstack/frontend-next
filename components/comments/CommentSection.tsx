'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAuthStore } from '@/lib/stores/auth-store';
import { commentApi } from '@/lib/api/comments';
import type { Comment, CreateCommentRequest, UpdateCommentRequest } from '@/types/comment';
import CommentForm from './CommentForm';
import CommentList from './CommentList';
import Link from 'next/link';

interface CommentSectionProps {
  studienkollegId: string;
}

export default function CommentSection({ studienkollegId }: CommentSectionProps) {
  const { isAuthenticated } = useAuthStore();
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isComposerOpen, setIsComposerOpen] = useState(false);

  useEffect(() => {
    setIsComposerOpen(false);
  }, [isAuthenticated]);

  // Fetch comments on mount
  useEffect(() => {
    fetchComments();
  }, [studienkollegId]);

  const fetchComments = async () => {
    try {
      setIsLoading(true);
      const response = await commentApi.getComments(studienkollegId);
      setComments(response.data || []);
      setError('');
      // Show composer after initial load on larger screens
      if (isAuthenticated) {
        setIsComposerOpen(false);
      }
    } catch (err: any) {
      setError('Failed to load comments');
      console.error('Failed to fetch comments:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (data: CreateCommentRequest) => {
    const response = await commentApi.createComment(data);
    if (response.data) {
      // Add new comment to the list
      setComments((prev) => [response.data!, ...prev]);
      setIsComposerOpen(false);
    }
  };

  const handleUpdate = async (commentId: number, data: UpdateCommentRequest) => {
    const response = await commentApi.updateComment(studienkollegId, commentId, data);
    if (response.data) {
      // Update comment in the list
      setComments((prev) => prev.map((c) => (c.id === commentId ? response.data! : c)));
    }
  };

  const handleDelete = async (commentId: number) => {
    await commentApi.deleteComment(studienkollegId, commentId);
    // Remove comment from the list
    setComments((prev) => prev.filter((c) => c.id !== commentId));
  };

  const handleLike = async (commentId: number) => {
    await commentApi.likeComment(studienkollegId, commentId);
    // The optimistic update is handled by LikeButton component
  };

  const handleUnlike = async (commentId: number) => {
    await commentApi.unlikeComment(studienkollegId, commentId);
    // The optimistic update is handled by LikeButton component
  };

  const commentCountCopy = useMemo(() => {
    const count = comments.length;
    if (count === 0) {
      return 'No comments yet';
    }
    if (count === 1) {
      return '1 comment';
    }
    return `${count} comments`;
  }, [comments.length]);

  return (
    <section className="space-y-4 sm:space-y-6">
      <header className="space-y-2 sm:space-y-3">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-[rgb(var(--color-text))] sm:text-2xl">Student Experiences</h2>
          <span className="rounded-full bg-[rgb(var(--color-bg-secondary))] px-3 py-1 text-xs font-medium text-[rgb(var(--color-text-secondary))]">
            {commentCountCopy}
          </span>
        </div>
        <p className="text-sm text-[rgb(var(--color-text-secondary))] sm:text-base">
          Real feedback from students currently or recently enrolled at this Studienkolleg.
        </p>
      </header>

      {isAuthenticated ? (
        <div className="space-y-3 rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg-secondary))] p-4 sm:p-5">
          <button
            type="button"
            onClick={() => setIsComposerOpen((prev) => !prev)}
            className="flex w-full items-center justify-between rounded-xl bg-[rgb(var(--color-bg))] px-4 py-3 text-left text-sm font-medium text-[rgb(var(--color-text))] transition hover:bg-[rgb(var(--color-bg))]/80"
            aria-expanded={isComposerOpen}
          >
            <span>{isComposerOpen ? 'Hide comment form' : 'Write a comment'}</span>
            <svg
              className={`h-4 w-4 transition ${isComposerOpen ? 'rotate-45' : ''}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m7-7H5" />
            </svg>
          </button>

          {isComposerOpen && (
            <CommentForm
              studienkollegId={studienkollegId}
              mode="create"
              onSubmit={handleCreate}
              onCancel={() => setIsComposerOpen(false)}
              enableCancel
            />
          )}
        </div>
      ) : (
        <div className="space-y-3 rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg-secondary))] p-4 sm:p-5">
          <p className="text-sm text-[rgb(var(--color-text-secondary))]">
            Log in to share your thoughts and help future applicants.
          </p>
          <Link
            href="/auth/login"
            className="inline-flex w-full items-center justify-center rounded-xl bg-[rgb(var(--color-primary))] px-4 py-2 text-sm font-semibold text-[rgb(var(--color-secondary))] transition hover:-translate-y-0.5 hover:shadow-lg sm:w-auto"
          >
            Log in to comment
          </Link>
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg-secondary))] p-6 text-center sm:p-8">
          <div className="inline-block h-7 w-7 animate-spin rounded-full border-4 border-[rgb(var(--color-primary))] border-t-transparent" />
          <p className="text-sm text-[rgb(var(--color-text-secondary))]">Loading comments…</p>
        </div>
      ) : (
        <CommentList
          comments={comments}
          isAuthenticated={isAuthenticated}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onLike={handleLike}
          onUnlike={handleUnlike}
        />
      )}

      {error && (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}
    </section>
  );
}
