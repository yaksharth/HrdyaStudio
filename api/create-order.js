import Razorpay from 'razorpay';

export default async function handler(req, res) {
  // Ensure the method is POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { amount, currency, receipt } = req.body || {};

  // Validate amount >= 100 paise
  if (typeof amount !== 'number' || amount < 100) {
    return res.status(400).json({ error: 'Amount must be a number and at least 100 paise (1 INR)' });
  }

  // Handle configuration authorization check
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return res.status(401).json({ error: 'Razorpay API credentials are missing' });
  }

  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: Math.round(amount),
      currency: currency || 'INR',
      receipt: receipt || `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    return res.status(200).json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error('Razorpay Create Order Error:', error);
    return res.status(500).json({ error: error.message || 'Error communicating with Razorpay API' });
  }
}
