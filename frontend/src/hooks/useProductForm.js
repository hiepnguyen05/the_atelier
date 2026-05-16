import { useState, useEffect } from 'react';
import { categoryService, collectionService, brandService } from '../services';
import { useToast } from '../contexts/ToastContext';
import { generateSlug, removeAccents } from '../utils/stringUtils';

export const useProductForm = (initialData, isOpen) => {
  const { showToast } = useToast();
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [brands, setBrands] = useState([]);
  
  const [formData, setFormData] = useState({
    name: '',
    categoryIds: [],
    collectionId: '',
    brandId: '',
    basePrice: 0,
    stock: 0,
    skuBase: '',
    description: '',
    material: '',
    careInstructions: '',
    status: 'active',
    slug: '',
    images: [],
    variants: []
  });

  const fetchData = async () => {
    try {
      const [catRes, colRes, brandRes] = await Promise.all([
        categoryService.getAll(),
        collectionService.getAll(),
        brandService.getAll()
      ]);
      setCategories(catRes.data);
      setCollections(colRes.data.collections || colRes.data);
      setBrands(brandRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
      showToast('Không thể tải dữ liệu danh mục/thương hiệu', 'error');
    }
  };

  useEffect(() => {
    if (isOpen) fetchData();
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          ...initialData,
          categoryIds: initialData.categories ? initialData.categories.map(c => c.categoryId) : [],
          collectionId: initialData.collectionId || '',
          brandId: initialData.brandId || '',
          stock: initialData.stock || 0,
          images: initialData.productImages || [],
          variants: initialData.productVariants || []
        });
      } else {
        setFormData({
          name: '',
          categoryIds: [],
          collectionId: '',
          brandId: '',
          basePrice: 0,
          stock: 0,
          skuBase: '',
          description: '',
          material: '',
          careInstructions: '',
          status: 'active',
          slug: '',
          images: [],
          variants: []
        });
      }
    }
  }, [isOpen, initialData]);

  // AUTOMATION: Auto-SKU & Auto-SEO
  useEffect(() => {
    if (!initialData && formData.name) {
      const autoSlug = generateSlug(formData.name);
      
      let autoSku = formData.skuBase;
      if (!formData.skuBase) {
        const cleanProdName = removeAccents(formData.name);
        const namePart = cleanProdName.substring(0, 3).toUpperCase();
        autoSku = `PRO-${namePart}-${Math.floor(1000 + Math.random() * 9000)}`;
      }

      setFormData(prev => ({ 
        ...prev, 
        slug: autoSlug,
        skuBase: autoSku
      }));
    }
  }, [formData.name, initialData]);

  const handleQuickAddBrand = async (name) => {
    try {
      const response = await brandService.create({ name });
      setBrands(prev => [...prev, response.data]);
      setFormData(prev => ({ ...prev, brandId: response.data.brandId }));
      showToast(`Đã thêm thương hiệu ${name}`);
    } catch (err) {
      showToast('Lỗi khi tạo thương hiệu mới', 'error');
    }
  };

  const updateFormData = (updates) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  return {
    formData,
    categories,
    collections,
    brands,
    updateFormData,
    handleQuickAddBrand
  };
};
