import React, { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import CustomerTable from '../../components/customer/CustomerTable';
import { useCustomers } from '../../hooks/admin/useCustomers';
import ConfirmModal from '../../components/common/ConfirmModal';

const CustomerList = () => {
  const {
    users,
    pagination,
    loading,
    error,
    params,
    setParams,
    toggleStatus,
    updateRole
  } = useCustomers();

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleSearchChange = (e) => {
    setParams(prev => ({ ...prev, search: e.target.value, page: 1 }));
  };

  const handleToggleClick = (id, currentStatus) => {
    setSelectedUser({ id, currentStatus, actionType: 'status' });
    setIsConfirmOpen(true);
  };

  const handleRoleChangeClick = (id, newRoleId) => {
    setSelectedUser({ id, newRoleId, actionType: 'role' });
    setIsConfirmOpen(true);
  };

  const handleConfirmAction = async () => {
    if (selectedUser) {
      if (selectedUser.actionType === 'status') {
        await toggleStatus(selectedUser.id, selectedUser.currentStatus);
      } else if (selectedUser.actionType === 'role') {
        await updateRole(selectedUser.id, selectedUser.newRoleId);
      }
    }
    setIsConfirmOpen(false);
    setSelectedUser(null);
  };

  return (
    <AdminLayout searchPlaceholder="TÌM KIẾM NGƯỜI DÙNG...">
      {/* Header Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div className="max-w-2xl">
          <nav className="mb-4">
            <span className="font-label text-[10px] uppercase tracking-[0.3em] text-secondary">Hệ thống Quản trị</span>
          </nav>
          <h2 className="font-headline text-5xl text-on-surface tracking-tight mb-4">Khách hàng</h2>
          <p className="font-body text-base text-on-surface-variant/80 max-w-lg leading-relaxed">
            Quản lý thông tin tài khoản và phân quyền truy cập. Kiểm soát hoạt động của người dùng trên toàn hệ thống.
          </p>
        </div>
      </section>

      {/* Search & Filters Section */}
      <section className="mb-8 p-6 bg-surface-container border border-outline-variant/10">
        <div className="flex flex-col md:flex-row gap-6 items-end">
          <div className="flex-[2] w-full">
            <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-2 block">Tìm kiếm người dùng</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
              <input
                type="text"
                value={params.search}
                onChange={handleSearchChange}
                placeholder="Nhập tên hoặc email..."
                className="w-full bg-surface border border-outline-variant/20 py-3 pl-12 pr-4 font-body text-sm focus:outline-none focus:border-secondary transition-colors"
              />
            </div>
          </div>

          <div className="flex-1 w-full">
            <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-2 block">Vai trò</label>
            <select
              value={params.roleId}
              onChange={(e) => setParams(prev => ({ ...prev, roleId: e.target.value, page: 1 }))}
              className="w-full bg-surface border border-outline-variant/20 py-3 px-4 font-body text-sm focus:outline-none focus:border-secondary transition-colors cursor-pointer text-on-surface"
            >
              <option value="">Tất cả vai trò</option>
              <option value="1">Khách hàng</option>
              <option value="30001">Quản trị viên</option>
            </select>
          </div>

          <div className="flex-1 w-full">
            <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-2 block">Trạng thái</label>
            <select
              value={params.isActive}
              onChange={(e) => setParams(prev => ({ ...prev, isActive: e.target.value, page: 1 }))}
              className="w-full bg-surface border border-outline-variant/20 py-3 px-4 font-body text-sm focus:outline-none focus:border-secondary transition-colors cursor-pointer text-on-surface"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="true">Hoạt động</option>
              <option value="false">Đã khóa</option>
            </select>
          </div>
        </div>
      </section>

      {/* Filter & Pagination Info */}
      <div className="flex justify-between items-center mb-8 bg-surface-container-low/30 px-8 py-4 border border-outline-variant/5">
        <div className="flex gap-8">
          <span className="font-label text-[10px] text-on-surface-variant tracking-wider uppercase">
            Kết quả: <span className="text-on-surface font-bold">{pagination.totalItems} người dùng</span>
          </span>
          <span className="font-label text-[10px] text-on-surface-variant tracking-wider uppercase">
            Trang: <span className="text-on-surface font-bold">{pagination.currentPage} / {pagination.totalPages}</span>
          </span>
        </div>
        
        <div className="flex gap-4">
           <button 
             disabled={params.page <= 1}
             onClick={() => setParams(prev => ({ ...prev, page: prev.page - 1 }))}
             className="material-symbols-outlined text-xl text-on-surface-variant disabled:opacity-20 hover:text-primary transition-colors"
           >
             chevron_left
           </button>
           <button 
             disabled={params.page >= pagination.totalPages}
             onClick={() => setParams(prev => ({ ...prev, page: prev.page + 1 }))}
             className="material-symbols-outlined text-xl text-on-surface-variant disabled:opacity-20 hover:text-primary transition-colors"
           >
             chevron_right
           </button>
        </div>
      </div>

      {/* Table */}
      {error && (
        <div className="p-8 mb-8 text-error font-body text-sm bg-error-container/10 border border-error/10">
          {error}
        </div>
      )}

      <CustomerTable 
        users={users} 
        loading={loading} 
        onToggleStatus={handleToggleClick} 
        onUpdateRole={handleRoleChangeClick}
      />

      {/* Confirm Modal */}
      <ConfirmModal 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmAction}
        title={selectedUser?.actionType === 'status'
          ? (selectedUser.currentStatus ? "Xác nhận khóa tài khoản" : "Xác nhận mở khóa tài khoản")
          : "Xác nhận phân quyền người dùng"}
        message={selectedUser?.actionType === 'status'
          ? (selectedUser.currentStatus 
            ? "Người dùng này sẽ không thể đăng nhập vào hệ thống sau khi bị khóa. Bạn có chắc chắn muốn tiếp tục?" 
            : "Tài khoản sẽ được mở khóa và người dùng có thể đăng nhập bình thường. Bạn có chắc chắn muốn tiếp tục?")
          : (selectedUser?.newRoleId === 30001
            ? "Tài khoản này sẽ được nâng cấp lên vai trò Quản trị viên (Admin) và có toàn quyền kiểm soát hệ thống. Bạn có chắc chắn muốn tiếp tục?"
            : "Tài khoản này sẽ bị hạ cấp xuống Khách hàng (User). Bạn có chắc chắn muốn tiếp tục?")}
        confirmText={selectedUser?.actionType === 'status'
          ? (selectedUser.currentStatus ? "Khóa tài khoản" : "Mở khóa")
          : "Phân quyền"}
        type={selectedUser?.actionType === 'status'
          ? (selectedUser.currentStatus ? "danger" : "info")
          : (selectedUser?.newRoleId === 30001 ? "warning" : "info")}
      />
    </AdminLayout>
  );
};

export default CustomerList;
