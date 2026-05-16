import React from 'react';
import { LUXURY_PALETTE } from '../../constants/productConstants';

const VariantManager = ({ variants, onChange, skuBase }) => {
  const addVariant = () => {
    const newVariant = {
      skuVariant: `${skuBase}-${variants.length + 1}`,
      sizeName: '',
      colorName: '',
      colorCode: '#000000',
      stockQuantity: 0,
      priceAdjustment: 0
    };
    onChange([...variants, newVariant]);
  };

  const updateVariant = (index, field, value) => {
    const newVariants = [...variants];
    newVariants[index][field] = value;
    onChange(newVariants);
  };

  const removeVariant = (index) => {
    onChange(variants.filter((_, i) => i !== index));
  };

  const handlePaletteSelect = (index, color) => {
    const newVariants = [...variants];
    newVariants[index].colorCode = color.code;
    newVariants[index].colorName = color.name;
    onChange(newVariants);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center border-b border-outline-variant/10 pb-4">
        <div>
          <label className="font-label text-[11px] uppercase tracking-widest text-on-surface font-bold">Biến thể sản phẩm</label>
          <p className="font-body text-[10px] text-on-surface-variant opacity-60">Kích thước, màu sắc và số lượng tồn kho</p>
        </div>
        <button
          type="button"
          onClick={addVariant}
          className="bg-secondary/10 text-secondary px-4 py-2 font-label text-[10px] uppercase tracking-widest hover:bg-secondary hover:text-white transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">add_circle</span>
          Thêm biến thể
        </button>
      </div>

      <div className="space-y-12">
        {variants.map((v, index) => (
          <div key={index} className="relative p-6 bg-surface-container-lowest border border-outline-variant/10 animate-in fade-in slide-in-from-left-4 duration-300">
            <button 
              type="button" 
              onClick={() => removeVariant(index)}
              className="absolute -top-3 -right-3 w-8 h-8 bg-error text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-md z-10"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* SKU & Size */}
              <div className="space-y-6">
                <div>
                  <label className="font-label text-[9px] uppercase tracking-widest text-on-surface-variant mb-2 block font-bold">Mã SKU Biến thể</label>
                  <input
                    type="text"
                    value={v.skuVariant}
                    onChange={(e) => updateVariant(index, 'skuVariant', e.target.value)}
                    className="w-full bg-transparent border-b border-outline-variant/20 py-2 font-body text-xs focus:outline-none focus:border-secondary"
                  />
                </div>
                <div>
                  <label className="font-label text-[9px] uppercase tracking-widest text-on-surface-variant mb-2 block font-bold">Kích cỡ (Size)</label>
                  <input
                    type="text"
                    placeholder="S, M, L, XL..."
                    value={v.sizeName}
                    onChange={(e) => updateVariant(index, 'sizeName', e.target.value)}
                    className="w-full bg-transparent border-b border-outline-variant/20 py-2 font-body text-xs focus:outline-none focus:border-secondary"
                  />
                </div>
              </div>

              {/* Color Selection */}
              <div className="md:col-span-2 space-y-4">
                <label className="font-label text-[9px] uppercase tracking-widest text-on-surface-variant mb-2 block font-bold">Bảng màu Atelier</label>
                <div className="flex flex-wrap gap-3 mb-4">
                  {LUXURY_PALETTE.map((color) => (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => handlePaletteSelect(index, color)}
                      className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-125 ${
                        v.colorCode === color.code ? 'border-secondary scale-110 shadow-lg' : 'border-outline-variant/20'
                      }`}
                      style={{ backgroundColor: color.code }}
                      title={color.name}
                    />
                  ))}
                  <div className="w-px h-8 bg-outline-variant/20 mx-2" />
                  <input
                    type="color"
                    value={v.colorCode}
                    onChange={(e) => updateVariant(index, 'colorCode', e.target.value)}
                    className="w-8 h-8 border-0 p-0 cursor-pointer bg-transparent"
                    title="Tùy chỉnh màu"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Tên màu sắc (VD: Midnight Black)"
                  value={v.colorName}
                  onChange={(e) => updateVariant(index, 'colorName', e.target.value)}
                  className="w-full bg-transparent border-b border-outline-variant/20 py-2 font-body text-xs focus:outline-none focus:border-secondary"
                />
              </div>

              {/* Stock & Price */}
              <div className="md:col-span-3 grid grid-cols-2 gap-8 pt-4 border-t border-outline-variant/5">
                <div>
                  <label className="font-label text-[9px] uppercase tracking-widest text-on-surface-variant mb-2 block font-bold">Số lượng tồn kho</label>
                  <input
                    type="number"
                    min="0"
                    value={v.stockQuantity}
                    onChange={(e) => updateVariant(index, 'stockQuantity', parseInt(e.target.value))}
                    className="w-full bg-transparent border-b border-outline-variant/20 py-2 font-body text-xs focus:outline-none focus:border-secondary"
                  />
                </div>
                <div>
                  <label className="font-label text-[9px] uppercase tracking-widest text-on-surface-variant mb-2 block font-bold">Phụ phí (Nếu có)</label>
                  <input
                    type="number"
                    value={v.priceAdjustment}
                    onChange={(e) => updateVariant(index, 'priceAdjustment', parseInt(e.target.value))}
                    className="w-full bg-transparent border-b border-outline-variant/20 py-2 font-body text-xs focus:outline-none focus:border-secondary"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {variants.length === 0 && (
          <div className="py-12 text-center bg-surface-container-low/30 border border-dashed border-outline-variant/20">
            <p className="font-body text-xs text-on-surface-variant opacity-60">Sản phẩm này chưa có biến thể nào. Hãy thêm Kích cỡ hoặc Màu sắc.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VariantManager;
