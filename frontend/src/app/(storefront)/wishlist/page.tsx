"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function WishlistPage() {
  const router = useRouter();
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchWishlist(); }, []);

  const fetchWishlist = async () => {
    try {
      if (!localStorage.getItem('token')) { setLoading(false); return; }
      const res = await apiClient.get('/wishlist');
      setWishlistItems(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (wishlistItemId: number) => {
    try {
      await apiClient.delete(`/wishlist/${wishlistItemId}`);
      setWishlistItems(wishlistItems.filter(item => item.id !== wishlistItemId));
    } catch { alert("Lỗi khi xóa sản phẩm khỏi yêu thích"); }
  };

  const addToCart = async (item: any) => {
    try {
      await apiClient.post('/cart/items', {
        productId: item.productId,
        productName: item.productName,
        imageUrl: item.imageUrl,
        unitPrice: item.price,
        quantity: 1
      });
      window.dispatchEvent(new Event('cartUpdated'));
      alert("Đã thêm " + item.productName + " vào giỏ hàng!");
    } catch (err: any) {
      alert(err.response?.data?.message || "Lỗi khi thêm vào giỏ hàng");
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-400"></div>
    </div>
  );

  if (!localStorage.getItem('token')) return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <div className="text-6xl mb-4">💝</div>
      <h1 className="text-2xl font-bold mb-3">Vui lòng đăng nhập để xem danh sách yêu thích</h1>
      <Link href="/login" className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-6 py-3 rounded-xl inline-block font-semibold hover:from-rose-600 hover:to-pink-600 shadow-md shadow-rose-200 transition-all">
        Đăng nhập ngay
      </Link>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-extrabold mb-8 bg-gradient-to-r from-rose-500 to-pink-400 bg-clip-text text-transparent flex items-center gap-3">
        <Heart className="w-8 h-8 text-rose-400 fill-rose-400" /> Sản phẩm yêu thích
      </h1>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-rose-50">
          <Heart className="w-16 h-16 text-rose-200 mx-auto mb-4" />
          <p className="text-gray-400 text-lg mb-2">Danh sách yêu thích của bạn đang trống.</p>
          <Link href="/products" className="mt-4 inline-block bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold px-8 py-3 rounded-xl hover:from-rose-600 hover:to-pink-600 shadow-md shadow-rose-200 transition-all">
            Khám phá sản phẩm
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlistItems.map((item) => (
            <div key={item.id} className="group relative bg-white border border-rose-50 rounded-3xl overflow-hidden hover:shadow-lg hover:shadow-rose-100 transition-all duration-300 hover:-translate-y-1">
              <div
                className="bg-gradient-to-br from-rose-50 to-pink-50 h-64 overflow-hidden cursor-pointer"
                onClick={() => router.push(`/products/${item.productId}`)}
              >
                <img
                  src={item.imageUrl}
                  alt={item.productName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md text-rose-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                title="Bỏ yêu thích"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="p-5">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wide">{item.brand}</span>
                <h3
                  className="text-sm font-bold text-gray-900 mt-1 mb-3 cursor-pointer hover:text-rose-500 transition-colors line-clamp-2"
                  onClick={() => router.push(`/products/${item.productId}`)}
                >
                  {item.productName}
                </h3>
                <p className="text-base font-bold text-rose-500 mb-4">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                </p>
                <button
                  onClick={() => addToCart(item)}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white py-2.5 rounded-xl hover:from-rose-600 hover:to-pink-600 transition-all text-sm font-semibold shadow-sm shadow-rose-200"
                >
                  <ShoppingCart className="w-4 h-4" /> Thêm vào giỏ
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
