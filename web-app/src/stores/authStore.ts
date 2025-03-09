import { create } from "zustand";
import { IUser } from "../types/api";

type AuthState = {
  user: IUser | null;
  setUser: (userData: IUser) => void;
  logout: () => void;
};

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  setUser: (userData: IUser) =>
    set(() => ({
      user: userData,
    })),

  // Log out the user
  logout: () =>
    set(() => ({
      user: null,
    })),
}));

export default useAuthStore;
