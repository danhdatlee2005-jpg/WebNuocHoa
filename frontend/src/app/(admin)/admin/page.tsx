"use client";

import { useEffect, useState, useCallback } from 'react';
import { apiClient } from '@/lib/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, ShoppingCart, DollarSign, Package, Tag, AlertTriangle, RefreshCw } from 'lucide-react';

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  totalProducts: number;
  pendingOrders: number;
  lowStockItems: number;
  activeCoupons: number;
  recentOrders: Array<{
    id: number;
    customerName?: string;
    totalAmount: number;
    orderStatus: string;
    createdAt: string;
  }>;
}

const normalizeOrderStatus = (status?: string) => {
  const value = String(status || '').trim();
  if (!value) return 'PENDING';
  if (value === 'SHIPPING' || value === 'IN_TRANSIT') return 'SHIPPED';
  return value;
};

const statusLabels: Record<string, string> = {
  PENDING: 'Chờ xác nhận',
  CONFIRMED: 'Đã xác nhận',
  SHIPPED: 'Đang giao',
  DELIVERED: 'Đã giao',
  CANCELLED: 'Đã hủy',
  PAYMENT_FAILED: 'Thanh toán thất bại',
  EXPIRED: 'Hết hạn',
};

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  SHIPPED: 'bg-indigo-100 text-indigo-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
  PAYMENT_FAILED: 'bg-red-100 text-red-800',
  EXPIRED: 'bg-gray-100 text-gray-800',
};

