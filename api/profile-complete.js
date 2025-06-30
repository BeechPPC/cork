// Ultra-minimal profile completion endpoint
exports.default = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No valid authorization token' });
  }

  const {
    dateOfBirth,
    wineExperienceLevel,
    preferredWineTypes,
    budgetRange,
    location,
  } = req.body || {};

  if (dateOfBirth) {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    if (age < 18) {
      return res
        .status(400)
        .json({ message: 'You must be 18 or older to use cork' });
    }
  }

  const userId = 'user_' + Date.now();
  const updatedUser = {
    id: userId,
    email: 'user@getcork.app',
    name: 'Cork User',
    dateOfBirth,
    wineExperienceLevel,
    preferredWineTypes,
    budgetRange,
    location,
    profileCompleted: true,
    subscriptionPlan: 'free',
  };

  return res.status(200).json({
    message: 'Profile setup completed successfully',
    user: updatedUser,
  });
};
