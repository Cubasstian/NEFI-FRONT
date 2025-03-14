import { create } from "zustand";
import { auth, googleProvider } from "../../config/firebaseConfig";
import { signInWithPopup, signOut, User, onAuthStateChanged } from "firebase/auth";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,

  loginWithGoogle: async () => {
    set({ isLoading: true });
    try {
      const result = await signInWithPopup(auth, googleProvider);
      set({ user: result.user });
    } catch (error) {
      console.error("Error al iniciar sesión con Google", error);
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    try {
      await signOut(auth);
      set({ user: null });
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    }
  },

  checkAuth: () => {
    set({ isLoading: true });
    onAuthStateChanged(auth, (user) => {
      set({ user: user || null, isLoading: false });
    });
  },
}));


