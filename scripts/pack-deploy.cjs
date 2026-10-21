const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const stage = path.join(root, 'staging_deploy');
const desktopZip = 'C:\\Users\\Admin\\OneDrive\\Desktop\\VIdhyaTutorials_deploy.zip';

// Step 0: Ensure fresh compilation of frontend & backend
console.log('📦 Step 0: Compiling latest frontend and backend...');
execSync('node build.js', { cwd: root, stdio: 'inherit' });

// Clean previous staging
if (fs.existsSync(stage)) {
  fs.rmSync(stage, { recursive: true, force: true });
}
fs.mkdirSync(stage, { recursive: true });

// 1. Copy everything inside dist directly to stage root (so index.html and assets/ are at public_html root)
const distDir = path.join(root, 'dist');
fs.cpSync(distDir, stage, { recursive: true });

// 2. Also keep dist/ folder inside stage (so Node server.cjs can serve static files if running)
fs.cpSync(distDir, path.join(stage, 'dist'), { recursive: true });

// 3. Copy server and config files
const copyFiles = ['server.cjs', 'server.js', 'package.json', '.env', '.htaccess'];
for (const f of copyFiles) {
  const src = path.join(root, f);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(stage, f));
  }
}

// 4. Copy server/data directory (users.json, announcements.json, etc.)
const dataSrc = path.join(root, 'server', 'data');
const dataDest = path.join(stage, 'server', 'data');
if (fs.existsSync(dataSrc)) {
  fs.cpSync(dataSrc, dataDest, { recursive: true });
}

// 5. Copy firebase service account files if present
const files = fs.readdirSync(root);
for (const f of files) {
  if (f.startsWith('vidhyatutorials-') && f.endsWith('.json')) {
    fs.copyFileSync(path.join(root, f), path.join(stage, f));
  }
}

// 6. Zip stage contents into Desktop zip using native tar (POSIX paths with forward slashes)
if (fs.existsSync(desktopZip)) {
  fs.unlinkSync(desktopZip);
}

console.log('📦 Compressing into zip...');
execSync(`tar -a -c -f "${desktopZip}" *`, { cwd: stage });

// 6b. Also maintain an uncompressed folder on Desktop for direct drag-and-drop
const desktopFolder = 'C:\\Users\\Admin\\OneDrive\\Desktop\\VIdhyaTutorials_Live_Files';
if (fs.existsSync(desktopFolder)) {
  fs.rmSync(desktopFolder, { recursive: true, force: true });
}
fs.cpSync(stage, desktopFolder, { recursive: true });
console.log('📂 Also synced uncompressed live folder at:', desktopFolder);

// 7. Clean up staging directory
fs.rmSync(stage, { recursive: true, force: true });

console.log('✅ Perfectly packaged zip at:', desktopZip);
const stat = fs.statSync(desktopZip);
console.log('Zip size:', Math.round(stat.size / 1024), 'KB');

