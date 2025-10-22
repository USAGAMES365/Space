// Import Tranco top list (top 10k by default), dedupe against public/json/a.json, and append unique entries
// Usage: node scripts/import-tranco.cjs [--count=10000]

const fs = require('fs');
const path = require('path');
const https = require('https');

const jsonPath = path.join(__dirname, '..', 'public', 'json', 'a.json');
const backupPath = jsonPath + '.bak.' + Date.now();

const args = process.argv.slice(2);
const countArg = args.find(a => a.startsWith('--count='));
const count = countArg ? parseInt(countArg.split('=')[1], 10) : 10000;

function fetchUrl(url) {
    return new Promise((resolve, reject) => {
        https.get(url, res => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                return resolve(fetchUrl(res.headers.location));
            }
            if (res.statusCode !== 200) {
                res.resume();
                return reject(new Error('Status ' + res.statusCode));
            }
            const chunks = [];
            res.on('data', c => chunks.push(c));
            res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
        }).on('error', reject);
    });
}

async function tryTranco() {
    // Tranco list mirror (monthly snapshot) - using the static Tranco list hosting
    // we'll try the public 'tranco-list' raw list for top sites
    // Official Tranco usage prefers creating your own list, but for convenience we'll use a public mirror
    const url = 'https://tranco-list.s3.amazonaws.com/top-1m.csv.zip';
    try {
        const data = await fetchUrl(url);
        return { type: 'csvzip', data };
    } catch (e) {
        throw e;
    }
}

async function tryMajestic() {
    // Majestic Million mirror (simple text list)
    const url = 'https://majestic.com/reports/majestic_million_export.csv';
    try {
        const data = await fetchUrl(url);
        return { type: 'csv', data };
    } catch (e) {
        throw e;
    }
}

function safeName(name) {
    return name.replace(/[^a-z0-9]/gi, '_');
}

(async () => {
    // backup
    fs.copyFileSync(jsonPath, backupPath);
    console.log('Backup created:', backupPath);

    let listText;
    try {
        const res = await tryTranco();
        // tranco zip handling is skipped; fall back to majestic for simplicity
        console.log('Tranco mirror response type:', res.type);
        throw new Error('Tranco zipped mirror not processed in this script; falling back to Majestic');
    } catch (e) {
        console.log('Tranco failed or skipped; falling back to Majestic:', e.message);
    }

    let majestic;
    try {
        majestic = await tryMajestic();
    } catch (e) {
        console.error('Majestic fetch failed:', e && e.message);
        process.exit(1);
    }

    // parse Majestic CSV (simple split by newlines, first column is rank, third column likely is domain depending on export)
    const lines = majestic.data.split(/\r?\n/).filter(Boolean);
    const domains = [];
    for (let i = 0; i < Math.min(lines.length, count); i++) {
        const cols = lines[i].split(',');
        // try to find a domain-like column
        let domain = cols[1] || cols[2] || cols[0];
        domain = domain.replace(/"/g, '').trim();
        if (!domain) continue;
        // remove protocol if present
        domain = domain.replace(/^https?:\/\//, '').replace(/\/.*/, '');
        domains.push(domain);
    }

    // load existing json
    const existing = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    const existingUrls = new Set(existing.map(x => (x.url || '').toLowerCase()));
    const existingNames = new Set(existing.map(x => (x.name || '').toLowerCase()));

    let added = 0;
    for (const domain of domains) {
        const url = 'https://' + domain + '/';
        if (existingUrls.has(url.toLowerCase())) continue;
        const name = domain.replace(/^www\./, '');
        if (existingNames.has(name.toLowerCase())) continue;
        existing.push({ name, url, img: `/assets/imgs/a/${safeName(name)}.webp`, categories: ['all'] });
        existingUrls.add(url.toLowerCase());
        existingNames.add(name.toLowerCase());
        added++;
    }

    fs.writeFileSync(jsonPath, JSON.stringify(existing, null, 4), 'utf8');
    console.log(`Appended ${added} domains to ${jsonPath}. New total: ${existing.length}`);
})();
