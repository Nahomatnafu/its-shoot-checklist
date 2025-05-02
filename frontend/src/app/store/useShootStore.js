import { create } from "zustand";

const useShootStore = create((set, get) => ({
  shoots: [],
  setShoots: (shoots) => {
    console.log("Setting shoots:", shoots);
    set({ shoots });
  },
  getShootById: (id) => {
    const state = get();
    return state.shoots.find((shoot) => shoot._id === id);
  },

  fetchShootById: async (id, signal) => {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/shoots/${id}`;
    const token = localStorage.getItem("authToken");

    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-cache" // Force fresh data
        },
        signal // Pass AbortController signal
      });

      if (!response.ok) throw new Error("Failed to fetch shoot by ID");

      const shoot = await response.json();
      
      // Update store with fetched shoot
      set((state) => {
        // Only add if not already in the array
        const exists = state.shoots.some(s => s._id === shoot._id);
        if (!exists) {
          return { shoots: [...state.shoots, shoot] };
        }
        return state;
      });

      return shoot;
    } catch (error) {
      console.error("Error fetching shoot by ID:", error);
      throw error;
    }
  },

  createShoot: async (shootData) => {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/shoots`;
    const token = localStorage.getItem("authToken");

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(shootData),
      });

      if (!response.ok) throw new Error("Failed to create shoot");

      const newShoot = await response.json();
      set((state) => ({
        shoots: [...state.shoots, newShoot],
      }));

      return newShoot;
    } catch (error) {
      console.error("Error creating shoot:", error);
      throw error;
    }
  },

  updateShootById: async (id, updatedShoot) => {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/shoots/${id}`;
    const token = localStorage.getItem("authToken");

    try {
      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedShoot),
      });

      if (!response.ok) throw new Error("Failed to update shoot");

      const updated = await response.json();
      set((state) => ({
        shoots: state.shoots.map((s) => (s._id === id ? updated : s)),
      }));

      return updated;
    } catch (error) {
      console.error("Error updating shoot:", error);
      throw error;
    }
  },

  deleteShoot: async (id) => {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/shoots/${id}`;
    const token = localStorage.getItem("authToken");

    try {
      const response = await fetch(apiUrl, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete shoot");

      set((state) => ({
        shoots: state.shoots.filter((s) => s._id !== id),
      }));
    } catch (error) {
      console.error("Error deleting shoot:", error);
      throw error;
    }
  },
}));

export default useShootStore;
