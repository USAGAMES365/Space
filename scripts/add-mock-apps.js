// Append a number of mock/custom apps to public/json/a.json
// Usage: node scripts/add-mock-apps.js [count]

const fs = require('fs');
const path = require('path');

const count = parseInt(process.argv[2], 10) || 1000;
const jsonPath = path.join(__dirname, '..', 'public', 'json', 'a.json');

const raw = fs.readFileSync(jsonPath, 'utf8');
const arr = JSON.parse(raw);

const startIndex = arr.length + 1;
for (let i = 0; i < count; i++) {
    const id = startIndex + i;
    const name = `Custom App ${id}`;
    const entry = {
        name,
        url: `https://example.com/custom-app-${id}`,
        img: `/assets/imgs/a/Custom_App_${id}.webp`,
        categories: ["all", "custom"]
    };
    arr.push(entry);
}

fs.writeFileSync(jsonPath, JSON.stringify(arr, null, 4), 'utf8');
console.log(`Appended ${count} mock apps. New total: ${arr.length}`);
