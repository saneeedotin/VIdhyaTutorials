const http = require('http');
const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');

// 1. Read existing logo.svg and create square favicon.svg
const rawSvg = fs.readFileSync(path.join(__dirname, '../public/logo.svg'), 'utf8');
const squareSvg = rawSvg.replace(/viewBox="[^"]+"/, 'viewBox="15 -66 520 520"');
fs.writeFileSync(path.join(__dirname, '../public/favicon.svg'), squareSvg);
console.log('Saved public/favicon.svg');

// Helper to make a standard ICO file containing multiple PNG images
function createIco(images) {
  // images: array of { width, height, buffer }
  const count = images.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // 1 = ICO
  header.writeUInt16LE(count, 4);

  const directorySize = count * 16;
  let currentOffset = 6 + directorySize;
  const dirBuffers = [];

  for (const img of images) {
    const dir = Buffer.alloc(16);
    dir.writeUInt8(img.width >= 256 ? 0 : img.width, 0);
    dir.writeUInt8(img.height >= 256 ? 0 : img.height, 1);
    dir.writeUInt8(0, 2); // color count
    dir.writeUInt8(0, 3); // reserved
    dir.writeUInt16LE(1, 4); // color planes
    dir.writeUInt16LE(32, 6); // bpp
    dir.writeUInt32LE(img.buffer.length, 8); // size
    dir.writeUInt32LE(currentOffset, 12); // offset
    dirBuffers.push(dir);
    currentOffset += img.buffer.length;
  }

  return Buffer.concat([header, ...dirBuffers, ...images.map(img => img.buffer)]);
}

// 2. Start temporary HTTP server to render canvases in headless Chrome
const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/favicon.svg') {
    res.writeHead(200, { 'Content-Type': 'image/svg+xml' });
    res.end(squareSvg);
    return;
  }

  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body>
<canvas id="c16" width="16" height="16"></canvas>
<canvas id="c32" width="32" height="32"></canvas>
<canvas id="c48" width="48" height="48"></canvas>
<canvas id="c96" width="96" height="96"></canvas>
<canvas id="c180" width="180" height="180"></canvas>
<canvas id="c192" width="192" height="192"></canvas>
<canvas id="c512" width="512" height="512"></canvas>
<script>
const img = new Image();
img.src = '/favicon.svg';
img.onload = () => {
  const sizes = [16, 32, 48, 96, 180, 192, 512];
  const results = {};
  for (const s of sizes) {
    const canvas = document.getElementById('c' + s);
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, s, s);
    results[s] = canvas.toDataURL('image/png');
  }
  
  fetch('/save-all', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(results)
  }).then(r => r.text()).then(txt => {
    document.body.innerText = 'DONE: ' + txt;
  });
};
</script>
</body>
</html>`);
    return;
  }

  if (req.method === 'POST' && req.url === '/save-all') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const getBuf = (b64) => Buffer.from(b64.replace(/^data:image\/png;base64,/, ''), 'base64');
        
        const b16 = getBuf(data['16']);
        const b32 = getBuf(data['32']);
        const b48 = getBuf(data['48']);
        const b96 = getBuf(data['96']);
        const b180 = getBuf(data['180']);
        const b192 = getBuf(data['192']);
        const b512 = getBuf(data['512']);

        const publicDir = path.join(__dirname, '../public');

        fs.writeFileSync(path.join(publicDir, 'favicon-16x16.png'), b16);
        fs.writeFileSync(path.join(publicDir, 'favicon-32x32.png'), b32);
        fs.writeFileSync(path.join(publicDir, 'favicon-48x48.png'), b48);
        fs.writeFileSync(path.join(publicDir, 'favicon-96x96.png'), b96);
        fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), b180);
        fs.writeFileSync(path.join(publicDir, 'favicon-192x192.png'), b192);
        fs.writeFileSync(path.join(publicDir, 'favicon.png'), b512);
        fs.writeFileSync(path.join(publicDir, 'logo2.png'), b512);
        fs.writeFileSync(path.join(publicDir, 'logo-emblem.png'), b512);
        fs.writeFileSync(path.join(publicDir, 'favicon-blue.png'), b512);

        // Multi-size ICO
        const icoBuf = createIco([
          { width: 16, height: 16, buffer: b16 },
          { width: 32, height: 32, buffer: b32 },
          { width: 48, height: 48, buffer: b48 }
        ]);
        fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuf);

        console.log('Successfully wrote:');
        console.log('- favicon-16x16.png (16x16)');
        console.log('- favicon-32x32.png (32x32)');
        console.log('- apple-touch-icon.png (180x180)');
        console.log('- favicon.png (512x512)');
        console.log('- logo2.png (512x512)');
        console.log('- logo-emblem.png (512x512)');
        console.log('- favicon-blue.png (512x512)');
        console.log('- favicon.ico (' + icoBuf.length + ' bytes)');

        res.writeHead(200);
        res.end('SUCCESS');

        setTimeout(() => {
          server.close();
          process.exit(0);
        }, 300);
      } catch (err) {
        console.error('Save error:', err);
        res.writeHead(500);
        res.end(err.message);
      }
    });
    return;
  }
});

const PORT = 4567;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}... Opening Chrome headless...`);
  const { spawn } = require('child_process');
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const child = spawn(chromePath, ['--headless=new', '--disable-gpu', `http://localhost:${PORT}`], {
    detached: true,
    stdio: 'ignore'
  });
  child.unref();
});
