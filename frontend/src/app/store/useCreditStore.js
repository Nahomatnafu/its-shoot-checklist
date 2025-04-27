import { create } from "zustand";

const useCreditStore = create((set) => ({
  credits: [],
  
  setCredits: async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/credits`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      set({ credits: data });
    } catch (error) {
      console.error('Failed to fetch credits:', error);
    }
  },

  addCredit: async (credit) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/credits`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(credit)
      });
      
      const savedCredit = await response.json();
      set((state) => ({ credits: [...state.credits, savedCredit] }));
      return savedCredit;
    } catch (error) {
      console.error('Failed to save credit:', error);
      throw error;
    }
  },

  updateCreditById: async (id, updatedCredit) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/credits/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updatedCredit)
      });

      const updated = await response.json();
      set((state) => ({
        credits: state.credits.map((c) => (c.id === id ? updated : c))
      }));
    } catch (error) {
      console.error('Failed to update credit:', error);
      throw error;
    }
  },

  deleteCreditById: async (id) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/credits/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      set((state) => ({
        credits: state.credits.filter((c) => c.id !== id)
      }));
    } catch (error) {
      console.error('Failed to delete credit:', error);
      throw error;
    }
  }
}));

export default useCreditStore;
