import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const redirectsPath = path.join(__dirname, '../_redirects');
const distPath = path.join(__dirname, '../dist/_redirects');

async function copyRedirects() {
    try {
        await fs.promises.access(redirectsPath);
        await fs.promises.copyFile(redirectsPath, distPath);
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.log('No _redirects file found');
        } else {
            console.error('Error copying redirects:', error);
        }
    }
}

// Execute the function
await copyRedirects();
