const fs = require('fs');
let code = fs.readFileSync('src/components/Chatbot.tsx', 'utf8');

code = code.replace(/Ä ang tra cá»©u chi tiáº¿t\.\.\./g, 'Đang tra cứu chi tiết...');
code = code.replace(/Ä ang t\?m ki\?m\.\.\./g, 'Đang tìm kiếm...');
code = code.replace(/Kh.ng t\?m th\?y s\?n ph\?m\./g, 'Không tìm thấy sản phẩm.');
code = code.replace(/Xem chi tiáº¿t & Ä áº·t hĂ\s*ng/g, 'Xem chi tiết & Đặt hàng');
code = code.replace(/Xem táº¥t cáº£ sáº£n pháº©m/g, 'Xem tất cả sản phẩm');
code = code.replace(/Ä\s*Ă£ bĂ¡n/g, 'Đã bán');
code = code.replace(/ang t\?m ki\?m\.\.\./g, 'Đang tìm kiếm...');
code = code.replace(/Khng t\?m th\?y s\?n ph\?m\./g, 'Không tìm thấy sản phẩm.');
code = code.replace(/\? bn/g, 'Đã bán');
code = code.replace(/ang tra c\?u chi ti\?t\.\.\./g, 'Đang tra cứu chi tiết...');
code = code.replace(/Xem chi ti\?t & \?t hng/g, 'Xem chi tiết & Đặt hàng');
code = code.replace(/Xem t\?t c\? s\?n ph\?m/g, 'Xem tất cả sản phẩm');
fs.writeFileSync('src/components/Chatbot.tsx', code, 'utf8');
