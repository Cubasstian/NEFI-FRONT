import { create } from "zustand";
import { db, auth } from "../../config/firebaseConfig";
import { collection, doc, setDoc, getDoc } from "firebase/firestore";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User, fetchSignInMethodsForEmail } from "firebase/auth";
import bcrypt from "bcryptjs";

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

  // ✅ Registro de empresa con email y contraseña
  registerEmpresa: async (email, password, data) => {
    set({ isLoading: true });
    try {
      const methods = await fetchSignInMethodsForEmail(auth, email);
      if (methods.length > 0) {
        throw new Error("El correo ya está registrado.");
      }
      // 🔒 Encriptar la contraseña antes de guardarla en Firestore
      const hashedPassword = bcrypt.hashSync(password, 10);

      // 🆕 Crear la empresa en Firebase Authentication
      const empresaCredential = await createUserWithEmailAndPassword(auth, email, password);
      const empresa = empresaCredential.user;

      // 🔥 Guardar empresa en Firestore
      const empresaRef = doc(collection(db, "empresas"), empresa.uid);
      await setDoc(empresaRef, {
        ...data,
        correo: email,
        password: hashedPassword, // Guardamos la contraseña encriptada
        estado: true,
      });

      set({ empresa });
    } catch (error) {
      console.error("Error en el registro de empresa:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  // ✅ Login de empresa
  loginEmpresa: async (email, password) => {
    set({ isLoading: true });
    try {
      const empresaCredential = await signInWithEmailAndPassword(auth, email, password);
      const empresa = empresaCredential.user;

      // 🔍 Verificar si la empresa existe en Firestore
      const empresaRef = doc(db, "empresas", empresa.uid);
      const empresaSnap = await getDoc(empresaRef);
      if (!empresaSnap.exists()) {
        throw new Error("Empresa no encontrada en la base de datos.");
      }

      set({ empresa });
    } catch (error) {
      console.error("Error en el login de empresa:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  // ✅ Logout de empresa
  logoutEmpresa: async () => {
    try {
      await signOut(auth);
      set({ empresa: null });
    } catch (error) {
      console.error("Error al cerrar sesión de empresa:", error);
    }
  },
}));
