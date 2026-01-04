import api from "./splitApi";

export const splitService = {
  getSplits: async () => {
    const res = await api.get('/splits/');
    return res.data.data;
  },

  getMySplits: async () => {
    const res = await api.get('/splits/my_splits/');
    return res.data.data;
  },

  createSplit: async (payload) => {
    const res = await api.post('/splits/', payload);
    return res.data.data;
  },

  updateSplit: async (id, payload) => {
    const res = await api.patch(`/splits/${id}/`, payload);
    return res.data.data;
  },

  joinSplit: async (id) => {
    const res = await api.post(`/splits/${id}/join_splits/`);
    return res.data;
  },
};
