import fs from 'fs';
import path from 'path';
import { verifyToken, getAuthToken } from './admin-auth.js';

const GITHUB_REPO = process.env.GITHUB_REPO || 'yaksharth/HrdyaStudio';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

// Local public folder path
const LOCAL_PUBLIC_DIR = path.join(process.cwd(), 'public');

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
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

  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ error: 'Method not allowed' }));
  }

  try {
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

    const { filename, content } = body;

    if (!filename || !content) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ error: 'Missing filename or image content' }));
    }

    // Extract the raw base64 data (strip data:image/png;base64, prefix if present)
    const base64Data = content.includes(';base64,') 
      ? content.split(';base64,')[1] 
      : content;

    const fileBuffer = Buffer.from(base64Data, 'base64');
    
    // Validate file type (simple signature check or trust extension for ease)
    const allowedExtensions = ['.png', '.jpg', '.jpeg', '.webp', '.gif'];
    const ext = path.extname(filename).toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ error: 'Unsupported file extension. Use PNG, JPG, WEBP, or GIF.' }));
    }

    // Generate a unique filename using timestamp to prevent collisions
    const cleanedName = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
    const uniqueFilename = `${Date.now()}-${cleanedName}`;
    const publicPath = `/${uniqueFilename}`;

    const isDev = process.env.NODE_ENV === 'development' || !GITHUB_TOKEN;

    if (isDev) {
      // Save locally
      if (!fs.existsSync(LOCAL_PUBLIC_DIR)) {
        fs.mkdirSync(LOCAL_PUBLIC_DIR, { recursive: true });
      }
      const filePath = path.join(LOCAL_PUBLIC_DIR, uniqueFilename);
      fs.writeFileSync(filePath, fileBuffer);
      
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ success: true, url: publicPath }));
    } else {
      // Commit to GitHub public/ folder
      const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/public/${uniqueFilename}`;
      
      const resGithub = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
          'User-Agent': 'HrdyaStudio-Admin'
        },
        body: JSON.stringify({
          message: `Admin Panel: Upload product image ${uniqueFilename}`,
          content: base64Data,
          branch: 'main'
        })
      });

      if (!resGithub.ok) {
        const errText = await resGithub.text();
        throw new Error(`Failed to upload to GitHub: ${resGithub.statusText} - ${errText}`);
      }

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ success: true, url: publicPath }));
    }
  } catch (err) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ error: err.message || 'Error uploading file' }));
  }
}
