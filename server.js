// Hostinger Entry Point Wrapper
// Hostinger's control panel expects "server.js" by default.
// Since package.json has "type": "module", this file runs as ESM,
// and it simply imports the compiled CommonJS server bundle.
import './server.cjs';
