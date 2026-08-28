"use client";

import { useState, useEffect, useCallback } from 'react';
import { Plus, Search, RefreshCw, Eye, EyeOff, X } from 'lucide-react';
import { apiClient } from '@/lib/api';

interface ProductVariant {
  id?: number;
  variantName: string;
  volume: string;
  price: number;
  promotionalPrice?: number;
  sku?: string;
}

interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  basePrice: number;
  promotionalPrice?: number;
  imageUrl?: string;
  status: 'ACTIVE' | 'INACTIVE';
  totalReviews?: number;
  rating?: number;
  variants?: ProductVariant[];
  description?: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: '',
    basePrice: '',
    promotionalPrice: '',
    imageUrl: '',
    description: '',
    gender: 'UNISEX',
    concentration: 'Eau de Parfum (EDP)',
    fragranceFamily: '',
  });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      let res;
      try {
        res = await apiClient.get(`/admin/products?page=${page}&size=10${search ? `&keyword=${encodeURIComponent(search)}` : ''}`);
      } catch {
        res = await apiClient.get(`/products?page=${page}&size=10${search ? `&keyword=${encodeURIComponent(search)}` : ''}`);
      }
      const data = res.data?.data || res.data;
      if (data?.content) {
        setProducts(data.content);
        setTotalPages(data.totalPages || 1);
        setTotalElements(data.totalElements || data.content.length);
      } else if (Array.isArray(data)) {
        setProducts(data);
        setTotalPages(1);
        setTotalElements(data.length);
      }
    } catch (err) {
      console.error('Lỗi tải sản phẩm admin:', err);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleToggleStatus = async (productId: number, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await apiClient.patch(`/admin/products/${productId}/status?status=${newStatus}`);
      setProducts(prev => prev.map(p => p.id === productId ? { ...p, status: newStatus as any } : p));
      setMessage({ type: 'success', text: `Đã ${newStatus === 'ACTIVE' ? 'kích hoạt' : 'ẩn'} sản phẩm #${productId}` });
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Không thể cập nhật trạng thái');
    }
  };

  const buildProductPayload = () => ({
    name: formData.name,
    brand: formData.brand,
    category: formData.category,
    description: formData.description,
    gender: formData.gender,
    concentration: formData.concentration,
    fragranceFamily: formData.fragranceFamily,
    basePrice: parseFloat(formData.basePrice),
    promotionalPrice: formData.promotionalPrice ? parseFloat(formData.promotionalPrice) : null,
    imageUrl: formData.imageUrl || '/images/placeholder.jpg',
    variants: [
      {
        variantName: '50ml',
        volume: '50ml',
        price: parseFloat(formData.basePrice),
        promotionalPrice: formData.promotionalPrice ? parseFloat(formData.promotionalPrice) : null,
        sku: 'SKU-' + Date.now(),
      }
    ]
  });

  const resetForm = () => {
    setFormData({
      name: '',
      brand: '',
      category: '',
      basePrice: '',
      promotionalPrice: '',
      imageUrl: '',
      description: '',
      gender: 'UNISEX',
      concentration: 'Eau de Parfum (EDP)',
      fragranceFamily: '',
    });
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.brand || !formData.category || !formData.basePrice) {
      alert('Vui lòng điền đủ các trường bắt buộc (*)');
      return;
    }

    setSubmitting(true);
    try {
      await apiClient.post('/admin/products', buildProductPayload());
      setMessage({ type: 'success', text: 'Thêm sản phẩm mới thành công! 🌸' });
      setIsModalOpen(false);
      resetForm();
      fetchProducts();
      setTimeout(() => setMessage(null), 4000);
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || 'Lỗi khi tạo sản phẩm');
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      brand: product.brand,
      category: product.category,
      basePrice: String(product.basePrice),
      promotionalPrice: product.promotionalPrice ? String(product.promotionalPrice) : '',
      imageUrl: product.imageUrl || '',
      description: product.description || '',
      gender: product.variants?.[0]?.variantName ? 'UNISEX' : 'UNISEX',
      concentration: 'Eau de Parfum (EDP)',
      fragranceFamily: '',
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !formData.name || !formData.brand || !formData.category || !formData.basePrice) {
      alert('Vui lòng điền đủ các trường bắt buộc (*)');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...buildProductPayload(),
        status: editingProduct.status,
      };
      await apiClient.put(`/admin/products/${editingProduct.id}`, payload);
      setMessage({ type: 'success', text: `Cập nhật sản phẩm #${editingProduct.id} thành công!` });
      setIsEditModalOpen(false);
      setEditingProduct(null);
      resetForm();
      fetchProducts();
      setTimeout(() => setMessage(null), 4000);
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || 'Lỗi khi cập nhật sản phẩm');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return;

    try {
      await apiClient.delete(`/admin/products/${productId}`);
      setProducts((prev) => prev.filter((product) => product.id !== productId));
      setMessage({ type: 'success', text: `Đã xóa sản phẩm #${productId}` });
      await fetchProducts();
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      console.error('Delete product failed:', err);
      alert(err.response?.data?.message || 'Không thể xóa sản phẩm. Vui lòng kiểm tra quyền admin hoặc dữ liệu liên quan.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Sản phẩm</h1>
          <p className="text-sm text-gray-500 mt-1">Tổng cộng {totalElements} sản phẩm trong hệ thống</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchProducts}
            disabled={loading}
            className="p-2.5 text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
            title="Làm mới"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 font-medium shadow-md shadow-rose-200 hover:from-rose-600 hover:to-pink-600 transition-all"
          >
            <Plus className="w-4 h-4" />
            Thêm sản phẩm mới
          </button>
        </div>
      </div>

      {/* Alert Notification */}
      {message && (
        <div className={`p-4 rounded-xl text-sm flex items-center justify-between border ${message.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo tên sản phẩm, thương hiệu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50/80">
              <tr>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Sản phẩm</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Thương hiệu</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Danh mục</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Giá bán</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500"></div>
                      <span className="text-xs">Đang tải danh sách sản phẩm...</span>
                    </div>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400 text-sm">
                    Không tìm thấy sản phẩm nào.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-rose-50/20 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.imageUrl || '/images/placeholder.jpg'}
                          alt={product.name}
                          className="h-11 w-11 rounded-xl object-cover border border-gray-100 flex-shrink-0"
                          onError={(e: any) => { e.target.src = '/images/placeholder.jpg'; }}
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate max-w-xs">{product.name}</p>
                          <p className="text-xs text-gray-400">ID: #{product.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">{product.brand}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm font-semibold text-rose-600">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.basePrice)}
                      </p>
                      {product.promotionalPrice && product.promotionalPrice < product.basePrice && (
                        <p className="text-xs text-gray-400 line-through">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.promotionalPrice)}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(product.id, product.status)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                          product.status === 'ACTIVE'
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                      >
                        {product.status === 'ACTIVE' ? (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Hiển thị
                          </>
                        ) : (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span> Đã ẩn
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(product)}
                          className="p-1.5 text-gray-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Sửa sản phẩm"
                        >
                          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2">
                            <path d="M12 20h9" />
                            <path d="M16.5 3.5a2.1 2.1 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Xóa sản phẩm"
                        >
                          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2">
                            <path d="M3 6h18" />
                            <path d="M8 6V4h8v2" />
                            <path d="M19 6l-1 14H6L5 6" />
                            <path d="M10 11v6M14 11v6" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleToggleStatus(product.id, product.status)}
                          className="p-1.5 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                          title={product.status === 'ACTIVE' ? 'Ẩn sản phẩm' : 'Hiện sản phẩm'}
                        >
                          {product.status === 'ACTIVE' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-500">Trang {page + 1} / {totalPages}</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Trước
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Sửa Sản phẩm */}
      {isEditModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                ✏️ Chỉnh sửa sản phẩm
              </h2>
              <button
                onClick={() => { setIsEditModalOpen(false); setEditingProduct(null); resetForm(); }}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateProduct} className="space-y-4 mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Tên sản phẩm *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-400 focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Thương hiệu *</label>
                  <input
                    type="text"
                    required
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-400 focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Danh mục *</label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-400 focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Giá gốc (VNĐ) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="1000"
                    value={formData.basePrice}
                    onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-400 focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Giá khuyến mãi</label>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={formData.promotionalPrice}
                    onChange={(e) => setFormData({ ...formData, promotionalPrice: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-400 focus:bg-white outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Hình ảnh</label>
                  <input
                    type="text"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-400 focus:bg-white outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Mô tả</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-400 focus:bg-white outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => { setIsEditModalOpen(false); setEditingProduct(null); resetForm(); }} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-xl">
                  Hủy
                </button>
                <button type="submit" disabled={submitting} className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-5 py-2 rounded-xl text-sm font-medium shadow-md shadow-rose-200 disabled:opacity-70">
                  {submitting ? 'Đang cập nhật...' : 'Lưu thay đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Thêm Sản phẩm */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                🌸 Thêm sản phẩm nước hoa mới
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Tên sản phẩm *</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Roja Elysium Parfum Cologne"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-400 focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Thương hiệu *</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Roja Parfums, Creed, Tom Ford..."
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-400 focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Danh mục *</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Niche, Designer, Nam, Nữ, Unisex..."
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-400 focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Giá gốc (VNĐ) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="1000"
                    placeholder="VD: 7500000"
                    value={formData.basePrice}
                    onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-400 focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Giá khuyến mãi (VNĐ)</label>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    placeholder="Tuỳ chọn"
                    value={formData.promotionalPrice}
                    onChange={(e) => setFormData({ ...formData, promotionalPrice: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-400 focus:bg-white outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Link Ảnh sản phẩm (URL)</label>
                  <input
                    type="text"
                    placeholder="https://... hoặc /images/..."
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-400 focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Giới tính</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-400 focus:bg-white outline-none"
                  >
                    <option value="UNISEX">Unisex (Nam & Nữ)</option>
                    <option value="MEN">Nam</option>
                    <option value="WOMEN">Nữ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Nồng độ</label>
                  <select
                    value={formData.concentration}
                    onChange={(e) => setFormData({ ...formData, concentration: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-400 focus:bg-white outline-none"
                  >
                    <option value="Eau de Parfum (EDP)">Eau de Parfum (EDP)</option>
                    <option value="Extrait de Parfum">Extrait de Parfum</option>
                    <option value="Parfum">Parfum</option>
                    <option value="Eau de Toilette (EDT)">Eau de Toilette (EDT)</option>
                    <option value="Eau de Cologne (EDC)">Eau de Cologne (EDC)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Mô tả sản phẩm</label>
                  <textarea
                    rows={3}
                    placeholder="Mô tả hương thơm, tầng hương, phong cách..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-400 focus:bg-white outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-6 py-2.5 rounded-xl text-sm font-medium shadow-md shadow-rose-200 hover:from-rose-600 hover:to-pink-600 disabled:opacity-50 transition-all"
                >
                  {submitting ? 'Đang tạo...' : 'Tạo sản phẩm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

