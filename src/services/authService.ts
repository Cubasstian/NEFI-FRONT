// src/services/authService.ts
import { auth, googleProvider, db } from "../config/firebaseConfig";
import { 
  signInWithPopup, 
  signOut, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
} from "firebase/auth";
import { collection, doc, getDoc, setDoc, updateDoc, deleteDoc, getDocs } from "firebase/firestore";
import { UserData, EmpresaData } from "../types";

export const authService = {

  registerWithEmail: async (email: string, password: string, data: UserData | EmpresaData, type: "user" | "empresa"): Promise<UserData | EmpresaData> => {
   
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const uid = user.uid;
    

      const collectionName = type === "user" ? "usuarios" : "empresas";
      const ref = doc(collection(db, collectionName), uid);
      await setDoc(ref, { ...data, uid, correo: email, estado: true });
     

      const profileSnap = await getDoc(ref);
      const profileData = profileSnap.data() as UserData | EmpresaData;
    
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
      console.log("Intentando login con correo:", email, "y contraseña:", password); // Depuración
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const uid = user.uid;
      console.log("Usuario autenticado con UID:", uid);
  
      const userRef = doc(db, "usuarios", uid);
      const userSnap = await getDoc(userRef);
      console.log("Documento en 'usuarios' existe:", userSnap.exists());
  
      if (userSnap.exists()) {
        return userSnap.data() as UserData;
      }
  
      const empresaRef = doc(db, "empresas", uid);
      const empresaSnap = await getDoc(empresaRef);
      console.log("Documento en 'empresas' existe:", empresaSnap.exists());
  
      if (empresaSnap.exists()) {
        return empresaSnap.data() as EmpresaData;
      }
  
      throw new Error("Usuario o empresa no encontrados en Firestore");
    } catch (error: any) {
      console.error("Error en authService.loginWithEmail:", error);
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