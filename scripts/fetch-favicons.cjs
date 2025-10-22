// Simple favicon fetcher and converter to WebP using cwebp CLI
// Usage: node scripts/fetch-favicons.cjs [--all]

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const { execFileSync } = require('child_process');

const jsonPath = path.join(__dirname, '..', 'public', 'json', 'a.json');
const outDir = path.join(__dirname, '..', 'public', 'assets', 'imgs', 'a');

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const a = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

const args = process.argv.slice(2);
const fetchAll = args.includes('--all');

function fetchUrl(url) {
    return new Promise((resolve, reject) => {
        const lib = url.startsWith('https') ? https : http;
        lib
            .get(url, res => {
                if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                    return resolve(fetchUrl(res.headers.location));
                }
                if (res.statusCode !== 200) {
                    res.resume();
                    return reject(new Error('Status ' + res.statusCode));
                }
                const chunks = [];
                res.on('data', c => chunks.push(c));
                res.on('end', () => resolve(Buffer.concat(chunks)));
            })
            .on('error', reject);
    });
}

function safeName(name) {
    return name.replace(/[^a-z0-9]/gi, '_');
}

async function fetchFaviconFor(site) {
    const url = site.url;
    try {
        const u = new URL(url);
        const domain = u.hostname;
        const filename = safeName(site.name) + '.webp';
        const outPath = path.join(outDir, filename);
        if (!fetchAll && fs.existsSync(outPath)) {
            console.log('Skipping (exists):', filename);
            return;
        }

        // try Google favicon service
        const googleFavicon = `https://www.google.com/s2/favicons?domain=${domain}&sz=256`;
        let buffer;
        try {
            buffer = await fetchUrl(googleFavicon);
        } catch (e) {
            console.log('Google favicon failed for', domain, e.message);
        }

        // fallback to /favicon.ico
        if (!buffer) {
            const icoUrl = u.origin + '/favicon.ico';
            try {
                buffer = await fetchUrl(icoUrl);
            } catch (e) {
                console.log('Fallback favicon failed for', domain, e.message);
            }
        }

        if (!buffer) {
            console.log('No favicon for', site.name);
            return;
        }

        // Convert to webp using cwebp CLI for speed
        try {
            // ensure tmp dir
            const tmpDir = path.join(outDir, '..', 'tmp');
            if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
            const tmpFile = path.join(tmpDir, `${safeName(site.name)}-${Date.now()}`);
            fs.writeFileSync(tmpFile, buffer);

            // run cwebp
            try {
                execFileSync('cwebp', ['-q', '80', tmpFile, '-o', outPath], { stdio: 'ignore' });
                console.log('Saved', outPath);
            } catch (e) {
                console.error('cwebp failed for', site.name, e && e.message);
            }

            // cleanup
            try { fs.unlinkSync(tmpFile); } catch (e) {}
        } catch (e) {
            console.error('Conversion failed for', site.name, e && e.message);
        }
    } catch (e) {
        console.error('Error processing', site.name, e && e.message);
    }
}

async function main() {
    for (const site of a) {
        // only process entries that map to public/assets/imgs/a/ by default
        if (!site.img || !site.img.includes('/assets/imgs/a/')) continue;
        const base = path.basename(site.img);
        const outPath = path.join(outDir, base);
        if (!fetchAll && fs.existsSync(outPath)) continue;
        await fetchFaviconFor(site);
    }
}

main().catch(e => console.error(e));
