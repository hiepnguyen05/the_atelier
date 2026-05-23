import React from 'react';

const CatalogSidebar = ({ categories, selectedCategoryId, onCategorySelect }) => {
  if (categories.length === 0) return null;

  return (
    <aside className="w-full lg:w-64 space-y-12 shrink-0 lg:sticky lg:top-28 h-fit">
      <section>
        <h3 className="font-label text-[10px] tracking-[0.1em] text-on-surface uppercase mb-6">Danh Mục</h3>
        <ul className="space-y-4">
          <li>
            <button
              onClick={() => onCategorySelect('')}
              className={`text-xs font-label tracking-widest uppercase transition-colors bg-transparent border-none p-0 text-left cursor-pointer ${
                !selectedCategoryId 
                  ? 'text-secondary font-bold border-b border-secondary/30 pb-0.5' 
                  : 'text-on-surface-variant hover:text-secondary'
              }`}
            >
              Tất cả danh mục
            </button>
          </li>
          {categories.map(cat => (
            <li key={cat.categoryId}>
              <button
                onClick={() => onCategorySelect(cat.categoryId.toString())}
                className={`text-xs font-label tracking-widest uppercase transition-colors bg-transparent border-none p-0 text-left cursor-pointer ${
                  selectedCategoryId === cat.categoryId.toString() 
                    ? 'text-secondary font-bold border-b border-secondary/30 pb-0.5' 
                    : 'text-on-surface-variant hover:text-secondary'
                }`}
              >
                {cat.name}
              </button>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );
};

export default CatalogSidebar;
