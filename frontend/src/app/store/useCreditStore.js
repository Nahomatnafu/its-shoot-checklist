import { create } from "zustand";

const useCreditStore = create((set) => ({
  credits: [],
  
  setCredits: async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('No auth token found');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/credits`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      set({ credits: Array.isArray(data) ? data : [] });
    } catch (error) {
      console.error('Failed to fetch credits:', error);
      set({ credits: [] });
    }
  },

  addCredit: async (credit) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No auth token found');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/credits`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(credit)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const savedCredit = await response.json();
      set((state) => ({ credits: [...state.credits, savedCredit] }));
      return savedCredit;
    } catch (error) {
      console.error('Failed to save credit:', error);
      throw error;
    }
  },
}));

export default useCreditStore;
