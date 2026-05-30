import React from 'react';

const CheckoutSummary = ({ checkoutItems, subtotal, formatPrice, handleSubmit, loading }) => {
  // Extract primary image from product
  const getProductImage = (product) => {
    if (product?.productImages && product.productImages.length > 0) {
      const primaryImg = product.productImages.find(img => img.isPrimary === true || img.isPrimary === 1 || img.isPrimary === '1');
      if (primaryImg) return primaryImg.imageUrl;
      return product.productImages[0].imageUrl;
    }
    return 'https://via.placeholder.com/600x800?text=THE+ATELIER';
  };

  return (
    <aside className="lg:col-span-5">
      <div className="sticky top-32 bg-surface-container p-8 md:p-12">
        <h3 className="text-3xl font-display mb-10 italic">Tóm Tắt Đơn Hàng</h3>
        
        <div className="space-y-8 mb-12 max-h-96 overflow-y-auto no-scrollbar">
          {checkoutItems.map((item) => {
            const product = item.variant?.product;
            const imageUrl = item.variant?.colorImage || getProductImage(product);
            const base = Number(product?.basePrice || 0);
            const adjustment = Number(item.variant?.priceAdjustment || 0);
            const price = base + adjustment;

            return (
              <div key={item.cartItemId} className="flex gap-6">
                <div className="w-24 h-32 bg-surface-container-highest shrink-0 relative overflow-hidden">
                  <img 
                    alt={product?.name || "Product"} 
                    className="w-full h-full object-cover" 
                    src={imageUrl} 
                  />
                  <div className="absolute top-0 right-0 bg-secondary-fixed text-on-secondary-fixed text-[10px] w-6 h-6 flex items-center justify-center font-bold">
                    {item.quantity}
                  </div>
                </div>
                <div className="flex flex-col justify-between py-1">
                  <div>
                    <h4 className="text-sm font-bold tracking-wide uppercase">{product?.name}</h4>
                    <p className="text-xs text-on-surface-variant mt-1">
                      Màu: {item.variant?.colorName || 'Màu mặc định'} / Size: {item.variant?.sizeName || 'Một Kích Cỡ'}
                    </p>
                  </div>
                  <span className="text-lg serif italic">{formatPrice(price * item.quantity)}</span>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="space-y-4 pt-8 border-t border-outline-variant/20">
          <div className="flex justify-between items-center">
            <span className="text-xs font-label uppercase tracking-widest text-on-surface-variant">Tạm Tính</span>
            <span className="text-sm">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs font-label uppercase tracking-widest text-on-surface-variant">Phí Vận Chuyển</span>
            <span className="text-xs uppercase italic">Miễn Phí</span>
          </div>
          <div className="flex justify-between items-center pt-6">
            <span className="text-sm font-bold uppercase tracking-[0.1em]">Tổng Cộng</span>
            <span className="text-2xl serif italic font-bold">{formatPrice(subtotal)}</span>
          </div>
        </div>
        
        <div className="pt-10">
          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-surface-tint text-on-primary py-6 text-xs font-bold tracking-[0.2em] uppercase hover:bg-primary-dim transition-all duration-500 shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="material-symbols-outlined animate-spin">refresh</span>
            ) : (
              'HOÀN TẤT ĐẶT HÀNG'
            )}
          </button>
        </div>

        <div className="mt-8 p-6 bg-surface-container-low border border-outline-variant/10">
          <p className="text-[11px] leading-relaxed text-on-surface-variant">
            Mọi giao dịch tại THE ATELIER đều được mã hóa và bảo mật tuyệt đối. Chúng tôi cam kết bảo vệ thông tin cá nhân của quý khách theo tiêu chuẩn quốc tế.
          </p>
        </div>
      </div>
    </aside>
  );
};

export default CheckoutSummary;
