"use client";

import { Bell, Package, Settings, Shield, Globe, Palette } from 'lucide-react';
import { useState } from 'react';

export default function AdminSettingsPage() {
  const [emailNotif, setEmailNotif] = useState(true);
  const [orderAlert, setOrderAlert] = useState(true);
  const [lowStock, setLowStock] = useState(true);

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900">Cài đặt hệ thống</h1>

      {/* Store Info */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Globe className="h-5 w-5 text-gray-500" /> Thông tin cửa hàng
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên cửa hàng</label>
            <input defaultValue="La Perfum" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-1 focus:ring-black focus:border-black" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email liên hệ</label>
            <input defaultValue="contact@laperfum.vn" type="email" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-1 focus:ring-black focus:border-black" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ cửa hàng</label>
            <input defaultValue="123 Nguyễn Huệ, Quận 1, TP.HCM" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-1 focus:ring-black focus:border-black" />
          </div>
        </div>
        <button className="mt-4 bg-black text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-900">Lưu thay đổi</button>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Bell className="h-5 w-5 text-gray-500" /> Thông báo
        </h2>
        <div className="space-y-4">
          {[
            { label: 'Thông báo email', desc: 'Nhận email khi có đơn hàng mới', state: emailNotif, setter: setEmailNotif },
            { label: 'Cảnh báo đơn hàng', desc: 'Cảnh báo khi đơn cần xử lý gấp', state: orderAlert, setter: setOrderAlert },
            { label: 'Hàng sắp hết', desc: 'Thông báo khi tồn kho dưới ngưỡng', state: lowStock, setter: setLowStock },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-gray-900">{item.label}</p>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
              <button
                onClick={() => item.setter(!item.state)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${item.state ? 'bg-black' : 'bg-gray-200'}`}
              >
                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${item.state ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* API Services Status */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5 text-gray-500" /> Trạng thái Microservices
        </h2>
        <div className="space-y-3">
          {[
            { name: 'Auth Service', port: '8081', status: 'RUNNING' },
            { name: 'Product Service', port: '8083', status: 'RUNNING' },
            { name: 'Order Service', port: '8086', status: 'RUNNING' },
            { name: 'Payment Service', port: '8088', status: 'RUNNING' },
            { name: 'Kong Gateway', port: '8000', status: 'RUNNING' },
            { name: 'RabbitMQ Broker', port: '5672', status: 'RUNNING' },
          ].map(svc => (
            <div key={svc.name} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <div className="flex items-center gap-3">
                <div className="h-2.5 w-2.5 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-gray-800">{svc.name}</span>
                <span className="text-xs text-gray-400">:{svc.port}</span>
              </div>
              <span className="text-xs font-semibold text-green-700 bg-green-50 px-2.5 py-1 rounded-full">{svc.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
