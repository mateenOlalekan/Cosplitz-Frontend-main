import { splitApi } from './splitApi';

export const splitService = {
  // Get all available splits
  getSplits: async () => {
    try {
      const response = await splitApi.getAllSplits();
      console.log('All splits response:', response);
      
      // Handle different response formats
      if (Array.isArray(response)) {
        return response;
      } else if (response && Array.isArray(response.data)) {
        return response.data;
      } else if (response && response.data && Array.isArray(response.data.splits)) {
        return response.data.splits;
      }
      return [];
    } catch (error) {
      console.error('Error fetching splits:', error);
      return [];
    }
  },

  // Get user's splits
  getMySplits: async () => {
    try {
      const response = await splitApi.getMySplits();
      console.log('My splits response:', response);
      
      if (Array.isArray(response)) {
        return response;
      } else if (response && Array.isArray(response.data)) {
        return response.data;
      }
      return [];
    } catch (error) {
      console.error('Error fetching my splits:', error);
      return [];
    }
  },

  // Create split with image upload
  createSplit: async (splitData) => {
    try {
      console.log('Creating split with data:', splitData);
      
      const formData = new FormData();
      
      // Convert object to FormData
      Object.keys(splitData).forEach(key => {
        if (key === 'image' && splitData[key] instanceof File) {
          formData.append('image', splitData[key]);
        } else if (splitData[key] !== null && splitData[key] !== undefined) {
          // Handle nested objects
          if (typeof splitData[key] === 'object') {
            formData.append(key, JSON.stringify(splitData[key]));
          } else {
            formData.append(key, splitData[key]);
          }
        }
      });

      console.log('FormData entries:');
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      const response = await splitApi.createSplit(formData);
      console.log('Create split response:', response);
      return response;
    } catch (error) {
      console.error('Error creating split:', error);
      throw error;
    }
  },

  // Update split
  updateSplit: async (id, splitData) => {
    try {
      const formData = new FormData();
      
      Object.keys(splitData).forEach(key => {
        if (key === 'image' && splitData[key] instanceof File) {
          formData.append('image', splitData[key]);
        } else if (splitData[key] !== null && splitData[key] !== undefined) {
          formData.append(key, splitData[key]);
        }
      });

      const response = await splitApi.updateSplit(id, formData);
      return response;
    } catch (error) {
      console.error('Error updating split:', error);
      throw error;
    }
  },

  // Get split details
  getSplitDetails: async (id) => {
    try {
      const response = await splitApi.getSplitDetails(id);
      return response;
    } catch (error) {
      console.error('Error fetching split details:', error);
      throw error;
    }
  },

  // Join split
  joinSplit: async (splitId, userId) => {
    try {
      const response = await splitApi.joinSplit(splitId, userId);
      return response;
    } catch (error) {
      console.error('Error joining split:', error);
      throw error;
    }
  },

  // Get participants
  getSplitParticipants: async (splitId) => {
    try {
      const response = await splitApi.getSplitParticipants(splitId);
      return response;
    } catch (error) {
      console.error('Error fetching participants:', error);
      throw error;
    }
  },
};