'use client';

import { useEffect, useState } from 'react';
import { useToast } from '@/components/providers/ToastProvider';

interface LikeButtonProps {
  commentId: number;
  initialLikesCount: number;
  initialIsLiked: boolean;
  isAuthenticated: boolean;
  onLike: (commentId: number) => Promise<void>;
  onUnlike: (commentId: number) => Promise<void>;
}

export default function LikeButton({
  commentId,
  initialLikesCount,
  initialIsLiked,
  isAuthenticated,
  onLike,
  onUnlike,
}: LikeButtonProps) {
  const { showToast } = useToast();
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setLikesCount(initialLikesCount);
    setIsLiked(initialIsLiked);
  }, [initialIsLiked, initialLikesCount]);

  const handleClick = async () => {
    if (!isAuthenticated) {
      showToast('Please login to like comments', 'warning');
      return;
    }

    if (isLoading) return;

    setIsLoading(true);

    // Optimistic update
    const newIsLiked = !isLiked;
    const newLikesCount = newIsLiked ? likesCount + 1 : likesCount - 1;
    setIsLiked(newIsLiked);
    setLikesCount(newLikesCount);

    try {
      if (newIsLiked) {
        await onLike(commentId);
      } else {
        await onUnlike(commentId);
      }
    } catch (error) {
      // Revert on error
      setIsLiked(!newIsLiked);
      setLikesCount(likesCount);
      console.error('Failed to toggle like:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      aria-pressed={isLiked}
      className={`inline-flex items-center justify-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
        isLiked
          ? 'border-[rgb(var(--color-primary))] bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))]'
          : 'border-[rgb(var(--color-border))] text-[rgb(var(--color-text-secondary))] hover:border-[rgb(var(--color-primary))] hover:text-[rgb(var(--color-primary))]'
      }`}
      title={isAuthenticated ? (isLiked ? 'Unlike comment' : 'Like comment') : 'Login to like'}
    >
      <svg
        className={`h-4 w-4 transition-colors ${
          isLiked ? 'fill-[rgb(var(--color-primary))] text-[rgb(var(--color-primary))]' : 'text-current'
        }`}
        fill={isLiked ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      <span className="text-xs font-semibold">{likesCount}</span>
      <span className="sr-only">
        {isLiked ? 'Unlike. ' : 'Like. '}
        {likesCount} likes
      </span>
    </button>
  );
}
