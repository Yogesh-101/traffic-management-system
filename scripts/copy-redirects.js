import fs from 'fs';
import path from 'path';
import { fileURLToPath, dirname } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const redirectsPath = path.join(__dirname, '../_redirects');
const distPath = path.join(__dirname, '../dist/_redirects');

try {
    if (await fs.promises.access(redirectsPath)) {
        await fs.promises.copyFile(redirectsPath, distPath);
    } else {
        console.log('No _redirects file found');
    }
} catch (error) {
    console.error('Error copying redirects:', error);
}
