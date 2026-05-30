import { useState, useEffect } from 'react';
import { orderService } from '../../services/orderService';
import { useToast } from '../../contexts/ToastContext';

export const useOrderHistory = () => {
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState('all');
  const [cancellingId, setCancellingId] = useState(null);

  // Cancel modal state
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelTarget, setCancelTarget] = useState(null); // The order being cancelled
  const [cancelForm, setCancelForm] = useState({
    cancelReason: '',
    refundBankName: '',
    refundAccountNumber: '',
    refundAccountName: ''
  });
  const [cancelErrors, setCancelErrors] = useState({});

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

  useEffect(() => {
    fetchOrders();
  }, [showToast]);

  // Check if an order was paid online (payment completed)
  const isOrderPaid = (order) => {
    return (order.paymentMethod === 'MOMO' || order.paymentMethod === 'VNPAY') 
      && order.status === 'processing';
  };

  // Open cancel modal
  const openCancelModal = (order) => {
    setCancelTarget(order);
    setCancelForm({
      cancelReason: '',
      refundBankName: '',
      refundAccountNumber: '',
      refundAccountName: ''
    });
    setCancelErrors({});
    setCancelModalOpen(true);
  };

  // Close cancel modal
  const closeCancelModal = () => {
    setCancelModalOpen(false);
    setCancelTarget(null);
    setCancelForm({
      cancelReason: '',
      refundBankName: '',
      refundAccountNumber: '',
      refundAccountName: ''
    });
    setCancelErrors({});
  };

  // Update cancel form field
  const updateCancelForm = (field, value) => {
    setCancelForm(prev => ({ ...prev, [field]: value }));
    // Clear error on change
    if (cancelErrors[field]) {
      setCancelErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Validate and submit cancel
  const submitCancel = async () => {
    const errors = {};
    if (!cancelForm.cancelReason.trim()) {
      errors.cancelReason = 'Vui lòng nhập lý do hủy đơn';
    }

    const needsRefund = cancelTarget && isOrderPaid(cancelTarget);

    if (needsRefund) {
      if (!cancelForm.refundBankName.trim()) {
        errors.refundBankName = 'Vui lòng nhập tên ngân hàng';
      }
      if (!cancelForm.refundAccountNumber.trim()) {
        errors.refundAccountNumber = 'Vui lòng nhập số tài khoản';
      }
      if (!cancelForm.refundAccountName.trim()) {
        errors.refundAccountName = 'Vui lòng nhập tên chủ tài khoản';
      }
    }

    if (Object.keys(errors).length > 0) {
      setCancelErrors(errors);
      return;
    }

    try {
      setCancellingId(cancelTarget.orderId);
      await orderService.cancelOrder(cancelTarget.orderId, cancelForm);
      showToast(needsRefund ? 'Đã gửi yêu cầu hủy đơn và hoàn tiền' : 'Đã hủy đơn hàng thành công', 'success');
      closeCancelModal();
      await fetchOrders();
    } catch (error) {
      console.error('Error cancelling order:', error);
      showToast(error.response?.data?.message || 'Không thể hủy đơn hàng', 'error');
    } finally {
      setCancellingId(null);
    }
  };

  // Filter orders based on active tab
  const filteredOrders = orders.filter(order => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return order.status === 'pending' || order.status === 'processing';
    if (activeTab === 'shipped') return order.status === 'shipped';
    if (activeTab === 'completed') return order.status === 'completed' || order.status === 'delivered';
    if (activeTab === 'refund_pending') return order.status === 'cancelled' && order.payment?.status === 'refund_pending';
    if (activeTab === 'cancelled') return order.status === 'cancelled' && order.payment?.status !== 'refund_pending';
    return true;
  });

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

  const getStatusText = (order) => {
    if (order.status === 'cancelled' && order.payment?.status === 'refund_pending') {
      return 'Chờ hoàn tiền';
    }
    if (order.status === 'pending') {
      return (order.paymentMethod === 'MOMO' || order.paymentMethod === 'VNPAY') ? 'Chờ thanh toán' : 'Chờ xử lý';
    }
    const statusMap = {
      'processing': 'Đang xử lý',
      'shipped': 'Đang vận chuyển',
      'completed': 'Đã giao hàng',
      'cancelled': 'Đã hủy'
    };
    return statusMap[order.status] || order.status;
  };

  const getStatusColorClass = (order) => {
    if (order.status === 'cancelled' && order.payment?.status === 'refund_pending') {
      return 'text-amber-600 bg-amber-50 border border-amber-200';
    }
    switch (order.status) {
      case 'pending':
        return 'text-amber-600 bg-amber-50';
      case 'processing':
        return 'text-blue-600 bg-blue-50';
      case 'shipped':
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
    filteredOrders,
    activeTab,
    setActiveTab,
    cancellingId,
    loading,
    formatPrice,
    formatDate,
    getProductImage,
    getStatusText,
    getStatusColorClass,
    // Cancel modal
    cancelModalOpen,
    cancelTarget,
    cancelForm,
    cancelErrors,
    isOrderPaid,
    openCancelModal,
    closeCancelModal,
    updateCancelForm,
    submitCancel
  };
};

export default useOrderHistory;
