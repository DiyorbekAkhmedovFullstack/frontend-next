'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/lib/stores/auth-store';
import Cookies from 'js-cookie';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, accessToken } = useAuthStore();

  useEffect(() => {
    // Set up token refresh interval
    // This will automatically refresh the token before it expires
    const refreshInterval = setInterval(() => {
      const currentToken = Cookies.get('accessToken');
      const refreshToken = Cookies.get('refreshToken');

      // If we have user but no access token, try to refresh
      if (user && !currentToken && refreshToken) {
        useAuthStore.getState().refreshToken().catch((error) => {
          // Silent fail - user will be logged out if refresh fails
          console.log('Token refresh failed - user needs to login again');
        });
      }
    }, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(refreshInterval);
  }, [user, accessToken]);

  return <>{children}</>;
}
