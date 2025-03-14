import { create } from "zustand";
import { db } from "../../config/firebaseConfig";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";

interface Item {
  id?: string;
  title: string;
}

interface CrudState {
  items: Item[];
  fetchItems: () => Promise<void>;
  addItem: (title: string) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
}

export const useCrudStore = create<CrudState>((set) => ({
  items: [],

  fetchItems: async () => {
    const querySnapshot = await getDocs(collection(db, "items"));
    const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Item[];
    set({ items: data });
  },

  addItem: async (title) => {
    const docRef = await addDoc(collection(db, "items"), { title });
    set((state) => ({ items: [...state.items, { id: docRef.id, title }] }));
  },

  deleteItem: async (id) => {
    await deleteDoc(doc(db, "items", id));
    set((state) => ({ items: state.items.filter((item) => item.id !== id) }));
  },
}));
