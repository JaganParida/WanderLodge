const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('--- [WanderLodge Build] Step 1: Building Vite Frontend ---');
execSync('npm --prefix frontend run build', { stdio: 'inherit' });

console.log('--- [WanderLodge Build] Step 2: Preparing Root dist directory ---');
const src = path.join(__dirname, '..', 'frontend', 'dist');
const dest = path.join(__dirname, '..', 'dist');

if (!fs.existsSync(src)) {
  console.error('❌ Build Error: frontend/dist does not exist after build!');
  process.exit(1);
}

fs.cpSync(src, dest, { recursive: true });
console.log('✅ Success: Synced frontend/dist -> ./dist for Vercel deployment!');
