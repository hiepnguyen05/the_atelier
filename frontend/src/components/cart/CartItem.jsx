import React from 'react';
import { Link } from 'react-router-dom';

const CartItem = ({ item, updateQuantity, removeFromCart, formatPrice, getProductImage, isSelected, toggleSelection }) => {
  const product = item.variant?.product;
  if (!product) return null;

  const itemPrice = Number(product.basePrice || 0) + Number(item.variant?.priceAdjustment || 0);
  const imgUrl = item.variant?.colorImage || getProductImage(product);
  const optionLabel = `${item.variant?.colorName || 'Màu mặc định'} / ${item.variant?.sizeName || 'Một Kích Cỡ'}`;

  return (
    <div className="group flex gap-4 md:gap-6 pb-10 items-start border-b border-outline-variant/15 last:border-b-0">
      {/* Checkbox Selector */}
      <div className="pt-8 md:pt-12 shrink-0 flex items-center justify-center">
        <input 
          type="checkbox" 
          checked={isSelected}
          onChange={() => toggleSelection(item.cartItemId)}
          className="w-4 h-4 accent-secondary border-outline-variant rounded-none focus:ring-0 cursor-pointer"
        />
      </div>

      {/* Product Image */}
      <div className="w-20 md:w-28 aspect-[3/4] bg-surface-container-highest overflow-hidden shrink-0">
        <Link to={`/products/${product.slug}`}>
          <img 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500" 
            src={imgUrl}
          />
        </Link>
      </div>

      {/* Product Details */}
      <div className="flex-grow flex flex-col justify-between min-h-[105px] md:min-h-[145px] py-1">
        <div className="flex justify-between items-start gap-4">
          <div>
            <Link to={`/products/${product.slug}`} className="no-underline hover:underline text-on-background">
              <h3 className="font-headline text-xl md:text-2xl mb-1 line-clamp-1 md:line-clamp-none">{product.name}</h3>
            </Link>
            <p className="font-label text-[9px] md:text-xs uppercase tracking-[0.05em] text-on-surface-variant mb-4 md:mb-6">
              {optionLabel}
            </p>
          </div>
          <span className="font-headline text-lg md:text-xl shrink-0">{formatPrice(itemPrice)}</span>
        </div>

        {/* Quantity and Actions */}
        <div className="flex justify-between items-end mt-auto">
          <div className="flex flex-col">
            <label className="font-label text-[8px] md:text-[10px] uppercase tracking-widest text-outline mb-1.5 md:mb-2">Số Lượng</label>
            <div className="flex items-center border-b border-outline-variant/40 pb-0.5 md:pb-1">
              <button 
                onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                className="material-symbols-outlined text-[12px] md:text-sm bg-transparent border-0 p-0 cursor-pointer text-on-surface hover:text-secondary transition-colors"
              >
                remove
              </button>
              <span className="px-4 md:px-6 font-body text-xs md:text-sm select-none">
                {String(item.quantity).padStart(2, '0')}
              </span>
              <button 
                onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                className="material-symbols-outlined text-[12px] md:text-sm bg-transparent border-0 p-0 cursor-pointer text-on-surface hover:text-secondary transition-colors"
              >
                add
              </button>
            </div>
          </div>
          <button 
            onClick={() => removeFromCart(item.cartItemId)}
            className="bg-transparent border-0 p-0 cursor-pointer font-label text-[9px] md:text-[10px] uppercase tracking-widest text-on-surface-variant hover:text-error transition-colors border-b border-outline-variant/40 pb-0.5 md:pb-1"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
