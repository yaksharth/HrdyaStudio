import fs from 'fs';
import path from 'path';
import { verifyToken, getAuthToken } from './admin-auth.js';

const GITHUB_REPO = process.env.GITHUB_REPO || 'yaksharth/HrdyaStudio';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

// Local path for development
const LOCAL_PRODUCTS_FILE = path.join(process.cwd(), 'src', 'data', 'products.json');

// Helper to fetch products from GitHub or Local
async function getProducts() {
  const isDev = process.env.NODE_ENV === 'development' || !GITHUB_TOKEN;
  
  if (isDev) {
    if (fs.existsSync(LOCAL_PRODUCTS_FILE)) {
      const content = fs.readFileSync(LOCAL_PRODUCTS_FILE, 'utf8');
      return { products: JSON.parse(content), sha: null };
    }
    return { products: [], sha: null };
  } else {
    // Fetch from GitHub
    const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/src/data/products.json`;
    const res = await fetch(url, {
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'HrdyaStudio-Admin'
      }
    });
    
    if (!res.ok) {
      throw new Error(`Failed to fetch products from GitHub: ${res.statusText}`);
    }
    
    const data = await res.json();
    const content = Buffer.from(data.content, 'base64').toString('utf8');
    return {
      products: JSON.parse(content),
      sha: data.sha
    };
  }
}

// Helper to save products to GitHub or Local
async function saveProducts(products, sha) {
  const isDev = process.env.NODE_ENV === 'development' || !GITHUB_TOKEN;
  const contentString = JSON.stringify(products, null, 2);
  
  if (isDev) {
    fs.writeFileSync(LOCAL_PRODUCTS_FILE, contentString, 'utf8');
    return { success: true };
  } else {
    // Save to GitHub
    const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/src/data/products.json`;
    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'User-Agent': 'HrdyaStudio-Admin'
      },
      body: JSON.stringify({
        message: 'Admin Panel: Update products catalog',
        content: Buffer.from(contentString).toString('base64'),
        sha: sha,
        branch: 'main'
      })
    });
    
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Failed to save products to GitHub: ${res.statusText} - ${errText}`);
    }
    
    return { success: true };
  }
}

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    return res.end();
  }

  // Auth check
  const token = getAuthToken(req);
  const decoded = verifyToken(token);
  if (!decoded) {
    res.statusCode = 401;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ error: 'Unauthorized' }));
  }

  try {
    const { products, sha } = await getProducts();

    if (req.method === 'GET') {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify(products));
    }

    let body = '';
    if (req.body) {
      body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    } else {
      const buffers = [];
      for await (const chunk of req) {
        buffers.push(chunk);
      }
      const data = Buffer.concat(buffers).toString();
      try {
        body = JSON.parse(data || '{}');
      } catch (e) {
        body = {};
      }
    }

    if (req.method === 'POST') {
      // Create new product
      const newProduct = body;
      
      // Auto generate ID if not provided, using same logic as add-product.js
      if (!newProduct.id) {
        const category = newProduct.category || 'Bracelets';
        const catPrefix = category.charAt(0).toLowerCase();
        const existingIdsOfPrefix = products
          .filter(p => p.id && p.id.startsWith(catPrefix))
          .map(p => parseInt(p.id.substring(1)))
          .filter(num => !isNaN(num));
        
        let nextNum = 1;
        if (existingIdsOfPrefix.length > 0) {
          nextNum = Math.max(...existingIdsOfPrefix) + 1;
        }
        newProduct.id = `${catPrefix}${nextNum}`;
      }

      // Check for duplicate ID
      if (products.some(p => p.id === newProduct.id)) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify({ error: `Product with ID ${newProduct.id} already exists` }));
      }

      products.push(newProduct);
      await saveProducts(products, sha);

      res.statusCode = 201;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ success: true, product: newProduct }));
    }

    if (req.method === 'PUT') {
      // Update existing product
      const updatedProduct = body;
      const index = products.findIndex(p => p.id === updatedProduct.id);
      
      if (index === -1) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify({ error: `Product with ID ${updatedProduct.id} not found` }));
      }

      products[index] = { ...products[index], ...updatedProduct };
      await saveProducts(products, sha);

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ success: true, product: products[index] }));
    }

    if (req.method === 'DELETE') {
      // Delete product (ID passed in query params or body)
      const urlObj = new URL(req.url, 'http://localhost');
      const id = urlObj.searchParams.get('id') || body.id;

      if (!id) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify({ error: 'Missing product ID' }));
      }

      const index = products.findIndex(p => p.id === id);
      if (index === -1) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify({ error: `Product with ID ${id} not found` }));
      }

      const deletedProduct = products.splice(index, 1)[0];
      await saveProducts(products, sha);

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ success: true, deleted: deletedProduct }));
    }

  } catch (err) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ error: err.message || 'Error processing product request' }));
  }
}
