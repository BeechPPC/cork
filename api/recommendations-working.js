// Minimal serverless function with no external dependencies
export default function handler(req, res) {
  // Basic CORS and caching headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const body = req.body;
    const query = body && body.query ? body.query : 'Australian wines';
    
    // Authentic Australian wine recommendations
    const recommendations = [
      {
        name: "Penfolds Grange Shiraz",
        type: "Shiraz", 
        region: "Barossa Valley, SA",
        vintage: "2018",
        description: "Australia's most iconic wine. Complex layers of dark fruit, chocolate, and spice with exceptional aging potential. Crafted from premium Barossa Valley vineyards.",
        priceRange: "$600-700",
        abv: "14.5%",
        rating: "98/100",
        matchReason: "The pinnacle of Australian winemaking, representing the country's finest Shiraz tradition"
      },
      {
        name: "Henschke Mount Edelstone Shiraz",
        type: "Shiraz",
        region: "Eden Valley, SA", 
        vintage: "2019",
        description: "Single-vineyard Shiraz from 100+ year old vines. Elegant structure with intense fruit concentration and mineral complexity from ancient soils.",
        priceRange: "$180-220",
        abv: "14.0%",
        rating: "95/100",
        matchReason: "Premium Eden Valley Shiraz showcasing the elegance and power of old-vine fruit"
      },
      {
        name: "Leeuwin Estate Art Series Chardonnay",
        type: "Chardonnay",
        region: "Margaret River, WA",
        vintage: "2020", 
        description: "Exceptional Margaret River Chardonnay with perfect balance of fruit, oak, and acidity. Stone fruit flavors with subtle vanilla and mineral notes.",
        priceRange: "$65-85",
        abv: "13.0%",
        rating: "94/100",
        matchReason: "Australia's premier Chardonnay from the renowned Margaret River wine region"
      }
    ];

    return res.status(200).json({
      recommendations,
      timestamp: new Date().toISOString(),
      source: 'working_function',
      query: query,
      success: true
    });

  } catch (error) {
    return res.status(500).json({
      message: 'Internal server error',
      timestamp: new Date().toISOString()
    });
  }
}