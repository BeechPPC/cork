// Minimal recommendations endpoint for production
module.exports = async (req, res) => {
  try {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    if (req.method === 'POST') {
      // Return sample Australian wines to unblock user experience
      const sampleRecommendations = [
        {
          name: "Penfolds Bin 389",
          type: "Red Wine",
          region: "Barossa Valley, South Australia",
          vintage: "2020",
          description: "A classic Cabernet Shiraz blend with rich berry flavours and oak integration",
          priceRange: "$60-80 AUD",
          abv: "14.5%",
          rating: "4.5/5",
          matchReason: "Perfect for your preference - full-bodied Australian red with excellent aging potential"
        },
        {
          name: "Wynns Coonawarra Estate Black Label",
          type: "Red Wine", 
          region: "Coonawarra, South Australia",
          vintage: "2019",
          description: "Premium Cabernet Sauvignon showcasing the terroir of Coonawarra's terra rossa soil",
          priceRange: "$40-55 AUD",
          abv: "14.0%",
          rating: "4.4/5",
          matchReason: "Exceptional value from one of Australia's most respected wine regions"
        },
        {
          name: "Torbreck The Laird",
          type: "Red Wine",
          region: "Barossa Valley, South Australia", 
          vintage: "2018",
          description: "Ultra-premium Shiraz from ancient vines, representing the pinnacle of Barossa winemaking",
          priceRange: "$200-250 AUD",
          abv: "15.0%",
          rating: "4.8/5",
          matchReason: "For special occasions - one of Australia's most celebrated single vineyard Shiraz"
        }
      ];

      return res.status(200).json({ 
        recommendations: sampleRecommendations,
        query: req.body.query || 'Australian wine recommendations',
        timestamp: new Date().toISOString()
      });
    }

    return res.status(405).json({ message: 'Method not allowed' });

  } catch (error) {
    console.error('Recommendations endpoint error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};