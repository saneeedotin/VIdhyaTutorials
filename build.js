// build.js — Combined build script for Hostinger deployment
// Runs both the Vite frontend build and the esbuild server compilation
import { execSync } from 'child_process';

console.log('🏗️  Step 1/2: Building React frontend (Vite)...');
execSync('npx vite build', { stdio: 'inherit' });

console.log('🏗️  Step 2/2: Compiling Express server (esbuild)...');
execSync('npx esbuild server/index.ts --bundle --platform=node --format=esm --outfile=server.js --external:mongodb-memory-server', { stdio: 'inherit' });

console.log('✅ Full build complete! dist/ and server.js are ready.');
