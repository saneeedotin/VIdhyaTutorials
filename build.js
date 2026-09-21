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
  external: [
    // These packages use native bindings / __dirname / gRPC and cannot be bundled
    'firebase-admin',
    'firebase-admin/*',
    '@google-cloud/*',
    'google-gax',
    'mongodb-memory-server',
  ],
  banner: {
    js: [
      "import{createRequire}from'module';",
      "import{fileURLToPath as __fileURLToPath}from'url';",
      "import{dirname as __pathDirname}from'path';",
      "const require=createRequire(import.meta.url);",
      "const __filename=__fileURLToPath(import.meta.url);",
      "const __dirname=__pathDirname(__filename);",
    ].join(''),
  },
});

console.log('✅ Full build complete! dist/ and server.js are ready.');
