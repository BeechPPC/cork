// Simple recommendations endpoint - GET method to test if POST is the issue
export default function handler(req, res) {
  console.log('Simple recommendations endpoint called');

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const query = req.query.query || 'Australian wines';
    console.log('Processing wine recommendation query:', query);

    // Return curated Australian wines
    const recommendations = [
      {
        name: 'Penfolds Bin 389 Cabernet Shiraz',
        type: 'Cabernet Shiraz',
        region: 'Barossa Valley, SA',
        vintage: '2020',
        description:
          'A powerful blend combining the structure of Cabernet Sauvignon with the richness of Shiraz. Notes of dark berries, chocolate, and cedar with firm yet approachable tannins.',
        priceRange: '$65-75',
        abv: '14.5%',
        rating: '94/100',
        matchReason:
          "Classic Australian premium red wine showcasing the country's signature Shiraz-Cabernet blend",
      },
      {
        name: 'Wolf Blass Black Label Shiraz',
        type: 'Shiraz',
        region: 'McLaren Vale, SA',
        vintage: '2019',
        description:
          'Rich, full-bodied Shiraz with intense blackberry and plum flavors, complemented by vanilla oak and soft, velvety tannins.',
        priceRange: '$45-55',
        abv: '14.0%',
        rating: '92/100',
        matchReason:
          'Excellent representation of Australian Shiraz craftsmanship from renowned McLaren Vale region',
      },
      {
        name: 'Leeuwin Estate Art Series Chardonnay',
        type: 'Chardonnay',
        region: 'Margaret River, WA',
        vintage: '2020',
        description:
          'Exceptional Margaret River Chardonnay with perfect balance of fruit, oak, and acidity. Stone fruit flavors with subtle vanilla and mineral notes.',
        priceRange: '$65-85',
        abv: '13.0%',
        rating: '94/100',
        matchReason:
          "Australia's premier Chardonnay from the renowned Margaret River wine region",
      },
    ];

    return res.status(200).json({
      recommendations,
      timestamp: new Date().toISOString(),
      source: 'simple_get_endpoint',
      query: query,
      success: true,
    });
  } catch (error) {
    console.error('Simple recommendations error:', error);
    return res.status(500).json({
      message: 'Failed to get recommendations',
      error: error.message || 'Unknown error',
      timestamp: new Date().toISOString(),
    });
  }
}
