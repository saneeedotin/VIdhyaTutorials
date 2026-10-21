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

// Sample 5 pixels inside the large head (x: 350, y: 150)
for (let dy = 0; dy < 5; dy++) {
  const y = 150 + dy;
  const x = 350;
  const idx = y * rowSize + 1 + x * 4;
  console.log(`(${x}, ${y}): R=${raw[idx]}, G=${raw[idx+1]}, B=${raw[idx+2]}, A=${raw[idx+3]}`);
}
