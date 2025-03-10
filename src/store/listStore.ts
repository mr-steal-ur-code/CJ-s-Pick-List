import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { createDoc, findDoc, killDoc, queryList, updateDoc } from "../actions/firebaseClientCalls";
import useUserStore from './userStore';
import { doc } from "firebase/firestore";
import { db } from "../firebase";

type ListStore = {
  lists: List[];
  lastListDoc: any;
  setLists: () => Promise<{ success?: boolean }>;
  updateList: (listId: string, data: List) => Promise<{ success?: boolean }>;
  createList: (data: List) => Promise<{ success: boolean, id: string }>,
  deleteList: (listId: string) => Promise<{ success: boolean }>;
  clearListCache: () => void;
}
const userState = useUserStore.getState();
const currentUserId = userState?.user?.id;

const listState = create<ListStore>()(
  persist((set) => ({
    lists: [],
    lastListDoc: {},
    setLists: async (lastDoc = null) => {
      try {
        const allowedUserIds = ["1E2Jn65K0dUyVkEWQAcPxtrrXQj2", "IQJq6y6Ti9b9514Va20ylcm40XN2"];
        const isAllowedUser = allowedUserIds.includes(currentUserId);
        let where: WhereStatement[] = [];
        let path = `/lists/${currentUserId}`;

        if (isAllowedUser) {
          path = "/lists/shared/lists";
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
        const res = await createDoc("lists", data, currentUserId);
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
    clearListCache: () => set({ lists: [], lastListDoc: null })
  }), {
    name: "pick-list-lists-store",
    storage: createJSONStorage(() => localStorage),
  })
);
export default listState;