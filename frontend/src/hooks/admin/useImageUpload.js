import { useState } from 'react';
import { api } from '../../services';
import { useToast } from '../../contexts/ToastContext';

export const useImageUpload = (folder = 'products') => {
  const [uploading, setUploading] = useState(false);
  const { showToast } = useToast();

  const uploadImages = async (files) => {
    if (!files || files.length === 0) return [];
    
    setUploading(true);
    const filesArray = Array.from(files);
    
    try {
      const uploadPromises = filesArray.map((file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = async () => {
            try {
              const res = await api.post('/upload', { 
                image: reader.result,
                folder: folder
              });
              resolve(res.data.url);
            } catch (err) {
              reject(err);
            }
          };
          reader.onerror = reject;
        });
      });

      const urls = await Promise.all(uploadPromises);
      showToast(`Đã tải lên ${urls.length} ảnh thành công`);
      return urls;
    } catch (err) {
      console.error('Upload error:', err);
      showToast('Lỗi khi tải ảnh lên hệ thống', 'error');
      return [];
    } finally {
      setUploading(false);
    }
  };

  const uploadSingleImage = async (file) => {
    if (!file) return null;
    const urls = await uploadImages([file]);
    return urls.length > 0 ? urls[0] : null;
  };

  return {
    uploading,
    uploadImages,
    uploadSingleImage
  };
};
