import React from 'react';

const OrderTimeline = ({ order, formatDate }) => {
  const statusList = ['pending', 'processing', 'shipped', 'completed'];
  
  const getStatusIndex = (status) => {
    return statusList.indexOf(status);
  };
  
  const currentIndex = getStatusIndex(order?.status || 'pending');

  const orderedDate = formatDate(order?.createdAt);
  
  // Calculate estimated dates based on created date for visual purposes
  const createdAt = new Date(order?.createdAt || Date.now());
  const processDate = new Date(createdAt); processDate.setDate(processDate.getDate() + 1);
  const shipDate = new Date(createdAt); shipDate.setDate(shipDate.getDate() + 2);
  const deliveryDate = new Date(createdAt); deliveryDate.setDate(deliveryDate.getDate() + 4);

  return (
    <section className="mb-24">
      <div className="relative py-12">
        <div className="absolute top-[52px] left-8 right-8 h-[1px] bg-outline-variant/30 z-0"></div>
        <div className="flex justify-between relative">
          
          {/* Status: Ordered */}
          <div className="flex flex-col items-center group z-10 w-24">
            <div className={`w-3 h-3 rounded-full mb-6 transition-all duration-300 border-2 border-surface ${currentIndex >= 0 ? (currentIndex === 0 ? 'bg-on-surface scale-150 shadow-md' : 'bg-on-surface') : 'bg-outline-variant'}`}></div>
            <div className="text-center">
              <p className={`font-label text-[9px] tracking-widest uppercase mb-1 ${currentIndex >= 0 ? 'text-on-surface-variant' : 'text-outline-variant'}`}>{orderedDate}</p>
              <p className={`font-serif italic text-base ${currentIndex === 0 ? 'text-on-surface' : (currentIndex > 0 ? 'text-on-surface' : 'text-outline-variant')}`}>Đã đặt hàng</p>
            </div>
          </div>

          {/* Status: Processing */}
          <div className="flex flex-col items-center group z-10 w-24">
            <div className={`w-3 h-3 rounded-full mb-6 transition-all duration-300 border-2 border-surface ${currentIndex >= 1 ? (currentIndex === 1 ? 'bg-on-surface scale-150 shadow-md' : 'bg-on-surface') : 'bg-outline-variant'}`}></div>
            <div className="text-center">
              <p className={`font-label text-[9px] tracking-widest uppercase mb-1 ${currentIndex >= 1 ? 'text-on-surface-variant' : 'text-outline-variant'}`}>{formatDate(processDate)}</p>
              <p className={`font-serif italic text-base ${currentIndex === 1 ? 'text-on-surface' : (currentIndex > 1 ? 'text-on-surface' : 'text-outline-variant')}`}>Đang xử lý</p>
            </div>
          </div>

          {/* Status: Shipped */}
          <div className="flex flex-col items-center group z-10 w-24">
            <div className={`w-3 h-3 rounded-full mb-6 transition-all duration-300 border-2 border-surface ${currentIndex >= 2 ? (currentIndex === 2 ? 'bg-on-surface scale-150 shadow-md' : 'bg-on-surface') : 'bg-outline-variant'}`}></div>
            <div className="text-center">
              <p className={`font-label text-[9px] tracking-widest uppercase mb-1 ${currentIndex === 2 ? 'text-secondary font-bold' : (currentIndex > 2 ? 'text-on-surface-variant' : 'text-outline-variant')}`}>{currentIndex >= 2 ? formatDate(shipDate) : 'Đang vận chuyển'}</p>
              <p className={`font-serif italic text-base ${currentIndex === 2 ? 'text-on-surface' : (currentIndex > 2 ? 'text-on-surface' : 'text-outline-variant')}`}>Đã rời kho</p>
            </div>
          </div>

          {/* Status: Delivered */}
          <div className="flex flex-col items-center group z-10 w-24">
            <div className={`w-3 h-3 rounded-full mb-6 transition-all duration-300 border-2 border-surface ${currentIndex >= 3 ? (currentIndex === 3 ? 'bg-on-surface scale-150 shadow-md' : 'bg-on-surface') : 'bg-outline-variant'}`}></div>
            <div className={`text-center ${currentIndex < 3 ? 'opacity-40' : ''}`}>
              <p className="font-label text-[9px] tracking-widest text-on-surface-variant uppercase mb-1">Dự kiến {formatDate(deliveryDate)}</p>
              <p className="font-serif italic text-base">Giao hàng</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default OrderTimeline;
