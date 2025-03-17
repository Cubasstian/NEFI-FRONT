import { create } from "zustand";
import { db, auth } from "../../config/firebaseConfig";
import { collection, doc, setDoc, getDoc } from "firebase/firestore";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User } from "firebase/auth";

interface EmpresaState {
  empresa: User | null;
  isLoading: boolean;
  registerEmpresa: (email: string, password: string, data: any) => Promise<void>;
  loginEmpresa: (email: string, password: string) => Promise<void>;
  logoutEmpresa: () => Promise<void>;
}

export const useEmpresaStore = create<EmpresaState>((set) => ({
  empresa: null,
  isLoading: false,

  // ✅ Registro de Empresa
  registerEmpresa: async (email, password, data) => {
    set({ isLoading: true });
    try {
      const empresaCredential = await createUserWithEmailAndPassword(auth, email, password);
      const empresa = empresaCredential.user;
      const uid = empresa.uid;

      const empresaRef = doc(collection(db, "empresas"), uid);
      await setDoc(empresaRef, { ...data, correo: email, estado: true });

      set({ empresa });
    } catch (error) {
      console.error("Error en el registro de empresa:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  // ✅ Login de Empresa
  loginEmpresa: async (email, password) => {
    set({ isLoading: true });
    try {
      const empresaCredential = await signInWithEmailAndPassword(auth, email, password);
      const empresa = empresaCredential.user;
      const uid = empresa.uid;

      const empresaRef = doc(db, "empresas", uid);
      const empresaSnap = await getDoc(empresaRef);

      if (!empresaSnap.exists()) {
        throw new Error("Empresa no encontrada en Firestore");
      }

      console.log("Empresa autenticada:", empresaSnap.data());
      set({ empresa });

    } catch (error) {
      console.error("Error en el login de empresa:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  // ✅ Logout
  logoutEmpresa: async () => {
    try {
      await signOut(auth);
      set({ empresa: null });
    } catch (error) {
      console.error("Error al cerrar sesión de empresa:", error);
    }
  },
}));
