// src/store/usePlanStore.ts
import { create } from "zustand";

import { collection, doc, getDocs, setDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { Plan } from "@/types";
import { db } from "@/config/firebaseConfig";


interface PlanState {
  plans: Plan[];
  isLoading: boolean;
  error: string | null;
  fetchPlans: () => Promise<void>;
  addPlan: (plan: Omit<Plan, "id">) => Promise<void>;
  updatePlan: (id: string, plan: Partial<Plan>) => Promise<void>;
  deletePlan: (id: string) => Promise<void>;
}

export const usePlanStore = create<PlanState>((set) => ({
  plans: [],
  isLoading: false,
  error: null,

  fetchPlans: async () => {
    set({ isLoading: true, error: null });
    try {
      const plansCollection = collection(db, "planes");
      const plansSnapshot = await getDocs(plansCollection);
      const plansList = plansSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Plan[];
      set({ plans: plansList });
    } catch (error: any) {
      set({ error: error.message });
      console.error("Error al obtener planes:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  addPlan: async (plan) => {
    set({ isLoading: true, error: null });
    try {
      const newPlanRef = doc(collection(db, "planes"));
      await setDoc(newPlanRef, plan);
      set((state) => ({ plans: [...state.plans, { id: newPlanRef.id, ...plan }] }));
    } catch (error: any) {
      set({ error: error.message });
      console.error("Error al agregar plan:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  updatePlan: async (id, plan) => {
    set({ isLoading: true, error: null });
    try {
      const planRef = doc(db, "planes", id);
      await updateDoc(planRef, plan);
      set((state) => ({
        plans: state.plans.map((p) => (p.id === id ? { ...p, ...plan } : p)),
      }));
    } catch (error: any) {
      set({ error: error.message });
      console.error("Error al actualizar plan:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  deletePlan: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const planRef = doc(db, "planes", id);
      await deleteDoc(planRef);
      set((state) => ({ plans: state.plans.filter((p) => p.id !== id) }));
    } catch (error: any) {
      set({ error: error.message });
      console.error("Error al eliminar plan:", error);
    } finally {
      set({ isLoading: false });
    }
  },
}));