'use client';

import { Suspense } from 'react';
import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/auth-store';
import { ApiError } from '@/lib/api/client';

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[rgb(var(--color-bg))]">
          <div className="text-[rgb(var(--color-text-secondary))]">Loading registration...</div>
        </div>
      }
    >
      <RegisterPageContent />
    </Suspense>
  );
}

function RegisterPageContent() {
  const searchParams = useSearchParams();
  const { register } = useAuthStore();

  // Extract pre-filled data from URL params (from login redirect)
  const prefilledEmail = searchParams.get('email') || '';
  const passwordToken = searchParams.get('token') || '';
  const isPreFilled = !!prefilledEmail && !!passwordToken;

  const [formData, setFormData] = useState({
    email: prefilledEmail,
    password: '', // Not displayed when pre-filled
    firstName: '',
    lastName: '',
  });
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setValidationErrors({});
    setIsLoading(true);

    try {
      // Pass password token if registration is from login redirect
      await register(formData, isPreFilled ? passwordToken : undefined);
      setSuccess(true);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.errors) {
          setValidationErrors(err.errors);
        } else {
          setError(err.message);
        }
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[rgb(var(--color-bg))]">
        <div className="w-full max-w-md">
          <div className="bg-[rgb(var(--color-bg-secondary))] border border-[rgb(var(--color-border))] rounded-lg p-8 shadow-lg text-center">
            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Registration Successful!</h2>
            <p className="text-[rgb(var(--color-text-secondary))] mb-6">
              Please check your email to verify your account before logging in.
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
            {isPreFilled ? 'Complete Registration' : 'Create Account'}
          </h1>
          <p className="text-[rgb(var(--color-text-secondary))]">
            {isPreFilled
              ? 'Just a few more details to get started'
              : 'Join StudiWelt community today'}
          </p>
        </div>

        {isPreFilled && (
          <div className="mb-5 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/40 text-center">
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-2">
                <svg
                  className="w-5 h-5 text-yellow-500 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <span className="text-sm font-medium text-[rgb(var(--color-text))]">Email not registered</span>
              </div>

              <div>
                <div className="inline-block p-2 bg-black/20 rounded border border-yellow-500/30 max-w-full">
                  <p className="text-xs font-mono text-yellow-400 break-all">{prefilledEmail}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-[rgb(var(--color-text-secondary))] leading-relaxed">
                  Check if correct or{' '}
                  <a href="/auth/login" className="text-[rgb(var(--color-primary))] underline">
                    go back
                  </a>
                  . Password saved—add your name below.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-[rgb(var(--color-bg-secondary))] border border-[rgb(var(--color-border))] rounded-lg p-5 sm:p-8 shadow-lg">

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 rounded-md bg-red-500/10 border border-red-500/50 text-red-500 text-sm">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-[rgb(var(--color-bg-tertiary))] border border-[rgb(var(--color-border))] rounded-md focus:outline-none focus:border-[rgb(var(--color-primary))] transition-colors"
                />
                {validationErrors.firstName && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.firstName}</p>
                )}
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-[rgb(var(--color-bg-tertiary))] border border-[rgb(var(--color-border))] rounded-md focus:outline-none focus:border-[rgb(var(--color-primary))] transition-colors"
                />
                {validationErrors.lastName && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.lastName}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={isPreFilled}
                className="w-full px-4 py-3 bg-[rgb(var(--color-bg-tertiary))] border border-[rgb(var(--color-border))] rounded-md focus:outline-none focus:border-[rgb(var(--color-primary))] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                placeholder="your@email.com"
              />
              {validationErrors.email && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.email}</p>
              )}
            </div>

            {!isPreFilled && (
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-[rgb(var(--color-bg-tertiary))] border border-[rgb(var(--color-border))] rounded-md focus:outline-none focus:border-[rgb(var(--color-primary))] transition-colors"
                  placeholder="••••••••"
                />
                {validationErrors.password && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.password}</p>
                )}
                <p className="text-xs text-[rgb(var(--color-text-secondary))] mt-1">
                  Minimum 8 characters
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[rgb(var(--color-primary))] text-[rgb(var(--color-secondary))] rounded-md font-medium hover:-translate-y-0.5 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-[rgb(var(--color-text-secondary))]">Already have an account?</span>{' '}
            <Link href="/auth/login" className="text-[rgb(var(--color-primary))] hover:underline font-medium">
              Sign in
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
