import React from 'react';
import { useImageUpload } from '../../hooks/admin/useImageUpload';

const SingleImageUpload = ({ imageUrl, onChange, placeholder = "Tải ảnh lên...", folder = "collections", aspectRatio = "aspect-[16/9]" }) => {
  const { uploading, uploadSingleImage } = useImageUpload(folder);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const url = await uploadSingleImage(file);
    if (url) onChange(url);
  };

  const removeImage = () => {
    onChange('');
  };

  return (
    <div className="w-full">
      {imageUrl ? (
        <div className={`relative group w-full ${aspectRatio} bg-surface-container overflow-hidden border border-outline-variant/10 shadow-sm`}>
          <img src={imageUrl} alt="Uploaded preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-on-background/50 opacity-0 group-hover:opacity-100 transition-opacity flex justify-center items-center gap-4">
            <label className="bg-secondary text-white px-4 py-2 font-label text-[10px] uppercase tracking-widest hover:opacity-90 cursor-pointer shadow-lg">
              Thay đổi
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
            <button 
              type="button" 
              onClick={removeImage}
              className="bg-error text-white px-4 py-2 font-label text-[10px] uppercase tracking-widest hover:opacity-90 shadow-lg"
            >
              Xóa ảnh
            </button>
          </div>
        </div>
      ) : (
        <label className={`w-full ${aspectRatio} border-2 border-dashed border-outline-variant/30 flex flex-col items-center justify-center cursor-pointer hover:border-secondary hover:bg-surface-container-low transition-colors ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-3">
            {uploading ? 'sync' : 'cloud_upload'}
          </span>
          <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
            {uploading ? 'Đang tải lên Cloudinary...' : placeholder}
          </span>
          <span className="font-body text-[10px] text-on-surface-variant/60 mt-1 uppercase">Click để chọn file từ máy tính</span>
        </label>
      )}
    </div>
  );
};

export default SingleImageUpload;
