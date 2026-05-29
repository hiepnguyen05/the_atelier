import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';

const OrderSuccess = () => {
  const location = useLocation();
  const order = location.state?.order;

  if (!order) {
    return <Navigate to="/" />;
  }

  return (
    <div className="bg-surface text-on-surface antialiased pt-32 pb-24 min-h-[70vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center p-12 bg-surface-container-low border border-outline-variant/20 shadow-lg">
        <span className="material-symbols-outlined text-6xl text-secondary mb-6 block mx-auto">check_circle</span>
        <h1 className="text-4xl font-display italic mb-4">Cảm ơn bạn!</h1>
        <p className="text-sm text-on-surface-variant mb-2">
          Đơn hàng <span className="font-bold text-on-surface">#{order.orderCode}</span> đã được đặt thành công.
        </p>
        <p className="text-[11px] leading-relaxed text-on-surface-variant mb-10 mt-6">
          Chúng tôi đã ghi nhận thông tin đặt hàng của bạn. 
          Đơn hàng sẽ được THE ATELIER xử lý và giao trong thời gian sớm nhất.
        </p>
        <Link 
          to={`/orders/${order.orderId}`}
          className="inline-block w-full bg-surface-tint text-on-primary py-4 text-xs font-bold tracking-[0.2em] uppercase hover:bg-primary-dim transition-all duration-300 mb-4"
        >
          THEO DÕI ĐƠN HÀNG
        </Link>
        <Link 
          to="/products"
          className="inline-block w-full bg-surface-container-low text-on-surface py-4 text-xs font-bold tracking-[0.2em] uppercase hover:bg-surface-container-highest transition-all duration-300 border border-outline-variant/30"
        >
          TIẾP TỤC MUA SẮM
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
