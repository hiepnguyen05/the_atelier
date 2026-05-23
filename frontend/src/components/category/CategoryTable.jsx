import React from 'react';
import Loading from '../common/Loading';

const CategoryRow = ({ category, onEdit, onDelete, onViewSub }) => (
  <tr className="group hover:bg-surface-container-low/50 transition-colors">
    <td className="py-6 px-8 font-body text-[11px] text-on-surface-variant">#CAT-{String(category.categoryId).padStart(3, '0')}</td>
    <td className="py-6 px-8">
      <span className="font-headline text-lg text-on-surface">{category.name}</span>
    </td>
    <td className="py-6 px-8 max-w-xs">
      <p className="font-body text-xs text-on-surface-variant leading-relaxed">
        {category.description || 'Không có mô tả.'}
      </p>
    </td>
    <td className="py-6 px-8 text-center">
      <span className="font-label text-[11px] bg-primary-container px-3 py-1 text-on-primary-container">
        {category.productCount || 0} SP
      </span>
    </td>
    <td className="py-6 px-8 text-center">
      <button 
        onClick={() => onViewSub(category)}
        className="font-label text-[10px] uppercase tracking-widest text-secondary border border-secondary/20 px-4 py-2 hover:bg-secondary hover:text-white transition-all flex items-center gap-2 mx-auto"
      >
        <span className="material-symbols-outlined text-sm">account_tree</span>
        Xem mục con
      </button>
    </td>
    <td className="py-6 px-8 text-right">
      <div className="flex justify-end gap-4">
        <button 
          onClick={() => onEdit(category)}
          className="text-on-surface-variant hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-lg">edit_note</span>
        </button>
        <button 
          onClick={() => onDelete(category.categoryId)}
          className="text-on-surface-variant hover:text-error transition-colors"
        >
          <span className="material-symbols-outlined text-lg">delete</span>
        </button>
      </div>
    </td>
  </tr>
);

const CategoryTable = ({ categories, loading, onEdit, onDelete, onViewSub }) => {
  return (
    <section className="bg-surface-container-lowest overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container border-b border-outline-variant/10">
              <th className="py-6 px-8 font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">ID</th>
              <th className="py-6 px-8 font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Tên danh mục</th>
              <th className="py-6 px-8 font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Mô tả</th>
              <th className="py-6 px-8 font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold text-center">Số lượng</th>
              <th className="py-6 px-8 font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold text-center">Cấu trúc</th>
              <th className="py-6 px-8 font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10">
            {loading ? (
              <tr>
                <td colSpan="6" className="py-12">
                  <Loading size={70} text="Đang tải dữ liệu..." />
                </td>
              </tr>
            ) : categories.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-12 text-center font-body text-xs text-on-surface-variant opacity-60 uppercase tracking-widest">
                  Chưa có danh mục nào.
                </td>
              </tr>
            ) : (
              categories.map((category, index) => (
                <CategoryRow 
                  key={`${category.categoryId || 'new'}-${index}`} 
                  category={category} 
                  onEdit={onEdit} 
                  onDelete={onDelete} 
                  onViewSub={onViewSub}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="px-8 py-8 flex justify-between items-center bg-surface-container-low/30">
        <span className="font-label text-[10px] text-on-surface-variant tracking-wider uppercase">
          Hiển thị {categories.length} danh mục
        </span>
        <div className="flex gap-4">
          <button className="w-10 h-10 border border-outline-variant/20 flex items-center justify-center hover:bg-surface-container transition-colors disabled:opacity-20" disabled>
            <span className="material-symbols-outlined text-sm">chevron_left</span>
          </button>
          <button className="w-10 h-10 border border-outline-variant/20 flex items-center justify-center hover:bg-surface-container transition-colors">
            <span className="material-symbols-outlined text-sm">chevron_right</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default CategoryTable;
