// Simplified profile setup endpoint without external dependencies
module.exports = async (req, res) => {


  // CORS headers for all requests
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
    // Authentication check
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: "No valid authorization token" });
    }

    const token = authHeader.replace('Bearer ', '');
    let userId;

    // For testing, accept any token and use a test user ID
    userId = 'user_' + Date.now();

    // Extract profile data from request
    const { dateOfBirth, wineExperienceLevel, preferredWineTypes, budgetRange, location } = req.body;
    
    // Age validation (must be 18+)
    if (dateOfBirth) {
      const birthDate = new Date(dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      if (age < 18) {
        return res.status(400).json({ message: "You must be 18 or older to use cork" });
      }
    }

    // Simulate successful profile update
    const updatedUser = {
      id: userId,
      dateOfBirth,
      wineExperienceLevel,
      preferredWineTypes,
      budgetRange,
      location,
      profileCompleted: true,
      updatedAt: new Date().toISOString()
    };

    res.status(200).json({ 
      message: "Profile setup completed successfully",
      user: updatedUser
    });

  } catch (error) {
    console.error("Profile setup error:", error);
    res.status(500).json({ 
      message: "Failed to set up profile", 
      error: error.message || "Unknown error"
    });
  }
};