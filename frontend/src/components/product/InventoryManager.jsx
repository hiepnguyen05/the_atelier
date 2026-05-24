import React from 'react';

const InventoryManager = ({ 
  colors, 
  suggestedSizes = [], 
  sizeLabel = 'Kích cỡ', 
  variants = [], 
  onChange, 
  skuBase,
  enabledSizes,
  setEnabledSizes,
  hasSizes,
  setHasSizes
}) => {
  const isSizeSupported = suggestedSizes.length > 0;
  const currentHasSizes = isSizeSupported && hasSizes;

  const toggleSize = (size) => {
    if (enabledSizes.includes(size)) {
      setEnabledSizes(enabledSizes.filter(s => s !== size));
    } else {
      setEnabledSizes([...enabledSizes, size]);
    }
  };

  const updateVariantValue = (colorName, sizeName, field, value) => {
    const updated = variants.map(v => {
      if ((v.colorName || 'Màu tiêu chuẩn') === colorName && (v.sizeName || '') === sizeName) {
        return { ...v, [field]: value };
      }
      return v;
    });
    onChange(updated);
  };

  const handleQuickStockChange = (colorName, value) => {
    const stockVal = value === '' ? 0 : parseInt(value);
    if (isNaN(stockVal)) return;
    
    const updated = variants.map(v => {
      if ((v.colorName || 'Màu tiêu chuẩn') === colorName) {
        return { ...v, stockQuantity: stockVal };
      }
      return v;
    });
    onChange(updated);
  };

  const getVariant = (colorName, sizeName) => {
    return variants.find(v => (v.colorName || 'Màu tiêu chuẩn') === colorName && (v.sizeName || '') === sizeName);
  };

  const renderInventoryTable = (color) => {
    const colorName = color.colorName || 'Màu tiêu chuẩn';
    const sizes = currentHasSizes ? (enabledSizes.length > 0 ? enabledSizes : ['']) : [''];

    return (
      <div key={colorName} className="p-6 bg-surface-container-lowest border border-outline-variant/10 animate-in fade-in duration-300">
        
        {/* Header of color segment */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-outline-variant/5 pb-3">
          <div className="flex items-center gap-3">
            <span className="w-5 h-5 rounded-full border border-outline-variant/30" style={{ backgroundColor: color.colorCode }} />
            <span className="font-label text-xs uppercase tracking-widest font-bold">{colorName}</span>
          </div>

          {currentHasSizes && enabledSizes.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="font-body text-[11px] text-on-surface-variant/80">Đặt nhanh tồn kho (tất cả size):</span>
              <input
                type="number"
                min="0"
                onChange={(e) => handleQuickStockChange(colorName, e.target.value)}
                className="w-24 bg-surface-container border border-outline-variant/20 px-2 py-1 font-body text-xs focus:outline-none focus:border-secondary"
                placeholder="VD: 10"
              />
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-body text-xs border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/10 text-[10px] font-label uppercase tracking-wider text-on-surface-variant">
                {currentHasSizes && enabledSizes.length > 0 && <th className="py-2.5 pr-4 font-bold">{sizeLabel}</th>}
                <th className="py-2.5 px-4 font-bold">Mã SKU Biến thể</th>
                <th className="py-2.5 px-4 font-bold">Số lượng tồn kho</th>
                <th className="py-2.5 pl-4 font-bold">Phụ phí (VND)</th>
              </tr>
            </thead>
            <tbody>
              {sizes.map((size) => {
                const v = getVariant(colorName, size) || {
                  skuVariant: `${skuBase}-${colorName}${size ? `-${size}` : ''}`,
                  stockQuantity: 0,
                  priceAdjustment: 0
                };

                return (
                  <tr key={size} className="border-b border-outline-variant/5 hover:bg-surface-container-low/20 transition-colors">
                    {currentHasSizes && enabledSizes.length > 0 && (
                      <td className="py-3 pr-4 font-bold text-on-surface text-[13px]">{size}</td>
                    )}
                    <td className="py-3 px-4">
                      <input
                        type="text"
                        value={v.skuVariant || ''}
                        onChange={(e) => updateVariantValue(colorName, size, 'skuVariant', e.target.value)}
                        className="w-full bg-transparent border-b border-outline-variant/20 py-1 font-mono text-[11px] focus:outline-none focus:border-secondary"
                        placeholder="Nhập SKU..."
                      />
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="number"
                        min="0"
                        value={v.stockQuantity || 0}
                        onChange={(e) => updateVariantValue(colorName, size, 'stockQuantity', parseInt(e.target.value) || 0)}
                        className="w-32 bg-transparent border-b border-outline-variant/20 py-1 font-body text-xs focus:outline-none focus:border-secondary"
                        placeholder="0"
                      />
                    </td>
                    <td className="py-3 pl-4">
                      <input
                        type="number"
                        value={v.priceAdjustment || 0}
                        onChange={(e) => updateVariantValue(colorName, size, 'priceAdjustment', parseInt(e.target.value) || 0)}
                        className="w-32 bg-transparent border-b border-outline-variant/20 py-1 font-body text-xs focus:outline-none focus:border-secondary"
                        placeholder="0"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div className="border-b border-outline-variant/10 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <label className="font-label text-[11px] uppercase tracking-widest text-on-surface font-bold">Cấu hình Tồn kho &amp; Kích cỡ</label>
          <p className="font-body text-[10px] text-on-surface-variant opacity-60">
            Nhập số lượng tồn kho và cấu hình giá cho từng kích cỡ của mỗi màu sắc. Bạn có thể sử dụng tính năng đặt nhanh tồn kho cho tất cả kích cỡ của một màu.
          </p>
        </div>

        {/* Toggle size classification */}
        {isSizeSupported && (
          <div className="flex items-center gap-3 bg-surface-container-low px-4 py-2 border border-outline-variant/10">
            <input
              type="checkbox"
              id="toggle-has-sizes"
              checked={hasSizes}
              onChange={(e) => setHasSizes(e.target.checked)}
              className="w-4 h-4 cursor-pointer accent-secondary rounded border-outline-variant/30 text-secondary focus:ring-secondary"
            />
            <label htmlFor="toggle-has-sizes" className="font-label text-[10px] uppercase tracking-widest text-on-surface font-bold cursor-pointer select-none">
              Phân loại theo kích cỡ
            </label>
          </div>
        )}
      </div>

      {/* Customize Size Visibility (Checkboxes) */}
      {currentHasSizes && (
        <div className="space-y-3 bg-surface-container-low/50 p-4 border border-outline-variant/10 animate-in slide-in-from-top-4 duration-300">
          <span className="font-label text-[9px] uppercase tracking-widest text-on-surface-variant font-bold">Kích cỡ áp dụng (Ẩn/Hiện size số)</span>
          <div className="flex flex-wrap gap-3">
            {suggestedSizes.map((size) => {
              const isEnabled = enabledSizes.includes(size);
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleSize(size)}
                  className={`px-3 py-1 font-body text-xs border transition-all duration-300 ${
                    isEnabled 
                      ? 'bg-on-background text-on-primary border-on-background font-bold shadow-sm' 
                      : 'border-outline-variant/30 text-on-surface-variant hover:border-on-surface hover:text-on-surface bg-transparent'
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
          <p className="text-[9px] text-on-surface-variant/70 italic">
            * Nhấp để Bật/Tắt các kích cỡ. Các kích cỡ tắt đi sẽ bị ẩn và không tạo biến thể cho sản phẩm.
          </p>
        </div>
      )}

      {/* Tables List */}
      <div className="space-y-6">
        {colors.map((color) => renderInventoryTable(color))}

        {colors.length === 0 && (
          <div className="py-12 text-center bg-surface-container-low/30 border border-dashed border-outline-variant/20">
            <p className="font-body text-xs text-on-surface-variant opacity-60">
              Vui lòng thêm ít nhất một màu sắc ở mục trên để bắt đầu cấu hình kho hàng.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryManager;
