import React from 'react';

const StatItem = ({ label, value, subValue, borderRight = true }) => (
  <div className={`bg-surface-container-low p-8 ${borderRight ? 'border-r border-outline-variant/10' : ''}`}>
    <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-4 block">{label}</span>
    <div className="flex items-baseline gap-2">
      <span className="font-headline text-4xl text-on-surface">{value}</span>
      {subValue && <span className="font-body text-xs text-secondary">{subValue}</span>}
    </div>
  </div>
);

const CategoryStats = ({ totalCategories }) => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-0 mb-16">
      <StatItem label="Tổng số Danh mục" value={totalCategories} subValue="+2 trong tháng" />
      <StatItem label="Sản phẩm hoạt động" value="1,482" subValue="Toàn cửa hàng" />
      <StatItem label="Danh mục phổ biến" value="Knitwear" subValue="32% Doanh số" borderRight={false} />
    </section>
  );
};

export default CategoryStats;
