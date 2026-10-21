const fs = require('fs');
const zlib = require('zlib');

const buf = fs.readFileSync('public/vidhya-tutorials-logo.png');
let pos = 8;
const idatChunks = [];
while (pos < buf.length) {
  const len = buf.readUInt32BE(pos);
  const type = buf.toString('ascii', pos + 4, pos + 8);
  if (type === 'IDAT') idatChunks.push(buf.slice(pos + 8, pos + 8 + len));
  pos += 12 + len;
}
const raw = zlib.inflateSync(Buffer.concat(idatChunks));
const width = 721;
const height = 549;
const rowSize = 1 + width * 4;

// Find blue pixels (emblem) in vidhya-tutorials-logo.png
// The emblem is in the top section (y < 400).
// In vidhya-tutorials-logo.png, the text "Vidhya Tutorials" is below y = 420.
let minX = width, maxX = 0, minY = height, maxY = 0;
let blueCount = 0;

for (let y = 0; y < 400; y++) {
  for (let x = 0; x < width; x++) {
    const r = raw[y * rowSize + 1 + x * 4];
    const g = raw[y * rowSize + 1 + x * 4 + 1];
    const b = raw[y * rowSize + 1 + x * 4 + 2];
    // Check if blueish (blue is prominent, not white/gray)
    if (b > 120 && (b - r > 40) && (b - g > 20)) {
      blueCount++;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
}
console.log('Blue emblem in vidhya-tutorials-logo.png:', { blueCount, minX, maxX, minY, maxY, w: maxX - minX + 1, h: maxY - minY + 1 });
