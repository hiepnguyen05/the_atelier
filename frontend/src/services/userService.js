import api from '../configs/api.config';

export const userService = {
  getAll: (params) => {
    return api.get('/users', { params });
  },

  toggleStatus: (id, isActive) => {
    return api.put(`/users/${id}/status`, { isActive });
  },

  updateRole: (id, roleId) => {
    return api.put(`/users/${id}/role`, { roleId });
  }
};
