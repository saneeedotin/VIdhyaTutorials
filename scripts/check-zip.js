import fs from 'fs';

// Read zip headers directly to see paths
const buf = fs.readFileSync('deploy.zip');
let offset = 0;
const names = [];

while (offset < buf.length - 4) {
  if (buf.readUInt32LE(offset) === 0x04034b50) { // local file header signature
    const nameLen = buf.readUInt16LE(offset + 26);
    const extraLen = buf.readUInt16LE(offset + 28);
    const name = buf.toString('utf8', offset + 30, offset + 30 + nameLen);
    names.push(name);
    offset += 30 + nameLen + extraLen;
  } else {
    offset++;
  }
}

console.log('Total entries:', names.length);
console.log('Sample entries with assets:', names.filter(n => n.includes('assets')).slice(0, 5));
