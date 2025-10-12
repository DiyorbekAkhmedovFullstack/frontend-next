'use client';

import { useState, FormEvent } from 'react';
import type { CreateCommentRequest, UpdateCommentRequest } from '@/types/comment';

type CommentFormProps =
  | {
      studienkollegId: string;
      mode: 'create';
      initialTitle?: string;
      initialContent?: string;
      onSubmit: (data: CreateCommentRequest) => Promise<void>;
      onCancel?: () => void;
      enableCancel?: boolean;
    }
  | {
      studienkollegId: string;
      mode: 'edit';
      initialTitle?: string;
      initialContent?: string;
      onSubmit: (data: UpdateCommentRequest) => Promise<void>;
      onCancel?: () => void;
      enableCancel?: boolean;
    };

export default function CommentForm({
  studienkollegId,
  mode,
  initialTitle = '',
  initialContent = '',
  onSubmit,
  onCancel,
  enableCancel = false,
}: CommentFormProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    if (title.length > 200) {
      setError('Title must be less than 200 characters');
      return;
    }
    if (!content.trim()) {
      setError('Content is required');
      return;
    }
    if (content.length > 5000) {
      setError('Content must be less than 5000 characters');
      return;
    }

    setIsLoading(true);

    try {
      if (mode === 'create') {
        await onSubmit({
          studienkollegId,
          title: title.trim(),
          content: content.trim(),
        } as CreateCommentRequest);
        // Reset form on success
        setTitle('');
        setContent('');
      } else {
        await onSubmit({
          title: title.trim(),
          content: content.trim(),
        } as UpdateCommentRequest);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit comment');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-xs font-medium text-red-400 sm:text-sm">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <label
          htmlFor="comment-title"
          className="block text-sm font-medium text-[rgb(var(--color-text))]"
        >
          Title
        </label>
        <input
          id="comment-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={200}
          placeholder="Brief summary of your experience"
          className="w-full rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-4 py-3 text-sm transition focus:border-[rgb(var(--color-primary))] focus:outline-none sm:text-base"
          disabled={isLoading}
        />
        <p className="text-xs text-[rgb(var(--color-text-secondary))]">
          {title.length}/200 characters
        </p>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="comment-content"
          className="block text-sm font-medium text-[rgb(var(--color-text))]"
        >
          Your Experience
        </label>
        <textarea
          id="comment-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={5000}
          rows={6}
          placeholder="Share your experience studying at this Studienkolleg..."
          className="min-h-[8rem] w-full resize-y rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-4 py-3 text-sm leading-relaxed transition focus:border-[rgb(var(--color-primary))] focus:outline-none sm:text-base"
          disabled={isLoading}
        />
        <p className="text-xs text-[rgb(var(--color-text-secondary))]">
          {content.length}/5000 characters
        </p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end sm:gap-3">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[rgb(var(--color-primary))] px-6 py-2.5 text-sm font-semibold text-[rgb(var(--color-secondary))] transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? 'Submitting…' : mode === 'create' ? 'Post Comment' : 'Update Comment'}
        </button>
        {(mode === 'edit' || enableCancel) && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-[rgb(var(--color-border))] px-6 py-2.5 text-sm font-semibold text-[rgb(var(--color-text))] transition hover:border-[rgb(var(--color-primary))] hover:text-[rgb(var(--color-primary))] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
