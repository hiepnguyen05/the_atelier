import api from '../configs/api.config';

export const orderService = {
  createOrder: (data) => api.post('/orders', data),
  getOrders: () => api.get('/orders'),
  getOrderById: (id) => api.get(`/orders/${id}`),
  getAllOrdersAdmin: (params) => api.get('/orders/admin', { params }),
  updateOrderStatusAdmin: (id, status) => api.put(`/orders/${id}/status`, { status }),
};

export default orderService;
