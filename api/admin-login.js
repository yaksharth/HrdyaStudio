import { signToken } from './admin-auth.js';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    return res.end();
  }

  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ error: 'Method not allowed' }));
  }

  let body = '';
  if (req.body) {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } else {
    // Parse body from stream if not parsed by Vercel
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

  const { password } = body;
  const adminPassword = process.env.ADMIN_PASSWORD || 'HrdyaAdmin2026';

  if (password === adminPassword) {
    // Create token expiring in 24 hours
    const token = signToken({
      user: 'admin',
      exp: Date.now() + 24 * 60 * 60 * 1000
    });
    
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ success: true, token }));
  } else {
    res.statusCode = 401;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ success: false, error: 'Invalid password' }));
  }
}
