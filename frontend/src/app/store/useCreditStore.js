import { create } from "zustand";

const useCreditStore = create((set, get) => ({
  credits: [],
  
  setCredits: async (signal) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No auth token found');
      }

      const options = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      // Only add signal if it's a valid AbortSignal
      if (signal instanceof AbortSignal) {
        options.signal = signal;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/credits`, options);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      // Ensure each credit has both _id and id properties
      const processedData = Array.isArray(data) ? data.map(credit => ({
        ...credit,
        id: credit._id || credit.id // Ensure we have both id formats
      })) : [];
      
      set({ credits: processedData });
    } catch (error) {
      console.error('Failed to fetch credits:', error);
      // Don't reset credits to empty array on error
      if (error.name !== 'AbortError') {
        throw error;
      }
    }
  },

  getCreditById: (id) => {
    const state = get();
    return state.credits.find(credit => credit._id === id || credit.id === id);
  },

  addCredit: async (creditData) => {
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
        body: JSON.stringify(creditData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const savedCredit = await response.json();
      set(state => ({
        credits: [...state.credits, savedCredit]
      }));

      return savedCredit;
    } catch (error) {
      console.error('Failed to add credit:', error);
      throw error;
    }
  },

  updateCreditById: async (id, creditData) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No auth token found');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/credits/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(creditData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedCredit = await response.json();
      set((state) => ({
        credits: state.credits.map(credit => 
          credit._id === id ? updatedCredit : credit
        )
      }));
      return updatedCredit;
    } catch (error) {
      console.error('Failed to update credit:', error);
      throw error;
    }
  },

  deleteCreditById: async (id) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No auth token found');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/credits/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      set((state) => ({
        credits: state.credits.filter(credit => credit._id !== id)
      }));
    } catch (error) {
      console.error('Failed to delete credit:', error);
      throw error;
    }
  }
}));

export default useCreditStore;
