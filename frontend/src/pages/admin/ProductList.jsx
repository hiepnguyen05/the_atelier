import React, { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import ProductTable from '../../components/product/ProductTable';
import ProductForm from '../../components/product/ProductForm';
import { useProducts } from '../../hooks/useProducts';
import ConfirmModal from '../../components/common/ConfirmModal';

const ProductList = () => {
  const {
    products,
    pagination,
    loading,
    error,
    params,
    setParams,
    deleteProduct,
    createProduct,
    updateProduct
  } = useProducts();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const handleAdd = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleSave = async (data) => {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.productId, data);
      } else {
        await createProduct(data);
      }
      setIsFormOpen(false);
    } catch (err) {
      alert('Lỗi khi lưu sản phẩm: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteClick = (id) => {
    setDeletingId(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteProduct(deletingId);
      setIsConfirmOpen(false);
    } catch (err) {
      alert('Lỗi khi xóa sản phẩm: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <AdminLayout searchPlaceholder="TÌM KIẾM SẢN PHẨM...">
      {/* Header Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
        <div className="max-w-2xl">
          <nav className="mb-4">
            <span className="font-label text-[10px] uppercase tracking-[0.3em] text-secondary">Hệ thống Quản trị</span>
          </nav>
          <h2 className="font-headline text-5xl text-on-surface tracking-tight mb-4">Sản phẩm</h2>
          <p className="font-body text-base text-on-surface-variant/80 max-w-lg leading-relaxed">
            Quản lý các tác phẩm nghệ thuật của bạn. Từ khâu thiết kế đến khi hoàn thiện, mỗi sản phẩm đều mang một giá trị riêng biệt.
          </p>
        </div>
        <div>
          <button 
            onClick={handleAdd}
            className="bg-surface-tint text-on-primary px-10 py-4 font-label text-[11px] uppercase tracking-[0.2em] font-bold hover:opacity-90 transition-all duration-300 flex items-center gap-3 shadow-lg"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Thêm Sản phẩm Mới
          </button>
        </div>
      </section>

      {/* Filter & Pagination Info */}
      <div className="flex justify-between items-center mb-8 bg-surface-container-low/50 px-8 py-4 border border-outline-variant/5">
        <div className="flex gap-8">
          <span className="font-label text-[10px] text-on-surface-variant tracking-wider uppercase">
            Tổng cộng: <span className="text-on-surface font-bold">{pagination.totalItems} sản phẩm</span>
          </span>
          <span className="font-label text-[10px] text-on-surface-variant tracking-wider uppercase">
            Trang: <span className="text-on-surface font-bold">{pagination.currentPage} / {pagination.totalPages}</span>
          </span>
        </div>
        
        <div className="flex gap-4">
           <button 
             disabled={params.page <= 1}
             onClick={() => setParams(prev => ({ ...prev, page: prev.page - 1 }))}
             className="material-symbols-outlined text-xl text-on-surface-variant disabled:opacity-20 hover:text-primary transition-colors"
           >
             chevron_left
           </button>
           <button 
             disabled={params.page >= pagination.totalPages}
             onClick={() => setParams(prev => ({ ...prev, page: prev.page + 1 }))}
             className="material-symbols-outlined text-xl text-on-surface-variant disabled:opacity-20 hover:text-primary transition-colors"
           >
             chevron_right
           </button>
        </div>
      </div>

      {/* Product Table */}
      {error && (
        <div className="p-8 mb-8 text-error font-body text-sm bg-error-container/10 border border-error/10">
          {error}
        </div>
      )}

      <ProductTable 
        products={products} 
        loading={loading} 
        onEdit={handleEdit} 
        onDelete={handleDeleteClick} 
      />

      {/* Product Form Modal */}
      <ProductForm 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSave}
        initialData={editingProduct}
      />

      {/* Confirm Delete Modal */}
      <ConfirmModal 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa"
        message="Hành động này sẽ xóa sản phẩm khỏi danh sách hiển thị (Lưu trữ). Bạn vẫn có thể khôi phục trong cơ sở dữ liệu nếu cần."
        confirmText="Xác nhận xóa"
        type="danger"
      />
    </AdminLayout>
  );
};

export default ProductList;
