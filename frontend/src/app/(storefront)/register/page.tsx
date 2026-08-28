"use client";

import { useState } from 'react';
import Link from 'next/link';
import { apiClient } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '', email: '', phoneNumber: '', password: '', confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      setLoading(false);
      return;
    }

    try {
      await apiClient.post('/auth/register', formData);
      setSuccess('Đăng ký thành công! Đang chuyển về trang đăng nhập...');
      setTimeout(() => router.push('/login'), 1500);
    } catch (err: any) {
      const msg = err.response?.data?.message;
      if (msg === 'EMAIL_ALREADY_EXISTS') setError('Email này đã được sử dụng.');
      else if (msg === 'PHONE_ALREADY_EXISTS') setError('Số điện thoại này đã được sử dụng.');
      else setError(msg || 'Lỗi đăng ký. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-rose-50/50 to-white">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">✨</div>
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">Tạo tài khoản</h2>
          <p className="mt-2 text-sm text-gray-500">
            Đã có tài khoản?{' '}
            <Link href="/login" className="font-semibold text-rose-500 hover:text-rose-600">
              Đăng nhập ngay
            </Link>
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-rose-100 border border-rose-50">
          {error && (
            <div className="mb-5 p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">⚠️ {error}</div>
          )}
          {success && (
            <div className="mb-5 p-3 bg-green-50 text-green-600 text-sm rounded-xl border border-green-100">✓ {success}</div>
          )}

          <form className="space-y-4" onSubmit={handleRegister}>
            {[
              { label: 'Họ và tên', name: 'fullName', type: 'text', placeholder: 'Nguyễn Văn A' },
              { label: 'Số điện thoại', name: 'phoneNumber', type: 'tel', placeholder: '0912 345 678' },
              { label: 'Email', name: 'email', type: 'email', placeholder: 'example@email.com' },
              { label: 'Mật khẩu', name: 'password', type: 'password', placeholder: 'Tối thiểu 6 ký tự' },
              { label: 'Xác nhận mật khẩu', name: 'confirmPassword', type: 'password', placeholder: 'Nhập lại mật khẩu' },
            ].map(field => (
              <div key={field.name}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">{field.label}</label>
                <input
                  type={field.type}
                  name={field.name}
                  required
                  value={(formData as any)[field.name]}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-rose-100 rounded-xl focus:ring-2 focus:ring-rose-300 focus:border-rose-300 bg-rose-50/30 placeholder-gray-300 text-sm transition-all"
                  placeholder={field.placeholder}
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:from-rose-600 hover:to-pink-600 transition-all shadow-lg shadow-rose-200 disabled:opacity-70 mt-2"
            >
              {loading ? 'Đang xử lý...' : 'Đăng ký tài khoản'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
