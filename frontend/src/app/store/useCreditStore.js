import { create } from "zustand";
import { nanoid } from "nanoid";

const useCreditStore = create((set) => ({
  credits: [],
  setCredits: (credits) => set({ credits }),

  addCredit: (credit) =>
    set((state) => {
      const newCredit = {
        ...credit,
        id: nanoid(6),
        date: new Date().toLocaleDateString(),
      };
      const updated = [...state.credits, newCredit];
      localStorage.setItem("credits", JSON.stringify(updated));
      return { credits: updated };
    }),

  updateCreditById: (id, updatedCredit) =>
    set((state) => {
      const updated = state.credits.map((c) =>
        c.id === id ? { ...updatedCredit } : c
      );
      localStorage.setItem("credits", JSON.stringify(updated));
      return { credits: updated };
    }),

  deleteCreditById: (id) =>
    set((state) => {
      const updated = state.credits.filter((c) => c.id !== id);
      localStorage.setItem("credits", JSON.stringify(updated));
      return { credits: updated };
    }),

  getCreditById: (id) => {
    const stored = JSON.parse(localStorage.getItem("credits")) || [];
    return stored.find((c) => c.id === id);
  },
}));

export default useCreditStore;
