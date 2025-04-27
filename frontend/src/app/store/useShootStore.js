import { create } from "zustand";

const useShootStore = create((set) => ({
  shoots: [],
  setShoots: (shoots) => set({ shoots }),

  addShoot: async (newShoot) => {
    try {
      console.log('Attempting to save shoot:', newShoot);
      
      const token = localStorage.getItem('authToken'); // Changed from 'token' to 'authToken'
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/shoots`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newShoot)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save shoot');
      }
      
      const savedShoot = await response.json();
      set((state) => ({ shoots: [...state.shoots, savedShoot] }));
      return savedShoot.id;
    } catch (error) {
      console.error('Failed to save shoot:', error);
      throw error;
    }
  },

  updateShootById: async (id, updatedShoot) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/shoots/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updatedShoot)
      });

      if (!response.ok) throw new Error('Failed to update shoot');
      
      set((state) => ({
        shoots: state.shoots.map((s) => (s.id === id ? updatedShoot : s))
      }));
    } catch (error) {
      console.error('Failed to update shoot:', error);
      throw error;
    }
  },

  deleteShoot: async (id) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/shoots/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete shoot');
      
      set((state) => ({
        shoots: state.shoots.filter((s) => s.id !== id)
      }));
    } catch (error) {
      console.error('Failed to delete shoot:', error);
      throw error;
    }
  }
}));

export default useShootStore;
