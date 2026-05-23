import React from 'react';
import { useImageUpload } from '../../hooks/admin/useImageUpload';
import { api } from '../../services';

const ImageUploadManager = ({ images, onChange }) => {
  const { uploading, uploadImages } = useImageUpload('products');

  const handleFileChange = async (e) => {
    const urls = await uploadImages(e.target.files);
    if (urls.length > 0) {
      const newUploadedImages = urls.map(url => ({
        imageUrl: url,
        isPrimary: false,
        isHover: false
      }));

      // Nếu là ảnh đầu tiên, set nó làm ảnh chính
      const currentImages = [...images, ...newUploadedImages];
      if (images.length === 0 && newUploadedImages.length > 0) {
        currentImages[0].isPrimary = true;
      }
      onChange(currentImages);
    }
  };

  const removeImage = async (index) => {
    const targetImage = images[index];
    const newImages = images.filter((_, i) => i !== index);
    
    // Nếu xóa ảnh chính, set ảnh đầu tiên còn lại làm chính
    if (targetImage.isPrimary && newImages.length > 0) {
      newImages[0].isPrimary = true;
      newImages[0].isHover = false;
    }
    onChange(newImages);

    // Xóa ảnh trên Cloudinary ngay lập tức nếu là ảnh chưa lưu vào database (không có imageId)
    if (!targetImage.imageId && targetImage.imageUrl) {
      try {
        await api.delete('/upload', { data: { url: targetImage.imageUrl } });
      } catch (err) {
        console.error('Failed to delete unsaved image from Cloudinary:', err);
      }
    }
  };

  const setPrimary = (index) => {
    const newImages = images.map((img, i) => {
      if (i === index) {
        return { ...img, isPrimary: true, isHover: false };
      }
      return { ...img, isPrimary: false };
    });
    onChange(newImages);
  };

  const setHover = (index) => {
    const newImages = images.map((img, i) => {
      if (i === index) {
        const nextHoverState = !img.isHover;
        return { 
          ...img, 
          isHover: nextHoverState, 
          isPrimary: nextHoverState ? false : img.isPrimary 
        };
      }
      return { ...img, isHover: false };
    });
    onChange(newImages);
  };

  return (
    <div className="space-y-6">
      <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-3 block font-bold">Hình ảnh sản phẩm</label>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((img, index) => (
          <div key={index} className="relative group aspect-[3/4] bg-surface-container overflow-hidden border border-outline-variant/10">
            <img src={img.imageUrl} alt="Preview" className="w-full h-full object-cover" />
            
            <div className="absolute inset-0 bg-on-background/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center gap-2">
              <button 
                type="button"
                onClick={() => setPrimary(index)}
                className={`px-3 py-1 font-label text-[9px] uppercase tracking-widest ${
                  img.isPrimary ? 'bg-secondary text-white' : 'bg-white text-on-surface hover:bg-secondary hover:text-white'
                }`}
              >
                {img.isPrimary ? 'Ảnh chính' : 'Đặt làm chính'}
              </button>
              <button 
                type="button"
                onClick={() => setHover(index)}
                className={`px-3 py-1 font-label text-[9px] uppercase tracking-widest ${
                  img.isHover ? 'bg-on-surface-variant text-white' : 'bg-white text-on-surface hover:bg-on-surface-variant hover:text-white'
                }`}
              >
                {img.isHover ? 'Ảnh Hover' : 'Đặt ảnh hover'}
              </button>
              <button 
                type="button"
                onClick={() => removeImage(index)}
                className="bg-error text-white px-3 py-1 font-label text-[9px] uppercase tracking-widest hover:bg-error-dim"
              >
                Xóa
              </button>
            </div>
            
            {img.isPrimary && (
              <div className="absolute top-2 left-2 bg-secondary text-white px-2 py-0.5 font-label text-[8px] uppercase tracking-widest">
                Ảnh chính
              </div>
            )}
            {img.isHover && (
              <div className="absolute top-2 right-2 bg-on-surface-variant text-white px-2 py-0.5 font-label text-[8px] uppercase tracking-widest">
                Ảnh Hover
              </div>
            )}
          </div>
        ))}
        
        <label className={`aspect-[3/4] border-2 border-dashed border-outline-variant/30 flex flex-col items-center justify-center cursor-pointer hover:border-secondary transition-colors ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
          <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
          <span className="material-symbols-outlined text-3xl text-on-surface-variant mb-2">
            {uploading ? 'sync' : 'add_photo_alternate'}
          </span>
          <span className="font-label text-[9px] uppercase tracking-widest text-on-surface-variant">
            {uploading ? 'Đang tải...' : 'Thêm ảnh'}
          </span>
        </label>
      </div>
    </div>
  );
};

export default ImageUploadManager;
