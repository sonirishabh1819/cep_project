const Listing = require('../models/Listing');

// Base prices by category (in USD)
const BASE_PRICES = {
  Textbooks: 45,
  Notes: 10,
  'Lab Equipment': 30,
  Stationery: 8,
  Electronics: 60,
  Other: 15,
};

// Condition multipliers
const CONDITION_MULT = {
  New: 1.0,
  'Like New': 0.85,
  Good: 0.65,
  Fair: 0.45,
  Poor: 0.25,
};

exports.suggestPrice = async (req, res) => {
  try {
    const { category, condition, subject, courseCode } = req.query;

    const basePrice = BASE_PRICES[category] || 20;
    const conditionMult = CONDITION_MULT[condition] || 0.5;

    // Check historical prices for similar items
    const filter = { category, status: 'sold' };
    if (subject) filter.subject = { $regex: subject, $options: 'i' };
    if (courseCode) filter.courseCode = { $regex: courseCode, $options: 'i' };

    const historicalListings = await Listing.find(filter).limit(20).select('price condition');

    let suggestedPrice;
    if (historicalListings.length >= 3) {
      const avgPrice = historicalListings.reduce((sum, l) => sum + l.price, 0) / historicalListings.length;
      suggestedPrice = Math.round(avgPrice * conditionMult);
    } else {
      suggestedPrice = Math.round(basePrice * conditionMult);
    }

    // Provide a range
    const low = Math.max(1, Math.round(suggestedPrice * 0.8));
    const high = Math.round(suggestedPrice * 1.2);

    res.json({
      suggested: suggestedPrice,
      range: { low, high },
      basedOn: historicalListings.length >= 3 ? 'historical' : 'heuristic',
      dataPoints: historicalListings.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRecommendations = async (req, res) => {
  try {
    const userId = req.user._id;
    const university = req.user.university;

    // Get user's recent views/purchases to understand interests
    const userListings = await Listing.find({ seller: userId }).select('category subject');
    const categories = [...new Set(userListings.map((l) => l.category))];
    const subjects = [...new Set(userListings.map((l) => l.subject).filter(Boolean))];

    const filter = {
      status: 'available',
      seller: { $ne: userId },
    };

    // Prefer same university
    if (university) {
      filter.university = { $regex: university, $options: 'i' };
    }

    let recommendations;

    if (categories.length > 0 || subjects.length > 0) {
      // Content-based: find items matching user's categories/subjects
      const orConditions = [];
      if (categories.length > 0) orConditions.push({ category: { $in: categories } });
      if (subjects.length > 0) orConditions.push({ subject: { $in: subjects } });
      filter.$or = orConditions;

      recommendations = await Listing.find(filter)
        .sort({ createdAt: -1 })
        .limit(12)
        .populate('seller', 'name profilePicture reputationScore');
    } else {
      // No history — show trending (most viewed recent items)
      recommendations = await Listing.find({ status: 'available', seller: { $ne: userId } })
        .sort({ views: -1, createdAt: -1 })
        .limit(12)
        .populate('seller', 'name profilePicture reputationScore');
    }

    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
