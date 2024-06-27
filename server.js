const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 3000;

http.createServer((req, res) => {
    console.log('Server-side script loaded.');

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); // Allow specific methods
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Allow specific headers

    // Handle preflight requests (HTTP OPTIONS method)
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './app/index.html';
    } else {
        filePath = './app' + decodeURIComponent(req.url);
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'application/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.wav': 'audio/wav',
        '.mp4': 'video/mp4',
        '.woff': 'application/font-woff',
        '.ttf': 'application/font-ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.otf': 'application/font-otf',
        '.svg': 'application/image/svg+xml',
    };

    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (err, data) => {
        if (err) {
            if (err.code == 'ENOENT') {
                fs.readFile('./app/404.html', (error, content) => {
                    res.writeHead(404, { 'Content-Type': 'text/html' });
                    res.end(content, 'utf-8');
                });
            } else {
                res.writeHead(500);
                res.end('Sorry, check with the site admin for error: ' + err.code + ' ..\n');
                res.end();
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data, 'utf-8');
        }
    });
}).listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log('To see, go to http://localhost:' + port) 
});
