// Node.js script to restore index.html to its original state before build
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const indexPath = path.join(__dirname, '../index.html');

let html = fs.readFileSync(indexPath, 'utf8');
html = html.replace(/src="\/src\/main\.tsx\?v=[^"]*"/, 'src="/src/main.tsx"');
fs.writeFileSync(indexPath, html);
