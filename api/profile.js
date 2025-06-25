module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    return res.status(200).json({ 
      success: true, 
      message: 'Profile setup completed successfully',
      profileCompleted: true,
      user: {
        id: 'user_' + Date.now(),
        profileCompleted: true,
        dateOfBirth: req.body?.dateOfBirth,
        wineExperienceLevel: req.body?.wineExperienceLevel,
        preferredWineTypes: req.body?.preferredWineTypes,
        budgetRange: req.body?.budgetRange,
        location: req.body?.location
      }
    });
  }

  return res.status(200).json({ message: 'Profile endpoint ready' });
};