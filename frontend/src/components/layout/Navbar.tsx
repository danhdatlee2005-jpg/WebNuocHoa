"use client";

import Link from 'next/link';
import { ShoppingCart, User, Search, Heart, LogIn, UserPlus, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token) {
      setIsLoggedIn(true);
      setUserRole(role);
      fetchCartCount();
    }

    // Lắng nghe sự kiện cập nhật giỏ hàng
    const handleCartUpdate = () => fetchCartCount();
    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  const fetchCartCount = async () => {
    if (typeof window === 'undefined' || !localStorage.getItem('token')) {
      setCartCount(0);
      return;
    }
    try {
      const res = await apiClient.get('/cart');
      const items = res.data.data?.items || [];
      const total = items.reduce((sum: number, item: any) => sum + item.quantity, 0);
      setCartCount(total);
    } catch {
      setCartCount(0);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('role');
    localStorage.removeItem('fullName');
    localStorage.removeItem('email');
    localStorage.removeItem('userId');
    setIsLoggedIn(false);
    setUserRole(null);
    window.location.href = '/';
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-rose-100 sticky top-0 z-50 shadow-sm shadow-rose-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold tracking-tighter flex-shrink-0 bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent hover:from-rose-600 hover:to-pink-600 transition-all">
            🌸 LA PERFUM
          </Link>

          <nav className="hidden md:flex items-center space-x-8 mx-8">
            <Link href="/products" className="text-sm font-medium text-gray-600 hover:text-rose-500 transition-colors">
              Sản phẩm
            </Link>
            <Link href="/wishlist" className="text-sm font-medium text-gray-600 hover:text-rose-500 transition-colors">
              Yêu thích
            </Link>
            {userRole === 'ADMIN' && (
              <Link href="/admin" className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
                Quản trị (Admin)
              </Link>
            )}
          </nav>

          <div className="flex-1 max-w-sm mx-4 hidden sm:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-rose-300" />
              <input
                className="block w-full pl-9 pr-3 py-2 border border-rose-100 rounded-full bg-rose-50/50 text-sm placeholder-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-rose-300 transition-all"
                placeholder="Tìm kiếm nước hoa..."
                type="search"
              />
            </div>
          </div>

          <div className="flex items-center space-x-5">
            <Link href="/wishlist" className="text-gray-400 hover:text-rose-500 transition-colors hidden sm:block">
              <Heart className="h-5 w-5" />
            </Link>
            <Link href="/cart" className="text-gray-400 hover:text-rose-500 relative transition-colors">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold animate-pulse">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <Link href="/profile" className="text-gray-500 hover:text-rose-500 flex items-center gap-1 transition-colors">
                  <User className="h-5 w-5" />
                  <span className="text-sm font-medium hidden md:block">{localStorage.getItem('fullName') || 'Hồ sơ'}</span>
                </Link>
                <button onClick={handleLogout} className="text-gray-400 hover:text-rose-500 flex items-center gap-1 transition-colors">
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3 border-l border-rose-100 pl-4">
                <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-rose-500 flex items-center gap-1 transition-colors">
                  <LogIn className="h-4 w-4" /> Đăng nhập
                </Link>
                <Link href="/register" className="text-sm font-medium bg-rose-500 text-white px-3 py-1.5 rounded-full hover:bg-rose-600 flex items-center gap-1 transition-colors shadow-sm shadow-rose-200">
                  <UserPlus className="h-4 w-4" /> Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
