"use client";

import { useState } from 'react';
import Link from 'next/link';
import { apiClient } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await apiClient.post('/auth/login', { email, password });
      const authData = res.data.data ? res.data.data : res.data;
      if (authData && authData.accessToken) {
        localStorage.setItem('token', authData.accessToken);
        localStorage.setItem('refreshToken', authData.refreshToken || '');
        localStorage.setItem('role', authData.role || 'CUSTOMER');
        localStorage.setItem('fullName', authData.fullName || '');
        localStorage.setItem('email', authData.email || email);
        localStorage.setItem('userId', authData.userId ? String(authData.userId) : '');
        window.location.href = '/';
      } else {
        setError('Đăng nhập thất bại: Không nhận được token');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Email hoặc mật khẩu không đúng.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-rose-50/50 to-white">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🌸</div>
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">Chào mừng trở lại</h2>
          <p className="mt-2 text-sm text-gray-500">
            Chưa có tài khoản?{' '}
            <Link href="/register" className="font-semibold text-rose-500 hover:text-rose-600">
              Đăng ký ngay
            </Link>
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-rose-100 border border-rose-50">
          {error && (
            <div className="mb-5 p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 flex items-center gap-2">
              ⚠️ {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-rose-100 rounded-xl focus:ring-2 focus:ring-rose-300 focus:border-rose-300 bg-rose-50/30 placeholder-gray-300 text-sm transition-all"
                placeholder="example@email.com"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-semibold text-gray-700">Mật khẩu</label>
                <a href="#" className="text-xs font-medium text-rose-400 hover:text-rose-600">Quên mật khẩu?</a>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-rose-100 rounded-xl focus:ring-2 focus:ring-rose-300 focus:border-rose-300 bg-rose-50/30 placeholder-gray-300 text-sm transition-all"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:from-rose-600 hover:to-pink-600 transition-all shadow-lg shadow-rose-200 disabled:opacity-70 mt-2"
            >
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
