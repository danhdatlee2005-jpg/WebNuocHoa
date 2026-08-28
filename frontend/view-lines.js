const fs = require('fs');
const lines = fs.readFileSync('src/components/Chatbot.tsx', 'utf8').split('\n');
for (let i = 80; i <= 120; i++) {
  console.log(${i+1}: );
}
