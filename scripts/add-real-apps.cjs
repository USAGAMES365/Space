// Add a curated list of real apps to public/json/a.json, skipping duplicates by name (case-insensitive).
// Usage: node scripts/add-real-apps.cjs

const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, '..', 'public', 'json', 'a.json');
const raw = fs.readFileSync(jsonPath, 'utf8');
const arr = JSON.parse(raw);

const existingNames = new Set(arr.map(x => (x.name || '').toLowerCase()));

const appsToAdd = [
    { name: 'Baidu', url: 'https://www.baidu.com/', img: '/assets/imgs/a/Baidu.webp', categories: ['all', 'search'] },
    { name: 'Yandex', url: 'https://yandex.com/', img: '/assets/imgs/a/Yandex.webp', categories: ['all', 'search'] },
    { name: 'Naver', url: 'https://www.naver.com/', img: '/assets/imgs/a/Naver.webp', categories: ['all', 'search'] },
    { name: 'Startpage', url: 'https://www.startpage.com/', img: '/assets/imgs/a/Startpage.webp', categories: ['all', 'search', 'privacy'] },
    { name: 'Ask', url: 'https://www.ask.com/', img: '/assets/imgs/a/Ask.webp', categories: ['all', 'search'] },

    { name: 'Prime Video', url: 'https://www.primevideo.com/', img: '/assets/imgs/a/Prime_Video.webp', categories: ['all', 'video', 'media'] },
    { name: 'Vudu', url: 'https://www.vudu.com/', img: '/assets/imgs/a/Vudu.webp', categories: ['all', 'video', 'media'] },
    { name: 'Peacock', url: 'https://www.peacocktv.com/', img: '/assets/imgs/a/Peacock.webp', categories: ['all', 'video', 'media'] },
    { name: 'Crunchyroll', url: 'https://www.crunchyroll.com/', img: '/assets/imgs/a/Crunchyroll.webp', categories: ['all', 'video', 'anime'] },
    { name: 'Tubi', url: 'https://tubitv.com/', img: '/assets/imgs/a/Tubi.webp', categories: ['all', 'video'] },

    { name: 'WeChat', url: 'https://web.wechat.com/', img: '/assets/imgs/a/WeChat.webp', categories: ['all', 'messaging', 'social'] },
    { name: 'Line', url: 'https://line.me/', img: '/assets/imgs/a/Line.webp', categories: ['all', 'messaging'] },
    { name: 'Viber', url: 'https://www.viber.com/', img: '/assets/imgs/a/Viber.webp', categories: ['all', 'messaging'] },
    { name: 'KakaoTalk', url: 'https://www.kakaocorp.com/service/KakaoTalk', img: '/assets/imgs/a/KakaoTalk.webp', categories: ['all', 'messaging'] },

    { name: 'OneNote', url: 'https://www.onenote.com/', img: '/assets/imgs/a/OneNote.webp', categories: ['all', 'productivity', 'notes'] },
    { name: 'Office Excel', url: 'https://office.com/excel', img: '/assets/imgs/a/Excel.webp', categories: ['all', 'productivity', 'sheets'] },
    { name: 'Office Word', url: 'https://office.com/word', img: '/assets/imgs/a/Word.webp', categories: ['all', 'productivity', 'docs'] },
    { name: 'Office PowerPoint', url: 'https://office.com/powerpoint', img: '/assets/imgs/a/PowerPoint.webp', categories: ['all', 'productivity', 'slides'] },

    { name: 'Microsoft Store', url: 'https://www.microsoft.com/store', img: '/assets/imgs/a/Microsoft_Store.webp', categories: ['all', 'store'] },
    { name: 'Humble Bundle', url: 'https://www.humblebundle.com/', img: '/assets/imgs/a/Humble_Bundle.webp', categories: ['all', 'game', 'store'] },
    { name: 'EA App', url: 'https://www.ea.com/', img: '/assets/imgs/a/EA.webp', categories: ['all', 'game'] },

    { name: 'Jenkins', url: 'https://www.jenkins.io/', img: '/assets/imgs/a/Jenkins.webp', categories: ['all', 'dev', 'ci'] },
    { name: 'Travis CI', url: 'https://travis-ci.com/', img: '/assets/imgs/a/Travis_CI.webp', categories: ['all', 'dev', 'ci'] },
    { name: 'CircleCI', url: 'https://circleci.com/', img: '/assets/imgs/a/CircleCI.webp', categories: ['all', 'dev', 'ci'] },
    { name: 'Azure DevOps', url: 'https://dev.azure.com/', img: '/assets/imgs/a/Azure_DevOps.webp', categories: ['all', 'dev'] },

    { name: 'Square', url: 'https://squareup.com/', img: '/assets/imgs/a/Square.webp', categories: ['all', 'finance'] },
    { name: 'Venmo', url: 'https://venmo.com/', img: '/assets/imgs/a/Venmo.webp', categories: ['all', 'finance'] },
    { name: 'Fidelity', url: 'https://www.fidelity.com/', img: '/assets/imgs/a/Fidelity.webp', categories: ['all', 'finance'] },
    { name: 'Vanguard', url: 'https://investor.vanguard.com/', img: '/assets/imgs/a/Vanguard.webp', categories: ['all', 'finance'] },

    { name: 'Target', url: 'https://www.target.com/', img: '/assets/imgs/a/Target.webp', categories: ['all', 'shopping'] },
    { name: 'Best Buy', url: 'https://www.bestbuy.com/', img: '/assets/imgs/a/Best_Buy.webp', categories: ['all', 'shopping'] },
    { name: 'Alibaba', url: 'https://www.alibaba.com/', img: '/assets/imgs/a/Alibaba.webp', categories: ['all', 'shopping'] },
    { name: 'AliExpress', url: 'https://www.aliexpress.com/', img: '/assets/imgs/a/AliExpress.webp', categories: ['all', 'shopping'] },

    { name: 'edX', url: 'https://www.edx.org/', img: '/assets/imgs/a/edX.webp', categories: ['all', 'education'] },
    { name: 'Udacity', url: 'https://www.udacity.com/', img: '/assets/imgs/a/Udacity.webp', categories: ['all', 'education'] },
    { name: 'Skillshare', url: 'https://www.skillshare.com/', img: '/assets/imgs/a/Skillshare.webp', categories: ['all', 'education'] },

    { name: 'NYTimes', url: 'https://www.nytimes.com/', img: '/assets/imgs/a/NYTimes.webp', categories: ['all', 'news'] },
    { name: 'BBC', url: 'https://www.bbc.com/', img: '/assets/imgs/a/BBC.webp', categories: ['all', 'news'] },
    { name: 'CNN', url: 'https://www.cnn.com/', img: '/assets/imgs/a/CNN.webp', categories: ['all', 'news'] },
    { name: 'The Guardian', url: 'https://www.theguardian.com/', img: '/assets/imgs/a/The_Guardian.webp', categories: ['all', 'news'] },

    { name: 'WebMD', url: 'https://www.webmd.com/', img: '/assets/imgs/a/WebMD.webp', categories: ['all', 'health'] },
    { name: 'Zocdoc', url: 'https://www.zocdoc.com/', img: '/assets/imgs/a/Zocdoc.webp', categories: ['all', 'health'] },

    { name: 'Kayak', url: 'https://www.kayak.com/', img: '/assets/imgs/a/Kayak.webp', categories: ['all', 'travel'] },
    { name: 'Skyscanner', url: 'https://www.skyscanner.net/', img: '/assets/imgs/a/Skyscanner.webp', categories: ['all', 'travel'] },
    { name: 'Priceline', url: 'https://www.priceline.com/', img: '/assets/imgs/a/Priceline.webp', categories: ['all', 'travel'] },
    { name: 'Hopper', url: 'https://www.hopper.com/', img: '/assets/imgs/a/Hopper.webp', categories: ['all', 'travel'] },

    { name: 'Uber Eats', url: 'https://www.ubereats.com/', img: '/assets/imgs/a/Uber_Eats.webp', categories: ['all', 'food'] },
    { name: 'Seamless', url: 'https://www.seamless.com/', img: '/assets/imgs/a/Seamless.webp', categories: ['all', 'food'] },

    { name: 'Flickr', url: 'https://www.flickr.com/', img: '/assets/imgs/a/Flickr.webp', categories: ['all', 'images'] },
    { name: '500px', url: 'https://500px.com/', img: '/assets/imgs/a/500px.webp', categories: ['all', 'images'] },

    { name: 'Norton', url: 'https://us.norton.com/', img: '/assets/imgs/a/Norton.webp', categories: ['all', 'security'] },
    { name: 'McAfee', url: 'https://www.mcafee.com/', img: '/assets/imgs/a/McAfee.webp', categories: ['all', 'security'] },

    { name: 'Docker Hub', url: 'https://hub.docker.com/', img: '/assets/imgs/a/Docker_Hub.webp', categories: ['all', 'dev'] },
    { name: 'Firebase Console', url: 'https://console.firebase.google.com/', img: '/assets/imgs/a/Firebase_Console.webp', categories: ['all', 'dev', 'cloud'] },

    { name: 'Mailchimp', url: 'https://mailchimp.com/', img: '/assets/imgs/a/Mailchimp.webp', categories: ['all', 'marketing'] },
    { name: 'Salesforce', url: 'https://www.salesforce.com/', img: '/assets/imgs/a/Salesforce.webp', categories: ['all', 'crm'] },

    { name: 'OpenTable', url: 'https://www.opentable.com/', img: '/assets/imgs/a/OpenTable.webp', categories: ['all', 'food', 'booking'] },

    { name: 'IMDb Pro', url: 'https://pro.imdb.com/', img: '/assets/imgs/a/IMDB_Pro.webp', categories: ['all', 'media'] },
    { name: 'Twitch Studio', url: 'https://www.twitch.tv/broadcast', img: '/assets/imgs/a/Twitch_Studio.webp', categories: ['all', 'media', 'streaming'] }

    // (You can expand this list with more apps)
];

let added = 0;
for (const app of appsToAdd) {
    if (!existingNames.has((app.name || '').toLowerCase())) {
        arr.push(app);
        existingNames.add(app.name.toLowerCase());
        added++;
    }
}

fs.writeFileSync(jsonPath, JSON.stringify(arr, null, 4), 'utf8');
console.log(`Added ${added} apps. New total: ${arr.length}`);
