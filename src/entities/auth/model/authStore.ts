import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthenticationResponse } from "./types";

type AuthUser = {
  id: string;
  email: string;
  fullName: string;
  roles: string[];
};

type AuthState = {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  accessTokenExpiresAtUtc: string | null;
  refreshTokenExpiresAtUtc: string | null;
  isAuthenticated: boolean;
  setCredentials: (payload: AuthenticationResponse) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      accessTokenExpiresAtUtc: null,
      refreshTokenExpiresAtUtc: null,
      isAuthenticated: false,
      setCredentials: (payload) =>
        set({
          user: {
            id: payload.userId,
            email: payload.email,
            fullName: payload.fullName,
            roles: payload.roles,
          },
          accessToken: payload.accessToken,
          refreshToken: payload.refreshToken,
          accessTokenExpiresAtUtc: payload.accessTokenExpiresAtUtc,
          refreshTokenExpiresAtUtc: payload.refreshTokenExpiresAtUtc,
          isAuthenticated: true,
        }),
      logout: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          accessTokenExpiresAtUtc: null,
          refreshTokenExpiresAtUtc: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'apointo-auth',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        accessTokenExpiresAtUtc: state.accessTokenExpiresAtUtc,
        refreshTokenExpiresAtUtc: state.refreshTokenExpiresAtUtc,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
