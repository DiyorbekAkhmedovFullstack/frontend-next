'use client';

import { useMemo, useState } from 'react';
import type { Comment, UpdateCommentRequest } from '@/types/comment';
import LikeButton from './LikeButton';
import CommentForm from './CommentForm';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { useToast } from '@/components/providers/ToastProvider';

interface CommentItemProps {
  comment: Comment;
  isAuthenticated: boolean;
  onUpdate: (commentId: number, data: UpdateCommentRequest) => Promise<void>;
  onDelete: (commentId: number) => Promise<void>;
  onLike: (commentId: number) => Promise<void>;
  onUnlike: (commentId: number) => Promise<void>;
}

export default function CommentItem({
  comment,
  isAuthenticated,
  onUpdate,
  onDelete,
  onLike,
  onUnlike,
}: CommentItemProps) {
  const { showToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const initials = useMemo(() => {
    const first = comment.author.firstName?.charAt(0) ?? '';
    const last = comment.author.lastName?.charAt(0) ?? '';
    const combined = (first + last).toUpperCase();
    return combined || 'S';
  }, [comment.author.firstName, comment.author.lastName]);

  const handleUpdate = async (data: UpdateCommentRequest) => {
    await onUpdate(comment.id, data);
    setIsEditing(false);
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    setShowDeleteConfirm(false);
    setIsDeleting(true);
    try {
      await onDelete(comment.id);
    } catch (error) {
      console.error('Failed to delete comment:', error);
      showToast('Failed to delete comment. Please try again.', 'error');
      setIsDeleting(false);
    }
  };

  if (isEditing) {
    return (
      <div className="rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] p-5 sm:p-6">
        <h4 className="mb-4 text-base font-semibold text-[rgb(var(--color-text))] sm:text-lg">Edit Comment</h4>
        <CommentForm
          studienkollegId={comment.studienkollegId}
          mode="edit"
          initialTitle={comment.title}
          initialContent={comment.content}
          onSubmit={handleUpdate}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  return (
    <article className="space-y-3 rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg-secondary))] p-4 transition hover:-translate-y-0.5 hover:shadow-lg sm:space-y-4 sm:p-5">
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[rgb(var(--color-bg))] text-sm font-semibold text-[rgb(var(--color-primary))] sm:h-11 sm:w-11">
          {initials}
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex flex-col gap-1">
            <h3 className="text-base font-semibold text-[rgb(var(--color-text))] sm:text-lg">{comment.title}</h3>
            <div className="flex flex-wrap items-center gap-x-2 text-xs text-[rgb(var(--color-text-secondary))] sm:text-sm">
              <span>
                {comment.author.firstName} {comment.author.lastName}
              </span>
              <span className="text-[rgb(var(--color-border))]">•</span>
              <span>{comment.createdAt}</span>
            </div>
          </div>
          <p className="whitespace-pre-wrap text-sm leading-6 text-[rgb(var(--color-text))] sm:text-base">
            {comment.content}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-[rgb(var(--color-border))] pt-3">
        <LikeButton
          commentId={comment.id}
          initialLikesCount={comment.likesCount}
          initialIsLiked={comment.isLikedByCurrentUser}
          isAuthenticated={isAuthenticated}
          onLike={onLike}
          onUnlike={onUnlike}
        />

        {comment.isOwnComment && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-1.5 rounded-full border border-[rgb(var(--color-border))] px-3 py-1.5 text-xs font-semibold text-[rgb(var(--color-text))] transition hover:border-[rgb(var(--color-primary))] hover:text-[rgb(var(--color-primary))]"
              title="Edit comment"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-6m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              <span className="hidden sm:inline">Edit</span>
            </button>
            <button
              onClick={handleDeleteClick}
              disabled={isDeleting}
              className="inline-flex items-center gap-1.5 rounded-full border border-red-400/60 px-3 py-1.5 text-xs font-semibold text-red-400 transition hover:bg-red-500/10 disabled:opacity-60"
              title="Delete comment"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              <span className="hidden sm:inline">Delete</span>
            </button>
          </div>
        )}
      </div>

      {showDeleteConfirm && (
        <ConfirmDialog
          title="Delete Comment"
          message="Are you sure you want to delete this comment? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          type="danger"
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </article>
  );
}
