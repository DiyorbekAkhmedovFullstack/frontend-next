'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/auth-store';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Cookies from 'js-cookie';

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, user, logout, setAccessToken } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check if we have a valid token in cookies
    const token = Cookies.get('accessToken');

    if (token && !isAuthenticated) {
      // We have a token but auth state not loaded yet
      // Restore the token to auth store
      setAccessToken(token);
      setIsChecking(false);
    } else if (!token && !isAuthenticated) {
      // No token and not authenticated - redirect to login
      router.push('/auth/login');
    } else {
      // Already authenticated
      setIsChecking(false);
    }
  }, [isAuthenticated, router, setAccessToken]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  // Show loading while checking authentication
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[rgb(var(--color-bg))]">
        <div className="w-16 h-16 border-4 border-[rgb(var(--color-border))] border-t-[rgb(var(--color-primary))] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-24 pb-12 bg-[rgb(var(--color-bg))]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">
              Welcome, {user.firstName}!
            </h1>
            <p className="text-[rgb(var(--color-text-secondary))]">
              Manage your learning journey here
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* User Info Card */}
            <div className="bg-[rgb(var(--color-bg-secondary))] border border-[rgb(var(--color-border))] rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="text-[rgb(var(--color-text-secondary))]">Name:</span>{' '}
                  <span className="font-medium">{user.firstName} {user.lastName}</span>
                </p>
                <p className="text-sm">
                  <span className="text-[rgb(var(--color-text-secondary))]">Email:</span>{' '}
                  <span className="font-medium">{user.email}</span>
                </p>
                <p className="text-sm">
                  <span className="text-[rgb(var(--color-text-secondary))]">Status:</span>{' '}
                  <span className={`font-medium ${user.emailVerified ? 'text-green-500' : 'text-yellow-500'}`}>
                    {user.emailVerified ? 'Verified' : 'Not Verified'}
                  </span>
                </p>
                <p className="text-sm">
                  <span className="text-[rgb(var(--color-text-secondary))]">Roles:</span>{' '}
                  <span className="font-medium">{user.roles.join(', ')}</span>
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-[rgb(var(--color-bg-secondary))] border border-[rgb(var(--color-border))] rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-3 bg-[rgb(var(--color-bg-tertiary))] rounded-md hover:bg-[rgb(var(--color-border))] transition-colors">
                  View Roadmap
                </button>
                <button className="w-full text-left px-4 py-3 bg-[rgb(var(--color-bg-tertiary))] rounded-md hover:bg-[rgb(var(--color-border))] transition-colors">
                  Browse Resources
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 bg-red-500/10 text-red-500 rounded-md hover:bg-red-500/20 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-[rgb(var(--color-bg-secondary))] border border-[rgb(var(--color-border))] rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Your Progress</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-[rgb(var(--color-text-secondary))] mb-1">Courses Completed</p>
                  <p className="text-3xl font-bold">0</p>
                </div>
                <div>
                  <p className="text-sm text-[rgb(var(--color-text-secondary))] mb-1">Learning Hours</p>
                  <p className="text-3xl font-bold">0</p>
                </div>
              </div>
            </div>
          </div>

          {!user.emailVerified && (
            <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-4 mb-8">
              <p className="text-yellow-500">
                <strong>Email not verified.</strong> Please check your inbox for the verification link.
              </p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
