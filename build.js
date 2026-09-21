// build.js — Combined build script for Hostinger deployment
import { execSync } from 'child_process';
import esbuild from 'esbuild';

// Step 1: Build React frontend
console.log('🏗️  Step 1/2: Building React frontend (Vite)...');
execSync('npx vite build', { stdio: 'inherit' });

// Step 2: Compile Express server as CommonJS (avoids all ESM __dirname/require issues)
console.log('🏗️  Step 2/2: Compiling Express server (esbuild)...');
await esbuild.build({
  entryPoints: ['server/index.ts'],
  bundle: true,
  platform: 'node',
  format: 'cjs',
  outfile: 'server.cjs',
  external: ['mongodb-memory-server'],
});

console.log('✅ Full build complete! dist/ and server.cjs are ready.');
