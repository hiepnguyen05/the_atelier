import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { orderService } from '../services/orderService';
import { useCart } from '../contexts/CartContext';

const VNPayReturn = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'failed'
  const [paymentInfo, setPaymentInfo] = useState(null);
  const { fetchCart } = useCart();

  const responseCode = searchParams.get('vnp_ResponseCode');
  const txnRef = searchParams.get('vnp_TxnRef');
  const transactionNo = searchParams.get('vnp_TransactionNo');
  
  // Extract internal orderCode from txnRef format: "ORD-xxx_timestamp"
  const orderCode = txnRef ? txnRef.split('_')[0] : null;

  useEffect(() => {
    const verifyPayment = async () => {
      if (!orderCode) {
        setStatus('failed');
        setPaymentInfo({ message: 'Không tìm thấy thông tin đơn hàng' });
        return;
      }

      try {
        // Collect all vnp_* params from the return URL
        const vnpParams = {};
        for (const [key, value] of searchParams.entries()) {
          vnpParams[key] = value;
        }

        // Send all params to backend for verification and order confirmation
        const res = await orderService.verifyVNPayPayment(vnpParams);
        const data = res.data;

        setPaymentInfo({
          orderCode: data.orderCode,
          orderStatus: data.orderStatus,
          payment: data.payment,
          transId: transactionNo
        });

        if (data.orderStatus === 'processing' || data.payment?.status === 'completed') {
          setStatus('success');
          // Refresh cart to remove purchased items
          if (fetchCart) fetchCart();
        } else if (data.orderStatus === 'cancelled') {
          setStatus('failed');
          let errorMsg = 'Thanh toán qua VNPay bị hủy hoặc có lỗi xảy ra.';
          if (responseCode === '24') errorMsg = 'Bạn đã hủy giao dịch thanh toán.';
          else if (responseCode === '11') errorMsg = 'Thời gian chờ thanh toán đã hết hạn.';
          else if (responseCode === '51') errorMsg = 'Tài khoản của bạn không đủ số dư để thực hiện giao dịch.';
          setPaymentInfo(prev => ({ ...prev, message: errorMsg }));
        } else {
          setStatus('pending');
        }
      } catch (error) {
        console.error('Error verifying VNPay payment:', error);
        // Fallback: determine status from URL params directly
        if (responseCode === '00') {
          setPaymentInfo({ orderCode, transId: transactionNo, message: 'Đang xác nhận thanh toán...' });
          setStatus('success');
          if (fetchCart) fetchCart();
        } else {
          let errorMsg = 'Thanh toán qua VNPay bị hủy hoặc có lỗi xảy ra.';
          if (responseCode === '24') errorMsg = 'Bạn đã hủy giao dịch thanh toán.';
          setPaymentInfo({ message: errorMsg, orderCode });
          setStatus('failed');
        }
      }
    };

    verifyPayment();
  }, [responseCode, orderCode, transactionNo]);

  if (status === 'loading') {
    return (
      <div className="bg-surface text-on-surface antialiased pt-32 pb-24 min-h-[70vh] flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center p-12 bg-surface-container-low border border-outline-variant/20 shadow-lg">
          <div className="animate-spin w-12 h-12 border-4 border-outline-variant/30 border-t-[#0064af] rounded-full mx-auto mb-6"></div>
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
            {paymentInfo?.message || 'Thanh toán qua VNPay bị hủy hoặc có lỗi xảy ra.'}
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
          Đơn hàng <span className="font-bold text-on-surface">#{paymentInfo?.orderCode}</span> đã được thanh toán qua VNPay.
        </p>
        {paymentInfo?.transId && (
          <p className="text-xs text-on-surface-variant mb-2">
            Mã giao dịch VNPay: <span className="font-mono font-bold text-on-surface">{paymentInfo.transId}</span>
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

export default VNPayReturn;
