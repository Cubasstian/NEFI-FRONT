// src/services/authService.ts
import { auth, googleProvider, db } from "../config/firebaseConfig";
import { 
  signInWithPopup, 
  signOut, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  fetchSignInMethodsForEmail
} from "firebase/auth";
import { collection, doc, getDoc, setDoc, updateDoc, deleteDoc, getDocs } from "firebase/firestore";
import { UserData, EmpresaData } from "../types";

export const authService = {

  registerWithEmail: async (email: string, password: string, data: UserData | EmpresaData, type: "user" | "empresa"): Promise<UserData | EmpresaData> => {
    console.log("Iniciando registro con correo:", email); // Depuración
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const uid = user.uid;
      console.log("Usuario creado en Firebase Auth con UID:", uid); // Depuración

      const collectionName = type === "user" ? "usuarios" : "empresas";
      const ref = doc(collection(db, collectionName), uid);
      await setDoc(ref, { ...data, uid, correo: email, estado: true });
      console.log("Documento creado en Firestore en:", collectionName, "con UID:", uid); // Depuración

      const profileSnap = await getDoc(ref);
      const profileData = profileSnap.data() as UserData | EmpresaData;
      console.log("Perfil registrado:", profileData); // Depuración
      return profileData;
    } catch (error: any) {
      console.error("Error en registerWithEmail:", error); // Depuración
      throw new Error(error.message || "Error al registrar el usuario");
    }
  },

  registerOrLoginWithGoogle: async (): Promise<UserData> => {
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
        plan: "", 
        estado: true,
        rol: "USER",
        acercade: "",
        redes: [],
        username: (user.displayName || "usuario").toLowerCase().replace(" ", "_"),
      };
      await setDoc(userRef, newUser);
      return newUser;
    }
    return userSnap.data() as UserData;
  },

loginWithEmail: async (email: string, password: string): Promise<UserData | EmpresaData> => {
    try {
      console.log("Verificando métodos de inicio para:", email); // Depuración
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      console.log("Métodos de inicio encontrados:", signInMethods); // Depuración

      if (signInMethods.length === 0) {
        throw new Error("Usuario no registrado en Firebase Authentication");
      }
      if (signInMethods.includes("google.com")) {
        throw new Error("Este usuario está registrado con Google. Usa esa opción para iniciar sesión.");
      }

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const uid = user.uid;
      console.log("Usuario autenticado con UID:", uid); // Depuración

      const userRef = doc(db, "usuarios", uid);
      const userSnap = await getDoc(userRef);
      console.log("Documento en 'usuarios' existe:", userSnap.exists()); // Depuración

      if (userSnap.exists()) {
        return userSnap.data() as UserData;
      }

      const empresaRef = doc(db, "empresas", uid);
      const empresaSnap = await getDoc(empresaRef);
      console.log("Documento en 'empresas' existe:", empresaSnap.exists()); // Depuración

      if (empresaSnap.exists()) {
        return empresaSnap.data() as EmpresaData;
      }

      throw new Error("Usuario o empresa no encontrados en Firestore");
    } catch (error: any) {
      console.error("Error en authService.loginWithEmail:", error); // Depuración
      throw new Error(error.message || "Credenciales inválidas");
    }
  },

  logout: async (): Promise<void> => {
    await signOut(auth);
  },

  updateProfile: async (uid: string, data: Partial<UserData | EmpresaData>, type: "user" | "empresa"): Promise<void> => {
    const collectionName = type === "user" ? "usuarios" : "empresas";
    const ref = doc(db, collectionName, uid);
    await updateDoc(ref, data);
  },

  deleteProfile: async (uid: string, type: "user" | "empresa"): Promise<void> => {
    const collectionName = type === "user" ? "usuarios" : "empresas";
    const ref = doc(db, collectionName, uid);
    await deleteDoc(ref);
    if (auth.currentUser?.uid === uid) {
      await signOut(auth);
    }
  },

  fetchAllProfiles: async (): Promise<{ users: UserData[]; empresas: EmpresaData[] }> => {
    const usersCollection = collection(db, "usuarios");
    const empresasCollection = collection(db, "empresas");

    const [usersSnapshot, empresasSnapshot] = await Promise.all([
      getDocs(usersCollection),
      getDocs(empresasCollection),
    ]);

    const usersList = usersSnapshot.docs.map(doc => doc.data() as UserData);
    const empresasList = empresasSnapshot.docs.map(doc => doc.data() as EmpresaData);

    return { users: usersList, empresas: empresasList };
  },
};