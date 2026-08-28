import Navbar from '@/components/layout/Navbar';
import Link from 'next/link';

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-rose-50/10 to-white">
      <Navbar />

      <main className="flex-1">
        {children}
      </main>

      <footer className="bg-gradient-to-b from-white to-rose-50 border-t border-rose-100 mt-12">
        <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <p className="text-xl font-bold mb-3 bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">🌸 LA PERFUM</p>
              <p className="text-sm text-gray-500">Chuyên phân phối các dòng nước hoa Niche & Designer cao cấp chính hãng toàn cầu.</p>
              <div className="flex gap-3 mt-4">
                <span className="text-xs bg-rose-100 text-rose-500 px-2 py-1 rounded-full font-medium">✓ Chính hãng 100%</span>
                <span className="text-xs bg-rose-100 text-rose-500 px-2 py-1 rounded-full font-medium">✓ Giao toàn quốc</span>
              </div>
            </div>
            <div>
              <p className="font-semibold text-gray-800 mb-3">Hỗ trợ khách hàng</p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><a href="#" className="hover:text-rose-500 transition-colors">Chính sách đổi trả</a></li>
                <li><a href="#" className="hover:text-rose-500 transition-colors">Hướng dẫn mua hàng</a></li>
                <li><a href="#" className="hover:text-rose-500 transition-colors">Liên hệ: 0912 345 678</a></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-gray-800 mb-3">Tài khoản</p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><Link href="/login" className="hover:text-rose-500 transition-colors">Đăng nhập</Link></li>
                <li><Link href="/register" className="hover:text-rose-500 transition-colors">Tạo tài khoản</Link></li>
                <li><Link href="/profile" className="hover:text-rose-500 transition-colors">Đơn hàng của tôi</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-rose-100 pt-6 text-center text-sm text-gray-400">
            © 2026 Luxury Scent · Powered by Spring Boot Microservices + Kong Gateway 🌸
          </div>
        </div>
      </footer>
    </div>
  );
}
