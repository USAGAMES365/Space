// Add a curated set of reputable websites to public/json/a.json, skipping duplicates
// Usage: node scripts/add-curated.cjs

const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, '..', 'public', 'json', 'a.json');
const backupPath = jsonPath + '.pre_curated.' + Date.now();

const raw = fs.readFileSync(jsonPath, 'utf8');
const arr = JSON.parse(raw);
fs.copyFileSync(jsonPath, backupPath);
console.log('Backup created:', backupPath);

const existingUrls = new Set(arr.map(x => (x.url || '').toLowerCase()));
const existingNames = new Set(arr.map(x => (x.name || '').toLowerCase()));

const curated = [
    { name: 'Google Maps', url: 'https://maps.google.com/', img: '/assets/imgs/a/Google_Maps.webp', categories: ['all', 'maps'] },
    { name: 'Wikimedia', url: 'https://www.wikimedia.org/', img: '/assets/imgs/a/Wikimedia.webp', categories: ['all', 'reference'] },
    { name: 'StackExchange', url: 'https://stackexchange.com/', img: '/assets/imgs/a/StackExchange.webp', categories: ['all', 'qa'] },
    { name: 'Medium', url: 'https://medium.com/', img: '/assets/imgs/a/Medium.webp', categories: ['all', 'reading'] },
    { name: 'Quora', url: 'https://www.quora.com/', img: '/assets/imgs/a/Quora.webp', categories: ['all', 'qa'] },
    { name: 'Tumblr', url: 'https://www.tumblr.com/', img: '/assets/imgs/a/Tumblr.webp', categories: ['all', 'social'] },
    { name: 'Blogger', url: 'https://www.blogger.com/', img: '/assets/imgs/a/Blogger.webp', categories: ['all', 'blog'] },
    { name: 'WhatsApp', url: 'https://web.whatsapp.com/', img: '/assets/imgs/a/WhatsApp.webp', categories: ['all', 'messaging'] },
    { name: 'Skype', url: 'https://web.skype.com/', img: '/assets/imgs/a/Skype.webp', categories: ['all', 'messaging'] },
    { name: 'Tencent', url: 'https://www.tencent.com/', img: '/assets/imgs/a/Tencent.webp', categories: ['all', 'corporate'] },
    { name: 'Bing Maps', url: 'https://www.bing.com/maps', img: '/assets/imgs/a/Bing_Maps.webp', categories: ['all', 'maps'] },
    { name: 'DuckDuckGo Maps', url: 'https://duckduckgo.com/', img: '/assets/imgs/a/DuckDuckGo.webp', categories: ['all', 'maps', 'search'] },
    { name: 'Craigslist', url: 'https://www.craigslist.org/', img: '/assets/imgs/a/Craigslist.webp', categories: ['all', 'local'] },
    { name: 'Hacker News', url: 'https://news.ycombinator.com/', img: '/assets/imgs/a/Hacker_News.webp', categories: ['all', 'news', 'tech'] },
    { name: 'Product Hunt', url: 'https://www.producthunt.com/', img: '/assets/imgs/a/Product_Hunt.webp', categories: ['all', 'tech'] },
    { name: 'Behance', url: 'https://www.behance.net/', img: '/assets/imgs/a/Behance.webp', categories: ['all', 'design'] },
    { name: 'Dribbble', url: 'https://dribbble.com/', img: '/assets/imgs/a/Dribbble.webp', categories: ['all', 'design'] },
    { name: 'Twitch', url: 'https://www.twitch.tv/', img: '/assets/imgs/a/Twitch.webp', categories: ['all', 'media'] },
    { name: 'Vimeo', url: 'https://vimeo.com/', img: '/assets/imgs/a/Vimeo.webp', categories: ['all', 'video'] },
    { name: 'Bitly', url: 'https://bitly.com/', img: '/assets/imgs/a/Bitly.webp', categories: ['all', 'tools'] },
    { name: 'RSS', url: 'https://rss.com/', img: '/assets/imgs/a/RSS.webp', categories: ['all', 'rss'] },
    { name: 'Calendly', url: 'https://calendly.com/', img: '/assets/imgs/a/Calendly.webp', categories: ['all', 'productivity'] },
    { name: 'Notion', url: 'https://www.notion.so/', img: '/assets/imgs/a/Notion.webp', categories: ['all', 'productivity'] },
    { name: 'Confluence', url: 'https://www.atlassian.com/software/confluence', img: '/assets/imgs/a/Confluence.webp', categories: ['all', 'productivity'] },
    { name: 'Microsoft OneDrive', url: 'https://onedrive.live.com/', img: '/assets/imgs/a/OneDrive.webp', categories: ['all', 'cloud'] },
    { name: 'ResearchGate', url: 'https://www.researchgate.net/', img: '/assets/imgs/a/ResearchGate.webp', categories: ['all', 'education'] },
    { name: 'arXiv', url: 'https://arxiv.org/', img: '/assets/imgs/a/arXiv.webp', categories: ['all', 'education'] },
    { name: 'IEEE', url: 'https://www.ieee.org/', img: '/assets/imgs/a/IEEE.webp', categories: ['all', 'education'] },
    { name: 'Slack', url: 'https://slack.com/', img: '/assets/imgs/a/Slack.webp', categories: ['all', 'messaging'] },
    { name: 'Discord', url: 'https://discord.com/', img: '/assets/imgs/a/Discord.webp', categories: ['all', 'messaging'] },
    { name: 'Telegram', url: 'https://web.telegram.org/', img: '/assets/imgs/a/Telegram.webp', categories: ['all', 'messaging'] },
    { name: 'Signal', url: 'https://signal.org/', img: '/assets/imgs/a/Signal.webp', categories: ['all', 'messaging'] },
    { name: 'Zoom', url: 'https://zoom.us/', img: '/assets/imgs/a/Zoom.webp', categories: ['all', 'video'] }
];

let added = 0;
for (const site of curated) {
    if (!existingUrls.has(site.url.toLowerCase()) && !existingNames.has(site.name.toLowerCase())) {
        arr.push(site);
        existingUrls.add(site.url.toLowerCase());
        existingNames.add(site.name.toLowerCase());
        added++;
    }
}

fs.writeFileSync(jsonPath, JSON.stringify(arr, null, 4), 'utf8');
console.log(`Added ${added} curated apps. New total: ${arr.length}`);
