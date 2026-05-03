const fs = require('fs');
const path = require('path');

const pagesDir = path.join(process.cwd(), 'src/pages');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.jsx'));

files.forEach(file => {
  let content = fs.readFileSync(path.join(pagesDir, file), 'utf-8');
  
  content = content.replace(/window\.location\.hash\s*=\s*['"]#?([^'"]+)['"]/g, (match, route) => {
    if (route === 'landing' || route === '') {
      return "window.navigateApp('/')";
    }
    return "window.navigateApp('/" + route + "')";
  });

  // Handle reads: window.location.hash === '#admin-login' -> window.currentRoute === '/admin-login'
  content = content.replace(/window\.location\.hash\s*===\s*['"]#([^'"]+)['"]/g, "window.currentRoute === '/$1'");

  // Also in main.js if we still use it, but we are moving away from main.js.

  fs.writeFileSync(path.join(pagesDir, file), content, 'utf-8');
});
console.log('Replaced hash routing in pages');
