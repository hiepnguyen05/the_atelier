import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useToast } from '../../contexts/ToastContext';
import { productService } from '../../services';

export const useCartPage = () => {
  const { cartItems, cartCount, loading, updateQuantity, removeFromCart } = useCart();
  const { showToast } = useToast();

  const [recommendations, setRecommendations] = useState([]);
  const [recommendationsLoading, setRecommendationsLoading] = useState(true);
  
  // State for selected item checkboxes
  const [selectedItemIds, setSelectedItemIds] = useState([]);

  // Auto-select all items on initial load
  useEffect(() => {
    if (cartItems.length > 0 && selectedItemIds.length === 0) {
      setSelectedItemIds(cartItems.map(item => item.cartItemId));
    }
  }, [cartItems]);

  // Clean up selected IDs if items are removed from cart
  useEffect(() => {
    const validIds = cartItems.map(item => item.cartItemId);
    setSelectedItemIds(prev => prev.filter(id => validIds.includes(id)));
  }, [cartItems]);

  // Fetch recommended products based on the items currently in the cart
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setRecommendationsLoading(true);
        const cartProductIds = cartItems.map(item => item.variant?.product?.productId).filter(Boolean);
        let fetchedProducts = [];

        if (cartItems.length > 0) {
          // Lấy ngẫu nhiên một sản phẩm trong giỏ để làm cơ sở gợi ý
          const randomBaseItem = cartItems[Math.floor(Math.random() * cartItems.length)];
          const baseProduct = randomBaseItem.variant?.product;
          
          if (baseProduct) {
            // Lấy các sản phẩm cùng loại (productType)
            const res = await productService.getAll({ 
              productType: baseProduct.productType,
              limit: 8
            });
            fetchedProducts = (res.data.products || []).filter(p => !cartProductIds.includes(p.productId));
          }
        }

        // Nếu không đủ 4 sản phẩm gợi ý cùng loại hoặc giỏ hàng trống, lấy sản phẩm ngẫu nhiên khác làm fallback
        if (fetchedProducts.length < 4) {
          const fallbackRes = await productService.getAll({ limit: 12 });
          const fallbackProducts = (fallbackRes.data.products || []).filter(
            p => !cartProductIds.includes(p.productId) && !fetchedProducts.some(f => f.productId === p.productId)
          );
          fetchedProducts = [...fetchedProducts, ...fallbackProducts];
        }

        // Trộn ngẫu nhiên danh sách gợi ý để tăng tính khám phá
        const shuffled = fetchedProducts.sort(() => 0.5 - Math.random());
        setRecommendations(shuffled.slice(0, 4));
      } catch (err) {
        console.error('Error fetching recommendations:', err);
      } finally {
        setRecommendationsLoading(false);
      }
    };

    // Chỉ gọi lại API gợi ý khi độ dài giỏ hàng thay đổi (thêm/xóa sản phẩm)
    fetchRecommendations();
  }, [cartItems.length]);

  // Format price to Vietnamese Dong
  const formatPrice = (price) => {
    if (price === undefined || price === null) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  // Extract primary image from product
  const getProductImage = (product) => {
    if (product?.productImages && product.productImages.length > 0) {
      const primaryImg = product.productImages.find(img => img.isPrimary === true || img.isPrimary === 1 || img.isPrimary === '1');
      if (primaryImg) return primaryImg.imageUrl;
      return product.productImages[0].imageUrl;
    }
    return 'https://via.placeholder.com/600x800?text=THE+ATELIER';
  };

  // Checkbox toggle actions
  const toggleItemSelection = (itemId) => {
    setSelectedItemIds(prev =>
      prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
    );
  };

  const isAllSelected = cartItems.length > 0 && selectedItemIds.length === cartItems.length;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedItemIds([]);
    } else {
      setSelectedItemIds(cartItems.map(item => item.cartItemId));
    }
  };

  // Perform subtotal, tax, and grand total calculations (ONLY for selected items)
  const subtotal = cartItems.reduce((sum, item) => {
    if (!selectedItemIds.includes(item.cartItemId)) return sum;
    const base = Number(item.variant?.product?.basePrice || 0);
    const adjustment = Number(item.variant?.priceAdjustment || 0);
    return sum + (base + adjustment) * item.quantity;
  }, 0);

  const estimatedTax = subtotal * 0.08; // 8% VAT
  const total = subtotal + estimatedTax;

  const navigate = useNavigate();

  const handleCheckout = () => {
    if (selectedItemIds.length === 0) {
      showToast('Vui lòng chọn ít nhất 1 sản phẩm để thanh toán', 'error');
      return;
    }
    navigate('/checkout', { state: { selectedItemIds } });
  };

  return {
    cartItems,
    cartCount,
    loading,
    updateQuantity,
    removeFromCart,
    recommendations,
    recommendationsLoading,
    subtotal,
    estimatedTax,
    total,
    formatPrice,
    getProductImage,
    handleCheckout,
    selectedItemIds,
    toggleItemSelection,
    toggleSelectAll,
    isAllSelected,
  };
};

export default useCartPage;
