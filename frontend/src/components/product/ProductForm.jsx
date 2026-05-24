import React from 'react';
import { COMMON_MATERIALS } from '../../constants/productConstants';
import { getProductTypeOptions, getProductTypeConfig, GENDERS } from '../../constants/productTypes';
import { useToast } from '../../contexts/ToastContext';
import { useProductForm } from '../../hooks/admin/useProductForm';
import BrandPicker from '../brand/BrandPicker';
import ImageUploadManager from './ImageUploadManager';
import ColorManager from './ColorManager';
import InventoryManager from './InventoryManager';

const getColorsFromVariants = (variants) => {
  const colorMap = {};
  variants.forEach(v => {
    const key = v.colorName || 'Màu tiêu chuẩn';
    if (!colorMap[key]) {
      colorMap[key] = {
        colorName: v.colorName || 'Màu tiêu chuẩn',
        colorCode: v.colorCode || '#ffffff',
        colorImage: v.colorImage || ''
      };
    }
  });
  return Object.values(colorMap);
};

const generateVariants = (colorsList, sizesList, existingVariants = [], skuBase = '') => {
  const newVariants = [];
  const existingMap = new Map();
  existingVariants.forEach(v => {
    const key = `${v.colorName || 'Màu tiêu chuẩn'}-${v.sizeName || ''}`;
    existingMap.set(key, v);
  });

  const finalSizes = sizesList.length > 0 ? sizesList : [''];

  colorsList.forEach((color, cIdx) => {
    finalSizes.forEach((size, sIdx) => {
      const colorName = color.colorName || 'Màu tiêu chuẩn';
      const key = `${colorName}-${size}`;
      const existing = existingMap.get(key);

      const skuSuffix = size ? `-${size}` : '';
      const defaultSku = `${skuBase}-${cIdx + 1}${skuSuffix}`;

      newVariants.push({
        variantId: existing?.variantId || undefined,
        skuVariant: existing?.skuVariant || defaultSku,
        sizeName: size,
        colorName: colorName,
        colorCode: color.colorCode || '#ffffff',
        colorImage: color.colorImage || '',
        stockQuantity: existing?.stockQuantity !== undefined ? existing.stockQuantity : 0,
        priceAdjustment: existing?.priceAdjustment !== undefined ? existing.priceAdjustment : 0
      });
    });
  });

  return newVariants;
};