const DEFAULT_DAYS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('admin_dashboard_cache');
        if (cached) return JSON.parse(cached);
      } catch (e) {}
    }
    return {
      totalOrders: 0,
      totalRevenue: 0,
      totalCustomers: 0,
      totalProducts: 0,
      pendingOrders: 0,
      lowStockItems: 0,
      activeCoupons: 0,
      recentOrders: [],
    };
  });

  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState<Array<{ name: string; revenue: number; orders: number }>>(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return { name: DEFAULT_DAYS[d.getDay()], revenue: 0, orders: 0 };
    });
  });

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      // Parallel fast lightweight fetching
      const [ordersRes, usersRes, productsRes, inventoryRes, couponsRes] = await Promise.allSettled([
        apiClient.get('/admin/orders?page=0&size=20'),
        apiClient.get('/admin/users?page=0&size=1'),
        apiClient.get('/admin/products?page=0&size=1'),
        apiClient.get('/admin/inventory/low-stock'),
        apiClient.get('/admin/promotions'),
      ]);

      // Parse orders
      let orders: any[] = [];
      let totalOrders = 0;
      if (ordersRes.status === 'fulfilled') {
        const d = ordersRes.value.data?.data || ordersRes.value.data;
        orders = d?.content || (Array.isArray(d) ? d : []);
        totalOrders = d?.totalElements ?? orders.length;
      }

      // Parse users total
      let totalCustomers = 0;
      if (usersRes.status === 'fulfilled') {
        const d = usersRes.value.data?.data || usersRes.value.data;
        totalCustomers = d?.totalElements ?? (Array.isArray(d?.content) ? d.content.length : 0);
      }

      // Parse products total
      let totalProducts = 0;
      if (productsRes.status === 'fulfilled') {
        const d = productsRes.value.data?.data || productsRes.value.data;
        totalProducts = d?.totalElements ?? (Array.isArray(d?.content) ? d.content.length : 0);
      }

      // Parse low stock
      let lowStockItems = 0;
      if (inventoryRes.status === 'fulfilled') {
        const d = inventoryRes.value.data?.data || inventoryRes.value.data;
        lowStockItems = Array.isArray(d) ? d.length : 0;
      }

      // Parse coupons
      let activeCoupons = 0;
      if (couponsRes.status === 'fulfilled') {
        const d = couponsRes.value.data?.data || couponsRes.value.data;
        const coupons = Array.isArray(d) ? d : (d?.content || []);
        activeCoupons = coupons.filter((c: any) => c.active !== false).length;
      }

      // Calculate stats from orders
      const totalRevenue = orders
        .filter((o: any) => normalizeOrderStatus(o.orderStatus) === 'DELIVERED')
        .reduce((sum: number, o: any) => sum + (Number(o.totalAmount) || 0), 0);

      const pendingOrders = orders.filter((o: any) => normalizeOrderStatus(o.orderStatus) === 'PENDING').length;

      // Get recent orders (last 6)
      const recentOrders = [...orders]
        .sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
        .slice(0, 6);

      const calculatedStats: DashboardStats = {
        totalOrders: totalOrders || orders.length,
        totalRevenue,
        totalCustomers,
        totalProducts,
        pendingOrders,
        lowStockItems,
        activeCoupons,
        recentOrders,
      };

      setStats(calculatedStats);
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('admin_dashboard_cache', JSON.stringify(calculatedStats));
        } catch (e) {}
      }

      // Build chart data: last 7 days
      const last7 = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return d;
      });

      const chart = last7.map((day) => {
        const dayOrders = orders.filter((o: any) => {
          if (!o.createdAt) return false;
          const orderDate = new Date(o.createdAt);
          return (
            orderDate.getDate() === day.getDate() &&
            orderDate.getMonth() === day.getMonth() &&
            orderDate.getFullYear() === day.getFullYear()
          );
        });
        const revenue = dayOrders
          .filter((o: any) => normalizeOrderStatus(o.orderStatus) !== 'CANCELLED')
          .reduce((sum: number, o: any) => sum + (Number(o.totalAmount) || 0), 0);
        return {
          name: DEFAULT_DAYS[day.getDay()],
          revenue: Math.round(revenue / 1000000), // in millions VND
          orders: dayOrders.length,
        };
      });
      setChartData(chart);

    } catch (err) {
      console.error('Lỗi tải dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const fmt = (n: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tổng quan hệ thống</h1>
          <p className="text-sm text-gray-500 mt-1">Dữ liệu thực tế từ database — cập nhật mỗi lần tải trang</p>
        </div>
        <button
          onClick={fetchDashboardData}
          disabled={loading}
          className="p-2.5 text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 shadow-sm transition-colors cursor-pointer"
          title="Tải lại dữ liệu"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Revenue */}
        <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100 transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">Doanh thu thực tế</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {fmt(stats?.totalRevenue || 0)}
              </p>
              <p className="text-xs text-gray-400 mt-1">Từ đơn đã giao thành công</p>
            </div>
            <div className="h-12 w-12 bg-green-50 rounded-2xl flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* Orders */}
        <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100 transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">Tổng đơn hàng</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats?.totalOrders || 0}
              </p>
              <p className="text-xs text-amber-600 mt-1 font-medium">
                {`${stats?.pendingOrders || 0} đơn chờ xác nhận`}
              </p>
            </div>
            <div className="h-12 w-12 bg-rose-50 rounded-2xl flex items-center justify-center">
              <ShoppingCart className="h-6 w-6 text-rose-500" />
            </div>
          </div>
        </div>

        {/* Customers */}
        <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100 transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">Khách hàng</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats?.totalCustomers || 0}
              </p>
              <p className="text-xs text-gray-400 mt-1">Tài khoản đã đăng ký</p>
            </div>
            <div className="h-12 w-12 bg-purple-50 rounded-2xl flex items-center justify-center">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100 transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">Sản phẩm</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats?.totalProducts || 0}
              </p>
              {(stats?.lowStockItems || 0) > 0 ? (
                <p className="text-xs text-amber-600 mt-1 font-medium flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> {stats?.lowStockItems} sắp hết kho
                </p>
              ) : (
                <p className="text-xs text-green-600 mt-1 font-medium">Kho hàng ổn định</p>
              )}
            </div>
            <div className="h-12 w-12 bg-blue-50 rounded-2xl flex items-center justify-center">
              <Package className="h-6 w-6 text-blue-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Chart + Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-gray-900">Doanh thu 7 ngày qua</h2>
              <p className="text-xs text-gray-400 mt-0.5">Đơn vị: triệu VND</p>
            </div>
            <span className="text-xs text-rose-500 font-semibold bg-rose-50 px-2.5 py-1 rounded-full">
              {loading ? 'Đang cập nhật...' : 'Live Data'}
            </span>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <Tooltip
                  cursor={{ fill: '#fdf2f8', radius: 8 }}
                  formatter={(value?: number | string | ReadonlyArray<number | string>) => [`${Array.isArray(value) ? value[0] : value ?? 0} triệu VND`, 'Doanh thu'] as [string, string]}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #fecdd3', fontSize: '12px' }}
                />
                <Bar dataKey="revenue" fill="url(#roseGrad)" radius={[6, 6, 0, 0]} />
                <defs>
                  <linearGradient id="roseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f43f5e" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 flex flex-col gap-4">
          <h2 className="text-base font-bold text-gray-900">Thống kê nhanh</h2>

          <div className="flex items-center justify-between p-3.5 bg-rose-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 bg-rose-100 rounded-xl flex items-center justify-center">
                <ShoppingCart className="h-4 w-4 text-rose-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Chờ xác nhận</p>
                <p className="font-bold text-gray-900">{stats?.pendingOrders || 0} đơn</p>
              </div>
            </div>
            <span className="text-rose-500 text-xs font-semibold">⚠️ Cần xử lý</span>
          </div>

          <div className="flex items-center justify-between p-3.5 bg-amber-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 bg-amber-100 rounded-xl flex items-center justify-center">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Sắp hết kho</p>
                <p className="font-bold text-gray-900">{stats?.lowStockItems || 0} sản phẩm</p>
              </div>
            </div>
            <span className="text-amber-600 text-xs font-semibold">Nhập thêm</span>
          </div>

          <div className="flex items-center justify-between p-3.5 bg-green-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 bg-green-100 rounded-xl flex items-center justify-center">
                <Tag className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Mã giảm giá</p>
                <p className="font-bold text-gray-900">{stats?.activeCoupons || 0} đang kích hoạt</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900">Đơn hàng gần đây</h2>
          <a href="/admin/orders" className="text-xs text-rose-500 hover:text-rose-600 font-semibold">
            Xem tất cả →
          </a>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50/80">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Mã đơn</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Khách hàng</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Ngày đặt</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Tổng tiền</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {(stats?.recentOrders || []).length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400 text-sm">{loading ? 'Đang tải...' : 'Chưa có đơn hàng nào.'}</td></tr>
            ) : (
              (stats?.recentOrders || []).map((order) => (
                <tr key={order.id} className="hover:bg-rose-50/20 transition-colors">
                  <td className="px-6 py-3.5 font-bold text-gray-900">#{order.id}</td>
                  <td className="px-6 py-3.5 text-gray-600">{order.customerName || `Khách hàng`}</td>
                  <td className="px-6 py-3.5 text-gray-500 text-xs">
                    {order.createdAt ? new Date(order.createdAt).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' }) : 'N/A'}
                  </td>
                  <td className="px-6 py-3.5 font-semibold text-rose-600">
                    {fmt(order.totalAmount)}
                  </td>
                  <td className="px-6 py-3.5">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusColors[order.orderStatus] || 'bg-gray-100 text-gray-700'}`}>
                      {statusLabels[order.orderStatus] || order.orderStatus}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
