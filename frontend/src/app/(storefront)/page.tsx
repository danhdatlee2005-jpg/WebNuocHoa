"use client";

import { useEffect, useState, useCallback } from 'react';
import { apiClient } from '@/lib/api';
import Link from 'next/link';
import { ShoppingBag, ArrowRight, Star, Sparkles } from 'lucide-react';

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/products?size=8');
      const responseData = res.data?.data || res.data;
      const data = responseData?.content ? responseData.content : responseData;
      if (Array.isArray(data) && data.length > 0) {
        setProducts(data.slice(0, 8));
      } else {
        setProducts([]);
      }
      setLoading(false);
    } catch (err) {
      console.error('L?i l?y d? li?u trang ch?:', err);
      setProducts([]);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div>
      {/* ===== BANNER ===== */}
      <section className="w-full bg-gradient-to-r from-purple-50 via-rose-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <Link href="/products" className="block overflow-hidden rounded-3xl shadow-md shadow-rose-100/50 hover:shadow-xl hover:shadow-rose-200/50 transition-all duration-300 group">
            <img
              src="/images/banner-homepage.png"
              alt="Ngọt Ngào Mùi Hương - Gửi Người Yêu Thương"
              className="w-full h-auto object-cover sm:object-contain md:object-cover max-h-[480px] group-hover:scale-[1.01] transition-transform duration-500"
            />
          </Link>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="bg-gradient-to-r from-rose-50/70 via-pink-50/50 to-rose-50/70 border-y border-rose-100/80 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: '🌸', title: 'Chính hãng 100%', desc: 'Nhập khẩu trực tiếp từ Pháp & Ý' },
              { icon: '🚚', title: 'Giao toàn quốc', desc: 'Miễn phí cho đơn từ 3 triệu' },
              { icon: '💝', title: 'Hộp quà sang trọng', desc: 'Tặng kèm thiệp chúc mừng' },
              { icon: '🔄', title: 'Đổi trả 30 ngày', desc: 'Bảo hành mùi hương trọn đời' },
            ].map((f, i) => (
              <div key={i} className="flex flex-col items-center gap-1 group">
                <span className="text-3xl group-hover:scale-110 transition-transform duration-300">{f.icon}</span>
                <p className="font-bold text-gray-800 text-sm">{f.title}</p>
                <p className="text-xs text-gray-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* ===== CATEGORY PILLS ===== */}
        <section className="mb-12">
          <div className="flex flex-wrap gap-3 justify-center">
            {[
              { label: '🌹 Nước hoa Nữ', href: '/products?gender=WOMEN' },
              { label: '🌊 Nước hoa Nam', href: '/products?gender=MEN' },
              { label: '✨ Nước hoa Unisex', href: '/products?gender=UNISEX' },
              { label: '💎 Niche Độc Bản', href: '/products?category=Niche' },
              { label: '👑 Designer Cao Cấp', href: '/products?category=Designer' },
            ].map((cat, i) => (
              <Link key={i} href={cat.href}>
                <span className="inline-block px-5 py-2.5 bg-white border-2 border-rose-100 rounded-full text-sm font-semibold text-gray-700 hover:border-rose-400 hover:text-rose-500 hover:bg-rose-50 transition-all cursor-pointer shadow-sm hover:shadow-md hover:shadow-rose-100">
                  {cat.label}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* ===== FEATURED PRODUCTS ===== */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-extrabold bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-rose-400" /> Sản phẩm nổi bật
              </h2>
              <p className="text-sm text-gray-400 mt-1">Những mùi hương quyến rũ được yêu thích nhất</p>
            </div>
            <Link
              href="/products"
              className="flex items-center gap-1 text-sm font-semibold text-rose-500 hover:text-rose-600 bg-rose-50 px-4 py-2 rounded-full hover:bg-rose-100 transition-all border border-rose-100"
            >
              Xem tất cả <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="flex flex-col justify-center items-center h-64 gap-4">
              <div className="relative">
                <div className="animate-spin rounded-full h-14 w-14 border-4 border-rose-100 border-t-rose-400"></div>
                <span className="absolute inset-0 flex items-center justify-center text-xl">🌸</span>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">Đang tải sản phẩm...</p>
                <p className="text-xs text-gray-400 mt-1">Máy chủ đang khởi động, vui lòng chờ trong giây lát</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <Link href={`/products/${product.id}`} key={product.id}>
                  <div className="group bg-white border border-rose-50 rounded-3xl flex flex-col overflow-hidden hover:shadow-xl hover:shadow-rose-100 transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                    <div className="bg-gradient-to-br from-rose-50 to-pink-50 h-64 overflow-hidden relative">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="bg-rose-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                          ✨ Nổi bật
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 p-5 flex flex-col">
                      <span className="text-xs font-bold text-rose-400 uppercase tracking-wide">{product.brand}</span>
                      <h3 className="text-sm font-bold text-gray-900 mt-1 mb-2 line-clamp-2 group-hover:text-rose-500 transition-colors">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-rose-300 text-rose-300" />
                        ))}
                      </div>
                      <div className="flex items-center justify-between mt-auto">
                        <p className="text-base font-extrabold text-rose-500">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.basePrice || product.price)}
                        </p>
                        <span className="text-xs bg-rose-50 text-rose-400 px-2.5 py-1 rounded-full font-semibold group-hover:bg-rose-500 group-hover:text-white transition-colors flex items-center gap-1">
                          <ShoppingBag className="w-3 h-3" /> Mua ngay
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* ===== PROMO BANNER ===== */}
        <section className="mt-16">
          <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 rounded-3xl p-8 md:p-12 text-white text-center relative overflow-hidden shadow-xl shadow-rose-200">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 left-8 text-6xl">🌸</div>
              <div className="absolute top-8 right-12 text-4xl">✨</div>
              <div className="absolute bottom-4 left-1/4 text-5xl">💝</div>
              <div className="absolute bottom-8 right-1/4 text-3xl">🌺</div>
            </div>
            <div className="relative z-10">
              <p className="text-rose-100 text-sm font-semibold uppercase tracking-widest mb-2">Ưu đãi đặc biệt</p>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-3">Giảm giá sâu tới 40%</h2>
              <p className="text-rose-100 mb-8 text-sm md:text-base">Nhân dịp khai trương — Số lượng có hạn, nhanh tay kẻo hết!</p>
              <Link
                href="/products"
                className="inline-block bg-white text-rose-500 font-bold px-8 py-3.5 rounded-full hover:bg-rose-50 transition-all shadow-lg hover:scale-105 transform"
              >
                🛍️ Mua sắm ngay
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
