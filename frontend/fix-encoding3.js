const fs = require('fs');
let code = fs.readFileSync('src/components/Chatbot.tsx', 'utf8');

code = code.replace(/<p className="text-sm">Xin ch.*?m.*?ng\.<\/p>/s, '<p className="text-sm">Xin chào! Tôi là ScentIA.<br/>Tôi có thể giúp bạn tìm kiếm nước hoa hoặc tư vấn mùi hương.</p>');

const replacements = {
  'ChuyĂªn gia nÆ°á»›c hoa trá»±c tuyáº¿n': 'Chuyên gia nước hoa trực tuyến',
  'Xem táº¥t cáº£ sáº£n pháº©m': 'Xem tất cả sản phẩm',
  'Ä ang tra cá»©u chi tiáº¿t...': 'Đang tra cứu chi tiết...',
  'Xem chi tiáº¿t & Ä áº·t hĂ\xa0ng': 'Xem chi tiết & Đặt hàng'
};

for (const [bad, good] of Object.entries(replacements)) {
  code = code.split(bad).join(good);
}

fs.writeFileSync('src/components/Chatbot.tsx', code, 'utf8');
