'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/lib/stores/auth-store';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, accessTokenExpiresAt, initialized } = useAuthStore();

  // Attempt to bootstrap the session on first render
  useEffect(() => {
    if (!initialized) {
      useAuthStore.getState().refreshToken().catch(() => {
        // Silently ignore – absence of a refresh cookie simply means no session
      });
    }
  }, [initialized]);

  // Schedule proactive refresh based on the stored expiry time
  useEffect(() => {
    if (!user || !accessTokenExpiresAt) {
      return;
    }

    const now = Date.now();
    const refreshDelay = Math.max(accessTokenExpiresAt - now - 60_000, 5_000); // refresh 1 minute early

    const timer = setTimeout(() => {
      useAuthStore.getState().refreshToken().catch(() => {
        console.log('Token refresh failed - user needs to login again');
      });
    }, refreshDelay);

    return () => clearTimeout(timer);
  }, [user, accessTokenExpiresAt]);

  return <>{children}</>;
}
