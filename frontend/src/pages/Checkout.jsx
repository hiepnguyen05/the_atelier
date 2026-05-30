import React from 'react';
import useCheckout from '../hooks/checkout/useCheckout';
import CheckoutForm from '../components/checkout/CheckoutForm';
import CheckoutSummary from '../components/checkout/CheckoutSummary';

const Checkout = () => {
  const {
    checkoutItems,
    formData,
    handleInputChange,
    handlePaymentChange,
    handleSubmit,
    loading,
    subtotal,
    formatPrice
  } = useCheckout();

  return (
    <div className="bg-surface text-on-surface antialiased">
      <main className="pt-32 pb-24 px-6 md:px-12 max-w-screen-2xl mx-auto min-h-[70vh]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <CheckoutForm 
            formData={formData} 
            handleInputChange={handleInputChange} 
            handlePaymentChange={handlePaymentChange} 
          />
          <CheckoutSummary 
            checkoutItems={checkoutItems}
            subtotal={subtotal}
            formatPrice={formatPrice}
            handleSubmit={handleSubmit}
            loading={loading}
          />
        </div>
      </main>
    </div>
  );
};

export default Checkout;
