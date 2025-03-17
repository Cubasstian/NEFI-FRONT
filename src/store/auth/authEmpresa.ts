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

 
  registerEmpresa: async (email, password, data) => {
    set({ isLoading: true });
    try {
      const methods = await fetchSignInMethodsForEmail(auth, email);
      if (methods.length > 0) {
        throw new Error("El correo ya está registrado.");
      }
     
      const hashedPassword = bcrypt.hashSync(password, 10);

     
      const empresaCredential = await createUserWithEmailAndPassword(auth, email, password);
      const empresa = empresaCredential.user;

    
      const empresaRef = doc(collection(db, "empresas"), empresa.uid);
      await setDoc(empresaRef, {
        ...data,
        correo: email,
        password: hashedPassword, 
        estado: true,
      });

      set({ empresa });
    } catch (error) {
      console.error("Error en el registro de empresa:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  
  loginEmpresa: async (email, password) => {
    set({ isLoading: true });
    try {
      const empresaCredential = await signInWithEmailAndPassword(auth, email, password);
      const empresa = empresaCredential.user;

     
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

 
  logoutEmpresa: async () => {
    try {
      await signOut(auth);
      set({ empresa: null });
    } catch (error) {
      console.error("Error al cerrar sesión de empresa:", error);
    }
  },
}));
