import React from 'react';

const CatalogHeader = ({ categories, productTypes, categoryId, productType, sortValue, onSortChange }) => {
  const currentTitle = categoryId && categories.length > 0 
    ? categories.find(c => c.categoryId === parseInt(categoryId))?.name 
    : productType ? productTypes.find(t => t.value === productType)?.label : 'Sản Phẩm';

  return (
    <header className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8">
      <div className="max-w-2xl">
        <p className="font-label text-[10px] tracking-[0.2em] text-secondary mb-4 uppercase">Lưu Trữ Xuân / Hè</p>
        <h1 className="text-6xl md:text-8xl font-headline italic tracking-tighter leading-none mb-6">
          {currentTitle}
        </h1>
        <p className="text-on-surface-variant font-body leading-relaxed max-w-md">
          Tuyển tập những thiết kế lưu trữ và phom dáng mùa mới nhất, được chế tác với sự tỉ mỉ tuyệt đối tại xưởng may Paris của chúng tôi.
        </p>
      </div>
      
      <div className="flex items-center gap-4 text-xs font-label tracking-widest text-on-surface-variant border-b border-outline-variant/20 pb-2">
        <span>SẮP XẾP:</span>
        <select
          value={sortValue}
          onChange={(e) => onSortChange('sort', e.target.value)}
          className="bg-transparent border-none font-label text-[10px] tracking-widest text-on-surface-variant focus:ring-0 cursor-pointer uppercase p-0"
        >
          <option value="newest">Mới Nhất</option>
          <option value="price_asc">Giá: Thấp Đến Cao</option>
          <option value="price_desc">Giá: Cao Đến Thấp</option>
          <option value="name_asc">Tên: A Đến Z</option>
        </select>
      </div>
    </header>
  );
};

export default CatalogHeader;
