import React from 'react';
import { Link } from 'react-router-dom';

const CartRecommendations = ({ recommendations, recommendationsLoading, formatPrice, getProductImage }) => {
  return (
    <section className="mt-40">
      <div className="flex justify-between items-end mb-12">
        <h2 className="font-headline text-4xl">Hoàn Thiện Phong Cách</h2>
        <Link 
          to="/products" 
          className="font-label text-[10px] uppercase tracking-widest text-secondary border-b border-secondary-fixed-dim pb-1 hover:tracking-[0.15em] transition-all no-underline"
        >
          Xem Lưu Trữ
        </Link>
      </div>

      {recommendationsLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((idx) => (
            <div key={idx} className="animate-pulse">
              <div className="aspect-[2/3] bg-surface-container-low mb-6"></div>
              <div className="h-4 bg-surface-container-low w-3/4 mb-2"></div>
              <div className="h-4 bg-surface-container-low w-1/4"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {recommendations.slice(0, 4).map((product) => (
            <div key={product.productId} className="group">
              <div className="aspect-[2/3] bg-surface-container-low mb-6 overflow-hidden">
                <Link to={`/products/${product.slug}`}>
                  <img 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    src={getProductImage(product)}
                  />
                </Link>
              </div>
              <Link to={`/products/${product.slug}`} className="no-underline text-on-background">
                <h4 className="font-headline text-lg mb-1 group-hover:underline">{product.name}</h4>
              </Link>
              <p className="font-body text-sm text-on-surface-variant">
                {formatPrice(product.basePrice)}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default CartRecommendations;
