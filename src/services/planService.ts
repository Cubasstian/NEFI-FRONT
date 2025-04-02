import { db } from "@/config/firebaseConfig";
import { collection, doc, getDocs, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { Plan } from "@/types";

export const planService = {
  // Obtener todos los planes
  fetchPlans: async (): Promise<Plan[]> => {
    try {
      const plansCollection = collection(db, "planes");
      const plansSnapshot = await getDocs(plansCollection);
      const plansList = plansSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Plan[];
      return plansList;
    } catch (error: any) {
      console.error("Error al obtener planes en planService:", error);
      throw new Error(error.message || "Error al obtener los planes");
    }
  },

  // Agregar un nuevo plan
  addPlan: async (plan: Omit<Plan, "id">): Promise<string> => {
    try {
      const newPlanRef = doc(collection(db, "planes"));
      await setDoc(newPlanRef, plan);
      return newPlanRef.id; // Devolvemos el ID generado
    } catch (error: any) {
      console.error("Error al agregar plan en planService:", error);
      throw new Error(error.message || "Error al agregar el plan");
    }
  },

  // Actualizar un plan existente
  updatePlan: async (id: string, plan: Partial<Plan>): Promise<void> => {
    try {
      const planRef = doc(db, "planes", id);
      await updateDoc(planRef, plan);
    } catch (error: any) {
      console.error("Error al actualizar plan en planService:", error);
      throw new Error(error.message || "Error al actualizar el plan");
    }
  },

  // Eliminar un plan
  deletePlan: async (id: string): Promise<void> => {
    try {
      const planRef = doc(db, "planes", id);
      await deleteDoc(planRef);
    } catch (error: any) {
      console.error("Error al eliminar plan en planService:", error);
      throw new Error(error.message || "Error al eliminar el plan");
    }
  },
};