const ProductForm = ({ isOpen, onClose, onSave, initialData }) => {
  const { showToast } = useToast();
  const {
    formData,
    categories,
    brands,
    updateFormData,
    handleQuickAddBrand
  } = useProductForm(initialData, isOpen);

  const productTypeConfig = getProductTypeConfig(formData.productType);
  const typeOptions = getProductTypeOptions();

  const [colors, setColors] = React.useState([]);
  const [enabledSizes, setEnabledSizes] = React.useState([]);
  const [hasSizes, setHasSizes] = React.useState(true);

  // Initialize colors, enabledSizes and hasSizes when form opens or initialData changes
  React.useEffect(() => {
    if (isOpen) {
      const initialColors = getColorsFromVariants(initialData?.productVariants || []);
      if (initialColors.length === 0) {
        initialColors.push({ colorName: 'Màu tiêu chuẩn', colorCode: '#ffffff', colorImage: '' });
      }
      setColors(initialColors);

      const suggested = productTypeConfig.variantConfig?.suggestedSizes || [];
      let existingSizes = initialData?.productVariants?.map(v => v.sizeName).filter(Boolean) || [];
      
      if (suggested.length > 0) {
        existingSizes = existingSizes.filter(s => s.toUpperCase() !== 'OS' && s.toLowerCase() !== 'one size');
      }
      
      setEnabledSizes(Array.from(new Set([...suggested, ...existingSizes])));

      const hasAnySize = initialData?.productVariants?.some(v => v.sizeName && v.sizeName !== '' && v.sizeName.toUpperCase() !== 'OS') || false;
      if (initialData) {
        setHasSizes(hasAnySize);
      } else {
        setHasSizes(suggested.length > 0);
      }
    }
  }, [isOpen, initialData, formData.productType]);

  // Keep variants in sync with colors, productType (suggestedSizes), enabledSizes, hasSizes, and skuBase
  React.useEffect(() => {
    if (isOpen && colors.length > 0) {
      const suggested = productTypeConfig.variantConfig?.suggestedSizes || [];
      const sizesList = (hasSizes && suggested.length > 0) ? (enabledSizes.length > 0 ? enabledSizes : ['']) : [''];
      
      const newVariants = generateVariants(colors, sizesList, formData.variants, formData.skuBase);
      
      const hasChanged = JSON.stringify(newVariants) !== JSON.stringify(formData.variants);
      if (hasChanged) {
        updateFormData({ variants: newVariants });
      }
    }
  }, [colors, enabledSizes, hasSizes, formData.productType, formData.skuBase, isOpen]);

  // Auto-calculate total stock from variants
  React.useEffect(() => {
    if (formData.variants && formData.variants.length > 0) {
      const totalStock = formData.variants.reduce((sum, v) => sum + (parseInt(v.stockQuantity) || 0), 0);
      if (formData.stock !== totalStock) {
        updateFormData({ stock: totalStock });
      }
    }
  }, [formData.variants]);

  // Helper to render nested categories as interactive checkboxes
  const renderCategoryCheckboxes = (cats, level = 0) => {
    return cats.map(cat => {
      const isChecked = formData.categoryIds?.includes(cat.categoryId) || false;
      return (
        <div key={cat.categoryId} className="space-y-1">
          <div className="flex items-center gap-3 py-1.5" style={{ paddingLeft: `${level * 20}px` }}>
            <input
              type="checkbox"
              id={`cat-check-${cat.categoryId}`}
              checked={isChecked}
              onChange={(e) => {
                const checked = e.target.checked;
                let newIds = [...(formData.categoryIds || [])];
                if (checked) {
                  newIds.push(cat.categoryId);
                } else {
                  newIds = newIds.filter(id => id !== cat.categoryId);
                }
                updateFormData({ 
                  categoryIds: newIds,
                  categoryId: newIds.length > 0 ? newIds[0] : ''
                });
              }}
              className="w-4 h-4 cursor-pointer accent-secondary rounded border-outline-variant/30 text-secondary focus:ring-secondary"
            />
            <label htmlFor={`cat-check-${cat.categoryId}`} className="font-body text-xs cursor-pointer text-on-surface hover:text-secondary select-none">
              {cat.name}
            </label>
          </div>
          {cat.subCategories && cat.subCategories.length > 0 && 
            renderCategoryCheckboxes(cat.subCategories, level + 1)}
        </div>
      );
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.categoryIds || formData.categoryIds.length === 0) {
      showToast('Vui lòng chọn ít nhất một danh mục', 'error');
      return;
    }

    const submissionData = {
      ...formData,
      categoryIds: formData.categoryIds.map(id => parseInt(id)),
      categoryId: parseInt(formData.categoryIds[0]),
      brandId: formData.brandId === '' ? null : parseInt(formData.brandId),
      stock: parseInt(formData.stock)
    };
    onSave(submissionData);
  };

  if (!isOpen) return null;

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
              <p className="font-body text-xs text-on-surface-variant opacity-60">Xác định danh tính và loại sản phẩm</p>
            </div>

            <div className="md:col-span-12">
              <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-3 block">Tên Sản phẩm <span className="text-secondary font-bold">*</span></label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => updateFormData({ name: e.target.value })}
                className="w-full bg-transparent border-b border-outline-variant/40 py-2 font-body text-2xl focus:outline-none focus:border-secondary transition-colors"
                placeholder="VD: Premium Silk Slip Dress"
              />
            </div>

            <div className="md:col-span-4 space-y-3">
              <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant block">
                Loại sản phẩm <span className="text-secondary font-bold">*</span>
              </label>
              <div className="relative">
                <select
                  value={formData.productType}
                  onChange={(e) => updateFormData({ productType: e.target.value })}
                  className="w-full bg-surface-container border border-outline-variant/20 p-3 font-body text-sm focus:outline-none focus:border-secondary appearance-none cursor-pointer"
                  required
                >
                  {typeOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
              </div>
              <p className="text-[9px] text-on-surface-variant opacity-60 italic">
                * Quyết định các thông số kỹ thuật và biến thể bên dưới.
              </p>
            </div>

            <div className="md:col-span-4 space-y-3">
              <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant block">
                Danh mục hiển thị <span className="text-secondary font-bold">* (Chọn nhiều)</span>
              </label>
              <div className="border border-outline-variant/20 bg-surface-container/30 p-4 max-h-[160px] overflow-y-auto space-y-1 rounded shadow-inner">
                {categories.length > 0 ? (
                  renderCategoryCheckboxes(categories)
                ) : (
                  <p className="font-body text-xs text-on-surface-variant/40 italic p-2 text-center">Đang tải danh mục...</p>
                )}
              </div>
              <p className="text-[9px] text-on-surface-variant opacity-60 italic">
                * Vị trí hiển thị sản phẩm trên cửa hàng.
              </p>
            </div>

            <div className="md:col-span-4 space-y-3">
              <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant block">Giới tính</label>
              <div className="flex bg-surface-container border border-outline-variant/20 p-1">
                {GENDERS.map(gender => (
                  <button
                    key={gender.value}
                    type="button"
                    onClick={() => updateFormData({ gender: gender.value })}
                    className={`flex-1 py-2 font-label text-[10px] uppercase tracking-widest transition-colors ${
                      formData.gender === gender.value 
                        ? 'bg-secondary text-white font-bold shadow-sm' 
                        : 'text-on-surface-variant hover:bg-surface-container-high'
                    }`}
                  >
                    {gender.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="md:col-span-4">
              <BrandPicker 
                brands={brands} 
                value={formData.brandId} 
                onChange={(val) => updateFormData({ brandId: val })}
                onQuickAdd={handleQuickAddBrand}
              />
            </div>

            <div className="md:col-span-8 grid grid-cols-2 gap-6 items-start">
              <div>
                <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-3 block">Giá cơ bản (VND) <span className="text-secondary font-bold">*</span></label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.basePrice}
                  onChange={(e) => updateFormData({ basePrice: parseInt(e.target.value) })}
                  className="w-full bg-transparent border-b border-outline-variant/40 py-2 font-body text-lg focus:outline-none focus:border-secondary"
                />
              </div>
              <div className="relative">
                <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-3 block flex justify-between items-center">
                  Tồn kho chung
                  {formData.variants.length > 0 && (
                    <span className="text-[7px] bg-secondary/10 text-secondary px-1 py-0.5 font-bold animate-pulse">TỰ ĐỘNG</span>
                  )}
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.stock}
                  readOnly={formData.variants.length > 0}
                  onChange={(e) => updateFormData({ stock: parseInt(e.target.value) })}
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
                onChange={(newImages) => updateFormData({ images: newImages })} 
              />
            </div>
          </section>

          {/* Section 3: Màu sắc & Hình ảnh */}
          <section className="grid grid-cols-1 md:grid-cols-12 gap-x-12">
            <div className="md:col-span-12 border-l-4 border-secondary pl-6 mb-8">
              <h4 className="font-headline text-xl text-on-surface uppercase tracking-tight">03. Màu sắc & Hình ảnh</h4>
              <p className="font-body text-xs text-on-surface-variant opacity-60">Tải lên hình ảnh đại diện và mã màu sắc riêng biệt</p>
            </div>
            <div className="md:col-span-12">
              <ColorManager 
                colors={colors}
                onChange={setColors}
              />
            </div>
          </section>

          {/* Section 4: Kích cỡ & Tồn kho */}
          <section className="grid grid-cols-1 md:grid-cols-12 gap-x-12">
            <div className="md:col-span-12 border-l-4 border-secondary pl-6 mb-8">
              <h4 className="font-headline text-xl text-on-surface uppercase tracking-tight">04. Kích cỡ & Tồn kho</h4>
              <p className="font-body text-xs text-on-surface-variant opacity-60">Tồn kho chi tiết cho từng kích cỡ mặc định của mỗi màu</p>
            </div>
            <div className="md:col-span-12">
              <InventoryManager 
                colors={colors}
                suggestedSizes={productTypeConfig.variantConfig?.suggestedSizes || []}
                sizeLabel={productTypeConfig.variantConfig?.sizeLabel || 'Kích cỡ'}
                variants={formData.variants}
                skuBase={formData.skuBase}
                onChange={(newVariants) => updateFormData({ variants: newVariants })}
                enabledSizes={enabledSizes}
                setEnabledSizes={setEnabledSizes}
                hasSizes={hasSizes}
                setHasSizes={setHasSizes}
              />
            </div>
          </section>

          {/* Section 5: Chi tiết */}
          <section className="grid grid-cols-1 md:grid-cols-12 gap-x-12 gap-y-10">
            <div className="md:col-span-12 border-l-4 border-secondary pl-6 mb-4">
              <h4 className="font-headline text-xl text-on-surface uppercase tracking-tight">05. Chất liệu & Thông số</h4>
              <p className="font-body text-xs text-on-surface-variant opacity-60">Cấu hình thông số kỹ thuật đặc thù cho <strong className="text-secondary">{productTypeConfig.label}</strong></p>
            </div>

            <div className="md:col-span-12">
              <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-3 block">Chất liệu chính</label>
              <div className="flex flex-wrap gap-2 mb-4">
                {COMMON_MATERIALS.map(m => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => updateFormData({ material: m.name })}
                    className={`px-3 py-1 font-body text-[10px] border transition-all ${
                      formData.material === m.name 
                        ? 'bg-secondary text-white border-secondary' 
                        : 'border-outline-variant/30 text-on-surface-variant hover:border-secondary'
                    }`}
                  >
                    {m.name}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={formData.material}
                onChange={(e) => updateFormData({ material: e.target.value })}
                className="w-full bg-transparent border-b border-outline-variant/40 py-2 font-body text-sm focus:outline-none focus:border-secondary"
                placeholder="Hoặc tự nhập chất liệu khác..."
              />
            </div>

            <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-8 bg-surface-container-low/40 p-6 border border-outline-variant/10">
              <div className="md:col-span-2 border-b border-outline-variant/10 pb-2">
                <h5 className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">Thông số đặc thù: {productTypeConfig.label}</h5>
              </div>
              
              {productTypeConfig.specsDefinition.map(spec => (
                <div key={spec.key} className="space-y-2">
                  <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant block">{spec.label}</label>
                  <input
                    type="text"
                    value={formData.specifications?.[spec.key] || ''}
                    onChange={(e) => {
                      const newSpecs = { ...formData.specifications, [spec.key]: e.target.value };
                      updateFormData({ specifications: newSpecs });
                    }}
                    className="w-full bg-transparent border-b border-outline-variant/40 py-2 font-body text-sm focus:outline-none focus:border-secondary"
                    placeholder={`Nhập ${spec.label.toLowerCase()}...`}
                  />
                </div>
              ))}

              <div className="md:col-span-2 space-y-2 mt-4">
                <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant block">Thông số khác (Tự do)</label>
                <textarea
                  value={formData.specifications?.custom_specs || ''}
                  onChange={(e) => {
                    const newSpecs = { ...formData.specifications, custom_specs: e.target.value };
                    updateFormData({ specifications: newSpecs });
                  }}
                  rows={3}
                  className="w-full bg-transparent border border-outline-variant/20 p-4 font-body text-sm focus:outline-none focus:border-secondary resize-y"
                  placeholder="Nhập các thông số chi tiết khác (mỗi thông số một dòng)..."
                />
              </div>
            </div>

            <div className="md:col-span-4">
              <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-3 block">Mã SKU gốc <span className="text-secondary font-bold">*</span></label>
              <input
                type="text"
                required
                autoComplete="off"
                value={formData.skuBase}
                onChange={(e) => updateFormData({ skuBase: e.target.value })}
                className="w-full bg-transparent border-b border-outline-variant/40 py-2 font-body text-sm focus:outline-none focus:border-secondary"
              />
            </div>

            <div className="md:col-span-12">
              <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-3 block">Mô tả sản phẩm</label>
              <textarea
                value={formData.description}
                onChange={(e) => updateFormData({ description: e.target.value })}
                className="w-full bg-transparent border border-outline-variant/20 p-6 font-body text-sm focus:outline-none focus:border-secondary min-h-[150px]"
              />
            </div>
            
            <div className="md:col-span-12">
              <div className="p-8 bg-surface-container-low border border-outline-variant/10">
                <div className="flex justify-between items-start mb-4">
                   <h5 className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest">Xem trước SEO</h5>
                   <span className="bg-success-container text-on-success-container text-[8px] px-2 py-0.5 rounded-full uppercase font-bold">Đã tối ưu</span>
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
