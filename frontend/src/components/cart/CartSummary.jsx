import React from 'react';

const CartSummary = ({ subtotal, estimatedTax, total, formatPrice, handleCheckout }) => {
  return (
    <div className="bg-surface-container p-8 sticky top-32">
      <h2 className="font-headline italic text-3xl mb-8">Tóm Tắt Đơn Hàng</h2>
      
      <div className="space-y-6 mb-12">
        <div className="flex justify-between items-center">
          <span className="font-label text-xs uppercase tracking-[0.05em] text-on-surface-variant">Tạm Tính</span>
          <span className="font-body text-sm">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-label text-xs uppercase tracking-[0.05em] text-on-surface-variant">Giao Hàng</span>
          <span className="font-body text-sm italic text-secondary">Miễn Phí</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-label text-xs uppercase tracking-[0.05em] text-on-surface-variant">Thuế Ước Tính (8%)</span>
          <span className="font-body text-sm">{formatPrice(estimatedTax)}</span>
        </div>
        <div className="pt-6 border-t border-outline-variant/30 flex justify-between items-center">
          <span className="font-label text-sm uppercase tracking-[0.1em] font-bold">Tổng Cộng</span>
          <span className="font-headline text-3xl">{formatPrice(total)}</span>
        </div>
      </div>

      <button 
        onClick={handleCheckout}
        className="w-full border-0 bg-surface-tint text-on-primary font-label text-xs uppercase tracking-[0.2em] py-5 px-8 hover:bg-primary-dim transition-all duration-300 shadow-xl shadow-primary/10 cursor-pointer"
      >
        Tiến Hành Thanh Toán
      </button>

      <div className="mt-8">
        <p className="font-body text-[11px] text-on-surface-variant leading-relaxed text-center">
          Phí vận chuyển và thuế được tính khi thanh toán. Các đơn hàng quốc tế có thể chịu thêm phí hải quan.
        </p>
      </div>

      <div className="mt-12 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-secondary text-lg">verified</span>
          <span className="font-label text-[10px] uppercase tracking-widest">Đảm Bảo Chính Hãng</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-secondary text-lg">local_shipping</span>
          <span className="font-label text-[10px] uppercase tracking-widest">Giao Hàng Nhanh Toàn Cầu</span>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;
