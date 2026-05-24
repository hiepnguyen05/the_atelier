import { useState, useEffect } from 'react';
import { productService } from '../../services';
import { useToast } from '../../contexts/ToastContext';
import { useCart } from '../../contexts/CartContext';
import { getProductTypeConfig } from '../../constants/productTypes';

export const useProductDetail = (slug) => {
  const { showToast } = useToast();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [extractedBgColor, setExtractedBgColor] = useState('#fcf9f8');
  const [lightboxImg, setLightboxImg] = useState(null);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [sizeGuideGender, setSizeGuideGender] = useState('nu'); // 'nam' or 'nu'
  const [sizeGuideType, setSizeGuideType] = useState('top'); // 'top', 'bottom', 'shoes'

  const [zoomedImgId, setZoomedImgId] = useState(null);
  const [zoomStyle, setZoomStyle] = useState({ transformOrigin: 'center', transform: 'scale(1)' });

  const openSizeGuide = () => {
    if (!product) return;
    if (product.gender === 'nam') {
      setSizeGuideGender('nam');
    } else {
      setSizeGuideGender('nu');
    }

    if (product.productType === 'clothing_bottom') {
      setSizeGuideType('bottom');
    } else if (product.productType === 'shoes' || product.productType === 'slippers') {
      setSizeGuideType('shoes');
    } else {
      setSizeGuideType('top');
    }

    setShowSizeGuide(true);
  };

  const handleImageClick = (e, imgId) => {
    if (zoomedImgId === imgId) {
      setZoomedImgId(null);
      setZoomStyle({ transformOrigin: 'center', transform: 'scale(1)' });
    } else {
      setZoomedImgId(imgId);
      const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - left) / width) * 100;
      const y = ((e.clientY - top) / height) * 100;
      setZoomStyle({
        transformOrigin: `${x}% ${y}%`,
        transform: 'scale(2.2)'
      });
    }
  };

  const handleImageMouseMove = (e, imgId) => {
    if (zoomedImgId !== imgId) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: 'scale(2.2)'
    });
  };

  const handleImageMouseLeave = () => {
    setZoomedImgId(null);
    setZoomStyle({ transformOrigin: 'center', transform: 'scale(1)' });
  };

  // Extract background color when product changes
  useEffect(() => {
    if (!product) return;
    const images = product.productImages || [];
    const primaryImg = images.find(img => img.isPrimary === true || img.isPrimary === 1 || img.isPrimary === '1');
    const primaryUrl = primaryImg ? primaryImg.imageUrl : (images[0]?.imageUrl || 'https://via.placeholder.com/600x800?text=THE+ATELIER');

    if (!primaryUrl || primaryUrl.includes('placeholder') || primaryUrl.startsWith('data:')) {
      setExtractedBgColor('#fcf9f8');
      return;
    }

    const img = new Image();
    img.crossOrigin = 'Anonymous';
    
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 10;
        canvas.height = 10;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setExtractedBgColor('#fcf9f8');
          return;
        }

        ctx.drawImage(img, 0, 0, 10, 10);
        const topLeft = ctx.getImageData(0, 0, 1, 1).data;
        const topRight = ctx.getImageData(9, 0, 1, 1).data;
        const bottomLeft = ctx.getImageData(0, 9, 1, 1).data;
        const bottomRight = ctx.getImageData(9, 9, 1, 1).data;

        const r = Math.round((topLeft[0] + topRight[0] + bottomLeft[0] + bottomRight[0]) / 4);
        const g = Math.round((topLeft[1] + topRight[1] + bottomLeft[1] + bottomRight[1]) / 4);
        const b = Math.round((topLeft[2] + topRight[2] + bottomLeft[2] + bottomRight[2]) / 4);
        const a = Math.round((topLeft[3] + topRight[3] + bottomLeft[3] + bottomRight[3]) / 4);

        if (a < 200) {
          setExtractedBgColor('#fcf9f8');
        } else {
          setExtractedBgColor(`rgba(${r}, ${g}, ${b}, ${a / 255})`);
        }
      } catch (e) {
        console.warn('CORS or canvas error extracting background color in detail page:', primaryUrl, e);
        setExtractedBgColor('#fcf9f8');
      }
    };

    img.onerror = () => {
      setExtractedBgColor('#fcf9f8');
    };

    img.src = primaryUrl;
  }, [product]);

  // Fetch product detail and recommendations
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        // 1. Fetch current product by slug
        const res = await productService.getBySlug(slug);
        const productData = res.data;
        if (!productData) {
          setError('Không tìm thấy sản phẩm.');
          return;
        }
        setProduct(productData);

        // Initialize selections
        const rawSizes = Array.from(new Set(productData.productVariants?.map(v => v.sizeName?.trim()).filter(Boolean) || []));
        const uniqueSizes = rawSizes.filter(s => {
          const isOS = s.toUpperCase() === 'OS' || s.toLowerCase() === 'one size';
          return !(isOS && rawSizes.length > 1);
        });

        // Sort uniqueSizes
        const typeConfig = getProductTypeConfig(productData.productType);
        const suggested = typeConfig?.variantConfig?.suggestedSizes || [];
        uniqueSizes.sort((a, b) => {
          const indexA = suggested.indexOf(a);
          const indexB = suggested.indexOf(b);
          if (indexA === -1 && indexB === -1) return a.localeCompare(b);
          if (indexA === -1) return 1;
          if (indexB === -1) return -1;
          return indexA - indexB;
        });

        const productImagesList = productData.productImages || [];
        const primaryImg = productImagesList.find(img => img.isPrimary === true || img.isPrimary === 1 || img.isPrimary === '1') || productImagesList[0];
        const primaryImgUrl = primaryImg ? primaryImg.imageUrl : '';

        const uniqueColorsMap = {};
        productData.productVariants?.forEach(v => {
          const name = v.colorName?.trim();
          if (name && !uniqueColorsMap[name]) {
            uniqueColorsMap[name] = {
              name,
              code: v.colorCode || '#ffffff',
              image: v.colorImage || (name === 'Màu tiêu chuẩn' ? primaryImgUrl : '')
            };
          }
        });
        const uniqueColors = Object.values(uniqueColorsMap).sort((a, b) => {
          if (a.name === 'Màu tiêu chuẩn') return -1;
          if (b.name === 'Màu tiêu chuẩn') return 1;
          return a.name.localeCompare(b.name);
        });

        if (uniqueSizes.length > 0) {
          setSelectedSize(uniqueSizes[0]);
        } else {
          const isApparelOrShoes = ['clothing_top', 'clothing_bottom', 'shoes', 'slippers'].includes(productData.productType);
          if (isApparelOrShoes) {
            const suggestedSuggested = typeConfig?.variantConfig?.suggestedSizes || [];
            if (suggestedSuggested.length > 0) setSelectedSize(suggestedSuggested[0]);
          }
        }
        if (uniqueColors.length > 0) {
          const standardColor = uniqueColors.find(c => c.name === 'Màu tiêu chuẩn');
          setSelectedColor(standardColor ? standardColor.name : uniqueColors[0].name);
        }

        // 2. Fetch recommendations of the same product type (excluding current product)
        const sameTypeRes = await productService.getAll({ 
          productType: productData.productType, 
          limit: 10 
        });
        const sameTypeProducts = (sameTypeRes.data.products || [])
          .filter(p => p.productId !== productData.productId);

        let recs = [...sameTypeProducts];
        
        if (recs.length < 3) {
          // Fetch fallback products
          const fallbackRes = await productService.getAll({ limit: 30 });
          let fallbackProducts = (fallbackRes.data.products || [])
            .filter(p => p.productId !== productData.productId && !recs.some(r => r.productId === p.productId));
          
          // Shuffle fallbacks to make them random
          fallbackProducts = fallbackProducts.sort(() => 0.5 - Math.random());
          
          const needed = 3 - recs.length;
          recs = [...recs, ...fallbackProducts.slice(0, needed)];
        } else {
          // Shuffle the same-type products to make recommendations dynamic
          recs = recs.sort(() => 0.5 - Math.random());
        }
        setRecommendations(recs.slice(0, 3));

        setError(null);
      } catch (err) {
        console.error('Error fetching product details:', err);
        setError('Không thể tải thông tin chi tiết sản phẩm. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
    window.scrollTo(0, 0);
  }, [slug]);

  const formatPrice = (price) => {
    if (price === undefined || price === null) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const getProductImage = (prod) => {
    if (prod.productImages && prod.productImages.length > 0) {
      const primaryImg = prod.productImages.find(img => img.isPrimary === true || img.isPrimary === 1 || img.isPrimary === '1');
      if (primaryImg) return primaryImg.imageUrl;
      return prod.productImages[0].imageUrl;
    }
    return 'https://via.placeholder.com/600x800?text=THE+ATELIER';
  };

  const images = product?.productImages || [];
  const activeColorVariant = product?.productVariants?.find(v => v.colorName?.trim() === selectedColor?.trim() && v.colorImage);
  const colorImageUrl = activeColorVariant ? activeColorVariant.colorImage : null;

  let finalImages = [...images];
  if (colorImageUrl) {
    const existsIdx = finalImages.findIndex(img => img.imageUrl === colorImageUrl);
    if (existsIdx !== -1) {
      const [ex] = finalImages.splice(existsIdx, 1);
      finalImages = [ex, ...finalImages];
    } else {
      finalImages = [{ imageUrl: colorImageUrl, isPrimary: true, imageId: 'color-img-temp' }, ...finalImages];
    }
  }

  const primaryImage = finalImages.find(img => img.isPrimary === true || img.isPrimary === 1 || img.isPrimary === '1') || finalImages[0];
  const otherImages = finalImages.filter(img => img.imageUrl !== primaryImage?.imageUrl);
  const orderedImages = primaryImage ? [primaryImage, ...otherImages] : finalImages;

  const productCategory = product?.category || null;
  const productTypeConfig = product ? getProductTypeConfig(product.productType || 'clothing_top') : null;
  const parsedConfig = productTypeConfig?.variantConfig;

  const sizeLabel = parsedConfig?.sizeLabel;
  const colorLabel = parsedConfig?.colorLabel;

  const rawSizes = Array.from(new Set(product?.productVariants?.map(v => v.sizeName?.trim()).filter(Boolean) || []));
  const uniqueSizes = rawSizes.filter(s => {
    const isOS = s.toUpperCase() === 'OS' || s.toLowerCase() === 'one size';
    return !(isOS && rawSizes.length > 1);
  });

  const primaryImg = images.find(img => img.isPrimary === true || img.isPrimary === 1 || img.isPrimary === '1') || images[0];
  const primaryImgUrl = primaryImg ? primaryImg.imageUrl : '';

  const uniqueColorsMap = {};
  product?.productVariants?.forEach(v => {
    const name = v.colorName?.trim();
    if (name && !uniqueColorsMap[name]) {
      uniqueColorsMap[name] = {
        name,
        code: v.colorCode || '#ffffff',
        image: v.colorImage || (name === 'Màu tiêu chuẩn' ? primaryImgUrl : '')
      };
    }
  });
  const uniqueColors = Object.values(uniqueColorsMap).sort((a, b) => {
    if (a.name === 'Màu tiêu chuẩn') return -1;
    if (b.name === 'Màu tiêu chuẩn') return 1;
    return a.name.localeCompare(b.name);
  });

  const isApparelOrShoes = product ? ['clothing_top', 'clothing_bottom', 'shoes', 'slippers'].includes(product.productType) : false;
  
  // Sort sizes according to suggestedSizes order
  const suggested = productTypeConfig?.variantConfig?.suggestedSizes || [];
  const sortedSizes = [...uniqueSizes].sort((a, b) => {
    const indexA = suggested.indexOf(a);
    const indexB = suggested.indexOf(b);
    if (indexA === -1 && indexB === -1) return a.localeCompare(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  const sizesToDisplay = sortedSizes.length > 0 
    ? sortedSizes 
    : (isApparelOrShoes && productTypeConfig ? productTypeConfig.variantConfig.suggestedSizes : []);

  const specifications = product?.specifications || {};

  const handleAddToCart = async () => {
    if (!product) return;
    if (sizeLabel && sizesToDisplay.length > 0 && !selectedSize) {
      showToast(`Vui lòng chọn ${sizeLabel.toLowerCase()} sản phẩm`);
      return;
    }
    
    // Tìm variant khớp với màu sắc và kích thước được chọn
    const matchingVariant = product.productVariants?.find(v => 
      (v.colorName?.trim() || '').toLowerCase() === (selectedColor?.trim() || '').toLowerCase() &&
      (v.sizeName?.trim() || '').toLowerCase() === (selectedSize?.trim() || '').toLowerCase()
    );

    const variant = matchingVariant || product.productVariants?.[0];

    if (!variant) {
      showToast('Sản phẩm tạm thời hết hàng hoặc không có biến thể khả dụng', 'error');
      return;
    }

    await addToCart(variant.variantId, 1);
  };

  return {
    product,
    recommendations,
    loading,
    error,
    selectedSize,
    setSelectedSize,
    selectedColor,
    setSelectedColor,
    extractedBgColor,
    lightboxImg,
    setLightboxImg,
    showSizeGuide,
    setShowSizeGuide,
    sizeGuideGender,
    setSizeGuideGender,
    sizeGuideType,
    setSizeGuideType,
    zoomedImgId,
    zoomStyle,
    openSizeGuide,
    handleImageClick,
    handleImageMouseMove,
    handleImageMouseLeave,
    handleAddToCart,
    formatPrice,
    getProductImage,
    orderedImages,
    productCategory,
    productTypeConfig,
    sizeLabel,
    colorLabel,
    uniqueColors,
    sizesToDisplay,
    specifications,
  };
};
