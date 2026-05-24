import api from '../configs/api.config';

export const cartService = {
  getCart: () => api.get('/cart'),
  addItem: (variantId, quantity) => api.post('/cart/items', { variantId, quantity }),
  updateItem: (itemId, quantity) => api.put(`/cart/items/${itemId}`, { quantity }),
  removeItem: (itemId) => api.delete(`/cart/items/${itemId}`),
  clearCart: () => api.delete('/cart'),
};

export default cartService;
