"use client";

import { useState, useEffect, useCallback } from 'react';
import { Eye, Search, RefreshCw, X, Package, Truck, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { apiClient } from '@/lib/api';

interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  variantName?: string;
  imageUrl?: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

interface Order {
  id: number;
  customerId: number;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  shippingAddress: string;
  shippingMethod?: string;
  trackingNumber?: string;
  subtotal: number;
  shippingFee: number;
  discountAmount?: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  notes?: string;
  createdAt: string;
  items?: OrderItem[];
}

const normalizeOrderStatus = (status?: string) => {
  const value = String(status || '').trim();
  if (!value) return 'PENDING';
  if (value === 'SHIPPING' || value === 'IN_TRANSIT') return 'SHIPPED';
  return value;
};

const statusMap: Record<string, { label: string; className: string; icon: any }> = {
  PENDING:    { label: 'Chờ xác nhận', className: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock },
  CONFIRMED:  { label: 'Đã xác nhận', className: 'bg-blue-100 text-blue-800 border-blue-200', icon: CheckCircle },
  PROCESSING: { label: 'Đang xử lý', className: 'bg-purple-100 text-purple-800 border-purple-200', icon: Package },
  SHIPPED:    { label: 'Đang giao', className: 'bg-indigo-100 text-indigo-800 border-indigo-200', icon: Truck },
  DELIVERED:  { label: 'Đã giao hàng', className: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle },
  CANCELLED:  { label: 'Đã hủy', className: 'bg-red-100 text-red-800 border-red-200', icon: AlertCircle },
  PAYMENT_FAILED: { label: 'Thanh toán thất bại', className: 'bg-red-100 text-red-800 border-red-200', icon: AlertCircle },
  EXPIRED:    { label: 'Hết hạn', className: 'bg-gray-100 text-gray-800 border-gray-200', icon: AlertCircle },
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // Selected Order for Modal Detail
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const statusParam = statusFilter !== 'ALL' ? `&status=${statusFilter}` : '';
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
        setTotalElements(data.totalElements || data.content.length);
      } else if (Array.isArray(data)) {
        setOrders(data);
        setTotalPages(1);
        setTotalElements(data.length);
      }
    } catch (err) {
      console.error('Lỗi tải danh sách đơn hàng:', err);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleUpdateStatus = async (orderId: number, newStatus: string) => {
    setUpdatingStatus(true);
    try {
      await apiClient.patch(`/admin/orders/${orderId}/status`, {
        orderStatus: newStatus,
        paymentStatus: newStatus === 'DELIVERED' ? 'SUCCESS' : undefined,
      });

      // Update locally
      const normalizedStatus = normalizeOrderStatus(newStatus);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, orderStatus: normalizedStatus } : o));
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, orderStatus: normalizedStatus } : null);
      }

      setToastMsg(`Đã cập nhật trạng thái đơn #${orderId} thành "${statusMap[normalizedStatus]?.label || normalizedStatus}"`);
      setTimeout(() => setToastMsg(null), 3500);
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || 'Không thể cập nhật trạng thái đơn hàng');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const filteredOrders = orders.filter(o => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      o.id.toString().includes(q) ||
      (o.customerName && o.customerName.toLowerCase().includes(q)) ||
      (o.customerPhone && o.customerPhone.includes(q)) ||
      (o.shippingAddress && o.shippingAddress.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Đơn hàng</h1>
          <p className="text-sm text-gray-500 mt-1">Tổng cộng {totalElements} đơn hàng trong hệ thống</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchOrders}
            disabled={loading}
            className="p-2.5 text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
            title="Làm mới"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Toast */}
      {toastMsg && (
        <div className="p-4 rounded-xl text-sm bg-green-50 text-green-700 border border-green-200 flex items-center justify-between animate-in fade-in">
          <span>✓ {toastMsg}</span>
          <button onClick={() => setToastMsg(null)}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo mã đơn, khách hàng, SĐT..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {['ALL', 'PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((st) => (
            <button
              key={st}
              onClick={() => { setStatusFilter(st); setPage(0); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === st
                  ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md shadow-rose-200'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {st === 'ALL' ? 'Tất cả' : statusMap[normalizeOrderStatus(st)]?.label || st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50/80">
              <tr>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Mã đơn</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Khách hàng</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Ngày đặt</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tổng tiền</th>
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
                      <span className="text-xs">Đang tải danh sách đơn hàng...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400 text-sm">
                    Không tìm thấy đơn hàng nào.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const normalizedStatus = normalizeOrderStatus(order.orderStatus);
                  const status = statusMap[normalizedStatus] || { label: order.orderStatus, className: 'bg-gray-100 text-gray-700' };
                  return (
                    <tr key={order.id} className="hover:bg-rose-50/20 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-bold text-gray-900">#{order.id}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{order.customerName || `Khách hàng #${order.customerId}`}</p>
                          <p className="text-xs text-gray-400">{order.customerPhone || 'Chưa có SĐT'}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.createdAt ? new Date(order.createdAt).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' }) : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-bold text-rose-600">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalAmount)}
                        </span>
                        <p className="text-xs text-gray-400">{order.paymentMethod || 'COD'}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${status.className}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-1.5 text-gray-500 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1 text-xs font-medium"
                          >
                            <Eye className="w-4 h-4" /> Chi tiết
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
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

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  Chi tiết Đơn hàng #{selectedOrder.id}
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Ngày đặt: {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleString('vi-VN') : 'N/A'}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6 mt-6">
              {/* Customer & Shipping Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-2xl text-sm">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">Khách hàng</p>
                  <p className="font-semibold text-gray-900 mt-1">{selectedOrder.customerName || 'N/A'}</p>
                  <p className="text-gray-600 text-xs">{selectedOrder.customerPhone || 'Chưa có SĐT'}</p>
                  <p className="text-gray-600 text-xs">{selectedOrder.customerEmail || ''}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">Địa chỉ giao hàng</p>
                  <p className="font-medium text-gray-800 mt-1">{selectedOrder.shippingAddress || 'N/A'}</p>
                  {selectedOrder.notes && (
                    <p className="text-xs text-gray-500 mt-1">Ghi chú: {selectedOrder.notes}</p>
                  )}
                </div>
              </div>

              {/* Items List */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-3">Sản phẩm trong đơn ({selectedOrder.items?.length || 0})</h3>
                <div className="divide-y divide-gray-100 border border-gray-100 rounded-2xl overflow-hidden">
                  {selectedOrder.items?.map((item) => (
                    <div key={item.id} className="p-3.5 flex items-center justify-between bg-white hover:bg-gray-50/50">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.imageUrl || '/images/placeholder.jpg'}
                          alt={item.productName}
                          className="w-12 h-12 rounded-xl object-cover border border-gray-100 flex-shrink-0"
                          onError={(e: any) => { e.target.src = '/images/placeholder.jpg'; }}
                        />
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{item.productName}</p>
                          <p className="text-xs text-gray-400">Số lượng: {item.quantity} {item.variantName ? `• ${item.variantName}` : ''}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-rose-600">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.subtotal || item.unitPrice * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial summary */}
              <div className="bg-rose-50/50 p-4 rounded-2xl border border-rose-100 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Tạm tính</span>
                  <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedOrder.subtotal || selectedOrder.totalAmount - (selectedOrder.shippingFee || 35000))}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Phí vận chuyển</span>
                  <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedOrder.shippingFee || 35000)}</span>
                </div>
                <div className="flex justify-between font-bold text-base text-gray-900 border-t border-rose-100 pt-2">
                  <span>Tổng tiền</span>
                  <span className="text-rose-600">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedOrder.totalAmount)}</span>
                </div>
              </div>

              {/* Status Update Action Bar */}
              <div className="pt-4 border-t border-gray-100">
                <p className="text-xs font-bold text-gray-700 uppercase mb-3">Cập nhật trạng thái đơn hàng</p>
                <div className="flex flex-wrap gap-2">
                  <button
                   disabled={updatingStatus || normalizeOrderStatus(selectedOrder.orderStatus) === 'CONFIRMED'}
                    onClick={() => handleUpdateStatus(selectedOrder.id, 'CONFIRMED')}
                    className="px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-xl text-xs font-bold disabled:opacity-50 transition-colors"
                  >
                    ✓ Xác nhận đơn
                  </button>
                  <button
                    disabled={updatingStatus || normalizeOrderStatus(selectedOrder.orderStatus) === 'SHIPPED'}
                    onClick={() => handleUpdateStatus(selectedOrder.id, 'SHIPPED')}
                    className="px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 rounded-xl text-xs font-bold disabled:opacity-50 transition-colors"
                  >
                    🚚 Đang giao hàng
                  </button>
                  <button
                    disabled={updatingStatus || normalizeOrderStatus(selectedOrder.orderStatus) === 'DELIVERED'}
                    onClick={() => handleUpdateStatus(selectedOrder.id, 'DELIVERED')}
                    className="px-4 py-2 bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 rounded-xl text-xs font-bold disabled:opacity-50 transition-colors"
                  >
                    🌸 Giao thành công
                  </button>
                  <button
                    disabled={updatingStatus || normalizeOrderStatus(selectedOrder.orderStatus) === 'CANCELLED'}
                    onClick={() => handleUpdateStatus(selectedOrder.id, 'CANCELLED')}
                    className="px-4 py-2 bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 rounded-xl text-xs font-bold disabled:opacity-50 transition-colors"
                  >
                    ✕ Hủy đơn hàng
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

