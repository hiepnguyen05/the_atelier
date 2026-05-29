import React from 'react';
import { Link } from 'react-router-dom';
import useOrderHistory from '../hooks/order/useOrderHistory';

const OrderHistory = () => {
  const {
    orders,
    loading,
    formatPrice,
    formatDate,
    getProductImage,
    getStatusText,
    getStatusColorClass
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

  return (
    <div className="bg-[#FAF9F6] text-on-surface antialiased min-h-screen selection:bg-neutral-200">
      <main className="pt-44 pb-32 px-6 md:px-16 max-w-screen-xl mx-auto">
        
        {/* Header Section */}
        <header className="mb-20 text-center md:text-left border-b border-black/[0.06] pb-12">
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

        {orders.length === 0 ? (
          /* Empty State */
          <div className="py-24 text-center max-w-md mx-auto">
            <span className="material-symbols-outlined text-5xl text-neutral-300 mb-6 font-light">
              receipt_long
            </span>
            <h2 className="font-serif text-2xl mb-4 text-neutral-800">
              Chưa có đơn hàng nào được thực hiện
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
            {orders.map((order) => {
              const items = order.orderItems || order.order_items || [];
              const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);
              
              return (
                <div 
                  key={order.orderId}
                  className="bg-white border border-neutral-900/[0.05] p-8 md:p-12 shadow-[0_4px_30px_rgba(0,0,0,0.01)] hover:shadow-[0_10px_45px_rgba(0,0,0,0.03)] hover:border-neutral-900/[0.08] transition-all duration-700 group"
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
                        <span className={`px-3 py-1 rounded-full font-sans text-[10px] tracking-wider uppercase font-medium ${getStatusColorClass(order.status)}`}>
                          {getStatusText(order.status)}
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
                        <div key={item.orderItemId} className="py-6 flex gap-6 md:gap-8 items-start first:pt-0 last:pb-0">
                          {/* Thumbnail */}
                          <div className="w-20 h-26 bg-[#F6F5F2] overflow-hidden shrink-0 border border-neutral-900/[0.03]">
                            <img 
                              src={imageUrl} 
                              alt={product?.name || "Product"} 
                              className="w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" 
                            />
                          </div>

                          {/* Info */}
                          <div className="flex-1 flex flex-col md:flex-row justify-between gap-4">
                            <div className="space-y-2">
                              <h3 className="font-serif text-lg text-neutral-900 hover:text-neutral-600 transition-colors">
                                <Link to={`/products/${product?.slug}`}>
                                  {product?.name}
                                </Link>
                              </h3>
                              <div className="flex flex-wrap gap-x-4 gap-y-1 font-label text-[9px] text-neutral-500 uppercase tracking-widest">
                                <span>Màu sắc: <strong className="text-neutral-700">{item.variant?.colorName}</strong></span>
                                <span className="text-neutral-300">|</span>
                                <span>Kích cỡ: <strong className="text-neutral-700">{item.variant?.sizeName}</strong></span>
                                <span className="text-neutral-300">|</span>
                                <span>Số lượng: <strong className="text-neutral-700">{item.quantity}</strong></span>
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

                  {/* Order Actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-neutral-900/[0.05]">
                    <div className="text-neutral-400 font-label text-[9px] tracking-widest uppercase">
                      Phương thức thanh toán: <strong className="text-neutral-600 font-sans text-xs">{order.paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng (COD)' : order.paymentMethod}</strong>
                    </div>
                    <div className="flex gap-4">
                      <Link 
                        to={`/orders/${order.orderId}`}
                        className="inline-block border border-neutral-950 text-neutral-950 px-8 py-4 font-label text-[9px] tracking-[0.25em] uppercase hover:bg-neutral-950 hover:text-[#FAF9F6] transition-all duration-500 text-center shadow-sm"
                      >
                        THEO DÕI & XEM CHI TIẾT
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </main>
    </div>
  );
};

export default OrderHistory;
