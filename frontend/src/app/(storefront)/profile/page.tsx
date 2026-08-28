"use client";

import { User, MapPin, Package, Bell, Edit3, Save, X, Plus, Trash2, Check, Star } from 'lucide-react';
import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';

const tabs = [
  { id: 'info', label: 'Thông tin cá nhân', icon: User },
  { id: 'orders', label: 'Đơn hàng của tôi', icon: Package },
  { id: 'address', label: 'Địa chỉ giao hàng', icon: MapPin },
  { id: 'notifications', label: 'Thông báo', icon: Bell },
];

const normalizeOrderStatus = (status?: string) => {
  const value = String(status || '').trim();
  if (!value) return 'PENDING';
  if (value === 'SHIPPING' || value === 'IN_TRANSIT') return 'SHIPPED';
  return value;
};

const statusMap: Record<string, { label: string; className: string }> = {
  PENDING:        { label: 'Chờ xác nhận', className: 'bg-yellow-100 text-yellow-700' },
  CONFIRMED:      { label: 'Đã xác nhận',  className: 'bg-blue-100 text-blue-700' },
  PROCESSING:     { label: 'Đang xử lý',   className: 'bg-blue-100 text-blue-700' },
  SHIPPED:        { label: 'Đang giao',    className: 'bg-indigo-100 text-indigo-700' },
  DELIVERED:      { label: 'Đã giao',      className: 'bg-green-100 text-green-700' },
  CANCELLED:      { label: 'Đã hủy',       className: 'bg-red-100 text-red-700' },
  PAYMENT_FAILED: { label: 'Thanh toán thất bại', className: 'bg-red-100 text-red-700' },
  EXPIRED:        { label: 'Hết hạn',      className: 'bg-gray-100 text-gray-700' },
};

interface Address {
  id: string;
  fullName: string;
  phone: string;
  street: string;
  ward: string;
  district: string;
  city: string;
  isDefault: boolean;
}

interface FormData {
  fullName: string;
  phone: string;
  street: string;
  ward: string;
  district: string;
  city: string;
}

const getStorageKey = () => {
  if (typeof window === 'undefined') return 'user_addresses';
  const userId = localStorage.getItem('userId') || 'guest';
  return `user_addresses_${userId}`;
};

function loadAddresses(fullName: string): Address[] {
  if (typeof window === 'undefined') return [];
  const key = getStorageKey();
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as Address[];
  } catch (e) {}
  const seed: Address = {
    id: '1',
    fullName: fullName || 'Đặng Nguyên Dương',
    phone: '0912 345 678',
    street: '123 Đường Nguyễn Huệ',
    ward: 'Phường Bến Nghé',
    district: 'Quận 1',
    city: 'TP. Hồ Chí Minh',
    isDefault: true,
  };
  localStorage.setItem(key, JSON.stringify([seed]));
  return [seed];
}

function saveAddresses(addresses: Address[]) {
  if (typeof window !== 'undefined') {
    const key = getStorageKey();
    const userId = localStorage.getItem('userId') || 'guest';
    localStorage.setItem(key, JSON.stringify(addresses));
    const def = addresses.find(a => a.isDefault) || addresses[0];
    if (def) {
      localStorage.setItem(`address_${userId}`, [def.street, def.ward, def.district, def.city].filter(Boolean).join(', '));
      if (def.phone) localStorage.setItem(`phone_${userId}`, def.phone);
    }
  }
}

