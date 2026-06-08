import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Razorpay from 'razorpay'
import crypto from 'crypto'
import fs from 'fs'
import path from 'path'

// Load environment variables locally for Vite dev server configuration
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split(/\r?\n/).forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const val = parts.slice(1).join('=').trim();
      process.env[key] = val;
    }
  });
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'local-api-endpoints',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          // Intercept POST /api/create-order
          if (req.url.startsWith('/api/create-order') && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', async () => {
              try {
                const { amount, currency, receipt } = JSON.parse(body || '{}');
                if (typeof amount !== 'number' || amount < 100) {
                  res.statusCode = 400;
                  res.setHeader('Content-Type', 'application/json');
                  return res.end(JSON.stringify({ error: 'Amount must be a number and at least 100 paise' }));
                }

                if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
                  res.statusCode = 401;
                  res.setHeader('Content-Type', 'application/json');
                  return res.end(JSON.stringify({ error: 'Razorpay API credentials are missing locally' }));
                }

                const razorpay = new Razorpay({
                  key_id: process.env.RAZORPAY_KEY_ID,
                  key_secret: process.env.RAZORPAY_KEY_SECRET,
                });

                const order = await razorpay.orders.create({
                  amount: Math.round(amount),
                  currency: currency || 'INR',
                  receipt: receipt || `rcpt_${Date.now()}`
                });

                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({
                  order_id: order.id,
                  amount: order.amount,
                  currency: order.currency
                }));
              } catch (err) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: err.message || 'Error creating Razorpay order' }));
              }
            });
            return;
          }

          // Intercept POST /api/verify-payment
          if (req.url.startsWith('/api/verify-payment') && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', () => {
              try {
                const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = JSON.parse(body || '{}');
                if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
                  res.statusCode = 400;
                  res.setHeader('Content-Type', 'application/json');
                  return res.end(JSON.stringify({ error: 'Missing required signature verification fields' }));
                }

                const key_secret = process.env.RAZORPAY_KEY_SECRET;
                if (!key_secret) {
                  res.statusCode = 500;
                  res.setHeader('Content-Type', 'application/json');
                  return res.end(JSON.stringify({ error: 'Razorpay secret key is not configured' }));
                }

                const generated_signature = crypto
                  .createHmac('sha256', key_secret)
                  .update(`${razorpay_order_id}|${razorpay_payment_id}`)
                  .digest('hex');

                if (generated_signature === razorpay_signature) {
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ success: true, message: 'Payment verified successfully' }));
                } else {
                  res.statusCode = 400;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ success: false, error: 'Signature verification failed' }));
                }
              } catch (err) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: err.message || 'Verification failed' }));
              }
            });
            return;
          }

          next();
        });
      }
    }
  ],
})
