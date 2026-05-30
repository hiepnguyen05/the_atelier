import React, { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import OrderTable from '../../components/admin/order/OrderTable';
import { useAdminOrders } from '../../hooks/admin/useAdminOrders';

// Helper function to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

// Helper function to get correct product variant image
const getProductImage = (product, variant) => {
  if (variant?.colorImage) {
    return variant.colorImage;
  }
  if (product?.productImages && product.productImages.length > 0) {
    const primaryImg = product.productImages.find(img => img.isPrimary === true || img.isPrimary === 1 || img.isPrimary === '1');
    if (primaryImg) return primaryImg.imageUrl;
    return product.productImages[0].imageUrl;
  }
  return 'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22600%22%20height%3D%22800%22%20viewBox%3D%220%200%20600%20800%22%3E%3Crect%20fill%3D%22%23f3f4f6%22%20width%3D%22600%22%20height%3D%22800%22%2F%3E%3Ctext%20fill%3D%22%239ca3af%22%20font-family%3D%22sans-serif%22%20font-size%3D%2230%22%20dy%3D%2210.5%22%20font-weight%3D%22bold%22%20x%3D%2250%25%22%20y%3D%2250%25%22%20text-anchor%3D%22middle%22%3ENO%20IMAGE%3C%2Ftext%3E%3C%2Fsvg%3E';
};

const STATUS_TABS = [
  { value: '', label: 'Tất cả đơn hàng' },
  { value: 'pending', label: 'Chờ xử lý' },
  { value: 'processing', label: 'Đã xác nhận' },
  { value: 'shipped', label: 'Đang giao' },
  { value: 'completed', label: 'Hoàn thành' },
  { value: 'cancelled', label: 'Đã hủy' },
  { value: 'refund_pending', label: 'Chờ hoàn tiền' }
];

const OrderList = () => {
  const {
    orders,
    pagination,
    loading,
    error,
    params,
    setParams,
    updateStatus,
    approveRefund,
    counts = { pending: 0, refund_pending: 0 },
    refreshOrders
  } = useAdminOrders();

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  const handleSearchChange = (e) => {
    setParams(prev => ({ ...prev, search: e.target.value, page: 1 }));
  };

  const handleTabClick = (statusValue) => {
    setParams(prev => ({ ...prev, status: statusValue, page: 1 }));
  };

  const handleUpdateClick = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setIsUpdateModalOpen(true);
  };

  const handleViewClick = (order) => {
    setSelectedOrder(order);
    setIsViewModalOpen(true);

    // Mark order as viewed
    try {
      const viewedIds = JSON.parse(localStorage.getItem('admin_viewed_order_ids') || '[]');
      if (!viewedIds.includes(order.orderId)) {
        viewedIds.push(order.orderId);
        // Limit storage to the most recent 1000 items
        if (viewedIds.length > 1000) {
          viewedIds.shift();
        }
        localStorage.setItem('admin_viewed_order_ids', JSON.stringify(viewedIds));
        
        // Trigger background recount immediately
        if (refreshOrders) {
          refreshOrders();
        }
      }
    } catch (err) {
      console.error('Error marking order as viewed:', err);
    }
  };

  const handleConfirmUpdate = async () => {
    if (selectedOrder && newStatus !== selectedOrder.status) {
      await updateStatus(selectedOrder.orderId, newStatus);
    }
    setIsUpdateModalOpen(false);
    setSelectedOrder(null);
  };

  const closeModals = () => {
    setIsUpdateModalOpen(false);
    setIsViewModalOpen(false);
    setSelectedOrder(null);
  };

  return (
    <AdminLayout searchPlaceholder="TÌM KIẾM ĐƠN HÀNG...">
      {/* Header Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div className="max-w-2xl">
          <nav className="mb-4">
            <span className="font-label text-[10px] uppercase tracking-[0.3em] text-secondary">Hệ thống Quản trị</span>
          </nav>
          <h2 className="font-headline text-5xl text-on-surface tracking-tight mb-4">Đơn hàng</h2>
          <p className="font-body text-base text-on-surface-variant/80 max-w-lg leading-relaxed">
            Quản lý và theo dõi toàn bộ tiến trình đơn hàng của The Atelier. Cập nhật trạng thái giao hàng nhanh chóng.
          </p>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="mb-8 border-b border-outline-variant/20 overflow-x-auto hide-scrollbar">
        <div className="flex gap-8 min-w-max px-2">
          {STATUS_TABS.map((tab) => {
            const isActive = params.status === tab.value;
            
            // Determine if there is a count for this status tab
            let countValue = 0;
            if (tab.value === 'pending') {
              countValue = counts.pending;
            } else if (tab.value === 'refund_pending') {
              countValue = counts.refund_pending;
            }

            return (
              <button
                key={tab.value}
                onClick={() => handleTabClick(tab.value)}
                className={`pb-4 font-label text-[11px] uppercase tracking-[0.2em] transition-all relative flex items-center gap-2 cursor-pointer ${
                  isActive 
                    ? 'text-primary font-bold' 
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span>{tab.label}</span>
                {countValue > 0 && (
                  <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full transition-colors flex items-center justify-center min-w-[18px] h-[18px] ${
                    tab.value === 'refund_pending'
                      ? 'bg-amber-500 text-white'
                      : 'bg-primary text-on-primary'
                  }`}>
                    {countValue}
                  </span>
                )}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Search Section */}
      <section className="mb-8 p-6 bg-surface-container border border-outline-variant/10">
        <div className="flex flex-col md:flex-row gap-6 items-end">
          <div className="flex-[2] w-full">
            <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-2 block">Tìm kiếm đơn hàng</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
              <input
                type="text"
                value={params.search}
                onChange={handleSearchChange}
                placeholder="Nhập mã đơn hàng, email, tên KH..."
                className="w-full bg-surface border border-outline-variant/20 py-3 pl-12 pr-4 font-body text-sm focus:outline-none focus:border-secondary transition-colors"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Filter & Pagination Info */}
      <div className="flex justify-between items-center mb-8 bg-surface-container-low/30 px-8 py-4 border border-outline-variant/5">
        <div className="flex gap-8">
          <span className="font-label text-[10px] text-on-surface-variant tracking-wider uppercase">
            Kết quả: <span className="text-on-surface font-bold">{pagination.totalItems} đơn hàng</span>
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

      {/* Table Section */}
      {error && (
        <div className="p-8 mb-8 text-error font-body text-sm bg-error-container/10 border border-error/10">
          {error}
        </div>
      )}

      <OrderTable 
        orders={orders} 
        loading={loading} 
        onUpdateClick={handleUpdateClick} 
        onViewClick={handleViewClick}
      />

      {/* Custom Update Status Modal */}
      {isUpdateModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-on-background/40 backdrop-blur-sm" onClick={closeModals}></div>
          
          <div className="relative bg-surface p-10 max-w-md w-full shadow-2xl border border-outline-variant/10">
            <h3 className="font-headline text-2xl text-on-surface mb-2">Cập Nhật Đơn Hàng</h3>
            <p className="font-body text-sm text-on-surface-variant mb-6">
              Mã đơn: <strong className="text-on-surface">{selectedOrder.orderCode}</strong>
            </p>

            <div className="mb-8">
              <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-3 block">
                Trạng thái mới
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full bg-surface border border-outline-variant/30 py-3 px-4 font-body text-sm focus:outline-none focus:border-secondary transition-colors cursor-pointer text-on-surface"
              >
                <option value="pending">Chờ xử lý</option>
                <option value="processing">Đã xác nhận</option>
                <option value="shipped">Đang giao</option>
                <option value="completed">Hoàn thành</option>
                <option value="cancelled">Đã hủy</option>
              </select>
            </div>

            <div className="flex gap-4 justify-end">
              <button 
                onClick={closeModals}
                className="font-label text-[10px] uppercase tracking-widest px-6 py-3 border border-outline-variant/30 text-on-surface hover:bg-surface-container transition-colors"
              >
                Hủy bỏ
              </button>
              <button 
                onClick={handleConfirmUpdate}
                disabled={newStatus === selectedOrder.status}
                className="font-label text-[10px] uppercase tracking-widest px-6 py-3 bg-secondary text-on-secondary hover:bg-secondary-fixed transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Xác nhận lưu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {isViewModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center md:p-4 p-0">
          <div className="absolute inset-0 bg-on-background/40 backdrop-blur-sm" onClick={closeModals}></div>
          
          <div className="relative bg-surface w-full max-w-4xl h-full md:h-auto max-h-[100vh] md:max-h-[90vh] overflow-y-auto shadow-2xl border border-outline-variant/10">
            {/* Modal Header */}
            <div className="sticky top-0 bg-surface z-10 px-6 md:px-10 py-4 md:py-6 border-b border-outline-variant/10 flex justify-between items-center">
              <div>
                <h3 className="font-headline text-2xl md:text-3xl text-on-surface tracking-tight mb-1">Chi Tiết Đơn Hàng</h3>
                <p className="font-body text-xs md:text-sm text-on-surface-variant">Mã Đơn: {selectedOrder.orderCode}</p>
              </div>
              <button onClick={closeModals} className="material-symbols-outlined text-2xl text-on-surface-variant hover:text-error transition-colors">
                close
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 md:p-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
                {/* Left Column: Customer & Shipping */}
                <div className="space-y-8 md:space-y-10">
                  <section>
                    <h4 className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-4 pb-2 border-b border-outline-variant/10">
                      Thông Tin Khách Hàng
                    </h4>
                    <div className="space-y-3 font-body text-sm text-on-surface">
                      <p><span className="text-on-surface-variant mr-2">Họ Tên:</span> <strong>{selectedOrder.user?.fullName || 'Khách vãng lai'}</strong></p>
                      <p><span className="text-on-surface-variant mr-2">Email:</span> {selectedOrder.user?.email || 'N/A'}</p>
                      <p><span className="text-on-surface-variant mr-2">Số điện thoại:</span> {selectedOrder.user?.phone || 'N/A'}</p>
                    </div>
                  </section>

                  <section>
                    <h4 className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-4 pb-2 border-b border-outline-variant/10">
                      Giao Hàng & Thanh Toán
                    </h4>
                    <div className="space-y-3 font-body text-sm text-on-surface">
                      <p><span className="text-on-surface-variant mr-2">Phương thức thanh toán:</span> <span className="uppercase tracking-widest font-bold text-xs">{selectedOrder.paymentMethod}</span></p>
                      <p><span className="text-on-surface-variant mr-2">Trạng thái hiện tại:</span> <span className="uppercase tracking-widest font-bold text-xs text-primary">{selectedOrder.status}</span></p>
                      <div className="mt-4 p-4 bg-surface-container-lowest border border-outline-variant/5">
                        <span className="text-on-surface-variant text-xs block mb-2 font-bold uppercase tracking-widest border-b border-outline-variant/10 pb-2">Địa chỉ giao hàng:</span>
                        {selectedOrder.shippingAddress ? (
                          <div className="space-y-1">
                            <p className="text-on-surface-variant leading-relaxed">
                              {selectedOrder.shippingAddress.addressLine}, {selectedOrder.shippingAddress.city}
                            </p>
                          </div>
                        ) : (
                          <p className="leading-relaxed italic text-on-surface-variant/70">Không có thông tin địa chỉ cụ thể.</p>
                        )}
                      </div>

                      {/* Cancel reason */}
                      {selectedOrder.cancelReason && (
                        <div className="mt-4 p-4 bg-error-container/10 border border-error/10">
                          <span className="text-error text-xs block mb-2 font-bold uppercase tracking-widest border-b border-error/10 pb-2">Lý do hủy đơn:</span>
                          <p className="text-error leading-relaxed">{selectedOrder.cancelReason}</p>
                        </div>
                      )}

                      {/* Refund info */}
                      {selectedOrder.refundBankName && (
                        <div className="mt-4 p-4 bg-amber-50 border border-amber-200">
                          <span className="text-amber-800 text-xs block mb-2 font-bold uppercase tracking-widest border-b border-amber-200 pb-2">Thông tin hoàn tiền:</span>
                          <div className="space-y-1 text-amber-900">
                            <p>Ngân hàng: <strong>{selectedOrder.refundBankName}</strong></p>
                            <p>Số tài khoản: <strong>{selectedOrder.refundAccountNumber}</strong></p>
                            <p>Chủ tài khoản: <strong>{selectedOrder.refundAccountName}</strong></p>
                          </div>
                          {selectedOrder.payment?.status === 'refund_pending' && (
                            <button
                              onClick={async () => { await approveRefund(selectedOrder.orderId); closeModals(); }}
                              className="mt-4 w-full bg-emerald-600 text-white py-3 font-label text-[10px] uppercase tracking-widest hover:bg-emerald-700 transition-colors"
                            >
                              ✓ Duyệt hoàn tiền (Đã chuyển khoản)
                            </button>
                          )}
                          {selectedOrder.payment?.status === 'refunded' && (
                            <p className="mt-3 text-emerald-700 font-bold text-xs uppercase tracking-widest">✓ Đã hoàn tiền</p>
                          )}
                        </div>
                      )}
                    </div>
                  </section>
                </div>

                {/* Right Column: Order Items */}
                <div>
                  <h4 className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-4 pb-2 border-b border-outline-variant/10">
                    Sản Phẩm Đã Đặt
                  </h4>
                  <div className="space-y-4 mb-8">
                    {selectedOrder.orderItems?.map(item => (
                      <div key={item.orderItemId} className="flex gap-4 py-3 border-b border-outline-variant/5">
                        <div className="w-16 h-20 bg-surface-container-highest shrink-0 overflow-hidden border border-outline-variant/10">
                          <img 
                            src={getProductImage(item.variant?.product, item.variant)} 
                            alt={item.variant?.product?.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-headline text-sm font-bold text-on-surface line-clamp-2 leading-snug mb-1">
                            {item.variant?.product?.name}
                          </p>
                          <div className="flex gap-4 font-body text-[11px] text-on-surface-variant uppercase tracking-wider mt-1">
                            <span>Màu: <strong className="text-on-surface">{item.variant?.colorName || 'N/A'}</strong></span>
                            <span>Size: <strong className="text-on-surface">{item.variant?.sizeName || 'N/A'}</strong></span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-body text-sm font-bold">{formatCurrency(item.priceAtTime)}</p>
                          <p className="font-body text-xs text-on-surface-variant mt-1">x {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Summary */}
                  <div className="bg-surface-container p-6 border border-outline-variant/10 space-y-3">
                    <div className="flex justify-between font-body text-sm text-on-surface-variant">
                      <span>Tạm tính</span>
                      <span>{formatCurrency(selectedOrder.totalAmount)}</span>
                    </div>
                    <div className="flex justify-between font-body text-sm text-on-surface-variant">
                      <span>Phí giao hàng</span>
                      <span>{formatCurrency(selectedOrder.shippingFee || 0)}</span>
                    </div>
                    <div className="pt-3 border-t border-outline-variant/20 flex justify-between items-end">
                      <span className="font-label text-[10px] uppercase tracking-widest text-on-surface">Tổng Của Đơn</span>
                      <span className="font-headline text-2xl text-secondary">{formatCurrency(selectedOrder.finalAmount)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-surface-container-lowest px-6 md:px-10 py-4 md:py-6 border-t border-outline-variant/10 flex justify-end z-10">
              <button 
                onClick={closeModals}
                className="font-label text-[10px] uppercase tracking-widest px-8 py-3 bg-primary text-on-primary hover:bg-primary-fixed transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

    </AdminLayout>
  );
};

export default OrderList;
