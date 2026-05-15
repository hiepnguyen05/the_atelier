import React, { useState } from 'react';
import api from '../../services/api';

const ImageUploadManager = ({ images, onChange }) => {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    try {
      const uploadPromises = files.map(async (file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = async () => {
            try {
              const res = await api.post('/upload', { 
                image: reader.result,
                folder: 'products'
              });
              resolve({
                imageUrl: res.data.url,
                isPrimary: false
              });
            } catch (err) {
              reject(err);
            }
          };
          reader.onerror = reject;
        });
      });

      const newUploadedImages = await Promise.all(uploadPromises);
      
      // Nếu là ảnh đầu tiên, set nó làm ảnh chính
      if (images.length === 0 && newUploadedImages.length > 0) {
        newUploadedImages[0].isPrimary = true;
      }

      onChange([...images, ...newUploadedImages]);
    } catch (err) {
      console.error('Upload error:', err);
      alert('Lỗi khi tải ảnh lên Cloudinary.');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    // Nếu xóa ảnh chính, set ảnh đầu tiên còn lại làm chính
    if (images[index].isPrimary && newImages.length > 0) {
      newImages[0].isPrimary = true;
    }
    onChange(newImages);
  };

  const setPrimary = (index) => {
    const newImages = images.map((img, i) => ({
      ...img,
      isPrimary: i === index
    }));
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
                onClick={() => removeImage(index)}
                className="bg-error text-white px-3 py-1 font-label text-[9px] uppercase tracking-widest hover:bg-error-dim"
              >
                Xóa
              </button>
            </div>
            
            {img.isPrimary && (
              <div className="absolute top-2 left-2 bg-secondary text-white px-2 py-0.5 font-label text-[8px] uppercase tracking-widest">
                Primary
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
