import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { productService, categoryService } from '../services';
import { useToast } from '../contexts/ToastContext';

// Sub-component for Product Card with Dynamic Background Color Extraction
const ProductCard = ({ product, index, getProductImage, formatPrice, showToast }) => {
  const navigate = useNavigate();
  const [bgColor, setBgColor] = useState('rgba(234, 232, 231, 0.4)'); // Default soft container color
  const imageUrl = getProductImage(product);

  useEffect(() => {
    if (!imageUrl || imageUrl.includes('placeholder') || imageUrl.startsWith('data:')) return;

    const img = new Image();
    img.crossOrigin = 'Anonymous';
    
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 10;
        canvas.height = 10;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(img, 0, 0, 10, 10);
        // Sample 4 corners of the image
        const topLeft = ctx.getImageData(0, 0, 1, 1).data;
        const topRight = ctx.getImageData(9, 0, 1, 1).data;
        const bottomLeft = ctx.getImageData(0, 9, 1, 1).data;
        const bottomRight = ctx.getImageData(9, 9, 1, 1).data;

        // Take average RGB
        const r = Math.round((topLeft[0] + topRight[0] + bottomLeft[0] + bottomRight[0]) / 4);
        const g = Math.round((topLeft[1] + topRight[1] + bottomLeft[1] + bottomRight[1]) / 4);
        const b = Math.round((topLeft[2] + topRight[2] + bottomLeft[2] + bottomRight[2]) / 4);
        const a = Math.round((topLeft[3] + topRight[3] + bottomLeft[3] + bottomRight[3]) / 4);

        // If the background is transparent or has low opacity, keep the default soft card container color
        if (a < 200) {
          setBgColor('rgba(234, 232, 231, 0.4)');
        } else {
          setBgColor(`rgba(${r}, ${g}, ${b}, ${a / 255})`);
        }
      } catch (e) {
        console.warn('CORS or canvas error extracting background color for:', imageUrl, e);
      }
    };

    img.src = imageUrl;
  }, [imageUrl]);

  // Lấy thông tin tên và danh mục để phân loại phom dáng sản phẩm
  const prodName = product.name?.toLowerCase() || "";
  const catNames = product.categories?.map(c => c.name?.toLowerCase()).join(" ") || "";
  
  // Phân biệt: Phụ kiện (kính, túi, ví, đồng hồ) & Quần áo (áo, đầm, váy, quần)
  const isAccessory = prodName.includes("túi") || prodName.includes("kính") || prodName.includes("ví") || catNames.includes("da cao cấp") || catNames.includes("phụ kiện") || catNames.includes("trang sức");
  const isClothing = prodName.includes("áo") || prodName.includes("quần") || prodName.includes("đầm") || prodName.includes("sơ mi") || catNames.includes("couture");

  // 1. Phân bổ tỉ lệ khung hình (Aspect Ratio) tôn vinh phom dáng sản phẩm:
  let gridSpanClass = "md:col-span-1";
  let aspectClass = "aspect-[4/5]"; // Mặc định
  let offsetClass = "";

  if (isAccessory && index % 4 === 0) {
    // Nếu là phụ kiện đầu tiên của nhóm, cho làm Hero Banner lớn chiếm 2 cột làm điểm nhấn
    gridSpanClass = "md:col-span-2";
    aspectClass = "aspect-[4/3] md:aspect-[21/9]";
  } else if (isAccessory) {
    // Phụ kiện thường: Rộng ngang để thấy rõ chi tiết túi, mắt kính
    aspectClass = "aspect-[4/3]";
  } else if (isClothing) {
    // Trang phục: Dáng thuôn dài quý phái tôn vinh dáng đứng người mẫu
    aspectClass = "aspect-[2/3]";
  } else {
    // Nước hoa/Mỹ phẩm khác: Dáng đứng ngắn thanh lịch
    aspectClass = "aspect-[3/4]";
  }

  // 2. Tạo nhịp điệu lệch tầng bất đối xứng đầy ngẫu hứng để tạo mảng trống sang trọng
  // Chỉ áp dụng offset cho thẻ cột đơn để tránh lệch layout banner lớn
  if (gridSpanClass === "md:col-span-1") {
    if (index % 3 === 1) {
      offsetClass = "md:mt-16"; // Giảm độ lệch sâu xuống dưới để bớt trống
    } else if (index % 3 === 2) {
      offsetClass = "md:-mt-8"; // Giảm độ kéo lệch lên trên để bớt trống
    }
  }

  return (
    <article 
      onClick={() => navigate(`/products/${product.slug}`)}
      className={`group cursor-pointer ${gridSpanClass} ${offsetClass}`}
    >
      <div 
        className={`relative overflow-hidden ${aspectClass} mb-4 border border-outline-variant/5 transition-colors duration-500`}
        style={{ backgroundColor: bgColor }}
      >
        <img 
          src={imageUrl} 
          alt={product.name} 
          className={`${isAccessory ? 'object-contain p-6 md:p-10' : 'object-cover'} w-full h-full transition-transform duration-700 group-hover:scale-105`}
        />
        <button 
          onClick={(e) => {
            e.stopPropagation();
            showToast(`Đã thêm ${product.name} vào túi xách`);
          }}
          className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity bg-on-background text-on-primary hover:bg-secondary p-2 rounded-none border-none flex items-center justify-center shadow-md duration-300"
        >
          <span className="material-symbols-outlined text-sm">add</span>
        </button>
      </div>
      <div className="flex justify-between items-baseline">
        <div>
          <h2 className="text-xl font-headline tracking-tight group-hover:text-secondary transition-colors">
            {product.name}
          </h2>
          <p className="text-[10px] font-label tracking-[0.1em] text-on-surface-variant uppercase mt-1">
            {product.brand?.name || 'THE ATELIER'}
          </p>
        </div>
        <span className="text-lg font-headline italic">
          {formatPrice(product.basePrice)}
        </span>
      </div>
    </article>
  );
};

const ProductCatalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { showToast } = useToast();

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
    sort: 'newest',
  });

  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

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
    setParams(prev => ({
      ...prev,
      search: searchVal,
      categoryId: catId,
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

  // Handle category change
  const handleCategoryClick = (id) => {
    setParams(prev => ({ ...prev, categoryId: id, page: 1 }));
    setSearchParams(id ? { categoryId: id } : {});
  };

  // Format Price
  const formatPrice = (price) => {
    if (price === undefined || price === null) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  // Get image helper
  const getProductImage = (product) => {
    if (product.productImages && product.productImages.length > 0) {
      // Tìm kiếm ảnh chính (isPrimary === true/1)
      const primaryImg = product.productImages.find(img => img.isPrimary === true || img.isPrimary === 1 || img.isPrimary === '1');
      if (primaryImg) {
        return primaryImg.imageUrl;
      }
      // Nếu không có ảnh chính, trả về ảnh đầu tiên được tải lên
      return product.productImages[0].imageUrl;
    }
    // High fashion fallback
    return 'https://via.placeholder.com/600x800?text=THE+ATELIER';
  };

  // Client-side filtering for size and color using variants
  const filteredProducts = products.filter(product => {
    // Size check
    if (selectedSize) {
      const hasSize = product.productVariants?.some(v => v.size?.toUpperCase() === selectedSize.toUpperCase());
      if (!hasSize) return false;
    }
    // Color check
    if (selectedColor) {
      const hasColor = product.productVariants?.some(v => v.color?.toLowerCase() === selectedColor.toLowerCase());
      if (!hasColor) return false;
    }
    return true;
  });

  const sizes = ['XS', 'S', 'M', 'L', 'XL'];
  const colors = [
    { name: 'Charcoal', hex: '#323233' },
    { name: 'Ivory', hex: '#f0eded' },
    { name: 'Tan', hex: '#785a1a' },
    { name: 'Sage', hex: '#5e605c' }
  ];

  return (
    <div className="bg-background text-on-background selection:bg-secondary-fixed selection:text-on-secondary-fixed">
      <main className="pt-32 pb-24 px-6 md:px-12 max-w-screen-2xl mx-auto">
        
        {/* Editorial Header */}
        <header className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <p className="font-label text-[10px] tracking-[0.2em] text-secondary mb-4 uppercase">Lưu Trữ Xuân / Hè</p>
            <h1 className="text-6xl md:text-8xl font-headline italic tracking-tighter leading-none mb-6">
              {params.categoryId && categories.length > 0 
                ? categories.find(c => c.categoryId === parseInt(params.categoryId))?.name 
                : 'Danh Mục Sản Phẩm'}
            </h1>
            <p className="text-on-surface-variant font-body leading-relaxed max-w-md">
              Tuyển tập những thiết kế lưu trữ và phom dáng mùa mới nhất, được chế tác với sự tỉ mỉ tuyệt đối tại xưởng may Paris của chúng tôi.
            </p>
          </div>
          
          <div className="flex items-center gap-4 text-xs font-label tracking-widest text-on-surface-variant border-b border-outline-variant/20 pb-2">
            <span>SẮP XẾP:</span>
            <select
              value={params.sort}
              onChange={(e) => setParams(prev => ({ ...prev, sort: e.target.value, page: 1 }))}
              className="bg-transparent border-none font-label text-[10px] tracking-widest text-on-surface-variant focus:ring-0 cursor-pointer uppercase p-0"
            >
              <option value="newest">Mới Nhất</option>
              <option value="price_asc">Giá: Thấp Đến Cao</option>
              <option value="price_desc">Giá: Cao Đến Thấp</option>
              <option value="name_asc">Tên: A Đến Z</option>
            </select>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 space-y-12 shrink-0">
            <section>
              <h3 className="font-label text-[10px] tracking-[0.1em] text-on-surface uppercase mb-6">Phân Loại</h3>
              <ul className="space-y-4">
                <li>
                  <button
                    onClick={() => handleCategoryClick('')}
                    className={`text-xs font-label tracking-widest uppercase transition-colors bg-transparent border-none p-0 text-left ${
                      !params.categoryId 
                        ? 'text-secondary font-bold border-b border-secondary/30 pb-0.5' 
                        : 'text-on-surface-variant hover:text-secondary'
                    }`}
                  >
                    TẤT CẢ SẢN PHẨM
                  </button>
                </li>
                {categories.map(cat => (
                  <li key={cat.categoryId}>
                    <button
                      onClick={() => handleCategoryClick(cat.categoryId)}
                      className={`text-xs font-label tracking-widest uppercase transition-colors bg-transparent border-none p-0 text-left ${
                        parseInt(params.categoryId) === cat.categoryId 
                          ? 'text-secondary font-bold border-b border-secondary/30 pb-0.5' 
                          : 'text-on-surface-variant hover:text-secondary'
                      }`}
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-label text-[10px] tracking-[0.1em] text-on-surface uppercase">Kích Thước</h3>
                {selectedSize && (
                  <button 
                    onClick={() => setSelectedSize('')} 
                    className="text-[9px] font-label text-error uppercase tracking-wider bg-transparent border-none"
                  >
                    Xóa lọc
                  </button>
                )}
              </div>
              <div className="grid grid-cols-5 gap-2">
                {sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(selectedSize === size ? '' : size)}
                    className={`py-2 text-[10px] font-label border transition-colors ${
                      selectedSize === size
                        ? 'border-on-background bg-on-background text-on-primary'
                        : 'border-outline-variant/20 hover:border-outline-variant text-on-surface-variant'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </section>

            <section>
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-label text-[10px] tracking-[0.1em] text-on-surface uppercase">Bảng Màu</h3>
                {selectedColor && (
                  <button 
                    onClick={() => setSelectedColor('')} 
                    className="text-[9px] font-label text-error uppercase tracking-wider bg-transparent border-none"
                  >
                    Xóa lọc
                  </button>
                )}
              </div>
              <div className="flex gap-4">
                {colors.map(color => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(selectedColor === color.name ? '' : color.name)}
                    style={{ backgroundColor: color.hex }}
                    className={`w-6 h-6 rounded-none transition-all ${
                      selectedColor === color.name
                        ? 'ring-1 ring-offset-2 ring-on-background scale-110'
                        : 'hover:scale-105 border border-outline-variant/10 shadow-sm'
                    }`}
                    title={color.name}
                  />
                ))}
              </div>
            </section>
          </aside>

          {/* Product Grid (Asymmetric Editorial Style with Big/Small Focal Points - Method 3) */}
          <div className="flex-grow">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16 items-start">
                {[1, 2, 3, 4, 5].map((idx, index) => {
                  let gridSpanClass = "md:col-span-1";
                  let skeletonAspect = "aspect-[4/5]";
                  let offsetClass = "";

                  if (index === 0) {
                    gridSpanClass = "md:col-span-2";
                    skeletonAspect = "aspect-[4/3] md:aspect-[21/9]";
                  } else if (index === 1) {
                    skeletonAspect = "aspect-[2/3]";
                  } else if (index === 2) {
                    skeletonAspect = "aspect-[4/3]";
                    offsetClass = "md:mt-16";
                  } else if (index === 3) {
                    skeletonAspect = "aspect-[2/3]";
                    offsetClass = "md:-mt-8";
                  }

                  return (
                    <div key={idx} className={`animate-pulse ${gridSpanClass} ${offsetClass}`}>
                      <div className={`bg-surface-container ${skeletonAspect} w-full mb-4`}></div>
                      <div className="h-6 bg-surface-container w-2/3 mb-2"></div>
                      <div className="h-4 bg-surface-container w-1/3"></div>
                    </div>
                  );
                })}
              </div>
            ) : error ? (
              <div className="py-24 text-center font-headline text-lg text-error">
                {error}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="py-24 text-center font-headline text-lg text-on-surface-variant opacity-60">
                Không tìm thấy sản phẩm nào phù hợp với bộ lọc hiện tại.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16 items-start">
                {filteredProducts.map((product, index) => (
                  <ProductCard
                    key={product.productId}
                    product={product}
                    index={index}
                    getProductImage={getProductImage}
                    formatPrice={formatPrice}
                    showToast={showToast}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductCatalog;
