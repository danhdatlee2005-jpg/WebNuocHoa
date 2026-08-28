import Link from 'next/link';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  Tags,
  Percent,
  MessageSquare,
  Truck
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex-shrink-0 hidden md:block">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <span className="text-white font-bold text-xl tracking-tighter">LA PERFUM</span>
        </div>
        <div className="p-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">Quản lý cửa hàng</p>
          <nav className="space-y-1">
            <Link href="/admin" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg hover:bg-slate-800 hover:text-white">
              <LayoutDashboard className="h-5 w-5" /> Tổng quan
            </Link>
            <Link href="/admin/categories" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg hover:bg-slate-800 hover:text-white">
              <Tags className="h-5 w-5" /> Danh mục
            </Link>
            <Link href="/admin/products" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg hover:bg-slate-800 hover:text-white">
              <Package className="h-5 w-5" /> Sản phẩm
            </Link>
            <Link href="/admin/inventory" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg hover:bg-slate-800 hover:text-white">
              <Package className="h-5 w-5" /> Kho hàng
            </Link>
            <Link href="/admin/orders" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg hover:bg-slate-800 hover:text-white">
              <ShoppingCart className="h-5 w-5" /> Đơn hàng
            </Link>
            <Link href="/admin/shipping" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg hover:bg-slate-800 hover:text-white">
              <Truck className="h-5 w-5" /> Giao hàng
            </Link>
            <Link href="/admin/users" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg hover:bg-slate-800 hover:text-white">
              <Users className="h-5 w-5" /> Khách hàng
            </Link>
            <Link href="/admin/reviews" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg hover:bg-slate-800 hover:text-white">
              <MessageSquare className="h-5 w-5" /> Đánh giá
            </Link>
            <Link href="/admin/promotions" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg hover:bg-slate-800 hover:text-white">
              <Percent className="h-5 w-5" /> Khuyến mãi
            </Link>
          </nav>

          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-8 mb-4 px-2">Hệ thống</p>
          <nav className="space-y-1">
            <Link href="/admin/settings" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg hover:bg-slate-800 hover:text-white">
              <Settings className="h-5 w-5" /> Cài đặt chung
            </Link>
            <Link href="/" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-400 hover:text-white mt-4">
              Về cửa hàng
            </Link>
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 flex-shrink-0">
          <h2 className="text-lg font-medium text-gray-800">Admin Dashboard</h2>
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 rounded-full bg-slate-900 flex items-center justify-center text-white text-sm font-medium">A</div>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
