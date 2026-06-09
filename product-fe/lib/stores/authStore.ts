import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/lib/types/auth";
import api from "@/lib/api/axiosInstance";

const AVATAR_STORAGE_KEY = "tl_avatar";

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
        // Merge avatar từ localStorage riêng nếu user từ BE không có avatarUrl
        // (vì avatar chỉ lưu local base64, chưa upload lên BE)
        const localAvatar = localStorage.getItem(AVATAR_STORAGE_KEY);
        const mergedUser =
          localAvatar && !user.avatarUrl
            ? { ...user, avatarUrl: localAvatar }
            : user;
        set({ user: mergedUser, token, isAuthenticated: true });
      },
      updateUser: (partial) => {
        set((state) => {
          const updatedUser = state.user ? { ...state.user, ...partial } : null;
          // Lưu avatarUrl riêng vào localStorage để persist sau logout/login
          if (partial.avatarUrl) {
            localStorage.setItem(AVATAR_STORAGE_KEY, partial.avatarUrl);
          }
          return { user: updatedUser };
        });
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
