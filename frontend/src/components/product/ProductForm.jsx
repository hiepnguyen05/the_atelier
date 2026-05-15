import React, { useState, useEffect, useMemo } from 'react';
import { categoryService, collectionService, brandService } from '../../services/api';
import CategoryPicker from './CategoryPicker';
import BrandPicker from './BrandPicker';
import ImageUploadManager from './ImageUploadManager';
import VariantManager from './VariantManager';

const COMMON_MATERIALS = [
  'Silk (Lụa)', 'Cotton', 'Satin', 'Linen', 'Wool (Len)', 
  'Leather (Da)', 'Cashmere', 'Chiffon', 'Organza', 'Velvet (Nhung)',
  'Lace (Ren)', 'Tweed', 'Denim', 'Polyester'
];

// Helper to remove Vietnamese accents
const removeAccents = (str) => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
};

const ProductForm = ({ isOpen, onClose, onSave, initialData }) => {
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [brands, setBrands] = useState([]);
  
  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
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
      setCollections(colRes.data);
      setBrands(brandRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          ...initialData,
          collectionId: initialData.collectionId || '',
          brandId: initialData.brandId || '',
          stock: initialData.stock || 0,
          images: initialData.productImages || [],
          variants: initialData.productVariants || []
        });
      } else {
        setFormData({
          name: '',
          categoryId: '',
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
      // 1. Auto-Slug (SEO)
      const autoSlug = removeAccents(formData.name)
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
      
      // 2. Auto-SKU Logic (No accents)
      let autoSku = formData.skuBase;
      if (!formData.skuBase && formData.categoryId) {
        const selectedCat = categories.find(c => c.categoryId === formData.categoryId);
        const cleanCatName = removeAccents(selectedCat ? selectedCat.name : 'GEN');
        const cleanProdName = removeAccents(formData.name);
        
        const prefix = cleanCatName.substring(0, 3).toUpperCase();
        const namePart = cleanProdName.substring(0, 3).toUpperCase();
        autoSku = `${prefix}-${namePart}-${Math.floor(1000 + Math.random() * 9000)}`;
      }

      setFormData(prev => ({ 
        ...prev, 
        slug: autoSlug,
        skuBase: autoSku
      }));
    }
  }, [formData.name, formData.categoryId, categories, initialData]);

  // Sync Total Stock from variants if they exist
  useEffect(() => {
    if (formData.variants.length > 0) {
      const total = formData.variants.reduce((acc, curr) => acc + (curr.stockQuantity || 0), 0);
      if (total !== formData.stock) {
        setFormData(prev => ({ ...prev, stock: total }));
      }
    }
  }, [formData.variants]);

  const handleQuickAddBrand = async (name) => {
    try {
      const response = await brandService.create({ name });
      setBrands(prev => [...prev, response.data]);
      setFormData(prev => ({ ...prev, brandId: response.data.brandId }));
    } catch (err) {
      alert('Lỗi khi tạo thương hiệu mới.');
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const submissionData = {
      ...formData,
      collectionId: formData.collectionId === '' ? null : parseInt(formData.collectionId),
      brandId: formData.brandId === '' ? null : parseInt(formData.brandId),
      categoryId: parseInt(formData.categoryId),
      stock: parseInt(formData.stock)
    };
    onSave(submissionData);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-on-background/40 backdrop-blur-md p-0 md:p-8">
      <div className="bg-surface w-full h-full md:h-auto md:max-h-[90vh] md:max-w-6xl flex flex-col shadow-2xl overflow-hidden border border-outline-variant/10">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-outline-variant/10 flex justify-between items-center bg-surface sticky top-0 z-20">
          <div>
            <h3 className="font-headline text-2xl text-on-surface">
              {initialData ? 'Hiệu chỉnh tác phẩm' : 'Đăng ký tác phẩm mới'}
            </h3>
            <p className="font-body text-[10px] uppercase tracking-widest text-on-surface-variant/60 mt-1">
              Hệ thống Quản trị Atelier Luxury
            </p>
          </div>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center hover:bg-surface-container rounded-full transition-colors">
            <span className="material-symbols-outlined text-on-surface-variant">close</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 md:p-16 space-y-20 scroll-smooth">
          
          {/* Section 1: Thông tin cốt lõi */}
          <section className="grid grid-cols-1 md:grid-cols-12 gap-x-12 gap-y-10">
            <div className="md:col-span-12 border-l-4 border-secondary pl-6 mb-4">
              <h4 className="font-headline text-xl text-on-surface uppercase tracking-tight">01. Thông tin cốt lõi</h4>
              <p className="font-body text-xs text-on-surface-variant opacity-60">Xác định danh tính và giá trị tồn kho của sản phẩm</p>
            </div>

            <div className="md:col-span-8">
              <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-3 block">Tên Sản phẩm</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-transparent border-b border-outline-variant/40 py-2 font-body text-2xl focus:outline-none focus:border-secondary transition-colors"
                placeholder="VD: Premium Silk Slip Dress"
              />
            </div>

            <div className="md:col-span-4">
              <BrandPicker 
                brands={brands} 
                value={formData.brandId} 
                onChange={(val) => setFormData({ ...formData, brandId: val })}
                onQuickAdd={handleQuickAddBrand}
              />
            </div>

            <div className="md:col-span-4">
              <CategoryPicker 
                categories={categories} 
                value={formData.categoryId} 
                onChange={(val) => setFormData({ ...formData, categoryId: val })} 
              />
            </div>

            <div className="md:col-span-4">
              <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-3 block">Bộ sưu tập</label>
              <select
                value={formData.collectionId}
                onChange={(e) => setFormData({ ...formData, collectionId: e.target.value })}
                className="w-full bg-transparent border-b border-outline-variant/40 py-2 font-body text-sm focus:outline-none focus:border-secondary"
              >
                <option value="">Chọn bộ sưu tập (Không bắt buộc)</option>
                {collections.map(col => (
                  <option key={col.collectionId} value={col.collectionId}>{col.name}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-4 grid grid-cols-2 gap-6 items-start">
              <div>
                <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-3 block">Giá cơ bản (VND)</label>
                <input
                  type="number"
                  required
                  value={formData.basePrice}
                  onChange={(e) => setFormData({ ...formData, basePrice: parseInt(e.target.value) })}
                  className="w-full bg-transparent border-b border-outline-variant/40 py-2 font-body text-lg focus:outline-none focus:border-secondary"
                />
              </div>
              <div className="relative">
                <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-3 block flex justify-between items-center">
                  Tồn kho
                  {formData.variants.length > 0 && (
                    <span className="text-[7px] bg-secondary/10 text-secondary px-1 py-0.5 font-bold animate-pulse">AUTO</span>
                  )}
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.stock}
                  readOnly={formData.variants.length > 0}
                  onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                  className={`w-full bg-transparent border-b border-outline-variant/40 py-2 font-body text-lg focus:outline-none focus:border-secondary ${formData.variants.length > 0 ? 'opacity-60 cursor-not-allowed text-secondary' : ''}`}
                />
              </div>
            </div>
          </section>

          {/* Section 2: Hình ảnh */}
          <section className="grid grid-cols-1 md:grid-cols-12 gap-x-12">
            <div className="md:col-span-12 border-l-4 border-secondary pl-6 mb-8">
              <h4 className="font-headline text-xl text-on-surface uppercase tracking-tight">02. Hình ảnh nghệ thuật</h4>
              <p className="font-body text-xs text-on-surface-variant opacity-60">Hỗ trợ tải lên nhiều ảnh cùng lúc lên Cloudinary</p>
            </div>
            <div className="md:col-span-12">
              <ImageUploadManager 
                images={formData.images} 
                onChange={(newImages) => setFormData({ ...formData, images: newImages })} 
              />
            </div>
          </section>

          {/* Section 3: Biến thể */}
          <section className="grid grid-cols-1 md:grid-cols-12 gap-x-12">
            <div className="md:col-span-12 border-l-4 border-secondary pl-6 mb-8">
              <h4 className="font-headline text-xl text-on-surface uppercase tracking-tight">03. Biến thể & Tồn kho</h4>
              <p className="font-body text-xs text-on-surface-variant opacity-60">Chọn màu sắc từ bảng màu Atelier và thiết lập kích cỡ</p>
            </div>
            <div className="md:col-span-12">
              <VariantManager 
                variants={formData.variants} 
                skuBase={formData.skuBase}
                onChange={(newVariants) => setFormData({ ...formData, variants: newVariants })} 
              />
            </div>
          </section>

          {/* Section 4: Chi tiết */}
          <section className="grid grid-cols-1 md:grid-cols-12 gap-x-12 gap-y-10">
            <div className="md:col-span-12 border-l-4 border-secondary pl-6 mb-4">
              <h4 className="font-headline text-xl text-on-surface uppercase tracking-tight">04. Chất liệu & Bảo quản</h4>
              <p className="font-body text-xs text-on-surface-variant opacity-60">Thông tin chi tiết và tối ưu hóa SEO tự động</p>
            </div>

            <div className="md:col-span-8">
              <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-3 block">Chất liệu</label>
              <div className="flex flex-wrap gap-2 mb-4">
                {COMMON_MATERIALS.map(m => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setFormData({ ...formData, material: m })}
                    className={`px-3 py-1 font-body text-[10px] border transition-all ${
                      formData.material === m 
                        ? 'bg-secondary text-white border-secondary' 
                        : 'border-outline-variant/30 text-on-surface-variant hover:border-secondary'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={formData.material}
                onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                className="w-full bg-transparent border-b border-outline-variant/40 py-2 font-body text-sm focus:outline-none focus:border-secondary"
                placeholder="Hoặc tự nhập chất liệu khác..."
              />
            </div>

            <div className="md:col-span-4">
              <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-3 block">Mã SKU gốc</label>
              <input
                type="text"
                required
                value={formData.skuBase}
                onChange={(e) => setFormData({ ...formData, skuBase: e.target.value })}
                className="w-full bg-transparent border-b border-outline-variant/40 py-2 font-body text-sm focus:outline-none focus:border-secondary"
              />
            </div>

            <div className="md:col-span-12">
              <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-3 block">Mô tả sản phẩm</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-transparent border border-outline-variant/20 p-6 font-body text-sm focus:outline-none focus:border-secondary min-h-[150px]"
              />
            </div>

            <div className="md:col-span-12">
              <div className="p-8 bg-surface-container-low border border-outline-variant/10">
                <div className="flex justify-between items-start mb-4">
                   <h5 className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest">SEO Preview</h5>
                   <span className="bg-success-container text-on-success-container text-[8px] px-2 py-0.5 rounded-full uppercase font-bold">Optimized</span>
                </div>
                <h4 className="text-blue-700 font-body text-xl hover:underline cursor-pointer">
                  {formData.name || 'Tên sản phẩm'} | {brands.find(b => b.brandId === formData.brandId)?.name || 'The Atelier'}
                </h4>
                <p className="text-green-800 font-body text-sm mt-1">the-atelier.com/products/{formData.slug || 'slug-tu-dong'}</p>
                <p className="text-on-surface-variant font-body text-sm mt-2 line-clamp-2 italic">
                  {formData.description || 'Mô tả tự động...'}
                </p>
              </div>
            </div>
          </section>
        </form>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-outline-variant/10 flex justify-end gap-6 bg-surface sticky bottom-0 z-20">
          <button
            type="button"
            onClick={onClose}
            className="px-8 py-4 font-label text-[11px] uppercase tracking-[0.2em] text-on-surface-variant hover:text-on-surface transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="bg-secondary text-white px-12 py-4 font-label text-[11px] uppercase tracking-[0.2em] font-bold hover:opacity-90 transition-all shadow-lg"
          >
            {initialData ? 'Lưu thay đổi' : 'Đăng bán sản phẩm'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
