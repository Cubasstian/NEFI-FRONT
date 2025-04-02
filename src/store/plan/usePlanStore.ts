import { create } from "zustand";
import { Plan } from "@/types";
import { planService } from "@/services/planService"; // Ajusta la ruta

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
      const plans = await planService.fetchPlans();
      set({ plans });
    } catch (error: any) {
      set({ error: error.message });
      console.error("Error en usePlanStore.fetchPlans:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  addPlan: async (plan) => {
    set({ isLoading: true, error: null });
    try {
      const newPlanId = await planService.addPlan(plan);
      set((state) => ({ plans: [...state.plans, { id: newPlanId, ...plan }] }));
    } catch (error: any) {
      set({ error: error.message });
      console.error("Error en usePlanStore.addPlan:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  updatePlan: async (id, plan) => {
    set({ isLoading: true, error: null });
    try {
      await planService.updatePlan(id, plan);
      set((state) => ({
        plans: state.plans.map((p) => (p.id === id ? { ...p, ...plan } : p)),
      }));
    } catch (error: any) {
      set({ error: error.message });
      console.error("Error en usePlanStore.updatePlan:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  deletePlan: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await planService.deletePlan(id);
      set((state) => ({ plans: state.plans.filter((p) => p.id !== id) }));
    } catch (error: any) {
      set({ error: error.message });
      console.error("Error en usePlanStore.deletePlan:", error);
    } finally {
      set({ isLoading: false });
    }
  },
}));