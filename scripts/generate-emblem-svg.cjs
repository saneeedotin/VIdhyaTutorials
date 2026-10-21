const fs = require('fs');

const svg = fs.readFileSync('public/logo.svg', 'utf8');
const allPaths = svg.match(/<path[^>]+>/gs) || [];

const emblemPaths = [];
allPaths.forEach((p, idx) => {
  const d = p.match(/d="([^"]+)"/s)[1];
  const nums = d.match(/([0-9]+\.[0-9]+|[0-9]+)/g).map(Number);
  const ys = nums.filter((_, i) => i % 2 === 1);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  
  // The emblem book ends around y = 304.
  // Any path strictly below y = 305 is the "Vidhya Tutorials" typography.
  if (minY < 305) {
    // If the path extends past 310, it might be a tall stroke, check max
    if (maxY <= 315) {
      emblemPaths.push(p);
    }
  }
});

console.log('Selected emblem paths:', emblemPaths.length);

let minX = 9999, maxX = 0, minY = 9999, maxY = 0;
emblemPaths.forEach(p => {
  const d = p.match(/d="([^"]+)"/s)[1];
  const nums = d.match(/([0-9]+\.[0-9]+|[0-9]+)/g).map(Number);
  const xs = nums.filter((_, i) => i % 2 === 0);
  const ys = nums.filter((_, i) => i % 2 === 1);
  minX = Math.min(minX, ...xs);
  maxX = Math.max(maxX, ...xs);
  minY = Math.min(minY, ...ys);
  maxY = Math.max(maxY, ...ys);
});

const pad = 10;
const vbX = Math.floor(minX - pad);
const vbY = Math.floor(minY - pad);
const vbW = Math.ceil(maxX - minX + pad * 2);
const vbH = Math.ceil(maxY - minY + pad * 2);

console.log('viewBox:', `${vbX} ${vbY} ${vbW} ${vbH}`);

// Replace all fills with royal blue #3066e6 (or keep original fills if desired)
// The user explicitly showed a solid blue emblem!
const recoloredPaths = emblemPaths.map(p => {
  return p.replace(/fill="[^"]+"/, 'fill="#3066e6"');
});

const outSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vbX} ${vbY} ${vbW} ${vbH}" width="100%" height="100%">
${recoloredPaths.join('\n')}
</svg>`;

fs.writeFileSync('public/logo-emblem.svg', outSvg);
console.log('Saved public/logo-emblem.svg!');
