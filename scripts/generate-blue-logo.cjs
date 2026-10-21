const fs = require('fs');
const zlib = require('zlib');

// Read logo2.png
const buf = fs.readFileSync('public/logo2.png');
let pos = 8;
const idatChunks = [];
while (pos < buf.length) {
  const len = buf.readUInt32BE(pos);
  const type = buf.toString('ascii', pos + 4, pos + 8);
  if (type === 'IDAT') idatChunks.push(buf.slice(pos + 8, pos + 8 + len));
  pos += 12 + len;
}
const raw = zlib.inflateSync(Buffer.concat(idatChunks));
const width = 561;
const height = 374;
const rowSize = 1 + width * 4;

// Find bounding box of the emblem in logo2.png
let minX = width, maxX = 0, minY = height, maxY = 0;
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const a = raw[y * rowSize + 1 + x * 4 + 3];
    const r = raw[y * rowSize + 1 + x * 4];
    // if pixel is not transparent and not pure white
    if (a > 30 && r < 240) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
}
console.log('Emblem bounding box in logo2.png:', { minX, maxX, minY, maxY, w: maxX - minX + 1, h: maxY - minY + 1 });

// Target brand blue: #2f64e7 -> [47, 100, 231]
// Recolor: calculate darkness (255 - grayscale) and use as alpha for the blue color!
const newRaw = Buffer.alloc(raw.length);
for (let y = 0; y < height; y++) {
  newRaw[y * rowSize] = 0; // Filter type 0 (None)
  for (let x = 0; x < width; x++) {
    const r = raw[y * rowSize + 1 + x * 4];
    const g = raw[y * rowSize + 1 + x * 4 + 1];
    const b = raw[y * rowSize + 1 + x * 4 + 2];
    const a = raw[y * rowSize + 1 + x * 4 + 3];
    
    // original grayscale brightness
    const brightness = (r * 0.299 + g * 0.587 + b * 0.114);
    // darkness determines opacity of the blue emblem
    const darkness = 255 - brightness;
    
    const finalAlpha = Math.round((a / 255) * (darkness / 255) * 255);
    
    if (finalAlpha > 10) {
      newRaw[y * rowSize + 1 + x * 4] = 47;     // R
      newRaw[y * rowSize + 1 + x * 4 + 1] = 100; // G
      newRaw[y * rowSize + 1 + x * 4 + 2] = 231; // B
      newRaw[y * rowSize + 1 + x * 4 + 3] = finalAlpha; // A
    } else {
      newRaw[y * rowSize + 1 + x * 4] = 0;
      newRaw[y * rowSize + 1 + x * 4 + 1] = 0;
      newRaw[y * rowSize + 1 + x * 4 + 2] = 0;
      newRaw[y * rowSize + 1 + x * 4 + 3] = 0;
    }
  }
}

// Function to encode uncompressed PNG
function createPNG(w, h, uncompressedScanlines) {
  const compressed = zlib.deflateSync(uncompressedScanlines);
  
  function crc32(buf) {
    let table = new Uint32Array(256);
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let k = 0; k < 8; k++) c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
      table[i] = c;
    }
    let crc = 0 ^ (-1);
    for (let i = 0; i < buf.length; i++) crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xFF];
    return (crc ^ (-1)) >>> 0;
  }
  
  function makeChunk(type, data) {
    const len = data.length;
    const chunk = Buffer.alloc(12 + len);
    chunk.writeUInt32BE(len, 0);
    chunk.write(type, 4, 4, 'ascii');
    data.copy(chunk, 8);
    const crc = crc32(chunk.slice(4, 8 + len));
    chunk.writeUInt32BE(crc, 8 + len);
    return chunk;
  }
  
  const header = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; // 8 bit
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace
  
  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', compressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));
  
  return Buffer.concat([header, ihdrChunk, idatChunk, iendChunk]);
}

const blueEmblemPNG = createPNG(width, height, newRaw);
fs.writeFileSync('public/logo-blue.png', blueEmblemPNG);
console.log('Saved public/logo-blue.png! Size:', blueEmblemPNG.length);

// Also create tightly-cropped square version for favicon!
const pad = 20;
const cropW = (maxX - minX + 1) + pad * 2;
const cropH = (maxY - minY + 1) + pad * 2;
const side = Math.max(cropW, cropH);
const cropRaw = Buffer.alloc(side * (1 + side * 4));

const offsetX = Math.floor((side - (maxX - minX + 1)) / 2);
const offsetY = Math.floor((side - (maxY - minY + 1)) / 2);

for (let cy = 0; cy < side; cy++) {
  cropRaw[cy * (1 + side * 4)] = 0; // filter
}

for (let y = minY; y <= maxY; y++) {
  const targetY = (y - minY) + offsetY;
  for (let x = minX; x <= maxX; x++) {
    const targetX = (x - minX) + offsetX;
    const srcIdx = y * rowSize + 1 + x * 4;
    const tgtIdx = targetY * (1 + side * 4) + 1 + targetX * 4;
    cropRaw[tgtIdx] = newRaw[srcIdx];
    cropRaw[tgtIdx + 1] = newRaw[srcIdx + 1];
    cropRaw[tgtIdx + 2] = newRaw[srcIdx + 2];
    cropRaw[tgtIdx + 3] = newRaw[srcIdx + 3];
  }
}

const squareFaviconPNG = createPNG(side, side, cropRaw);
fs.writeFileSync('public/favicon-blue.png', squareFaviconPNG);
console.log('Saved public/favicon-blue.png! Size:', squareFaviconPNG.length, 'dimensions:', side, 'x', side);
