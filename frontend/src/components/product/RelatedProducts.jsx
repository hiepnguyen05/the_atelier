import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

const RelatedProducts = ({
  recommendations,
  formatPrice,
  getProductImage
}) => {
  const navigate = useNavigate();

  if (!recommendations || recommendations.length === 0) return null;

  return (
    <section className="py-32 px-6 md:px-12 bg-surface-container/40 border-t border-outline-variant/10">
      <div className="max-w-screen-2xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 space-y-4 md:space-y-0">
          <div>
            <span className="font-label text-xs tracking-[0.2em] text-secondary uppercase">Gợi Ý Phối Đồ</span>
            <h2 className="font-display italic text-4xl mt-2">Hoàn Thiện Phong Cách</h2>
          </div>
          <Link to="/products" className="font-label text-xs tracking-widest border-b border-on-surface pb-1 uppercase hover:text-secondary hover:border-secondary transition-colors">
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
                <div className="aspect-[3/4] overflow-hidden mb-6 bg-surface-container relative">
                  <img 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700" 
                    src={getProductImage(item)}
                  />
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-label text-[11px] tracking-wider mb-1 uppercase group-hover:text-secondary transition-colors font-medium">
                      {item.name}
                    </h3>
                    <p className="font-display italic text-lg opacity-85 mt-1">
                      {formatPrice(item.basePrice)}
                    </p>
                  </div>
                  <span className="material-symbols-outlined opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0 text-sm">arrow_forward</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default RelatedProducts;
