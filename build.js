// build.js — Combined build script for Hostinger deployment
import { execSync } from 'child_process';
import esbuild from 'esbuild';

// Step 1: Build React frontend
console.log('🏗️  Step 1/2: Building React frontend (Vite)...');
execSync('npx vite build', { stdio: 'inherit' });

// Step 2: Compile Express server
console.log('🏗️  Step 2/2: Compiling Express server (esbuild)...');
await esbuild.build({
  entryPoints: ['server/index.ts'],
  bundle: true,
  platform: 'node',
  format: 'esm',
  outfile: 'server.js',
  external: ['mongodb-memory-server'],
  banner: {
    js: "import{createRequire}from'module';const require=createRequire(import.meta.url);",
  },
});

console.log('✅ Full build complete! dist/ and server.js are ready.');
