import { useState, useEffect, useCallback } from 'react';
import { userService } from '../services';
import { useToast } from '../contexts/ToastContext';

export const useCustomers = () => {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ totalItems: 0, totalPages: 0, currentPage: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [params, setParams] = useState({ page: 1, limit: 10, search: '', roleId: '1', isActive: '' });
  const { showToast } = useToast();

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await userService.getAll(params);
      
      const { users, totalItems, totalPages, currentPage } = response.data;
      setUsers(users || []);
      setPagination({ totalItems, totalPages, currentPage });
      setError(null);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Không thể tải danh sách người dùng.');
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const toggleStatus = async (id, currentStatus) => {
    try {
      await userService.toggleStatus(id, !currentStatus);
      showToast(`Tài khoản đã được ${!currentStatus ? 'mở khóa' : 'khóa'} thành công`);
      // Update local state instead of refetching for performance
      setUsers(prev => prev.map(u => u.userId === id ? { ...u, isActive: !currentStatus } : u));
    } catch (err) {
      showToast('Lỗi khi cập nhật trạng thái: ' + (err.response?.data?.message || err.message), 'error');
    }
  };

  const updateRole = async (id, roleId) => {
    try {
      const response = await userService.updateRole(id, roleId);
      showToast('Phân quyền người dùng thành công');
      // Update state with newly returned user object containing the new role
      const updatedUser = response.data.data;
      setUsers(prev => prev.map(u => u.userId === id ? updatedUser : u));
    } catch (err) {
      showToast('Lỗi khi phân quyền: ' + (err.response?.data?.message || err.message), 'error');
    }
  };

  return {
    users,
    pagination,
    loading,
    error,
    params,
    setParams,
    toggleStatus,
    updateRole,
    refresh: fetchUsers
  };
};
