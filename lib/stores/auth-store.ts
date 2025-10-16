import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthState, RegisterRequest } from '@/types';
import { authApi } from '@/lib/api/client';
import { sanitizeEmail, sanitizeInput } from '@/lib/utils/sanitize';

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      accessTokenExpiresAt: null,
      initialized: false,

      setUser: (user) => {
        set({
          user,
          isAuthenticated: !!user,
        });
      },

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const sanitizedEmail = sanitizeEmail(email);
          const response = await authApi.login({ email: sanitizedEmail, password });

          if (response.data) {
            if (response.data.userExists && response.data.authData) {
              // Normal login - user exists
              const { user, expiresIn } = response.data.authData;

              set({
                user,
                isAuthenticated: true,
                isLoading: false,
                accessTokenExpiresAt: Date.now() + expiresIn * 1000,
                initialized: true,
              });
            } else {
              // User doesn't exist - return pre-registration data for redirect
              set({ isLoading: false, initialized: true });
            }
          } else {
            set({ isLoading: false, initialized: true });
          }

          return response.data;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (data: RegisterRequest, passwordToken?: string) => {
        set({ isLoading: true });
        try {
          const sanitizedData: RegisterRequest = {
            email: sanitizeEmail(data.email),
            password: data.password,
            firstName: sanitizeInput(data.firstName),
            lastName: sanitizeInput(data.lastName),
          };
          await authApi.register(sanitizedData, passwordToken);
          set({ isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        try {
          await authApi.logout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          set({
            user: null,
            isAuthenticated: false,
            accessTokenExpiresAt: null,
            initialized: true,
          });
        }
      },

      refreshToken: async () => {
        try {
          const response = await authApi.refreshToken();

          if (response.data) {
            const { user, expiresIn } = response.data;

            set({
              user,
              isAuthenticated: true,
              accessTokenExpiresAt: Date.now() + expiresIn * 1000,
            });
          }
        } catch (error) {
          const wasAuthenticated = get().isAuthenticated;

          if (wasAuthenticated) {
            try {
              await authApi.logout();
            } catch (logoutError) {
              console.error('Logout cleanup error:', logoutError);
            }
          }

          set({
            user: null,
            isAuthenticated: false,
            accessTokenExpiresAt: null,
          });

          throw error;
        } finally {
          set({ initialized: true });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        accessTokenExpiresAt: state.accessTokenExpiresAt,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.initialized = false;
        }
      },
    }
  )
);
