import React from 'react';
import Loading from '../../common/Loading';

// Helper function to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const statusConfig = {
  pending: { label: 'Chờ xử lý', bgColor: 'bg-primary-container', textColor: 'text-on-primary-container' },
  processing: { label: 'Đã xác nhận', bgColor: 'bg-secondary-container', textColor: 'text-on-secondary-container' },
  shipped: { label: 'Đang giao', bgColor: 'bg-tertiary-container', textColor: 'text-on-tertiary-container' },
  completed: { label: 'Hoàn thành', bgColor: 'bg-success-container', textColor: 'text-on-success-container' },
  cancelled: { label: 'Đã hủy', bgColor: 'bg-error-container', textColor: 'text-on-error-container' }
};

const OrderRow = ({ order, onUpdateClick, onViewClick }) => {
  const status = statusConfig[order.status] || statusConfig.pending;
  
  return (
    <tr className="group hover:bg-surface-container-low/50 transition-colors border-b border-outline-variant/5">
      {/* Mã Đơn & Ngày đặt */}
      <td className="py-6 px-8">
        <div>
          <h4 className="font-headline text-base text-on-surface mb-1 font-bold">{order.orderCode}</h4>
          <span className="font-body text-xs text-on-surface-variant/70 tracking-wider uppercase">
            {new Date(order.createdAt).toLocaleDateString('vi-VN')}
          </span>
        </div>
      </td>
      
      {/* Khách hàng */}
      <td className="py-6 px-8">
        <div>
          <p className="font-headline text-sm text-on-surface mb-1">{order.user?.fullName || 'Khách Vãng Lai'}</p>
          <p className="font-body text-xs text-on-surface-variant/70">{order.user?.email || 'N/A'}</p>
        </div>
      </td>
      
      {/* Sản phẩm */}
      <td className="py-6 px-8 max-w-[250px]">
        <div className="font-body text-xs text-on-surface-variant line-clamp-2">
          {order.orderItems?.map(item => (
            <span key={item.orderItemId} className="block mb-1">
              • {item.variant?.product?.name} <span className="opacity-70">(x{item.quantity})</span>
            </span>
          ))}
        </div>
      </td>

      {/* Tổng tiền */}
      <td className="py-6 px-8">
        <span className="font-headline text-sm text-on-surface">
          {formatCurrency(order.finalAmount)}
        </span>
      </td>

      {/* Trạng thái */}
      <td className="py-6 px-8 text-center">
        <span className={`font-label text-[9px] uppercase tracking-[0.2em] px-3 py-1.5 font-bold inline-block min-w-[110px] ${status.bgColor} ${status.textColor}`}>
          {status.label}
        </span>
      </td>

      {/* Thao tác */}
      <td className="py-6 px-8 text-right">
        <div className="flex justify-end gap-2">
          <button 
            onClick={() => onViewClick(order)}
            className="font-label text-[10px] uppercase tracking-widest px-4 py-2 border border-outline-variant/30 text-on-surface hover:bg-surface-container transition-all"
            title="Xem chi tiết đơn hàng"
          >
            Chi tiết
          </button>
          <button 
            onClick={() => onUpdateClick(order)}
            disabled={order.status === 'completed' || order.status === 'cancelled'}
            className="font-label text-[10px] uppercase tracking-widest px-4 py-2 border border-secondary/30 text-secondary hover:bg-secondary hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-secondary disabled:cursor-not-allowed"
            title="Cập nhật trạng thái"
          >
            Cập nhật
          </button>
        </div>
      </td>
    </tr>
  );
};

const OrderTable = ({ orders, loading, onUpdateClick, onViewClick }) => {
  return (
    <section className="bg-surface-container-lowest overflow-hidden border border-outline-variant/5">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-surface-container border-b border-outline-variant/10">
              <th className="py-6 px-8 font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Mã Đơn / Ngày</th>
              <th className="py-6 px-8 font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Khách Hàng</th>
              <th className="py-6 px-8 font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Sản phẩm</th>
              <th className="py-6 px-8 font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Tổng Tiền</th>
              <th className="py-6 px-8 font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold text-center">Trạng Thái</th>
              <th className="py-6 px-8 font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/5">
            {loading ? (
              <tr>
                <td colSpan="6" className="py-12">
                  <Loading size={70} text="Đang tải danh sách đơn hàng..." />
                </td>
              </tr>
            ) : (!orders || orders.length === 0) ? (
              <tr>
                <td colSpan="6" className="py-20 text-center font-body text-xs text-on-surface-variant opacity-60 uppercase tracking-widest">
                  Không tìm thấy đơn hàng nào phù hợp.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <OrderRow 
                  key={order.orderId} 
                  order={order} 
                  onUpdateClick={onUpdateClick}
                  onViewClick={onViewClick}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default OrderTable;
