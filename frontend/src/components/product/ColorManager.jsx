import React from 'react';
import { LUXURY_PALETTE } from '../../constants/productConstants';
import SingleImageUpload from '../common/SingleImageUpload';


const ColorManager = ({ colors, onChange }) => {
  const addColor = () => {
    const newColor = {
      colorName: `Màu mới ${colors.length + 1}`,
      colorCode: '#000000',
      colorImage: ''
    };
    onChange([...colors, newColor]);
  };

  const updateColor = (index, field, value) => {
    const newColors = [...colors];
    newColors[index] = { ...newColors[index], [field]: value };
    onChange(newColors);
  };

  const removeColor = (index) => {
    const newColors = colors.filter((_, i) => i !== index);
    onChange(newColors);
  };

  const handlePaletteSelect = (index, color) => {
    const newColors = [...colors];
    newColors[index].colorCode = color.code;
    newColors[index].colorName = color.name;
    onChange(newColors);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-outline-variant/10 pb-4">
        <div>
          <label className="font-label text-[11px] uppercase tracking-widest text-on-surface font-bold">Màu sắc sản phẩm</label>
          <p className="font-body text-[10px] text-on-surface-variant opacity-60">
            Quản lý bảng màu và ảnh đại diện riêng cho từng phối màu
          </p>
        </div>
        <button
          type="button"
          onClick={addColor}
          className="bg-secondary/10 text-secondary px-4 py-2 font-label text-[10px] uppercase tracking-widest hover:bg-secondary hover:text-white transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">add_circle</span>
          Thêm màu sắc
        </button>
      </div>

      <div className="space-y-8">
        {colors.map((c, index) => (
          <div key={index} className="relative p-6 bg-surface-container-lowest border border-outline-variant/10 flex flex-col md:flex-row gap-8 items-start animate-in fade-in duration-300">
            <button 
              type="button" 
              onClick={() => removeColor(index)}
              className="absolute -top-3 -right-3 w-8 h-8 bg-error text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-md z-10"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>

            {/* Left side: Upload Image */}
            <div className="w-full md:w-1/3 space-y-2">
              <label className="font-label text-[9px] uppercase tracking-widest text-on-surface-variant block font-bold">Hình ảnh đại diện cho màu này</label>
              <SingleImageUpload
                imageUrl={c.colorImage}
                onChange={(url) => updateColor(index, 'colorImage', url)}
                placeholder="Tải ảnh cho màu..."
                folder="products/colors"
                aspectRatio="aspect-[3/4]"
              />
            </div>

            {/* Right side: Color fields */}
            <div className="flex-1 w-full space-y-6">
              <div>
                <label className="font-label text-[9px] uppercase tracking-widest text-on-surface-variant mb-2 block font-bold">Tên màu sắc</label>
                <input
                  type="text"
                  placeholder="VD: Midnight Black, Silk White..."
                  value={c.colorName || ''}
                  onChange={(e) => updateColor(index, 'colorName', e.target.value)}
                  className="w-full bg-transparent border-b border-outline-variant/20 py-2 font-body text-sm focus:outline-none focus:border-secondary"
                />
              </div>

              <div>
                <label className="font-label text-[9px] uppercase tracking-widest text-on-surface-variant mb-2 block font-bold">Mã màu (Hex Code)</label>
                <div className="flex flex-wrap gap-2.5 mb-4">
                  {LUXURY_PALETTE.map((color) => (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => handlePaletteSelect(index, color)}
                      className={`w-7 h-7 rounded-full border transition-all hover:scale-110 ${
                        c.colorCode === color.code ? 'border-secondary scale-110 shadow-sm' : 'border-outline-variant/20'
                      }`}
                      style={{ backgroundColor: color.code }}
                      title={color.name}
                    />
                  ))}
                  <div className="w-px h-7 bg-outline-variant/20 mx-1" />
                  <input
                    type="color"
                    value={c.colorCode || '#000000'}
                    onChange={(e) => updateColor(index, 'colorCode', e.target.value)}
                    className="w-7 h-7 border-0 p-0 cursor-pointer bg-transparent"
                    title="Tùy chỉnh màu"
                  />
                </div>
                <input
                  type="text"
                  value={c.colorCode || ''}
                  onChange={(e) => updateColor(index, 'colorCode', e.target.value)}
                  className="w-32 bg-transparent border-b border-outline-variant/20 py-1 font-body text-xs focus:outline-none focus:border-secondary"
                  placeholder="#000000"
                />
              </div>
            </div>
          </div>
        ))}

        {colors.length === 0 && (
          <div className="py-12 text-center bg-surface-container-low/30 border border-dashed border-outline-variant/20">
            <p className="font-body text-xs text-on-surface-variant opacity-60">Chưa có cấu hình màu sắc. Nhấp "Thêm màu sắc" để bắt đầu.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ColorManager;
