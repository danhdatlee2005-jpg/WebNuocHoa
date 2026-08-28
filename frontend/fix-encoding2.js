const fs = require('fs');
let code = fs.readFileSync('src/components/Chatbot.tsx', 'utf8');

const replacements = {
  'ChuyĂªn gia nÆ°á»›c hoa trá»±c tuyáº¿n': 'Chuyên gia nước hoa trực tuyến',
  'Xin cho! Tôi l ScentIA.': 'Xin chào! Tôi là ScentIA.',
  'Ti c th? gip b?n t?m ki?m n?c hoa ho?c t v?n mi hng.': 'Tôi có thể giúp bạn tìm kiếm nước hoa hoặc tư vấn mùi hương.',
  'Xem táº¥t cáº£ sáº£n pháº©m': 'Xem tất cả sản phẩm',
  'Ä ang tra cá»©u chi tiáº¿t...': 'Đang tra cứu chi tiết...',
  'Xem chi tiáº¿t & Ä áº·t hĂ ng': 'Xem chi tiết & Đặt hàng'
};

for (const [bad, good] of Object.entries(replacements)) {
  code = code.replace(bad, good);
}

fs.writeFileSync('src/components/Chatbot.tsx', code, 'utf8');
