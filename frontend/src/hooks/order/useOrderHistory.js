import { useState, useEffect } from 'react';
import { orderService } from '../../services/orderService';
import { useToast } from '../../contexts/ToastContext';

export const useOrderHistory = () => {
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await orderService.getOrders();
        setOrders(res.data || []);
      } catch (error) {
        console.error('Error fetching orders history:', error);
        showToast('Không thể tải lịch sử mua hàng', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [showToast]);

  const formatPrice = (price) => {
    if (price === undefined || price === null) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const months = ['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12'];
    return `${date.getDate().toString().padStart(2, '0')} ${months[date.getMonth()]}, ${date.getFullYear()}`;
  };

  const getProductImage = (product, variant) => {
    if (variant?.colorImage) {
      return variant.colorImage;
    }
    if (product?.productImages && product.productImages.length > 0) {
      const primaryImg = product.productImages.find(img => img.isPrimary === true || img.isPrimary === 1 || img.isPrimary === '1');
      if (primaryImg) return primaryImg.imageUrl;
      return product.productImages[0].imageUrl;
    }
    return 'https://via.placeholder.com/600x800?text=THE+ATELIER';
  };

  const getStatusText = (status) => {
    const statusMap = {
      'pending': 'Đang xử lý',
      'confirmed': 'Đã xác nhận',
      'shipping': 'Đang vận chuyển',
      'completed': 'Đã giao hàng',
      'cancelled': 'Đã hủy'
    };
    return statusMap[status] || status;
  };

  const getStatusColorClass = (status) => {
    switch (status) {
      case 'pending':
        return 'text-amber-600 bg-amber-50';
      case 'confirmed':
        return 'text-blue-600 bg-blue-50';
      case 'shipping':
        return 'text-indigo-600 bg-indigo-50';
      case 'completed':
        return 'text-emerald-600 bg-emerald-50';
      case 'cancelled':
        return 'text-rose-600 bg-rose-50';
      default:
        return 'text-neutral-600 bg-neutral-50';
    }
  };

  return {
    orders,
    loading,
    formatPrice,
    formatDate,
    getProductImage,
    getStatusText,
    getStatusColorClass
  };
};

export default useOrderHistory;
