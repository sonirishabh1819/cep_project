const Listing = require('../models/Listing');

exports.createListing = async (req, res) => {
  try {
    const { title, description, category, subject, courseCode, condition, price, isDonation, location, university, author, dropPoint } = req.body;

    const images = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        images.push({
          url: file.path || `/uploads/${file.filename}`,
          publicId: file.filename || file.public_id || '',
        });
      }
    }

    const listing = await Listing.create({
      title,
      description,
      category,
      subject: subject || '',
      courseCode: courseCode || '',
      condition,
      price: isDonation === 'true' || isDonation === true ? 0 : Number(price) || 0,
      isDonation: isDonation === 'true' || isDonation === true,
      images,
      location: location || req.user.location || '',
      university: university || req.user.university || '',
      dropPoint: dropPoint || '',
      seller: req.user._id,
      author: author || '',
    });

    await listing.populate('seller', 'name email profilePicture university reputationScore');
    res.status(201).json(listing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getListings = async (req, res) => {
  try {
    const { category, subject, minPrice, maxPrice, condition, university, isDonation, status, search, sort, page = 1, limit = 20 } = req.query;

    const filter = { status: status || 'available' };

    if (category) filter.category = category;
    if (subject) filter.subject = { $regex: subject, $options: 'i' };
    if (condition) filter.condition = condition;
    if (university) filter.university = { $regex: university, $options: 'i' };
    if (isDonation === 'true') filter.isDonation = true;

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (search) {
      filter.$text = { $search: search };
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    if (sort === 'price_desc') sortOption = { price: -1 };
    if (sort === 'oldest') sortOption = { createdAt: 1 };
    if (search) sortOption = { score: { $meta: 'textScore' }, ...sortOption };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Listing.countDocuments(filter);

    let query = Listing.find(filter);
    if (search) query = query.select({ score: { $meta: 'textScore' } });
    
    const listings = await query
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit))
      .populate('seller', 'name email profilePicture university reputationScore');

    res.json({
      listings,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate('seller', 'name email profilePicture university reputationScore bio totalTransactions');

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    listing.views += 1;
    await listing.save();

    res.json(listing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    if (listing.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this listing' });
    }

    const updates = req.body;
    Object.keys(updates).forEach((key) => {
      if (key !== 'seller' && key !== '_id') {
        listing[key] = updates[key];
      }
    });

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => ({
        url: file.path || `/uploads/${file.filename}`,
        publicId: file.filename || file.public_id || '',
      }));
      listing.images = [...listing.images, ...newImages];
    }

    await listing.save();
    await listing.populate('seller', 'name email profilePicture university reputationScore');

    res.json(listing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    if (listing.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this listing' });
    }

    await Listing.findByIdAndDelete(req.params.id);
    res.json({ message: 'Listing removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.markAsSold = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    if (listing.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    listing.status = 'sold';
    await listing.save();

    res.json(listing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyListings = async (req, res) => {
  try {
    const listings = await Listing.find({ seller: req.user._id })
      .sort({ createdAt: -1 })
      .populate('seller', 'name email profilePicture university reputationScore');

    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
