import { create } from "zustand";
import { persist,createJSONStorage } from "zustand/middleware";
import { UserInfo } from "../lib/api";

interface AuthState {
  isLoggedIn: boolean;
  token: string | null;
  user: UserInfo | null;
  login: (token: string, user: UserInfo) => void;
  logout: () => void;
  setToken:(token:string|null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      token: null,
      user: null,
      login: (token, user) => {
        set({ isLoggedIn: true, token, user });
      },
      logout: () => {
        set({ isLoggedIn: false, token: null, user: null });
      },
      setToken: (token) => { // ✨ setToken 구현 ✨
        set({ token: token, isLoggedIn: !!token });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
