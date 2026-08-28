"use client";

import { useState, useEffect, useCallback } from 'react';
import { Tag, Search, Plus, RefreshCw, X, ToggleLeft, ToggleRight } from 'lucide-react';
import { apiClient } from '@/lib/api';

interface Coupon {
  id: number;
  code: string;
  discountType: string;
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  usageCount: number;
  active: boolean;
  expiryDate?: string;
  description?: string;
}

export default function AdminPromotionsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const [form, setForm] = useState({
    code: '',
    discountType: 'PERCENTAGE',
    discountValue: '10',
    minOrderAmount: '500000',
    maxDiscountAmount: '',
    usageLimit: '',
    expiryDate: '',
    description: '',
  });

  const fetchCoupons = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/admin/promotions');
      const data = res.data?.data || res.data;
      setCoupons(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Lỗi tải mã giảm giá:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code || !form.discountValue) return;
    setSubmitting(true);
    try {
      await apiClient.post('/admin/promotions', {
        code: form.code.toUpperCase().trim(),
        discountType: form.discountType,
        discountValue: parseFloat(form.discountValue),
        minOrderAmount: parseFloat(form.minOrderAmount || '0'),
        maxDiscountAmount: form.maxDiscountAmount ? parseFloat(form.maxDiscountAmount) : null,
        usageLimit: form.usageLimit ? parseInt(form.usageLimit) : null,
        expiryDate: form.expiryDate || null,
        description: form.description,
        active: true,
      });

      setToastMsg('Đã tạo mã giảm giá thành công! 🏷️');
      setIsModalOpen(false);
      setForm({ code: '', discountType: 'PERCENTAGE', discountValue: '10', minOrderAmount: '500000', maxDiscountAmount: '', usageLimit: '', expiryDate: '', description: '' });
      fetchCoupons();
      setTimeout(() => setToastMsg(null), 3500);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Lỗi khi tạo mã giảm giá');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (id: number) => {
    try {
      await apiClient.patch(`/admin/promotions/${id}/toggle`);
      setCoupons(prev => prev.map(c => c.id === id ? { ...c, active: !c.active } : c));
      setToastMsg('Đã đổi trạng thái mã giảm giá.');
      setTimeout(() => setToastMsg(null), 3000);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Lỗi khi thay đổi trạng thái');
    }
  };

  const filtered = coupons.filter(c =>
    !search ||
    c.code.toLowerCase().includes(search.toLowerCase()) ||
    (c.description && c.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mã giảm giá (Khuyến mãi)</h1>
          <p className="text-sm text-gray-500 mt-1">Quản lý coupon áp dụng cho khách hàng khi thanh toán</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchCoupons}
            disabled={loading}
            className="p-2.5 text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 shadow-md shadow-rose-200 hover:from-rose-600 hover:to-pink-600 transition-all"
          >
            <Plus className="w-4 h-4" /> Tạo mã mới
          </button>
        </div>
      </div>

      {/* Toast */}
      {toastMsg && (
        <div className="p-4 rounded-xl text-sm bg-green-50 text-green-700 border border-green-200 flex items-center justify-between">
          <span>✓ {toastMsg}</span>
          <button onClick={() => setToastMsg(null)}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="relative max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm theo mã, mô tả..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50/80 border-b border-gray-100">
            <tr>
              <th className="px-6 py-3.5 font-semibold text-gray-700 text-xs uppercase">Mã (Code)</th>
              <th className="px-6 py-3.5 font-semibold text-gray-700 text-xs uppercase">Mức giảm</th>
              <th className="px-6 py-3.5 font-semibold text-gray-700 text-xs uppercase">Đơn tối thiểu</th>
              <th className="px-6 py-3.5 font-semibold text-gray-700 text-xs uppercase">Đã dùng</th>
              <th className="px-6 py-3.5 font-semibold text-gray-700 text-xs uppercase">Hạn sử dụng</th>
              <th className="px-6 py-3.5 font-semibold text-gray-700 text-xs uppercase">Trạng thái</th>
              <th className="px-6 py-3.5 font-semibold text-gray-700 text-xs uppercase text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-400">Đang tải danh sách mã giảm giá...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-400">Chưa có mã giảm giá nào.</td></tr>
            ) : (
              filtered.map((coupon) => {
                const isExpired = coupon.expiryDate && new Date(coupon.expiryDate) < new Date();
                return (
                  <tr key={coupon.id} className="hover:bg-rose-50/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-gradient-to-br from-rose-500 to-pink-500 text-white rounded-xl flex items-center justify-center flex-shrink-0">
                          <Tag className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 font-mono tracking-wider">{coupon.code}</p>
                          <p className="text-xs text-gray-400">{coupon.description || ''}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-rose-600">
                        {coupon.discountType === 'PERCENTAGE'
                          ? `${coupon.discountValue}%`
                          : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(coupon.discountValue)
                        }
                      </span>
                      {coupon.maxDiscountAmount && (
                        <p className="text-xs text-gray-400">Tối đa {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(coupon.maxDiscountAmount)}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(coupon.minOrderAmount || 0)}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {coupon.usageCount || 0} {coupon.usageLimit ? `/ ${coupon.usageLimit}` : ''}
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {coupon.expiryDate
                        ? new Date(coupon.expiryDate).toLocaleDateString('vi-VN')
                        : 'Không thời hạn'
                      }
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggle(coupon.id)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold cursor-pointer ${
                          coupon.active && !isExpired
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {coupon.active && !isExpired ? 'Kích hoạt' : isExpired ? 'Hết hạn' : 'Tắt'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleToggle(coupon.id)}
                        className="text-gray-400 hover:text-rose-500 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                        title={coupon.active ? 'Tắt coupon' : 'Bật coupon'}
                      >
                        {coupon.active ? <ToggleRight className="h-5 w-5 text-green-500" /> : <ToggleLeft className="h-5 w-5" />}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 my-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">🏷️ Tạo mã giảm giá mới</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Mã code *</label>
                <input
                  type="text"
                  required
                  placeholder="VD: WELCOME2026"
                  value={form.code}
                  onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono focus:ring-2 focus:ring-rose-400 focus:bg-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Loại giảm</label>
                  <select
                    value={form.discountType}
                    onChange={e => setForm({ ...form, discountType: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-400 focus:bg-white outline-none"
                  >
                    <option value="PERCENTAGE">Phần trăm (%)</option>
                    <option value="FIXED_AMOUNT">Số tiền cố định</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Mức giảm {form.discountType === 'PERCENTAGE' ? '(%)' : '(VND)'}
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder={form.discountType === 'PERCENTAGE' ? '10' : '50000'}
                    value={form.discountValue}
                    onChange={e => setForm({ ...form, discountValue: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-400 focus:bg-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Đơn tối thiểu (VND)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="500000"
                    value={form.minOrderAmount}
                    onChange={e => setForm({ ...form, minOrderAmount: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-400 focus:bg-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Số lần dùng tối đa</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="Không giới hạn"
                    value={form.usageLimit}
                    onChange={e => setForm({ ...form, usageLimit: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-400 focus:bg-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Ngày hết hạn</label>
                <input
                  type="date"
                  value={form.expiryDate}
                  onChange={e => setForm({ ...form, expiryDate: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-400 focus:bg-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Mô tả</label>
                <input
                  type="text"
                  placeholder="VD: Giảm 10% cho đơn từ 500k"
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-400 focus:bg-white outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-xl">
                  Hủy
                </button>
                <button type="submit" disabled={submitting} className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-5 py-2 rounded-xl text-sm font-medium shadow-md shadow-rose-200">
                  {submitting ? 'Đang tạo...' : 'Tạo mã giảm giá'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
