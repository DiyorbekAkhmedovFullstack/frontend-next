'use client';

import type { Comment, UpdateCommentRequest } from '@/types/comment';
import CommentItem from './CommentItem';

interface CommentListProps {
  comments: Comment[];
  isAuthenticated: boolean;
  onUpdate: (commentId: number, data: UpdateCommentRequest) => Promise<void>;
  onDelete: (commentId: number) => Promise<void>;
  onLike: (commentId: number) => Promise<void>;
  onUnlike: (commentId: number) => Promise<void>;
}

export default function CommentList({
  comments,
  isAuthenticated,
  onUpdate,
  onDelete,
  onLike,
  onUnlike,
}: CommentListProps) {
  if (comments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] p-8 text-center sm:p-10">
        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg-secondary))]">
          <svg
            className="h-6 w-6 text-[rgb(var(--color-primary))]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>
        <p className="text-sm font-semibold text-[rgb(var(--color-text))] sm:text-base">
          No comments yet. Be the first to share your experience!
        </p>
        <p className="text-xs text-[rgb(var(--color-text-secondary))] sm:text-sm">
          Your insight can help future students understand what to expect.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          isAuthenticated={isAuthenticated}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onLike={onLike}
          onUnlike={onUnlike}
        />
      ))}
    </div>
  );
}
