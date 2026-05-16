import { useState, useEffect } from 'react';
import { productService } from '../services';
import { useToast } from '../contexts/ToastContext';

export const useCollectionForm = (initialData, isOpen) => {
  const { showToast } = useToast();
  const [allProducts, setAllProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    description: '',
    season: 'Spring/Summer',
    year: new Date().getFullYear(),
    coverImageUrl: '',
    heroImageUrl: '',
    footerImageUrl: '',
    editorialContent: [],
    isFeatured: false,
    isActive: true
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await productService.getAll({ limit: 100 });
        setAllProducts(res.data.products || []);
      } catch (err) {
        console.error('Error fetching products:', err);
        showToast('Không thể tải danh sách sản phẩm cho bộ sưu tập', 'error');
      }
    };
    if (isOpen) fetchProducts();
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({ 
          ...initialData,
          editorialContent: initialData.editorialContent || []
        });
      } else {
        setFormData({
          name: '',
          tagline: '',
          description: '',
          season: 'Spring/Summer',
          year: new Date().getFullYear(),
          coverImageUrl: '',
          heroImageUrl: '',
          footerImageUrl: '',
          editorialContent: [],
          isFeatured: false,
          isActive: true
        });
      }
    }
  }, [isOpen, initialData]);

  const updateFormData = (updates) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  return {
    formData,
    allProducts,
    updateFormData
  };
};
