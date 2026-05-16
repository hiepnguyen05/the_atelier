import api from '../configs/api.config';

export const brandService = {
  getAll: () => api.get('/brands'),
  create: (data) => api.post('/brands', data),
};

export default brandService;
