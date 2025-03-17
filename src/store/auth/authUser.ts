import { create } from "zustand";
import { auth, googleProvider, db } from "../../config/firebaseConfig";
import { signInWithPopup, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, User, onAuthStateChanged } from "firebase/auth";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  registerUser: (email: string, password: string, data: any) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,

  // ✅ Registro de usuario
  registerUser: async (email, password, data) => {
    set({ isLoading: true });
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const uid = user.uid; 

      const userRef = doc(collection(db, "usuarios"), uid);
      await setDoc(userRef, { ...data, correo: email, estado: true });

      set({ user });
    } catch (error) {
      console.error("Error en el registro:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  // ✅ Login con Google
  loginWithGoogle: async () => {
    set({ isLoading: true });
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const uid = user.uid;

      const userRef = doc(db, "usuarios", uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          nombre: user.displayName || "Usuario",
          correo: user.email,
          rol: "USER", // Por defecto USER
          estado: true,
        });
      }

      const userData = (await getDoc(userRef)).data();
      console.log("Usuario autenticado con Google:", userData);

      set({ user });
    } catch (error) {
      console.error("Error al iniciar sesión con Google", error);
    } finally {
      set({ isLoading: false });
    }
  },

  // ✅ Login con Email y Contraseña
  loginWithEmail: async (email, password) => {
    set({ isLoading: true });
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const uid = user.uid;

      const userRef = doc(db, "usuarios", uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        throw new Error("Usuario no encontrado en Firestore");
      }

      console.log("Usuario autenticado:", userSnap.data());
      set({ user });

    } catch (error) {
      console.error("Error en el login:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  // ✅ Logout
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
