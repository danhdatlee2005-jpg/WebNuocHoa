"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Trash2, ShoppingBag } from 'lucide-react';
import { apiClient } from '@/lib/api';

export default function CartPage() {
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      if (!localStorage.getItem('token')) { setLoading(false); return; }
      const res = await apiClient.get('/cart');
      setCart(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartItemId: number, quantity: number) => {
    try {
      const res = await apiClient.put(`/cart/items/${cartItemId}`, { quantity });
      setCart(res.data.data);
      window.dispatchEvent(new Event('cartUpdated'));
    } catch { alert("Lỗi khi cập nhật số lượng"); }
  };

  const removeItem = async (cartItemId: number) => {
    try {
      const res = await apiClient.delete(`/cart/items/${cartItemId}`);
      setCart(res.data.data);
      window.dispatchEvent(new Event('cartUpdated'));
    } catch { alert("Lỗi khi xóa sản phẩm"); }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-400"></div>
    </div>
  );

  if (!localStorage.getItem('token')) return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <div className="text-6xl mb-4">🛍️</div>
      <h1 className="text-2xl font-bold mb-3 text-gray-800">Vui lòng đăng nhập để xem giỏ hàng</h1>
      <Link href="/login" className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-6 py-3 rounded-xl inline-block font-semibold hover:from-rose-600 hover:to-pink-600 shadow-md shadow-rose-200 transition-all">
        Đăng nhập ngay
      </Link>
    </div>
  );

  const items = cart?.items || [];
  const totalPrice = items.reduce((sum: number, item: any) => sum + item.unitPrice * item.quantity, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-extrabold mb-8 bg-gradient-to-r from-rose-500 to-pink-400 bg-clip-text text-transparent flex items-center gap-3">
        <ShoppingBag className="w-8 h-8 text-rose-400" /> Giỏ hàng của bạn
      </h1>

      {items.length > 0 ? (
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-10 lg:items-start">
          {/* Items list */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl border border-rose-50 shadow-sm shadow-rose-50 overflow-hidden">
              {items.map((item: any, index: number) => (
                <div key={item.id} className={`flex gap-4 p-5 ${index !== items.length - 1 ? 'border-b border-rose-50' : ''}`}>
                  <Link href={`/products/${item.productId}`}>
                    <img
                      src={item.imageUrl || '/images/placeholder.jpg'}
                      alt={item.productName}
                      className="w-24 h-24 rounded-2xl object-cover flex-shrink-0 border border-rose-50 hover:opacity-80 transition-opacity"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link href={`/products/${item.productId}`} className="font-bold text-gray-800 hover:text-rose-500 transition-colors text-sm line-clamp-2">
                      {item.productName}
                    </Link>
                    <p className="text-rose-500 font-bold text-base mt-1">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.unitPrice)}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-rose-100 rounded-xl overflow-hidden">
                        <button
                          onClick={() => item.quantity > 1 && updateQuantity(item.id, item.quantity - 1)}
                          className="px-3 py-1.5 text-rose-400 hover:bg-rose-50 transition-colors font-bold"
                        >−</button>
                        <span className="px-4 py-1.5 text-sm font-semibold border-x border-rose-100">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-3 py-1.5 text-rose-400 hover:bg-rose-50 transition-colors font-bold"
                        >+</button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-xs text-rose-400 hover:text-rose-600 flex items-center gap-1 font-medium transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Xóa
                      </button>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-gray-900 text-sm">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.unitPrice * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="mt-8 lg:mt-0 lg:col-span-5 bg-white rounded-3xl border border-rose-50 shadow-sm shadow-rose-50 p-6 sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Tóm tắt đơn hàng</h2>
            <dl className="space-y-4 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-gray-500">{items.length} sản phẩm</dt>
                <dd className="font-semibold text-gray-800">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-gray-500">Phí vận chuyển</dt>
                <dd className="font-semibold text-gray-800">35.000 ₫</dd>
              </div>
              <div className="border-t border-rose-50 pt-4 flex items-center justify-between text-base font-bold">
                <dt className="text-gray-900">Tổng cộng</dt>
                <dd className="text-rose-500 text-xl">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice + 35000)}
                </dd>
              </div>
            </dl>
            <Link
              href="/checkout"
              className="mt-6 w-full bg-gradient-to-r from-rose-500 to-pink-500 border border-transparent rounded-2xl shadow-lg shadow-rose-200 py-4 text-base font-semibold text-white hover:from-rose-600 hover:to-pink-600 flex justify-center transition-all"
            >
              Tiến hành thanh toán →
            </Link>
            <Link href="/products" className="mt-3 block text-center text-sm text-rose-400 hover:text-rose-600 transition-colors">
              ← Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-rose-50">
          <div className="text-6xl mb-4">🛍️</div>
          <p className="text-gray-400 text-lg mb-2">Giỏ hàng của bạn đang trống.</p>
          <Link href="/products" className="mt-4 inline-block bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold px-8 py-3 rounded-xl hover:from-rose-600 hover:to-pink-600 transition-all shadow-md shadow-rose-200">
            Khám phá sản phẩm
          </Link>
        </div>
      )}
    </div>
  );
}
