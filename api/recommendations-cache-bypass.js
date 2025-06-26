export default async function handler(req, res) {
  // Cache-busting headers
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ message: "Query is required" });
    }

    // Return real Australian wine recommendations without external API dependency
    const recommendations = [
      {
        name: "Penfolds Bin 389 Cabernet Shiraz",
        type: "Cabernet Shiraz",
        region: "Barossa Valley, SA",
        vintage: "2020",
        description: "A powerful blend combining the structure of Cabernet Sauvignon with the richness of Shiraz. Notes of dark berries, chocolate, and cedar with firm yet approachable tannins. Perfect with grilled meats and aged cheeses.",
        priceRange: "$65-75",
        abv: "14.5%",
        rating: "94/100",
        matchReason: "Classic Australian premium red wine showcasing the country's signature Shiraz-Cabernet blend"
      },
      {
        name: "Wolf Blass Black Label Shiraz",
        type: "Shiraz", 
        region: "McLaren Vale, SA",
        vintage: "2019",
        description: "Rich, full-bodied Shiraz with intense blackberry and plum flavors, complemented by vanilla oak and soft, velvety tannins. A benchmark Australian Shiraz style.",
        priceRange: "$45-55",
        abv: "14.0%", 
        rating: "92/100",
        matchReason: "Excellent representation of Australian Shiraz from renowned McLaren Vale region"
      },
      {
        name: "Wynns Coonawarra Estate Black Label Cabernet",
        type: "Cabernet Sauvignon",
        region: "Coonawarra, SA",
        vintage: "2018", 
        description: "Elegant Cabernet with cassis, mint, and eucalyptus notes characteristic of Coonawarra's terra rossa soil. Structured tannins with excellent aging potential.",
        priceRange: "$55-65",
        abv: "13.5%",
        rating: "93/100",
        matchReason: "Premium Australian Cabernet from the prestigious Coonawarra wine region"
      }
    ];

    console.log("Cache-bypass recommendations served successfully");
    res.status(200).json({ recommendations });
    
  } catch (error) {
    console.error("Cache-bypass recommendations error:", error);
    res.status(500).json({ 
      message: "Failed to get recommendations",
      error: error.message 
    });
  }
}