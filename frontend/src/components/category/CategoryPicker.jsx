import React, { useState, useMemo } from 'react';

const CategoryPicker = ({ categories, value = [], onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Xây dựng cấu trúc cây từ danh sách phẳng
  const categoryTree = useMemo(() => {
    const map = {};
    const tree = [];
    
    categories.forEach(cat => {
      map[cat.categoryId] = { ...cat, children: [] };
    });
    
    categories.forEach(cat => {
      if (cat.parentId && map[cat.parentId]) {
        map[cat.parentId].children.push(map[cat.categoryId]);
      } else if (!cat.parentId) {
        tree.push(map[cat.categoryId]);
      }
    });
    
    return tree;
  }, [categories]);

  // Đảm bảo value luôn là mảng
  const selectedIds = Array.isArray(value) ? value : (value ? [value] : []);
  const selectedCategories = categories.filter(cat => selectedIds.includes(cat.categoryId));

  const toggleCategory = (id) => {
    let newValue;
    if (selectedIds.includes(id)) {
      newValue = selectedIds.filter(itemId => itemId !== id);
    } else {
      newValue = [...selectedIds, id];
    }
    onChange(newValue);
  };

  const renderCategoryItem = (cat, level = 0) => {
    const isSelected = selectedIds.includes(cat.categoryId);
    return (
      <div key={cat.categoryId}>
        <button
          type="button"
          onClick={() => toggleCategory(cat.categoryId)}
          className={`w-full text-left px-6 py-3 hover:bg-surface-container transition-colors font-body text-sm flex items-center justify-between ${
            isSelected ? 'text-secondary font-bold bg-secondary/5' : 'text-on-surface'
          }`}
          style={{ paddingLeft: `${level * 1.5 + 1.5}rem` }}
        >
          <div className="flex items-center gap-3">
            {level > 0 && <span className="material-symbols-outlined text-xs opacity-30">subdirectory_arrow_right</span>}
            {cat.name}
          </div>
          {isSelected && <span className="material-symbols-outlined text-sm">check_circle</span>}
        </button>
        {cat.children && cat.children.map(child => renderCategoryItem(child, level + 1))}
      </div>
    );
  };

  return (
    <div className="relative">
      <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-3 block">Danh mục (Chọn nhiều)</label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-transparent border-b border-outline-variant/40 py-2 font-body text-sm flex justify-between items-center group"
      >
        <div className="flex flex-wrap gap-2 overflow-hidden">
          {selectedCategories.length > 0 ? (
            selectedCategories.map(cat => (
              <span key={cat.categoryId} className="bg-secondary/10 text-secondary px-2 py-0.5 text-[10px] rounded-full font-bold">
                {cat.name}
              </span>
            ))
          ) : (
            <span className="text-on-surface-variant opacity-50 italic">Chọn danh mục sản phẩm</span>
          )}
        </div>
        <span className={`material-symbols-outlined transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          expand_more
        </span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-surface border border-outline-variant/10 shadow-2xl z-[70] max-h-[300px] overflow-y-auto mt-2 animate-in fade-in slide-in-from-top-2">
          <div className="py-2 border-b border-outline-variant/5 px-6 pb-2 mb-2">
             <p className="text-[9px] text-on-surface-variant uppercase tracking-widest font-bold">Nhấn để chọn hoặc bỏ chọn</p>
          </div>
          <div className="py-2">
            {categoryTree.map(cat => renderCategoryItem(cat))}
          </div>
        </div>
      )}
      
      {/* Click outside to close */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[65]" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default CategoryPicker;
