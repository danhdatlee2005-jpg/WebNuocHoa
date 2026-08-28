'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { Bot, X, Send, User, MessageCircle } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const [input, setInput] = useState('');
  const { messages, error, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  });
  const isLoading = status === 'submitted' || status === 'streaming';
  
  const getStorageKey = () => {
    try {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) return 'scentia_chat_messages_guest';
      const payload = JSON.parse(atob(storedToken.split('.')[1]));
      return 'scentia_chat_messages_' + (payload.sub || 'user');
    } catch (e) {
      return 'scentia_chat_messages_guest';
    }
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem(getStorageKey());
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      }
    } catch (e) {
      console.error('Failed to load chat history', e);
    }
  }, [setMessages]);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(getStorageKey(), JSON.stringify(messages));
    }
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage({ parts: [{ type: 'text', text: input }] });
    setInput('');
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="bg-white rounded-xl shadow-2xl w-[380px] h-[550px] flex flex-col border border-gray-200 overflow-hidden mb-4 transition-all duration-300">
          {/* Header */}
          <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="bg-rose-500 p-1.5 rounded-full">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-sm">ScentIA</h3>
                <p className="text-xs text-slate-300">Chuyên gia nước hoa trực tuyến</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="hover:bg-slate-800 p-1 rounded transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.length === 0 ? (
              <div className="text-center text-slate-500 my-8">
                <Bot size={40} className="mx-auto mb-3 opacity-50 text-rose-500" />
                <p className="text-sm">Xin chào! Tôi là ScentIA.<br/>Tôi có thể giúp bạn tìm kiếm nước hoa hoặc tư vấn mùi hương.</p>
              </div>
            ) : (
              messages.map(m => (
                <div key={m.id} className={`flex gap-2 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.role === 'user' ? 'bg-slate-200 text-slate-600' : 'bg-rose-100 text-rose-600'}`}>
                    {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div className={`max-w-[75%] rounded-2xl p-3 text-sm shadow-sm ${m.role === 'user' ? 'bg-slate-900 text-white rounded-tr-none' : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'}`}>
                    {m.parts.map((p: any, i) => {
                      if (p.type === 'text') {
                        return <span key={i} className="whitespace-pre-wrap">{p.text}</span>;
                      }
                      if (p.type === 'tool-search_perfume' || p.type === 'tool-get_recommendation') {
                        if (p.state !== 'output-available') {
                          return <div key={i} className="text-slate-500 italic mt-2 animate-pulse">Đang tìm kiếm...</div>;
                        }
                        const products = p.output?.products;
                        if (!products || products.length === 0) {
                          return null;
                        }
                        return (
                          <div key={i} className="mt-3 flex flex-col gap-2">
                            {products.slice(0, 4).map((prod: any) => (
                              <a key={prod.id || prod._id} href={`/products/${prod.id || prod._id}`} className="flex gap-3 bg-slate-50 p-2 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group cursor-pointer block no-underline">
                                <img src={prod.thumbnail || prod.imageUrl || '/placeholder.png'} className="w-16 h-16 object-cover rounded-lg shrink-0 border border-slate-200" alt={prod.name || prod.title} />
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-sm font-medium text-slate-800 truncate group-hover:text-rose-600 transition-colors">{prod.name || prod.title}</h4>
                                  <p className="text-xs text-slate-500">Đã bán {prod.soldCount || Math.floor(Math.random() * 50) + 1}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="text-sm font-semibold text-rose-600">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(prod.promotionalPrice || prod.basePrice || 0)}</span>
                                    {(prod.promotionalPrice && prod.promotionalPrice < prod.basePrice) && <span className="text-xs text-slate-400 line-through">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(prod.basePrice)}</span>}
                                  </div>
                                </div>
                              </a>
                            ))}
                            <a href="/products" className="block text-center mt-2 w-full py-2 bg-rose-500 text-white rounded-lg text-sm font-medium hover:bg-rose-600 transition-colors">
                              Xem tất cả sản phẩm
                            </a>
                          </div>
                        );
                      }
                      if (p.type === 'tool-get_perfume_details') {
                        if (p.state !== 'output-available') {
                          return <div key={i} className="text-slate-500 italic mt-2 animate-pulse">Đang tra cứu chi tiết...</div>;
                        }
                        const prod = p.output;
                        if (!prod || prod.error) return null;
                        return (
                          <a key={i} href={`/products/${prod.id || prod._id}`} className="mt-3 block bg-slate-50 p-3 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer no-underline">
                            <img src={prod.thumbnail || prod.imageUrl || '/placeholder.png'} className="w-full h-32 object-cover rounded-lg border border-slate-200 mb-3" alt={prod.name || prod.title} />
                            <h4 className="text-sm font-bold text-slate-800 truncate mb-1">{prod.name || prod.title}</h4>
                            <span className="text-base font-semibold text-rose-600">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(prod.promotionalPrice || prod.basePrice || 0)}</span>
                            <div className="mt-2 text-center w-full py-1.5 bg-rose-500 text-white rounded text-sm font-medium hover:bg-rose-600 transition-colors">
                              Xem chi tiết & Đặt hàng
                            </div>
                          </a>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex gap-2 flex-row">
                <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                  <Bot size={16} />
                </div>
                <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-none p-4 flex gap-1 items-center">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            )}
            {error && <div className="text-red-500 text-sm text-center p-2 bg-red-50 rounded-lg">{error.message ? "Lỗi: " + error.message : "Đã có lỗi xảy ra."}</div>}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-gray-100">
            <form onSubmit={handleSubmit} className="flex gap-2 relative">
              <input
                className="flex-1 border border-slate-200 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all bg-slate-50"
                value={input || ''}
                placeholder="Nhập tin nhắn..."
                onChange={handleInputChange}
                disabled={isLoading}
              />
              <button 
                type="submit" 
                disabled={isLoading || !input?.trim()}
                className="bg-slate-900 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed absolute right-1 top-0.5"
              >
                <Send size={16} className="ml-1" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'} bg-slate-900 hover:bg-slate-800 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-xl shadow-slate-900/20 transition-all duration-300 relative group`}
      >
        <MessageCircle size={26} />
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500 border-2 border-slate-900"></span>
        </span>
        
        {/* Tooltip */}
        <div className="absolute -top-10 right-0 bg-white text-slate-800 text-xs py-1.5 px-3 rounded-lg font-medium shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-slate-100">
          Chat với ScentIA
        </div>
      </button>
    </div>
  );
}
