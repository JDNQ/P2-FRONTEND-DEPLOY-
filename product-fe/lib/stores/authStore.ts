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

/** Lấy key lưu avatar riêng cho từng user, tránh share giữa các tài khoản */
function getAvatarKey(userId: number | string) {
  return `tl_avatar_${userId}`;
}

/** Đọc avatarUrl từ localStorage riêng, không lưu trong persist state (tránh tràn quota) */
function readLocalAvatar(userId: number | string): string | null {
  try {
    return localStorage.getItem(getAvatarKey(userId));
  } catch {
    return null;
  }
}

/** Ghi avatarUrl vào localStorage riêng */
function writeLocalAvatar(userId: number | string, avatarUrl: string) {
  try {
    localStorage.setItem(getAvatarKey(userId), avatarUrl);
  } catch {
    // localStorage đầy → bỏ qua, user sẽ mất avatar nhưng không hỏng login
  }
}

/** Xóa avatarUrl khỏi localStorage riêng */
function removeLocalAvatar(userId: number | string) {
  try {
    localStorage.removeItem(getAvatarKey(userId));
  } catch {
    // ignore
  }
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => {
        localStorage.setItem("tl_access_token", token);
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        // Nếu user có avatarUrl từ BE thì dùng, nếu không thì merge avatar từ localStorage riêng
        const mergedUser = user.avatarUrl
          ? user
          : { ...user, avatarUrl: readLocalAvatar(user.id) ?? undefined };
        set({ user: mergedUser, token, isAuthenticated: true });
      },
      updateUser: (partial) => {
        set((state) => {
          if (!state.user) return {};
          // Nếu có avatarUrl mới → lưu vào localStorage riêng, không lưu vào persist state
          if (partial.avatarUrl) {
            writeLocalAvatar(state.user.id, partial.avatarUrl);
            return {
              user: { ...state.user, ...partial, avatarUrl: partial.avatarUrl },
            };
          }
          return { user: { ...state.user, ...partial } };
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
      // KHÔNG persist avatarUrl trong localStorage chính (tránh tràn quota)
      partialize: (s) => ({
        user: s.user
          ? {
              ...s.user,
              // Giữ avatarUrl chỉ khi nó nhỏ (từ BE), bỏ qua nếu là base64 lớn (lưu riêng)
              avatarUrl:
                s.user.avatarUrl && s.user.avatarUrl.length > 500
                  ? undefined
                  : s.user.avatarUrl,
            }
          : null,
        token: s.token,
        isAuthenticated: s.isAuthenticated,
      }),
      // Sau khi rehydrate từ persist, merge avatar từ localStorage riêng vào user
      onRehydrateStorage: () => {
        return (state, error) => {
          if (error || !state?.user?.id) return;
          const localAvatar = readLocalAvatar(state.user.id);
          if (localAvatar && !state.user.avatarUrl) {
            state.user.avatarUrl = localAvatar;
            // Force re-render bằng cách set state
            useAuthStore.setState({
              user: { ...state.user, avatarUrl: localAvatar },
            });
          }
        };
      },
    },
  ),
);
