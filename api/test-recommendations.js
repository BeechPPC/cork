export default async function handler(req, res) {
  try {
    console.log("Test recommendations handler called");
    
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method not allowed' });
    }

    // Return hardcoded Australian wine recommendations
    const mockRecommendations = [
      {
        name: "Penfolds Bin 389 Cabernet Shiraz",
        type: "Cabernet Shiraz",
        region: "Barossa Valley, SA",
        vintage: "2020",
        description: "A powerful blend combining the structure of Cabernet Sauvignon with the richness of Shiraz. Dark berry fruits, chocolate, and spice with firm tannins.",
        priceRange: "$65-75",
        abv: "14.5%",
        rating: "94/100",
        matchReason: "Perfect for red wine lovers seeking premium Australian quality"
      },
      {
        name: "Wolf Blass Black Label Shiraz",
        type: "Shiraz",
        region: "McLaren Vale, SA", 
        vintage: "2019",
        description: "Rich, full-bodied Shiraz with intense blackberry flavors, vanilla oak, and soft tannins. A classic Australian style.",
        priceRange: "$45-55",
        abv: "14.0%",
        rating: "92/100",
        matchReason: "Excellent representation of Australian Shiraz craftsmanship"
      },
      {
        name: "Wynns Coonawarra Estate Black Label Cabernet",
        type: "Cabernet Sauvignon",
        region: "Coonawarra, SA",
        vintage: "2018",
        description: "Elegant Cabernet with cassis, mint, and eucalyptus notes. Structured tannins with excellent aging potential.",
        priceRange: "$55-65",
        abv: "13.5%",
        rating: "93/100",
        matchReason: "Premium Australian Cabernet from renowned Coonawarra region"
      }
    ];

    console.log("Returning mock recommendations");
    res.status(200).json({ recommendations: mockRecommendations });
    
  } catch (error) {
    console.error("Test recommendations error:", error);
    res.status(500).json({ 
      message: "Failed to get recommendations",
      error: error.message 
    });
  }
}