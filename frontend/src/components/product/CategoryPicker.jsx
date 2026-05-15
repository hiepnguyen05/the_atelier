import React, { useState, useMemo } from 'react';

const CategoryPicker = ({ categories, value, onChange }) => {
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

  const selectedCategory = categories.find(cat => cat.categoryId === value);

  const renderCategoryItem = (cat, level = 0) => (
    <div key={cat.categoryId}>
      <button
        type="button"
        onClick={() => {
          onChange(cat.categoryId);
          setIsOpen(false);
        }}
        className={`w-full text-left px-6 py-3 hover:bg-surface-container transition-colors font-body text-sm flex items-center gap-3 ${
          value === cat.categoryId ? 'text-secondary font-bold bg-secondary/5' : 'text-on-surface'
        }`}
        style={{ paddingLeft: `${level * 1.5 + 1.5}rem` }}
      >
        {level > 0 && <span className="material-symbols-outlined text-xs opacity-30">subdirectory_arrow_right</span>}
        {cat.name}
      </button>
      {cat.children && cat.children.map(child => renderCategoryItem(child, level + 1))}
    </div>
  );

  return (
    <div className="relative">
      <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-3 block font-bold">Danh mục</label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-transparent border-b border-outline-variant/40 py-2 font-body text-sm flex justify-between items-center group"
      >
        <span className={selectedCategory ? 'text-on-surface' : 'text-on-surface-variant opacity-50'}>
          {selectedCategory ? selectedCategory.name : 'Chọn danh mục sản phẩm'}
        </span>
        <span className={`material-symbols-outlined transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          expand_more
        </span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-surface border border-outline-variant/10 shadow-2xl z-[70] max-h-[300px] overflow-y-auto mt-2 animate-in fade-in slide-in-from-top-2">
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
