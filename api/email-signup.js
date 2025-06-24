// Vercel serverless function for email signup
export default function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email } = req.body || {};
    
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ message: 'Valid email required' });
    }

    // Log email for collection
    console.log('EMAIL_SIGNUP:', email, new Date().toISOString());
    
    return res.json({ 
      message: "Thank you for signing up! You'll be notified when cork launches.",
      success: true
    });

  } catch (error) {
    console.error('Email signup error:', error);
    return res.status(500).json({ message: 'Please try again' });
  }
}