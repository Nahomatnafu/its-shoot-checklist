import { create } from "zustand";

const useWaiverStore = create((set) => ({
  waivers: [],
  
  setWaivers: async () => {
    try {
      const token = localStorage.getItem('authToken');
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
      set({ waivers: Array.isArray(data) ? data : [] });
    } catch (error) {
      console.error('Failed to fetch waivers:', error);
      set({ waivers: [] });
    }
  },

  addWaiver: async (waiverData) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No auth token found');
      }

      // Log the data being sent
      console.log('Sending waiver data:', waiverData);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/waivers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(waiverData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const savedWaiver = await response.json();
      
      // Log the response
      console.log('Received saved waiver:', savedWaiver);

      set((state) => ({
        waivers: [...state.waivers, savedWaiver]
      }));
      return savedWaiver;
    } catch (error) {
      console.error('Failed to save waiver:', error);
      throw error;
    }
  },
}));

export default useWaiverStore;
