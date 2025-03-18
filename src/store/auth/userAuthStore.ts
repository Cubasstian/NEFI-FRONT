// src/store/auth/useAuthStore.ts
import { create } from "zustand";
import { auth } from "../../config/firebaseConfig";
import { onAuthStateChanged, User } from "firebase/auth";
import { authService } from "../../services/authService";
import { UserData, EmpresaData } from "../../types";

interface AuthState {
  user: User | null;
  profile: UserData | EmpresaData | null;
  allUsers: UserData[];
  allEmpresas: EmpresaData[];
  isLoading: boolean;
  error: string | null;
  register: (email: string, password: string, data: UserData | EmpresaData, type: "user" | "empresa") => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => void;
  updateProfile: (uid: string, data: Partial<UserData | EmpresaData>, type: "user" | "empresa") => Promise<void>;
  deleteProfile: (uid: string, type: "user" | "empresa") => Promise<void>;
  fetchAllProfiles: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  allUsers: [],
  allEmpresas: [],
  isLoading: false,
  error: null,

  register: async (email, password, data, type) => {
    set({ isLoading: true, error: null });
    try {
      const newProfile = await authService.registerWithEmail(email, password, data, type);
      set({ user: auth.currentUser, profile: newProfile });
      set((state) => ({
        allUsers: type === "user" ? [...state.allUsers, newProfile as UserData] : state.allUsers,
        allEmpresas: type === "empresa" ? [...state.allEmpresas, newProfile as EmpresaData] : state.allEmpresas,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      console.error(`Error en el registro de ${type}:`, error);
      throw error; // Propagamos el error para verlo en Register.tsx
    } finally {
      set({ isLoading: false });
    }
  },

  loginWithGoogle: async () => {
    set({ isLoading: true, error: null });
    try {
      const newProfile = await authService.registerOrLoginWithGoogle();
      set({ user: auth.currentUser, profile: newProfile });
      set((state) => ({ allUsers: [...state.allUsers.filter(u => u.uid !== newProfile.uid), newProfile] }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      console.error("Error al iniciar sesión con Google:", error);
      throw error;
    }
  },

  loginWithEmail: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const profile = await authService.loginWithEmail(email, password);
      set({ user: auth.currentUser, profile, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      console.error("Error en el login (store):", error);
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await authService.logout();
      set({ user: null, profile: null });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      console.error("Error al cerrar sesión:", error);
      throw error;
    }
  },

  checkAuth: () => {
    set({ isLoading: true });
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const { users, empresas } = await authService.fetchAllProfiles();
        const profile = users.find(u => u.uid === user.uid) || empresas.find(e => e.uid === user.uid);
        set({ user, profile, allUsers: users, allEmpresas: empresas, isLoading: false });
      } else {
        set({ user: null, profile: null, isLoading: false });
      }
    });
  },

  updateProfile: async (uid, data, type) => {
    set({ isLoading: true, error: null });
    try {
      await authService.updateProfile(uid, data, type);
      set((state) => ({
        profile: state.profile ? { ...state.profile, ...data } : null,
        allUsers: type === "user" ? state.allUsers.map(u => u.uid === uid ? { ...u, ...data } : u) : state.allUsers,
        allEmpresas: type === "empresa" ? state.allEmpresas.map(e => e.uid === uid ? { ...e, ...data } : e) : state.allEmpresas,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      console.error(`Error al actualizar ${type}:`, error);
      throw error;
    }
  },

  deleteProfile: async (uid, type) => {
    set({ isLoading: true, error: null });
    try {
      await authService.deleteProfile(uid, type);
      if (auth.currentUser?.uid === uid) {
        set({ user: null, profile: null });
      }
      set((state) => ({
        allUsers: type === "user" ? state.allUsers.filter(u => u.uid !== uid) : state.allUsers,
        allEmpresas: type === "empresa" ? state.allEmpresas.filter(e => e.uid !== uid) : state.allEmpresas,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      console.error(`Error al eliminar ${type}:`, error);
      throw error;
    }
  },

  fetchAllProfiles: async () => {
    set({ isLoading: true, error: null });
    try {
      const { users, empresas } = await authService.fetchAllProfiles();
      set({ allUsers: users, allEmpresas: empresas });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      console.error("Error al obtener todos los perfiles:", error);
      throw error;
    }
  },
}));