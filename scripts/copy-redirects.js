const fs = require('fs');
const path = require('path');

const redirectsPath = path.join(__dirname, '../_redirects');
const distPath = path.join(__dirname, '../dist/_redirects');

if (fs.existsSync(redirectsPath)) {
    fs.copyFileSync(redirectsPath, distPath);
} else {
    console.log('No _redirects file found');
}
