import { create } from 'zustand';

const useWaiverStore = create((set, get) => ({
  waivers: [],
  
  setWaivers: async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No auth token found');
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
      set({ waivers: data });
    } catch (error) {
      console.error('Failed to fetch waivers:', error);
      set({ waivers: [] });
      throw error;
    }
  },

  getWaiverById: (id) => {
    return get().waivers.find(waiver => waiver._id === id);
  },

  addWaiver: async (waiverData) => {
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
        body: JSON.stringify(waiverData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const savedWaiver = await response.json();
      set(state => ({
        waivers: [...state.waivers, savedWaiver]
      }));
      return savedWaiver;
    } catch (error) {
      console.error('Failed to add waiver:', error);
      throw error;
    }
  },

  deleteWaiver: async (id) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No auth token found');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/waivers/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      set(state => ({
        waivers: state.waivers.filter(waiver => waiver._id !== id)
      }));
    } catch (error) {
      console.error('Failed to delete waiver:', error);
      throw error;
    }
  }
}));

export default useWaiverStore;
