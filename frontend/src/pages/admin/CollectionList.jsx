import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import CollectionTable from '../../components/collection/CollectionTable';
import CollectionForm from '../../components/collection/CollectionForm';
import { collectionService } from '../../services';
import ConfirmModal from '../../components/common/ConfirmModal';
import { useToast } from '../../contexts/ToastContext';

const CollectionList = () => {
  const { showToast } = useToast();
  const [collections, setCollections] = useState([]);
  const [pagination, setPagination] = useState({ totalItems: 0, totalPages: 0, currentPage: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [params, setParams] = useState({ page: 1, limit: 10, search: '' });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchCollections = useCallback(async () => {
    try {
      setLoading(true);
      const response = await collectionService.getAll(params);
      // Backend now returns { totalItems, totalPages, currentPage, collections }
      const { collections, totalItems, totalPages, currentPage } = response.data;
      setCollections(collections);
      setPagination({ totalItems, totalPages, currentPage });
      setError(null);
    } catch (err) {
      console.error('Error fetching collections:', err);
      setError('Không thể tải danh sách bộ sưu tập.');
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  const handleAdd = () => {
    setEditingCollection(null);
    setIsFormOpen(true);
  };

  const handleEdit = (collection) => {
    setEditingCollection(collection);
    setIsFormOpen(true);
  };

  const handleSave = async (data) => {
    try {
      if (editingCollection) {
        await collectionService.update(editingCollection.collectionId, data);
      } else {
        await collectionService.create(data);
      }
      setIsFormOpen(false);
      showToast('Bộ sưu tập đã được lưu thành công');
    } catch (err) {
      showToast('Lỗi khi lưu bộ sưu tập: ' + (err.response?.data?.message || err.message), 'error');
    }
  };

  const handleDeleteClick = (id) => {
    setDeletingId(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await collectionService.delete(deletingId);
      setIsConfirmOpen(false);
      showToast('Đã xóa bộ sưu tập');
    } catch (err) {
      showToast('Lỗi khi xóa: ' + (err.response?.data?.message || err.message), 'error');
    }
  };

  return (
    <AdminLayout searchPlaceholder="TÌM KIẾM BỘ SƯU TẬP...">
      {/* Header Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
        <div className="max-w-2xl">
          <nav className="mb-4">
            <span className="font-label text-[10px] uppercase tracking-[0.3em] text-secondary">Hệ thống Quản trị</span>
          </nav>
          <h2 className="font-headline text-5xl text-on-surface tracking-tight mb-4">Bộ sưu tập</h2>
          <p className="font-body text-base text-on-surface-variant/80 max-w-lg leading-relaxed">
            Nơi kể những câu chuyện thời trang thông qua các chủ đề sáng tạo. Mỗi bộ sưu tập là một hành trình cảm xúc và phong cách.
          </p>
        </div>
        <div>
          <button 
            onClick={handleAdd}
            className="bg-on-background text-on-primary px-10 py-4 font-label text-[11px] uppercase tracking-[0.2em] font-bold hover:opacity-90 transition-all duration-300 flex items-center gap-3 shadow-lg"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Tạo Bộ sưu tập Mới
          </button>
        </div>
      </section>

      {/* Pagination Info */}
      <div className="flex justify-between items-center mb-8 bg-surface-container-low/30 px-8 py-4 border border-outline-variant/5">
        <div className="flex gap-8">
          <span className="font-label text-[10px] text-on-surface-variant tracking-wider uppercase">
            Tổng cộng: <span className="text-on-surface font-bold">{pagination.totalItems} bộ sưu tập</span>
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

      {/* Table */}
      {error && (
        <div className="p-8 mb-8 text-error font-body text-sm bg-error-container/10 border border-error/10">
          {error}
        </div>
      )}

      <CollectionTable 
        collections={collections} 
        loading={loading} 
        onEdit={handleEdit} 
        onDelete={handleDeleteClick} 
      />

      {/* Form Modal */}
      <CollectionForm 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSave}
        initialData={editingCollection}
      />

      {/* Confirm Delete Modal */}
      <ConfirmModal 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa bộ sưu tập"
        message="Hành động này sẽ xóa vĩnh viễn bộ sưu tập. Lưu ý: Bạn không thể xóa bộ sưu tập nếu vẫn còn sản phẩm liên kết bên trong."
        confirmText="Xác nhận xóa"
        type="danger"
      />
    </AdminLayout>
  );
};

export default CollectionList;
