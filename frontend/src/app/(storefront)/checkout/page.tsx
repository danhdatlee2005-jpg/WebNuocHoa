"use client";

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { ShoppingBag, CheckCircle2, ShieldCheck, Truck, CreditCard, Wallet, Landmark } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('COD');

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    address: '',
    note: ''
  });

  const [promotionCodeInput, setPromotionCodeInput] = useState('');
  const [appliedPromotion, setAppliedPromotion] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [applyingPromo, setApplyingPromo] = useState(false);
  const [promoError, setPromoError] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('token')) {
      const userId = localStorage.getItem('userId') || 'guest';
      const savedName = localStorage.getItem('fullName') || '';
      const savedPhone = localStorage.getItem(`phone_${userId}`) || localStorage.getItem('phone') || '';
      const savedAddr = localStorage.getItem(`address_${userId}`) || localStorage.getItem('address') || '';

      setForm(prev => ({
        ...prev,
        fullName: savedName,
        phone: savedPhone,
        address: savedAddr
      }));

      fetchCart();
    } else {
      setCartLoading(false);
    }
  }, []);

  const fetchCart = async () => {
    if (!localStorage.getItem('token')) {
      setCartLoading(false);
      return;
    }
    try {
      const res = await apiClient.get('/cart');
      setCart(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setCartLoading(false);
    }
  };

  const items = cart?.items || [];
  const subtotal = items.reduce((sum: number, item: any) => sum + item.unitPrice * item.quantity, 0);
  const shippingFee = subtotal > 0 ? 35000 : 0;
  const total = Math.max(0, subtotal - discountAmount + shippingFee);

  const applyPromo = async () => {
    if (!promotionCodeInput.trim()) return;
    setApplyingPromo(true);
    setPromoError('');
    try {
      const res = await apiClient.post('/promotions/validate', {
        couponCode: promotionCodeInput,
        orderValue: subtotal
      });
      const data = res.data.data;
      if (data && data.valid) {
        setAppliedPromotion(data.couponCode);
        setDiscountAmount(data.discountAmount);
        setPromoError('');
      } else {
        setPromoError(data?.message || 'Mã giảm giá không hợp lệ');
        setAppliedPromotion('');
        setDiscountAmount(0);
      }
    } catch (err: any) {
      setPromoError(err.response?.data?.message || 'Lỗi kiểm tra mã giảm giá');
      setAppliedPromotion('');
      setDiscountAmount(0);
    } finally {
      setApplyingPromo(false);
    }
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      alert("Giỏ hàng của bạn đang trống!");
      return;
    }

    setLoading(true);
    try {
      await apiClient.post('/orders/checkout', {
        shippingAddress: form.address,
        customerName: form.fullName,
        customerPhone: form.phone,
        notes: form.note,
        paymentMethod: paymentMethod,
        shippingFee: 35000,
        promotionCode: appliedPromotion || null,
        discountAmount: discountAmount || 0,
        items: items.map((item: any) => ({
          productId: item.productId,
          productName: item.productName,
          variantId: item.variantId || null,
          variantName: item.variantName || null,
          imageUrl: item.imageUrl,
          unitPrice: item.unitPrice,
          quantity: item.quantity
        }))
      });

      // Xóa giỏ hàng sau khi đặt hàng thành công
      await apiClient.delete('/cart/clear');
      window.dispatchEvent(new Event('cartUpdated'));

      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Lỗi khi đặt hàng. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  if (cartLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center space-y-6 bg-white p-8 rounded-3xl shadow-xl shadow-rose-100/50 border border-rose-50">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-500">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">Đặt hàng thành công!</h2>
          <p className="text-gray-500 text-sm">
            Cảm ơn bạn đã mua sắm tại Luxury Scent. Đơn hàng của bạn đang được xử lý và sẽ sớm được giao đến bạn.
          </p>
          <div className="pt-4 flex flex-col gap-3">
            <button
              onClick={() => router.push('/profile')}
              className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white font-medium py-3 px-4 rounded-xl hover:from-rose-600 hover:to-pink-600 transition-all shadow-md shadow-rose-200 cursor-pointer"
            >
              Xem đơn hàng của tôi
            </button>
            <button
              onClick={() => router.push('/')}
              className="w-full bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-xl hover:bg-gray-100 transition-all cursor-pointer"
            >
              Tiếp tục mua sắm
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50/50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold mb-2 bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
          Thanh toán an toàn
        </h1>
        <p className="text-gray-500 mb-10 text-sm">🔒 Thông tin của bạn được bảo mật hoàn toàn</p>

        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
          {/* Form */}
          <form className="lg:col-span-7 space-y-6" onSubmit={handleCheckout}>
            <div className="bg-white shadow-sm shadow-rose-100 rounded-2xl p-6 border border-rose-50">
              <h2 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
                <Truck className="w-5 h-5 text-rose-400" /> Thông tin giao hàng
              </h2>
              <div className="grid grid-cols-1 gap-y-5 sm:grid-cols-2 sm:gap-x-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên *</label>
                  <input
                    required
                    type="text"
                    value={form.fullName}
                    onChange={e => setForm({...form, fullName: e.target.value})}
                    className="mt-1 block w-full border border-gray-200 rounded-xl shadow-sm py-2.5 px-4 focus:ring-2 focus:ring-rose-300 focus:border-rose-300 text-sm transition-all outline-none"
                    placeholder="Nguyễn Văn A"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ nhận hàng chi tiết *</label>
                  <input
                    required
                    type="text"
                    value={form.address}
                    onChange={e => setForm({...form, address: e.target.value})}
                    className="mt-1 block w-full border border-gray-200 rounded-xl shadow-sm py-2.5 px-4 focus:ring-2 focus:ring-rose-300 focus:border-rose-300 text-sm transition-all outline-none"
                    placeholder="Ví dụ: 123 Đường Nguyễn Huệ, P. Bến Nghé, Quận 1, TP.HCM"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại *</label>
                  <input
                    required
                    type="tel"
                    value={form.phone}
                    onChange={e => setForm({...form, phone: e.target.value})}
                    className="mt-1 block w-full border border-gray-200 rounded-xl shadow-sm py-2.5 px-4 focus:ring-2 focus:ring-rose-300 focus:border-rose-300 text-sm transition-all outline-none"
                    placeholder="0912 345 678"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú (tuỳ chọn)</label>
                  <input
                    type="text"
                    value={form.note}
                    onChange={e => setForm({...form, note: e.target.value})}
                    className="mt-1 block w-full border border-gray-200 rounded-xl shadow-sm py-2.5 px-4 focus:ring-2 focus:ring-rose-300 focus:border-rose-300 text-sm transition-all outline-none"
                    placeholder="Ghi chú cho người bán..."
                  />
                </div>
              </div>
            </div>

            <div className="bg-white shadow-sm shadow-rose-100 rounded-2xl p-6 border border-rose-50">
              <h2 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-rose-400" /> Phương thức thanh toán
              </h2>
              <div className="space-y-3">
                <label className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'COD' ? 'border-rose-500 bg-rose-50/20' : 'border-gray-200 hover:border-rose-200'}`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      value="COD"
                      checked={paymentMethod === 'COD'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-rose-500 focus:ring-rose-400"
                    />
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Thanh toán khi nhận hàng (COD)</p>
                      <p className="text-xs text-gray-500">Thanh toán tiền mặt cho shipper khi giao tới nơi</p>
                    </div>
                  </div>
                  <Wallet className="w-5 h-5 text-gray-400" />
                </label>

                <label className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'VNPAY' ? 'border-rose-500 bg-rose-50/20' : 'border-gray-200 hover:border-rose-200'}`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      value="VNPAY"
                      checked={paymentMethod === 'VNPAY'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-rose-500 focus:ring-rose-400"
                    />
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Thanh toán qua VNPAY</p>
                      <p className="text-xs text-gray-500">Quét mã QR / Thẻ ATM nội địa / Visa</p>
                    </div>
                  </div>
                  <Landmark className="w-5 h-5 text-gray-400" />
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || items.length === 0}
              className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold py-4 px-6 rounded-2xl hover:from-rose-600 hover:to-pink-600 transition-all shadow-lg shadow-rose-200 flex items-center justify-center gap-2 text-base disabled:opacity-50 cursor-pointer"
            >
              <ShieldCheck className="w-5 h-5" />
              {loading ? "Đang xử lý đơn hàng..." : `Đặt hàng ngay (${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total)})`}
            </button>
          </form>

          {/* Order Summary */}
          <div className="lg:col-span-5 mt-10 lg:mt-0">
            <div className="bg-white shadow-sm shadow-rose-100 rounded-2xl p-6 border border-rose-50 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-rose-400" /> Đơn hàng của bạn ({items.length} món)
              </h2>

              <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto pr-1">
                {items.map((item: any) => (
                  <div key={item.id} className="py-3.5 flex items-center gap-4">
                    <img
                      src={item.imageUrl || 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=100&q=80'}
                      alt={item.productName}
                      className="w-14 h-14 object-cover rounded-xl border border-gray-100 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">{item.productName}</h4>
                      {item.variantName && (
                        <p className="text-xs text-gray-400">{item.variantName}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">SL: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold text-rose-500">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.unitPrice * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 mt-4">
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    placeholder="Nhập mã giảm giá..."
                    value={promotionCodeInput}
                    onChange={(e) => setPromotionCodeInput(e.target.value)}
                    className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-rose-300 focus:border-rose-300 outline-none uppercase"
                  />
                  <button
                    type="button"
                    onClick={applyPromo}
                    disabled={applyingPromo || !promotionCodeInput}
                    className="bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-800 disabled:opacity-50 transition-colors"
                  >
                    {applyingPromo ? 'Đang áp dụng...' : 'Áp dụng'}
                  </button>
                </div>
                {promoError && <p className="text-xs text-red-500 mb-3">{promoError}</p>}
                {appliedPromotion && (
                  <p className="text-xs text-green-600 mb-3 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Đã áp dụng mã: {appliedPromotion}
                  </p>
                )}

                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between text-gray-500">
                    <span>Tạm tính</span>
                    <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Phí vận chuyển</span>
                    <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(shippingFee)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-green-600 font-medium">
                      <span>Giảm giá</span>
                      <span>-{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(discountAmount)}</span>
                    </div>
                  )}
                </div>
                <div className="flex justify-between text-base font-bold text-gray-900 border-t border-gray-100 pt-3 mt-3">
                  <span>Tổng thanh toán</span>
                  <span className="text-rose-500 text-lg">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
