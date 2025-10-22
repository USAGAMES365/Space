// Clean malformed entries from public/json/a.json
// Removes entries where url is not a valid http(s) URL or hostname looks like HTML/JS

const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, '..', 'public', 'json', 'a.json');
const backupPath = jsonPath + '.cleanbak.' + Date.now();

const raw = fs.readFileSync(jsonPath, 'utf8');
const arr = JSON.parse(raw);

fs.copyFileSync(jsonPath, backupPath);
console.log('Backup created:', backupPath);

function isValidHostname(h) {
    if (!h) return false;
    // reject strings containing spaces or angle brackets or javascript-like patterns
    if (/\s/.test(h)) return false;
    if (/[<>"'{}\(\)\[\]=;]/.test(h)) return false;
    // reject if numeric-only single-digit path like '1' which is unlikely domain
    if (/^\d+$/.test(h)) return false;
    // basic domain-like check: contains a dot and letters
    if (!/\./.test(h)) return false;
    if (!/[a-zA-Z]/.test(h)) return false;
    return true;
}

const cleaned = [];
const removed = [];
for (const item of arr) {
    const url = item.url || '';
    try {
        const u = new URL(url);
        const hostname = u.hostname;
        if (isValidHostname(hostname)) {
            cleaned.push(item);
        } else {
            removed.push(item);
        }
    } catch (e) {
        // try to salvage if url starts with https:// then bad
        removed.push(item);
    }
}

fs.writeFileSync(jsonPath, JSON.stringify(cleaned, null, 4), 'utf8');
console.log(`Removed ${removed.length} malformed entries. New total: ${cleaned.length}`);
console.log('Saved cleaned file. Backup at:', backupPath);

// write removed items for inspection
fs.writeFileSync(path.join(__dirname, '..', 'public', 'json', 'removed_malformed.json'), JSON.stringify(removed, null, 4), 'utf8');
console.log('Wrote removed items to public/json/removed_malformed.json');
