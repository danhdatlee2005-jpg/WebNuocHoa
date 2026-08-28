"use client";

import { useState, useEffect, useCallback } from 'react';
import { Truck, MapPin, Search, RefreshCw, X } from 'lucide-react';
import { apiClient } from '@/lib/api';

interface ShipmentOrder {
  id: number;
  customerId: number;
  customerName?: string;
  customerPhone?: string;
  shippingAddress: string;
  shippingMethod?: string;
  trackingNumber?: string;
  orderStatus: string;
  paymentMethod?: string;
  totalAmount: number;
  createdAt?: string;
}

const normalizeOrderStatus = (status?: string) => {
  const value = String(status || '').trim();
  if (!value) return 'PENDING';
  if (value === 'SHIPPING' || value === 'IN_TRANSIT') return 'SHIPPED';
  return value;
};

const statusMap: Record<string, { label: string; cls: string }> = {
  PENDING:    { label: 'Chờ xác nhận', cls: 'bg-yellow-100 text-yellow-800' },
  CONFIRMED:  { label: 'Đã xác nhận', cls: 'bg-blue-100 text-blue-800' },
  PROCESSING: { label: 'Đang xử lý', cls: 'bg-purple-100 text-purple-800' },
  SHIPPED:    { label: 'Đang giao', cls: 'bg-indigo-100 text-indigo-800' },
  DELIVERED:  { label: 'Đã giao', cls: 'bg-green-100 text-green-800' },
  CANCELLED:  { label: 'Đã hủy', cls: 'bg-red-100 text-red-800' },
  PAYMENT_FAILED: { label: 'Thanh toán thất bại', cls: 'bg-red-100 text-red-800' },
  EXPIRED:    { label: 'Hết hạn', cls: 'bg-gray-100 text-gray-800' },
};

export default function AdminShippingPage() {
  const [orders, setOrders] = useState<ShipmentOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('SHIPPED');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const statusParam = statusFilter !== 'ALL' ? `&status=${normalizeOrderStatus(statusFilter)}` : '';
      let res;
      try {
        res = await apiClient.get(`/admin/orders?page=${page}&size=10${statusParam}`);
      } catch {
        res = await apiClient.get(`/orders?page=${page}&size=10${statusParam}`);
      }
      const data = res.data?.data || res.data;
      if (data?.content) {
        setOrders(data.content);
        setTotalPages(data.totalPages || 1);
      } else if (Array.isArray(data)) {
        setOrders(data);
        setTotalPages(1);
      }
    } catch (err) {
      console.error('Lỗi tải đơn vận chuyển:', err);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleUpdateStatus = async (orderId: number, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const normalizedStatus = normalizeOrderStatus(newStatus);
      await apiClient.patch(`/admin/orders/${orderId}/status`, {
        orderStatus: normalizedStatus,
        paymentStatus: normalizedStatus === 'DELIVERED' ? 'SUCCESS' : undefined,
      });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, orderStatus: normalizedStatus } : o));
      setToastMsg(`Cập nhật đơn #${orderId} → "${statusMap[normalizedStatus]?.label}" thành công.`);
      setTimeout(() => setToastMsg(null), 3500);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Lỗi khi cập nhật trạng thái');
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = orders.filter(o => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      o.id.toString().includes(q) ||
      (o.customerName && o.customerName.toLowerCase().includes(q)) ||
      (o.trackingNumber && o.trackingNumber.toLowerCase().includes(q)) ||
      (o.shippingAddress && o.shippingAddress.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Giao hàng</h1>
          <p className="text-sm text-gray-500 mt-1">Theo dõi và cập nhật trạng thái vận chuyển đơn hàng</p>
        </div>
        <button
          onClick={fetchOrders}
          disabled={loading}
          className="p-2.5 text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm w-fit"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Toast */}
      {toastMsg && (
        <div className="p-4 rounded-xl text-sm bg-green-50 text-green-700 border border-green-200 flex items-center justify-between">
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
            placeholder="Tìm theo mã đơn, tên khách..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white transition-all"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {['ALL', 'CONFIRMED', 'SHIPPED', 'DELIVERED'].map((s) => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setPage(0); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === s
                  ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md shadow-rose-200'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {s === 'ALL' ? 'Tất cả' : statusMap[normalizeOrderStatus(s)]?.label || s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50/80 border-b border-gray-100">
            <tr>
              <th className="px-6 py-3.5 font-semibold text-gray-700 text-xs uppercase">Đơn hàng</th>
              <th className="px-6 py-3.5 font-semibold text-gray-700 text-xs uppercase">Khách hàng & Địa chỉ</th>
              <th className="px-6 py-3.5 font-semibold text-gray-700 text-xs uppercase">Phương thức</th>
              <th className="px-6 py-3.5 font-semibold text-gray-700 text-xs uppercase">Mã tracking</th>
              <th className="px-6 py-3.5 font-semibold text-gray-700 text-xs uppercase">Trạng thái</th>
              <th className="px-6 py-3.5 font-semibold text-gray-700 text-xs uppercase text-right">Cập nhật</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400">Đang tải dữ liệu giao hàng...</td></tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                  <div className="flex flex-col items-center gap-2">
                    <Truck className="h-10 w-10 text-gray-200" />
                    <p className="text-sm">Không có đơn nào ở trạng thái này.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((order) => {
                const normalizedOrderStatus = normalizeOrderStatus(order.orderStatus);
                const st = statusMap[normalizedOrderStatus] || { label: order.orderStatus, cls: 'bg-gray-100 text-gray-700' };
                return (
                  <tr key={order.id} className="hover:bg-rose-50/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-indigo-50 rounded-xl flex items-center justify-center">
                          <Truck className="h-4 w-4 text-indigo-500" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">#{order.id}</p>
                          <p className="text-xs text-gray-400">
                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">{order.customerName || `Khách #${order.customerId}`}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3 text-gray-400 flex-shrink-0" />
                        <span className="line-clamp-1">{order.shippingAddress || 'N/A'}</span>
                      </p>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {order.shippingMethod || 'Tiêu chuẩn'}
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-mono text-xs">
                      {order.trackingNumber || '—'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${st.cls}`}>
                        {st.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <select
                        onChange={e => { if (e.target.value) handleUpdateStatus(order.id, e.target.value); }}
                        defaultValue=""
                        disabled={updatingId === order.id}
                        className="text-xs border border-gray-200 rounded-xl px-3 py-1.5 focus:ring-2 focus:ring-rose-400 outline-none bg-white text-gray-700 cursor-pointer disabled:opacity-60"
                      >
                        <option value="" disabled>Đổi trạng thái...</option>
                        <option value="CONFIRMED">✓ Xác nhận</option>
                        <option value="SHIPPED">🚚 Đang giao</option>
                        <option value="DELIVERED">✅ Đã giao</option>
                        <option value="CANCELLED">✕ Hủy đơn</option>
                      </select>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-500">Trang {page + 1} / {totalPages}</span>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} className="px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50">Trước</button>
              <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1} className="px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50">Sau</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
