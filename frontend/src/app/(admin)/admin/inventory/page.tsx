"use client";

import { useState, useEffect, useCallback } from 'react';
import { Package, Search, Plus, Edit, X, RefreshCw, AlertTriangle, CheckCircle, ArrowDownCircle } from 'lucide-react';
import { apiClient } from '@/lib/api';

interface InventoryItem {
  id: number;
  productId: number;
  variantId?: number;
  productName: string;
  variantName?: string;
  sku: string;
  totalQuantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  lowStockThreshold: number;
  updatedAt?: string;
}

export default function AdminInventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterLowStock, setFilterLowStock] = useState(false);

  // Modals
  const [isRestockOpen, setIsRestockOpen] = useState(false);
  const [isAdjustOpen, setIsAdjustOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Forms
  const [restockForm, setRestockForm] = useState({
    productId: '',
    variantId: '',
    quantity: '50',
    unitCost: '1000000',
    supplierName: 'Nhà phân phối Paris',
    reason: 'Nhập hàng định kỳ',
  });

  const [adjustForm, setAdjustForm] = useState({
    newQuantity: '',
    reason: 'Kiểm kê kho thực tế',
  });

  const fetchInventory = useCallback(async () => {
    setLoading(true);
    try {
      let res;
      try {
        res = await apiClient.get(filterLowStock ? '/admin/inventory/low-stock' : '/admin/inventory');
      } catch {
        res = await apiClient.get('/inventory');
      }
      const d = res.data?.data || res.data;
      setItems(Array.isArray(d) ? d : []);
    } catch (err) {
      console.error('Lỗi tải kho hàng:', err);
    } finally {
      setLoading(false);
    }
  }, [filterLowStock]);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const handleRestock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restockForm.productId || !restockForm.quantity) return;
    setSubmitting(true);
    try {
      await apiClient.post('/admin/inventory/restock', {
        productId: parseInt(restockForm.productId),
        variantId: restockForm.variantId ? parseInt(restockForm.variantId) : 1,
        quantity: parseInt(restockForm.quantity),
        unitCost: parseFloat(restockForm.unitCost || '0'),
        supplierName: restockForm.supplierName,
        reason: restockForm.reason,
      });

      setToastMsg('Nhập kho thành công! 📦');
      setIsRestockOpen(false);
      fetchInventory();
      setTimeout(() => setToastMsg(null), 3500);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Lỗi khi nhập kho');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAdjust = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem || !adjustForm.newQuantity) return;
    setSubmitting(true);
    try {
      await apiClient.put(`/admin/inventory/${selectedItem.id}/adjust`, {
        newTotalQuantity: parseInt(adjustForm.newQuantity),
        reason: adjustForm.reason,
      });

      setToastMsg(`Đã cập nhật tồn kho sản phẩm ${selectedItem.productName}!`);
      setIsAdjustOpen(false);
      fetchInventory();
      setTimeout(() => setToastMsg(null), 3500);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Lỗi khi điều chỉnh tồn kho');
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = items.filter(it => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (it.productName && it.productName.toLowerCase().includes(q)) ||
      (it.sku && it.sku.toLowerCase().includes(q)) ||
      it.productId.toString().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Kho hàng</h1>
          <p className="text-sm text-gray-500 mt-1">Theo dõi số lượng tồn, giữ chỗ và cảnh báo hết hàng</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchInventory}
            disabled={loading}
            className="p-2.5 text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
            title="Làm mới"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setIsRestockOpen(true)}
            className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 shadow-md shadow-rose-200 hover:from-rose-600 hover:to-pink-600 transition-all"
          >
            <Plus className="w-4 h-4" /> Nhập kho mới
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

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm theo tên sản phẩm, SKU..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white transition-all"
          />
        </div>
        <button
          onClick={() => setFilterLowStock(!filterLowStock)}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all ${
            filterLowStock
              ? 'bg-amber-100 text-amber-800 border-amber-300'
              : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          {filterLowStock ? 'Đang lọc: Sắp hết hàng' : 'Lọc sản phẩm sắp hết hàng'}
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50/80 border-b border-gray-100">
            <tr>
              <th className="px-6 py-3.5 font-semibold text-gray-700 text-xs uppercase">Sản phẩm</th>
              <th className="px-6 py-3.5 font-semibold text-gray-700 text-xs uppercase">SKU</th>
              <th className="px-6 py-3.5 font-semibold text-gray-700 text-xs uppercase">Tổng kho</th>
              <th className="px-6 py-3.5 font-semibold text-gray-700 text-xs uppercase">Đang giữ chỗ</th>
              <th className="px-6 py-3.5 font-semibold text-gray-700 text-xs uppercase">Khả dụng</th>
              <th className="px-6 py-3.5 font-semibold text-gray-700 text-xs uppercase">Trạng thái</th>
              <th className="px-6 py-3.5 font-semibold text-gray-700 text-xs uppercase text-right">Điều chỉnh</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-400">Đang tải dữ liệu tồn kho...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-400">Không tìm thấy bản ghi kho hàng nào.</td></tr>
            ) : (
              filtered.map((item) => {
                const avail = item.totalQuantity - item.reservedQuantity;
                const isOutOfStock = avail <= 0;
                const isLowStock = avail <= (item.lowStockThreshold || 10) && !isOutOfStock;

                return (
                  <tr key={item.id} className="hover:bg-rose-50/20 transition-colors">
                    <td className="px-6 py-4 font-semibold text-gray-900 flex items-center gap-3">
                      <div className="h-9 w-9 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500 flex-shrink-0">
                        <Package className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{item.productName}</p>
                        <p className="text-xs text-gray-400">{item.variantName ? `Dung tích: ${item.variantName}` : `Product #${item.productId}`}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-mono text-xs">{item.sku}</td>
                    <td className="px-6 py-4 font-bold text-gray-900">{item.totalQuantity}</td>
                    <td className="px-6 py-4 text-gray-500 font-medium">{item.reservedQuantity}</td>
                    <td className="px-6 py-4">
                      <span className={`font-bold text-base ${isOutOfStock ? 'text-red-600' : isLowStock ? 'text-amber-600' : 'text-green-600'}`}>
                        {avail}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {isOutOfStock ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800">Hết hàng</span>
                      ) : isLowStock ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">Sắp hết</span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">Sẵn sàng</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedItem(item);
                          setAdjustForm({ newQuantity: item.totalQuantity.toString(), reason: 'Kiểm kê định kỳ' });
                          setIsAdjustOpen(true);
                        }}
                        className="text-gray-500 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors flex items-center gap-1 ml-auto text-xs font-medium"
                        title="Chỉnh sửa số lượng"
                      >
                        <Edit className="h-4 w-4" /> Sửa kho
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Restock Modal */}
      {isRestockOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                📦 Nhập hàng vào kho
              </h2>
              <button onClick={() => setIsRestockOpen(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRestock} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Mã sản phẩm (Product ID) *</label>
                <input
                  type="number"
                  required
                  placeholder="VD: 1, 2, 3..."
                  value={restockForm.productId}
                  onChange={e => setRestockForm({ ...restockForm, productId: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-400 focus:bg-white outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Số lượng nhập thêm *</label>
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="VD: 50"
                  value={restockForm.quantity}
                  onChange={e => setRestockForm({ ...restockForm, quantity: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-400 focus:bg-white outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Nhà cung cấp</label>
                <input
                  type="text"
                  placeholder="VD: Nhà phân phối Paris"
                  value={restockForm.supplierName}
                  onChange={e => setRestockForm({ ...restockForm, supplierName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-400 focus:bg-white outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Lý do nhập</label>
                <input
                  type="text"
                  value={restockForm.reason}
                  onChange={e => setRestockForm({ ...restockForm, reason: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-400 focus:bg-white outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button type="button" onClick={() => setIsRestockOpen(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-xl">
                  Hủy
                </button>
                <button type="submit" disabled={submitting} className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-5 py-2 rounded-xl text-sm font-medium shadow-md shadow-rose-200">
                  {submitting ? 'Đang lưu...' : 'Xác nhận nhập kho'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Adjust Modal */}
      {isAdjustOpen && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">
                ✏️ Điều chỉnh tồn kho: {selectedItem.productName}
              </h2>
              <button onClick={() => setIsAdjustOpen(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdjust} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Tổng số lượng mới *</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={adjustForm.newQuantity}
                  onChange={e => setAdjustForm({ ...adjustForm, newQuantity: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-400 focus:bg-white outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Lý do điều chỉnh</label>
                <input
                  type="text"
                  value={adjustForm.reason}
                  onChange={e => setAdjustForm({ ...adjustForm, reason: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-400 focus:bg-white outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button type="button" onClick={() => setIsAdjustOpen(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-xl">
                  Hủy
                </button>
                <button type="submit" disabled={submitting} className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-5 py-2 rounded-xl text-sm font-medium shadow-md shadow-rose-200">
                  {submitting ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

