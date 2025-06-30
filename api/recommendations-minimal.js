// Minimal recommendations endpoint - matches health endpoint format
export default function handler(req, res) {
  res.json({
    recommendations: [
      {
        name: 'Penfolds Bin 389 Cabernet Shiraz',
        type: 'Cabernet Shiraz',
        region: 'Barossa Valley, SA',
        vintage: '2020',
        description:
          'A powerful blend combining the structure of Cabernet Sauvignon with the richness of Shiraz.',
        priceRange: '$65-75',
        abv: '14.5%',
        rating: '94/100',
        matchReason: 'Classic Australian premium red wine',
      },
    ],
    timestamp: new Date().toISOString(),
    source: 'minimal_endpoint',
    query: req.body?.query || 'Australian wines',
    success: true,
  });
}
