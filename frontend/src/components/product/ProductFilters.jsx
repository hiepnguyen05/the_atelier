import React, { useState, useEffect } from 'react';
import { categoryService, brandService } from '../../services';

const ProductFilters = ({ params, onFilterChange }) => {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          categoryService.getAll(),
          brandService.getAll()
        ]);
        setCategories(catRes.data);
        setBrands(brandRes.data);
      } catch (err) {
        console.error('Error fetching filter data:', err);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ ...params, [name]: value, page: 1 });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Search is usually triggered on change or blur, 
    // but we can add a manual trigger if needed.
  };

  const clearFilters = () => {
    onFilterChange({ page: 1, limit: 10, search: '' });
  };

  return (
    <div className="bg-surface p-6 border border-outline-variant/10 shadow-sm mb-12">
      <div className="flex flex-col md:flex-row gap-6 items-end">
        {/* Search Bar */}
        <div className="flex-1">
          <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-2 block">Tìm kiếm</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">search</span>
            <input
              type="text"
              name="search"
              value={params.search || ''}
              onChange={handleChange}
              placeholder="Tên sản phẩm hoặc mã SKU..."
              className="w-full bg-surface-container-lowest border border-outline-variant/20 py-2.5 pl-10 pr-4 font-body text-sm focus:outline-none focus:border-secondary transition-colors"
            />
          </div>
        </div>

        {/* Sort */}
        <div className="w-full md:w-48">
          <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-2 block">Sắp xếp</label>
          <select
            name="sort"
            value={params.sort || 'newest'}
            onChange={handleChange}
            className="w-full bg-surface-container-lowest border border-outline-variant/20 py-2.5 px-4 font-body text-sm focus:outline-none focus:border-secondary cursor-pointer"
          >
            <option value="newest">Mới nhất</option>
            <option value="oldest">Cũ nhất</option>
            <option value="price_asc">Giá: Thấp đến Cao</option>
            <option value="price_desc">Giá: Cao đến Thấp</option>
            <option value="name_asc">Tên: A - Z</option>
          </select>
        </div>

        {/* Advanced Toggle */}
        <button 
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-secondary hover:underline pb-3"
        >
          <span className="material-symbols-outlined text-sm">{showAdvanced ? 'expand_less' : 'tune'}</span>
          {showAdvanced ? 'Thu gọn' : 'Bộ lọc nâng cao'}
        </button>

        {/* Clear Button */}
        <button 
          onClick={clearFilters}
          className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-on-surface-variant hover:text-on-surface pb-3"
        >
          <span className="material-symbols-outlined text-sm">restart_alt</span>
          Làm mới
        </button>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pt-8 border-t border-outline-variant/10 animate-in fade-in slide-in-from-top-2 duration-300">
          <div>
            <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-2 block">Danh mục</label>
            <select
              name="categoryId"
              value={params.categoryId || ''}
              onChange={handleChange}
              className="w-full bg-surface-container-lowest border border-outline-variant/20 py-2 px-4 font-body text-sm focus:outline-none focus:border-secondary"
            >
              <option value="">Tất cả danh mục</option>
              {categories.map(cat => (
                <option key={cat.categoryId} value={cat.categoryId}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-2 block">Thương hiệu</label>
            <select
              name="brandId"
              value={params.brandId || ''}
              onChange={handleChange}
              className="w-full bg-surface-container-lowest border border-outline-variant/20 py-2 px-4 font-body text-sm focus:outline-none focus:border-secondary"
            >
              <option value="">Tất cả thương hiệu</option>
              {brands.map(brand => (
                <option key={brand.brandId} value={brand.brandId}>{brand.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-2 block">Trạng thái</label>
            <select
              name="status"
              value={params.status || 'all'}
              onChange={handleChange}
              className="w-full bg-surface-container-lowest border border-outline-variant/20 py-2 px-4 font-body text-sm focus:outline-none focus:border-secondary"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang bán</option>
              <option value="inactive">Đã ẩn</option>
              <option value="draft">Bản nháp</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductFilters;
