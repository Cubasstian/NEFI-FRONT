import { create } from "zustand";
import { auth, googleProvider, db } from "../../config/firebaseConfig";
import { signInWithPopup, signOut, createUserWithEmailAndPassword, User, onAuthStateChanged } from "firebase/auth";
import { collection, doc, setDoc } from "firebase/firestore";
import bcrypt from "bcryptjs";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  registerUser: (email: string, password: string, data: any) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,

 
  registerUser: async (email, password, data) => {
    set({ isLoading: true });
    try {
   
      const hashedPassword = bcrypt.hashSync(password, 10);
      
    
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

    
      const userRef = doc(collection(db, "usuarios"), user.uid);
      await setDoc(userRef, {
        ...data,
        correo: email,
        password: hashedPassword, 
        estado: true,
      });

      set({ user });
    } catch (error) {
      console.error("Error en el registro:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  
  loginWithGoogle: async () => {
    set({ isLoading: true });
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

     
      const userRef = doc(collection(db, "usuarios"), user.uid);
      await setDoc(userRef, {
        nombre: user.displayName || "Usuario",
        correo: user.email,
        telefono: "",
        direccion: "",
        rol: "USER",
        stack: "",
        habilidades: [],
        redes: [],
        acercade: "",
        estado: true,
        username: "",
        password: "", 
      }, { merge: true });

      set({ user });
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


