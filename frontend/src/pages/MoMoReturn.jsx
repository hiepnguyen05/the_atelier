import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { orderService } from '../services/orderService';
import { useCart } from '../contexts/CartContext';

const MoMoReturn = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'failed'
  const [paymentInfo, setPaymentInfo] = useState(null);
  const { fetchCart } = useCart();

  const resultCode = searchParams.get('resultCode');
  const momoOrderId = searchParams.get('orderId');
  const message = searchParams.get('message');
  const transId = searchParams.get('transId');

  // Extract the internal orderCode from MoMo's orderId format: "ORD-xxx_timestamp"
  const orderCode = momoOrderId ? momoOrderId.split('_')[0] : null;

  useEffect(() => {
    const verifyPayment = async () => {
      if (!orderCode) {
        setStatus('failed');
        setPaymentInfo({ message: 'Không tìm thấy thông tin đơn hàng' });
        return;
      }

      try {
        // Send return URL params to backend for verification and order confirmation
        const res = await orderService.verifyMoMoPayment({
          resultCode,
          orderId: momoOrderId,
          transId,
          message
        });
        const data = res.data;

        setPaymentInfo({
          orderCode: data.orderCode,
          orderStatus: data.orderStatus,
          payment: data.payment,
          transId
        });

        if (data.orderStatus === 'processing' || data.payment?.status === 'completed') {
          setStatus('success');
          // Refresh cart to remove purchased items
          if (fetchCart) fetchCart();
        } else if (data.orderStatus === 'cancelled') {
          setStatus('failed');
          setPaymentInfo(prev => ({
            ...prev,
            message: message || 'Thanh toán qua Ví MoMo bị hủy hoặc có lỗi xảy ra.'
          }));
        } else {
          setStatus('pending');
        }
      } catch (error) {
        console.error('Error verifying MoMo payment:', error);
        // Fallback: determine status from URL params directly
        if (resultCode === '0') {
          setPaymentInfo({ orderCode, transId, message: 'Đang xác nhận thanh toán...' });
          setStatus('success');
          if (fetchCart) fetchCart();
        } else {
          setPaymentInfo({ message: message || 'Thanh toán qua Ví MoMo bị hủy hoặc có lỗi xảy ra.', orderCode });
          setStatus('failed');
        }
      }
    };

    verifyPayment();
  }, [resultCode, orderCode, message, transId]);

  if (status === 'loading') {
    return (
      <div className="bg-surface text-on-surface antialiased pt-32 pb-24 min-h-[70vh] flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center p-12 bg-surface-container-low border border-outline-variant/20 shadow-lg">
          <div className="animate-spin w-12 h-12 border-4 border-outline-variant/30 border-t-[#ae2070] rounded-full mx-auto mb-6"></div>
          <h1 className="text-2xl font-display italic mb-2">Đang xác nhận thanh toán...</h1>
          <p className="text-sm text-on-surface-variant">Vui lòng chờ trong giây lát</p>
        </div>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="bg-surface text-on-surface antialiased pt-32 pb-24 min-h-[70vh] flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center p-12 bg-surface-container-low border border-outline-variant/20 shadow-lg">
          <span className="material-symbols-outlined text-6xl text-red-500 mb-6 block mx-auto">error</span>
          <h1 className="text-3xl font-display italic mb-4">Đặt hàng không thành công</h1>
          <p className="text-sm text-on-surface-variant mb-2">
            {paymentInfo?.message || 'Thanh toán qua Ví MoMo bị hủy hoặc có lỗi xảy ra.'}
          </p>
          {paymentInfo?.orderCode && (
            <p className="text-xs text-on-surface-variant mb-8">
              Mã đơn hàng: <span className="font-bold text-on-surface">#{paymentInfo.orderCode}</span>
            </p>
          )}
          <Link 
            to="/products"
            className="inline-block w-full bg-surface-tint text-on-primary py-4 text-xs font-bold tracking-[0.2em] uppercase hover:bg-primary-dim transition-all duration-300 mb-4"
          >
            TIẾP TỤC MUA SẮM
          </Link>
          <Link 
            to="/"
            className="inline-block w-full bg-surface-container-low text-on-surface py-4 text-xs font-bold tracking-[0.2em] uppercase hover:bg-surface-container-highest transition-all duration-300 border border-outline-variant/30"
          >
            VỀ TRANG CHỦ
          </Link>
        </div>
      </div>
    );
  }

  // Success or pending state
  return (
    <div className="bg-surface text-on-surface antialiased pt-32 pb-24 min-h-[70vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center p-12 bg-surface-container-low border border-outline-variant/20 shadow-lg">
        <span className="material-symbols-outlined text-6xl text-secondary mb-6 block mx-auto">check_circle</span>
        <h1 className="text-3xl font-display italic mb-4">Thanh toán thành công!</h1>
        <p className="text-sm text-on-surface-variant mb-2">
          Đơn hàng <span className="font-bold text-on-surface">#{paymentInfo?.orderCode}</span> đã được thanh toán qua MoMo.
        </p>
        {paymentInfo?.transId && (
          <p className="text-xs text-on-surface-variant mb-2">
            Mã giao dịch: <span className="font-mono font-bold text-on-surface">{paymentInfo.transId}</span>
          </p>
        )}
        <p className="text-[11px] leading-relaxed text-on-surface-variant mb-10 mt-6">
          Chúng tôi đã ghi nhận thanh toán của bạn. 
          Đơn hàng sẽ được THE ATELIER xử lý và giao trong thời gian sớm nhất.
        </p>
        <Link 
          to="/orders"
          className="inline-block w-full bg-surface-tint text-on-primary py-4 text-xs font-bold tracking-[0.2em] uppercase hover:bg-primary-dim transition-all duration-300 mb-4"
        >
          THEO DÕI ĐƠN HÀNG
        </Link>
        <Link 
          to="/products"
          className="inline-block w-full bg-surface-container-low text-on-surface py-4 text-xs font-bold tracking-[0.2em] uppercase hover:bg-surface-container-highest transition-all duration-300 border border-outline-variant/30"
        >
          TIẾP TỤC MUA SẮM
        </Link>
      </div>
    </div>
  );
};

export default MoMoReturn;
