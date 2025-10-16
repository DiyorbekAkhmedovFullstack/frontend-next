'use client';

import { useState, FormEvent, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { authApi, ApiError } from '@/lib/api/client';

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [step, setStep] = useState<'request' | 'confirm'>(token ? 'confirm' : 'request');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (token) {
      setStep('confirm');
    }
  }, [token]);

  const handleRequestReset = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await authApi.requestPasswordReset({ email });
      setSuccess(true);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmReset = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (!token) {
      setError('Reset token is missing');
      return;
    }

    setIsLoading(true);

    try {
      await authApi.confirmPasswordReset({ token, newPassword });
      setSuccess(true);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (success && step === 'request') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[rgb(var(--color-bg))]">
        <div className="w-full max-w-md">
          <div className="bg-[rgb(var(--color-bg-secondary))] border border-[rgb(var(--color-border))] rounded-lg p-8 shadow-lg text-center">
            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Check Your Email</h2>
            <p className="text-[rgb(var(--color-text-secondary))] mb-6">
              If an account exists with that email, we've sent password reset instructions.
            </p>
            <Link
              href="/auth/login"
              className="inline-block px-6 py-3 bg-[rgb(var(--color-primary))] text-[rgb(var(--color-secondary))] rounded-md font-medium hover:-translate-y-0.5 transition-transform"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (success && step === 'confirm') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[rgb(var(--color-bg))]">
        <div className="w-full max-w-md">
          <div className="bg-[rgb(var(--color-bg-secondary))] border border-[rgb(var(--color-border))] rounded-lg p-8 shadow-lg text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Password Reset Successful!</h2>
            <p className="text-[rgb(var(--color-text-secondary))] mb-6">
              Your password has been reset. You can now log in with your new password.
            </p>
            <Link
              href="/auth/login"
              className="inline-block px-6 py-3 bg-[rgb(var(--color-primary))] text-[rgb(var(--color-secondary))] rounded-md font-medium hover:-translate-y-0.5 transition-transform"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[rgb(var(--color-bg))]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {step === 'request' ? 'Reset Password' : 'Set New Password'}
          </h1>
          <p className="text-[rgb(var(--color-text-secondary))]">
            {step === 'request'
              ? 'Enter your email to receive reset instructions'
              : 'Enter your new password below'
            }
          </p>
        </div>

        <div className="bg-[rgb(var(--color-bg-secondary))] border border-[rgb(var(--color-border))] rounded-lg p-8 shadow-lg">
          {step === 'request' ? (
            <form onSubmit={handleRequestReset} className="space-y-6">
              {error && (
                <div className="p-3 rounded-md bg-red-500/10 border border-red-500/50 text-red-500 text-sm">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-[rgb(var(--color-bg-tertiary))] border border-[rgb(var(--color-border))] rounded-md focus:outline-none focus:border-[rgb(var(--color-primary))] transition-colors"
                  placeholder="your@email.com"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-[rgb(var(--color-primary))] text-[rgb(var(--color-secondary))] rounded-md font-medium hover:-translate-y-0.5 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleConfirmReset} className="space-y-6">
              {error && (
                <div className="p-3 rounded-md bg-red-500/10 border border-red-500/50 text-red-500 text-sm">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium mb-2">
                  New Password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-[rgb(var(--color-bg-tertiary))] border border-[rgb(var(--color-border))] rounded-md focus:outline-none focus:border-[rgb(var(--color-primary))] transition-colors"
                  placeholder="••••••••"
                />
                <p className="text-xs text-[rgb(var(--color-text-secondary))] mt-1">
                  Minimum 8 characters
                </p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-[rgb(var(--color-bg-tertiary))] border border-[rgb(var(--color-border))] rounded-md focus:outline-none focus:border-[rgb(var(--color-primary))] transition-colors"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-[rgb(var(--color-primary))] text-[rgb(var(--color-secondary))] rounded-md font-medium hover:-translate-y-0.5 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          )}

          <div className="mt-6 text-center text-sm">
            <Link href="/auth/login" className="text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-primary))] transition-colors">
              ← Back to login
            </Link>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-primary))] transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[rgb(var(--color-bg))]">
        <div className="w-16 h-16 border-4 border-[rgb(var(--color-border))] border-t-[rgb(var(--color-primary))] rounded-full animate-spin"></div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
