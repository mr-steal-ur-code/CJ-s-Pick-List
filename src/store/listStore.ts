import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { createDoc, findDoc, killDoc, queryList, updateDoc } from "../actions/firebaseClientCalls";
import userStore from './userStore';
import { doc } from "firebase/firestore";
import { db } from "../firebase";
import { cleanReferences } from "../utils/cleanReferences";

type ListStore = {
  lists: List[];
  lastListDoc: any;
  setLists: () => Promise<{ success?: boolean }>;
  updateList: (listId: string, data: List) => Promise<{ success?: boolean }>;
  createList: (data: List) => Promise<{ success: boolean, id?: string }>,
  resetList: (listId: string) => Promise<{ success: boolean }>;
  deleteList: (listId: string) => Promise<{ success: boolean }>;
  clearListCache: () => void;
  getPath: () => string;
}

const allowedUserIds = ["1E2Jn65K0dUyVkEWQAcPxtrrXQj2", "IQJq6y6Ti9b9514Va20ylcm40XN2"];

const listState = create<ListStore>()(
  persist((set, get) => ({
    lists: [],
    lastListDoc: {},
    getPath: () => {
      const userState = userStore.getState();
      const currentUserId = userState?.user?.id;
      const isAllowedUser = allowedUserIds.includes(currentUserId);
      return isAllowedUser ? "/lists/shared/lists" : `/lists/${currentUserId}/lists`;
    },
    setLists: async (lastDoc = null) => {
      try {
        const userState = userStore.getState();
        const currentUserId = userState?.user?.id;

        if (!currentUserId) {
          console.error("No user ID available");
          return { success: false };
        }

        const isAllowedUser = allowedUserIds.includes(currentUserId);
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
            lists: lastDoc ? [...state.lists, ...res.response.docs] : res.response.docs,
            lastListDoc: res.response.lastDocumentId
          }));
          return { success: true };
        } else {
          console.error("Failed to fetch Lists from Firebase:", res);
          return { success: false };
        }
      } catch (error) {
        console.error("Error fetching Lists:", error);
        return { success: false };
      }
    },
    updateList: async (listId: string, data: List) => {
      try {
        const cleanedData = cleanReferences(data);
        const path = get().getPath();
        const res = await updateDoc(path, listId, cleanedData);
        if (res.success) {
          const listRes = await findDoc(path, listId);
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
        const userState = userStore.getState();
        const currentUserId = userState?.user?.id;

        if (!currentUserId) {
          console.error("No user ID available");
          return { success: false };
        }

        const path = get().getPath();
        const res = await createDoc(path, data, currentUserId);

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
    resetList: async (listId: string) => {
      try {
        const path = get().getPath();
        const items = get().lists.find(list => list.id === listId)?.items;
        const resetItems = items.map(item => ({ ...item, completed: false }));
        const res = await updateDoc(path, listId, { items: resetItems });
        if (res.success) {
          const listRes = await findDoc(path, listId);
          if (listRes?.doc) {
            set((state) => ({
              lists: state.lists.map((list) =>
                list.id === listId ? listRes.doc : list
              ),
            }));
            return { success: true };
          }
        }
      } catch (error) {
        console.log("Error deleting list", error);
      }
      return { success: false };
    },
    deleteList: async (listId: string) => {
      try {
        const path = get().getPath();
        const res = await killDoc(path, listId);
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
    clearListCache: () => set({ lists: [], lastListDoc: null })
  }), {
    name: "pick-list-lists-store",
    storage: createJSONStorage(() => localStorage),
  })
);
export default listState;