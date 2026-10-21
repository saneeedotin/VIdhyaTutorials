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

for (let y = 0; y < height; y += 10) {
  for (let x = 0; x < width; x += 10) {
    const r = raw[y * rowSize + 1 + x * 4];
    const g = raw[y * rowSize + 1 + x * 4 + 1];
    const b = raw[y * rowSize + 1 + x * 4 + 2];
    if (b > 120 && b > r + 30) {
      console.log(`Blue at (${x}, ${y}): rgb(${r}, ${g}, ${b}) -> #${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`);
      return;
    }
  }
}
