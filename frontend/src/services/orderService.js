import api from '../configs/api.config';

export const orderService = {
  createOrder: (data) => api.post('/orders', data),
  getOrders: () => api.get('/orders'),
  getOrderById: (id) => api.get(`/orders/${id}`),
  getAllOrdersAdmin: (params) => api.get('/orders/admin', { params }),
  updateOrderStatusAdmin: (id, status) => api.put(`/orders/${id}/status`, { status }),
  // Verify MoMo payment — sends return URL params to backend for verification & order confirmation
  verifyMoMoPayment: (params) => api.post('/payments/momo-verify', params),
  // Verify VNPay payment — sends return URL params to backend for verification & order confirmation
  verifyVNPayPayment: (params) => api.post('/payments/vnpay-verify', params),
  // Cancel user order (with optional refund info)
  cancelOrder: (id, data) => api.put(`/orders/${id}/cancel`, data),
  // Admin: approve refund
  approveRefund: (id) => api.put(`/orders/${id}/approve-refund`),
};

export default orderService;
