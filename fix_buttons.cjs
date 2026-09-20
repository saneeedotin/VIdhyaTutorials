const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir(path.join(__dirname, 'src', 'components', 'dashboard'), (filePath) => {
  if (filePath.endsWith('.tsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    // regex to find button tags without onClick or type
    const regex = /<button(?![^>]*?(?:onClick|type|disabled)[=>])[^>]*>/g;
    const newContent = content.replace(regex, (match) => {
      // insert onClick before the closing >
      return match.slice(0, -1) + ` onClick={() => alert('Feature coming soon!')}>`;
    });
    if (newContent !== content) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`Updated ${filePath}`);
    }
  }
});
