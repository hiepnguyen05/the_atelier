import React, { useState } from 'react';

const BrandPicker = ({ brands, value, onChange, onQuickAdd }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newBrandName, setNewBrandName] = useState('');

  const selectedBrand = brands.find(b => b.brandId === value);

  const handleAdd = async () => {
    if (!newBrandName.trim()) return;
    await onQuickAdd(newBrandName);
    setIsAdding(false);
    setNewBrandName('');
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-3 block flex justify-between items-center">
        Thương hiệu
        <button 
          type="button" 
          onClick={() => setIsAdding(!isAdding)}
          className="text-secondary hover:underline flex items-center gap-1 normal-case tracking-normal font-normal"
        >
          <span className="material-symbols-outlined text-[14px]">{isAdding ? 'close' : 'add_circle'}</span>
          {isAdding ? 'Hủy' : 'Thêm mới'}
        </button>
      </label>

      {isAdding ? (
        <div className="flex gap-3 animate-in fade-in slide-in-from-right-2 duration-300">
          <input
            type="text"
            autoFocus
            value={newBrandName}
            onChange={(e) => setNewBrandName(e.target.value)}
            placeholder="Nhập tên thương hiệu..."
            className="flex-1 bg-transparent border-b border-secondary py-2 font-body text-sm focus:outline-none"
          />
          <button 
            type="button" 
            onClick={handleAdd}
            className="bg-secondary text-white px-6 py-2 text-[10px] uppercase font-bold tracking-widest hover:opacity-90 transition-all"
          >
            Lưu
          </button>
        </div>
      ) : (
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="w-full bg-transparent border-b border-outline-variant/40 py-2 font-body text-sm flex justify-between items-center group text-left"
          >
            <span className={selectedBrand ? 'text-on-surface text-lg' : 'text-on-surface-variant opacity-50'}>
              {selectedBrand ? selectedBrand.name : 'Chọn thương hiệu'}
            </span>
            <span className={`material-symbols-outlined transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
              expand_more
            </span>
          </button>

          {isOpen && (
            <div className="absolute top-full left-0 w-full bg-surface border border-outline-variant/10 shadow-2xl z-[70] max-h-[250px] overflow-y-auto mt-2 animate-in fade-in slide-in-from-top-2">
              <div className="py-2">
                {brands.map(brand => (
                  <button
                    key={brand.brandId}
                    type="button"
                    onClick={() => {
                      onChange(brand.brandId);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-6 py-3 hover:bg-surface-container transition-colors font-body text-sm ${
                      value === brand.brandId ? 'text-secondary font-bold bg-secondary/5' : 'text-on-surface'
                    }`}
                  >
                    {brand.name}
                  </button>
                ))}
                {brands.length === 0 && (
                  <div className="px-6 py-4 text-xs text-on-surface-variant opacity-60 italic text-center">
                    Chưa có thương hiệu nào
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
      
      {isOpen && (
        <div className="fixed inset-0 z-[65]" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
};

export default BrandPicker;
