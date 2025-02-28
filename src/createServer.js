'use strict';

const http = require('http');
const fs = require('fs');
const mime = require('mime-types');

function createServer() {
  return http.createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const contentType = mime.lookup(url.pathname) || 'text/plain';

    res.setHeader('Content-Type', contentType);

    if (req.url === '/file') {
      res.statusCode = 200;
      res.end('Please provide a file path. Example: /file/example.txt');

      return;
    }

    const pathToFile = url.pathname.slice(1).replace('file', '');

    if (pathToFile.includes('//')) {
      res.statusCode = 404;
      res.end();

      return;
    }

    try {
      const readFile = fs.readFileSync(`./public${pathToFile}`, 'utf8');

      res.statusCode = 200;
      res.end(readFile);
    } catch (err) {
      if (err.code === 'ENOENT') {
        res.statusCode = 404;
        res.end('No such file or directory');
      }

      res.statusCode = 400;
      res.end();
    }
  });
}

module.exports = {
  createServer,
};
