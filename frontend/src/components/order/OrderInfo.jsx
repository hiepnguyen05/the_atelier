import React from 'react';

const OrderInfo = ({ order, formatDate }) => {
  const address = order?.shippingAddress;

  const paymentMethods = {
    'COD': 'Thanh toán khi nhận hàng',
    'CREDIT_CARD': 'Thẻ tín dụng',
    'BANK_TRANSFER': 'Chuyển khoản ngân hàng'
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 border-t border-black/[0.03] pt-16">
      <div className="space-y-8">
        <div>
          <h3 className="font-label text-[10px] tracking-[0.25em] text-on-surface-variant uppercase mb-6 opacity-60">Thông tin vận chuyển</h3>
          <div className="space-y-2">
            <p className="font-serif text-2xl text-on-surface">{address?.recipientName || 'N/A'}</p>
            <p className="font-body text-sm text-on-surface-variant leading-relaxed font-light">
                {address?.addressLine || 'N/A'}<br/>
                {address?.city || 'N/A'}<br/>
                Việt Nam
            </p>
            <p className="font-body text-sm text-on-surface-variant pt-4 font-light">{address?.phoneNumber || 'N/A'}</p>
          </div>
        </div>
      </div>
      <div className="space-y-8">
        <div>
          <h3 className="font-label text-[10px] tracking-[0.25em] text-on-surface-variant uppercase mb-6 opacity-60">Chi tiết đơn hàng</h3>
          <div className="space-y-6">
            <div className="flex justify-between items-baseline border-b border-black/[0.03] pb-3">
              <span className="font-label text-[9px] text-on-surface-variant uppercase tracking-widest">Mã đơn hàng</span>
              <span className="font-body text-sm text-on-surface tracking-tight">#{order?.orderCode}</span>
            </div>
            <div className="flex justify-between items-baseline border-b border-black/[0.03] pb-3">
              <span className="font-label text-[9px] text-on-surface-variant uppercase tracking-widest">Ngày đặt</span>
              <span className="font-body text-sm text-on-surface">{formatDate(order?.createdAt)}</span>
            </div>
            <div className="flex justify-between items-baseline border-b border-black/[0.03] pb-3">
              <span className="font-label text-[9px] text-on-surface-variant uppercase tracking-widest">Phương thức</span>
              <span className="font-body text-sm text-on-surface">{paymentMethods[order?.paymentMethod] || order?.paymentMethod}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderInfo;
