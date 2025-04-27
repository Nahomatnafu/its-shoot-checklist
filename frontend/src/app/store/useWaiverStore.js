import { create } from "zustand";

const useWaiverStore = create((set) => ({
  waivers: [],
  
  setWaivers: async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/waivers`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      set({ waivers: data });
    } catch (error) {
      console.error('Failed to fetch waivers:', error);
    }
  },

  addWaiver: async (waiver) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/waivers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(waiver)
      });
      
      const savedWaiver = await response.json();
      set((state) => ({ waivers: [...state.waivers, savedWaiver] }));
      return savedWaiver;
    } catch (error) {
      console.error('Failed to save waiver:', error);
      throw error;
    }
  },

  deleteWaiverById: async (id) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/waivers/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      set((state) => ({
        waivers: state.waivers.filter((w) => w.id !== id)
      }));
    } catch (error) {
      console.error('Failed to delete waiver:', error);
      throw error;
    }
  },

  getWaiverById: (id) => {
    const state = useWaiverStore.getState();
    return state.waivers.find((w) => w.id === id);
  }
}));

export default useWaiverStore;
