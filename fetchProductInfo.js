// Backend proxy server to fetch and parse product info from a given URL
const express = require('express');
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/api/fetch-product-info', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'Missing url parameter' });

  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    // Try to extract main product info (customize selector as needed)
    const title = $('h1').first().text();
    const description = $('meta[name="description"]').attr('content') || '';
    // Try common selectors for product description/content
    const mainText = $('.product-description, .product-content, .main-content, .entry-content, .content').text() || '';

    res.json({
      title,
      description,
      mainText: mainText.trim() || $('body').text().slice(0, 2000) // fallback: first 2000 chars of body
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 4000;
app.listen(PORT, () => console.log(`Proxy server running on port ${PORT}`)); 