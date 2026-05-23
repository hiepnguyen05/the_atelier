import { useState, useEffect, useCallback } from 'react';
import { categoryService } from '../../services';

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const response = await categoryService.getAll();
      setCategories(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Không thể tải danh mục. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const deleteCategory = async (id) => {
    try {
      await categoryService.delete(id);
      setCategories(prev => prev.filter(cat => cat.categoryId !== id));
      return true;
    } catch (err) {
      console.error('Error deleting category:', err);
      throw err;
    }
  };

  const createCategory = async (data) => {
    try {
      const response = await categoryService.create(data);
      setCategories(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      console.error('Error creating category:', err);
      throw err;
    }
  };

  const updateCategory = async (id, data) => {
    try {
      const response = await categoryService.update(id, data);
      setCategories(prev => prev.map(cat => cat.categoryId === id ? response.data : cat));
      return response.data;
    } catch (err) {
      console.error('Error updating category:', err);
      throw err;
    }
  };

  return {
    categories,
    loading,
    error,
    refresh: fetchCategories,
    deleteCategory,
    createCategory,
    updateCategory
  };
};
