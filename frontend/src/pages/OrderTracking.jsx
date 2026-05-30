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

  const getHeaderTitle = (status) => {
    switch (status) {
      case 'completed':
        return 'Đơn hàng đã được giao thành công.';
      case 'cancelled':
        return 'Đơn hàng này đã bị hủy.';
      case 'shipped':
        return 'Đơn hàng của bạn đang trên đường tới.';
      case 'processing':
        return 'Đơn hàng đã xác nhận và đang được chế tác.';
      case 'pending':
      default:
        return 'Đơn hàng mới đặt, đang chờ xác nhận.';
    }
  };

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
      <main className="pt-32 md:pt-44 pb-20 md:pb-32 px-4 md:px-16 max-w-screen-2xl mx-auto">
        
        {/* Header Section */}
        <header className="mb-10 md:mb-24">
          <p className="font-label text-[10px] tracking-[0.3em] text-secondary mb-6 uppercase opacity-80">Theo dõi đơn hàng</p>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-on-surface leading-[1.1] max-w-4xl">
            {getHeaderTitle(order.status)}
          </h1>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start">
          
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
