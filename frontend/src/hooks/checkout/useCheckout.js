import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useToast } from '../../contexts/ToastContext';
import { useAuth } from '../../contexts/AuthContext';
import { orderService } from '../../services/orderService';

export const useCheckout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems, fetchCart } = useCart();
  const { showToast } = useToast();
  const { user } = useAuth();

  const selectedItemIds = location.state?.selectedItemIds || [];

  const [checkoutItems, setCheckoutItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    recipientName: user?.fullName || '',
    phoneNumber: user?.phone || '',
    email: user?.email || '',
    addressLine: '',
    city: '',
    paymentMethod: 'COD'
  });

  useEffect(() => {
    if (selectedItemIds.length === 0) {
      navigate('/cart');
      return;
    }
    const items = cartItems.filter(item => selectedItemIds.includes(item.cartItemId));
    if (items.length === 0 && cartItems.length > 0) {
      navigate('/cart');
    }
    setCheckoutItems(items);
  }, [selectedItemIds, cartItems, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePaymentChange = (method) => {
    setFormData(prev => ({ ...prev, paymentMethod: method }));
  };

  const subtotal = checkoutItems.reduce((sum, item) => {
    const base = Number(item.variant?.product?.basePrice || 0);
    const adjustment = Number(item.variant?.priceAdjustment || 0);
    return sum + (base + adjustment) * item.quantity;
  }, 0);

  const formatPrice = (price) => {
    if (price === undefined || price === null) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleSubmit = async () => {
    if (!formData.recipientName || !formData.phoneNumber || !formData.addressLine || !formData.city) {
      showToast('Vui lòng điền đầy đủ thông tin giao hàng', 'error');
      return;
    }

    try {
      setLoading(true);
      const itemsPayload = checkoutItems.map(item => ({
        variantId: item.variantId,
        quantity: item.quantity
      }));

      const payload = {
        items: itemsPayload,
        shippingAddress: {
          recipientName: formData.recipientName,
          phoneNumber: formData.phoneNumber,
          addressLine: formData.addressLine,
          city: formData.city
        },
        paymentMethod: formData.paymentMethod
      };

      const res = await orderService.createOrder(payload);
      if (fetchCart) {
        await fetchCart();
      }
      navigate('/checkout/success', { state: { order: res.data.order } });
    } catch (error) {
      console.error(error);
      showToast('Đã có lỗi xảy ra. Vui lòng thử lại.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return {
    checkoutItems,
    formData,
    handleInputChange,
    handlePaymentChange,
    handleSubmit,
    loading,
    subtotal,
    formatPrice
  };
};

export default useCheckout;
