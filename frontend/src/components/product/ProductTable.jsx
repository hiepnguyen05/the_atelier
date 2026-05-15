import React from 'react';

const ProductRow = ({ product, onEdit, onDelete }) => {
  const primaryImage = product.productImages && product.productImages.length > 0 
    ? product.productImages[0].imageUrl 
    : 'https://via.placeholder.com/150?text=No+Image';

  return (
    <tr className="group hover:bg-surface-container-low/50 transition-colors border-b border-outline-variant/5">
      <td className="py-6 px-8">
        <div className="flex items-center gap-6">
          <div className="w-16 h-20 bg-surface-container overflow-hidden border border-outline-variant/10 shadow-sm">
            <img 
              src={primaryImage} 
              alt={product.name} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>
          <div>
            <h4 className="font-headline text-base text-on-surface mb-1">{product.name}</h4>
            <span className="font-body text-[10px] text-on-surface-variant/60 uppercase tracking-widest">{product.skuBase}</span>
          </div>
        </div>
      </td>
      <td className="py-6 px-8">
        <span className="font-label text-[10px] uppercase tracking-widest text-secondary font-bold">
          {product.category?.name || 'N/A'}
        </span>
      </td>
      <td className="py-6 px-8">
        <span className="font-body text-sm text-on-surface font-bold">
          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.basePrice)}
        </span>
      </td>
      <td className="py-6 px-8 text-center">
        <span className={`font-label text-[9px] uppercase tracking-[0.2em] px-3 py-1.5 font-bold ${
          product.status === 'active' 
            ? 'bg-success-container text-on-success-container' 
            : 'bg-error-container text-on-error-container'
        }`}>
          {product.status}
        </span>
      </td>
      <td className="py-6 px-8 text-right">
        <div className="flex justify-end gap-4">
          <button 
            onClick={() => onEdit(product)}
            className="text-on-surface-variant hover:text-primary transition-colors"
            title="Chỉnh sửa"
          >
            <span className="material-symbols-outlined text-lg">edit_note</span>
          </button>
          <button 
            onClick={() => onDelete(product.productId)}
            className="text-on-surface-variant hover:text-error transition-colors"
            title="Xóa"
          >
            <span className="material-symbols-outlined text-lg">delete</span>
          </button>
        </div>
      </td>
    </tr>
  );
};

const ProductTable = ({ products, loading, onEdit, onDelete }) => {
  return (
    <section className="bg-surface-container-lowest overflow-hidden border border-outline-variant/5">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container border-b border-outline-variant/10">
              <th className="py-6 px-8 font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Sản phẩm</th>
              <th className="py-6 px-8 font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Danh mục</th>
              <th className="py-6 px-8 font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Giá cơ bản</th>
              <th className="py-6 px-8 font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold text-center">Trạng thái</th>
              <th className="py-6 px-8 font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/5">
            {loading ? (
              <tr>
                <td colSpan="5" className="py-20 text-center">
                  <div className="inline-block w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <p className="mt-4 font-body text-xs text-on-surface-variant opacity-60 uppercase tracking-widest">Đang tải sản phẩm...</p>
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-20 text-center font-body text-xs text-on-surface-variant opacity-60 uppercase tracking-widest">
                  Không tìm thấy sản phẩm nào.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <ProductRow 
                  key={product.productId} 
                  product={product} 
                  onEdit={onEdit} 
                  onDelete={onDelete} 
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ProductTable;
