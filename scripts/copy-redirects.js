import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const source = path.join(__dirname, '../_redirects');
const destination = path.join(__dirname, '../dist/_redirects');

fs.copyFile(source, destination, (err) => {
    if (err) {
        console.error('Error copying _redirects file:', err);
    } else {
        console.log('_redirects file copied successfully.');
    }
});
