import React from 'react';

const OrderSummarySidebar = ({ order, formatPrice, getProductImage }) => {
  const items = order?.orderItems || order?.order_items || [];
  
  return (
    <div className="lg:col-span-5 bg-surface-container-low/50 p-12 lg:p-16">
      <h3 className="font-display text-4xl mb-12 text-on-surface">Tóm tắt đơn hàng</h3>
      
      <div className="space-y-12 mb-16 max-h-96 overflow-y-auto no-scrollbar">
        {items.map((item) => {
          const product = item.variant?.product;
          const imageUrl = getProductImage(product, item.variant);
          
          return (
            <div key={item.orderItemId} className="flex gap-8 items-start group">
              <div className="w-28 h-36 bg-surface-container-highest overflow-hidden shrink-0">
                <img 
                  alt={product?.name || "Product"} 
                  className="w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" 
                  src={imageUrl} 
                />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-3 gap-2">
                  <h4 className="font-serif text-lg leading-snug">{product?.name}</h4>
                  <span className="font-serif text-lg shrink-0">{formatPrice(item.priceAtTime * item.quantity)}</span>
                </div>
                <p className="font-label text-[9px] text-on-surface-variant uppercase tracking-[0.2em] mb-1">
                  Kích cỡ: {item.variant?.sizeName} / Màu sắc: {item.variant?.colorName}
                </p>
                <p className="font-label text-[9px] text-on-surface-variant uppercase tracking-[0.2em]">
                  Số lượng: {item.quantity}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="space-y-4 pt-10 border-t border-black/[0.05]">
        <div className="flex justify-between font-label text-[10px] tracking-[0.2em] text-on-surface-variant uppercase">
          <span>Tạm tính</span>
          <span>{formatPrice(order?.totalAmount)}</span>
        </div>
        <div className="flex justify-between font-label text-[10px] tracking-[0.2em] text-on-surface-variant uppercase">
          <span>Phí vận chuyển</span>
          <span>{order?.shippingFee == 0 ? 'Miễn phí' : formatPrice(order?.shippingFee)}</span>
        </div>
        <div className="flex justify-between font-serif text-3xl pt-8 text-on-surface">
          <span>Tổng cộng</span>
          <span>{formatPrice(order?.finalAmount)}</span>
        </div>
      </div>
      
      <button className="w-full mt-16 bg-neutral-900 text-white py-6 font-label text-[10px] tracking-[0.3em] uppercase hover:bg-neutral-800 transition-all duration-500">
        LIÊN HỆ CHĂM SÓC KHÁCH HÀNG
      </button>
    </div>
  );
};

export default OrderSummarySidebar;
