import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { createDoc, findDoc, killDoc, queryList, updateDoc } from "../actions/firebaseClientCalls";
import userStore from './userStore';
import { doc } from "firebase/firestore";
import { db } from "../firebase";

type ItemStore = {
  items: ListItem[];
  lastItemDoc: any;
  setItems: () => Promise<{ success?: boolean }>;
  updateItem: (itemId: string, data: ListItem) => Promise<{ success?: boolean }>;
  createItem: (data: ListItem) => Promise<{ success: boolean }>,
  deleteItem: (itemId: string) => Promise<{ success: boolean }>;
  clearItemCache: () => void;
  getPath: () => string;
}
const userState = userStore.getState();
const currentUserId = userState?.user?.id;
const allowedUserIds = ["1E2Jn65K0dUyVkEWQAcPxtrrXQj2", "IQJq6y6Ti9b9514Va20ylcm40XN2"];
const isAllowedUser = allowedUserIds.includes(currentUserId);

const itemState = create<ItemStore>()(
  persist((set, get) => ({
    items: [],
    lastItemDoc: {},
    getPath: () => {
      return isAllowedUser ? "/items/shared/items" : `/items/${currentUserId}/items`;
    },
    setItems: async (lastDoc = null) => {
      try {
        const path = get().getPath();
        let where: WhereStatement[] = [];

        if (isAllowedUser) {
          const userRefs = allowedUserIds.map(userId => doc(db, "users", userId));
          where = [
            {
              key: "createdBy",
              conditional: "in",
              value: userRefs
            }
          ];
        } else {
          where = [
            {
              key: "createdBy",
              conditional: "==",
              value: doc(db, "users", currentUserId)
            }
          ];
        }
        const order: OrderByCriteria[] = [
          { field: "createdAt", direction: "desc" }
        ];

        const res = await queryList(path, where, order, null, lastDoc);

        if (res.success && res.response) {
          set((state) => ({
            items: lastDoc ? [...state.items, ...res.response.docs] : res.response.docs,
            lastItemDoc: res.response.lastDocumentId
          }));
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
    updateItem: async (itemId: string, data: ListItem) => {
      try {
        const path = get().getPath();
        const res = await updateDoc(path, itemId, data);
        if (res.success) {
          const itemRes = await findDoc(path, itemId);
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
        const path = get().getPath();
        const res = await createDoc(path, data, currentUserId);
        if (res?.success && res?.doc?.id) {
          const newItem = res?.doc;
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
        const path = get().getPath();
        const res = await killDoc(path, itemId);
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
    clearItemCache: () => set({ items: [], lastItemDoc: null })
  }), {
    name: "pick-list-items-store",
    storage: createJSONStorage(() => localStorage),
  })
);
export default itemState;