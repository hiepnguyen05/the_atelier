import React from 'react';
import { Link } from 'react-router-dom';
import useOrderHistory from '../hooks/order/useOrderHistory';

const CANCEL_REASONS = [
  'Tôi muốn thay đổi sản phẩm (màu sắc, kích cỡ, số lượng...)',
  'Tôi tìm thấy giá tốt hơn ở nơi khác',
  'Tôi đặt nhầm / không còn nhu cầu',
  'Thời gian giao hàng quá lâu',
  'Tôi muốn thay đổi địa chỉ giao hàng',
  'Lý do khác'
];

const OrderHistory = () => {
  const {
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
  } = useOrderHistory();

  if (loading) {
    return (
      <div className="bg-[#FAF9F6] text-on-surface antialiased pt-44 pb-32 min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="font-serif text-2xl italic text-neutral-800 animate-pulse">
            Đang mở tủ hồ sơ đơn hàng của bạn...
          </p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'all', label: 'Tất cả' },
    { id: 'pending', label: 'Chờ xử lý' },
    { id: 'shipped', label: 'Đang giao' },
    { id: 'completed', label: 'Hoàn thành' },
    { id: 'refund_pending', label: 'Chờ hoàn tiền' },
    { id: 'cancelled', label: 'Đã hủy' }
  ];

  const needsRefund = cancelTarget && isOrderPaid(cancelTarget);

  return (
    <div className="bg-[#FAF9F6] text-on-surface antialiased min-h-screen selection:bg-neutral-200">
      <main className="pt-32 md:pt-44 pb-20 md:pb-32 px-4 md:px-16 max-w-screen-xl mx-auto">
        
        {/* Header Section */}
        <header className="mb-12 text-center md:text-left border-b border-black/[0.06] pb-12">
          <p className="font-label text-[10px] tracking-[0.3em] text-neutral-500 mb-4 uppercase">
            TÀI KHOẢN CỦA BẠN
          </p>
          <h1 className="font-serif text-5xl md:text-7xl text-neutral-900 font-light tracking-wide leading-tight">
            Lịch sử mua hàng
          </h1>
          <p className="font-sans text-xs text-neutral-500 mt-4 tracking-wider max-w-md">
            Lưu giữ và theo dõi tất cả những dấu ấn thời trang bạn đã sở hữu từ THE ATELIER.
          </p>
        </header>

        {/* Tabs Navigation */}
        <div className="flex overflow-x-auto hide-scrollbar mb-12 border-b border-neutral-200">
          <div className="flex gap-8 min-w-max px-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 font-label text-[11px] tracking-[0.2em] uppercase transition-all duration-300 relative ${
                  activeTab === tab.id 
                    ? 'text-neutral-900 font-bold' 
                    : 'text-neutral-400 hover:text-neutral-600'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 w-full h-[1px] bg-neutral-900"></span>
                )}
              </button>
            ))}
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          /* Empty State */
          <div className="py-24 text-center max-w-md mx-auto">
            <span className="material-symbols-outlined text-5xl text-neutral-300 mb-6 font-light">
              receipt_long
            </span>
            <h2 className="font-serif text-2xl mb-4 text-neutral-800">
              {activeTab === 'all' ? 'Chưa có đơn hàng nào được thực hiện' : 'Không có đơn hàng nào trong mục này'}
            </h2>
            <p className="font-sans text-xs text-neutral-500 leading-relaxed mb-12">
              Kính mời quý khách tham khảo bộ sưu tập mới nhất để bắt đầu hành trình thời trang tinh tế của mình.
            </p>
            <Link 
              to="/products"
              className="inline-block bg-neutral-950 text-[#FAF9F6] px-12 py-5 font-label text-[10px] tracking-[0.3em] uppercase hover:bg-neutral-800 hover:-translate-y-0.5 transition-all duration-500 shadow-md"
            >
              KHÁM PHÁ BỘ SƯU TẬP
            </Link>
          </div>
        ) : (
          /* Orders List */
          <div className="space-y-16">
            {filteredOrders.map((order) => {
              const items = order.orderItems || order.order_items || [];
              const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);
              const canCancel = order.status === 'pending' || order.status === 'processing';
              const isCancelling = cancellingId === order.orderId;
              
              return (
                <div 
                  key={order.orderId}
                  className="bg-white border border-neutral-900/[0.05] p-5 sm:p-8 md:p-12 shadow-[0_4px_30px_rgba(0,0,0,0.01)] hover:shadow-[0_10px_45px_rgba(0,0,0,0.03)] hover:border-neutral-900/[0.08] transition-all duration-700 group"
                >
                  {/* Order Metadata */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-neutral-900/[0.05] pb-8 mb-10">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="font-label text-[9px] tracking-[0.2em] text-neutral-400 uppercase">
                          MÃ ĐƠN HÀNG
                        </span>
                        <span className="font-mono text-xs font-bold text-neutral-800">
                          #{order.orderCode}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-serif text-lg text-neutral-800">
                          Đặt ngày {formatDate(order.createdAt)}
                        </span>
                        <span className={`px-3 py-1 rounded-full font-sans text-[10px] tracking-wider uppercase font-medium ${getStatusColorClass(order)}`}>
                          {getStatusText(order)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-baseline gap-2 md:text-right">
                      <span className="font-label text-[9px] tracking-[0.2em] text-neutral-400 uppercase block md:hidden">
                        TỔNG TIỀN:
                      </span>
                      <span className="font-serif text-2xl md:text-3xl text-neutral-900 font-light">
                        {formatPrice(order.finalAmount)}
                      </span>
                      <span className="font-sans text-[10px] text-neutral-400 tracking-wider">
                        ({totalItemsCount} sản phẩm)
                      </span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="divide-y divide-neutral-900/[0.03] mb-10">
                    {items.map((item) => {
                      const product = item.variant?.product;
                      const imageUrl = getProductImage(product, item.variant);

                      return (
                        <div key={item.orderItemId} className="py-6 flex gap-4 md:gap-8 items-start first:pt-0 last:pb-0">
                          <div className="w-20 h-26 bg-[#F6F5F2] overflow-hidden shrink-0 border border-neutral-900/[0.03]">
                            <img 
                              src={imageUrl} 
                              alt={product?.name || "Product"} 
                              className="w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" 
                            />
                          </div>
                          <div className="flex-1 flex flex-col md:flex-row justify-between gap-4">
                            <div className="space-y-2">
                              <h3 className="font-serif text-lg text-neutral-900 hover:text-neutral-600 transition-colors">
                                <Link to={`/products/${product?.slug}`}>
                                  {product?.name}
                                </Link>
                              </h3>
                              <div className="flex flex-wrap gap-x-3 gap-y-1 font-label text-[9px] text-neutral-500 uppercase tracking-widest">
                                <span>Màu: <strong className="text-neutral-700">{item.variant?.colorName}</strong></span>
                                <span className="text-neutral-300 opacity-40">|</span>
                                <span>Size: <strong className="text-neutral-700">{item.variant?.sizeName}</strong></span>
                                <span className="text-neutral-300 opacity-40">|</span>
                                <span>SL: <strong className="text-neutral-700">{item.quantity}</strong></span>
                              </div>
                            </div>
                            <div className="md:text-right font-serif text-base text-neutral-800">
                              {formatPrice(item.priceAtTime)}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Cancel reason display for cancelled orders */}
                  {order.status === 'cancelled' && order.cancelReason && (
                    <div className="mb-6 p-4 bg-rose-50/50 border border-rose-100">
                      <p className="font-label text-[9px] tracking-[0.2em] text-rose-400 uppercase mb-1">LÝ DO HỦY ĐƠN</p>
                      <p className="font-sans text-sm text-rose-700">{order.cancelReason}</p>
                    </div>
                  )}

                  {/* Order Actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-neutral-900/[0.05]">
                    <div className="text-neutral-400 font-label text-[9px] tracking-widest uppercase">
                      Phương thức thanh toán: <strong className="text-neutral-600 font-sans text-xs">{order.paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng (COD)' : order.paymentMethod}</strong>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                      {canCancel && (
                        <button 
                          onClick={() => openCancelModal(order)}
                          disabled={isCancelling}
                          className="inline-block border border-rose-600 text-rose-600 px-8 py-4 font-label text-[9px] tracking-[0.25em] uppercase hover:bg-rose-50 transition-all duration-500 text-center shadow-sm disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto cursor-pointer"
                        >
                          {isCancelling ? 'ĐANG HỦY...' : 'HỦY ĐƠN HÀNG'}
                        </button>
                      )}
                      {order.status !== 'cancelled' && (
                        <Link 
                          to={`/orders/${order.orderId}`}
                          className="inline-block border border-neutral-950 text-neutral-950 px-8 py-4 font-label text-[9px] tracking-[0.25em] uppercase hover:bg-neutral-950 hover:text-[#FAF9F6] transition-all duration-500 text-center shadow-sm w-full sm:w-auto cursor-pointer"
                        >
                          THEO DÕI CHI TIẾT
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </main>

      {/* ========== Cancel Order Modal ========== */}
      {cancelModalOpen && cancelTarget && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pt-20">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeCancelModal}></div>
          
          <div className="relative bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl border border-neutral-200">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white z-10 px-8 py-6 border-b border-neutral-100 flex justify-between items-center">
              <div>
                <h3 className="font-serif text-2xl text-neutral-900">Hủy đơn hàng</h3>
                <p className="font-sans text-xs text-neutral-500 mt-1">
                  Mã đơn: <strong className="text-neutral-800">#{cancelTarget.orderCode}</strong>
                  {' • '}{formatPrice(cancelTarget.finalAmount)}
                </p>
              </div>
              <button onClick={closeCancelModal} className="material-symbols-outlined text-2xl text-neutral-400 hover:text-neutral-800 transition-colors">
                close
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 space-y-6">

              {/* Refund notice for paid orders */}
              {needsRefund && (
                <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800">
                  <div className="flex gap-2 items-start">
                    <span className="material-symbols-outlined text-lg mt-0.5">info</span>
                    <div>
                      <p className="font-sans text-xs font-bold mb-1">Đơn hàng đã được thanh toán qua {cancelTarget.paymentMethod}</p>
                      <p className="font-sans text-[11px] leading-relaxed">
                        Vui lòng cung cấp thông tin tài khoản ngân hàng để chúng tôi hoàn tiền cho bạn. 
                        Sau khi gửi yêu cầu, bộ phận quản trị sẽ xử lý hoàn tiền trong vòng 1-3 ngày làm việc.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Cancel reason */}
              <div>
                <label className="font-label text-[10px] uppercase tracking-widest text-neutral-500 mb-3 block">
                  Lý do hủy đơn <span className="text-rose-500">*</span>
                </label>
                <div className="space-y-2">
                  {CANCEL_REASONS.map((reason) => (
                    <label
                      key={reason}
                      className={`flex items-center gap-3 p-3 border cursor-pointer transition-all duration-200 ${
                        cancelForm.cancelReason === reason 
                          ? 'border-neutral-900 bg-neutral-50' 
                          : 'border-neutral-200 hover:border-neutral-400'
                      }`}
                    >
                      <input
                        type="radio"
                        name="cancelReason"
                        value={reason}
                        checked={cancelForm.cancelReason === reason}
                        onChange={(e) => updateCancelForm('cancelReason', e.target.value)}
                        className="accent-neutral-900"
                      />
                      <span className="font-sans text-sm text-neutral-700">{reason}</span>
                    </label>
                  ))}
                </div>
                {cancelErrors.cancelReason && (
                  <p className="font-sans text-xs text-rose-600 mt-2">{cancelErrors.cancelReason}</p>
                )}
              </div>

              {/* Refund bank info — only shown for paid orders */}
              {needsRefund && (
                <div className="space-y-4 pt-4 border-t border-neutral-100">
                  <p className="font-label text-[10px] uppercase tracking-widest text-neutral-500">
                    Thông tin nhận hoàn tiền <span className="text-rose-500">*</span>
                  </p>

                  <div>
                    <label className="font-sans text-xs text-neutral-600 mb-1.5 block">Tên ngân hàng</label>
                    <input
                      type="text"
                      value={cancelForm.refundBankName}
                      onChange={(e) => updateCancelForm('refundBankName', e.target.value)}
                      placeholder="VD: Vietcombank, MB Bank, Techcombank..."
                      className="w-full border border-neutral-200 py-3 px-4 font-sans text-sm focus:outline-none focus:border-neutral-900 transition-colors"
                    />
                    {cancelErrors.refundBankName && (
                      <p className="font-sans text-xs text-rose-600 mt-1">{cancelErrors.refundBankName}</p>
                    )}
                  </div>

                  <div>
                    <label className="font-sans text-xs text-neutral-600 mb-1.5 block">Số tài khoản</label>
                    <input
                      type="text"
                      value={cancelForm.refundAccountNumber}
                      onChange={(e) => updateCancelForm('refundAccountNumber', e.target.value)}
                      placeholder="Nhập số tài khoản nhận hoàn tiền"
                      className="w-full border border-neutral-200 py-3 px-4 font-sans text-sm focus:outline-none focus:border-neutral-900 transition-colors"
                    />
                    {cancelErrors.refundAccountNumber && (
                      <p className="font-sans text-xs text-rose-600 mt-1">{cancelErrors.refundAccountNumber}</p>
                    )}
                  </div>

                  <div>
                    <label className="font-sans text-xs text-neutral-600 mb-1.5 block">Tên chủ tài khoản</label>
                    <input
                      type="text"
                      value={cancelForm.refundAccountName}
                      onChange={(e) => updateCancelForm('refundAccountName', e.target.value.toUpperCase())}
                      placeholder="VD: NGUYEN VAN A"
                      className="w-full border border-neutral-200 py-3 px-4 font-sans text-sm uppercase focus:outline-none focus:border-neutral-900 transition-colors"
                    />
                    {cancelErrors.refundAccountName && (
                      <p className="font-sans text-xs text-rose-600 mt-1">{cancelErrors.refundAccountName}</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white px-8 py-6 border-t border-neutral-100 flex gap-4 justify-end">
              <button 
                onClick={closeCancelModal}
                className="font-label text-[10px] uppercase tracking-widest px-6 py-3 border border-neutral-300 text-neutral-700 hover:bg-neutral-50 transition-colors"
              >
                Quay lại
              </button>
              <button 
                onClick={submitCancel}
                disabled={cancellingId === cancelTarget?.orderId}
                className="font-label text-[10px] uppercase tracking-widest px-8 py-3 bg-rose-600 text-white hover:bg-rose-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cancellingId === cancelTarget?.orderId ? 'Đang xử lý...' : (needsRefund ? 'Gửi yêu cầu hủy & hoàn tiền' : 'Xác nhận hủy đơn')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
