"use client";

import { useState, useEffect, useCallback } from 'react';
import { FolderTree, Sparkles, Plus, Edit, Trash2, X, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { apiClient } from '@/lib/api';

interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  active: boolean;
  productCount?: number;
}

interface Brand {
  id: number;
  name: string;
  country?: string;
  description?: string;
  active: boolean;
}

export default function AdminCategoriesPage() {
  const [activeTab, setActiveTab] = useState<'categories' | 'brands'>('categories');
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Form State
  const [catForm, setCatForm] = useState({ name: '', slug: '', description: '' });
  const [brandForm, setBrandForm] = useState({ name: '', country: 'France', description: '' });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [catRes, brandRes] = await Promise.allSettled([
        apiClient.get('/categories'),
        apiClient.get('/brands')
      ]);

      if (catRes.status === 'fulfilled') {
        const d = catRes.value.data?.data || catRes.value.data;
        setCategories(Array.isArray(d) ? d : []);
      }
      if (brandRes.status === 'fulfilled') {
        const d = brandRes.value.data?.data || brandRes.value.data;
        setBrands(Array.isArray(d) ? d : []);
      }
    } catch (err) {
      console.error('Lỗi tải danh mục / thương hiệu:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catForm.name) return;
    setSubmitting(true);
    try {
      const slug = catForm.slug || catForm.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
      await apiClient.post('/categories', {
        name: catForm.name,
        slug: slug,
        description: catForm.description,
        active: true,
      });

      setToastMsg('Đã thêm danh mục mới thành công! 🌸');
      setIsModalOpen(false);
      setCatForm({ name: '', slug: '', description: '' });
      fetchData();
      setTimeout(() => setToastMsg(null), 3500);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Lỗi khi tạo danh mục');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandForm.name) return;
    setSubmitting(true);
    try {
      await apiClient.post('/brands', {
        name: brandForm.name,
        country: brandForm.country,
        description: brandForm.description,
        active: true,
      });

      setToastMsg('Đã thêm thương hiệu mới thành công! ✨');
      setIsModalOpen(false);
      setBrandForm({ name: '', country: 'France', description: '' });
      fetchData();
      setTimeout(() => setToastMsg(null), 3500);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Lỗi khi tạo thương hiệu');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm('Bạn có chắc muốn xóa danh mục này?')) return;
    try {
      await apiClient.delete(`/categories/${id}`);
      setCategories(prev => prev.filter(c => c.id !== id));
      setToastMsg('Đã xóa danh mục.');
      setTimeout(() => setToastMsg(null), 3000);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Lỗi khi xóa danh mục');
    }
  };

  const handleToggleBrand = async (id: number) => {
    try {
      await apiClient.patch(`/brands/${id}/toggle`);
      setBrands(prev => prev.map(b => b.id === id ? { ...b, active: !b.active } : b));
      setToastMsg('Đã cập nhật trạng thái thương hiệu.');
      setTimeout(() => setToastMsg(null), 3000);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Lỗi khi đổi trạng thái');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Danh mục & Thương hiệu</h1>
          <p className="text-sm text-gray-500 mt-1">Cấu hình phân loại và thương hiệu hiển thị trên website</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            disabled={loading}
            className="p-2.5 text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
            title="Làm mới"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 shadow-md shadow-rose-200 hover:from-rose-600 hover:to-pink-600 transition-all"
          >
            <Plus className="w-4 h-4" />
            {activeTab === 'categories' ? 'Thêm danh mục' : 'Thêm thương hiệu'}
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMsg && (
        <div className="p-4 rounded-xl text-sm bg-green-50 text-green-700 border border-green-200 flex items-center justify-between animate-in fade-in">
          <span>✓ {toastMsg}</span>
          <button onClick={() => setToastMsg(null)}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-gray-200 gap-6">
        <button
          onClick={() => setActiveTab('categories')}
          className={`pb-3 font-semibold text-sm flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'categories'
              ? 'border-rose-500 text-rose-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <FolderTree className="w-4 h-4" /> Danh mục sản phẩm ({categories.length})
        </button>
        <button
          onClick={() => setActiveTab('brands')}
          className={`pb-3 font-semibold text-sm flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'brands'
              ? 'border-rose-500 text-rose-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Sparkles className="w-4 h-4" /> Thương hiệu ({brands.length})
        </button>
      </div>

      {/* Content Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-gray-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500 mx-auto mb-2"></div>
            <span className="text-xs">Đang tải dữ liệu...</span>
          </div>
        ) : activeTab === 'categories' ? (
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/80 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3.5 font-semibold text-gray-700 text-xs uppercase">Tên danh mục</th>
                <th className="px-6 py-3.5 font-semibold text-gray-700 text-xs uppercase">Slug</th>
                <th className="px-6 py-3.5 font-semibold text-gray-700 text-xs uppercase">Mô tả</th>
                <th className="px-6 py-3.5 font-semibold text-gray-700 text-xs uppercase">Trạng thái</th>
                <th className="px-6 py-3.5 font-semibold text-gray-700 text-xs uppercase text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categories.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400">Chưa có danh mục nào.</td></tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-rose-50/20 transition-colors">
                    <td className="px-6 py-4 font-semibold text-gray-900 flex items-center gap-3">
                      <div className="h-8 w-8 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500">
                        <FolderTree className="h-4 w-4" />
                      </div>
                      {cat.name}
                    </td>
                    <td className="px-6 py-4 text-gray-500 font-mono text-xs">{cat.slug}</td>
                    <td className="px-6 py-4 text-gray-500 max-w-xs truncate">{cat.description || '—'}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cat.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
                        {cat.active ? 'Hiển thị' : 'Ẩn'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDeleteCategory(cat.id)}
                        className="text-gray-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                        title="Xóa danh mục"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/80 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3.5 font-semibold text-gray-700 text-xs uppercase">Thương hiệu</th>
                <th className="px-6 py-3.5 font-semibold text-gray-700 text-xs uppercase">Xuất xứ (Quốc gia)</th>
                <th className="px-6 py-3.5 font-semibold text-gray-700 text-xs uppercase">Mô tả</th>
                <th className="px-6 py-3.5 font-semibold text-gray-700 text-xs uppercase">Trạng thái</th>
                <th className="px-6 py-3.5 font-semibold text-gray-700 text-xs uppercase text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {brands.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400">Chưa có thương hiệu nào.</td></tr>
              ) : (
                brands.map((brand) => (
                  <tr key={brand.id} className="hover:bg-rose-50/20 transition-colors">
                    <td className="px-6 py-4 font-semibold text-gray-900 flex items-center gap-3">
                      <div className="h-8 w-8 bg-pink-50 rounded-xl flex items-center justify-center text-pink-500">
                        <Sparkles className="h-4 w-4" />
                      </div>
                      {brand.name}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{brand.country || 'N/A'}</td>
                    <td className="px-6 py-4 text-gray-500 max-w-xs truncate">{brand.description || '—'}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleBrand(brand.id)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold cursor-pointer ${brand.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}
                      >
                        {brand.active ? 'Hiển thị' : 'Đã ẩn'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleToggleBrand(brand.id)}
                        className="text-gray-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                        title={brand.active ? 'Ẩn thương hiệu' : 'Hiện thương hiệu'}
                      >
                        {brand.active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">
                {activeTab === 'categories' ? '🌸 Thêm danh mục mới' : '✨ Thêm thương hiệu mới'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {activeTab === 'categories' ? (
              <form onSubmit={handleCreateCategory} className="space-y-4 mt-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Tên danh mục *</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Nước hoa Nam cao cấp"
                    value={catForm.name}
                    onChange={e => setCatForm({ ...catForm, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-400 focus:bg-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Slug (Đường dẫn tĩnh)</label>
                  <input
                    type="text"
                    placeholder="VD: nuoc-hoa-nam (để trống tự tạo)"
                    value={catForm.slug}
                    onChange={e => setCatForm({ ...catForm, slug: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-400 focus:bg-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Mô tả</label>
                  <textarea
                    rows={2}
                    placeholder="Mô tả danh mục..."
                    value={catForm.description}
                    onChange={e => setCatForm({ ...catForm, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-400 focus:bg-white outline-none"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-xl">
                    Hủy
                  </button>
                  <button type="submit" disabled={submitting} className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-5 py-2 rounded-xl text-sm font-medium shadow-md shadow-rose-200">
                    {submitting ? 'Đang tạo...' : 'Tạo danh mục'}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleCreateBrand} className="space-y-4 mt-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Tên thương hiệu *</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Maison Francis Kurkdjian"
                    value={brandForm.name}
                    onChange={e => setBrandForm({ ...brandForm, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-400 focus:bg-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Xuất xứ (Quốc gia)</label>
                  <input
                    type="text"
                    placeholder="VD: France, Italy, USA..."
                    value={brandForm.country}
                    onChange={e => setBrandForm({ ...brandForm, country: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-400 focus:bg-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Mô tả</label>
                  <textarea
                    rows={2}
                    placeholder="Mô tả thương hiệu..."
                    value={brandForm.description}
                    onChange={e => setBrandForm({ ...brandForm, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-400 focus:bg-white outline-none"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-xl">
                    Hủy
                  </button>
                  <button type="submit" disabled={submitting} className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-5 py-2 rounded-xl text-sm font-medium shadow-md shadow-rose-200">
                    {submitting ? 'Đang tạo...' : 'Tạo thương hiệu'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

