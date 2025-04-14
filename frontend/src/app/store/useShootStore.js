import { create } from "zustand";

const useShootStore = create((set) => ({
  shoots: [],
  setShoots: (shoots) => set({ shoots }),

  addShoot: (newShoot) =>
    set((state) => {
      const updated = [...state.shoots, newShoot];
      localStorage.setItem("savedShoots", JSON.stringify(updated));
      return { shoots: updated };
    }),

  updateShootById: (id, updatedShoot) =>
    set((state) => {
      const updated = state.shoots.map((s) => (s.id === id ? updatedShoot : s));
      localStorage.setItem("savedShoots", JSON.stringify(updated));
      return { shoots: updated };
    }),

  deleteShoot: (id) =>
    set((state) => {
      const updated = state.shoots.filter((s) => s.id !== id);
      localStorage.setItem("savedShoots", JSON.stringify(updated));
      return { shoots: updated };
    }),

  getShootById: (id) => {
    const stored = JSON.parse(localStorage.getItem("savedShoots")) || [];
    return stored.find((s) => s.id === id);
  },
}));

export default useShootStore;
