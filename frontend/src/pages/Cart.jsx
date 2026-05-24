import React from 'react';
import useCartPage from '../hooks/cart/useCartPage';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import CartEmptyState from '../components/cart/CartEmptyState';
import CartRecommendations from '../components/cart/CartRecommendations';

const Cart = () => {
  const {
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
  } = useCartPage();

  if (loading && cartItems.length === 0) {
    return (
      <div className="bg-background text-on-background selection:bg-secondary-fixed selection:text-on-secondary-fixed min-h-screen flex items-center justify-center">
        <div className="text-center font-headline text-2xl italic animate-pulse">
          Đang tải giỏ hàng...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background text-on-background selection:bg-secondary-fixed selection:text-on-secondary-fixed min-h-screen">
      <main className="pt-32 pb-24 px-6 md:px-12 max-w-screen-2xl mx-auto">
        <header className={cartItems.length === 0 ? "mb-6" : "mb-16"}>
          <h1 className="font-headline text-5xl md:text-7xl text-on-surface mb-4">Giỏ Hàng</h1>
          <p className="font-label text-xs uppercase tracking-[0.05em] text-on-surface-variant">
            Hiện có {cartCount} sản phẩm
          </p>
        </header>

        {cartItems.length === 0 ? (
          <CartEmptyState />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
            {/* Items Section */}
            <section className="lg:col-span-8">
              {/* Select All Bar */}
              <div className="flex items-center gap-3 pb-6 border-b border-outline-variant/15 mb-8">
                <input 
                  type="checkbox" 
                  checked={isAllSelected}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 accent-secondary border-outline-variant rounded-none focus:ring-0 cursor-pointer"
                />
                <span 
                  className="font-label text-[10px] uppercase tracking-widest text-on-surface select-none cursor-pointer font-bold" 
                  onClick={toggleSelectAll}
                >
                  Chọn tất cả ({cartItems.length} sản phẩm)
                </span>
              </div>

              <div className="space-y-10">
                {cartItems.map((item) => (
                  <CartItem
                    key={item.cartItemId}
                    item={item}
                    updateQuantity={updateQuantity}
                    removeFromCart={removeFromCart}
                    formatPrice={formatPrice}
                    getProductImage={getProductImage}
                    isSelected={selectedItemIds.includes(item.cartItemId)}
                    toggleSelection={toggleItemSelection}
                  />
                ))}
              </div>
            </section>

            {/* Summary Section */}
            <aside className="lg:col-span-4">
              <CartSummary
                subtotal={subtotal}
                estimatedTax={estimatedTax}
                total={total}
                formatPrice={formatPrice}
                handleCheckout={handleCheckout}
              />
            </aside>
          </div>
        )}

        {/* Dynamic Recommendations */}
        <CartRecommendations
          recommendations={recommendations}
          recommendationsLoading={recommendationsLoading}
          formatPrice={formatPrice}
          getProductImage={getProductImage}
        />
      </main>

      {/* Concierge Floating Action */}
      <div className="fixed bottom-8 right-8 z-50">
        <button 
          onClick={() => handleCheckout()}
          className="w-14 h-14 rounded-full bg-surface-container-lowest backdrop-blur-md shadow-2xl flex items-center justify-center text-secondary border border-outline-variant/10 group cursor-pointer"
        >
          <span className="material-symbols-outlined group-hover:scale-110 transition-transform">support_agent</span>
        </button>
      </div>
    </div>
  );
};

export default Cart;
