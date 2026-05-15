const https = require('https');

const urlsToTest = [
  'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Saint-Gobain_logo.png/1200px-Saint-Gobain_logo.png',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Tata_logo.svg/1200px-Tata_logo.svg.png',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Hindware_Logo.png/800px-Hindware_Logo.png',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80'
];

urlsToTest.forEach(url => {
  https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
    console.log(`${url} : ${res.statusCode}`);
  }).on('error', (e) => {
    console.error(`${url} : ERROR ${e.message}`);
  });
});
