const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('page.jsx')) results.push(file);
    }
  });
  return results;
}

const appDir = path.join(process.cwd(), 'src/app');
const files = walk(appDir);

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');
  content = content.replace(/import \{ (.*) \} from '(.*)\/pages\/(.*)';/g, "import { $1 } from '$2/vanillaPages/$3';");
  fs.writeFileSync(file, content, 'utf-8');
});

console.log('Fixed imports');
