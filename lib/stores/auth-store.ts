import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';
import type { AuthState, RegisterRequest, UserDto } from '@/types';
import { authApi, ApiError } from '@/lib/api/client';
import { sanitizeEmail, sanitizeInput } from '@/lib/utils/sanitize';

// Helper function to get token from cookie
const getStoredAccessToken = () => {
  if (typeof window === 'undefined') return null;
  return Cookies.get('accessToken') || null;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: getStoredAccessToken(), // Initialize from cookie
      isAuthenticated: false,
      isLoading: false,

      setUser: (user) => {
        set({ user, isAuthenticated: !!user });
      },

      setAccessToken: (token) => {
        const state = get();
        set({
          accessToken: token,
          // If we have both token and user, mark as authenticated
          isAuthenticated: !!(token && state.user)
        });
        if (token) {
          // Store token in cookie (not HttpOnly, for client-side access)
          Cookies.set('accessToken', token, { expires: 1/96 }); // 15 minutes
        } else {
          Cookies.remove('accessToken');
        }
      },

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          // Sanitize inputs before sending to API
          const sanitizedEmail = sanitizeEmail(email);
          const response = await authApi.login({ email: sanitizedEmail, password });

          if (response.data) {
            const { accessToken, user } = response.data;

            set({
              accessToken,
              user,
              isAuthenticated: true,
              isLoading: false,
            });

            // Store access token
            Cookies.set('accessToken', accessToken, { expires: 1/96 }); // 15 minutes

            // Note: refreshToken is stored as HttpOnly cookie by the backend
          }
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (data: RegisterRequest) => {
        set({ isLoading: true });
        try {
          // Sanitize all inputs before sending to API
          const sanitizedData: RegisterRequest = {
            email: sanitizeEmail(data.email),
            password: data.password, // Don't sanitize password
            firstName: sanitizeInput(data.firstName),
            lastName: sanitizeInput(data.lastName),
          };
          await authApi.register(sanitizedData);
          set({ isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        try {
          const refreshToken = Cookies.get('refreshToken');
          if (refreshToken) {
            await authApi.logout(refreshToken);
          }
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
          });
          Cookies.remove('accessToken');
          Cookies.remove('refreshToken');
        }
      },

      refreshToken: async () => {
        try {
          const refreshToken = Cookies.get('refreshToken');
          if (!refreshToken) {
            throw new Error('No refresh token available');
          }

          const response = await authApi.refreshToken({ refreshToken });

          if (response.data) {
            const { accessToken, user } = response.data;

            set({
              accessToken,
              user,
              isAuthenticated: true,
            });

            Cookies.set('accessToken', accessToken, { expires: 1/96 }); // 15 minutes
          }
        } catch (error) {
          // If refresh fails, logout user
          get().logout();
          throw error;
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        // After state is restored from localStorage, sync with cookie token
        if (state) {
          const cookieToken = getStoredAccessToken();
          if (cookieToken && state.user) {
            // If we have both user (from localStorage) and token (from cookie), restore full auth state
            state.accessToken = cookieToken;
            state.isAuthenticated = true;
          } else if (state.user && !cookieToken) {
            // If we have user but no token, mark as not authenticated (token expired)
            state.isAuthenticated = false;
            state.accessToken = null;
          }
        }
      },
    }
  )
);
