import { useState, useEffect, useCallback } from 'react';
import { productService } from '../../services';

export const useProducts = (initialParams = {}) => {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ totalItems: 0, totalPages: 0, currentPage: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [params, setParams] = useState({ page: 1, limit: 10, ...initialParams });

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await productService.getAll(params);
      const { products, totalItems, totalPages, currentPage } = response.data;
      setProducts(products);
      setPagination({ totalItems, totalPages, currentPage });
      setError(null);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Không thể tải danh sách sản phẩm.');
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const deleteProduct = async (id) => {
    try {
      await productService.delete(id);
      setProducts(prev => prev.filter(p => p.productId !== id));
      return true;
    } catch (err) {
      console.error('Error deleting product:', err);
      throw err;
    }
  };

  const createProduct = async (data) => {
    try {
      const response = await productService.create(data);
      setProducts(prev => [response.data, ...prev]);
      return response.data;
    } catch (err) {
      console.error('Error creating product:', err);
      throw err;
    }
  };

  const updateProduct = async (id, data) => {
    try {
      const response = await productService.update(id, data);
      setProducts(prev => prev.map(p => p.productId === id ? response.data : p));
      return response.data;
    } catch (err) {
      console.error('Error updating product:', err);
      throw err;
    }
  };

  return {
    products,
    pagination,
    loading,
    error,
    params,
    setParams,
    refresh: fetchProducts,
    deleteProduct,
    createProduct,
    updateProduct
  };
};
