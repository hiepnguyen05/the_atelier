import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product, getProductImage, formatPrice, showToast }) => {
  const navigate = useNavigate();
  const [bgColor, setBgColor] = useState('#ffffff'); // Default card background
  const images = product.productImages || [];
  const primaryImg = images.find(img => img.isPrimary === true || img.isPrimary === 1 || img.isPrimary === '1') || images[0];
  const primaryUrl = primaryImg ? primaryImg.imageUrl : 'https://via.placeholder.com/600x800?text=THE+ATELIER';
  
  const hoverImg = images.find(img => img.isHover === true || img.isHover === 1 || img.isHover === '1') || 
                   images.find(img => img.imageUrl !== primaryUrl) || 
                   images[1];
  const hoverUrl = hoverImg ? hoverImg.imageUrl : null;

  useEffect(() => {
    if (!primaryUrl || primaryUrl.includes('placeholder') || primaryUrl.startsWith('data:')) return;

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
        const topLeft = ctx.getImageData(0, 0, 1, 1).data;
        const topRight = ctx.getImageData(9, 0, 1, 1).data;
        const bottomLeft = ctx.getImageData(0, 9, 1, 1).data;
        const bottomRight = ctx.getImageData(9, 9, 1, 1).data;

        const r = Math.round((topLeft[0] + topRight[0] + bottomLeft[0] + bottomRight[0]) / 4);
        const g = Math.round((topLeft[1] + topRight[1] + bottomLeft[1] + bottomRight[1]) / 4);
        const b = Math.round((topLeft[2] + topRight[2] + bottomLeft[2] + bottomRight[2]) / 4);
        const a = Math.round((topLeft[3] + topRight[3] + bottomLeft[3] + bottomRight[3]) / 4);

        if (a < 200) {
          setBgColor('#ffffff');
        } else {
          setBgColor(`rgba(${r}, ${g}, ${b}, ${a / 255})`);
        }
      } catch (e) {
        console.warn('CORS or canvas error extracting background color for:', primaryUrl, e);
      }
    };

    img.src = primaryUrl;
  }, [primaryUrl]);

  const prodName = product.name?.toLowerCase() || "";
  const isAccessory = product.productType === 'bag' || product.productType === 'eyewear' || product.productType === 'perfume' || prodName.includes("túi") || prodName.includes("kính") || prodName.includes("ví");

  return (
    <article 
      onClick={() => navigate(`/products/${product.slug}`)}
      className="group cursor-pointer w-full"
    >
      <div 
        className="relative overflow-hidden aspect-[3/4] w-full mb-4 border border-outline-variant/5 transition-colors duration-500"
        style={{ backgroundColor: bgColor }}
      >
        <img 
          src={primaryUrl} 
          alt={product.name} 
          className={`${isAccessory ? 'object-contain p-6 md:p-10' : 'object-cover'} w-full h-full transition-all duration-700 ${hoverUrl ? 'group-hover:opacity-0' : ''}`}
        />
        {hoverUrl && (
          <img 
            src={hoverUrl} 
            alt={`${product.name} Alternate`} 
            className={`${isAccessory ? 'object-contain p-6 md:p-10' : 'object-cover'} absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 transition-all duration-700`}
          />
        )}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            showToast(`Đã thêm ${product.name} vào túi xách`);
          }}
          className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-on-background text-on-primary hover:bg-secondary p-2 rounded-none border-none flex items-center justify-center shadow-md duration-300"
        >
          <span className="material-symbols-outlined text-sm">add</span>
        </button>
      </div>
      <div className="mt-4 space-y-1">
        <p className="text-[9px] font-label tracking-[0.2em] text-on-surface-variant/80 uppercase">
          {product.brand?.name || 'THE ATELIER'}
        </p>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-label text-xs tracking-widest mb-1 uppercase group-hover:text-secondary transition-colors">
              {product.name}
            </h3>
          </div>
          <span className="font-headline italic text-lg whitespace-nowrap ml-4">
            {formatPrice(product.basePrice)}
          </span>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
