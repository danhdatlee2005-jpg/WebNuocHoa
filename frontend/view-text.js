const fs = require('fs');
const lines = fs.readFileSync('src/components/Chatbot.tsx', 'utf8').split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('Xin ch')) {
    console.log(lines[i]);
  }
  if (lines[i].includes('Đang')) {
    console.log(lines[i]);
  }
}
