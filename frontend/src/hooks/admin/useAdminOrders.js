import { useState, useEffect, useCallback } from 'react';
import { orderService } from '../../services/orderService';
import { useToast } from '../../contexts/ToastContext';

export const useAdminOrders = () => {
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({
    totalItems: 0,
    totalPages: 1,
    currentPage: 1
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [params, setParams] = useState({
    page: 1,
    limit: 10,
    status: '',
    search: ''
  });

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = { ...params };
      // Xóa các key rỗng để URL gọn hơn
      Object.keys(queryParams).forEach(key => {
        if (queryParams[key] === '') {
          delete queryParams[key];
        }
      });

      const response = await orderService.getAllOrdersAdmin(queryParams);
      
      if (response.data) {
        setOrders(response.data.orders || []);
        setPagination({
          totalItems: response.data.totalItems || 0,
          totalPages: response.data.totalPages || 1,
          currentPage: response.data.currentPage || 1
        });
      }
    } catch (err) {
      console.error('Error fetching admin orders:', err);
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi tải danh sách đơn hàng');
      showToast('Không thể tải danh sách đơn hàng', 'error');
    } finally {
      setLoading(false);
    }
  }, [params, showToast]);

  useEffect(() => {
    // Thêm debounce cho search
    const timer = setTimeout(() => {
      fetchOrders();
    }, 500);

    return () => clearTimeout(timer);
  }, [fetchOrders]);

  const updateStatus = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatusAdmin(orderId, newStatus);
      showToast('Cập nhật trạng thái đơn hàng thành công', 'success');
      // Tải lại danh sách sau khi cập nhật thành công
      await fetchOrders();
      return true;
    } catch (err) {
      console.error('Error updating order status:', err);
      showToast(err.response?.data?.message || 'Không thể cập nhật trạng thái', 'error');
      return false;
    }
  };

  const approveRefund = async (orderId) => {
    try {
      await orderService.approveRefund(orderId);
      showToast('Đã duyệt hoàn tiền thành công', 'success');
      await fetchOrders();
      return true;
    } catch (err) {
      console.error('Error approving refund:', err);
      showToast(err.response?.data?.message || 'Không thể duyệt hoàn tiền', 'error');
      return false;
    }
  };

  return {
    orders,
    pagination,
    loading,
    error,
    params,
    setParams,
    updateStatus,
    approveRefund,
    refreshOrders: fetchOrders
  };
};
