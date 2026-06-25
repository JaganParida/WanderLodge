const fs = require('fs');
const path = require('path');

const directory = '.';
const ignoreDirs = ['node_modules', '.git', '.gemini', 'package-lock.json'];

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Global replacements (case-sensitive where needed)
  content = content.replace(/Vistiqo/g, 'Vistiqo');
  content = content.replace(/Vistiqo/g, 'Vistiqo');
  content = content.replace(/vistiqo/g, 'vistiqo');
  
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

function traverse(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (ignoreDirs.some(ignore => fullPath.includes(ignore))) continue;

    if (fs.statSync(fullPath).isDirectory()) {
      traverse(fullPath);
    } else {
      // only text files
      if (fullPath.match(/\.(js|jsx|html|md|json|css)$/)) {
        replaceInFile(fullPath);
      }
    }
  }
}

traverse(directory);
console.log("Done rebranding!");
