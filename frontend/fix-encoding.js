const fs = require('fs');
let code = fs.readFileSync('src/components/Chatbot.tsx', 'utf8');
code = code.replace(/<p className="text-sm">Xin ch.*<\/p>/s, '<p className="text-sm">Xin chào! Tôi là ScentIA.<br/>Tôi có thể giúp bạn tìm kiếm nước hoa hoặc tư vấn mùi hương.</p>');
code = code.replace(/"Lá»—i: "\s*\+\s*error.message\s*:\s*"Ä Ă£ cĂ³ lá»—i xáº£y ra."/, '"Lỗi: " + error.message : "Đã có lỗi xảy ra."');
code = code.replace(/placeholder="Nháº.*?"/, 'placeholder="Nhập tin nhắn..."');
code = code.replace(/Chat vá»›i ScentIA/, 'Chat với ScentIA');
fs.writeFileSync('src/components/Chatbot.tsx', code, 'utf8');
