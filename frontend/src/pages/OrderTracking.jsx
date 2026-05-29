import React from 'react';
import useOrderTracking from '../hooks/order/useOrderTracking';
import OrderTimeline from '../components/order/OrderTimeline';
import OrderInfo from '../components/order/OrderInfo';
import OrderSummarySidebar from '../components/order/OrderSummarySidebar';

const OrderTracking = () => {
  const {
    order,
    loading,
    formatPrice,
    formatDate,
    getProductImage
  } = useOrderTracking();

  if (loading) {
    return (
      <div className="bg-background text-on-surface selection:bg-secondary-fixed min-h-[70vh] flex items-center justify-center">
        <div className="text-center font-headline text-2xl italic animate-pulse">
          Đang tải thông tin đơn hàng...
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className="bg-background text-on-surface selection:bg-secondary-fixed">
      <main className="pt-44 pb-32 px-6 md:px-16 max-w-screen-2xl mx-auto">
        
        {/* Header Section */}
        <header className="mb-24">
          <p className="font-label text-[10px] tracking-[0.3em] text-secondary mb-6 uppercase opacity-80">Theo dõi đơn hàng</p>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-on-surface leading-[1.1] max-w-4xl">
            {order.status === 'completed' ? 'Đơn hàng đã được giao thành công.' : 'Đơn hàng của bạn đang trên đường tới.'}
          </h1>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-start">
          
          {/* Left: Tracking & Info */}
          <div className="lg:col-span-7">
            <OrderTimeline order={order} formatDate={formatDate} />
            <OrderInfo order={order} formatDate={formatDate} />
          </div>

          {/* Right: Order Summary Sidebar */}
          <OrderSummarySidebar 
            order={order} 
            formatPrice={formatPrice} 
            getProductImage={getProductImage} 
          />

        </div>
      </main>
    </div>
  );
};

export default OrderTracking;
