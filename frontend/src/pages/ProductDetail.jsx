import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { productService } from '../services';
import { useToast } from '../contexts/ToastContext';

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [product, setProduct] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [activeImageUrl, setActiveImageUrl] = useState('');

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

        // Set default active image (primary image or first image)
        const images = productData.productImages || [];
        const primaryImg = images.find(img => img.isPrimary === true || img.isPrimary === 1 || img.isPrimary === '1');
        setActiveImageUrl(primaryImg ? primaryImg.imageUrl : (images[0]?.imageUrl || 'https://via.placeholder.com/600x800?text=THE+ATELIER'));

        // Initialize selections
        const uniqueSizes = Array.from(new Set(productData.productVariants?.map(v => v.sizeName).filter(Boolean) || []));
        const uniqueColors = Array.from(new Set(productData.productVariants?.map(v => v.colorName).filter(Boolean) || []));
        if (uniqueSizes.length > 0) setSelectedSize(uniqueSizes[0]);
        if (uniqueColors.length > 0) setSelectedColor(uniqueColors[0]);

        // 2. Fetch recommendations (limit to 4 products to filter out current one)
        const recRes = await productService.getAll({ limit: 4 });
        const allProducts = recRes.data.products || [];
        const filteredRecs = allProducts
          .filter(p => p.productId !== productData.productId)
          .slice(0, 3);
        setRecommendations(filteredRecs);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center font-headline text-2xl animate-pulse text-on-surface-variant">
          Đang tải câu chuyện sản phẩm...
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6">
        <h1 className="font-headline text-3xl mb-4 text-error">{error || 'Không tìm thấy sản phẩm.'}</h1>
        <Link to="/products" className="font-label text-xs tracking-widest border-b border-on-surface pb-1 uppercase">
          Quay lại danh mục
        </Link>
      </div>
    );
  }

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

  const images = product.productImages || [];
  const primaryImage = images.find(img => img.isPrimary === true || img.isPrimary === 1 || img.isPrimary === '1') || images[0];
  const otherImages = images.filter(img => img.imageId !== primaryImage?.imageId);

  // Setup detail spots beautifully
  const detailImage1 = otherImages[0]?.imageUrl || primaryImage?.imageUrl;
  const detailImage2 = otherImages[1]?.imageUrl || otherImages[0]?.imageUrl || primaryImage?.imageUrl;

  const productCategory = product.categories?.find(
    cat => cat.categoryId === product.categoryId
  ) || product.categories?.[0] || null;
  let parsedConfig = null;
  if (productCategory?.attributeConfig) {
    try {
      parsedConfig = typeof productCategory.attributeConfig === 'string'
        ? JSON.parse(productCategory.attributeConfig)
        : productCategory.attributeConfig;
    } catch (e) {
      console.error("Error parsing category attributeConfig in detail page", e);
    }
  }

  const sizeLabel = parsedConfig?.variant_size_label !== undefined 
    ? parsedConfig.variant_size_label 
    : "Kích cỡ";
  const colorLabel = parsedConfig?.variant_color_label !== undefined 
    ? parsedConfig.variant_color_label 
    : "Màu sắc";

  const uniqueSizes = Array.from(new Set(product.productVariants?.map(v => v.sizeName?.trim()).filter(Boolean) || []));
  const uniqueColors = Array.from(new Set(product.productVariants?.map(v => v.colorName?.trim()).filter(Boolean) || []));

  let specifications = null;
  if (product.specifications) {
    try {
      specifications = typeof product.specifications === 'string'
        ? JSON.parse(product.specifications)
        : product.specifications;
    } catch (e) {
      console.error("Error parsing product specifications in detail page", e);
    }
  }

  const handleAddToCart = () => {
    if (sizeLabel && uniqueSizes.length > 0 && !selectedSize) {
      showToast(`Vui lòng chọn ${sizeLabel.toLowerCase()} sản phẩm`);
      return;
    }
    const spec = [selectedColor, selectedSize].filter(Boolean).join(' / ');
    showToast(`Đã thêm ${product.name} ${spec ? `(${spec})` : ''} vào túi xách thành công!`);
  };

  return (
    <div className="bg-background text-on-background selection:bg-secondary-fixed selection:text-on-secondary-fixed">
      {/* Product Hero Section */}
      <section className="grid grid-cols-1 md:grid-cols-12 min-h-screen">
        {/* Image Gallery */}
        <div className="md:col-span-7 bg-surface-container-low p-4 md:p-12 flex flex-col md:flex-row gap-6">
          {/* Thumbnails Column (Hidden on mobile, scrollable on desktop) */}
          {images.length > 1 && (
            <div className="hidden md:flex flex-col gap-4 w-20 shrink-0">
              {images.map((img, index) => (
                <div
                  key={img.imageId || index}
                  onClick={() => setActiveImageUrl(img.imageUrl)}
                  className={`aspect-[3/4] w-full overflow-hidden bg-surface-container/30 border cursor-pointer transition-all duration-300 hover:opacity-100 ${
                    activeImageUrl === img.imageUrl ? 'border-on-surface opacity-100' : 'border-outline-variant/30 opacity-60'
                  }`}
                >
                  <img
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                    src={img.imageUrl}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Main Display Image */}
          <div className="flex-1 space-y-8">
            <div className="aspect-[4/5] w-full overflow-hidden bg-surface-container/30 border border-outline-variant/5">
              <img 
                alt={product.name} 
                className="w-full h-full object-cover cursor-zoom-in transition-transform duration-700 hover:scale-105" 
                src={activeImageUrl}
              />
            </div>

            {/* Horizontal Thumbnails (Visible on mobile only) */}
            {images.length > 1 && (
              <div className="flex md:hidden gap-3 overflow-x-auto pb-2 scrollbar-none">
                {images.map((img, index) => (
                  <div
                    key={img.imageId || index}
                    onClick={() => setActiveImageUrl(img.imageUrl)}
                    className={`aspect-[3/4] w-16 shrink-0 overflow-hidden bg-surface-container/30 border cursor-pointer ${
                      activeImageUrl === img.imageUrl ? 'border-on-surface' : 'border-outline-variant/30'
                    }`}
                  >
                    <img
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                      src={img.imageUrl}
                    />
                  </div>
                ))}
              </div>
            )}
            
            {/* Editorial details layout for the first two secondary images if they exist */}
            {otherImages.length > 0 && (
              <div className="grid grid-cols-2 gap-8">
                <div 
                  className="aspect-[3/4] overflow-hidden bg-surface-container/30 border border-outline-variant/5 cursor-pointer group"
                  onClick={() => setActiveImageUrl(detailImage1)}
                >
                  <img 
                    alt="Chi tiết 1" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    src={detailImage1}
                  />
                </div>
                <div 
                  className="aspect-[3/4] overflow-hidden mt-12 bg-surface-container/30 border border-outline-variant/5 cursor-pointer group"
                  onClick={() => setActiveImageUrl(detailImage2)}
                >
                  <img 
                    alt="Chi tiết 2" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    src={detailImage2}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Product Details Sticky Column */}
        <div className="md:col-span-5 px-8 md:px-16 py-12 md:py-24 md:sticky md:top-20 h-fit">
          <div className="max-w-md">
            <p className="font-label text-xs tracking-[0.15em] text-secondary mb-4 uppercase">
              {product.brand?.name || 'THE ATELIER'} / {productCategory?.name || 'DANH MỤC'}
            </p>
            <h1 className="font-headline text-5xl mb-2 text-on-surface leading-tight">
              {product.name}
            </h1>
            <p className="font-headline italic text-2xl text-on-surface-variant mb-12">
              {formatPrice(product.basePrice)}
            </p>

            <div className="space-y-12">
              {/* Description */}
              <div className="space-y-4">
                <p className="font-body text-sm leading-relaxed text-on-surface-variant">
                  {product.description || 'Sản phẩm may đo thiết kế cao cấp nằm trong bộ sưu tập mới của xưởng The Atelier. Chất liệu tuyển chọn tỉ mỉ mang lại phom dáng vượt thời gian.'}
                </p>
              </div>

              {/* Color Selection if any */}
              {colorLabel && uniqueColors.length > 0 && (
                <div className="space-y-4">
                  <span className="font-label text-[10px] tracking-widest text-on-surface opacity-60 uppercase block">Chọn {colorLabel}</span>
                  <div className="flex flex-wrap gap-3">
                    {uniqueColors.map(color => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 border font-label text-xs uppercase transition-all duration-300 ${
                          selectedColor === color 
                            ? 'border-on-surface bg-on-background text-on-primary font-bold' 
                            : 'border-outline-variant/30 hover:border-on-surface text-on-surface'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              {sizeLabel && uniqueSizes.length > 0 && (
                <div className="space-y-6">
                  <div className="flex justify-between items-end">
                    <span className="font-label text-[10px] tracking-widest text-on-surface opacity-60 uppercase">Chọn {sizeLabel}</span>
                    <span className="font-label text-[10px] tracking-widest text-secondary underline underline-offset-4 uppercase cursor-pointer hover:opacity-80">Hướng Dẫn Size</span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {uniqueSizes.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 flex items-center justify-center border transition-all duration-300 font-label text-xs ${
                          selectedSize === size 
                            ? 'border-on-surface bg-on-background text-on-primary font-bold' 
                            : 'border-outline-variant/30 hover:border-on-surface text-on-surface-variant'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA */}
              <button 
                onClick={handleAddToCart}
                className="w-full bg-surface-tint text-on-primary py-6 font-label text-xs tracking-[0.2em] hover:bg-primary-dim transition-all duration-300 relative group overflow-hidden"
              >
                <span className="relative z-10 uppercase">Thêm Vào Giỏ Hàng</span>
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>

              {/* Accordions (Material & Care & Custom Specifications) */}
              <div className="border-t border-outline-variant/20 pt-8 space-y-6">
                {parsedConfig?.specs_definition?.length > 0 && specifications && Object.keys(specifications).some(k => k !== 'custom_specs' && specifications[k]) ? (
                  <details className="group border-b border-outline-variant/10 pb-6" open>
                    <summary className="flex justify-between items-center cursor-pointer list-none">
                      <span className="font-label text-xs tracking-widest uppercase">Thông Số Chi Tiết</span>
                      <span className="material-symbols-outlined group-open:rotate-180 transition-transform">expand_more</span>
                    </summary>
                    <div className="pt-4 font-body text-xs text-on-surface-variant leading-relaxed space-y-4">
                      {product.material && (
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-1 md:gap-4 border-b border-outline-variant/5 pb-3 pt-1 items-start">
                          <span className="col-span-1 md:col-span-4 font-label text-[10px] uppercase tracking-wider opacity-60 pt-0.5">Chất liệu</span>
                          <span className="col-span-1 md:col-span-8 text-on-surface font-medium text-left leading-relaxed">{product.material}</span>
                        </div>
                      )}
                      {parsedConfig.specs_definition.map(spec => {
                        const val = specifications[spec.key];
                        if (!val) return null;
                        return (
                          <div key={spec.key} className="grid grid-cols-1 md:grid-cols-12 gap-1 md:gap-4 border-b border-outline-variant/5 pb-3 pt-1 items-start">
                            <span className="col-span-1 md:col-span-4 font-label text-[10px] uppercase tracking-wider opacity-60 pt-0.5">{spec.label}</span>
                            <span className="col-span-1 md:col-span-8 text-on-surface font-medium whitespace-pre-line text-left leading-relaxed">{val}</span>
                          </div>
                        );
                      })}
                    </div>
                  </details>
                ) : specifications?.custom_specs ? (
                  <details className="group border-b border-outline-variant/10 pb-6" open>
                    <summary className="flex justify-between items-center cursor-pointer list-none">
                      <span className="font-label text-xs tracking-widest uppercase">Thông Số Chi Tiết</span>
                      <span className="material-symbols-outlined group-open:rotate-180 transition-transform">expand_more</span>
                    </summary>
                    <div className="pt-4 font-body text-xs text-on-surface-variant leading-relaxed space-y-4">
                      {product.material && (
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-1 md:gap-4 border-b border-outline-variant/5 pb-3 pt-1 items-start">
                          <span className="col-span-1 md:col-span-4 font-label text-[10px] uppercase tracking-wider opacity-60 pt-0.5">Chất liệu</span>
                          <span className="col-span-1 md:col-span-8 text-on-surface font-medium text-left leading-relaxed">{product.material}</span>
                        </div>
                      )}
                      <div className="text-on-surface font-medium whitespace-pre-line leading-relaxed text-left pt-2">
                        {specifications.custom_specs}
                      </div>
                    </div>
                  </details>
                ) : (
                  <details className="group border-b border-outline-variant/10 pb-6" open>
                    <summary className="flex justify-between items-center cursor-pointer list-none">
                      <span className="font-label text-xs tracking-widest uppercase">Chất Liệu &amp; Thủ Công</span>
                      <span className="material-symbols-outlined group-open:rotate-180 transition-transform">expand_more</span>
                    </summary>
                    <div className="pt-4 font-body text-xs text-on-surface-variant leading-relaxed space-y-2">
                      {product.material && <p><strong>Chất liệu chính:</strong> {product.material}</p>}
                      <p>Chất liệu cao cấp từ nguồn cung ứng tuyển chọn.</p>
                      <p>Các đường may nội thất và chi tiết viền được hoàn thiện thủ công tỉ mỉ.</p>
                      <p>Khuy khóa thiết kế riêng đồng bộ với tinh thần của Atelier.</p>
                    </div>
                  </details>
                )}
                
                <details className="group border-b border-outline-variant/10 pb-6">
                  <summary className="flex justify-between items-center cursor-pointer list-none">
                    <span className="font-label text-xs tracking-widest uppercase">Giao Hàng &amp; Đổi Trả</span>
                    <span className="material-symbols-outlined group-open:rotate-180 transition-transform">expand_more</span>
                  </summary>
                  <div className="pt-4 font-body text-xs text-on-surface-variant leading-relaxed">
                    <p>Giao hàng tiêu chuẩn miễn phí toàn quốc cho đơn hàng từ 1.000.000 ₫. Thời gian vận chuyển từ 2-4 ngày làm việc.</p>
                    <p>Chấp nhận đổi trả trong vòng 7 ngày kể từ khi nhận hàng đối với sản phẩm còn nguyên tem mác.</p>
                  </div>
                </details>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Complete the Look Section */}
      {recommendations.length > 0 && (
        <section className="py-32 px-6 md:px-12 bg-surface-container">
          <div className="max-w-screen-2xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 space-y-4 md:space-y-0">
              <div>
                <span className="font-label text-xs tracking-[0.2em] text-secondary uppercase">Gợi Ý Phối Đồ</span>
                <h2 className="font-headline text-4xl mt-2">Hoàn Thiện Phong Cách</h2>
              </div>
              <Link to="/products" className="font-label text-xs tracking-widest border-b border-on-surface pb-1 uppercase">
                Xem Tất Cả Sản Phẩm
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 items-start">
              {recommendations.map((item, idx) => {
                // Keep the dynamic vertical offset lookbook rhythm
                const offsetClass = idx === 1 ? 'md:mt-12' : '';
                return (
                  <div 
                    key={item.productId}
                    onClick={() => navigate(`/products/${item.slug}`)}
                    className={`group cursor-pointer ${offsetClass}`}
                  >
                    <div className="aspect-[3/4] overflow-hidden mb-6 bg-surface-container-highest border border-outline-variant/5">
                      <img 
                        alt={item.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                        src={getProductImage(item)}
                      />
                    </div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-label text-xs tracking-widest mb-1 uppercase group-hover:text-secondary transition-colors">
                          {item.name}
                        </h3>
                        <p className="font-headline italic text-lg opacity-60 mt-1">
                          {formatPrice(item.basePrice)}
                        </p>
                      </div>
                      <span className="material-symbols-outlined opacity-0 group-hover:opacity-100 transition-opacity">add</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;
