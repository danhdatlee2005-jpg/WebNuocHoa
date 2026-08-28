"use client";

import { useEffect, useState, useCallback, useRef } from 'react';
import { apiClient } from '@/lib/api';
import Link from 'next/link';
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [gender, setGender] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Debounce search input (300ms)
  const handleSearchChange = (val: string) => {
    setSearch(val);
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearch(val);
      setCurrentPage(1);
    }, 300);
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = {
        page: currentPage - 1,
        size: itemsPerPage,
      };

      if (debouncedSearch.trim()) {
        params.keyword = debouncedSearch.trim();
      }
      if (category !== 'all') {
        params.category = category;
      }
      if (gender !== 'all') {
        params.gender = gender;
      }
      if (priceRange === 'under3m') {
        params.maxPrice = 3000000;
      } else if (priceRange === '3m-5m') {
        params.minPrice = 3000000;
        params.maxPrice = 5000000;
      } else if (priceRange === 'over5m') {
        params.minPrice = 5000000;
      }

      const res = await apiClient.get('/products', { params });
      const responseData = res.data?.data || res.data;

      if (responseData && responseData.content && Array.isArray(responseData.content)) {
        setProducts(responseData.content);
        setTotalPages(responseData.totalPages || 1);
        setTotalElements(responseData.totalElements || responseData.content.length);
      } else if (Array.isArray(responseData)) {
        setProducts(responseData);
        setTotalPages(1);
        setTotalElements(responseData.length);
      } else {
        setProducts([]);
        setTotalPages(1);
        setTotalElements(0);
      }
      setLoading(false);
    } catch (err) {
      console.error('Lỗi lấy dữ liệu sản phẩm:', err);
      setProducts([]);
      setTotalPages(1);
      setTotalElements(0);
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, debouncedSearch, category, gender, priceRange]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + products.length, totalElements);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent mb-1">
          Bộ sưu tập nước hoa
        </h1>
        <p className="text-gray-500 text-sm">Khám phá các mùi hương độc đáo chính hãng từ khắp nơi trên thế giới</p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col lg:flex-row gap-3 mb-8 bg-white p-4 rounded-2xl border border-rose-100 shadow-sm shadow-rose-50">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-rose-300 h-4 w-4" />
          <input
            type="text"
            placeholder="Tìm theo tên, thương hiệu..."
            className="w-full pl-10 pr-4 py-2.5 border border-rose-100 rounded-xl focus:ring-2 focus:ring-rose-300 focus:border-rose-300 text-sm transition-all bg-rose-50/30 placeholder-rose-300"
            value={search}
            onChange={e => handleSearchChange(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap lg:flex-nowrap items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-rose-400 hidden sm:block" />
          {[
            { value: category, onChange: (val: string) => { setCategory(val); setCurrentPage(1); }, options: [['all','Mọi danh mục'],['Niche','Niche'],['Designer','Designer']] },
            { value: gender, onChange: (val: string) => { setGender(val); setCurrentPage(1); }, options: [['all','Giới tính'],['MEN','Nam'],['WOMEN','Nữ'],['UNISEX','Unisex']] },
            { value: priceRange, onChange: (val: string) => { setPriceRange(val); setCurrentPage(1); }, options: [['all','Mọi mức giá'],['under3m','< 3 triệu'],['3m-5m','3 – 5 triệu'],['over5m','> 5 triệu']] },
          ].map((sel, idx) => (
            <select
              key={idx}
              value={sel.value}
              onChange={e => sel.onChange(e.target.value)}
              className="border border-rose-100 rounded-xl py-2.5 px-3 focus:ring-2 focus:ring-rose-300 focus:border-rose-300 text-sm bg-rose-50/30 text-gray-600 transition-all cursor-pointer"
            >
              {sel.options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          ))}

          {/* Items per page selector */}
          <select
            value={itemsPerPage}
            onChange={e => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
            className="border border-rose-100 rounded-xl py-2.5 px-3 focus:ring-2 focus:ring-rose-300 focus:border-rose-300 text-sm bg-rose-50/30 text-gray-600 transition-all cursor-pointer"
            title="Số sản phẩm trên mỗi trang"
          >
            <option value={8}>8 / trang</option>
            <option value={12}>12 / trang</option>
            <option value={16}>16 / trang</option>
            <option value={24}>24 / trang</option>
          </select>
        </div>
      </div>

      {/* Results header */}
      <div className="flex items-center justify-between mb-6 text-sm text-gray-500">
        <p>
          {totalElements > 0 ? (
            <>
              Hiển thị <span className="font-semibold text-rose-500">{startIndex + 1} - {endIndex}</span> trên tổng số <span className="font-semibold text-gray-800">{totalElements}</span> sản phẩm
            </>
          ) : (
            'Không tìm thấy sản phẩm nào'
          )}
        </p>
        {totalPages > 1 && (
          <p className="hidden sm:block">
            Trang <span className="font-semibold text-rose-500">{currentPage}</span> / <span className="font-semibold">{totalPages}</span>
          </p>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col justify-center items-center h-80 gap-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-rose-100 border-t-rose-400"></div>
            <span className="absolute inset-0 flex items-center justify-center text-2xl">🌸</span>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Đang tải bộ sưu tập...</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link href={`/products/${product.id}`} key={product.id}>
              <div className="group bg-white border border-rose-50 rounded-3xl overflow-hidden hover:shadow-xl hover:shadow-rose-100 transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col h-full">
                <div className="bg-gradient-to-br from-rose-50 to-pink-50 h-64 overflow-hidden">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <span className="text-xs font-bold text-rose-400 uppercase tracking-wide">{product.brand}</span>
                  <h3 className="text-sm font-bold text-gray-900 mt-1 mb-3 line-clamp-2 group-hover:text-rose-500 transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between mt-auto pt-2 border-t border-rose-50/50">
                    <p className="text-base font-extrabold text-rose-500">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.basePrice || product.price)}
                    </p>
                    <span className="text-xs font-semibold text-rose-500 bg-rose-50 px-3 py-1 rounded-full group-hover:bg-rose-500 group-hover:text-white transition-colors">
                      Chi tiết →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && totalElements === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-rose-50 p-8">
          <div className="text-5xl mb-3">🔍</div>
          <p className="text-gray-500 text-lg mb-2">Không tìm thấy sản phẩm phù hợp với bộ lọc.</p>
          <button
            onClick={() => { setSearch(''); setDebouncedSearch(''); setCategory('all'); setGender('all'); setPriceRange('all'); setCurrentPage(1); }}
            className="mt-3 px-6 py-2.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full text-sm font-semibold hover:from-rose-600 hover:to-pink-600 transition-all shadow-sm"
          >
            Xóa bộ lọc
          </button>
        </div>
      )}

      {/* ===== PAGINATION CONTROLS ===== */}
      {!loading && totalPages > 1 && (
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-3">
          <div className="flex items-center gap-1.5 bg-white p-2 rounded-2xl border border-rose-100 shadow-sm shadow-rose-50">
            {/* First Page */}
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="p-2 rounded-xl text-gray-400 hover:text-rose-500 hover:bg-rose-50 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-400 transition-all"
              title="Trang đầu"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>

            {/* Prev Page */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-xl text-gray-500 hover:text-rose-500 hover:bg-rose-50 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-500 transition-all"
              title="Trang trước"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              const isActive = currentPage === page;
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`min-w-[36px] h-9 px-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md shadow-rose-200'
                      : 'text-gray-600 hover:bg-rose-50 hover:text-rose-500'
                  }`}
                >
                  {page}
                </button>
              );
            })}

            {/* Next Page */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl text-gray-500 hover:text-rose-500 hover:bg-rose-50 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-500 transition-all"
              title="Trang sau"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Last Page */}
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl text-gray-400 hover:text-rose-500 hover:bg-rose-50 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-400 transition-all"
              title="Trang cuối"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
