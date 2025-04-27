import { create } from "zustand";

const useShootStore = create((set, get) => ({
  shoots: [],
  setShoots: (shoots) => set({ shoots }),

  getShootById: (id) => {
    const { shoots } = get();
    return shoots.find(shoot => shoot._id === id || shoot.id === id);
  },

  createShoot: async (shootData) => {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/shoots`;
    
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(shootData)
      });

      if (!response.ok) {
        throw new Error('Failed to create shoot');
      }

      const newShoot = await response.json();
      set((state) => ({
        shoots: [...state.shoots, newShoot]
      }));
      return newShoot;
    } catch (error) {
      console.error('Error creating shoot:', error);
      throw error;
    }
  },

  updateShootById: async (id, updatedShoot) => {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/shoots/${id}`;
    
    try {
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(updatedShoot)
      });

      if (!response.ok) throw new Error('Failed to update shoot');
      
      const updated = await response.json();
      set((state) => ({
        shoots: state.shoots.map((s) => (s._id === id ? updated : s))
      }));
      return updated;
    } catch (error) {
      console.error('Failed to update shoot:', error);
      throw error;
    }
  },

  deleteShoot: async (id) => {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/shoots/${id}`;
    
    try {
      const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete shoot');
      
      set((state) => ({
        shoots: state.shoots.filter((s) => s._id !== id)
      }));
    } catch (error) {
      console.error('Failed to delete shoot:', error);
      throw error;
    }
  }
}));

export default useShootStore;
