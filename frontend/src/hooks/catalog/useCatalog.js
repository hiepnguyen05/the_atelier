import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productService, categoryService } from '../../services';

export const useCatalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters state
  const [params, setParams] = useState({
    page: 1,
    limit: 12,
    categoryId: searchParams.get('categoryId') || '',
    search: searchParams.get('search') || '',
    productType: searchParams.get('productType') || '',
    gender: searchParams.get('gender') || '',
    sort: 'newest',
  });

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryService.getAll();
        setCategories(res.data || []);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Update query params when search changes in URL
  useEffect(() => {
    const searchVal = searchParams.get('search') || '';
    const catId = searchParams.get('categoryId') || '';
    const type = searchParams.get('productType') || '';
    const gen = searchParams.get('gender') || '';
    setParams(prev => ({
      ...prev,
      search: searchVal,
      categoryId: catId,
      productType: type,
      gender: gen,
      page: 1
    }));
  }, [searchParams]);

  // Fetch products
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await productService.getAll({
        page: params.page,
        limit: params.limit,
        categoryId: params.categoryId,
        productType: params.productType,
        gender: params.gender,
        search: params.search,
        sort: params.sort,
      });

      setProducts(res.data.products || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const updateURLParams = (newParams) => {
    const currentParams = Object.fromEntries(searchParams.entries());
    const updatedParams = { ...currentParams, ...newParams };
    
    // Cleanup empty params
    Object.keys(updatedParams).forEach(key => {
      if (!updatedParams[key]) delete updatedParams[key];
    });
    
    setSearchParams(updatedParams);
  };

  const handleFilterChange = (key, value) => {
    setParams(prev => ({ ...prev, [key]: value, page: 1 }));
    updateURLParams({ [key]: value });
  };

  const formatPrice = (price) => {
    if (price === undefined || price === null) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const getProductImage = (product) => {
    if (product.productImages && product.productImages.length > 0) {
      const primaryImg = product.productImages.find(img => img.isPrimary === true || img.isPrimary === 1 || img.isPrimary === '1');
      if (primaryImg) return primaryImg.imageUrl;
      return product.productImages[0].imageUrl;
    }
    return 'https://via.placeholder.com/600x800?text=THE+ATELIER';
  };

  return {
    products,
    categories,
    loading,
    error,
    params,
    handleFilterChange,
    formatPrice,
    getProductImage,
  };
};
