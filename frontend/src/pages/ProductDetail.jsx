import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProductDetail } from '../hooks/catalog/useProductDetail';
import ProductGallery from '../components/product/ProductGallery';
import ProductInfo from '../components/product/ProductInfo';
import SizeGuideModal from '../components/product/SizeGuideModal';
import RelatedProducts from '../components/product/RelatedProducts';
import Loading from '../components/common/Loading';

const ProductDetail = () => {
  const { slug } = useParams();
  
  const {
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
  } = useProductDetail(slug);

  if (loading) {
    return <Loading fullPage text="Đang tải câu chuyện sản phẩm..." />;
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

  return (
    <div className="bg-background text-on-background selection:bg-secondary-fixed selection:text-on-secondary-fixed">
      {/* Product Hero Section */}
      <main className="pt-32 pb-24 px-6 md:px-12 lg:px-16 max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-stretch">
          
          <ProductGallery
            orderedImages={orderedImages}
            productName={product.name}
            zoomedImgId={zoomedImgId}
            zoomStyle={zoomStyle}
            extractedBgColor={extractedBgColor}
            handleImageClick={handleImageClick}
            handleImageMouseMove={handleImageMouseMove}
            handleImageMouseLeave={handleImageMouseLeave}
            setLightboxImg={setLightboxImg}
          />

          <ProductInfo
            product={product}
            formatPrice={formatPrice}
            sizeLabel={sizeLabel}
            colorLabel={colorLabel}
            uniqueColors={uniqueColors}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            sizesToDisplay={sizesToDisplay}
            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}
            openSizeGuide={openSizeGuide}
            handleAddToCart={handleAddToCart}
            productTypeConfig={productTypeConfig}
            productCategory={productCategory}
            specifications={specifications}
          />

        </div>
      </main>

      <RelatedProducts
        recommendations={recommendations}
        formatPrice={formatPrice}
        getProductImage={getProductImage}
      />

      {/* Lightbox Modal */}
      {lightboxImg && (
        <div 
          onClick={() => setLightboxImg(null)}
          className="fixed inset-0 bg-background/95 z-50 flex items-center justify-center cursor-zoom-out animate-fade-in p-4 md:p-8"
        >
          <div className="max-w-full max-h-full relative flex items-center justify-center">
            <img 
              src={lightboxImg} 
              alt="Enlarged Product View" 
              className="max-w-[90vw] max-h-[90vh] object-contain shadow-2xl" 
            />
            <button 
              onClick={() => setLightboxImg(null)}
              className="absolute -top-12 right-0 md:top-4 md:-right-12 text-on-background bg-transparent hover:text-secondary p-2 border-none flex items-center justify-center duration-300 cursor-pointer"
            >
              <span className="material-symbols-outlined text-2xl font-light">close</span>
            </button>
          </div>
        </div>
      )}

      <SizeGuideModal
        showSizeGuide={showSizeGuide}
        setShowSizeGuide={setShowSizeGuide}
        sizeGuideGender={sizeGuideGender}
        setSizeGuideGender={setSizeGuideGender}
        sizeGuideType={sizeGuideType}
        setSizeGuideType={setSizeGuideType}
      />
    </div>
  );
};

export default ProductDetail;
