import React from 'react';

const ProductInfo = ({
  product,
  formatPrice,
  sizeLabel,
  colorLabel,
  uniqueColors,
  selectedColor,
  setSelectedColor,
  sizesToDisplay,
  selectedSize,
  setSelectedSize,
  openSizeGuide,
  handleAddToCart,
  productTypeConfig,
  productCategory,
  specifications,
}) => {
  return (
    <div className="lg:col-span-5 lg:sticky lg:top-28 lg:self-start lg:max-h-[calc(100vh-9rem)] lg:overflow-y-auto no-scrollbar w-full lg:pl-6">
      <div className="space-y-10 pb-12 pr-1">
        
        {/* Product Info */}
        <div className="space-y-4">
          <p className="font-label text-[10px] tracking-[0.25em] text-secondary font-semibold uppercase">
            {product.brand?.name || 'THE ATELIER'} / {productCategory?.name || productTypeConfig?.label}
            {product.gender && product.gender !== 'unisex' ? ` (${product.gender === 'nam' ? 'Nam' : 'Nữ'})` : ''}
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-light tracking-tight leading-tight text-on-surface">
            {product.name}
          </h1>
          <p className="font-display italic text-2xl text-on-surface/90 pt-1">
            {formatPrice(product.basePrice)}
          </p>
        </div>

        {/* Description */}
        <p className="font-body text-[13px] leading-relaxed text-on-surface-variant whitespace-pre-line border-t border-outline-variant/10 pt-6">
          {product.description || 'Sản phẩm may đo thiết kế cao cấp nằm trong bộ sưu tập mới của xưởng The Atelier. Chất liệu tuyển chọn tỉ mỉ mang lại phom dáng vượt thời gian.'}
        </p>

        {/* Selectors */}
        <div className="space-y-8 pt-2">
          {/* Color Selection if any */}
          {colorLabel && uniqueColors.length > 1 && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-label text-[9px] tracking-widest text-on-surface/50 uppercase">{colorLabel}</span>
                <span className="font-label text-xs uppercase tracking-wider text-on-surface font-semibold">{selectedColor}</span>
              </div>
              <div className="flex flex-wrap gap-4 pt-2">
                {uniqueColors.map(color => {
                  const isSelected = selectedColor === color.name;
                  return (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => setSelectedColor(color.name)}
                      className={`relative p-0 bg-transparent border-none outline-none transition-all duration-300 ${
                        isSelected 
                          ? 'ring-1 ring-on-surface ring-offset-2 scale-105 z-10' 
                          : 'opacity-70 hover:opacity-100 hover:scale-105'
                      }`}
                      title={color.name}
                    >
                      {color.image ? (
                        <div className="w-11 h-14 bg-surface-container overflow-hidden border border-outline-variant/10">
                          <img 
                            src={color.image} 
                            alt={color.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div 
                          className="w-7 h-7 rounded-full border border-outline-variant/30" 
                          style={{ backgroundColor: color.code }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Size Selection */}
          {sizeLabel && sizesToDisplay.length > 0 && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-label text-[9px] tracking-widest text-on-surface/50 uppercase">Chọn {sizeLabel}</span>
                <span 
                  onClick={openSizeGuide}
                  className="font-label text-[9px] tracking-widest text-secondary hover:underline cursor-pointer uppercase transition-opacity hover:opacity-85"
                >
                  Hướng Dẫn Size
                </span>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {sizesToDisplay.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-11 h-11 flex items-center justify-center border font-label text-xs uppercase transition-all duration-300 ${
                      selectedSize === size 
                        ? 'border-on-surface bg-on-background text-on-primary font-bold shadow-sm' 
                        : 'border-outline-variant/20 text-on-surface-variant hover:border-on-surface hover:text-on-surface'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="pt-2">
          <button 
            onClick={handleAddToCart}
            className="w-full bg-on-background text-on-primary py-5 font-label text-[10px] tracking-[0.25em] font-medium hover:bg-secondary hover:text-on-secondary transition-all duration-500 uppercase relative group overflow-hidden"
          >
            Thêm Vào Giỏ Hàng
          </button>
        </div>

        {/* Accordions */}
        <div className="border-t border-outline-variant/15 pt-6 space-y-4">
          {productTypeConfig?.specsDefinition?.length > 0 && Object.keys(specifications).some(k => k !== 'custom_specs' && specifications[k]) ? (
            <details open className="group border-b border-outline-variant/10 pb-4">
              <summary className="flex justify-between items-center cursor-pointer list-none py-2">
                <span className="font-label text-[11px] tracking-widest uppercase text-on-surface/80">Thông Số Chi Tiết</span>
                <span className="material-symbols-outlined group-open:rotate-180 transition-transform duration-300 text-sm">expand_more</span>
              </summary>
              <div className="pt-2 pb-4 font-body text-xs text-on-surface-variant leading-relaxed space-y-4">
                {product.material && (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-1 md:gap-4 border-b border-outline-variant/5 pb-3 pt-1 items-start">
                    <span className="col-span-1 md:col-span-4 font-label text-[9px] uppercase tracking-wider opacity-60 pt-0.5">Chất liệu</span>
                    <span className="col-span-1 md:col-span-8 text-on-surface font-medium text-left leading-relaxed">{product.material}</span>
                  </div>
                )}
                {productTypeConfig.specsDefinition.map(spec => {
                  const val = specifications[spec.key];
                  if (!val) return null;
                  return (
                    <div key={spec.key} className="grid grid-cols-1 md:grid-cols-12 gap-1 md:gap-4 border-b border-outline-variant/5 pb-3 pt-1 items-start">
                      <span className="col-span-1 md:col-span-4 font-label text-[9px] uppercase tracking-wider opacity-60 pt-0.5">{spec.label}</span>
                      <span className="col-span-1 md:col-span-8 text-on-surface font-medium whitespace-pre-line text-left leading-relaxed">{val}</span>
                    </div>
                  );
                })}
              </div>
            </details>
          ) : specifications?.custom_specs ? (
            <details open className="group border-b border-outline-variant/10 pb-4">
              <summary className="flex justify-between items-center cursor-pointer list-none py-2">
                <span className="font-label text-[11px] tracking-widest uppercase text-on-surface/80">Thông Số Chi Tiết</span>
                <span className="material-symbols-outlined group-open:rotate-180 transition-transform duration-300 text-sm">expand_more</span>
              </summary>
              <div className="pt-2 pb-4 font-body text-xs text-on-surface-variant leading-relaxed space-y-4">
                {product.material && (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-1 md:gap-4 border-b border-outline-variant/5 pb-3 pt-1 items-start">
                    <span className="col-span-1 md:col-span-4 font-label text-[9px] uppercase tracking-wider opacity-60 pt-0.5">Chất liệu</span>
                    <span className="col-span-1 md:col-span-8 text-on-surface font-medium text-left leading-relaxed">{product.material}</span>
                  </div>
                )}
                <div className="text-on-surface font-medium whitespace-pre-line leading-relaxed text-left pt-2">
                  {specifications.custom_specs}
                </div>
              </div>
            </details>
          ) : (
            <details open className="group border-b border-outline-variant/10 pb-4">
              <summary className="flex justify-between items-center cursor-pointer list-none py-2">
                <span className="font-label text-[11px] tracking-widest uppercase text-on-surface/80">Chất Liệu &amp; Thủ Công</span>
                <span className="material-symbols-outlined group-open:rotate-180 transition-transform duration-300 text-sm">expand_more</span>
              </summary>
              <div className="pt-2 pb-4 font-body text-xs text-on-surface-variant leading-relaxed space-y-2">
                {product.material && <p><strong>Chất liệu chính:</strong> {product.material}</p>}
                <p>Chất liệu cao cấp từ nguồn cung ứng tuyển chọn.</p>
                <p>Các đường may nội thất và chi tiết viền được hoàn thiện thủ công tỉ mỉ.</p>
                <p>Khuy khóa thiết kế riêng đồng bộ với tinh thần của Atelier.</p>
              </div>
            </details>
          )}
          
          <details open className="group border-b border-outline-variant/10 pb-4">
            <summary className="flex justify-between items-center cursor-pointer list-none py-2">
              <span className="font-label text-[11px] tracking-widest uppercase text-on-surface/80">Giao Hàng &amp; Đổi Trả</span>
              <span className="material-symbols-outlined group-open:rotate-180 transition-transform duration-300 text-sm">expand_more</span>
            </summary>
            <div className="pt-2 pb-4 font-body text-xs text-on-surface-variant leading-relaxed space-y-2">
              <p>Giao hàng tiêu chuẩn miễn phí toàn quốc cho đơn hàng từ 1.000.000 ₫. Thời gian vận chuyển từ 2-4 ngày làm việc.</p>
              <p>Chấp nhận đổi trả trong vòng 7 ngày kể từ khi nhận hàng đối với sản phẩm còn nguyên tem mác.</p>
            </div>
          </details>
        </div>

      </div>
    </div>
  );
};

export default ProductInfo;
