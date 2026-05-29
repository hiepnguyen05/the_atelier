import React from 'react';

const CheckoutForm = ({ formData, handleInputChange, handlePaymentChange }) => {
  return (
    <div className="lg:col-span-7 space-y-16">
      {/* Section: Shipping */}
      <section>
        <h2 className="text-4xl md:text-5xl font-display mb-10 italic">Thông Tin Giao Hàng</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-label uppercase tracking-[0.05em] text-on-surface-variant">Họ và Tên</label>
            <input 
              name="recipientName"
              value={formData.recipientName}
              onChange={handleInputChange}
              className="border-b border-outline-variant/40 bg-transparent py-2 focus:outline-none focus:border-primary transition-colors placeholder:text-surface-dim" 
              placeholder="Nguyễn Văn A" 
              type="text"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-label uppercase tracking-[0.05em] text-on-surface-variant">Số Điện Thoại</label>
            <input 
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className="border-b border-outline-variant/40 bg-transparent py-2 focus:outline-none focus:border-primary transition-colors placeholder:text-surface-dim" 
              placeholder="+84 000 000 000" 
              type="tel"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-label uppercase tracking-[0.05em] text-on-surface-variant">Email</label>
            <input 
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="border-b border-outline-variant/40 bg-transparent py-2 focus:outline-none focus:border-primary transition-colors placeholder:text-surface-dim" 
              placeholder="user@example.com" 
              type="email"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-label uppercase tracking-[0.05em] text-on-surface-variant">Thành Phố / Tỉnh</label>
            <input 
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className="border-b border-outline-variant/40 bg-transparent py-2 focus:outline-none focus:border-primary transition-colors placeholder:text-surface-dim" 
              placeholder="Hồ Chí Minh" 
              type="text"
            />
          </div>
          <div className="md:col-span-2 flex flex-col gap-2">
            <label className="text-[10px] font-label uppercase tracking-[0.05em] text-on-surface-variant">Địa Chỉ</label>
            <input 
              name="addressLine"
              value={formData.addressLine}
              onChange={handleInputChange}
              className="border-b border-outline-variant/40 bg-transparent py-2 focus:outline-none focus:border-primary transition-colors placeholder:text-surface-dim" 
              placeholder="Số nhà, tên đường, phường/xã" 
              type="text"
            />
          </div>
        </div>
      </section>

      {/* Section: Payment Method */}
      <section>
        <h2 className="text-4xl md:text-5xl font-display mb-10 italic">Phương Thức Thanh Toán</h2>
        <div className="space-y-4">
          {/* Option 1 - Credit Card */}
          <label className={`group flex items-center justify-between p-6 bg-surface-container-low cursor-pointer transition-colors hover:bg-surface-container-high border-l-4 ${formData.paymentMethod === 'CREDIT_CARD' ? 'border-secondary' : 'border-transparent'}`}>
            <div className="flex items-center gap-6">
              <input 
                checked={formData.paymentMethod === 'CREDIT_CARD'} 
                onChange={() => handlePaymentChange('CREDIT_CARD')}
                className="w-4 h-4 text-primary border-outline focus:ring-0 cursor-pointer" 
                name="payment" 
                type="radio"
              />
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-wide">THẺ TÍN DỤNG / GHI NỢ</span>
                <span className="text-xs text-on-surface-variant">Visa, Mastercard, American Express</span>
              </div>
            </div>
            <div className="flex gap-2">
              <span className="material-symbols-outlined text-on-surface-variant">credit_card</span>
            </div>
          </label>
          
          {formData.paymentMethod === 'CREDIT_CARD' && (
            <div className="p-8 bg-surface-container-low grid grid-cols-2 gap-8 border-t border-outline-variant/10">
              <div className="col-span-2 flex flex-col gap-2">
                <label className="text-[10px] font-label uppercase tracking-[0.05em] text-on-surface-variant">Số Thẻ</label>
                <input className="border-b border-outline-variant/40 bg-transparent py-2 focus:outline-none focus:border-primary transition-colors" placeholder="0000 0000 0000 0000" type="text"/>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-label uppercase tracking-[0.05em] text-on-surface-variant">Ngày Hết Hạn</label>
                <input className="border-b border-outline-variant/40 bg-transparent py-2 focus:outline-none focus:border-primary transition-colors" placeholder="MM/YY" type="text"/>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-label uppercase tracking-[0.05em] text-on-surface-variant">CVC</label>
                <input className="border-b border-outline-variant/40 bg-transparent py-2 focus:outline-none focus:border-primary transition-colors" placeholder="000" type="text"/>
              </div>
            </div>
          )}

          {/* Option 2 - COD / Bank Transfer */}
          <label className={`group flex items-center justify-between p-6 bg-surface-container-low cursor-pointer transition-colors hover:bg-surface-container-high border-l-4 ${formData.paymentMethod === 'COD' ? 'border-secondary' : 'border-transparent'}`}>
            <div className="flex items-center gap-6">
              <input 
                checked={formData.paymentMethod === 'COD'}
                onChange={() => handlePaymentChange('COD')}
                className="w-4 h-4 text-primary border-outline focus:ring-0 cursor-pointer" 
                name="payment" 
                type="radio"
              />
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-wide">THANH TOÁN KHI NHẬN HÀNG (COD)</span>
                <span className="text-xs text-on-surface-variant">Thanh toán tiền mặt khi giao hàng</span>
              </div>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant">local_shipping</span>
          </label>
        </div>
      </section>
    </div>
  );
};

export default CheckoutForm;
