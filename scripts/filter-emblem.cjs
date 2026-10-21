const fs = require('fs');

const svg = fs.readFileSync('public/logo.svg', 'utf8');
const allPaths = svg.match(/<path[^>]+>/gs) || [];

allPaths.forEach((p, idx) => {
  const d = p.match(/d="([^"]+)"/s)[1];
  const nums = d.match(/([0-9]+\.[0-9]+|[0-9]+)/g).map(Number);
  const ys = nums.filter((_, i) => i % 2 === 1);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  if (minY >= 280) {
    const fill = (p.match(/fill="([^"]+)"/) || [])[1];
    console.log(`Path ${idx}: minY=${minY.toFixed(1)}, maxY=${maxY.toFixed(1)}, fill=${fill}`);
  }
});
