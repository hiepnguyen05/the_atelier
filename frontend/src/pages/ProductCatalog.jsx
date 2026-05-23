import React from 'react';
import { useCatalog } from '../hooks/catalog/useCatalog';
import { useToast } from '../contexts/ToastContext';
import { getProductTypeOptions } from '../constants/productTypes';
import ProductCard from '../components/catalog/ProductCard';
import CatalogSidebar from '../components/catalog/CatalogSidebar';
import CatalogHeader from '../components/catalog/CatalogHeader';

const ProductCatalog = () => {
  const { showToast } = useToast();
  const {
    products,
    categories,
    loading,
    error,
    params,
    handleFilterChange,
    formatPrice,
    getProductImage,
  } = useCatalog();

  const productTypes = getProductTypeOptions();

  return (
    <div className="bg-background text-on-background selection:bg-secondary-fixed selection:text-on-secondary-fixed">
      <main className="pt-32 pb-24 px-6 md:px-12 max-w-screen-2xl mx-auto">
        
        <CatalogHeader
          categories={categories}
          productTypes={productTypes}
          categoryId={params.categoryId}
          productType={params.productType}
          sortValue={params.sort}
          onSortChange={handleFilterChange}
        />

        <div className="flex flex-col lg:flex-row gap-16">
          
          <CatalogSidebar
            categories={categories}
            selectedCategoryId={params.categoryId}
            onCategorySelect={(val) => handleFilterChange('categoryId', val)}
          />

          <div className="flex-grow">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-16">
                {[1, 2, 3, 4, 5, 6].map((idx) => (
                  <div key={idx} className="animate-pulse w-full">
                    <div className="bg-surface-container aspect-[3/4] w-full mb-4"></div>
                    <div className="h-3 bg-surface-container w-1/4 mb-2"></div>
                    <div className="flex justify-between items-start gap-4">
                      <div className="h-4 bg-surface-container w-1/2"></div>
                      <div className="h-4 bg-surface-container w-1/5 shrink-0"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="py-24 text-center font-headline text-lg text-error">
                {error}
              </div>
            ) : products.length === 0 ? (
              <div className="py-24 text-center font-headline text-lg text-on-surface-variant opacity-60">
                Không tìm thấy sản phẩm nào phù hợp với bộ lọc hiện tại.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-16">
                {products.map((product) => (
                  <ProductCard
                    key={product.productId}
                    product={product}
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
