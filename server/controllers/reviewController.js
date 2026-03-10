const Review = require('../models/Review');
const User = require('../models/User');

exports.createReview = async (req, res) => {
  try {
    const { revieweeId, listingId, rating, comment } = req.body;

    if (revieweeId === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot review yourself' });
    }

    const existing = await Review.findOne({
      reviewer: req.user._id,
      reviewee: revieweeId,
      listing: listingId,
    });

    if (existing) {
      return res.status(400).json({ message: 'You already reviewed this transaction' });
    }

    const review = await Review.create({
      reviewer: req.user._id,
      reviewee: revieweeId,
      listing: listingId,
      rating: Number(rating),
      comment: comment || '',
    });

    // Update reputation score
    const reviews = await Review.find({ reviewee: revieweeId });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await User.findByIdAndUpdate(revieweeId, {
      reputationScore: Math.round(avgRating * 10) / 10,
      totalTransactions: reviews.length,
    });

    await review.populate('reviewer', 'name profilePicture');
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ reviewee: req.params.userId })
      .populate('reviewer', 'name profilePicture')
      .populate('listing', 'title')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
