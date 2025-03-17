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

  // ✅ Registro de usuario con email y contraseña
  registerUser: async (email, password, data) => {
    set({ isLoading: true });
    try {
      // 🔒 Encriptar la contraseña antes de guardarla
      const hashedPassword = bcrypt.hashSync(password, 10);
      
      // 🆕 Crear usuario en Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 🔥 Guardar usuario en Firestore
      const userRef = doc(collection(db, "usuarios"), user.uid);
      await setDoc(userRef, {
        ...data,
        correo: email,
        password: hashedPassword, // Guardamos la contraseña encriptada
        estado: true,
      });

      set({ user });
    } catch (error) {
      console.error("Error en el registro:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  // ✅ Inicio de sesión con Google
  loginWithGoogle: async () => {
    set({ isLoading: true });
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // 🔥 Verificar si ya existe en Firestore, si no, guardarlo
      const userRef = doc(collection(db, "usuarios"), user.uid);
      await setDoc(userRef, {
        nombre: user.displayName || "Usuario",
        correo: user.email,
        telefono: "",
        direccion: "",
        rol: "USER",
        stack: "develop",
        habilidades: [],
        redes: [],
        acercade: "",
        estado: true,
        password: "", // No guardamos contraseña con Google
      }, { merge: true });

      set({ user });
    } catch (error) {
      console.error("Error al iniciar sesión con Google", error);
    } finally {
      set({ isLoading: false });
    }
  },

  // ✅ Cerrar sesión
  logout: async () => {
    try {
      await signOut(auth);
      set({ user: null });
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    }
  },

  // ✅ Mantener sesión activa
  checkAuth: () => {
    set({ isLoading: true });
    onAuthStateChanged(auth, (user) => {
      set({ user: user || null, isLoading: false });
    });
  },
}));

// Llamar `useAuthStore.getState().checkAuth();` en la inicialización de la app
