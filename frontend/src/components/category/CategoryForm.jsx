import React, { useState, useEffect } from 'react';

const CategoryForm = ({ isOpen, onClose, onSave, initialData, defaultParentId }) => {
  const [formData, setFormData] = useState({ name: '', description: '', parentId: null });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          name: initialData.name || '',
          description: initialData.description || '',
          parentId: initialData.parentId || null
        });
      } else {
        setFormData({ name: '', description: '', parentId: defaultParentId || null });
      }
    }
  }, [isOpen, initialData, defaultParentId]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-on-background/20 backdrop-blur-sm">
      <div className="bg-surface p-12 w-full max-w-lg border border-outline-variant/10 shadow-2xl">
        <div className="flex justify-between items-start mb-12">
          <div>
            <span className="font-label text-[10px] uppercase tracking-[0.3em] text-secondary mb-2 block">Biểu mẫu</span>
            <h3 className="font-headline text-3xl text-on-surface">
              {initialData ? 'Chỉnh sửa Danh mục' : 'Thêm Danh mục Mới'}
            </h3>
          </div>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-3 block font-bold">
              Tên Danh mục
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-transparent border-b border-outline-variant/40 py-2 font-body text-sm focus:outline-none focus:border-primary transition-colors"
              placeholder="VD: Outerwear"
              required
            />
          </div>

          <div>
            <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-3 block font-bold">
              Mô tả
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-transparent border border-outline-variant/40 p-4 font-body text-sm focus:outline-none focus:border-primary transition-colors min-h-[120px] resize-none"
              placeholder="Mô tả về phong cách và chất liệu..."
            />
          </div>

          <div className="flex justify-end gap-6 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-3 font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant hover:text-on-surface transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="bg-surface-tint text-on-primary px-10 py-3 font-label text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-primary-dim transition-all"
            >
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryForm;
