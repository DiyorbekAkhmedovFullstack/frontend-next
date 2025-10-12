'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { authApi, ApiError } from '@/lib/api/client';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Verification token is missing. Please check your email link.');
        return;
      }

      try {
        const response = await authApi.verifyEmail(token);
        setStatus('success');
        setMessage(response.message || 'Email verified successfully!');

        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/auth/login');
        }, 3000);
      } catch (err) {
        setStatus('error');
        if (err instanceof ApiError) {
          setMessage(err.message);
        } else {
          setMessage('An unexpected error occurred. Please try again.');
        }
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[rgb(var(--color-bg))]">
      <div className="w-full max-w-md">
        <div className="bg-[rgb(var(--color-bg-secondary))] border border-[rgb(var(--color-border))] rounded-lg p-8 shadow-lg text-center">
          {status === 'verifying' && (
            <>
              <div className="w-16 h-16 border-4 border-[rgb(var(--color-border))] border-t-[rgb(var(--color-primary))] rounded-full animate-spin mx-auto mb-4"></div>
              <h2 className="text-2xl font-bold mb-2">Verifying Email</h2>
              <p className="text-[rgb(var(--color-text-secondary))]">
                Please wait while we verify your email address...
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-2">Email Verified!</h2>
              <p className="text-[rgb(var(--color-text-secondary))] mb-6">
                {message}
              </p>
              <p className="text-sm text-[rgb(var(--color-text-secondary))] mb-4">
                Redirecting to login page in 3 seconds...
              </p>
              <Link
                href="/auth/login"
                className="inline-block px-6 py-3 bg-[rgb(var(--color-primary))] text-[rgb(var(--color-secondary))] rounded-md font-medium hover:-translate-y-0.5 transition-transform"
              >
                Go to Login Now
              </Link>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-2">Verification Failed</h2>
              <p className="text-[rgb(var(--color-text-secondary))] mb-6">
                {message}
              </p>
              <div className="space-y-3">
                <Link
                  href="/auth/register"
                  className="block px-6 py-3 bg-[rgb(var(--color-primary))] text-[rgb(var(--color-secondary))] rounded-md font-medium hover:-translate-y-0.5 transition-transform"
                >
                  Register Again
                </Link>
                <Link
                  href="/"
                  className="block text-sm text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-primary))] transition-colors"
                >
                  Back to Home
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[rgb(var(--color-bg))]">
        <div className="w-16 h-16 border-4 border-[rgb(var(--color-border))] border-t-[rgb(var(--color-primary))] rounded-full animate-spin"></div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
