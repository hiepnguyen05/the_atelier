import api from '../configs/api.config';

export const collectionService = {
  getAll: (params) => api.get('/collections', { params }),
  getBySlug: (slug) => api.get(`/collections/${slug}`),
  create: (data) => api.post('/collections', data),
  update: (id, data) => api.put(`/collections/${id}`, data),
  delete: (id) => api.delete(`/collections/${id}`),
};

export default collectionService;
