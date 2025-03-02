import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { findDoc, updateDoc } from "../actions/firebaseClientCalls";

type UserStore = {
  user: User;
  setUser: (data: any) => { success?: boolean };
  saveUser: (userId: string, data: User) => { success?: boolean };
  clearCache: () => void;
}

const userState = create<UserStore>()(
  persist((set, get) => ({
    user: get()?.user || undefined,
    setUser: async (data: User) => {
      if (data) {
        set({ user: data });
        return { success: true };
      } else {
        console.error("Failed to set user on store:");
        return { success: false }
      }
    },
    saveUser: async (userId: string, data: User) => {
      const res = await updateDoc("users", userId, data);
      if (res.success) {
        const userRes = await findDoc("users", userId);
        if (userRes?.doc) {
          set({ user: userRes?.doc });
          return { success: true };
        }
      } else {
        console.error("Failed to update user on Firebase:", res.response);
        return { success: false }
      }
    },
    clearCache: async () => set({ user: {} })
  }), {
    name: "pick-list-store",
    storage: createJSONStorage(() => localStorage),
  })
);
export default userState;