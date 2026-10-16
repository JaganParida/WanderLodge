const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('--- [WanderLodge Frontend Build] Building Vite Frontend ---');
execSync('npx vite build', { stdio: 'inherit' });

// Also copy to root dist if accessible
try {
  const src = path.join(__dirname, '..', 'dist');
  const dest = path.join(__dirname, '..', '..', 'dist');
  if (fs.existsSync(src)) {
    fs.cpSync(src, dest, { recursive: true });
    console.log('✅ Synced to root dist');
  }
} catch (e) {
  // Ignore if root is not accessible
}

console.log('✅ Frontend build complete!');
