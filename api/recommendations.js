// Intelligent recommendations endpoint - returns different wines based on query
export default function handler(req, res) {
  const query = req.body?.query || 'Australian wines';

  // Return different recommendations based on query
  let recommendations = [];

  if (
    query.toLowerCase().includes('white') ||
    query.toLowerCase().includes('chardonnay') ||
    query.toLowerCase().includes('sauvignon')
  ) {
    recommendations = [
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
          "Perfect match for your white wine request - Australia's premier Chardonnay",
      },
      {
        name: 'Shaw + Smith Sauvignon Blanc',
        type: 'Sauvignon Blanc',
        region: 'Adelaide Hills, SA',
        vintage: '2023',
        description:
          'Crisp and aromatic Sauvignon Blanc with tropical fruit notes, citrus zest, and a refreshing finish.',
        priceRange: '$25-35',
        abv: '12.5%',
        rating: '91/100',
        matchReason:
          'Excellent white wine choice with bright, refreshing character',
      },
      {
        name: 'Grosset Polish Hill Riesling',
        type: 'Riesling',
        region: 'Clare Valley, SA',
        vintage: '2022',
        description:
          'Classic Clare Valley Riesling with intense lime and citrus flavors, crisp acidity, and excellent aging potential.',
        priceRange: '$40-50',
        abv: '12.0%',
        rating: '93/100',
        matchReason:
          'Premium Australian Riesling perfect for white wine lovers',
      },
    ];
  } else if (
    query.toLowerCase().includes('red') ||
    query.toLowerCase().includes('shiraz') ||
    query.toLowerCase().includes('cabernet')
  ) {
    recommendations = [
      {
        name: 'Penfolds Grange Shiraz',
        type: 'Shiraz',
        region: 'Barossa Valley, SA',
        vintage: '2018',
        description:
          "Australia's most iconic wine. Complex layers of dark fruit, chocolate, and spice with exceptional aging potential. Crafted from premium Barossa Valley vineyards.",
        priceRange: '$600-700',
        abv: '14.5%',
        rating: '98/100',
        matchReason:
          'The pinnacle of Australian red winemaking, perfect for your red wine request',
      },
      {
        name: 'Henschke Mount Edelstone Shiraz',
        type: 'Shiraz',
        region: 'Eden Valley, SA',
        vintage: '2019',
        description:
          'Single-vineyard Shiraz from 100+ year old vines. Elegant structure with intense fruit concentration and mineral complexity from ancient soils.',
        priceRange: '$180-220',
        abv: '14.0%',
        rating: '95/100',
        matchReason:
          'Premium Eden Valley Shiraz showcasing the elegance and power of old-vine fruit',
      },
      {
        name: 'Wynns Coonawarra Estate Cabernet Sauvignon',
        type: 'Cabernet Sauvignon',
        region: 'Coonawarra, SA',
        vintage: '2020',
        description:
          'Classic Coonawarra Cabernet with blackcurrant, mint, and cedar notes. Structured tannins and long finish.',
        priceRange: '$35-45',
        abv: '13.5%',
        rating: '92/100',
        matchReason:
          'Excellent Australian Cabernet Sauvignon from the renowned Coonawarra region',
      },
    ];
  } else if (
    query.toLowerCase().includes('light') ||
    query.toLowerCase().includes('summer') ||
    query.toLowerCase().includes('refreshing')
  ) {
    recommendations = [
      {
        name: 'Pewsey Vale Eden Valley Riesling',
        type: 'Riesling',
        region: 'Eden Valley, SA',
        vintage: '2023',
        description:
          'Light and refreshing Riesling with citrus and floral notes. Perfect for summer drinking with crisp acidity.',
        priceRange: '$20-30',
        abv: '11.5%',
        rating: '90/100',
        matchReason: 'Perfect light and refreshing wine for summer',
      },
      {
        name: 'Yalumba Y Series Pinot Grigio',
        type: 'Pinot Grigio',
        region: 'South Australia',
        vintage: '2023',
        description:
          'Crisp and light Pinot Grigio with pear and citrus flavors. Easy-drinking and perfect for warm weather.',
        priceRange: '$15-25',
        abv: '12.0%',
        rating: '88/100',
        matchReason: 'Light and refreshing white wine ideal for summer',
      },
      {
        name: 'Tahbilk Marsanne',
        type: 'Marsanne',
        region: 'Nagambie Lakes, VIC',
        vintage: '2022',
        description:
          'Light-bodied white wine with honey and stone fruit notes. Unique Australian variety perfect for summer.',
        priceRange: '$18-28',
        abv: '12.5%',
        rating: '89/100',
        matchReason:
          'Light and unique Australian white wine perfect for refreshing summer drinking',
      },
    ];
  } else {
    // Default recommendations for general queries
    recommendations = [
      {
        name: 'Penfolds Bin 389 Cabernet Shiraz',
        type: 'Cabernet Shiraz',
        region: 'Barossa Valley, SA',
        vintage: '2020',
        description:
          'A powerful blend combining the structure of Cabernet Sauvignon with the richness of Shiraz. Notes of dark berries, chocolate, and cedar.',
        priceRange: '$65-75',
        abv: '14.5%',
        rating: '94/100',
        matchReason:
          "Classic Australian premium red wine showcasing the country's signature blend",
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
          'Excellent representation of Australian Shiraz craftsmanship',
      },
      {
        name: 'Leeuwin Estate Art Series Chardonnay',
        type: 'Chardonnay',
        region: 'Margaret River, WA',
        vintage: '2020',
        description:
          'Exceptional Margaret River Chardonnay with perfect balance of fruit, oak, and acidity. Stone fruit flavors with subtle vanilla notes.',
        priceRange: '$65-85',
        abv: '13.0%',
        rating: '94/100',
        matchReason:
          "Australia's premier Chardonnay from the renowned Margaret River region",
      },
    ];
  }

  res.json({
    recommendations,
    timestamp: new Date().toISOString(),
    source: 'intelligent_endpoint',
    query: query,
    success: true,
  });
}
