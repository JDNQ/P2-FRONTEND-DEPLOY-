import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/lib/types/auth";
import api from "@/lib/api/axiosInstance";

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  updateUser: (partial: Partial<User>) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => {
        localStorage.setItem("tl_access_token", token);
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        set({ user, token, isAuthenticated: true });
      },
      updateUser: (partial) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...partial } : null,
        }));
      },
      clearAuth: () => {
        localStorage.removeItem("tl_access_token");
        delete api.defaults.headers.common["Authorization"];
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: "tl_auth",
      partialize: (s) => ({
        user: s.user,
        token: s.token,
        isAuthenticated: s.isAuthenticated,
      }),
    },
  ),
);
