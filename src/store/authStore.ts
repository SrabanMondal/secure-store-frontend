import { create } from "zustand";

interface AuthState {
  token: string | null;
  setToken: (token: string | null) => void;
  logout: () => void;
  isLoggedIn: boolean;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  isLoggedIn: typeof window !== "undefined" ? !!localStorage.getItem("token") : false,

  setToken: (token) => {
    if (token) {
      localStorage.setItem("token", token);
      set({ token, isLoggedIn: true });
    } else {
      localStorage.removeItem("token");
      set({ token: null, isLoggedIn: false });
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ token: null, isLoggedIn: false });
  },
}));
