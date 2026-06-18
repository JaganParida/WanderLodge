const fs = require('fs');
const https = require('https');

const content = fs.readFileSync('seedRealData.js', 'utf8');
const regex = /url:\s*"([^"]+)"/g;
const urls = [];
let match;
while ((match = regex.exec(content)) !== null) {
  urls.push(match[1]);
}

const checkUrl = (url) => new Promise((resolve) => {
  https.get(url, (res) => {
    resolve({url, status: res.statusCode});
  }).on('error', () => resolve({url, status: 'error'}));
});

Promise.all(urls.map(checkUrl)).then(results => {
  const broken = results.filter(r => r.status !== 200 && r.status !== 302);
  console.log('Broken URLs:', broken);
});
