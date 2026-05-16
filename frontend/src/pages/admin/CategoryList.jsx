import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AdminLayout from '../../layouts/AdminLayout';
import CategoryForm from '../../components/category/CategoryForm';
import CategoryStats from '../../components/category/CategoryStats';
import CategoryTable from '../../components/category/CategoryTable';
import ConfirmModal from '../../components/common/ConfirmModal';
import { useCategories } from '../../hooks/useCategories';
import { useToast } from '../../contexts/ToastContext';

const CategoryList = () => {
  const { showToast } = useToast();
  const {
    categories,
    loading,
    error,
    deleteCategory,
    createCategory,
    updateCategory
  } = useCategories();
  const { parentId } = useParams();
  const navigate = useNavigate();

  const currentParentId = parentId ? parseInt(parentId) : null;

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  
  // Confirm Modal state
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  
  // Drill-down logic based on categories already loaded
  const displayCategories = useMemo(() => {
    return categories.filter(cat => cat.parentId === currentParentId);
  }, [categories, currentParentId]);

  const parentCategory = useMemo(() => {
    if (!currentParentId) return null;
    return categories.find(cat => cat.categoryId === currentParentId);
  }, [categories, currentParentId]);

  // Simple breadcrumb logic based on the single parent
  // For deep nesting, we'd need a more complex path finding logic or API support
  
  const handleViewSub = (category) => {
    navigate(`/admin/categories/${category.categoryId}`);
  };

  const handleAdd = () => {
    setEditingCategory(null);
    setIsFormOpen(true);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setIsFormOpen(true);
  };

  const handleSave = async (data) => {
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.categoryId, data);
      } else {
        await createCategory(data);
      }
      showToast('Đã lưu danh mục thành công');
      setIsFormOpen(false);
    } catch (err) {
      showToast('Lỗi khi lưu danh mục: ' + (err.response?.data?.message || err.message), 'error');
    }
  };

  const handleDeleteClick = (id) => {
    setDeletingId(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteCategory(deletingId);
      showToast('Đã xóa danh mục');
      setIsConfirmOpen(false);
    } catch (err) {
      showToast('Lỗi khi xóa danh mục: ' + (err.response?.data?.message || err.message), 'error');
    }
  };

  return (
    <AdminLayout searchPlaceholder="TÌM KIẾM DANH MỤC...">
      {/* Editorial Header Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
        <div className="max-w-2xl">
          <nav className="mb-4">
            <span className="font-label text-[10px] uppercase tracking-[0.3em] text-secondary">Hệ thống Quản trị</span>
          </nav>
          <h2 className="font-headline text-5xl text-on-surface tracking-tight mb-4">Quản lý Danh mục</h2>
          <p className="font-body text-base text-on-surface-variant/80 max-w-lg leading-relaxed">
            Tổ chức bộ sưu tập của bạn một cách có hệ thống. Nơi định hình cấu trúc cho các sản phẩm thủ công cao cấp và xu hướng thời trang đương đại.
          </p>
        </div>
        <div>
          <button 
            onClick={handleAdd}
            className={`${
              parentCategory 
                ? 'bg-secondary text-white border-2 border-secondary' 
                : 'bg-surface-tint text-on-primary'
            } px-10 py-4 font-label text-[11px] uppercase tracking-[0.2em] font-bold hover:opacity-90 transition-all duration-300 flex items-center gap-3 shadow-lg`}
          >
            <span className="material-symbols-outlined text-sm">
              {parentCategory ? 'library_add' : 'add'}
            </span>
            {parentCategory ? `Thêm Mục con cho ${parentCategory.name}` : 'Thêm Danh mục Mới'}
          </button>
        </div>
      </section>

      {/* Stats Grid */}
      <CategoryStats totalCategories={categories.length} />

      {/* Breadcrumbs & Navigation Path */}
      <nav className="flex items-center gap-4 mb-8 bg-surface-container-low/50 px-6 py-4 border border-outline-variant/5">
        <Link 
          to="/admin/categories"
          className={`font-label text-[10px] tracking-widest uppercase transition-colors flex items-center gap-2 ${!currentParentId ? 'text-secondary font-bold' : 'text-on-surface-variant hover:text-on-surface'}`}
        >
          <span className="material-symbols-outlined text-sm">home</span>
          Danh mục Gốc
        </Link>
        {parentCategory && (
          <>
            <span className="text-on-surface-variant/20">/</span>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-secondary">subdirectory_arrow_right</span>
              <span className="font-label text-[10px] tracking-widest uppercase text-on-surface font-bold">
                {parentCategory.name}
              </span>
            </div>
          </>
        )}
      </nav>

      {/* Parent Context Banner (Only shown in sub-category view) */}
      {parentCategory && (
        <div className="mb-12 p-8 bg-secondary/5 border-l-4 border-secondary flex justify-between items-center animate-in fade-in slide-in-from-left-4 duration-500">
          <div>
            <span className="font-label text-[9px] uppercase tracking-widest text-secondary block mb-2 font-bold">Bạn đang quản lý mục con của</span>
            <h3 className="font-headline text-3xl text-on-surface">{parentCategory.name}</h3>
            <p className="font-body text-xs text-on-surface-variant mt-2 max-w-md">{parentCategory.description || 'Không có mô tả cho danh mục cha này.'}</p>
          </div>
          <div className="text-right">
            <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant block mb-1">Mã danh mục cha</span>
            <span className="font-body text-sm font-bold">#CAT-{String(parentCategory.categoryId).padStart(3, '0')}</span>
          </div>
        </div>
      )}

      {/* Data Table Section */}
      {error && (
        <div className="p-8 mb-8 text-error font-body text-sm bg-error-container/10 border border-error/10">
          {error}
        </div>
      )}
      
      <CategoryTable 
        categories={displayCategories} 
        loading={loading} 
        onEdit={handleEdit} 
        onDelete={handleDeleteClick} 
        onViewSub={handleViewSub}
      />

      {/* Add/Edit Modal */}
      <CategoryForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSave={handleSave} 
        initialData={editingCategory} 
        defaultParentId={currentParentId}
      />

      {/* Reusable Confirm Modal */}
      <ConfirmModal 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa"
        message="Hành động này không thể hoàn tác. Danh mục sẽ bị xóa vĩnh viễn khỏi hệ thống."
        confirmText="Xóa vĩnh viễn"
        type="danger"
      />
    </AdminLayout>
  );
};

export default CategoryList;
