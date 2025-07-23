
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const indexPath = path.join(__dirname, '../index.html');
const pkgPath = path.join(__dirname, '../package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
const version = pkg.version;

// Restore index.html to its original state before build
let html = fs.readFileSync(indexPath, 'utf8');
html = html.replace(/src=\"\/src\/main\.tsx\?v=[^\"]*\"/, 'src="/src/main.tsx"');
fs.writeFileSync(indexPath, html);

// After build, inject the version
process.on('exit', () => {
  let htmlPostBuild = fs.readFileSync(indexPath, 'utf8');
  htmlPostBuild = htmlPostBuild.replace(/src=\"\/src\/main\.tsx\"/, `src="/src/main.tsx?v=${version}"`);
  fs.writeFileSync(indexPath, htmlPostBuild);
});
