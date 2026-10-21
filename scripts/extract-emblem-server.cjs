const http = require('http');
const fs = require('fs');
const { exec } = require('child_process');

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/logo.jpeg') {
    res.writeHead(200, { 'Content-Type': 'image/jpeg' });
    res.end(fs.readFileSync('public/logo.jpeg'));
    return;
  }
  
  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`<!DOCTYPE html>
<html>
<body>
<canvas id="c"></canvas>
<script>
const img = new Image();
img.src = '/logo.jpeg';
img.onload = () => {
  const tCanvas = document.createElement('canvas');
  tCanvas.width = img.width;
  tCanvas.height = img.height;
  const tCtx = tCanvas.getContext('2d');
  tCtx.drawImage(img, 0, 0);
  
  const imgData = tCtx.getImageData(0, 0, img.width, img.height);
  const data = imgData.data;
  
  // Find blue pixels in the top 70% of logo.jpeg
  const limitY = Math.floor(img.height * 0.70);
  let minX = img.width, maxX = 0, minY = img.height, maxY = 0;
  
  for (let y = 0; y < limitY; y++) {
    for (let x = 0; x < img.width; x++) {
      const idx = (y * img.width + x) * 4;
      const r = data[idx];
      const g = data[idx+1];
      const b = data[idx+2];
      // Blue pixel condition: b is highest, and not gray/white
      if (b > 100 && (b - r > 30) && (b - g > 15)) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  
  const pad = 12;
  const ew = maxX - minX + 1;
  const eh = maxY - minY + 1;
  
  const c = document.getElementById('c');
  c.width = ew + pad * 2;
  c.height = eh + pad * 2;
  const ctx = c.getContext('2d');
  
  const outData = ctx.createImageData(c.width, c.height);
  const out = outData.data;
  
  for (let y = minY; y <= maxY; y++) {
    const dy = (y - minY) + pad;
    for (let x = minX; x <= maxX; x++) {
      const dx = (x - minX) + pad;
      const srcIdx = (y * img.width + x) * 4;
      const dstIdx = (dy * c.width + dx) * 4;
      
      const r = data[srcIdx];
      const g = data[srcIdx+1];
      const b = data[srcIdx+2];
      
      // If near-white background
      if (r > 240 && g > 240 && b > 240) {
        out[dstIdx+3] = 0;
      } else {
        // Calculate blue intensity
        const darkness = 255 - Math.min(r, g);
        const alpha = Math.min(255, Math.max(0, Math.round((darkness / 200) * 255)));
        
        if (alpha > 15 && b > r) {
          out[dstIdx] = 48;     // Rich Royal Blue
          out[dstIdx+1] = 102;
          out[dstIdx+2] = 230;
          out[dstIdx+3] = alpha;
        } else {
          out[dstIdx+3] = 0;
        }
      }
    }
  }
  
  ctx.putImageData(outData, 0, 0);
  
  fetch('/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dataUrl: c.toDataURL('image/png') })
  }).then(() => console.log('Saved!'));
};
</script>
</body>
</html>`);
    return;
  }
  
  if (req.method === 'POST' && req.url === '/save') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const json = JSON.parse(body);
      const b64 = json.dataUrl.replace(/^data:image\/png;base64,/, '');
      const buf = Buffer.from(b64, 'base64');
      fs.writeFileSync('public/logo-emblem.png', buf);
      fs.writeFileSync('public/favicon.png', buf);
      fs.writeFileSync('public/logo2.png', buf);
      console.log('SUCCESS! Wrote public/logo-emblem.png, favicon.png, logo2.png. Size:', buf.length);
      res.writeHead(200);
      res.end('OK');
      setTimeout(() => process.exit(0), 500);
    });
    return;
  }
});

server.listen(3333, () => {
  console.log('Extraction server running on 3333...');
  exec('& "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" --headless --disable-gpu http://localhost:3333');
});
