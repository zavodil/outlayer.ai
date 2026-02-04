const express = require('express');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

// Compute cache-busting hash from CSS + JS files at startup
function buildHash() {
  const files = ['public/styles.css', 'public/script.js'];
  const h = crypto.createHash('md5');
  for (const f of files) {
    try { h.update(fs.readFileSync(path.join(__dirname, f))); } catch {}
  }
  return h.digest('hex').slice(0, 8);
}
const ASSET_HASH = buildHash();

// Inject ?v=hash into HTML before serving
function serveHtml(filePath, res) {
  let html = fs.readFileSync(filePath, 'utf-8');
  html = html.replace(/styles\.css(\?[^"]*)?"/g, `styles.css?v=${ASSET_HASH}"`);
  html = html.replace(/script\.js(\?[^"]*)?"/g, `script.js?v=${ASSET_HASH}"`);
  res.type('html').send(html);
}

app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '1d',
  etag: true,
  setHeaders(res, filePath) {
    // No cache for HTML
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    }
  }
}));

app.get('/products', (req, res) => {
  serveHtml(path.join(__dirname, 'public', 'products.html'), res);
});

app.get('*', (req, res) => {
  serveHtml(path.join(__dirname, 'public', 'index.html'), res);
});

app.listen(PORT, () => {
  console.log(`outlayer.ai running on port ${PORT} (assets: ${ASSET_HASH})`);
});
