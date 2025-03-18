// src/store/auth/useAuthStore.ts
import { create } from "zustand";
import { auth, googleProvider, db } from "../../config/firebaseConfig";
import {
    signInWithPopup,
    signOut,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    User
} from "firebase/auth";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { UserData, EmpresaData } from "../../types";

interface AuthState {
    user: User | null;
    profile: UserData | EmpresaData | null;
    isLoading: boolean;
    error: string | null;
    register: (email: string, password: string, data: UserData | EmpresaData, type: "user" | "empresa") => Promise<void>;
    loginWithGoogle: () => Promise<void>;
    loginWithEmail: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    profile: null,
    isLoading: false,
    error: null,

    register: async (email, password, data, type) => {
        set({ isLoading: true, error: null });
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const uid = user.uid;

            const collectionName = type === "user" ? "usuarios" : "empresas";
            const ref = doc(collection(db, collectionName), uid);
            await setDoc(ref, { ...data, uid, correo: email, estado: true });

            const profileSnap = await getDoc(ref);
            set({ user, profile: profileSnap.data() as UserData | EmpresaData });
        } catch (error: any) {
            set({ error: error.message });
            console.error(`Error en el registro de ${type}:`, error);
        } finally {
            set({ isLoading: false });
        }
    },

    loginWithGoogle: async () => {
        set({ isLoading: true, error: null });
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            const uid = user.uid;

            const userRef = doc(db, "usuarios", uid);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                const newUser: UserData = {
                    uid,
                    nombre: user.displayName || "Usuario",
                    correo: user.email || "",
                    telefono: "",
                    direccion: "",
                    stack: "develop",
                    plan: "/planes/LaTXuWc7Ad9aSK3JdUts", // Plan por defecto
                    estado: true,
                    rol: "USER",
                    acercade: "",
                    redes: [],
                    username: (user.displayName || "usuario").toLowerCase().replace(" ", "_"),
                };
                await setDoc(userRef, newUser);
                set({ user, profile: newUser });
            } else {
                set({ user, profile: userSnap.data() as UserData });
            }
        } catch (error: any) {
            set({ error: error.message });
            console.error("Error al iniciar sesión con Google:", error);
        } finally {
            set({ isLoading: false });
        }
    },

    loginWithEmail: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const uid = user.uid;

            // Primero buscamos en "usuarios"
            const userRef = doc(db, "usuarios", uid);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                set({ user, profile: userSnap.data() as UserData });
                return;
            }

            // Si no está en "usuarios", buscamos en "empresas"
            const empresaRef = doc(db, "empresas", uid);
            const empresaSnap = await getDoc(empresaRef);

            if (empresaSnap.exists()) {
                set({ user, profile: empresaSnap.data() as EmpresaData });
            } else {
                throw new Error("Usuario o empresa no encontrados en Firestore");
            }
        } catch (error: any) {
            set({ error: error.message });
            console.error("Error en el login:", error);
        } finally {
            set({ isLoading: false });
        }
    },

    logout: async () => {
        set({ isLoading: true, error: null });
        try {
            await signOut(auth);
            set({ user: null, profile: null });
        } catch (error: any) {
            set({ error: error.message });
            console.error("Error al cerrar sesión:", error);
        } finally {
            set({ isLoading: false });
        }
    },

    checkAuth: () => {
        set({ isLoading: true });
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userRef = doc(db, "usuarios", user.uid);
                const empresaRef = doc(db, "empresas", user.uid);

                const [userSnap, empresaSnap] = await Promise.all([getDoc(userRef), getDoc(empresaRef)]);

                if (userSnap.exists()) {
                    set({ user, profile: userSnap.data() as UserData, isLoading: false });
                } else if (empresaSnap.exists()) {
                    set({ user, profile: empresaSnap.data() as EmpresaData, isLoading: false });
                } else {
                    set({ user, profile: null, isLoading: false });
                }
            } else {
                set({ user: null, profile: null, isLoading: false });
            }
        });
    },
}));