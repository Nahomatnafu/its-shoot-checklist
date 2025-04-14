import { create } from "zustand";
import { nanoid } from "nanoid";

const useWaiverStore = create((set) => ({
  waivers: [],
  setWaivers: (waivers) =>
    set(() => {
      const updated = waivers.map((w) => (w.id ? w : { ...w, id: nanoid(6) }));
      localStorage.setItem("savedWaivers", JSON.stringify(updated));
      return { waivers: updated };
    }),

  addWaiver: (waiver) =>
    set((state) => {
      const newWaiver = { ...waiver, id: nanoid(6) };
      const updated = [...state.waivers, newWaiver];
      localStorage.setItem("savedWaivers", JSON.stringify(updated));
      return { waivers: updated };
    }),

  deleteWaiverById: (id) =>
    set((state) => {
      const updated = state.waivers.filter((w) => w.id !== id);
      localStorage.setItem("savedWaivers", JSON.stringify(updated));
      return { waivers: updated };
    }),

  getWaiverById: (id) => {
    const stored = JSON.parse(localStorage.getItem("savedWaivers")) || [];
    return stored.find((w) => w.id === id);
  },
}));

export default useWaiverStore;
