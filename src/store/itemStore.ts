import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { createDoc, findDoc, killDoc, listDocs, updateDoc } from "../actions/firebaseClientCalls";

type ItemStore = {
  items: ListItem[];
  setItems: () => Promise<{ success?: boolean }>;
  saveItem: (itemId: string, data: ListItem) => Promise<{ success?: boolean }>;
  createItem: (data: ListItem) => Promise<{ success: boolean }>,
  deleteItem: (itemId: string) => Promise<{ success: boolean }>;
  clearItemCache: () => void;
}

const itemState = create<ItemStore>()(
  persist((set) => ({
    items: [],
    setItems: async () => {
      try {
        const res = await listDocs("items");
        if (res.success && res.response) {
          set({ items: res.response.docs });
          return { success: true };
        } else {
          console.error("Failed to fetch items from Firebase:", res);
          return { success: false };
        }
      } catch (error) {
        console.error("Error fetching items:", error);
        return { success: false };
      }
    },
    saveItem: async (itemId: string, data: ListItem) => {
      try {
        const res = await updateDoc("items", itemId, data);
        if (res.success) {
          const itemRes = await findDoc("items", itemId);
          if (itemRes?.doc) {
            set((state) => ({
              items: state.items.map((item) =>
                item.id === itemId ? itemRes.doc : item
              ),
            }));
            return { success: true };
          }
        }
        console.error("Failed to update item on Firebase:", res);
        return { success: false };
      } catch (error) {
        console.error("Error updating item:", error);
        return { success: false };
      }
    },
    createItem: async (data: ListItem) => {
      try {
        const doc = await createDoc("items", data);
        if (doc?.success && doc?.response?.id) {
          const newItem = { ...doc?.response, id: doc.response?.id };
          set((state) => ({ items: [...state.items, newItem] }));
          return { success: true };
        }
      } catch (error) {
        console.log("error adding Item", error);
      }
      return { success: false }
    },
    deleteItem: async (itemId: string) => {
      try {
        const res = await killDoc("items", itemId);
        if (res.success) {
          set((state) => ({
            items: state.items.filter((item) => item.id !== itemId),
          }));
          return { success: true };
        }
      } catch (error) {
        console.log("Error deleting item", error);
      }
      return { success: false };
    },
    clearItemCache: () => set({ items: [] })
  }), {
    name: "pick-list-items-store",
    storage: createJSONStorage(() => localStorage),
  })
);
export default itemState;