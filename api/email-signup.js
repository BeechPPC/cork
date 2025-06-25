// Standalone serverless function for email signup - bypasses Express server for reliability
export default function handler(req, res) {
  // CORS headers for cross-origin requests
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
    const { email, firstName } = req.body || {};
    
    // Basic email validation
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ message: 'Valid email required' });
    }

    // Enhanced email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address' });
    }

    // Log email signup for collection (console logs are captured by Vercel)
    console.log('EMAIL_SIGNUP:', JSON.stringify({
      email,
      firstName: firstName || null,
      timestamp: new Date().toISOString(),
      userAgent: req.headers['user-agent'] || 'unknown'
    }));
    
    return res.json({ 
      message: "Thank you for signing up! You'll be notified when cork launches.",
      success: true
    });

  } catch (error) {
    console.error('Email signup error:', error);
    return res.status(500).json({ message: 'Please try again' });
  }
}