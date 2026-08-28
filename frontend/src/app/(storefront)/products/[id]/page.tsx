"use client";

import { useState, useEffect } from 'react';
import { ShoppingCart, Star, Heart, ChevronLeft } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import Link from 'next/link';

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistId, setWishlistId] = useState<number | null>(null);
  const [cartMsg, setCartMsg] = useState('');
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    apiClient.get(`/products/${id}`)
      .then(res => {
        const data = res.data.data || res.data;
        setProduct(data);
        checkWishlistStatus(data.id);
      })
      .catch(err => console.error("Lỗi lấy dữ liệu sản phẩm:", err))
      .finally(() => setLoading(false));

    apiClient.get(`/reviews/products/${id}`)
      .then(res => setReviews(res.data.data || res.data || []))
      .catch(err => console.error("Lỗi lấy đánh giá:", err));
  }, [id]);

  const checkWishlistStatus = async (productId: number) => {
    if (typeof window === 'undefined' || !localStorage.getItem('token')) {
      setIsWishlisted(false);
      return;
    }
    try {
      const res = await apiClient.get(`/wishlist/check/${productId}`);
      setIsWishlisted(res.data.data);
      if (res.data.data) {
        const wlist = await apiClient.get('/wishlist');
        const item = wlist.data.data?.find((i: any) => i.productId === productId);
        if (item) setWishlistId(item.id);
      }
    } catch { }
  };

  const addToCart = async () => {
    if (!product) return;
    if (!localStorage.getItem('token')) {
      router.push('/login');
      return;
    }
    setAddingToCart(true);
    try {
      await apiClient.post('/cart/items', {
        productId: product.id,
        productName: product.name,
        imageUrl: product.imageUrl,
        unitPrice: product.basePrice || product.price,
        quantity: 1
      });
      window.dispatchEvent(new Event('cartUpdated'));
      setCartMsg('✓ Đã thêm vào giỏ hàng!');
      setTimeout(() => setCartMsg(''), 3000);
    } catch (err: any) {
      alert(err.response?.data?.message || "Lỗi khi thêm vào giỏ hàng");
    } finally {
      setAddingToCart(false);
    }
  };

  const toggleWishlist = async () => {
    if (!product) return;
    if (!localStorage.getItem('token')) {
      router.push('/login');
      return;
    }
    try {
      if (isWishlisted && wishlistId) {
        await apiClient.delete(`/wishlist/${wishlistId}`);
        setIsWishlisted(false);
        setWishlistId(null);
      } else {
        const res = await apiClient.post('/wishlist', {
          productId: product.id,
          productName: product.name,
          brand: product.brand,
          imageUrl: product.imageUrl,
          price: product.basePrice || product.price,
          rating: 5.0,
          inStock: true
        });
        setIsWishlisted(true);
        setWishlistId(res.data.data.id);
      }
    } catch { alert("Có lỗi xảy ra khi cập nhật mục yêu thích"); }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-400"></div>
    </div>
  );

  if (!product) return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-bold text-gray-900">Không tìm thấy sản phẩm</h2>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/products" className="inline-flex items-center gap-1 text-sm text-rose-400 hover:text-rose-600 mb-6 transition-colors">
        <ChevronLeft className="w-4 h-4" /> Quay lại danh sách
      </Link>

      <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 lg:items-start">
        {/* Image */}
        <div className="w-full bg-gradient-to-br from-rose-50 to-pink-50 rounded-3xl overflow-hidden shadow-lg shadow-rose-100 aspect-square">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
          <span className="text-xs font-bold tracking-widest uppercase text-rose-400 bg-rose-50 px-3 py-1 rounded-full">{product.brand}</span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">{product.name}</h1>

          <div className="mt-4 flex items-center gap-2">
            <div className="flex items-center text-rose-400">
              {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
            </div>
            <p className="text-sm text-gray-400">(5 đánh giá)</p>
          </div>

          <div className="mt-6 p-4 bg-rose-50 rounded-2xl">
            <p className="text-4xl font-extrabold text-rose-500">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.basePrice || product.price)}
            </p>
            <p className="text-xs text-rose-400 mt-1">Giá đã bao gồm VAT · Miễn phí giao hàng từ 3 triệu</p>
          </div>

          <div className="mt-6 border-t border-rose-50 pt-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Mô tả sản phẩm</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {product.description || "Đang cập nhật mô tả cho sản phẩm này."}
            </p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
            {[
              { label: 'Danh mục', value: product.category },
              { label: 'Giới tính', value: product.gender || 'Unisex' },
              { label: 'Nồng độ', value: product.concentration || 'EDP' },
              { label: 'Trạng thái', value: 'Còn hàng ✓' },
            ].map(f => (
              <div key={f.label} className="bg-gray-50 rounded-xl px-4 py-3">
                <p className="text-xs text-gray-400 font-medium">{f.label}</p>
                <p className="font-semibold text-gray-800 mt-0.5">{f.value}</p>
              </div>
            ))}
          </div>

          {cartMsg && (
            <div className="mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-600 text-sm rounded-xl font-medium">
              {cartMsg}
            </div>
          )}

          <div className="mt-8 flex gap-3">
            <button
              onClick={addToCart}
              disabled={addingToCart}
              className="flex-1 bg-gradient-to-r from-rose-500 to-pink-500 border border-transparent rounded-2xl py-4 flex items-center justify-center text-base font-semibold text-white hover:from-rose-600 hover:to-pink-600 transition-all shadow-lg shadow-rose-200 disabled:opacity-70"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              {addingToCart ? 'Đang thêm...' : 'Thêm vào giỏ hàng'}
            </button>
            <button
              onClick={toggleWishlist}
              className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-center ${isWishlisted ? 'border-rose-400 text-rose-500 bg-rose-50' : 'border-rose-100 text-rose-300 hover:text-rose-500 hover:bg-rose-50 hover:border-rose-300'}`}
            >
              <Heart className="w-6 h-6" fill={isWishlisted ? "currentColor" : "none"} />
            </button>
          </div>

          {/* Mua ngay */}
          <Link href="/checkout">
            <button className="mt-3 w-full border-2 border-rose-200 text-rose-500 py-3 rounded-2xl font-semibold hover:bg-rose-50 transition-all text-sm">
              Mua ngay →
            </button>
          </Link>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-20 border-t border-rose-50 pt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Đánh giá từ khách hàng</h2>
        {reviews.length === 0 ? (
          <p className="text-gray-500">Chưa có đánh giá nào cho sản phẩm này.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((rev, idx) => (
              <div key={idx} className="bg-white border border-rose-50 p-6 rounded-2xl shadow-sm shadow-rose-50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-gradient-to-br from-rose-400 to-pink-400 rounded-full flex items-center justify-center font-bold text-white text-sm">
                      {rev.userId ? String(rev.userId).charAt(0) : 'U'}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">Khách hàng #{rev.userId}</h4>
                      <span className="text-xs text-gray-400">
                        {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString('vi-VN') : ''}
                      </span>
                    </div>
                  </div>
                  <div className="flex text-rose-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-4 w-4 ${i < rev.rating ? 'fill-current' : 'text-gray-300'}`} />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{rev.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
