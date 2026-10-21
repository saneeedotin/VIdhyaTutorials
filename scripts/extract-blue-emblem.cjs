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

const minX = 135;
const maxX = 628;
const minY = 74;
const maxY = 402;
const cropW = maxX - minX + 1;
const cropH = maxY - minY + 1;

const cropRaw = Buffer.alloc(cropH * (1 + cropW * 4));

// Representative blue color of the emblem: #3066e6 -> [48, 102, 230]
const BRAND_R = 48;
const BRAND_G = 102;
const BRAND_B = 230;

for (let y = minY; y <= maxY; y++) {
  const cy = y - minY;
  cropRaw[cy * (1 + cropW * 4)] = 0; // Filter None
  
  for (let x = minX; x <= maxX; x++) {
    const cx = x - minX;
    const srcIdx = y * rowSize + 1 + x * 4;
    const tgtIdx = cy * (1 + cropW * 4) + 1 + cx * 4;
    
    const r = raw[srcIdx];
    const g = raw[srcIdx + 1];
    const b = raw[srcIdx + 2];
    
    // Check if pixel is part of the white background
    // In white background: r ~ 255, g ~ 255, b ~ 255
    if (r > 248 && g > 248 && b > 248) {
      cropRaw[tgtIdx] = 0;
      cropRaw[tgtIdx + 1] = 0;
      cropRaw[tgtIdx + 2] = 0;
      cropRaw[tgtIdx + 3] = 0;
    } else {
      // Calculate opacity based on color difference from pure white
      // Strong blue pixels have low R and low G
      const darkness = 255 - Math.max(r, g);
      const alpha = Math.min(255, Math.max(0, Math.round((darkness / 200) * 255)));
      
      if (alpha < 15) {
        cropRaw[tgtIdx] = 0;
        cropRaw[tgtIdx + 1] = 0;
        cropRaw[tgtIdx + 2] = 0;
        cropRaw[tgtIdx + 3] = 0;
      } else {
        // Keep the natural rich blue shading from the original artwork or use vibrant blue
        cropRaw[tgtIdx] = Math.min(255, r);
        cropRaw[tgtIdx + 1] = Math.min(255, g);
        cropRaw[tgtIdx + 2] = Math.min(255, b);
        cropRaw[tgtIdx + 3] = alpha;
      }
    }
  }
}

function createPNG(w, h, uncompressedScanlines) {
  const compressed = zlib.deflateSync(uncompressedScanlines);
  
  function crc32(b) {
    let table = new Uint32Array(256);
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let k = 0; k < 8; k++) c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
      table[i] = c;
    }
    let crc = 0 ^ (-1);
    for (let i = 0; i < b.length; i++) crc = (crc >>> 8) ^ table[(crc ^ b[i]) & 0xFF];
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
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;
  
  return Buffer.concat([header, makeChunk('IHDR', ihdr), makeChunk('IDAT', compressed), makeChunk('IEND', Buffer.alloc(0))]);
}

const emblemPNG = createPNG(cropW, cropH, cropRaw);
fs.writeFileSync('public/logo-emblem.png', emblemPNG);
console.log('Saved public/logo-emblem.png! Size:', emblemPNG.length, 'dimensions:', cropW, 'x', cropH);

// Also create square favicon (512x512) with transparent padding
const size = 512;
const squareRaw = Buffer.alloc(size * (1 + size * 4));
const scale = Math.min((size - 40) / cropW, (size - 40) / cropH);
const destW = Math.round(cropW * scale);
const destH = Math.round(cropH * scale);
const startX = Math.round((size - destW) / 2);
const startY = Math.round((size - destH) / 2);

for (let sy = 0; sy < size; sy++) {
  squareRaw[sy * (1 + size * 4)] = 0;
}

for (let dy = 0; dy < destH; dy++) {
  const targetY = startY + dy;
  const srcY = Math.min(cropH - 1, Math.floor(dy / scale));
  for (let dx = 0; dx < destW; dx++) {
    const targetX = startX + dx;
    const srcX = Math.min(cropW - 1, Math.floor(dx / scale));
    const srcOffset = srcY * (1 + cropW * 4) + 1 + srcX * 4;
    const tgtOffset = targetY * (1 + size * 4) + 1 + targetX * 4;
    squareRaw[tgtOffset] = cropRaw[srcOffset];
    squareRaw[tgtOffset + 1] = cropRaw[srcOffset + 1];
    squareRaw[tgtOffset + 2] = cropRaw[srcOffset + 2];
    squareRaw[tgtOffset + 3] = cropRaw[srcOffset + 3];
  }
}

const faviconSquare = createPNG(size, size, squareRaw);
fs.writeFileSync('public/favicon.png', faviconSquare);
fs.writeFileSync('public/logo2.png', faviconSquare);
console.log('Saved public/favicon.png and logo2.png as 512x512 blue emblem!');
