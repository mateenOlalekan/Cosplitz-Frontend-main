import api from "./api";

export const splitService = {
  // GET all splits
  getSplits: async () => {
    const res = await api.get("/splits/");
    return res.data.data;
  },

  // GET my splits
  getMySplits: async () => {
    const res = await api.get("/splits/my_splits/");
    return res.data.data;
  },

  // CREATE split
  createSplit: async (payload) => {
    const res = await api.post("/splits/", payload);
    return res.data.data;
  },

  // UPDATE split
  updateSplit: async (id, payload) => {
    const res = await api.patch(`/splits/${id}/`, payload);
    return res.data;
  },

  // JOIN split
  joinSplit: async (id) => {
    const res = await api.post(`/splits/${id}/join_splits/`);
    return res.data;
  },
};
