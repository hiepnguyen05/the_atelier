import React from 'react';
import { Link } from 'react-router-dom';

const CartEmptyState = () => {
  return (
    <div className="py-32 flex flex-col items-center justify-center text-center max-w-xl mx-auto animate-in fade-in slide-in-from-bottom-5 duration-700">
      <span className="font-label text-[10px] tracking-[0.3em] text-secondary mb-6 uppercase select-none">
        THE ATELIER
      </span>
      <h2 className="font-headline text-4xl md:text-5xl italic font-light text-on-surface mb-6 leading-tight">
        Giỏ hàng của bạn <br /> hiện đang trống
      </h2>
      <p className="font-body text-sm text-on-surface-variant font-light max-w-sm mb-12 leading-relaxed">
        Chúng tôi mời bạn tiếp tục khám phá các tác phẩm may đo tinh xảo và các chế tác thủ công độc bản được tuyển chọn trong những bộ sưu tập mới nhất.
      </p>
      <Link 
        to="/products" 
        className="border border-outline hover:bg-on-surface hover:text-white hover:border-on-surface text-on-surface font-label text-[10px] uppercase tracking-[0.2em] py-5 px-12 transition-all duration-500 no-underline"
      >
        Khám Phá Bộ Sưu Tập
      </Link>
    </div>
  );
};

export default CartEmptyState;
