import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartService } from '../services/cartService';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { showToast } = useToast();

  // Fetch cart
  const fetchCart = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!user || !token) {
      setCart(null);
      return;
    }
    try {
      setLoading(true);
      const res = await cartService.getCart();
      setCart(res.data || null);
    } catch (err) {
      if (err.response?.status === 401) {
        // Token is invalid/expired. Quietly reset cart state.
        setCart(null);
      } else {
        console.error('Error fetching cart:', err);
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Sync cart when user logs in or out
  useEffect(() => {
    fetchCart();
  }, [user, fetchCart]);

  // Add item
  const addToCart = async (variantId, quantity = 1) => {
    if (!user) {
      showToast('Vui lòng đăng nhập để mua hàng', 'error');
      return false;
    }
    try {
      setLoading(true);
      const res = await cartService.addItem(variantId, quantity);
      setCart(res.data);
      showToast('Đã thêm sản phẩm vào giỏ hàng', 'success');
      return true;
    } catch (err) {
      console.error('Error adding to cart:', err);
      showToast(err.response?.data?.message || 'Không thể thêm vào giỏ hàng', 'error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update quantity
  const updateQuantity = async (itemId, quantity) => {
    if (quantity < 1) {
      return removeFromCart(itemId);
    }
    try {
      setLoading(true);
      const res = await cartService.updateItem(itemId, quantity);
      setCart(res.data);
      return true;
    } catch (err) {
      console.error('Error updating quantity:', err);
      showToast(err.response?.data?.message || 'Không thể cập nhật số lượng', 'error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Remove item
  const removeFromCart = async (itemId) => {
    try {
      setLoading(true);
      const res = await cartService.removeItem(itemId);
      setCart(res.data);
      showToast('Đã xóa sản phẩm khỏi giỏ hàng', 'success');
      return true;
    } catch (err) {
      console.error('Error removing from cart:', err);
      showToast('Không thể xóa sản phẩm', 'error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Clear cart
  const clearAll = async () => {
    try {
      setLoading(true);
      const res = await cartService.clearCart();
      setCart(res.data);
      showToast('Đã xóa toàn bộ giỏ hàng', 'success');
      return true;
    } catch (err) {
      console.error('Error clearing cart:', err);
      showToast('Không thể làm trống giỏ hàng', 'error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const cartItems = cart?.cartItems || [];
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const value = {
    cart,
    cartItems,
    cartCount,
    loading,
    fetchCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearAll,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
