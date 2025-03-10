import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { createDoc, findDoc, killDoc, listDocs, updateDoc } from "../actions/firebaseClientCalls";
import useUserStore from './userStore';

type ListStore = {
  lists: List[];
  setLists: () => Promise<{ success?: boolean }>;
  updateList: (listId: string, data: List) => Promise<{ success?: boolean }>;
  createList: (data: List) => Promise<{ success: boolean, id: string }>,
  deleteList: (listId: string) => Promise<{ success: boolean }>;
  clearListCache: () => void;
}

const listState = create<ListStore>()(
  persist((set) => ({
    lists: [],
    setLists: async () => {
      try {
        const res = await listDocs("lists");
        if (res.success && res.response) {
          set({ lists: res.response });
          return { success: true };
        } else {
          console.error("Failed to fetch lists from Firebase:", res);
          return { success: false };
        }
      } catch (error) {
        console.error("Error fetching lists:", error);
        return { success: false };
      }
    },
    updateList: async (listId: string, data: List) => {
      try {
        const res = await updateDoc("lists", listId, data);
        if (res.success) {
          const listRes = await findDoc("lists", listId);
          if (listRes?.doc) {
            set((state) => ({
              lists: state.lists.map((list) =>
                list.id === listId ? listRes.doc : list
              ),
            }));
            return { success: true };
          }
        }
        console.error("Failed to update list on Firebase:", res);
        return { success: false };
      } catch (error) {
        console.error("Error updating list:", error);
        return { success: false };
      }
    },
    createList: async (data: List) => {
      try {
        const userState = useUserStore.getState();
        const res = await createDoc("lists", data, userState?.user?.id);
        if (res?.success && res?.doc?.id) {
          const newList = res?.doc;
          set((state) => ({ lists: [...state.lists, newList] }));
          return { success: true, id: res?.doc?.id };
        }
      } catch (error) {
        console.log("error adding List", error);
      }
      return { success: false, id: "" }
    },
    deleteList: async (listId: string) => {
      try {
        const res = await killDoc("lists", listId);
        if (res.success) {
          set((state) => ({
            lists: state.lists.filter((list) => list.id !== listId),
          }));
          return { success: true };
        }
      } catch (error) {
        console.log("Error deleting list", error);
      }
      return { success: false };
    },
    clearListCache: () => set({ lists: [] })
  }), {
    name: "pick-list-lists-store",
    storage: createJSONStorage(() => localStorage),
  })
);
export default listState;