const blankForm = (): FormData => ({
  fullName: '',
  phone: '',
  street: '',
  ward: '',
  district: '',
  city: '',
});

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('info');
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [fullName, setFullName] = useState('Người dùng');
  const [email, setEmail] = useState('');
  const [editName, setEditName] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(blankForm());
  const [addrSaving, setAddrSaving] = useState(false);
  const [addrMsg, setAddrMsg] = useState('');
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewProduct, setReviewProduct] = useState<any>(null);
  const [reviewOrder, setReviewOrder] = useState<any>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewing, setReviewing] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const fn = localStorage.getItem('fullName') || 'Người dùng';
      const em = localStorage.getItem('email') || '';
      setFullName(fn);
      setEmail(em);
      setEditName(fn);
      setAddresses(loadAddresses(fn));
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'orders') fetchOrders();
  }, [activeTab]);

  const fetchOrders = async () => {
    if (typeof window === 'undefined' || !localStorage.getItem('token')) {
      setOrders([]);
      setLoadingOrders(false);
      return;
    }
    setLoadingOrders(true);
    try {
      const res = await apiClient.get('/orders?size=20');
      const data = res.data.data;
      setOrders(data?.content || data || []);
    } catch (err) {
      console.error('Lỗi lấy đơn hàng:', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleSaveInfo = () => {
    setSaving(true);
    localStorage.setItem('fullName', editName);
    setFullName(editName);
    setTimeout(() => {
      setSaving(false);
      setSaveMsg('Đã lưu thành công!');
      setTimeout(() => setSaveMsg(''), 3000);
    }, 500);
  };

  const submitReview = async () => {
    if (!reviewProduct || !reviewOrder) return;
    setReviewing(true);
    try {
      // POST /api/v1/reviews?userId={id}&productId={id}&orderId={id}&rating={rating} body={comment}
      // Note: We need userId. If not in localStorage, we can get it from token or assume a default. 
      // Wait, let's just pass 1 for now if not available, or decode token.
      // But let's check if the backend requires actual userId matching the order.
      // Actually, we can get userId from the API or we can just send the review. 
      const res = await apiClient.post(`/reviews?userId=${reviewOrder.customerId}&productId=${reviewProduct.productId}&orderId=${reviewOrder.id}&rating=${rating}`, comment, {
        headers: { 'Content-Type': 'text/plain' }
      });
      alert('Cảm ơn bạn đã đánh giá sản phẩm!');
      setReviewModalOpen(false);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi gửi đánh giá');
    } finally {
      setReviewing(false);
    }
  };

  const cancelOrder = async (orderId: number) => {
    if (!confirm('Bạn có chắc muốn hủy đơn hàng này?')) return;
    try {
      await apiClient.post(`/orders/${orderId}/cancel`, { reason: 'Khách hủy đơn' });
      fetchOrders();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Không thể hủy đơn hàng này');
    }
  };

  const startEdit = (addr: Address) => {
    setEditingId(addr.id);
    setForm({
      fullName: addr.fullName,
      phone: addr.phone,
      street: addr.street,
      ward: addr.ward,
      district: addr.district,
      city: addr.city,
    });
    setAddrMsg('');
  };

  const startNew = () => {
    setEditingId('new');
    setForm({ ...blankForm(), fullName });
    setAddrMsg('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(blankForm());
    setAddrMsg('');
  };

  const saveAddress = () => {
    if (!form.street.trim() || !form.city.trim()) {
      setAddrMsg('Vui lòng nhập đầy đủ số nhà, tên đường và tỉnh/thành phố.');
      return;
    }
    setAddrSaving(true);
    setTimeout(() => {
      let updated: Address[];
      if (editingId === 'new') {
        const newAddr: Address = {
          id: Date.now().toString(),
          ...form,
          fullName: form.fullName.trim() || fullName,
          isDefault: addresses.length === 0,
        };
        updated = [...addresses, newAddr];
      } else {
        updated = addresses.map(a =>
          a.id === editingId
            ? { ...a, ...form, fullName: form.fullName.trim() || fullName }
            : a
        );
      }
      saveAddresses(updated);
      setAddresses(updated);
      setEditingId(null);
      setForm(blankForm());
      setAddrSaving(false);
      setAddrMsg('Đã lưu địa chỉ thành công!');
      setTimeout(() => setAddrMsg(''), 3000);
    }, 300);
  };

  const deleteAddress = (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa địa chỉ này?')) return;
    const updated = addresses.filter(a => a.id !== id);
    if (updated.length > 0 && !updated.some(a => a.isDefault)) {
      updated[0].isDefault = true;
    }
    saveAddresses(updated);
    setAddresses(updated);
  };

  const setDefault = (id: string) => {
    const updated = addresses.map(a => ({ ...a, isDefault: a.id === id }));
    saveAddresses(updated);
    setAddresses(updated);
    setAddrMsg('Đã đặt làm địa chỉ mặc định!');
    setTimeout(() => setAddrMsg(''), 3000);
  };

  const formattedAddr = (a: Address) =>
    [a.street, a.ward, a.district, a.city].filter(Boolean).join(', ');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-extrabold mb-8 bg-gradient-to-r from-rose-500 to-pink-400 bg-clip-text text-transparent">
        Tài khoản của tôi
      </h1>

      <div className="lg:grid lg:grid-cols-12 lg:gap-x-8">
        {/* Sidebar */}
        <aside className="lg:col-span-3 mb-8 lg:mb-0">
          <div className="bg-white rounded-3xl shadow-sm shadow-rose-100 border border-rose-50 overflow-hidden">
            <div className="p-6 text-center border-b border-rose-50 bg-gradient-to-b from-rose-50/50 to-white">
              <div className="h-20 w-20 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full mx-auto flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-rose-200">
                {fullName.charAt(0).toUpperCase()}
              </div>
              <h2 className="mt-4 font-bold text-gray-900">{fullName}</h2>
              <p className="text-sm text-gray-400">{email}</p>
              <span className="inline-block mt-2 text-xs bg-rose-100 text-rose-500 px-3 py-1 rounded-full font-medium">
                ✓ Khách hàng
              </span>
            </div>
            <nav className="p-3">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md shadow-rose-200'
                        : 'text-gray-500 hover:bg-rose-50 hover:text-rose-500'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Content */}
        <main className="lg:col-span-9">
          <div className="bg-white rounded-3xl shadow-sm shadow-rose-100 border border-rose-50 p-6">

            {/* Tab: Thông tin cá nhân */}
            {activeTab === 'info' && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <User className="w-5 h-5 text-rose-400" /> Thông tin cá nhân
                </h2>
                {saveMsg && (
                  <div className="mb-4 p-3 bg-green-50 text-green-600 text-sm rounded-xl border border-green-100">✓ {saveMsg}</div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-2">Họ và tên</label>
                    <input
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      className="w-full border border-rose-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-rose-300 focus:border-rose-300 bg-rose-50/30 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-2">Email</label>
                    <input
                      value={email}
                      disabled
                      className="w-full border border-gray-100 rounded-xl px-4 py-3 text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
                    />
                  </div>
                </div>
                <button
                  onClick={handleSaveInfo}
                  disabled={saving}
                  className="mt-6 bg-gradient-to-r from-rose-500 to-pink-500 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:from-rose-600 hover:to-pink-600 transition-all shadow-md shadow-rose-200 flex items-center gap-2 disabled:opacity-70 cursor-pointer"
                >
                  <Save className="w-4 h-4" /> {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
              </div>
            )}

            {/* Tab: Đơn hàng */}
            {activeTab === 'orders' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Package className="w-5 h-5 text-rose-400" /> Đơn hàng của tôi
                  </h2>
                  <button onClick={fetchOrders} className="text-sm text-rose-400 hover:text-rose-600 transition-colors cursor-pointer">↻ Làm mới</button>
                </div>
                {loadingOrders ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-rose-400"></div>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-16">
                    <Package className="w-16 h-16 mx-auto mb-4 text-rose-200" />
                    <p className="text-gray-400">Bạn chưa có đơn hàng nào.</p>
                    <a href="/products" className="text-rose-500 text-sm hover:underline mt-2 block">Khám phá sản phẩm →</a>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order: any) => {
                      const normalizedStatus = normalizeOrderStatus(order.orderStatus);
                      const status = statusMap[normalizedStatus] || { label: order.orderStatus, className: 'bg-gray-100 text-gray-700' };
                      return (
                        <div key={order.id} className="border border-rose-50 rounded-2xl p-5 hover:border-rose-100 transition-all">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <p className="font-bold text-gray-900">Đơn #{order.id}</p>
                              <p className="text-sm text-gray-400 mt-0.5">
                                {new Date(order.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-rose-500 text-lg">
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalAmount)}
                              </p>
                              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${status.className}`}>
                                {status.label}
                              </span>
                            </div>
                          </div>
                          {order.items && order.items.length > 0 && (
                            <div className="border-t border-rose-50 pt-3 space-y-2">
                              {order.items.map((item: any) => (
                                <div key={item.id} className="flex items-center justify-between">
                                  <p className="text-sm text-gray-500 flex items-center gap-2">
                                    <span className="text-rose-300">•</span> {item.productName}
                                    <span className="text-gray-300">×{item.quantity}</span>
                                  </p>
                                  {normalizedStatus === 'DELIVERED' && (
                                    <button
                                      onClick={() => {
                                        setReviewOrder(order);
                                        setReviewProduct(item);
                                        setRating(5);
                                        setComment('');
                                        setReviewModalOpen(true);
                                      }}
                                      className="text-xs text-rose-500 hover:text-rose-600 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer"
                                    >
                                      Đánh giá
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                          {(normalizeOrderStatus(order.orderStatus) === 'PENDING' || normalizeOrderStatus(order.orderStatus) === 'CONFIRMED') && (
                            <button
                              onClick={() => cancelOrder(order.id)}
                              className="mt-3 text-xs text-rose-400 hover:text-rose-600 font-medium border border-rose-200 px-3 py-1 rounded-lg hover:bg-rose-50 transition-all cursor-pointer"
                            >
                              Hủy đơn hàng
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Tab: Địa chỉ */}
            {activeTab === 'address' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-rose-500" /> Địa chỉ giao hàng
                    </h2>
                    <p className="text-xs text-gray-400 mt-0.5">Quản lý các địa chỉ nhận hàng của bạn</p>
                  </div>
                </div>

                {addrMsg && (
                  <div className={`mb-4 p-3 text-sm rounded-xl border ${addrMsg.includes('Vui lòng') ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-600 border-green-100'}`}>
                    {addrMsg.includes('Vui lòng') ? '⚠️ ' : '✓ '}{addrMsg}
                  </div>
                )}

                {/* Address list */}
                <div className="space-y-4 mb-5">
                  {addresses.map(addr => (
                    <div key={addr.id} className={`rounded-2xl p-5 border-2 transition-all ${addr.isDefault ? 'border-rose-300 bg-rose-50/40' : 'border-gray-100 bg-white'}`}>
                      {editingId === addr.id ? (
                        /* Inline Edit Form */
                        <AddressForm
                          form={form}
                          onChange={setForm}
                          onSave={saveAddress}
                          onCancel={cancelEdit}
                          saving={addrSaving}
                        />
                      ) : (
                        /* Display View */
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-bold text-gray-900">{addr.fullName}</p>
                              {addr.phone && <span className="text-sm text-gray-500">| {addr.phone}</span>}
                              {addr.isDefault && (
                                <span className="text-xs bg-rose-500 text-white px-2 py-0.5 rounded-full font-medium">Mặc định</span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">{formattedAddr(addr)}</p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                            {!addr.isDefault && (
                              <button
                                onClick={() => setDefault(addr.id)}
                                title="Đặt làm mặc định"
                                className="flex items-center gap-1 text-xs text-gray-500 hover:text-green-600 hover:bg-green-50 px-2.5 py-1.5 rounded-lg border border-gray-200 transition-all cursor-pointer"
                              >
                                <Check className="w-3.5 h-3.5 text-green-600" /> Đặt mặc định
                              </button>
                            )}
                            <button
                              onClick={() => startEdit(addr)}
                              className="flex items-center gap-1 text-sm text-rose-500 hover:text-rose-700 hover:bg-rose-50 px-2.5 py-1.5 rounded-lg transition-all font-medium cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" /> Sửa
                            </button>
                            {!addr.isDefault && (
                              <button
                                onClick={() => deleteAddress(addr.id)}
                                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                                title="Xóa địa chỉ"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add new address */}
                {editingId === 'new' ? (
                  <div className="border-2 border-rose-200 rounded-2xl p-5 bg-rose-50/20">
                    <p className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <Plus className="w-4 h-4 text-rose-500" /> Thêm địa chỉ nhận hàng mới
                    </p>
                    <AddressForm
                      form={form}
                      onChange={setForm}
                      onSave={saveAddress}
                      onCancel={cancelEdit}
                      saving={addrSaving}
                    />
                  </div>
                ) : (
                  <button
                    onClick={startNew}
                    className="w-full border-2 border-dashed border-rose-200 rounded-2xl py-4 text-rose-500 hover:border-rose-400 hover:text-rose-600 transition-colors text-sm font-medium hover:bg-rose-50 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> + Thêm địa chỉ mới
                  </button>
                )}
              </div>
            )}

            {/* Tab: Thông báo */}
            {activeTab === 'notifications' && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-rose-400" /> Thông báo
                </h2>
                <div className="space-y-3">
                  {[
                    { title: 'Chào mừng bạn đến với Luxury Scent! 🌸', time: 'Vừa xong', unread: true },
                    { title: 'Xác nhận đơn hàng sẽ được gửi qua email sau khi thanh toán.', time: '1 phút trước', unread: false },
                  ].map((n, i) => (
                    <div key={i} className={`flex gap-4 p-4 rounded-2xl ${n.unread ? 'bg-rose-50 border border-rose-100' : 'bg-gray-50'}`}>
                      <div className={`h-2.5 w-2.5 rounded-full mt-1.5 flex-shrink-0 ${n.unread ? 'bg-rose-400' : 'bg-gray-300'}`} />
                      <div>
                        <p className={`text-sm ${n.unread ? 'font-semibold text-gray-900' : 'text-gray-500'}`}>{n.title}</p>
                        <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </main>
      </div>

      {reviewModalOpen && reviewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-6 border-b border-rose-50">
              <h3 className="text-xl font-bold text-gray-900">Đánh giá sản phẩm</h3>
              <button onClick={() => setReviewModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Bạn cảm thấy sản phẩm này như thế nào?</p>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button 
                      key={star} 
                      onClick={() => setRating(star)}
                      className="transition-transform hover:scale-110 focus:outline-none"
                    >
                      <Star className={`w-8 h-8 ${star <= rating ? 'fill-rose-400 text-rose-400' : 'text-gray-200'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Chia sẻ thêm về trải nghiệm của bạn</label>
                <textarea
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Hương thơm, độ bám tỏa, bao bì..."
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-rose-300 focus:border-rose-300 outline-none resize-none"
                ></textarea>
              </div>

              <button
                onClick={submitReview}
                disabled={reviewing}
                className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold py-3.5 rounded-xl hover:from-rose-600 hover:to-pink-600 transition-all shadow-md shadow-rose-200 disabled:opacity-70 cursor-pointer flex items-center justify-center gap-2"
              >
                {reviewing ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  'Gửi đánh giá'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AddressForm({
  form,
  onChange,
  onSave,
  onCancel,
  saving,
}: {
  form: FormData;
  onChange: (f: FormData) => void;
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-xs font-semibold text-gray-600 mb-1">Họ và tên người nhận *</label>
          <input
            value={form.fullName}
            onChange={e => onChange({ ...form, fullName: e.target.value })}
            placeholder="Ví dụ: Đặng Nguyên Dương"
            className="w-full border border-rose-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-rose-300 focus:border-rose-400 bg-white transition-all outline-none"
          />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-xs font-semibold text-gray-600 mb-1">Số điện thoại *</label>
          <input
            value={form.phone}
            onChange={e => onChange({ ...form, phone: e.target.value })}
            placeholder="Ví dụ: 0912 345 678"
            className="w-full border border-rose-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-rose-300 focus:border-rose-400 bg-white transition-all outline-none"
          />
        </div>
        <div className="col-span-2">
          <label className="block text-xs font-semibold text-gray-600 mb-1">Số nhà, tên đường *</label>
          <input
            value={form.street}
            onChange={e => onChange({ ...form, street: e.target.value })}
            placeholder="Ví dụ: 123 Đường Nguyễn Huệ"
            className="w-full border border-rose-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-rose-300 focus:border-rose-400 bg-white transition-all outline-none"
          />
        </div>
        <div className="col-span-1">
          <label className="block text-xs font-semibold text-gray-600 mb-1">Phường / Xã</label>
          <input
            value={form.ward}
            onChange={e => onChange({ ...form, ward: e.target.value })}
            placeholder="Ví dụ: Phường Bến Nghé"
            className="w-full border border-rose-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-rose-300 focus:border-rose-400 bg-white transition-all outline-none"
          />
        </div>
        <div className="col-span-1">
          <label className="block text-xs font-semibold text-gray-600 mb-1">Quận / Huyện</label>
          <input
            value={form.district}
            onChange={e => onChange({ ...form, district: e.target.value })}
            placeholder="Ví dụ: Quận 1"
            className="w-full border border-rose-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-rose-300 focus:border-rose-400 bg-white transition-all outline-none"
          />
        </div>
        <div className="col-span-2">
          <label className="block text-xs font-semibold text-gray-600 mb-1">Tỉnh / Thành phố *</label>
          <input
            value={form.city}
            onChange={e => onChange({ ...form, city: e.target.value })}
            placeholder="Ví dụ: TP. Hồ Chí Minh"
            className="w-full border border-rose-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-rose-300 focus:border-rose-400 bg-white transition-all outline-none"
          />
        </div>
      </div>

      <div className="flex gap-3 mt-4 pt-2">
        <button
          onClick={onSave}
          disabled={saving}
          className="flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:from-rose-600 hover:to-pink-600 transition-all shadow-sm shadow-rose-200 disabled:opacity-70 cursor-pointer"
        >
          <Save className="w-4 h-4" /> {saving ? 'Đang lưu...' : 'Lưu địa chỉ'}
        </button>
        <button
          onClick={onCancel}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 border border-gray-200 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-all cursor-pointer"
        >
          <X className="w-4 h-4" /> Hủy
        </button>
      </div>
    </div>
  );
}
