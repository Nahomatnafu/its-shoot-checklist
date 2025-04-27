import { create } from "zustand";

const useWaiverStore = create((set) => ({
  waivers: [],
  
  setWaivers: async () => {
    try {
      const token = localStorage.getItem('authToken'); // Changed from 'token' to 'authToken'
      if (!token) {
        console.error('No auth token found');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/waivers`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      set({ waivers: Array.isArray(data) ? data : [] }); // Ensure waivers is always an array
    } catch (error) {
      console.error('Failed to fetch waivers:', error);
      set({ waivers: [] }); // Set empty array on error
    }
  },

  addWaiver: async (waiver) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No auth token found');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/waivers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(waiver)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

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
