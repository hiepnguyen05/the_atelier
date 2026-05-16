import React from 'react';
import { SEASONS } from '../../constants/productConstants';
import { useCollectionForm } from '../../hooks/useCollectionForm';
import EditorialBuilder from './EditorialBuilder';
import SingleImageUpload from '../common/SingleImageUpload';

const CollectionForm = ({ isOpen, onClose, onSave, initialData }) => {
  const {
    formData,
    allProducts,
    updateFormData
  } = useCollectionForm(initialData, isOpen);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-on-background/40 backdrop-blur-md p-0 md:p-8">
      <div className="bg-surface w-full h-full md:h-auto md:max-h-[95vh] md:max-w-6xl flex flex-col shadow-2xl overflow-hidden border border-outline-variant/10">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-outline-variant/10 flex justify-between items-center bg-surface sticky top-0 z-20">
          <div>
            <h3 className="font-headline text-2xl text-on-surface">
              {initialData ? 'Hiệu chỉnh Bộ sưu tập' : 'Khởi tạo Bộ sưu tập mới'}
            </h3>
            <p className="font-body text-[10px] uppercase tracking-widest text-on-surface-variant/60 mt-1">Hồ sơ lưu trữ Atelier & Storytelling</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center hover:bg-surface-container rounded-full transition-colors">
            <span className="material-symbols-outlined text-on-surface-variant">close</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 md:p-16 space-y-20 scroll-smooth">
          
          {/* Section 1: Thông tin cốt lõi */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-x-12 gap-y-10">
             <div className="md:col-span-12 border-l-4 border-secondary pl-6 mb-4">
              <h4 className="font-headline text-xl text-on-surface uppercase tracking-tight">01. Nhận diện bộ sưu tập</h4>
              <p className="font-body text-xs text-on-surface-variant opacity-60 italic">Thông tin định danh và đặc điểm nhận diện chính</p>
            </div>

            <div className="md:col-span-8">
              <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-3 block font-bold">Tên Bộ sưu tập</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => updateFormData({ name: e.target.value })}
                className="w-full bg-transparent border-b border-outline-variant/40 py-2 font-headline text-3xl focus:outline-none focus:border-secondary transition-colors"
                placeholder="VD: Spring/Summer 2026 'The Dawn'"
              />
            </div>

            <div className="md:col-span-4 grid grid-cols-2 gap-6">
                <div>
                  <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-3 block font-bold">Mùa</label>
                  <select
                    value={formData.season}
                    onChange={(e) => updateFormData({ season: e.target.value })}
                    className="w-full bg-transparent border-b border-outline-variant/40 py-2 font-body text-sm focus:outline-none"
                  >
                    {SEASONS.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-3 block font-bold">Năm</label>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) => updateFormData({ year: parseInt(e.target.value) })}
                    className="w-full bg-transparent border-b border-outline-variant/40 py-2 font-body text-sm focus:outline-none"
                  />
                </div>
            </div>

            <div className="md:col-span-12">
              <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-3 block font-bold">Tagline nghệ thuật</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => updateFormData({ tagline: e.target.value })}
                className="w-full bg-transparent border-b border-outline-variant/40 py-2 font-body text-base italic focus:outline-none focus:border-secondary"
                placeholder="VD: Sự giao thoa giữa ánh sáng và tơ lụa..."
              />
            </div>
          </div>

          {/* Section 2: Hình ảnh Editorial */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="border-l-4 border-secondary pl-6">
                <h4 className="font-headline text-xl text-on-surface uppercase tracking-tight">02. Hình ảnh định danh</h4>
                <p className="font-body text-xs text-on-surface-variant opacity-60 italic">Ảnh bìa và ảnh đại diện cho trang landing</p>
              </div>

              <div>
                <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-3 block font-bold">Ảnh bìa chính (Cover Image)</label>
                <SingleImageUpload 
                  imageUrl={formData.coverImageUrl}
                  onChange={(url) => updateFormData({ coverImageUrl: url })}
                  placeholder="Tải ảnh bìa chính..."
                  aspectRatio="aspect-[16/9]"
                />
              </div>
            </div>

            <div className="space-y-12">
              <div className="p-8 bg-surface-container-low border border-outline-variant/5">
                 <h5 className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-6">Trạng thái hiển thị</h5>
                 <div className="space-y-6">
                    <label className="flex items-center gap-4 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        checked={formData.isFeatured}
                        onChange={(e) => updateFormData({ isFeatured: e.target.checked })}
                        className="w-5 h-5 rounded-none accent-secondary"
                      />
                      <div className="flex flex-col">
                        <span className="font-label text-[11px] uppercase tracking-widest text-on-surface group-hover:text-secondary transition-colors">Bộ sưu tập nổi bật</span>
                        <span className="font-body text-[9px] text-on-surface-variant opacity-60">Ưu tiên hiển thị tại trang chủ và Lookbook chính</span>
                      </div>
                    </label>
                    
                    <label className="flex items-center gap-4 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        checked={formData.isActive}
                        onChange={(e) => updateFormData({ isActive: e.target.checked })}
                        className="w-5 h-5 rounded-none accent-success"
                      />
                      <div className="flex flex-col">
                        <span className="font-label text-[11px] uppercase tracking-widest text-on-surface group-hover:text-success transition-colors">Hiển thị công khai</span>
                        <span className="font-body text-[9px] text-on-surface-variant opacity-60">Cho phép khách hàng truy cập xem bộ sưu tập</span>
                      </div>
                    </label>
                 </div>
              </div>
            </div>
          </div>

          {/* Section 3: Editorial Story Builder */}
          <EditorialBuilder 
            content={formData.editorialContent} 
            products={allProducts}
            onChange={(newContent) => updateFormData({ editorialContent: newContent })}
          />

          {/* Section 4: Kết thúc câu chuyện */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-x-12">
            <div className="md:col-span-12 border-l-4 border-secondary pl-6 mb-8">
              <h4 className="font-headline text-xl text-on-surface uppercase tracking-tight">03. Kết thúc câu chuyện</h4>
              <p className="font-body text-xs text-on-surface-variant opacity-60 italic">Mô tả tổng quát và ảnh kết thúc (Footer Image)</p>
            </div>
            <div className="md:col-span-8">
               <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-3 block font-bold">Mô tả tổng quan</label>
               <textarea
                value={formData.description}
                onChange={(e) => updateFormData({ description: e.target.value })}
                className="w-full bg-transparent border border-outline-variant/20 p-6 font-body text-sm focus:outline-none focus:border-secondary min-h-[150px]"
                placeholder="Tổng kết lại tinh thần của bộ sưu tập..."
               />
            </div>
            <div className="md:col-span-4">
               <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-3 block font-bold">Ảnh kết thúc (Footer Image)</label>
               <SingleImageUpload 
                 imageUrl={formData.footerImageUrl}
                 onChange={(url) => updateFormData({ footerImageUrl: url })}
                 placeholder="Tải ảnh Footer..."
                 aspectRatio="aspect-square"
               />
            </div>
          </div>

        </form>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-outline-variant/10 flex justify-end gap-6 bg-surface sticky bottom-0 z-20">
          <button
            type="button"
            onClick={onClose}
            className="px-8 py-4 font-label text-[11px] uppercase tracking-[0.2em] text-on-surface-variant hover:text-on-surface"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="bg-on-background text-on-primary px-12 py-4 font-label text-[11px] uppercase tracking-[0.2em] font-bold hover:opacity-90 transition-all shadow-lg"
          >
            Lưu Câu chuyện Bộ sưu tập
          </button>
        </div>
      </div>
    </div>
  );
};

export default CollectionForm;
